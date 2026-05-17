"use client";

import React from "react";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  ArrowRight,
} from "lucide-react";
import { StatsCard } from "@/components/ui/AdminCard";
import AdminCard from "@/components/ui/AdminCard";
import { motion } from "motion/react";
import { useAdminLanguage } from "@/lib/language-context";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Dashboard() {
  const { t } = useAdminLanguage();
  const td = t.dashboard;

  const { data: statsData } = useSWR("http://localhost:4000/api/messages/stats", fetcher, { refreshInterval: 5000 });
  const { data: servicesData } = useSWR("http://localhost:4000/api/services?limit=10", fetcher, { refreshInterval: 5000 });
  
  const stats = statsData?.data || { total: 0, new: 0, resolved: 0 };
  const totalServices = servicesData?.pagination?.total || 0;

  const recentActivity = [
    { id: 1, type: "status", user: "System", action: "Stats updated", time: "Just now", status: "Live" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h2 className="text-2xl font-black tracking-tight leading-none" style={{ color: "var(--foreground)" }}>
          {td.welcome}
        </h2>
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--primary)" }}>
          {td.subtitle}
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title={td.totalComplaints} value={stats.total.toString()} change="+12%" isPositive={true} icon={<FileText className="text-primary" size={18} />} iconBgColor="bg-primary/10" />
        <StatsCard title={td.pendingReports} value={stats.new.toString()} change="-4%" isPositive={false} icon={<Clock className="text-blue-500" size={18} />} iconBgColor="bg-blue-500/10" />
        <StatsCard title={td.resolvedReports} value={stats.resolved.toString()} change="+18%" isPositive={true} icon={<CheckCircle2 className="text-green-500" size={18} />} iconBgColor="bg-green-500/10" />
        <StatsCard title={td.totalServices} value={totalServices.toString()} change="+0%" isPositive={true} icon={<Users className="text-purple-500" size={18} />} iconBgColor="bg-purple-500/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analytics */}
        <AdminCard
          title={td.analyticsOverview}
          className="lg:col-span-2"
          headerAction={
            <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" /> {td.complaints}</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-500 inline-block" /> {td.resolved}</span>
            </div>
          }
        >
          <div
            className="h-[280px] flex items-center justify-center rounded-2xl border-2 border-dashed group transition-all"
            style={{ background: "color-mix(in srgb, var(--muted) 50%, transparent)", borderColor: "var(--border)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--primary) 50%, transparent)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <div className="text-center group-hover:scale-105 transition-transform duration-500">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg border"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              >
                <TrendingUp className="text-primary" size={24} />
              </div>
              <p className="font-black tracking-tight text-sm" style={{ color: "var(--foreground)" }}>{td.realtimeAnalytics}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "var(--muted-foreground)" }}>{td.loadingData}</p>
            </div>
          </div>
        </AdminCard>

        {/* Recent Activity */}
        <AdminCard title={td.recentActivity}>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-3 items-start pb-4 last:pb-0 last:border-0 border-b group cursor-pointer"
                style={{ borderColor: "var(--border)" }}
              >
                <div
                  className="h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-black group-hover:scale-110 transition-transform"
                  style={{
                    background: activity.type === "complaint" ? "color-mix(in srgb, var(--primary) 12%, transparent)" : activity.type === "status" ? "rgba(34,197,94,0.12)" : "rgba(59,130,246,0.12)",
                    color: activity.type === "complaint" ? "var(--primary)" : activity.type === "status" ? "rgb(34,197,94)" : "rgb(59,130,246)",
                  }}
                >
                  {activity.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-snug" style={{ color: "var(--foreground)" }}>
                    <span className="font-black">{activity.user}</span>{" "}
                    <span style={{ color: "var(--muted-foreground)" }}>{activity.action}</span>
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest mt-1" style={{ color: "var(--muted-foreground)" }}>{activity.time}</p>
                </div>
                <span
                  className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex-shrink-0"
                  style={{
                    background: activity.status === "New" ? "var(--primary)" : "var(--muted)",
                    color: activity.status === "New" ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  }}
                >
                  {activity.status}
                </span>
              </motion.div>
            ))}
            <button
              className="w-full py-3 flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
              style={{ color: "var(--primary)", background: "color-mix(in srgb, var(--primary) 6%, transparent)", border: "1.5px solid color-mix(in srgb, var(--primary) 15%, transparent)" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--primary) 35%, transparent)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "color-mix(in srgb, var(--primary) 15%, transparent)"; }}
            >
              {td.viewAllActivity} <ArrowRight size={12} />
            </button>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
