"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  GraduationCap,
  FileText,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Star,
  Building2,
} from "lucide-react";

const ADMIN_KEY_STORAGE = "ways_admin_key";

const NAV = [
  { href: "/gervis", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/gervis/terrains", label: "Terrains", icon: MapPin },
  { href: "/gervis/formations", label: "Formations", icon: GraduationCap },
  { href: "/gervis/articles", label: "Articles", icon: FileText },
  { href: "/gervis/commentaires", label: "Commentaires", icon: MessageSquare },
  { href: "/gervis/temoignages", label: "Témoignages", icon: Star },
  { href: "/gervis/partenaires", label: "Partenaires", icon: Building2 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) setAuthenticated(true);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Vérification rapide côté client (la vraie vérification est faite par chaque API)
    const res = await fetch("/api/gervis/terrains", {
      headers: { "x-admin-key": keyInput },
    });
    if (res.ok || res.status === 200) {
      sessionStorage.setItem(ADMIN_KEY_STORAGE, keyInput);
      setAuthenticated(true);
    } else {
      setError("Clé incorrecte.");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    setAuthenticated(false);
    setKeyInput("");
  }

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname.startsWith(href) && href !== "/gervis";
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-[#0A2342] rounded-xl flex items-center justify-center">
                <span className="text-[#E8861A] font-black text-sm">W</span>
              </div>
              <span className="text-2xl font-black text-[#0A2342]">WAYS</span>
              <span className="text-2xl font-black text-[#E8861A]">Admin</span>
            </div>
            <p className="text-gray-500 text-sm">Espace d'administration</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h1 className="text-lg font-black text-[#0A2342] mb-6 text-center">Connexion</h1>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={keyInput}
                onChange={(e) => { setKeyInput(e.target.value); setError(""); }}
                placeholder="Clé d'administration"
                required
                autoFocus
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2342]/20"
              />
              <button className="w-full py-3 bg-[#0A2342] text-white font-bold rounded-xl hover:bg-[#E8861A] transition-colors">
                Accéder
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#0A2342] text-white z-30 flex flex-col
        transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E8861A] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">W</span>
              </div>
              <div>
                <p className="font-black text-sm leading-none">WAYS Admin</p>
                <p className="text-gray-400 text-xs mt-0.5">Espace de gestion</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive(href, exact) || (exact && pathname === "/gervis")
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {href === "/gervis" && isActive("/gervis", true) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E8861A]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Voir le site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-red-400 text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <div className="lg:hidden bg-[#0A2342] text-white px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-black text-sm">WAYS Admin</span>
          <div className="w-5" />
        </div>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
