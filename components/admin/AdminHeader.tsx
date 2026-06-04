"use client";

interface Props {
  title: string;
  onMenuToggle: () => void;
}

export default function AdminHeader({ title, onMenuToggle }: Props) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-CA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header
      className="h-14 flex items-center justify-between px-4 sm:px-6 flex-shrink-0"
      style={{
        background: "white",
        borderBottom: "1px solid rgba(26,74,46,0.08)",
        boxShadow: "0 1px 3px rgba(26,74,46,0.04)",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-md transition-colors"
          style={{ color: "var(--mid)" }}
          aria-label="Toggle sidebar"
        >
          <span className="block w-4 h-0.5 rounded-sm" style={{ background: "var(--mid)" }} />
          <span className="block w-4 h-0.5 rounded-sm" style={{ background: "var(--mid)" }} />
          <span className="block w-3 h-0.5 rounded-sm" style={{ background: "var(--mid)" }} />
        </button>

        <div>
          <h1
            className="font-heading font-semibold"
            style={{ fontSize: "1.1rem", color: "var(--dark)", fontFamily: "var(--font-cormorant)" }}
          >
            {title}
          </h1>
          <p className="text-xs font-body hidden sm:block" style={{ color: "var(--mid)" }}>
            {dateStr}
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Public site link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-xs font-body px-3 py-1.5 rounded-md transition-colors"
          style={{
            color: "var(--mid)",
            background: "rgba(26,74,46,0.05)",
            border: "1px solid rgba(26,74,46,0.10)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          View Site
        </a>

        {/* KSQ badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 text-xs font-body px-2.5 py-1.5 rounded-md"
          style={{ background: "rgba(26,74,46,0.06)", color: "var(--green)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--green)" }}
          />
          KSQ Brampton
        </div>
      </div>
    </header>
  );
}
