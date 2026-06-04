import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendReminder48h, sendReminder2h } from "@/lib/email";
import { formatSlotTime } from "@/lib/slots";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
function formatDateDisplay(date: Date): string {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return `${days[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * GET /api/cron/reminders
 * Called by Vercel Cron every 30 minutes.
 * Secured by CRON_SECRET header.
 */
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Window for 48h reminder: between 47h and 49h from now
  const window48hStart = new Date(now.getTime() + 47 * 60 * 60 * 1000);
  const window48hEnd   = new Date(now.getTime() + 49 * 60 * 60 * 1000);

  // Window for 2h reminder: between 1h50m and 2h10m from now
  const window2hStart  = new Date(now.getTime() + 110 * 60 * 1000);
  const window2hEnd    = new Date(now.getTime() + 130 * 60 * 1000);

  let sent48h = 0;
  let sent2h  = 0;

  try {
    // ── 48h reminders ──────────────────────────────────────
    const upcoming48h = await db.appointment.findMany({
      where: {
        slotStart: { gte: window48hStart, lte: window48hEnd },
        status: "SCHEDULED",
        reminder48hSentAt: null,
      },
      include: {
        application: { include: { guest: true } },
      },
    });

    for (const appt of upcoming48h) {
      const { guest } = appt.application;
      try {
        await sendReminder48h({
          to: guest.email,
          guestName: `${guest.firstName} ${guest.lastName}`,
          applicationRef: appt.application.applicationRef,
          appointmentDate: formatDateDisplay(appt.slotStart),
          appointmentTime: formatSlotTime(appt.slotStart.toISOString()),
        });
        await db.appointment.update({
          where: { id: appt.id },
          data: { reminder48hSentAt: now },
        });
        sent48h++;
      } catch (err) {
        console.error(`[cron] 48h reminder failed for appointment ${appt.id}:`, err);
      }
    }

    // ── 2h reminders ───────────────────────────────────────
    const upcoming2h = await db.appointment.findMany({
      where: {
        slotStart: { gte: window2hStart, lte: window2hEnd },
        status: "SCHEDULED",
        reminder2hSentAt: null,
      },
      include: {
        application: { include: { guest: true } },
      },
    });

    for (const appt of upcoming2h) {
      const { guest } = appt.application;
      try {
        await sendReminder2h({
          to: guest.email,
          guestName: `${guest.firstName} ${guest.lastName}`,
          applicationRef: appt.application.applicationRef,
          appointmentDate: formatDateDisplay(appt.slotStart),
          appointmentTime: formatSlotTime(appt.slotStart.toISOString()),
        });
        await db.appointment.update({
          where: { id: appt.id },
          data: { reminder2hSentAt: now },
        });
        sent2h++;
      } catch (err) {
        console.error(`[cron] 2h reminder failed for appointment ${appt.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      sent48h,
      sent2h,
      checkedAt: now.toISOString(),
    });
  } catch (err) {
    console.error("[cron/reminders] Fatal error:", err);
    return NextResponse.json({ error: "Cron job failed." }, { status: 500 });
  }
}
