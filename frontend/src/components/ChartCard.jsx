import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function ChartCard({
  title,
  subtitle,
  data = [], // [{ label: '12 Sep', value: 1390 }]
  type = 'line', // 'line' or 'bar'
  filter = null,
  onFilterChange = null,
  filterOptions = ['Today', 'This Week', 'This Month'],
  height = 240
}) {
  const { t } = useLanguage();
  const [hoverIndex, setHoverIndex] = useState(null);

  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value), 100) : 1000;
  const padding = { top: 25, right: 20, bottom: 35, left: 60 };
  const width = 600; // viewBox coordinate space

  // SVG dimensions
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Compute points
  const points = data.map((d, idx) => {
    const x = padding.left + (data.length > 1 ? (idx / (data.length - 1)) * chartW : chartW / 2);
    const y = padding.top + chartH - (d.value / maxValue) * chartH;
    return { x, y, ...d };
  });

  const pathD = points.length > 1
    ? points.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '')
    : '';

  const areaD = points.length > 1
    ? `${pathD} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`
    : '';

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>

        {filterOptions && onFilterChange && (
          <div style={{
            display: 'flex',
            gap: '4px',
            background: 'var(--color-surface-subtle)',
            padding: '3px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)'
          }}>
            {filterOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`btn btn-sm ${filter === opt ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  padding: '3px 10px',
                  fontSize: '0.72rem',
                  border: 'none',
                  boxShadow: filter === opt ? 'var(--shadow-xs)' : 'none'
                }}
                onClick={() => onFilterChange(opt)}
              >
                {t(opt)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', minWidth: '320px', display: 'block' }}
        >
          <defs>
            {/* Warm Daniel Sun Accent Gradient for Line Area */}
            <linearGradient id="editorialWarmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fcec4d" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#857c5d" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#fcec4d" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Architectural Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const yVal = padding.top + chartH * (1 - ratio);
            const labelVal = Math.round(maxValue * ratio);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={yVal}
                  x2={width - padding.right}
                  y2={yVal}
                  stroke="var(--color-border-subtle)"
                  strokeWidth="1"
                  strokeDasharray={ratio === 0 ? 'none' : '4 4'}
                />
                <text
                  x={padding.left - 10}
                  y={yVal + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="var(--color-text-muted)"
                  fontFamily="var(--font-mono)"
                >
                  ₹{labelVal >= 1000 ? `${(labelVal / 1000).toFixed(1)}k` : labelVal}
                </text>
              </g>
            );
          })}

          {/* LINE CHART */}
          {type === 'line' && (
            <>
              {areaD && <path d={areaD} fill="url(#editorialWarmGradient)" />}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke="#fcec4d"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(252, 236, 77, 0.35))' }}
                />
              )}
              {points.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoverIndex === idx ? 6 : 3.5}
                    fill="var(--color-surface)"
                    stroke="#fcec4d"
                    strokeWidth={hoverIndex === idx ? 2.5 : 1.75}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={() => setHoverIndex(idx)}
                    onMouseLeave={() => setHoverIndex(null)}
                  />
                  <text
                    x={pt.x}
                    y={height - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--color-text-secondary)"
                    fontWeight="500"
                    fontFamily="var(--font-body)"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
            </>
          )}

          {/* BAR CHART */}
          {type === 'bar' && (
            <>
              {points.map((pt, idx) => {
                const barW = Math.max(16, (chartW / points.length) * 0.55);
                const barX = pt.x - barW / 2;
                const barH = padding.top + chartH - pt.y;
                const isHover = hoverIndex === idx;

                return (
                  <g key={idx}>
                    <rect
                      x={barX}
                      y={pt.y}
                      width={barW}
                      height={barH}
                      rx="3"
                      fill={isHover ? '#fcec4d' : 'var(--color-surface-raised)'}
                      stroke={isHover ? '#fcec4d' : 'var(--color-border)'}
                      strokeWidth="1"
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onMouseEnter={() => setHoverIndex(idx)}
                      onMouseLeave={() => setHoverIndex(null)}
                    />
                    <text
                      x={pt.x}
                      y={height - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fill="var(--color-text-secondary)"
                      fontFamily="var(--font-body)"
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </>
          )}
        </svg>

        {/* Hover Tooltip display */}
        {hoverIndex !== null && points[hoverIndex] && (
          <div style={{
            textAlign: 'center',
            fontSize: '0.78rem',
            color: 'var(--color-text-primary)',
            padding: '4px',
            fontFamily: 'var(--font-mono)'
          }}>
            <strong>{points[hoverIndex].label}:</strong> ₹{points[hoverIndex].value?.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
