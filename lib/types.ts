export type AppStatus =
  | "APPOINTMENT_SCHEDULED"
  | "ARRIVED"
  | "BIOMETRICS_CAPTURED"
  | "NIN_PROCESSING"
  | "NIN_ISSUED"
  | "NO_SHOW"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "VERIFIED";

export const STATUS_LABELS: Record<AppStatus, string> = {
  APPOINTMENT_SCHEDULED: "Scheduled",
  ARRIVED:               "Arrived",
  BIOMETRICS_CAPTURED:   "Biometrics Done",
  NIN_PROCESSING:        "Processing",
  NIN_ISSUED:            "NIN Issued",
  NO_SHOW:               "No Show",
  CANCELLED:             "Cancelled",
};

export const STATUS_COLORS: Record<AppStatus, { bg: string; text: string; dot: string }> = {
  APPOINTMENT_SCHEDULED: { bg: "rgba(59,130,246,0.10)",  text: "#2563eb",          dot: "#3b82f6"        },
  ARRIVED:               { bg: "rgba(16,185,129,0.10)",  text: "#059669",          dot: "#10b981"        },
  BIOMETRICS_CAPTURED:   { bg: "rgba(16,185,129,0.15)",  text: "#047857",          dot: "#059669"        },
  NIN_PROCESSING:        { bg: "rgba(245,158,11,0.10)",  text: "#d97706",          dot: "#f59e0b"        },
  NIN_ISSUED:            { bg: "rgba(26,74,46,0.10)",    text: "var(--green)",     dot: "var(--green)"   },
  NO_SHOW:               { bg: "rgba(239,68,68,0.10)",   text: "#dc2626",          dot: "#ef4444"        },
  CANCELLED:             { bg: "rgba(107,114,128,0.10)", text: "#6b7280",          dot: "#9ca3af"        },
};

// Application as returned by the API — matches Prisma shape
export interface AppRecord {
  id: string;
  applicationRef: string;
  status: AppStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string | null;
  paymentReference?: string | null;
  notes?: string | null;
  createdAt: string;
  guest: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    noShowCount: number;
  };
  appointment?: {
    id: string;
    slotStart: string;
    slotEnd: string;
    arrivedAt?: string | null;
    status: string;
  } | null;
  officer?: { firstName: string; lastName: string } | null;
}
