import StatsCard from "@/components/admin/StatsCard";
import TodayQueue from "@/components/admin/TodayQueue";
import { MOCK_STATS, MOCK_ACTIVITY, STATUS_LABELS } from "@/lib/mock-data";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Today's Appointments"
          value={MOCK_STATS.todayAppointments}
          sub="scheduled for today"
          accent="blue"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          }
        />
        <StatsCard
          label="Applications (MTD)"
          value={MOCK_STATS.thisMonthApplications}
          sub="this month"
          accent="green"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          }
        />
        <StatsCard
          label="NIN Issued"
          value={MOCK_STATS.ninIssuedTotal}
          sub="total issued"
          accent="gold"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          }
        />
        <StatsCard
          label="Pending Payments"
          value={MOCK_STATS.pendingPayments}
          sub="awaiting verification"
          accent="red"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          }
        />
      </div>

      {/* Today's queue */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold" style={{ fontSize: "1.1rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>
            Today&apos;s Queue
          </h2>
          <a href="/admin/appointments" className="text-xs font-body" style={{ color: "var(--green)" }}>
            View all appointments →
          </a>
        </div>
        <TodayQueue />
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="font-heading font-semibold mb-3" style={{ fontSize: "1.1rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>
          Recent Activity
        </h2>
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}
        >
          {MOCK_ACTIVITY.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center gap-4 px-5 py-3.5"
              style={{ borderBottom: i < MOCK_ACTIVITY.length - 1 ? "1px solid rgba(26,74,46,0.05)" : "none" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(26,74,46,0.08)", color: "var(--green)" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body" style={{ color: "var(--dark)" }}>
                  <span className="font-medium">{item.action}</span>
                  {" · "}
                  <span style={{ color: "var(--mid)" }}>{item.ref}</span>
                </p>
                <p className="text-xs font-body" style={{ color: "var(--mid)" }}>
                  by {item.officer}
                </p>
              </div>
              <span className="text-xs font-body flex-shrink-0" style={{ color: "var(--mid)" }}>
                {timeAgo(item.time)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
