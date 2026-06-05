"use client";

import { useState, useEffect } from "react";
import StatsCard from "@/components/admin/StatsCard";
import TodayQueue from "@/components/admin/TodayQueue";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface Stats {
  todayAppointments: number;
  thisMonthApplications: number;
  ninIssued: number;
  pendingPayments: number;
}

interface ActivityItem {
  id: string;
  createdAt: string;
  toStatus: string;
  application: { applicationRef: string };
  changedBy: { firstName: string; lastName: string };
}

const STATUS_ACTION: Record<string, string> = {
  ARRIVED:             "Guest checked in",
  BIOMETRICS_CAPTURED: "Biometrics captured",
  NIN_ISSUED:          "NIN issued",
  NO_SHOW:             "Marked no-show",
  CANCELLED:           "Appointment cancelled",
  NIN_PROCESSING:      "Sent to processing",
};

export default function DashboardPage() {
  const [stats, setStats]       = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    fetch("/api/admin/data/stats")
      .then(r => r.json())
      .then(data => {
        setStats(data.stats);
        setActivity(data.recentActivity ?? []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Today's Appointments" value={stats?.todayAppointments ?? "—"} sub="scheduled for today" accent="blue"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        />
        <StatsCard label="Applications (MTD)" value={stats?.thisMonthApplications ?? "—"} sub="this month" accent="green"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
        />
        <StatsCard label="NIN Issued" value={stats?.ninIssued ?? "—"} sub="total issued" accent="gold"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
        />
        <StatsCard label="Pending Payments" value={stats?.pendingPayments ?? "—"} sub="awaiting verification" accent="red"
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>}
        />
      </div>

      {/* Today's queue */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-semibold" style={{ fontSize: "1.1rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>Today&apos;s Queue</h2>
          <a href="/admin/appointments" className="text-xs font-body" style={{ color: "var(--green)" }}>View all →</a>
        </div>
        <TodayQueue />
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="font-heading font-semibold mb-3" style={{ fontSize: "1.1rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>Recent Activity</h2>
        <div className="rounded-xl overflow-hidden" style={{ background: "white", border: "1px solid rgba(26,74,46,0.07)", boxShadow: "0 1px 4px rgba(26,74,46,0.05)" }}>
          {activity.length === 0 ? (
            <p className="px-5 py-8 text-sm font-body text-center" style={{ color: "var(--mid)" }}>No recent activity.</p>
          ) : activity.map((item, i) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-3.5" style={{ borderBottom: i < activity.length - 1 ? "1px solid rgba(26,74,46,0.05)" : "none" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(26,74,46,0.08)", color: "var(--green)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body" style={{ color: "var(--dark)" }}>
                  <span className="font-medium">{STATUS_ACTION[item.toStatus] ?? item.toStatus}</span>
                  {" · "}
                  <span style={{ color: "var(--mid)" }}>{item.application?.applicationRef}</span>
                </p>
                <p className="text-xs font-body" style={{ color: "var(--mid)" }}>
                  by {item.changedBy?.firstName} {item.changedBy?.lastName}
                </p>
              </div>
              <span className="text-xs font-body flex-shrink-0" style={{ color: "var(--mid)" }}>{timeAgo(item.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
