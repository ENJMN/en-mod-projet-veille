"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

interface Partenaire {
  id: string;
  nom: string;
  logo_url: string | null;
  site_url: string | null;
  is_published: boolean;
  ordre: number;
}

const empty = (): Partial<Partenaire> => ({ nom: "", logo_url: "", site_url: "", is_published: true, ordre: 0 });

export default function PartenairesPage() {
  const [items, setItems] = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<Partenaire>>(empty());
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const adminKey = typeof window !== "undefined" ? sessionStorage.getItem("ways_admin_key") ?? "" : "";

  async function load() {
    setLoading(true);
    const res = await fetch("/api/gervis/partenaires", { headers: { "x-admin-key": adminKey } });
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function save() {
    setSaving(true);
    const method = editing ? "PATCH" : "POST";
    const body = editing ? { ...form, id: editing } : form;
    const res = await fetch("/api/gervis/partenaires", {
      method,
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setMsg(editing ? "Modifié ✓" : "Ajouté ✓");
      setForm(empty());
      setEditing(null);
      load();
    } else setMsg("Erreur");
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  }

  async function toggle(item: Partenaire) {
    await fetch("/api/gervis/partenaires", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ id: item.id, is_published: !item.is_published }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce partenaire ?")) return;
    await fetch("/api/gervis/partenaires", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ id }),
    });
    load();
  }

  function startEdit(item: Partenaire) {
    setEditing(item.id);
    setForm({ nom: item.nom, logo_url: item.logo_url ?? "", site_url: item.site_url ?? "", is_published: item.is_published, ordre: item.ordre });
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-black text-[#0A2342] mb-2">Entreprises partenaires</h1>
      <p className="text-gray-500 text-sm mb-8">Ces entreprises apparaissent dans la section "Ils nous font confiance" sur l'accueil.</p>

      {/* Formulaire */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
        <h2 className="font-bold text-[#0A2342] mb-4">{editing ? "Modifier" : "Ajouter un partenaire"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm" placeholder="Nom de l'entreprise *" value={form.nom ?? ""} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
          <input type="number" className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm" placeholder="Ordre d'affichage" value={form.ordre ?? 0} onChange={e => setForm(f => ({ ...f, ordre: Number(e.target.value) }))} />
          <div className="sm:col-span-2">
            <ImageUpload value={form.logo_url ?? ""} onChange={url => setForm(f => ({ ...f, logo_url: url }))} folder="partenaires" label="Logo" />
          </div>
          <input className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm" placeholder="Site web (optionnel)" value={form.site_url ?? ""} onChange={e => setForm(f => ({ ...f, site_url: e.target.value }))} />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving || !form.nom} className="px-5 py-2.5 bg-[#0A2342] text-white text-sm font-bold rounded-xl hover:bg-[#E8861A] transition-colors disabled:opacity-50 flex items-center gap-2">
            <Plus className="w-4 h-4" /> {saving ? "..." : editing ? "Modifier" : "Ajouter"}
          </button>
          {editing && <button onClick={() => { setEditing(null); setForm(empty()); }} className="px-4 py-2.5 border border-gray-200 text-sm rounded-xl hover:bg-gray-50"><X className="w-4 h-4" /></button>}
          {msg && <span className="text-sm text-green-600 font-semibold">{msg}</span>}
        </div>
      </div>

      {/* Liste */}
      {loading ? <p className="text-gray-500 text-sm">Chargement...</p> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-gray-400 text-sm text-center py-8">Aucun partenaire. Ajoutez-en un ci-dessus.</p>}
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
              {item.logo_url ? (
                <img src={item.logo_url} alt={item.nom} className="w-12 h-12 object-contain rounded-lg border border-gray-100" />
              ) : (
                <div className="w-12 h-12 bg-[#0A2342]/10 rounded-lg flex items-center justify-center text-[#0A2342] font-black text-sm">{item.nom.slice(0, 2).toUpperCase()}</div>
              )}
              <div className="flex-1">
                <p className="font-bold text-[#0A2342] text-sm">{item.nom}</p>
                {item.site_url && <p className="text-gray-400 text-xs">{item.site_url}</p>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggle(item)} className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${item.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {item.is_published ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => startEdit(item)} className="p-1.5 text-gray-400 hover:text-[#0A2342] rounded-lg hover:bg-gray-50"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => remove(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
