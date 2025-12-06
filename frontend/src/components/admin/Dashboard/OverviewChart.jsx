import React, { useEffect, useMemo, useRef, useState } from "react";
import Card from "../../ui/Card";
import Button from "../../ui/Button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from "recharts";
import {generateYearDailyData, aggregateMonthly, aggregateWeekly}  from "../../../utils/generateData"
import "../../../styles/components/admin/Dashboard/OverviewChart.css";
import {ADMIN_COLORS} from "../../../utils/constants";


/* ---------- small number formatter
Converts numbers to a shorter format for readability.
Example: 1500 → 1.5k
Used in Y-axis and tooltip formatting.
---------- */
const fmt = (v) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : v);

const AdminOverviewChart = ({ color = ADMIN_COLORS.Secondary, marginTop = "120px", simulate = true }) => {
  const initial = useMemo(() => generateYearDailyData({ year: 2025 }), []); // React Component Re-redners when state changes. So, to prevent re computation we want this to run once on mount. The dependency array [] is empty, which ensures that it is not being depenedent on anything. On every re-render after that, it returns the cached initial value.
  const [period, setPeriod] = useState("monthly"); // current view mode: "daily", "weekly", or "monthly"
  const [dailyData, setDailyData] = useState(initial); // holds all the raw daily data. Without dailyData, the chart wouldn’t update when new data is appended.
  const [activeX, setActiveX] = useState(null); // the currently hovered X-coordinate on the chart (for the vertical guide line). Without state, hovering wouldn’t update the UI dynamically.

  /* 
  useMemo remembers the value of chartData until one of its dependencies changes (dailyData or period).
  It prevents recalculating chartData every render, which is useful if the computation is heavy.
  The chart can show daily, weekly, or monthly data.
  Depending on the selected period, we process dailyData differently.
  */
  const chartData = useMemo(() => {
    if (period === "daily") { // show most recent 30 days
      return dailyData.slice(-30).map((d) => ({ label: d.date, sales: d.sales, revenue: d.revenue }));
    } else if (period === "weekly") { // show recent 12 weeks
      return aggregateWeekly(dailyData).slice(-12).map((w, i) => ({ label: w.label, sales: w.sales, revenue: w.revenue }));
    } else { // monthly
      return aggregateMonthly(dailyData).map((m) => ({ label: m.label, sales: m.sales, revenue: m.revenue }));
    }
  }, [dailyData, period]);

  /* ---------- mouse handlers (for vertical guide) ---------- */
  const handleMouseMove = (state) => {
    if (state && state.activeLabel) setActiveX(state.activeLabel);
    else setActiveX(null);
  };
  const handleMouseLeave = () => setActiveX(null);

  return (
    <Card style={{ backgroundColor: color, marginTop }}>
      <div className="overview-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="overview-title">
          <h2>Overview</h2>
          <div className="chart-legend" style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <div className="legend-item" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: 8, background: "#fbbf24" }} />
              <span className="legend-label">Sales</span>
            </div>
            <div className="legend-item" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: 8, background: "#111827" }} />
              <span className="legend-label">Revenue</span>
            </div>
          </div>
        </div>

        <div className="period-controls" style={{ display: "flex", gap: 10 }}>
          <Button variant={period === "monthly" ? "adminPrimary" : "adminSecondary"} onClick={() => setPeriod("monthly")}>
            Monthly
          </Button>
          <Button variant={period === "daily" ? "adminPrimary" : "adminSecondary"} onClick={() => setPeriod("daily")}>
            Daily
          </Button>
          <Button variant={period === "weekly" ? "adminPrimary" : "adminSecondary"} onClick={() => setPeriod("weekly")}>
            Weekly
          </Button>
          <Button variant="adminSecondary">Export</Button>
        </div>
      </div>

      <div className="chart-container" style={{ width: "100%", height: 360, marginTop: 18 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            margin={{ top: 8, right: 60, left: 40, bottom: 20 }}
          >
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.03} />
              </linearGradient>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#111827" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#111827" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="label"
              tickFormatter={(v, idx) => {
                if (period === "monthly") return v;
                if (period === "weekly") return new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" });
                // daily: show short date (e.g., "Jan 05")
                return new Date(v).toLocaleDateString(undefined, { month: "short", day: "2-digit" });
              }}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 100) / 10}k` : v)}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={({ payload, label }) => {
                const sales = payload.find(p => p.dataKey === "sales")?.value;
                const revenue = payload.find(p => p.dataKey === "revenue")?.value;
                return (
                  <div style={{ background: "#fff", padding: 8, borderRadius: 6 }}>
                    <div style={{ marginBottom: 4}}>Date: {label}</div>
                    <div style={{ color: "#fbbf24" }}>Sales: {sales}</div>
                    <div style={{ color: "#111827" }}>Revenue: {revenue}</div>
                  </div>
                );
              }}
            />

            <Area type="monotone" dataKey="sales" stroke="#fbbf24" strokeWidth={3} fill="url(#salesGrad)" dot={false} activeDot={{ r: 6, stroke: "#fff", strokeWidth: 3 }} />
            <Area type="monotone" dataKey="revenue" stroke="#111827" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, stroke: "#fff", strokeWidth: 2 }} />

            {activeX && <ReferenceLine x={activeX} stroke="#fbbf24" strokeDasharray="3 3" />}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AdminOverviewChart;
