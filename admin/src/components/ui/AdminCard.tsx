"use client";

import React from "react";
import { motion } from "motion/react";

interface AdminCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export default function AdminCard({ title, children, className = "", headerAction }: AdminCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`admin-card ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-bold" style={{ color: "var(--foreground)" }}>{title}</h3>
        {headerAction}
      </div>
      <div>{children}</div>
    </motion.div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  iconBgColor?: string;
}

export function StatsCard({ title, value, change, isPositive, icon, iconBgColor = "bg-primary/10" }: StatsCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3 }}
      className="admin-card flex items-start gap-4"
    >
      <div className={`h-11 w-11 rounded-2xl ${iconBgColor} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium mb-1" style={{ color: "var(--muted-foreground)" }}>{title}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>{value}</h4>
          {change && (
            <span className={`text-xs font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{change}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
