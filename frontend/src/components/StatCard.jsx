import React from 'react';
import { TrendUpIcon } from './Icons';

export default function StatCard({
  title,
  value,
  icon: Icon,
  colorClass = 'blue',
  subtext,
  trendValue,
  trendDirection = 'up' // 'up' | 'down' | 'neutral'
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className={`stat-card-icon stat-icon-${colorClass}`}>
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="stat-card-value">
        {value}
      </div>

      {(trendValue || subtext) && (
        <div className="stat-card-footer">
          {trendValue && (
            <span className={trendDirection === 'down' ? 'stat-trend-down' : 'stat-trend-up'}>
              {trendDirection === 'up' && <TrendUpIcon size={12} />}
              {trendValue}
            </span>
          )}
          {subtext && <span>{subtext}</span>}
        </div>
      )}
    </div>
  );
}
