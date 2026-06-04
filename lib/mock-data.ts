/**
 * Realistic mock data for Phase 3 admin UI.
 * TODO Phase 3 DB: replace each export with a Prisma query wrapped in a server action or tRPC procedure.
 */

export type AppStatus =
  | "APPOINTMENT_SCHEDULED"
  | "ARRIVED"
  | "BIOMETRICS_CAPTURED"
  | "NIN_PROCESSING"
  | "NIN_ISSUED"
  | "NO_SHOW"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "VERIFIED";

export interface MockApplication {
  id: string;
  applicationRef: string;
  status: AppStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentReference?: string;
  guest: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    noShowCount: number;
  };
  appointment: {
    slotStart: string; // ISO
    slotEnd: string;
    arrivedAt?: string;
  } | null;
  officer?: string;
  createdAt: string;
  notes?: string;
}

const today = new Date();
function daysFromNow(n: number, h = 10, m = 0) {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export const MOCK_APPLICATIONS: MockApplication[] = [
  {
    id: "app-001",
    applicationRef: "KSQ-BPT-20260604-0001",
    status: "APPOINTMENT_SCHEDULED",
    paymentStatus: "VERIFIED",
    paymentMethod: "E_TRANSFER",
    paymentReference: "ET-20260601-112",
    guest: { id: "g-001", firstName: "Adaeze", lastName: "Okonkwo", email: "adaeze@example.com", phone: "+1 416 555 0101", noShowCount: 0 },
    appointment: { slotStart: daysFromNow(0, 9, 0), slotEnd: daysFromNow(0, 9, 30) },
    officer: "Enrollment Officer",
    createdAt: daysFromNow(-3),
  },
  {
    id: "app-002",
    applicationRef: "KSQ-BPT-20260604-0002",
    status: "APPOINTMENT_SCHEDULED",
    paymentStatus: "VERIFIED",
    paymentMethod: "CASH",
    guest: { id: "g-002", firstName: "Chukwuemeka", lastName: "Eze", email: "chukwu@example.com", phone: "+1 647 555 0202", noShowCount: 0 },
    appointment: { slotStart: daysFromNow(0, 9, 30), slotEnd: daysFromNow(0, 10, 0) },
    createdAt: daysFromNow(-2),
  },
  {
    id: "app-003",
    applicationRef: "KSQ-BPT-20260604-0003",
    status: "ARRIVED",
    paymentStatus: "VERIFIED",
    paymentMethod: "E_TRANSFER",
    guest: { id: "g-003", firstName: "Ngozi", lastName: "Adeyemi", email: "ngozi@example.com", phone: "+1 905 555 0303", noShowCount: 0 },
    appointment: { slotStart: daysFromNow(0, 10, 0), slotEnd: daysFromNow(0, 10, 30), arrivedAt: daysFromNow(0, 9, 58) },
    officer: "Enrollment Officer",
    createdAt: daysFromNow(-1),
  },
  {
    id: "app-004",
    applicationRef: "KSQ-BPT-20260604-0004",
    status: "BIOMETRICS_CAPTURED",
    paymentStatus: "VERIFIED",
    paymentMethod: "CASH",
    guest: { id: "g-004", firstName: "Olumide", lastName: "Balogun", email: "olumide@example.com", phone: "+1 416 555 0404", noShowCount: 0 },
    appointment: { slotStart: daysFromNow(0, 10, 30), slotEnd: daysFromNow(0, 11, 0), arrivedAt: daysFromNow(0, 10, 28) },
    officer: "Enrollment Officer",
    createdAt: daysFromNow(-2),
  },
  {
    id: "app-005",
    applicationRef: "KSQ-BPT-20260605-0001",
    status: "APPOINTMENT_SCHEDULED",
    paymentStatus: "PENDING",
    guest: { id: "g-005", firstName: "Funmilayo", lastName: "Oduya", email: "funmi@example.com", phone: "+1 647 555 0505", noShowCount: 0 },
    appointment: { slotStart: daysFromNow(1, 9, 0), slotEnd: daysFromNow(1, 9, 30) },
    createdAt: daysFromNow(-1),
  },
  {
    id: "app-006",
    applicationRef: "KSQ-BPT-20260605-0002",
    status: "APPOINTMENT_SCHEDULED",
    paymentStatus: "VERIFIED",
    paymentMethod: "E_TRANSFER",
    guest: { id: "g-006", firstName: "Babatunde", lastName: "Fashola", email: "baba@example.com", phone: "+1 905 555 0606", noShowCount: 1 },
    appointment: { slotStart: daysFromNow(1, 11, 0), slotEnd: daysFromNow(1, 11, 30) },
    createdAt: daysFromNow(-4),
    notes: "Previously rescheduled from May 28",
  },
  {
    id: "app-007",
    applicationRef: "KSQ-BPT-20260603-0003",
    status: "NIN_ISSUED",
    paymentStatus: "VERIFIED",
    paymentMethod: "CASH",
    guest: { id: "g-007", firstName: "Ifeoma", lastName: "Nwosu", email: "ifeoma@example.com", phone: "+1 416 555 0707", noShowCount: 0 },
    appointment: { slotStart: daysFromNow(-1, 14, 0), slotEnd: daysFromNow(-1, 14, 30), arrivedAt: daysFromNow(-1, 13, 55) },
    officer: "Enrollment Officer",
    createdAt: daysFromNow(-5),
  },
  {
    id: "app-008",
    applicationRef: "KSQ-BPT-20260602-0001",
    status: "NO_SHOW",
    paymentStatus: "VERIFIED",
    paymentMethod: "E_TRANSFER",
    guest: { id: "g-008", firstName: "Emeka", lastName: "Obi", email: "emeka@example.com", phone: "+1 647 555 0808", noShowCount: 1 },
    appointment: { slotStart: daysFromNow(-2, 11, 30), slotEnd: daysFromNow(-2, 12, 0) },
    createdAt: daysFromNow(-7),
  },
  {
    id: "app-009",
    applicationRef: "KSQ-BPT-20260604-0005",
    status: "APPOINTMENT_SCHEDULED",
    paymentStatus: "VERIFIED",
    paymentMethod: "CASH",
    guest: { id: "g-009", firstName: "Amaka", lastName: "Igwe", email: "amaka@example.com", phone: "+1 905 555 0909", noShowCount: 0 },
    appointment: { slotStart: daysFromNow(0, 14, 0), slotEnd: daysFromNow(0, 14, 30) },
    createdAt: daysFromNow(-1),
  },
  {
    id: "app-010",
    applicationRef: "KSQ-BPT-20260606-0001",
    status: "APPOINTMENT_SCHEDULED",
    paymentStatus: "PENDING",
    guest: { id: "g-010", firstName: "Taiwo", lastName: "Akinwale", email: "taiwo@example.com", phone: "+1 416 555 1010", noShowCount: 0 },
    appointment: { slotStart: daysFromNow(2, 9, 30), slotEnd: daysFromNow(2, 10, 0) },
    createdAt: daysFromNow(0),
    notes: "Requires form assistance — mentioned in booking notes",
  },
];

export const MOCK_STATS = {
  todayAppointments: MOCK_APPLICATIONS.filter(a => {
    if (!a.appointment) return false;
    const slot = new Date(a.appointment.slotStart);
    return slot.toDateString() === today.toDateString();
  }).length,
  thisMonthApplications: MOCK_APPLICATIONS.filter(a => {
    const created = new Date(a.createdAt);
    return created.getMonth() === today.getMonth() && created.getFullYear() === today.getFullYear();
  }).length,
  ninIssuedTotal: MOCK_APPLICATIONS.filter(a => a.status === "NIN_ISSUED").length,
  pendingPayments: MOCK_APPLICATIONS.filter(a => a.paymentStatus === "PENDING").length,
};

export const MOCK_ACTIVITY = [
  { id: 1, time: daysFromNow(0, 10, 32), action: "Biometrics captured", ref: "KSQ-BPT-20260604-0004", officer: "Enrollment Officer" },
  { id: 2, time: daysFromNow(0, 10, 3), action: "Guest checked in", ref: "KSQ-BPT-20260604-0003", officer: "Enrollment Officer" },
  { id: 3, time: daysFromNow(-1, 14, 45), action: "NIN issued", ref: "KSQ-BPT-20260603-0003", officer: "Enrollment Officer" },
  { id: 4, time: daysFromNow(-2, 11, 35), action: "Marked no-show", ref: "KSQ-BPT-20260602-0001", officer: "Enrollment Officer" },
  { id: 5, time: daysFromNow(-3, 9, 15), action: "Payment verified", ref: "KSQ-BPT-20260604-0001", officer: "Admin User" },
];

export const STATUS_LABELS: Record<AppStatus, string> = {
  APPOINTMENT_SCHEDULED: "Scheduled",
  ARRIVED: "Arrived",
  BIOMETRICS_CAPTURED: "Biometrics Done",
  NIN_PROCESSING: "Processing",
  NIN_ISSUED: "NIN Issued",
  NO_SHOW: "No Show",
  CANCELLED: "Cancelled",
};

export const STATUS_COLORS: Record<AppStatus, { bg: string; text: string; dot: string }> = {
  APPOINTMENT_SCHEDULED: { bg: "rgba(59,130,246,0.10)", text: "#2563eb", dot: "#3b82f6" },
  ARRIVED:               { bg: "rgba(16,185,129,0.10)", text: "#059669", dot: "#10b981" },
  BIOMETRICS_CAPTURED:   { bg: "rgba(16,185,129,0.15)", text: "#047857", dot: "#059669" },
  NIN_PROCESSING:        { bg: "rgba(245,158,11,0.10)", text: "#d97706", dot: "#f59e0b" },
  NIN_ISSUED:            { bg: "rgba(26,74,46,0.10)",   text: "var(--green)", dot: "var(--green)" },
  NO_SHOW:               { bg: "rgba(239,68,68,0.10)",  text: "#dc2626", dot: "#ef4444" },
  CANCELLED:             { bg: "rgba(107,114,128,0.10)","text": "#6b7280", dot: "#9ca3af" },
};
