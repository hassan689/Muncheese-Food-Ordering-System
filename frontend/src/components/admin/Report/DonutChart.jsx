import { useState, useEffect, useMemo } from 'react'
import "../../../styles/components/admin/Reports/DonutChart.css"

const DonutChart = ({ data }) => {
  const [animationProgress, setAnimationProgress] = useState(0)

  // Compute chart values
  const chartMetrics = useMemo(() => {
    if (!data) return null

    const { confirmed, cancelled } = data
    const total = confirmed + cancelled

    if (total === 0) return null

    const CIRC = 314 // circumference of r=50
    const baseSegments = [
      { label: "Confirmed", value: confirmed, color: "#333" },
      { label: "Cancelled", value: cancelled, color: "#ffb800" }
    ]

    let offset = 0
    const segments = baseSegments.map(seg => {
      const dash = (seg.value / total) * CIRC

      const decorated = {
        ...seg,
        percentage: (seg.value / total) * 100,
        dashArray: dash,
        dashOffset: -offset
      }

      offset += dash
      return decorated
    })

    return { total, segments }
  }, [data])

  // Animation
  useEffect(() => {
    setAnimationProgress(0)
    const t = setTimeout(() => setAnimationProgress(1), 100)
    return () => clearTimeout(t)
  }, [data])

  if (!chartMetrics) {
    return (
      <div className="chart-card order-chart">
        <h3 className="chart-title">Total Order</h3>
        <p>No data available</p>
      </div>
    )
  }

  return (
    <div className="chart-card order-chart">
      <h3 className="chart-title">Total Order</h3>

      <div className="donut-chart-container">
        <div className="donut-chart">
          <svg viewBox="0 0 120 120" className="donut-svg">
            {/* Background */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#f5f5f5"
              strokeWidth="20"
            />

            {/* Segments */}
            {chartMetrics.segments.map(seg => (
              <circle
                key={seg.label}
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={seg.color}
                strokeWidth="20"
                strokeDasharray={`${seg.dashArray * animationProgress} 314`}
                strokeDashoffset={seg.dashOffset}
                transform="rotate(-90 60 60)"
                style={{
                  transition: "stroke-dasharray 0.8s ease-out, stroke-dashoffset 0.8s ease-out"
                }}
              />
            ))}
          </svg>

          <div className="donut-center">
            <span className="donut-total">Total</span>
            <span className="donut-value">{chartMetrics.total}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="chart-legend">
          {chartMetrics.segments.map(seg => (
            <div key={seg.label} className="legend-item">
              <span className="legend-color" style={{ background: seg.color }} />
              <span className="legend-label">
                {seg.label}
                <span className="legend-value">
                  {seg.value} ({seg.percentage.toFixed(1)}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DonutChart
