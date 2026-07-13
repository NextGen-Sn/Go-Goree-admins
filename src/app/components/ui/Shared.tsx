import React from "react";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell, AreaChart, Area, PieChart as RPieChart, Pie, Legend } from "recharts";
import { cn, StatusBadge } from "@/app/components/layout/common";

export function KPICard({ title, value, sub, icon: Icon, trend, color }: {
  title: string; value: string; sub: string; icon: React.ElementType; trend?: { val: string; up: boolean }; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="bg-white dark:bg-card rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{value}</p>
        </div>
        <div className="size-11 rounded-xl flex items-center justify-center" style={{ background: color + "20" }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {trend && (
          <span className={cn("flex items-center gap-0.5 text-xs font-semibold", trend.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400")}>
            {trend.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.val}
          </span>
        )}
        <span className="text-xs text-slate-400 dark:text-slate-500">{sub}</span>
      </div>
    </motion.div>
  );
}

export function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-card rounded-xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Btn({ label, icon: Icon, variant = "primary", onClick }: { label: string; icon?: React.ElementType; variant?: "primary" | "secondary" | "ghost" | "danger"; onClick?: () => void; }) {
  const base = "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer";
  const vars: Record<string, string> = {
    primary: "text-white shadow-sm hover:opacity-90",
    secondary: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700",
    ghost: "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };
  return (
    <button
      className={cn(base, vars[variant])}
      style={variant === "primary" ? { background: "linear-gradient(135deg, #1A56DB, #0BA5C0)" } as React.CSSProperties : undefined}
      onClick={onClick}
    >
      {Icon && <Icon size={15} />}
      {label}
    </button>
  );
}

export function Table({ cols, rows }: { cols: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-700">
            {cols.map((c, i) => (
              <th key={i} className="text-left py-3 px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SearchBar({ placeholder }: { placeholder?: string }) {
  return (
    <div className="relative">
      <SearchIcon />
      <input
        className="pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:border-blue-400 w-64 placeholder:text-slate-400"
        placeholder={placeholder ?? "Rechercher..."}
      />
    </div>
  );
}

function SearchIcon() { return <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> }

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white dark:bg-card rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm p-5", className)}>
      {children}
    </div>
  );
}

export function OccBar({ val }: { val: number }) {
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${val}%`, background: `linear-gradient(90deg, #1035A8, #0BA5C0)` }} />
      </div>
      <span className="text-xs font-mono text-slate-600 w-8 text-right">{val}%</span>
    </div>
  );
}

export { StatusBadge };

export default {} as never;
