"use client";

import { useState, useEffect } from "react";
import { EnrollmentFunnelChart, WeeklyBookingsChart, ShowRateChart } from "@/components/admin/ReportsCharts";
import { downloadCsv } from "@/lib/export";
import { STATUS_LABELS, type AppStatus } from "@/lib/types";

const DATE_RANGES = ["This Week", "This Month", "This Quarter", "This Year"] as const;
type DateRange = typeof DATE_RANGES[number];

interface ReportData {
  funnelData:       { status: string; count: number }[];
  weeklyData:       { week: string; bookings: number }[];
  showData:         { name: string; value: number; color: string }[];
  revenue:          { thisMonth: number; thisYear: number; pending: number };
  officerStats:     { name: string; processed: number; avgDays: number; noShowRate: string }[];
  statusBreakdown:  { status: string; count: number }[];
  totalApplications: number;
}

function ChartCard({ title, subtitle, onExport, children }: { title: string; subtitle?: string; onExport?: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading font-semibold" style={{ fontSize: "1rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>{title}</h3>
          {subtitle && <p className="text-xs font-body mt-0.5" style={{ color: "var(--mid)" }}>{subtitle}</p>}
        </div>
        {onExport && (
          <button onClick={onExport} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-body font-medium" style={{ background: "rgba(26,74,46,0.06)", color: "var(--green)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            CSV
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

export default function ReportsPage() {
  const [range, setRange] = useState<DateRange>("This Month");
  const [data, setData]   = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/data/reports?range=${encodeURIComponent(range)}`)
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [range]);

  function exportStatusBreakdown() {
    if (!data) return;
    downloadCsv(
      data.statusBreakdown,
      [
        { header: "Status",  accessor: r => STATUS_LABELS[r.status as AppStatus] ?? r.status },
        { header: "Count",   accessor: r => r.count },
      ],
      `ksq-status-breakdown-${new Date().toISOString().slice(0, 10)}.csv`
    );
  }

  function exportOfficers() {
    if (!data) return;
    downloadCsv(
      data.officerStats,
      [
        { header: "Officer",      accessor: o => o.name },
        { header: "Processed",    accessor: o => o.processed },
        { header: "Avg Days",     accessor: o => o.avgDays },
        { header: "No-Show Rate", accessor: o => o.noShowRate },
      ],
      `ksq-officer-performance-${new Date().toISOString().slice(0, 10)}.csv`
    );
  }

  const revenue = data?.revenue ?? { thisMonth: 0, thisYear: 0, pending: 0 };

  return (
    <div className="max-w-6xl space-y-5">
      {/* Header + range */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-heading font-bold" style={{ fontSize: "1.5rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>Reports</h1>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: "white", border: "1px solid rgba(26,74,46,0.10)" }}>
          {DATE_RANGES.map(r => (
            <button key={r} onClick={() => setRange(r)} className="px-3 py-1.5 rounded-md text-xs font-body font-medium transition-all whitespace-nowrap"
              style={{ background: range === r ? "var(--green)" : "transparent", color: range === r ? "white" : "var(--mid)" }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Revenue (MTD)", value: `$${revenue.thisMonth.toLocaleString()} CAD`, sub: "verified payments this month", accent: "var(--green)" },
          { label: "Revenue (YTD)", value: `$${revenue.thisYear.toLocaleString()} CAD`,  sub: "estimated annual total",       accent: "var(--gold)" },
          { label: "Pending",       value: `$${revenue.pending.toLocaleString()} CAD`,   sub: "awaiting verification",        accent: "#ef4444" },
        ].map(card => (
          <div key={card.label} className="rounded-xl p-5" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}>
            <p className="text-xs font-body font-medium uppercase tracking-wide" style={{ color: "var(--mid)" }}>{card.label}</p>
            <p className="font-heading font-bold mt-1" style={{ fontSize: "1.6rem", color: card.accent, fontFamily: "var(--font-cormorant)", lineHeight: 1.1 }}>{card.value}</p>
            <p className="text-xs font-body mt-1" style={{ color: "var(--mid)" }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <p className="text-center py-10 text-sm font-body" style={{ color: "var(--mid)" }}>Loading report data…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ChartCard title="Enrollment Funnel" subtitle={`Application stages — ${range.toLowerCase()}`}>
              <EnrollmentFunnelChart data={data?.funnelData ?? []} />
            </ChartCard>
            <ChartCard title="Weekly Bookings" subtitle="Appointments booked per week">
              <WeeklyBookingsChart data={data?.weeklyData ?? []} />
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ChartCard title="Show Rate" subtitle="Attendance vs no-show vs cancelled">
              <ShowRateChart data={data?.showData ?? []} />
            </ChartCard>

            <ChartCard title="Applications by Status" subtitle={`Current breakdown — ${range.toLowerCase()}`} onExport={exportStatusBreakdown}>
              <div className="space-y-2">
                {(data?.statusBreakdown ?? []).map(({ status, count }) => {
                  const total = data?.totalApplications ?? 1;
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-body" style={{ color: "var(--mid)" }}>{STATUS_LABELS[status as AppStatus] ?? status}</span>
                        <span className="text-xs font-body font-semibold" style={{ color: "var(--dark)" }}>{count}</span>
                      </div>
                      <div className="rounded-full overflow-hidden h-1.5" style={{ background: "rgba(26,74,46,0.08)" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--green)" }} />
                      </div>
                    </div>
                  );
                })}
                {(data?.statusBreakdown ?? []).length === 0 && (
                  <p className="text-sm font-body text-center py-6" style={{ color: "var(--mid)" }}>No data for this period.</p>
                )}
              </div>
            </ChartCard>
          </div>

          {/* Officer performance */}
          <ChartCard title="Officer Performance" subtitle={`Processed applications — ${range.toLowerCase()}`} onExport={exportOfficers}>
            {(data?.officerStats ?? []).length === 0 ? (
              <p className="text-sm font-body text-center py-6" style={{ color: "var(--mid)" }}>No staff data available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(26,74,46,0.07)" }}>
                      {["Officer", "Applications Processed", "Avg Days to Complete", "No-Show Rate"].map(h => (
                        <th key={h} className="text-left pb-3 text-xs font-body font-semibold uppercase tracking-wide" style={{ color: "var(--mid)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.officerStats ?? []).map((o, i) => (
                      <tr key={o.name} style={{ borderBottom: i < (data?.officerStats.length ?? 0) - 1 ? "1px solid rgba(26,74,46,0.05)" : "none" }}>
                        <td className="py-3 text-sm font-body font-medium" style={{ color: "var(--dark)" }}>{o.name}</td>
                        <td className="py-3 text-sm font-body" style={{ color: "var(--mid)" }}>{o.processed}</td>
                        <td className="py-3 text-sm font-body" style={{ color: "var(--mid)" }}>{o.avgDays} days</td>
                        <td className="py-3">
                          <span className="text-xs font-body font-medium px-2 py-0.5 rounded-full"
                            style={{ background: parseFloat(o.noShowRate) > 5 ? "rgba(239,68,68,0.08)" : "rgba(26,74,46,0.08)", color: parseFloat(o.noShowRate) > 5 ? "#dc2626" : "var(--green)" }}>
                            {o.noShowRate}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ChartCard>
        </>
      )}
    </div>
  );
}
