"use client";

import Link from "next/link";
import { useState, ReactNode } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl 
                          flex items-center justify-center shadow-md group-hover:scale-105 transition-all">
            <span className="text-white font-bold text-xl">📁</span>
          </div>
          <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 
                           bg-clip-text text-transparent hidden sm:block">
            Digital Asset Manager
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/#about">About</NavLink>
          <NavLink href="/#features">Features</NavLink>

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          <NavLink href="/login">Login</NavLink>

          <Link
            href="/register"
            className="ml-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                       font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
          className="md:hidden p-2 rounded-lg hover:bg-white/40 transition-colors"
        >
          {open ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white/80 backdrop-blur-xl border-t border-white/50 shadow-lg animate-fadeIn">
          <MobileLink href="/#features" close={() => setOpen(false)}>Features</MobileLink>
          <MobileLink href="/#about" close={() => setOpen(false)}>About</MobileLink>

          <div className="h-px bg-gray-300 my-2"></div>

          <MobileLink href="/login" close={() => setOpen(false)}>Login</MobileLink>

          <Link
            href="/register"
            onClick={() => setOpen(false)}
            className="block mx-4 my-3 text-center px-4 py-3 rounded-xl bg-gradient-to-r 
                       from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}

/* Sub Components */
function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-white/50 
                 transition-all font-medium"
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
  close,
}: {
  href: string;
  children: ReactNode;
  close: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={close}
      className="px-6 py-4 text-gray-700 hover:bg-white/50 hover:text-blue-600 transition-all font-medium block"
    >
      {children}
    </Link>
  );
}
