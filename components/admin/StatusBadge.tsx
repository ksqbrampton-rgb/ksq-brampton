import { STATUS_LABELS, STATUS_COLORS, type AppStatus } from "@/lib/types";

interface Props {
  status: AppStatus;
  size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: Props) {
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS.CANCELLED;
  const label  = STATUS_LABELS[status]  ?? status;

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full font-body font-medium whitespace-nowrap"
      style={{
        background: colors.bg,
        color: colors.text,
        padding: size === "sm" ? "2px 8px" : "4px 10px",
        fontSize: size === "sm" ? "0.7rem" : "0.75rem",
      }}
    >
      <span className="rounded-full flex-shrink-0" style={{ background: colors.dot, width: size === "sm" ? "5px" : "6px", height: size === "sm" ? "5px" : "6px" }} />
      {label}
    </span>
  );
}
