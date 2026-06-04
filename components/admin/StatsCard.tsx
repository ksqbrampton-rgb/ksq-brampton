interface Props {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent?: "green" | "gold" | "blue" | "red";
}

const ACCENT_COLORS = {
  green: { bg: "rgba(26,74,46,0.08)", icon: "var(--green)" },
  gold:  { bg: "rgba(201,151,58,0.10)", icon: "var(--gold)" },
  blue:  { bg: "rgba(59,130,246,0.08)", icon: "#3b82f6" },
  red:   { bg: "rgba(239,68,68,0.08)", icon: "#ef4444" },
};

export default function StatsCard({ label, value, sub, icon, accent = "green" }: Props) {
  const colors = ACCENT_COLORS[accent];

  return (
    <div
      className="rounded-xl p-5 flex items-start gap-4"
      style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: colors.bg, color: colors.icon }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-body font-medium uppercase tracking-wide truncate" style={{ color: "var(--mid)" }}>
          {label}
        </p>
        <p
          className="font-heading font-bold mt-0.5"
          style={{ fontSize: "1.75rem", color: "var(--dark)", lineHeight: 1.1, fontFamily: "var(--font-cormorant)" }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs font-body mt-0.5" style={{ color: "var(--mid)" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
