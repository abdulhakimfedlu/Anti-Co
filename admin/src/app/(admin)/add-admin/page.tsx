"use client";

import React from "react";
import {
  UserPlus, Mail, User, Shield, Trash2, CheckCircle2, Crown,
  RefreshCw, Lock, Eye, EyeOff, Loader2,
} from "lucide-react";
import AdminCard from "@/components/ui/AdminCard";
import { motion, AnimatePresence } from "motion/react";
import { useAdminLanguage } from "@/lib/language-context";
import { useUser, useAuth } from "@clerk/nextjs";
import { fetchPublic } from "@/lib/auth";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/providers/ToastProvider";
import useSWR from "swr";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

interface AdminRecord {
  id: string;
  fullName: string;
  email: string;
  role: "Super Admin" | "Admin" | "Viewer";
  isActive: boolean;
  clerkId: string | null;
  createdAt: string;
}

export default function AddAdmin() {
  const { t, locale } = useAdminLanguage();
  const ta = t.addAdmin;
  const { user } = useUser();
  const { getToken } = useAuth();
  const { success, error: toastError, warning, info } = useToast();

  // Form state
  const [form, setForm] = React.useState({ name: "", email: "", role: "Admin" });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Modal state
  const [deleteTarget, setDeleteTarget] = React.useState<AdminRecord | null>(null);
  const [transferTarget, setTransferTarget] = React.useState<AdminRecord | null>(null);
  const [transferPassword, setTransferPassword] = React.useState("");
  const [showTransferPassword, setShowTransferPassword] = React.useState(false);
  const [isTransferring, setIsTransferring] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // SWR fetch admins list
  const swrFetcher = async (url: string) => {
    const token = await getToken();
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("Failed to fetch admins");
    const data = await res.json();
    return data.data as AdminRecord[];
  };

  const { data: admins = [], mutate, isLoading: loadingAdmins } = useSWR(
    `${BACKEND}/api/admins`,
    swrFetcher,
    { refreshInterval: 10000 }
  );

  // Current logged-in admin's email
  const currentEmail = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase();
  const currentAdmin = admins.find(a => a.email === currentEmail);
  const isSuperAdmin = currentAdmin?.role === "Super Admin";

  const inputStyle = {
    background: "var(--muted)",
    border: "1px solid var(--border)",
    color: "var(--foreground)",
  };

  /** Add new admin */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) return;
    setIsSubmitting(true);
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND}/api/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fullName: form.name, email: form.email.toLowerCase(), role: form.role }),
      });
      const data = await res.json();
      if (!res.ok) {
        toastError("Failed to Add Admin", data.error || "An error occurred.");
        return;
      }
      success("Admin Added!", `${form.name} has been added. They can now sign up.`);
      setForm({ name: "", email: "", role: "Admin" });
      mutate();
    } catch {
      toastError("Network Error", "Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Delete admin */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const token = await getToken();
      const res = await fetch(`${BACKEND}/api/admins/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        toastError("Delete Failed", data.error || "Could not remove admin.");
        return;
      }
      success("Admin Removed", `${deleteTarget.fullName} has been removed.`);
      mutate();
    } catch {
      toastError("Network Error", "Could not connect to the server.");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  /** Transfer Super Admin role */
  const handleTransfer = async () => {
    if (!transferTarget || !transferPassword) return;
    setIsTransferring(true);
    try {
      // Verify current Super Admin's password via Clerk
      const { useSignIn } = await import("@clerk/nextjs");
      // We verify by checking with Clerk directly — simplified: just do the API call
      // The backend verifies the user is Super Admin via their Clerk JWT
      const token = await getToken();
      const res = await fetch(`${BACKEND}/api/admins/${transferTarget.id}/transfer-role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: transferPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toastError("Transfer Failed", data.error || "Could not transfer role.");
        return;
      }
      success("Role Transferred!", `${transferTarget.fullName} is now the Super Admin.`);
      mutate();
    } catch {
      toastError("Network Error", "Could not connect to the server.");
    } finally {
      setIsTransferring(false);
      setTransferTarget(null);
      setTransferPassword("");
    }
  };

  const roleColor = (role: string) => {
    if (role === "Super Admin") return { bg: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)" };
    if (role === "Admin") return { bg: "rgba(59,130,246,0.12)", color: "rgb(59,130,246)" };
    return { bg: "var(--muted)", color: "var(--muted-foreground)" };
  };

  const statusBadge = (admin: AdminRecord) => {
    if (!admin.isActive) return { label: "Inactive", bg: "rgba(239,68,68,0.1)", color: "rgb(239,68,68)" };
    if (!admin.clerkId) return { label: "Pending", bg: "rgba(234,179,8,0.1)", color: "rgb(234,179,8)" };
    return { label: "Active", bg: "rgba(34,197,94,0.1)", color: "rgb(34,197,94)" };
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>{ta.title}</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>{ta.subtitle}</p>
      </div>

      {/* Access notice if not Super Admin */}
      {!isSuperAdmin && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.3)" }}
        >
          <Shield size={18} style={{ color: "rgb(234,179,8)" }} />
          <p className="text-sm font-bold" style={{ color: "rgb(234,179,8)" }}>
            Only the Super Admin can add or remove admins.
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form — only visible to Super Admin */}
        {isSuperAdmin && (
          <div className="lg:col-span-2">
            <AdminCard title={ta.formTitle}>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                    <User size={14} style={{ color: "var(--muted-foreground)" }} /> {ta.fullName}
                  </label>
                  <input
                    type="text" placeholder={ta.fullNamePlaceholder} value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                    <Mail size={14} style={{ color: "var(--muted-foreground)" }} /> {ta.email}
                  </label>
                  <input
                    type="email" placeholder={ta.emailPlaceholder} value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
                  />
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
                    <Shield size={14} style={{ color: "var(--muted-foreground)" }} /> {ta.role}
                  </label>
                  <select
                    value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none appearance-none transition-all"
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
                  >
                    <option value="Admin">{ta.roleAdmin}</option>
                    <option value="Viewer">{ta.roleViewer}</option>
                  </select>
                </div>

                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)", boxShadow: "0 4px 14px -4px var(--primary)", opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                  {isSubmitting ? "Adding..." : ta.addAdminBtn}
                </button>
              </form>
            </AdminCard>
          </div>
        )}

        {/* Admins List */}
        <div className={isSuperAdmin ? "" : "lg:col-span-3"}>
          <AdminCard title={ta.existingTitle}>
            <div className="space-y-3">
              {loadingAdmins ? (
                <div className="text-center py-8">
                  <Loader2 size={24} className="animate-spin mx-auto" style={{ color: "var(--muted-foreground)" }} />
                </div>
              ) : admins.length === 0 ? (
                <div className="text-center py-8 text-sm font-medium" style={{ color: "var(--muted-foreground)" }}>
                  {locale === "am" ? "ምንም አስተዳዳሪዎች አልተጨመሩም" : "No admins added yet."}
                </div>
              ) : admins.map((admin, i) => {
                const rc = roleColor(admin.role);
                const sb = statusBadge(admin);
                const isCurrentUser = admin.email === currentEmail;
                return (
                  <motion.div
                    key={admin.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-3 pb-3 last:pb-0 last:border-0 border-b"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {/* Avatar */}
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                      style={{ background: rc.bg, color: rc.color }}
                    >
                      {admin.role === "Super Admin" ? <Crown size={16} /> : admin.fullName[0]}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold truncate" style={{ color: "var(--foreground)" }}>
                          {admin.fullName}
                          {isCurrentUser && <span className="ml-1 text-[9px] font-black uppercase tracking-wider" style={{ color: "var(--primary)" }}>(You)</span>}
                        </p>
                      </div>
                      <p className="text-[10px] truncate" style={{ color: "var(--muted-foreground)" }}>{admin.email}</p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span
                          className="inline-block text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                          style={{ background: rc.bg, color: rc.color }}
                        >
                          {admin.role}
                        </span>
                        <span
                          className="inline-block text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                          style={{ background: sb.bg, color: sb.color }}
                        >
                          {sb.label}
                        </span>
                      </div>
                    </div>

                    {/* Actions — only Super Admin can perform these */}
                    {isSuperAdmin && !isCurrentUser && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Transfer role — only for non-Super Admins */}
                        {admin.role !== "Super Admin" && (
                          <button
                            onClick={() => { setTransferTarget(admin); setTransferPassword(""); }}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: "var(--muted-foreground)" }}
                            title="Transfer Super Admin role"
                            onMouseEnter={e => { e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.background = "color-mix(in srgb, var(--primary) 8%, transparent)"; }}
                            onMouseLeave={e => { e.currentTarget.style.color = "var(--muted-foreground)"; e.currentTarget.style.background = "transparent"; }}
                          >
                            <Crown size={13} />
                          </button>
                        )}
                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget(admin)}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: "var(--muted-foreground)" }}
                          title="Remove admin"
                          onMouseEnter={e => { e.currentTarget.style.color = "rgb(239 68 68)"; e.currentTarget.style.background = "rgb(239 68 68 / 0.08)"; }}
                          onMouseLeave={e => { e.currentTarget.style.color = "var(--muted-foreground)"; e.currentTarget.style.background = "transparent"; }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Remove Admin"
        message={`Are you sure you want to remove "${deleteTarget?.fullName}"? They will no longer be able to access the admin portal.`}
        confirmLabel={isDeleting ? "Removing..." : "Remove Admin"}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Transfer Role Modal */}
      <ConfirmModal
        isOpen={!!transferTarget}
        title="Transfer Super Admin Role"
        message={`You are about to transfer the Super Admin role to "${transferTarget?.fullName}". You will be demoted to Admin. Enter your current password to confirm.`}
        confirmLabel={isTransferring ? "Transferring..." : "Transfer Role"}
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={handleTransfer}
        onCancel={() => { setTransferTarget(null); setTransferPassword(""); }}
      >
        <div className="space-y-1.5">
          <label className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--foreground)" }}>
            <Lock size={13} style={{ color: "var(--muted-foreground)" }} /> Your Current Password
          </label>
          <div className="relative">
            <input
              type={showTransferPassword ? "text" : "password"}
              value={transferPassword}
              onChange={e => setTransferPassword(e.target.value)}
              placeholder="Enter your password to confirm"
              className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "var(--muted)",
                border: "1.5px solid var(--border)",
                color: "var(--foreground)",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "rgb(234,179,8)"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
            />
            <button
              type="button"
              onClick={() => setShowTransferPassword(!showTransferPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--muted-foreground)" }}
            >
              {showTransferPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
      </ConfirmModal>
    </div>
  );
}
