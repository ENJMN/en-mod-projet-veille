"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const services = [
  { label: "WAYS IA & Digital", href: "/services/consulting" },
  { label: "WAYS Stratégie", href: "/services/data-dashboards" },
  { label: "WAYS Build", href: "/services/btp-immobilier" },
  { label: "WAYS Academy & Supply", href: "/services/formation" },
];

const terrainLink = { label: "Terrains à vendre", href: "/terrains" };

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/about" },
  { label: "Formations", href: "/formations" },
  { label: "Blog", href: "/blog" },
  { label: "Vidéos", href: "/videos" },
  { label: "Audit gratuit", href: "/audit" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (href: string) => pathname === href;
  const isServiceActive = services.some((s) => pathname === s.href);

  function openServices() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  }

  function closeServices() {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 100);
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-full.png"
              alt="WAYS Digital Solutions — We Act for Your Success"
              width={160}
              height={50}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-[#E8861A] font-bold"
                    : "text-[#1A1A2E] hover:text-[#E8861A]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={openServices}
              onMouseLeave={closeServices}
            >
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isServiceActive ? "text-[#E8861A] font-bold" : "text-[#1A1A2E] hover:text-[#E8861A]"
                }`}
              >
                Services
                <svg
                  className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {servicesOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64 z-50"
                  onMouseEnter={openServices}
                  onMouseLeave={closeServices}
                >
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                    {services.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        onClick={() => setServicesOpen(false)}
                        className={`block px-4 py-2.5 text-sm transition-colors ${
                          isActive(s.href)
                            ? "bg-[#0A2342]/5 text-[#E8861A] font-semibold border-l-2 border-[#E8861A]"
                            : "text-[#1A1A2E] hover:bg-[#F8F9FA] hover:text-[#E8861A]"
                        }`}
                      >
                        {s.label}
                      </Link>
                    ))}
                    <div className="mx-3 my-1.5 border-t border-gray-100" />
                    <Link
                      href={terrainLink.href}
                      onClick={() => setServicesOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                        isActive(terrainLink.href)
                          ? "bg-[#059669]/5 text-[#059669] font-semibold border-l-2 border-[#059669]"
                          : "text-[#059669] hover:bg-[#059669]/5"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                      </svg>
                      {terrainLink.label}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-[#E8861A] font-bold"
                    : "text-[#1A1A2E] hover:text-[#E8861A]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/contact"
              className="ml-2 px-4 py-2 bg-[#0A2342] text-white text-sm font-semibold rounded-lg hover:bg-[#E8861A] transition-colors"
            >
              Nous contacter
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-[#1A1A2E] hover:text-[#E8861A] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? "text-[#E8861A] bg-[#E8861A]/10 font-bold"
                    : "text-[#1A1A2E] hover:text-[#E8861A] hover:bg-[#F8F9FA]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Services */}
            <div>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                  isServiceActive
                    ? "text-[#E8861A] bg-[#E8861A]/10 font-bold"
                    : "text-[#1A1A2E] hover:text-[#E8861A] hover:bg-[#F8F9FA]"
                }`}
              >
                Services
                <svg
                  className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileServicesOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {services.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                        isActive(s.href)
                          ? "text-[#E8861A] bg-[#E8861A]/10 font-semibold"
                          : "text-[#1A1A2E] hover:text-[#E8861A] hover:bg-[#F8F9FA]"
                      }`}
                    >
                      {s.label}
                    </Link>
                  ))}
                  <div className="mx-1 border-t border-gray-100" />
                  <Link
                    href={terrainLink.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                      isActive(terrainLink.href)
                        ? "text-[#059669] bg-[#059669]/10 font-semibold"
                        : "text-[#059669] hover:bg-[#059669]/10"
                    }`}
                  >
                    {terrainLink.label}
                  </Link>
                </div>
              )}
            </div>

            {navLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                  isActive(link.href)
                    ? "text-[#E8861A] bg-[#E8861A]/10 font-bold"
                    : "text-[#1A1A2E] hover:text-[#E8861A] hover:bg-[#F8F9FA]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-2.5 bg-[#0A2342] text-white text-sm font-semibold rounded-lg hover:bg-[#E8861A] transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
