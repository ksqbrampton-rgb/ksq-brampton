// One-off: clears all test guest/application data so the new required+unique
// emailHash column can be added cleanly. Keeps staff accounts and availability
// config (templates, exceptions, blocks). Run BEFORE `prisma db push`.
//
//   node --env-file=.env scripts/wipe-data.mjs
//
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

try {
  // Delete children first to respect foreign keys.
  const documents     = await db.document.deleteMany({});
  const statusHistory = await db.statusHistory.deleteMany({});
  const auditLogs     = await db.auditLog.deleteMany({});
  const emailLogs     = await db.emailLog.deleteMany({});
  const appointments  = await db.appointment.deleteMany({});
  const applications  = await db.application.deleteMany({});
  const guests        = await db.guest.deleteMany({});

  console.log("Wiped test data:");
  console.table({
    documents: documents.count,
    statusHistory: statusHistory.count,
    auditLogs: auditLogs.count,
    emailLogs: emailLogs.count,
    appointments: appointments.count,
    applications: applications.count,
    guests: guests.count,
  });
  console.log("Kept: staff accounts, availability templates, date exceptions, slot blocks, system settings.");
} catch (err) {
  console.error("Wipe failed:", err);
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
