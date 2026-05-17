"use client";

import React from "react";
import {
  FileText,
  AlignLeft,
  Tag,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Globe,
  Building2,
  ShieldCheck,
  Users,
  Trash2,
  Hash,
  Star,
  Plus,
  X,
  Pencil,
  Save,
  SortAsc,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAdminLanguage } from "@/lib/language-context";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const categoryOptions = [
  { value: "government", icon: Building2, color: "#f97316" },
  { value: "infrastructure", icon: Globe, color: "#3b82f6" },
  { value: "social", icon: Users, color: "#8b5cf6" },
  { value: "security", icon: ShieldCheck, color: "#22c55e" },
];

const API = "http://localhost:4000/api/services";

type ServiceForm = {
  title: string;
  description: string;
  category: string;
  status: "active" | "hidden";
  isPopular: boolean;
  sortOrder: number;
};

const emptyForm: ServiceForm = {
  title: "",
  description: "",
  category: "general",
  status: "active",
  isPopular: false,
  sortOrder: 0,
};

export default function ServicesPage() {
  const { t } = useAdminLanguage();
  const ts = t.services;

  const { data, mutate } = useSWR(`${API}?all=true`, fetcher);
  const services: any[] = data?.data || [];

  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<ServiceForm>(emptyForm);
  const [submitted, setSubmitted] = React.useState(false);
  const [deleting, setDeleting] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const selectedCategory = categoryOptions.find((c) => c.value === form.category);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (svc: any) => {
    setEditingId(svc.id);
    setForm({
      title: svc.title || "",
      description: svc.description || "",
      category: svc.category || "general",
      status: svc.status || "active",
      isPopular: svc.isPopular || false,
      sortOrder: svc.sortOrder ?? 0,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setLoading(true);
    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `${API}/${editingId}` : API;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await mutate();
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setShowForm(false);
          setEditingId(null);
          setForm(emptyForm);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(ts.deleteConfirm)) return;
    setDeleting(id);
    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      await mutate();
    } finally {
      setDeleting(null);
    }
  };

  const togglePopular = async (svc: any) => {
    await fetch(`${API}/${svc.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPopular: !svc.isPopular }),
    });
    await mutate();
  };

  const toggleStatus = async (svc: any) => {
    const newStatus = svc.status === "active" ? "hidden" : "active";
    await fetch(`${API}/${svc.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    await mutate();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)" }}
            >
              <Sparkles size={16} style={{ color: "var(--primary)" }} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--primary)" }}>
              {ts.serviceInfoTitle}
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight" style={{ color: "var(--foreground)" }}>
            {ts.viewAll}
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {ts.subtitle}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
          style={{
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            boxShadow: "0 4px 16px -4px var(--primary)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          <Plus size={16} />
          {ts.createService}
        </button>
      </motion.div>

      {/* Success Banner */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden"
            style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}
          >
            <CheckCircle2 size={18} style={{ color: "rgb(34,197,94)" }} />
            <span className="text-sm font-bold" style={{ color: "rgb(34,197,94)" }}>
              {editingId ? "Service updated successfully!" : "Service created successfully!"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create / Edit Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="rounded-xl p-4 sm:p-5 space-y-4 max-w-3xl mx-auto w-full"
            style={{ background: "var(--card)", border: "1px solid var(--primary)", boxShadow: "0 4px 20px -8px color-mix(in srgb, var(--primary) 20%, transparent)" }}
          >
            {/* Form header */}
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base" style={{ color: "var(--foreground)" }}>
                {editingId ? ts.editBtn + " " + ts.serviceTitle : ts.title}
              </h3>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "var(--muted-foreground)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--muted)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest" style={{ color: "var(--foreground)" }}>
                    <FileText size={12} style={{ color: "var(--primary)" }} />
                    {ts.serviceTitle}
                  </label>
                  <input
                    type="text"
                    placeholder={ts.serviceTitlePlaceholder}
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    required
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all font-medium"
                    style={{
                      background: "var(--muted)",
                      border: `1px solid ${form.title ? "var(--primary)" : "var(--border)"}`,
                      color: "var(--foreground)",
                    }}
                  />
                </div>

                {/* Sort Order */}
                <div className="space-y-1.5">
                  <label className="flex items-center justify-between gap-1.5 text-[11px] font-black uppercase tracking-widest" style={{ color: "var(--foreground)" }}>
                    <span className="flex items-center gap-1.5"><SortAsc size={12} style={{ color: "var(--primary)" }} /> {ts.sortOrderLabel}</span>
                    <span className="text-[9px] lowercase font-semibold normal-case" style={{ color: "var(--muted-foreground)" }}>{ts.sortOrderHint}</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder={ts.sortOrderPlaceholder}
                    value={form.sortOrder}
                    onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all font-medium"
                    style={{
                      background: "var(--muted)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>



                {/* Visibility */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest" style={{ color: "var(--foreground)" }}>
                    {form.status === "active" ? <Eye size={12} style={{ color: "var(--primary)" }} /> : <EyeOff size={12} style={{ color: "var(--muted-foreground)" }} />}
                    {ts.visibilityStatus}
                  </label>
                  <div className="flex gap-1.5">
                    <button type="button" onClick={() => setForm((f) => ({ ...f, status: "active" }))}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all"
                      style={{
                        background: form.status === "active" ? "rgba(34,197,94,0.15)" : "var(--muted)",
                        color: form.status === "active" ? "rgb(34,197,94)" : "var(--muted-foreground)",
                        border: `1px solid ${form.status === "active" ? "rgb(34,197,94)" : "transparent"}`
                      }}>
                      <Eye size={12} /> {ts.active}
                    </button>
                    <button type="button" onClick={() => setForm((f) => ({ ...f, status: "hidden" }))}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all"
                      style={{
                        background: form.status === "hidden" ? "var(--secondary)" : "var(--muted)",
                        color: form.status === "hidden" ? "var(--foreground)" : "var(--muted-foreground)",
                        border: `1px solid ${form.status === "hidden" ? "var(--border)" : "transparent"}`
                      }}>
                      <EyeOff size={12} /> {ts.hidden}
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest" style={{ color: "var(--foreground)" }}>
                    <AlignLeft size={12} style={{ color: "var(--primary)" }} />
                    {ts.description}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={ts.descriptionPlaceholder}
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all resize-none font-medium"
                    style={{
                      background: "var(--muted)",
                      border: `1px solid ${form.description ? "var(--primary)" : "var(--border)"}`,
                      color: "var(--foreground)",
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 sm:justify-end border-t pt-3" style={{ borderColor: "var(--border)" }}>
                <button type="button"
                  onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg font-bold text-xs transition-all"
                  style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
                  {ts.discardChanges}
                </button>
                <button
                  type="submit"
                  disabled={!form.title || loading}
                  className="flex-1 sm:flex-none px-6 py-2 rounded-lg font-black text-xs transition-all flex items-center justify-center gap-1.5"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    opacity: (!form.title || loading) ? 0.5 : 1,
                  }}
                >
                  {editingId ? <><Save size={14} /> Save</> : <><CheckCircle2 size={14} /> {ts.createService}</>}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services Grid */}
      {services.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl"
          style={{ background: "var(--card)", border: "1px dashed var(--border)" }}
        >
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--primary) 8%, transparent)" }}>
            <Sparkles size={28} style={{ color: "var(--primary)" }} />
          </div>
          <p className="text-sm font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
            {ts.noServices}
          </p>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
            <Plus size={15} /> {ts.createService}
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {services
            .slice()
            .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((svc: any, index: number) => {
              const cat = categoryOptions.find((c) => c.value === svc.category);
              const Icon = cat?.icon || FileText;
              const color = cat?.color || "var(--primary)";

              return (
                <motion.div
                  key={svc.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative flex flex-col rounded-2xl p-5 transition-all hover:shadow-lg"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 2px 8px -4px rgba(0,0,0,0.08)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${color}55`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  {/* Top: Icon + order badge + status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                        style={{ background: `${color}18`, border: `1.5px solid ${color}30` }}
                      >
                        <Icon size={21} style={{ color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                            style={{ background: `${color}15`, color }}
                          >
                            {ts.orderLabel} #{svc.sortOrder ?? 0}
                          </span>
                        </div>
                        <span
                          className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mt-1 inline-block"
                          style={{
                            background: svc.status === "active" ? "rgba(34,197,94,0.1)" : "var(--muted)",
                            color: svc.status === "active" ? "rgb(34,197,94)" : "var(--muted-foreground)",
                          }}
                        >
                          {svc.status === "active" ? ts.activeBadge : ts.hiddenBadge}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => togglePopular(svc)}
                        title="Toggle popular"
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: svc.isPopular ? "#f59e0b" : "var(--muted-foreground)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--muted)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <Star size={14} fill={svc.isPopular ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => toggleStatus(svc)}
                        title="Toggle visibility"
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "var(--muted-foreground)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--muted)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        {svc.status === "active" ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => openEdit(svc)}
                        title={ts.editBtn}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "var(--muted-foreground)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--muted)"; e.currentTarget.style.color = "var(--primary)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(svc.id)}
                        disabled={deleting === svc.id}
                        title={ts.deleteBtn}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "rgb(239,68,68)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Service info */}
                  <h4 className="text-base font-black leading-tight mb-1.5" style={{ color: "var(--foreground)" }}>
                    {svc.title}
                  </h4>
                  {svc.description && (
                    <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: "var(--muted-foreground)" }}>
                      {svc.description}
                    </p>
                  )}

                  {/* Footer badges */}
                  <div className="mt-auto pt-3 flex items-center gap-2 flex-wrap" style={{ borderTop: "1px solid var(--border)" }}>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                      {ts[svc.category as keyof typeof ts] as string || svc.category}
                    </span>
                    {svc.isPopular && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1" style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
                        <Star size={9} fill="currentColor" /> {ts.popularBadge}
                      </span>
                    )}
                    <span className="ml-auto flex items-center gap-1 text-[10px] font-bold" style={{ color: "var(--muted-foreground)" }}>
                      <Hash size={10} />
                      {new Date(svc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              );
            })}
        </div>
      )}
    </div>
  );
}
