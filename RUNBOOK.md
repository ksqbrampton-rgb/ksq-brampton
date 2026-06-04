# Knowledge Square — Operations Runbook

**Platform:** ksqbrampton.ca  
**Stack:** Next.js 14 · Supabase · Vercel · Resend  
**Contact:** info@ksqbrampton.ca

---

## Table of Contents

1. [Deployment](#1-deployment)
2. [Environment Variables](#2-environment-variables)
3. [Daily Operations](#3-daily-operations)
4. [Managing Staff Accounts](#4-managing-staff-accounts)
5. [Managing Availability](#5-managing-availability)
6. [Handling No-Shows](#6-handling-no-shows)
7. [Handling a Cancelled Appointment](#7-handling-a-cancelled-appointment)
8. [Document Uploads](#8-document-uploads)
9. [Recording a NIN Issuance](#9-recording-a-nin-issuance)
10. [Database Backups](#10-database-backups)
11. [Emergency Contacts](#11-emergency-contacts)

---

## 1. Deployment

### Deploy to production (normal)
```bash
git add .
git commit -m "your message"
git push origin main
```
Vercel auto-deploys on every push to `main`. Monitor at: https://vercel.com/dashboard

### Roll back a deployment
1. Go to Vercel dashboard → your project → Deployments
2. Find the last working deployment
3. Click the three dots → **Promote to Production**

### Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

---

## 2. Environment Variables

All environment variables are set in **Vercel → Project → Settings → Environment Variables**.

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Supabase → Connect → Transaction pooler |
| `DATABASE_DIRECT_URL` | Supabase → Connect → Direct connection |
| `SUPABASE_URL` | Supabase → Project Settings → API |
| `SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://ksqbrampton.ca` |
| `RESEND_API_KEY` | Resend → API Keys |
| `EMAIL_FROM` | `info@ksqbrampton.ca` |
| `UPSTASH_REDIS_REST_URL` | Upstash → Database → REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash → Database → REST Token |
| `CRON_SECRET` | Generate: `openssl rand -base64 32` |

After adding or changing any variable, redeploy from the Vercel dashboard.

---

## 3. Daily Operations

### Morning check-in
1. Log in at https://ksqbrampton.ca/admin/login
2. Go to **Dashboard** — review today's queue
3. Confirm all scheduled guests have verified payments

### Checking in a guest
1. Dashboard → Today's Queue
2. Find the guest's row → click **Check In**
3. Status changes to **Arrived**

### Marking biometrics complete
1. Applications → find the application → click **View**
2. In the status panel → click **Biometrics Captured**
3. Guest receives an automatic email: "Your NIN is being processed"

### Marking a no-show
1. Dashboard or Appointments → find the row → click **No Show**
2. Guest receives an automatic no-show email with a rebook link

---

## 4. Managing Staff Accounts

### Invite a new staff member
1. Admin → **Staff** → **Invite Staff**
2. Enter name, email, role → click **Send Invite**
3. Staff member receives email with instructions to set password

### Deactivate a staff member
1. Admin → **Staff** → find the row → click **Deactivate**
2. Their session is invalidated immediately

### Change staff role
Currently requires a Super Admin to update directly in the database via Prisma Studio:
```bash
npx prisma studio
```
Navigate to `staff_users` table → find the record → update `role` field.

---

## 5. Managing Availability

### Open or close a day
1. Admin → **Availability**
2. Toggle the day switch on/off
3. Click **Save Changes**

### Add a closure (holiday, staff day off)
1. Admin → **Availability** → scroll to Date Exceptions
2. Enter the date, reason, check "Full closure"
3. Click **Add Exception** → **Save Changes**

### Add special hours for a date
1. Admin → **Availability** → Date Exceptions
2. Enter the date, reason, uncheck "Full closure"
3. Set custom open/close times → **Add Exception** → **Save Changes**

---

## 6. Handling No-Shows

1. Mark the appointment as **No Show** in the dashboard
2. The guest is automatically emailed a rebook link
3. The slot is freed for other bookings
4. If the guest had paid, payment status remains — contact the guest directly to arrange

---

## 7. Handling a Cancelled Appointment

### Staff-initiated cancellation
1. Applications → find the application → click **View**
2. In the status panel → click **Cancel**
3. Guest is automatically emailed a cancellation notice with rebook link

### Guest requests cancellation by email
1. Locate their application in Applications (search by email or reference)
2. Cancel as above

---

## 8. Document Uploads

Documents are uploaded by staff at the time of appointment:

1. Applications → find the application → click **View**
2. Scroll to the **Documents** section
3. Select document type from the dropdown
4. Drag and drop (or click to browse) the scanned file (PDF, JPG, PNG, max 10 MB)
5. Click **Upload Document**
6. Once uploaded, review and click **✓ Approve** or **✗ Reject**

Documents are stored in Supabase Storage (private bucket: `nin-brampton-documents`).

---

## 9. Recording a NIN Issuance

When NIMC confirms a NIN has been issued:

1. Applications → find the application → click **View**
2. Scroll to **NIN Issuance** panel
3. Enter the 11-digit NIN number
4. Click **Mark NIN Issued**
5. Guest is automatically emailed collection instructions

---

## 10. Database Backups

Supabase automatically backs up the database daily on the free tier (7-day retention).

To manually export data:
1. Admin → **Reports** → click **CSV** on any report section
2. Or use Prisma Studio: `npx prisma studio`

To restore from a backup:
1. Supabase dashboard → **Database** → **Backups**
2. Select the backup point → **Restore**

---

## 11. Emergency Contacts

| Role | Contact |
|---|---|
| Platform issues | Check Vercel status: https://vercel-status.com |
| Database issues | Check Supabase status: https://status.supabase.com |
| Email delivery issues | Check Resend status: https://resend-status.com |
| Developer | Ade — via agreed contact method |
| Center email | info@ksqbrampton.ca |

---

*Last updated: June 2026 · Knowledge Square NIN Enrollment Center*
