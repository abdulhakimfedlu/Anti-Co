"use client";

import React from "react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  MailOpen, 
  Trash2, 
  ChevronRight,
  MapPin,
  Calendar,
  Shield,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAdminLanguage } from "@/lib/language-context";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Messages() {
  const { t, locale } = useAdminLanguage();
  const tm = t.messages;

  const [activeTab, setActiveTab] = React.useState<"new" | "resolved">("new");
  
  const { data, error, mutate } = useSWR(`http://localhost:4000/api/messages?status=${activeTab}&limit=50`, fetcher);
  const activeMessages = data?.data || [];

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Auto-select first message when data loads
  React.useEffect(() => {
    if (activeMessages.length > 0 && !selectedId) {
      setSelectedId(activeMessages[0].id);
    }
  }, [activeMessages, selectedId]);

  const filteredMessages = activeMessages.filter((msg: any) => {
    if (!searchQuery.trim()) return true;
    
    let query = searchQuery.trim().toLowerCase();
    if (query.startsWith('#')) {
      query = query.substring(1);
    }
    
    // Match code (reference code / coupon code like #9A2F)
    const shortCode = msg.id.split("-")[0].toUpperCase();
    const fullId = msg.id.toLowerCase();
    
    // Match name (senderName) - supporting localized translations for anonymous submissions
    const namesToMatch = (msg.isAnonymous || !msg.senderName 
      ? ["anonymous", "ስውር", "ስም-አልባ"] 
      : [msg.senderName.toLowerCase()]
    );
    
    // Match subject and body content
    const subject = (msg.subject || "").toLowerCase();
    const body = (msg.body || "").toLowerCase();
    
    const matchesCode = shortCode.toLowerCase().includes(query) || fullId.includes(query);
    const matchesName = namesToMatch.some((n: string) => n.includes(query));
    const matchesContent = subject.includes(query) || body.includes(query);
    
    return matchesCode || matchesName || matchesContent;
  });

  const selectedMessage = filteredMessages.find((m: any) => m.id === selectedId) || filteredMessages[0];

  const handleSelectMessage = (id: string) => {
    setSelectedId(id);
    setIsDetailOpen(true);
  };

  const handleMarkResolved = async (id: string) => {
    // Optimistic UI update
    mutate({ ...data, data: activeMessages.filter((m: any) => m.id !== id) }, false);
    
    await fetch(`http://localhost:4000/api/messages/${id}/resolve`, {
      method: "PATCH",
    });
    
    mutate(); // Re-fetch
    setIsDetailOpen(false);
  };

  const handleDelete = async (id: string) => {
    // Optimistic UI update
    mutate({ ...data, data: activeMessages.filter((m: any) => m.id !== id) }, false);
    
    await fetch(`http://localhost:4000/api/messages/${id}`, {
      method: "DELETE",
    });
    
    mutate(); // Re-fetch
    setIsDetailOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] gap-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 flex-shrink-0">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: "var(--foreground)" }}>{tm.title}</h2>
          <div className="flex items-center gap-4 mt-2">
            {(["new", "resolved"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="text-xs font-black uppercase tracking-widest transition-all relative pb-1.5"
                style={{ color: activeTab === tab ? "var(--primary)" : "var(--muted-foreground)" }}
                suppressHydrationWarning
              >
                {tab === "new" ? tm.newMessages : tm.resolved}
                {activeTab === tab && (
                  <motion.div layoutId="tab-ul" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "var(--primary)" }} />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={14} style={{ color: "var(--muted-foreground)" }} />
            <input
              type="text"
              placeholder={tm.searchPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none transition-all"
              style={{ background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              suppressHydrationWarning
            />
          </div>
          <button
            className="p-2 rounded-xl transition-colors"
            style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
            suppressHydrationWarning
          >
            <Filter size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 overflow-hidden">
        {/* ── Message List ─────────────────────────────── */}
        <div className={`lg:col-span-5 xl:col-span-4 flex flex-col gap-2 overflow-y-auto pr-0.5 custom-scrollbar ${isDetailOpen ? 'hidden lg:flex' : 'flex'}`}>
          {filteredMessages.length > 0 ? filteredMessages.map((msg: any, i: number) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSelectMessage(msg.id)}
              className="p-4 rounded-2xl border transition-all cursor-pointer relative group"
              style={{
                background: "var(--card)",
                border: selectedId === msg.id ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                boxShadow: selectedId === msg.id ? "0 4px 20px -4px color-mix(in srgb, var(--primary) 25%, transparent)" : "none",
              }}
            >
              {/* Active left bar */}
              {selectedId === msg.id && (
                <div className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full" style={{ background: "var(--primary)" }} />
              )}
              {/* Unread dot */}
              {!msg.isRead && activeTab === "new" && (
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full" style={{ background: "var(--primary)", boxShadow: "0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent)" }} />
              )}

              <div className="flex items-center gap-3 mb-2.5">
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{
                    background: msg.isAnonymous ? "var(--muted)" : "color-mix(in srgb, var(--primary) 12%, transparent)",
                    color: msg.isAnonymous ? "var(--muted-foreground)" : "var(--primary)",
                  }}
                >
                  {msg.isAnonymous || !msg.senderName ? "A" : msg.senderName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black leading-none truncate" style={{ color: "var(--foreground)" }}>{msg.isAnonymous || !msg.senderName ? "Anonymous" : msg.senderName}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{new Date(msg.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <h4 className="text-sm font-bold mb-1 truncate" style={{ color: selectedId === msg.id ? "var(--primary)" : "var(--foreground)" }}>
                {msg.subject}
              </h4>
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--muted-foreground)" }}>
                {msg.body}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold uppercase" style={{ background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
                  {msg.category}
                </span>
                <span
                  className="px-2 py-0.5 rounded-lg text-[11px] font-bold uppercase"
                  style={{
                    background: msg.priority === "Urgent" ? "rgb(239 68 68 / 0.1)" : msg.priority === "High" ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "var(--muted)",
                    color: msg.priority === "Urgent" ? "rgb(239 68 68)" : msg.priority === "High" ? "var(--primary)" : "var(--muted-foreground)",
                  }}
                >
                  {msg.priority}
                </span>
              </div>
            </motion.div>
          )) : (
            <div className="flex flex-col items-center justify-center py-16 text-center opacity-40">
              <MailOpen className="h-10 w-10 mb-3" style={{ color: "var(--muted-foreground)" }} />
              <p className="text-sm font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>{tm.noMessages}</p>
            </div>
          )}
        </div>

        {/* ── Message Detail ────────────────────────────── */}
        <div
          className={`lg:col-span-7 xl:col-span-8 rounded-2xl flex flex-col overflow-hidden ${isDetailOpen ? 'flex' : 'hidden lg:flex'}`}
          style={{ border: "1px solid var(--border)", background: "var(--card)" }}
        >
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedId}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col h-full"
              >
                {/* Detail Header */}
                <div
                  className="p-4 sm:p-5 flex items-center justify-between sticky top-0 z-10"
                  style={{ borderBottom: "1px solid var(--border)", background: "color-mix(in srgb, var(--card) 90%, transparent)", backdropFilter: "blur(10px)" }}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsDetailOpen(false)}
                      className="lg:hidden p-2 rounded-xl transition-colors"
                      style={{ color: "var(--muted-foreground)" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--muted)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-base"
                      style={{ background: "color-mix(in srgb, var(--primary) 12%, transparent)", color: "var(--primary)", border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)" }}
                    >
                      {selectedMessage.isAnonymous || !selectedMessage.senderName ? "A" : selectedMessage.senderName[0]}
                    </div>
                    <div>
                      <h3 className="text-base font-black" style={{ color: "var(--foreground)" }}>{selectedMessage.isAnonymous || !selectedMessage.senderName ? "Anonymous" : selectedMessage.senderName}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: selectedMessage.isAnonymous ? "var(--muted-foreground)" : "rgb(34,197,94)" }} />
                        <p className="text-xs font-bold" style={{ color: "var(--muted-foreground)" }}>
                          {selectedMessage.isAnonymous ? tm.identityProtected : tm.verifiedCitizen}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-2 rounded-xl transition-colors"
                      style={{ color: "var(--muted-foreground)" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--muted)"; e.currentTarget.style.color = "var(--primary)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
                    >
                      {selectedMessage.isRead ? <MailOpen size={18} /> : <Mail size={18} />}
                    </button>
                    {activeTab === "resolved" && (
                      <button
                        onClick={() => handleDelete(selectedMessage.id)}
                        className="p-2 rounded-xl transition-colors"
                        style={{ color: "rgb(239,68,68)" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgb(239 68 68 / 0.08)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    <button
                      className="p-2 rounded-xl transition-colors"
                      style={{ color: "var(--muted-foreground)" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "var(--muted)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                {/* Meta bar */}
                <div
                  className="px-5 py-3 flex flex-wrap gap-4 items-center"
                  style={{ borderBottom: "1px solid var(--border)", background: "color-mix(in srgb, var(--muted) 40%, transparent)" }}
                >
                  {[
                    { icon: <Calendar size={13} />, label: new Date(selectedMessage.createdAt).toLocaleString() },
                    { icon: <MapPin size={13} />, label: tm.location },
                    { icon: <Shield size={13} />, label: `${tm.reference}: #${selectedMessage.id.split("-")[0].toUpperCase()}` },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
                      <span style={{ color: "var(--primary)" }}>{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </div>

                {/* Content */}
                <div className="flex-1 p-5 sm:p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                  <div>
                    <h2 className="text-lg font-black mb-4 leading-snug" style={{ color: "var(--foreground)" }}>{selectedMessage.subject}</h2>
                    <div className="space-y-4 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                      <div
                        className="p-4 rounded-xl text-sm italic leading-relaxed whitespace-pre-wrap"
                        style={{ background: "color-mix(in srgb, var(--primary) 5%, transparent)", borderLeft: "3px solid var(--primary)", color: "var(--foreground)" }}
                      >
                        {selectedMessage.body}
                      </div>
                    </div>
                  </div>

                  {/* Additional Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    {/* Reporter Information (only if not anonymous) */}
                    {!selectedMessage.isAnonymous && (
                      <div className="p-5 rounded-2xl border bg-muted/10 flex flex-col gap-4" style={{ borderColor: "var(--border)" }}>
                        <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                          <div className="h-2 w-2 rounded-full" style={{ background: "var(--primary)" }} />
                          <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
                            {locale === "am" ? "የጠቋሚው ግላዊ መረጃ" : "Reporter Personal Details"}
                          </h4>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs leading-relaxed">
                          <div>
                            <p className="font-bold" style={{ color: "var(--muted-foreground)" }}>{locale === "am" ? "ሙሉ ስም" : "Full Name"}</p>
                            <p className="font-extrabold mt-0.5" style={{ color: "var(--foreground)" }}>{selectedMessage.senderName || "N/A"}</p>
                          </div>
                          <div>
                            <p className="font-bold" style={{ color: "var(--muted-foreground)" }}>{locale === "am" ? "ስልክ ቁጥር" : "Phone Number"}</p>
                            <p className="font-extrabold mt-0.5" style={{ color: "var(--foreground)" }}>{selectedMessage.senderEmail || "N/A"}</p>
                          </div>
                          <div>
                            <p className="font-bold" style={{ color: "var(--muted-foreground)" }}>{locale === "am" ? "ጾታ" : "Gender"}</p>
                            <p className="font-extrabold mt-0.5" style={{ color: "var(--foreground)" }}>{selectedMessage.gender || "N/A"}</p>
                          </div>
                          <div>
                            <p className="font-bold" style={{ color: "var(--muted-foreground)" }}>{locale === "am" ? "ዕድሜ" : "Age"}</p>
                            <p className="font-extrabold mt-0.5" style={{ color: "var(--foreground)" }}>{selectedMessage.age || "N/A"}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="font-bold" style={{ color: "var(--muted-foreground)" }}>{locale === "am" ? "የትምህርት ደረጃ" : "Education Level"}</p>
                            <p className="font-extrabold mt-0.5" style={{ color: "var(--foreground)" }}>{selectedMessage.educationLevel || "N/A"}</p>
                          </div>
                          <div>
                            <p className="font-bold" style={{ color: "var(--muted-foreground)" }}>{locale === "am" ? "ክፍለ ከተማ" : "Subcity"}</p>
                            <p className="font-extrabold mt-0.5" style={{ color: "var(--foreground)" }}>{selectedMessage.subcity || "N/A"}</p>
                          </div>
                          <div>
                            <p className="font-bold" style={{ color: "var(--muted-foreground)" }}>{locale === "am" ? "ወረዳ" : "Woreda"}</p>
                            <p className="font-extrabold mt-0.5" style={{ color: "var(--foreground)" }}>{selectedMessage.woreda || "N/A"}</p>
                          </div>
                          <div>
                            <p className="font-bold" style={{ color: "var(--muted-foreground)" }}>{locale === "am" ? "የቤት ቁጥር" : "House Number"}</p>
                            <p className="font-extrabold mt-0.5" style={{ color: "var(--foreground)" }}>{selectedMessage.houseNumber || "N/A"}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="font-bold" style={{ color: "var(--muted-foreground)" }}>{locale === "am" ? "ልዩ ቦታ" : "Specific Place"}</p>
                            <p className="font-extrabold mt-0.5" style={{ color: "var(--foreground)" }}>{selectedMessage.specificPlace || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Complaint/Injustice details (Suspect & Location) */}
                    <div className={`p-5 rounded-2xl border bg-muted/10 flex flex-col gap-4 ${selectedMessage.isAnonymous ? 'col-span-2' : ''}`} style={{ borderColor: "var(--border)" }}>
                      <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: "var(--foreground)" }}>
                          {locale === "am" ? "የጥቆማ/ሪፖርት ዝርዝር መረጃ" : "Report & Suspect Details"}
                        </h4>
                      </div>
                      
                      <div className="space-y-4 text-xs leading-relaxed">
                        <div>
                          <p className="font-bold text-red-500/80 dark:text-red-400/80" style={{ color: "var(--muted-foreground)" }}>
                            {locale === "am" ? "የተጠርጣሪው/የሪፖርት የተደረገው ሰው ስም" : "Name of Suspected / Reported Person"}
                          </p>
                          <p className="text-sm font-extrabold mt-1 text-red-500 dark:text-red-400">
                            {selectedMessage.suspectName || (locale === "am" ? "ያልተጠቀሰ" : "Not Specified")}
                          </p>
                        </div>
                        
                        <div>
                          <p className="font-bold" style={{ color: "var(--muted-foreground)" }}>
                            {locale === "am" ? "ድርጊቱ የተፈጸመበት (ክፍለ ከተማ / ወረዳ)" : "Injustice Occurred At (Subcity / Woreda)"}
                          </p>
                          <p className="font-extrabold mt-1" style={{ color: "var(--foreground)" }}>
                            {selectedMessage.incidentLocation || (locale === "am" ? "ያልተጠቀሰ" : "Not Specified")}
                          </p>
                        </div>

                        {selectedMessage.isAnonymous && (
                          <div className="p-3.5 rounded-xl border border-dashed flex items-center gap-2.5 bg-background/50 mt-2" style={{ borderColor: "var(--border)" }}>
                            <Shield size={16} className="text-muted-foreground flex-shrink-0" />
                            <p className="text-[11px] font-semibold" style={{ color: "var(--muted-foreground)" }}>
                              {locale === "am"
                                ? "ይህ ጥቆማ በስውር የቀረበ በመሆኑ የጠቋሚው ግላዊ መረጃ ጥበቃ ተደርጎበታል።"
                                : "This tip was submitted anonymously; reporter personal information is fully protected."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions footer */}
                <div
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3"
                  style={{ borderTop: "1px solid var(--border)", background: "color-mix(in srgb, var(--card) 90%, transparent)", backdropFilter: "blur(10px)" }}
                >
                  <div className="flex gap-2 w-full sm:w-auto">
                    {activeTab === "new" ? (
                      <button
                        onClick={() => handleMarkResolved(selectedMessage.id)}
                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2"
                        style={{ background: "rgb(34,197,94)", color: "#fff", boxShadow: "0 4px 14px -4px rgb(34 197 94 / 0.4)" }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = "0.9"; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                      >
                        <CheckCircle2 size={16} />
                        {tm.markResolved}
                      </button>
                    ) : (
                      <div
                        className="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl"
                        style={{ background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
                      >
                        {tm.resolvedLabel}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const idx = filteredMessages.findIndex((m: any) => m.id === selectedId);
                      const next = filteredMessages[(idx + 1) % filteredMessages.length];
                      if (next) setSelectedId(next.id);
                    }}
                    className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-all group"
                    style={{ color: "var(--muted-foreground)" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "var(--primary)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "var(--muted-foreground)"; }}
                  >
                    {tm.nextMessage} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center" style={{ opacity: 0.25 }}>
                <Shield size={56} className="mb-4" style={{ color: "var(--muted-foreground)" }} />
                <h3 className="text-base font-black uppercase tracking-tight" style={{ color: "var(--foreground)" }}>{tm.noReportSelected}</h3>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
