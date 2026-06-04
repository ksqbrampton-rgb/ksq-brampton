"use client";

import { useState } from "react";
import { isDateBookable } from "@/lib/slots";
import { cn } from "@/lib/utils";

interface Props {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isToday(d: Date) {
  return isSameDay(d, new Date());
}

function buildCalendarGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  // Monday-first: 0=Mon…6=Sun
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: (Date | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    grid.push(new Date(year, month, d));
  }
  // Pad to full weeks
  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

export default function BookingCalendar({ selectedDate, onSelectDate }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const grid = buildCalendarGrid(viewYear, viewMonth);

  const canGoPrev = !(viewYear === today.getFullYear() && viewMonth === today.getMonth());
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  const canGoNext = new Date(viewYear, viewMonth + 1, 1) < maxDate;

  function prevMonth() {
    if (!canGoPrev) return;
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (!canGoNext) return;
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  return (
    <div className="w-full">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
          style={{ background: canGoPrev ? "rgba(26,74,46,0.08)" : "transparent", color: "var(--green)" }}
          aria-label="Previous month"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <span className="font-heading font-semibold" style={{ fontSize: "1.1rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>

        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
          style={{ background: canGoNext ? "rgba(26,74,46,0.08)" : "transparent", color: "var(--green)" }}
          aria-label="Next month"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center py-1 text-xs font-body font-medium uppercase tracking-wide" style={{ color: "var(--mid)" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {grid.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} />;

          const bookable = isDateBookable(date);
          const selected = selectedDate ? isSameDay(date, selectedDate) : false;
          const todayDate = isToday(date);

          return (
            <button
              key={date.toISOString()}
              onClick={() => bookable && onSelectDate(date)}
              disabled={!bookable}
              className={cn(
                "relative aspect-square flex items-center justify-center rounded-lg text-sm font-body font-medium transition-all duration-150",
                !bookable && "opacity-30 cursor-not-allowed line-through",
                bookable && !selected && "hover:bg-ksq-light cursor-pointer",
              )}
              style={{
                background: selected ? "var(--green)" : todayDate && !selected ? "rgba(201,151,58,0.12)" : "transparent",
                color: selected ? "white" : todayDate ? "var(--gold)" : bookable ? "var(--dark)" : "var(--mid)",
                fontWeight: todayDate ? "600" : "400",
              }}
              aria-label={`${date.getDate()} ${MONTHS[date.getMonth()]}`}
              aria-pressed={selected}
            >
              {date.getDate()}
              {todayDate && !selected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: "var(--gold)" }} />
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs font-body mt-3 text-center" style={{ color: "var(--mid)" }}>
        Sundays and past dates are unavailable
      </p>
    </div>
  );
}
