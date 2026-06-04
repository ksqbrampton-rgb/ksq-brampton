"use client";

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ── Enrollment funnel ────────────────────────────────────────
const FUNNEL_DATA = [
  { status: "Scheduled", count: 42 },
  { status: "Arrived",   count: 38 },
  { status: "Biometrics",count: 35 },
  { status: "Processing",count: 33 },
  { status: "Issued",    count: 31 },
];

export function EnrollmentFunnelChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={FUNNEL_DATA} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,74,46,0.07)" />
        <XAxis dataKey="status" tick={{ fontSize: 11, fill: "#4a6558", fontFamily: "Outfit, sans-serif" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#4a6558", fontFamily: "Outfit, sans-serif" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ border: "1px solid rgba(26,74,46,0.10)", borderRadius: "8px", fontSize: "12px", fontFamily: "Outfit, sans-serif" }}
          cursor={{ fill: "rgba(26,74,46,0.04)" }}
        />
        <Bar dataKey="count" fill="#1a4a2e" radius={[4, 4, 0, 0]} name="Applications" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Weekly bookings ───────────────────────────────────────────
const WEEKLY_DATA = [
  { week: "May 5",  bookings: 8 },
  { week: "May 12", bookings: 11 },
  { week: "May 19", bookings: 9 },
  { week: "May 26", bookings: 14 },
  { week: "Jun 2",  bookings: 10 },
  { week: "Jun 9",  bookings: 12 },
];

export function WeeklyBookingsChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={WEEKLY_DATA} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,74,46,0.07)" />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#4a6558", fontFamily: "Outfit, sans-serif" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#4a6558", fontFamily: "Outfit, sans-serif" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ border: "1px solid rgba(26,74,46,0.10)", borderRadius: "8px", fontSize: "12px", fontFamily: "Outfit, sans-serif" }}
          cursor={{ stroke: "rgba(26,74,46,0.10)" }}
        />
        <Line type="monotone" dataKey="bookings" stroke="#c9973a" strokeWidth={2.5} dot={{ fill: "#c9973a", r: 4 }} name="Bookings" />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Show rate donut ───────────────────────────────────────────
const SHOW_DATA = [
  { name: "Attended",    value: 38, color: "#1a4a2e" },
  { name: "No-Show",     value: 4,  color: "#ef4444" },
  { name: "Cancelled",   value: 2,  color: "#9ca3af" },
];

export function ShowRateChart() {
  const total = SHOW_DATA.reduce((s, d) => s + d.value, 0);
  const attended = SHOW_DATA[0].value;
  const rate = Math.round((attended / total) * 100);

  return (
    <div className="relative flex items-center gap-6">
      <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie data={SHOW_DATA} cx={65} cy={65} innerRadius={42} outerRadius={62} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
              {SHOW_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--dark)", fontFamily: "var(--font-cormorant)", lineHeight: 1 }}>
            {rate}%
          </span>
          <span style={{ fontSize: "0.6rem", color: "var(--mid)", fontFamily: "Outfit, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Show rate
          </span>
        </div>
      </div>
      <div className="space-y-2">
        {SHOW_DATA.map(d => (
          <div key={d.name} className="flex items-center gap-2 text-xs font-body">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span style={{ color: "var(--mid)" }}>{d.name}</span>
            <span className="font-semibold ml-1" style={{ color: "var(--dark)" }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
