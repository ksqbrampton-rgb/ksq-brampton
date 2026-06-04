"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Escape key to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function close() {
    setMenuOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "shadow-lg" : ""
        )}
        style={{
          background: "rgba(15, 35, 24, 0.96)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(201, 151, 58, 0.20)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <Link href="/" onClick={close} className="flex flex-col leading-tight min-w-0">
              <span
                className="font-heading font-bold text-white text-xl tracking-tight truncate"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Knowledge Square
              </span>
              <span
                className="font-body font-medium tracking-widest uppercase"
                style={{ color: "var(--gold)", fontSize: "0.55rem" }}
              >
                NIN Enrollment · Brampton
              </span>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-body font-medium text-white/75 hover:text-white transition-colors duration-200 whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              <Link
                href="/admin/login"
                className="text-xs font-body font-medium px-3 py-2 rounded-md transition-all"
                style={{ color: "rgba(255,255,255,0.50)", border: "1px solid rgba(255,255,255,0.12)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "white"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.30)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.50)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
              >
                Staff Login
              </Link>
              <Link href="/book" className="btn-primary text-sm whitespace-nowrap">
                Book an Appointment
              </Link>
            </div>

            {/* Mobile: Book CTA (sm only) + Hamburger */}
            <div className="lg:hidden flex items-center gap-3">
              <Link
                href="/book"
                onClick={close}
                className="hidden sm:inline-flex btn-primary text-xs px-4 py-2 whitespace-nowrap"
              >
                Book
              </Link>

              {/* Hamburger button */}
              <button
                className="relative w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-md transition-colors"
                style={{ background: menuOpen ? "rgba(255,255,255,0.08)" : "transparent" }}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
              >
                {/* Three bars — animated to X */}
                <span className="sr-only">{menuOpen ? "Close" : "Menu"}</span>
                <div className="w-5 h-4 flex flex-col justify-between relative" aria-hidden="true">
                  <span
                    className="block h-[2px] w-full bg-white rounded-sm origin-center transition-all duration-300 ease-in-out"
                    style={{
                      transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
                    }}
                  />
                  <span
                    className="block h-[2px] w-full bg-white rounded-sm transition-all duration-200 ease-in-out"
                    style={{
                      opacity: menuOpen ? 0 : 1,
                      transform: menuOpen ? "scaleX(0)" : "scaleX(1)",
                    }}
                  />
                  <span
                    className="block h-[2px] w-full bg-white rounded-sm origin-center transition-all duration-300 ease-in-out"
                    style={{
                      transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
                    }}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu — slides down */}
        <div
          id="mobile-nav"
          role="navigation"
          aria-label="Mobile navigation"
          className="lg:hidden"
          style={{
            background: "rgba(10, 26, 18, 0.99)",
            maxHeight: menuOpen ? "100vh" : "0",
            overflow: "hidden",
            transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <nav className="px-5 pt-4 pb-8 flex flex-col">
            {/* Nav links */}
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className="flex items-center justify-between py-4 font-body font-medium text-base text-white/80 hover:text-white transition-colors"
                style={{
                  borderBottom: i < NAV_LINKS.length - 1
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "none",
                }}
              >
                {link.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </Link>
            ))}

            {/* Mobile CTA */}
            <Link
              href="/book"
              onClick={close}
              className="btn-primary mt-6 justify-center text-center py-4 text-base font-semibold"
            >
              Book an Appointment
            </Link>

            {/* Staff login */}
            <Link
              href="/admin/login"
              onClick={close}
              className="mt-3 justify-center text-center py-3 text-sm font-body font-medium rounded-md transition-colors"
              style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              Staff Login
            </Link>

            {/* Contact hint */}
            <p className="text-xs font-body text-center mt-4" style={{ color: "rgba(255,255,255,0.35)" }}>
              {SITE.email}
            </p>
          </nav>
        </div>
      </header>

      {/* Full-screen backdrop — tap to close */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}
          onClick={close}
          aria-hidden="true"
        />
      )}
    </>
  );
}
