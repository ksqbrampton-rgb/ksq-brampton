"use client";

import { useEffect, useState } from "react";
import { formatSlotTime } from "@/lib/slots";
import { cn } from "@/lib/utils";

interface Props {
  date: Date;
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function formatDateDisplay(date: Date): string {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return `${days[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export default function SlotPicker({ date, selectedSlot, onSelectSlot }: Props) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSlots([]);

    const dateParam = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    fetch(`/api/slots?date=${dateParam}`)
      .then(r => r.json())
      .then(data => {
        setSlots(data.slots ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load available times. Please try again.");
        setLoading(false);
      });
  }, [date]);

  return (
    <div className="w-full">
      <p className="text-sm font-body font-medium mb-4" style={{ color: "var(--dark)" }}>
        Available times for{" "}
        <span style={{ color: "var(--green)" }}>{formatDateDisplay(date)}</span>
      </p>

      {loading && (
        <div className="flex flex-col items-center py-10 gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--green)", borderTopColor: "transparent" }}
          />
          <p className="text-xs font-body" style={{ color: "var(--mid)" }}>Loading available times…</p>
        </div>
      )}

      {error && (
        <div
          className="p-4 rounded-lg text-sm font-body text-center"
          style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626" }}
        >
          {error}
        </div>
      )}

      {!loading && !error && slots.length === 0 && (
        <div
          className="p-6 rounded-lg text-center"
          style={{ background: "var(--light)", border: "1px solid rgba(26,74,46,0.08)" }}
        >
          <p className="text-sm font-body font-medium mb-1" style={{ color: "var(--dark)" }}>
            No available slots
          </p>
          <p className="text-xs font-body" style={{ color: "var(--mid)" }}>
            All appointments on this date are fully booked. Please choose another date.
          </p>
        </div>
      )}

      {!loading && !error && slots.length > 0 && (
        <>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map(slot => {
              const isSelected = slot === selectedSlot;
              return (
                <button
                  key={slot}
                  onClick={() => onSelectSlot(slot)}
                  className="py-2.5 px-2 rounded-lg text-sm font-body font-medium transition-all duration-150 text-center"
                  style={{
                    background: isSelected ? "var(--green)" : "white",
                    color: isSelected ? "white" : "var(--dark)",
                    border: isSelected ? "1.5px solid var(--green)" : "1.5px solid rgba(26,74,46,0.15)",
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                    boxShadow: isSelected ? "0 2px 8px rgba(26,74,46,0.2)" : "none",
                  }}
                  aria-pressed={isSelected}
                >
                  {formatSlotTime(slot)}
                </button>
              );
            })}
          </div>
          <p className="text-xs font-body mt-3" style={{ color: "var(--mid)" }}>
            Appointments are 30 minutes. Booking online gives you priority over walk-ins.
          </p>
        </>
      )}
    </div>
  );
}
