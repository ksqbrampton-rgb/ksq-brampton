"use client";

import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface FunnelItem  { status: string; count: number }
interface WeeklyItem  { week: string; bookings: number }
interface ShowItem    { name: string; value: number; color: string }

export function EnrollmentFunnelChart({ data }: { data: FunnelItem[] }) {
  if (!data?.length) return <Empty />;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,74,46,0.07)" />
        <XAxis dataKey="status" tick={{ fontSize: 11, fill: "#4a6558", fontFamily: "Outfit, sans-serif" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#4a6558", fontFamily: "Outfit, sans-serif" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={{ border: "1px solid rgba(26,74,46,0.10)", borderRadius: "8px", fontSize: "12px", fontFamily: "Outfit, sans-serif" }} cursor={{ fill: "rgba(26,74,46,0.04)" }} />
        <Bar dataKey="count" fill="#1a4a2e" radius={[4, 4, 0, 0]} name="Applications" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function WeeklyBookingsChart({ data }: { data: WeeklyItem[] }) {
  if (!data?.length) return <Empty />;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,74,46,0.07)" />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#4a6558", fontFamily: "Outfit, sans-serif" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#4a6558", fontFamily: "Outfit, sans-serif" }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={{ border: "1px solid rgba(26,74,46,0.10)", borderRadius: "8px", fontSize: "12px", fontFamily: "Outfit, sans-serif" }} cursor={{ stroke: "rgba(26,74,46,0.10)" }} />
        <Line type="monotone" dataKey="bookings" stroke="#c9973a" strokeWidth={2.5} dot={{ fill: "#c9973a", r: 4 }} name="Bookings" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ShowRateChart({ data }: { data: ShowItem[] }) {
  if (!data?.length) return <Empty />;
  const total    = data.reduce((s, d) => s + d.value, 0);
  const attended = data.find(d => d.name === "Attended")?.value ?? 0;
  const rate     = total > 0 ? Math.round((attended / total) * 100) : 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie data={data} cx={65} cy={65} innerRadius={42} outerRadius={62} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
              {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--dark)", fontFamily: "var(--font-cormorant)", lineHeight: 1 }}>{rate}%</span>
          <span style={{ fontSize: "0.6rem", color: "var(--mid)", fontFamily: "Outfit, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>Show rate</span>
        </div>
      </div>
      <div className="space-y-2">
        {data.map(d => (
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

function Empty() {
  return <p className="h-32 flex items-center justify-center text-sm font-body" style={{ color: "var(--mid)" }}>No data for this period.</p>;
}
