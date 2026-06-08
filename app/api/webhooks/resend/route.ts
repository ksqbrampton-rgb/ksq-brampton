import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/lib/db";

/**
 * POST /api/webhooks/resend
 * Receives delivery status events from Resend.
 * Secured by RESEND_WEBHOOK_SECRET (Svix signature verification).
 *
 * Matches each event to its EmailLog row by resendId and updates the
 * lifecycle timestamp. Every event also stamps lastEvent / lastEventAt.
 */
export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;

  // Verify signature if secret is configured
  if (secret) {
    const payload = await request.text();
    const headers = {
      "svix-id":        request.headers.get("svix-id") ?? "",
      "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
      "svix-signature": request.headers.get("svix-signature") ?? "",
    };

    try {
      const wh = new Webhook(secret);
      wh.verify(payload, headers);
    } catch (err) {
      console.error("[webhook/resend] Signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    // Parse after verification
    const event = JSON.parse(payload) as ResendWebhookEvent;
    await handleEvent(event);
  } else {
    // No secret configured — log but don't verify (dev mode)
    const event = (await request.json()) as ResendWebhookEvent;
    await handleEvent(event);
  }

  return NextResponse.json({ received: true });
}

interface ResendWebhookEvent {
  type: string;
  data: {
    email_id?: string;
    to?: string[];
    subject?: string;
    created_at?: string;
    [key: string]: unknown;
  };
}

async function handleEvent(event: ResendWebhookEvent) {
  const { type, data } = event;
  const emailId = data.email_id;

  console.log(`[webhook/resend] Event: ${type} | ID: ${emailId ?? "unknown"}`);

  if (!emailId) return; // inbound / domain / contact events — nothing to match

  const now = new Date();

  // Every event records the latest event on the matching row(s)
  await db.emailLog.updateMany({
    where: { resendId: emailId },
    data: { lastEvent: type, lastEventAt: now },
  });

  // Lifecycle timestamps are set once — the `: null` guard prevents a late or
  // duplicate event from overwriting an earlier one (events can arrive out of order)
  switch (type) {
    case "email.delivered":
      await db.emailLog.updateMany({ where: { resendId: emailId, deliveredAt: null }, data: { deliveredAt: now } });
      break;
    case "email.opened":
      await db.emailLog.updateMany({ where: { resendId: emailId, openedAt: null }, data: { openedAt: now } });
      break;
    case "email.bounced":
      await db.emailLog.updateMany({ where: { resendId: emailId, bouncedAt: null }, data: { bouncedAt: now, failReason: "bounced" } });
      break;
    case "email.failed":
      await db.emailLog.updateMany({ where: { resendId: emailId }, data: { failReason: "failed" } });
      break;
    default:
      break; // clicked / complained / delivery_delayed / scheduled / suppressed — captured above
  }
}
