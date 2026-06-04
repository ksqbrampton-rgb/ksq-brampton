import { NextResponse } from "next/server";
import { Webhook } from "svix";

/**
 * POST /api/webhooks/resend
 * Receives delivery status events from Resend.
 * Secured by RESEND_WEBHOOK_SECRET (Svix signature verification).
 *
 * Events handled:
 *   email.sent       → log delivery attempt
 *   email.delivered  → mark delivered
 *   email.bounced    → flag in EmailLog, alert
 *   email.opened     → record open timestamp
 *   email.clicked    → record click
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
  const emailId = data.email_id ?? "unknown";

  console.log(`[webhook/resend] Event: ${type} | ID: ${emailId}`);

  // TODO Phase DB: update EmailLog table based on event type
  // Example:
  // switch (type) {
  //   case "email.delivered":
  //     await db.emailLog.updateMany({ where: { resendId: emailId }, data: { deliveredAt: new Date() } });
  //     break;
  //   case "email.bounced":
  //     await db.emailLog.updateMany({ where: { resendId: emailId }, data: { bouncedAt: new Date(), failReason: "bounced" } });
  //     break;
  //   case "email.opened":
  //     await db.emailLog.updateMany({ where: { resendId: emailId }, data: { openedAt: new Date() } });
  //     break;
  // }

  switch (type) {
    case "email.sent":
      console.log(`[webhook/resend] ✓ Sent to: ${data.to?.join(", ")}`);
      break;
    case "email.delivered":
      console.log(`[webhook/resend] ✓ Delivered: ${emailId}`);
      break;
    case "email.bounced":
      console.error(`[webhook/resend] ✗ Bounced: ${emailId} — to: ${data.to?.join(", ")}`);
      break;
    case "email.opened":
      console.log(`[webhook/resend] ✓ Opened: ${emailId}`);
      break;
    default:
      console.log(`[webhook/resend] Unhandled event type: ${type}`);
  }
}
