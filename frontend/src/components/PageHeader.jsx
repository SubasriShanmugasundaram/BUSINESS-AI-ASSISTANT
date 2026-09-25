import React from 'react';

export default function PageHeader({
  title,
  subtitle,
  actions,
  kicker
}) {
  return (
    <div className="page-header">
      <div>
        {kicker && <div className="editorial-kicker mb-1">{kicker}</div>}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {actions}
        </div>
      )}
    </div>
  );
}
