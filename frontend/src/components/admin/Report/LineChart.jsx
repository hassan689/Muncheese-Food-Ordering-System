import { useState, useEffect, useMemo } from 'react'
import "../../../styles/components/admin/Reports/LineChart.css"

const LineChart = ({ data, activeTab, onTabChange }) => {
  const [animation, setAnimation] = useState(0)

  const tabs = ["Confirmed", "Cancelled"]
  const colors = { Confirmed: "#333", Cancelled: "#ffb800" }

  // Current tab dataset
  const currentData = useMemo(() => {
    if (!data) return null
    return data[activeTab.toLowerCase()]
  }, [data, activeTab])

  // Build SVG line + area
  const chart = useMemo(() => {
    if (!currentData || currentData.length === 0) return null

    const padding = 40
    const w = 400 - padding * 2
    const h = 160
    const max = Math.max(...currentData.map(d => d.value))

    // Convert raw items → points
    const points = currentData.map((d, i) => {
      const x = padding + (i * (w / (currentData.length - 1)))
      const y = h - (d.value / max) * h + 10
      return { x, y, month: d.month, value: d.value }
    })

    // Build line path
    const line = points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(" ")

    // Area fill path
    const area =
      `${line} L ${points[points.length - 1].x} ${h + 10} ` +
      `L ${points[0].x} ${h + 10} Z`

    return { line, area, points, max }
  }, [currentData])

  // Animate on tab change
  useEffect(() => {
    setAnimation(0)
    const t = setTimeout(() => setAnimation(1), 120)
    return () => clearTimeout(t)
  }, [activeTab, data])

  if (!chart) {
    return (
      <div className="chart-card trend-chart">
        <h3 className="chart-title">Trend Analysis</h3>
        <p>No data available</p>
      </div>
    )
  }

  return (
    <div className="chart-card trend-chart">
      
      {/* Tabs */}
      <div className="chart-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`chart-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="line-chart-container">
        <svg viewBox="0 0 400 200" className="line-chart-svg">

          <defs>
            <linearGradient id={`grad-${activeTab}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors[activeTab]} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colors[activeTab]} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <line
              key={i}
              x1="40"
              y1={160 - i * 30}
              x2="380"
              y2={160 - i * 30}
              stroke="#e0e0e0"
              strokeWidth="1"
            />
          ))}

          {/* X-axis labels */}
          {chart.points.map((p, i) => (
            <text
              key={p.month}
              x={p.x}
              y={190}
              fontSize="10"
              fill="#666"
              textAnchor="middle"
            >
              {p.month}
            </text>
          ))}

          {/* Y-axis labels */}
          {[0, 1, 2, 3, 4, 5].map(i => {
            const v = (chart.max / 5) * i
            return (
              <text
                key={i}
                x="20"
                y={165 - i * 30}
                fontSize="10"
                fill="#666"
                textAnchor="end"
              >
                {(v / 1000).toFixed(1)}k
              </text>
            )
          })}

          {/* Area */}
          <path
            d={chart.area}
            fill={`url(#grad-${activeTab})`}
            style={{
              opacity: animation,
              transition: "opacity 0.5s ease-out"
            }}
          />

          {/* Line */}
          <path
            d={chart.line}
            fill="none"
            stroke={colors[activeTab]}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 1000 * (1 - animation),
              transition: "stroke-dashoffset 0.8s ease-out"
            }}
          />

          {/* Points */}
          {chart.points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill={colors[activeTab]}
                style={{
                  opacity: animation,
                  transition: `opacity 0.5s ease-out ${i * 0.05}s`
                }}
              />

              {/* Last point highlight */}
              {i === chart.points.length - 1 && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="6"
                  fill="none"
                  stroke={colors[activeTab]}
                  strokeWidth="2"
                  style={{ opacity: animation }}
                />
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}

export default LineChart
