"use client";

import { useState } from "react";
import BookingCalendar from "./BookingCalendar";
import SlotPicker from "./SlotPicker";
import GuestForm from "./GuestForm";
import BookingConfirmation from "./BookingConfirmation";
import { type BookingFormData, type BookingResult } from "@/lib/booking";
import { formatSlotTime } from "@/lib/slots";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function shortDate(d: Date) {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { n: 1 as Step, label: "Date" },
  { n: 2 as Step, label: "Time" },
  { n: 3 as Step, label: "Details" },
  { n: 4 as Step, label: "Confirmed" },
];

interface StepHeaderProps {
  current: Step;
  selectedDate: Date | null;
  selectedSlot: string | null;
}

function StepHeader({ current, selectedDate, selectedSlot }: StepHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between relative">
        {/* Connector line */}
        <div
          className="absolute top-4 left-0 right-0 h-px"
          style={{ background: "rgba(26,74,46,0.12)", zIndex: 0 }}
        />
        {STEPS.map(step => {
          const done = current > step.n;
          const active = current === step.n;
          return (
            <div key={step.n} className="flex flex-col items-center gap-1.5 relative z-10">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-semibold transition-all duration-300"
                style={{
                  background: done ? "var(--green)" : active ? "var(--gold)" : "white",
                  color: done ? "white" : active ? "var(--dark)" : "var(--mid)",
                  border: done || active ? "none" : "1.5px solid rgba(26,74,46,0.15)",
                }}
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : step.n}
              </div>
              <span className="text-xs font-body hidden xs:block" style={{ color: active ? "var(--dark)" : "var(--mid)", fontWeight: active ? "600" : "400" }}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Contextual subtitle */}
      <p className="text-center text-xs font-body mt-3" style={{ color: "var(--mid)" }}>
        {current === 1 && "Select an available date"}
        {current === 2 && selectedDate && `Available times for ${shortDate(selectedDate)}`}
        {current === 3 && selectedDate && selectedSlot && `${shortDate(selectedDate)} at ${formatSlotTime(selectedSlot)}`}
        {current === 4 && "Your appointment is booked"}
      </p>
    </div>
  );
}

export default function BookingWidget() {
  const [step, setStep] = useState<Step>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingResult | null>(null);

  function handleSelectDate(date: Date) {
    setSelectedDate(date);
    setSelectedSlot(null);
    setStep(2);
  }

  function handleSelectSlot(slot: string) {
    setSelectedSlot(slot);
    setStep(3);
  }

  async function handleSubmit(formData: BookingFormData) {
    if (!selectedSlot) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, slotStart: selectedSlot }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(
          data.error ?? "Something went wrong. Please try again."
        );
        setSubmitting(false);
        return;
      }

      setConfirmation(data as BookingResult);
      setStep(4);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="w-full max-w-md mx-auto rounded-2xl overflow-hidden"
      style={{
        background: "white",
        border: "1px solid rgba(26,74,46,0.08)",
        boxShadow: "0 8px 40px rgba(26,74,46,0.12)",
      }}
    >
      <div className="p-6 sm:p-8">
        <StepHeader current={step} selectedDate={selectedDate} selectedSlot={selectedSlot} />

        {/* Step 1 — Calendar */}
        {step === 1 && (
          <BookingCalendar
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />
        )}

        {/* Step 2 — Slot picker */}
        {step === 2 && selectedDate && (
          <>
            <SlotPicker
              date={selectedDate}
              selectedSlot={selectedSlot}
              onSelectSlot={handleSelectSlot}
            />
            <button
              onClick={() => setStep(1)}
              className="mt-4 flex items-center gap-1.5 text-sm font-body transition-opacity hover:opacity-70"
              style={{ color: "var(--mid)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Change date
            </button>
          </>
        )}

        {/* Step 3 — Guest details */}
        {step === 3 && selectedDate && selectedSlot && (
          <>
            <GuestForm
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onSubmit={handleSubmit}
              submitting={submitting}
              submitError={submitError}
            />
            <button
              onClick={() => setStep(2)}
              className="mt-3 flex items-center gap-1.5 text-sm font-body transition-opacity hover:opacity-70"
              style={{ color: "var(--mid)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Change time
            </button>
          </>
        )}

        {/* Step 4 — Confirmation */}
        {step === 4 && confirmation && (
          <BookingConfirmation
            applicationRef={confirmation.applicationRef}
            slotStart={confirmation.slotStart}
            guestName={confirmation.guestName}
          />
        )}
      </div>

      {/* Footer note (steps 1–3 only) */}
      {step < 4 && (
        <div
          className="px-6 py-3 text-center"
          style={{ background: "var(--light)", borderTop: "1px solid rgba(26,74,46,0.06)" }}
        >
          <p className="text-xs font-body" style={{ color: "var(--mid)" }}>
            No account required · Your data is used only for this appointment
          </p>
        </div>
      )}
    </div>
  );
}
