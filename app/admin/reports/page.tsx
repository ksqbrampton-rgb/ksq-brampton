"use client";

import { useState } from "react";
import { EnrollmentFunnelChart, WeeklyBookingsChart, ShowRateChart } from "@/components/admin/ReportsCharts";
import { downloadCsv } from "@/lib/export";
import { MOCK_APPLICATIONS, STATUS_LABELS } from "@/lib/mock-data";
import { SITE } from "@/lib/constants";

const DATE_RANGES = ["This Week", "This Month", "This Quarter", "This Year"] as const;
type DateRange = typeof DATE_RANGES[number];

const OFFICER_DATA = [
  { name: "Enrollment Officer", processed: 28, avgDays: 2.1, noShowRate: "7%" },
  { name: "Admin User",         processed: 6,  avgDays: 1.8, noShowRate: "0%" },
];

const REVENUE_DATA = {
  thisMonth: MOCK_APPLICATIONS.filter(a => a.paymentStatus === "VERIFIED").length * SITE.fees.newEnrollment,
  thisYear:  MOCK_APPLICATIONS.filter(a => a.paymentStatus === "VERIFIED").length * SITE.fees.newEnrollment * 4,
  pending:   MOCK_APPLICATIONS.filter(a => a.paymentStatus === "PENDING").length * SITE.fees.newEnrollment,
};

function ChartCard({ title, subtitle, onExport, children }: {
  title: string;
  subtitle?: string;
  onExport?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl p-5" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading font-semibold" style={{ fontSize: "1rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>
            {title}
          </h3>
          {subtitle && <p className="text-xs font-body mt-0.5" style={{ color: "var(--mid)" }}>{subtitle}</p>}
        </div>
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-body font-medium transition-colors"
            style={{ background: "rgba(26,74,46,0.06)", color: "var(--green)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
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

  function exportApplications() {
    downloadCsv(
      MOCK_APPLICATIONS,
      [
        { header: "Reference",       accessor: a => a.applicationRef },
        { header: "Guest Name",      accessor: a => `${a.guest.firstName} ${a.guest.lastName}` },
        { header: "Email",           accessor: a => a.guest.email },
        { header: "Status",          accessor: a => STATUS_LABELS[a.status] },
        { header: "Payment",         accessor: a => a.paymentStatus },
        { header: "Appointment",     accessor: a => a.appointment ? new Date(a.appointment.slotStart).toLocaleString("en-CA") : "" },
        { header: "Created",         accessor: a => new Date(a.createdAt).toLocaleDateString("en-CA") },
      ],
      `ksq-applications-${new Date().toISOString().slice(0, 10)}.csv`
    );
  }

  function exportOfficers() {
    downloadCsv(
      OFFICER_DATA,
      [
        { header: "Officer",         accessor: o => o.name },
        { header: "Processed",       accessor: o => o.processed },
        { header: "Avg Days",        accessor: o => o.avgDays },
        { header: "No-Show Rate",    accessor: o => o.noShowRate },
      ],
      `ksq-officer-performance-${new Date().toISOString().slice(0, 10)}.csv`
    );
  }

  return (
    <div className="max-w-6xl space-y-5">
      {/* Header + date range */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="font-heading font-bold" style={{ fontSize: "1.5rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>
          Reports
        </h1>
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: "white", border: "1px solid rgba(26,74,46,0.10)" }}>
          {DATE_RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-3 py-1.5 rounded-md text-xs font-body font-medium transition-all whitespace-nowrap"
              style={{
                background: range === r ? "var(--green)" : "transparent",
                color: range === r ? "white" : "var(--mid)",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Revenue (MTD)", value: `$${REVENUE_DATA.thisMonth.toLocaleString()} CAD`, sub: "verified payments this month", accent: "var(--green)" },
          { label: "Revenue (YTD)", value: `$${REVENUE_DATA.thisYear.toLocaleString()} CAD`, sub: "estimated annual total", accent: "var(--gold)" },
          { label: "Pending",       value: `$${REVENUE_DATA.pending.toLocaleString()} CAD`, sub: "awaiting verification", accent: "#ef4444" },
        ].map(card => (
          <div key={card.label} className="rounded-xl p-5" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}>
            <p className="text-xs font-body font-medium uppercase tracking-wide" style={{ color: "var(--mid)" }}>{card.label}</p>
            <p className="font-heading font-bold mt-1" style={{ fontSize: "1.6rem", color: card.accent, fontFamily: "var(--font-cormorant)", lineHeight: 1.1 }}>
              {card.value}
            </p>
            <p className="text-xs font-body mt-1" style={{ color: "var(--mid)" }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard
          title="Enrollment Funnel"
          subtitle={`Application stages — ${range.toLowerCase()}`}
          onExport={exportApplications}
        >
          <EnrollmentFunnelChart />
        </ChartCard>

        <ChartCard title="Weekly Bookings" subtitle="Appointments booked per week">
          <WeeklyBookingsChart />
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Show Rate" subtitle="Attendance vs no-show vs cancelled">
          <ShowRateChart />
        </ChartCard>

        {/* Status breakdown */}
        <ChartCard title="Applications by Status" subtitle={`Current breakdown — ${range.toLowerCase()}`} onExport={exportApplications}>
          <div className="space-y-2">
            {Object.entries(
              MOCK_APPLICATIONS.reduce((acc, a) => {
                acc[a.status] = (acc[a.status] ?? 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([status, count]) => {
              const pct = Math.round((count / MOCK_APPLICATIONS.length) * 100);
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-body" style={{ color: "var(--mid)" }}>{STATUS_LABELS[status as never]}</span>
                    <span className="text-xs font-body font-semibold" style={{ color: "var(--dark)" }}>{count}</span>
                  </div>
                  <div className="rounded-full overflow-hidden h-1.5" style={{ background: "rgba(26,74,46,0.08)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--green)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Officer performance */}
      <ChartCard title="Officer Performance" subtitle={`Processed applications — ${range.toLowerCase()}`} onExport={exportOfficers}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(26,74,46,0.07)" }}>
                {["Officer", "Applications Processed", "Avg Days to Complete", "No-Show Rate"].map(h => (
                  <th key={h} className="text-left pb-3 text-xs font-body font-semibold uppercase tracking-wide" style={{ color: "var(--mid)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OFFICER_DATA.map((o, i) => (
                <tr key={o.name} style={{ borderBottom: i < OFFICER_DATA.length - 1 ? "1px solid rgba(26,74,46,0.05)" : "none" }}>
                  <td className="py-3 text-sm font-body font-medium" style={{ color: "var(--dark)" }}>{o.name}</td>
                  <td className="py-3 text-sm font-body" style={{ color: "var(--mid)" }}>{o.processed}</td>
                  <td className="py-3 text-sm font-body" style={{ color: "var(--mid)" }}>{o.avgDays} days</td>
                  <td className="py-3">
                    <span
                      className="text-xs font-body font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: parseFloat(o.noShowRate) > 5 ? "rgba(239,68,68,0.08)" : "rgba(26,74,46,0.08)",
                        color: parseFloat(o.noShowRate) > 5 ? "#dc2626" : "var(--green)",
                      }}
                    >
                      {o.noShowRate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
