import { useMemo, useState } from "react";
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
  ReferenceLine,
} from "recharts";

import "../../../styles/components/admin/Dashboard/AdminOverviewChart.css";

const AdminOverviewChart = ({ dailyData, weeklyData, monthlyData, marginTop = "120px" }) => {
  const [period, setPeriod] = useState("monthly");
  const [activeX, setActiveX] = useState(null);

  const chartData = useMemo(() => {
    if (period === "daily") {
      return dailyData
    }

    if (period === "weekly") {
      return weeklyData;
    }

    return monthlyData
  }, [period]);

  const handleMouseMove = (state) => {
    setActiveX(state?.activeLabel || null);
  };

  return (
    <Card style={{ marginTop }}>
      <div className="overview-header">
        <h2>Overview</h2>

        <div className="period-controls">
          <Button
            variant={period === "monthly" ? "adminPrimary" : "adminSecondary"}
            onClick={() => setPeriod("monthly")}
          >
            Monthly
          </Button>

          <Button
            variant={period === "daily" ? "adminPrimary" : "adminSecondary"}
            onClick={() => setPeriod("daily")}
          >
            Daily
          </Button>

          <Button
            variant={period === "weekly" ? "adminPrimary" : "adminSecondary"}
            onClick={() => setPeriod("weekly")}
          >
            Weekly
          </Button>

          <Button variant="adminSecondary">Export</Button>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setActiveX(null)}
            margin={{ top: 8, right: 60, left: 40, bottom: 20 }}
          >
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.03} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="label"
              tickFormatter={(v) => {
                if (period === "monthly") return v;
                const d = new Date(v);
                return d.toLocaleDateString(undefined, {
                  month: "short",
                  day: "2-digit",
                });
              }}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tickFormatter={(v) =>
                v >= 1000 ? `${Math.round(v / 100) / 10}k` : v
              }
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={({ payload, label }) => {
                const sales = payload?.[0]?.value;
                return (
                  <div className="tooltip-box">
                    <div>{label}</div>
                    <div style={{ color: "#fbbf24" }}>Sales: {sales}</div>
                  </div>
                );
              }}
            />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#fbbf24"
              strokeWidth={3}
              fill="url(#salesGrad)"
              dot={false}
              activeDot={{ r: 6, stroke: "#fff", strokeWidth: 3 }}
            />

            {activeX && (
              <ReferenceLine
                x={activeX}
                stroke="#fbbf24"
                strokeDasharray="3 3"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AdminOverviewChart;
