import React, { useState, useEffect } from 'react';
import ChartCard from '../components/ChartCard';
import StatCard from '../components/StatCard';
import {
  CurrencyIcon,
  SalesIcon,
  ProductsIcon,
  HistoryIcon,
  ReportsIcon,
  FilterIcon,
  RefreshIcon
} from '../components/Icons';
import { api } from '../services/api';

export default function ReportsPage({ showToast }) {
  const [report, setReport] = useState({
    totalSales: 0,
    transactionCount: 0,
    averageSaleValue: 0,
    salesByDate: [],
    salesByDayOfWeek: [],
    salesByMonth: [],
    topProducts: [],
    slowProducts: [],
    paymentMethodDistribution: {},
    bestSellingDay: 'N/A',
    bestSellingDayRevenue: 0,
    bestSellingWeek: 'N/A',
    bestSellingWeekRevenue: 0,
    bestSellingMonth: 'N/A',
    bestSellingMonthRevenue: 0,
    previousPeriodSales: 0,
    growthPercentage: 0
  });
  const [timeframe, setTimeframe] = useState('This Month');
  const [comparisonMode, setComparisonMode] = useState('DayOfWeek');
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await api.getReportsSummary(timeframe);
      setReport(data || {});
    } catch (err) {
      if (showToast) showToast('Error loading analytics reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [timeframe]);

  // Format line chart data
  const lineChartData = (report.salesByDate || []).map(d => ({
    label: d?.date ? String(d.date).slice(5) : '',
    value: Number(d?.amount) || 0
  }));

  // Format bar chart data for top products
  const topProductsBarData = (report.topProducts || []).slice(0, 6).map(p => {
    const name = p?.productName || 'Product';
    return {
      label: name.length > 12 ? name.slice(0, 10) + '..' : name,
      value: Number(p?.revenue) || 0
    };
  });

  // Day of week sales data
  const dayOfWeekBarData = (report.salesByDayOfWeek || []).map(d => ({
    label: d?.date ? String(d.date).slice(0, 3) : '',
    value: Number(d?.amount) || 0
  }));

  // Monthly breakdown data
  const monthlyBarData = (report.salesByMonth || []).map(m => ({
    label: m?.date ? String(m.date) : '',
    value: Number(m?.amount) || 0
  }));

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Sales Reports & Period Analytics
          </h1>
          <p className="page-subtitle">
            Autonomous MSME intelligence: Day/Week/Month best-seller ranking, slow product identification & period comparisons.
          </p>
        </div>

        <div className="page-actions">
          <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}>
            {['Today', 'This Week', 'This Month', 'All Time'].map(t => (
              <button
                key={t}
                className={`btn btn-sm ${timeframe === t ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  border: 'none',
                  background: timeframe === t ? 'var(--color-accent)' : 'transparent',
                  color: timeframe === t ? 'var(--color-accent-contrast)' : 'var(--color-text-secondary)',
                  boxShadow: timeframe === t ? 'var(--shadow-xs)' : 'none'
                }}
                onClick={() => setTimeframe(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <button className="btn btn-secondary" onClick={fetchReports} title="Refresh">
            <RefreshIcon size={16} />
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          title="Total Gross Revenue"
          value={`₹${Number(report.totalSales || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={CurrencyIcon}
          colorClass="green"
          trendValue={`${report.growthPercentage >= 0 ? '+' : ''}${report.growthPercentage}%`}
          subtext={`Calculated across ${timeframe}`}
          trendDirection={report.growthPercentage >= 0 ? 'up' : 'down'}
        />
        <StatCard
          title="Total Invoices Cleared"
          value={report.transactionCount || 0}
          icon={HistoryIcon}
          colorClass="blue"
          subtext="Completed business orders"
        />
        <StatCard
          title="Average Ticket Size"
          value={`₹${Number(report.averageSaleValue || 0).toFixed(2)}`}
          icon={SalesIcon}
          colorClass="purple"
          subtext="Mean spend per customer invoice"
        />
      </div>

      {/* Best-Selling Period Intelligence Highlights (Features 10, 11, 12, 13) */}
      <div className="card" style={{ marginBottom: '1.75rem', background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)' }}>
        <div className="card-header" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              🏆 Best-Selling Period & Time Horizon Analysis
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Autonomous pattern extraction identifying peak sales days, top weeks, and revenue velocity
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', padding: '1.25rem 0 0.5rem 0' }}>
          {/* Best Selling Day */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              📅 Best-Selling Day of Week
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-accent-strong)', margin: '0.35rem 0' }}>
              {report.bestSellingDay || 'N/A'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Peak Yield: ₹{Number(report.bestSellingDayRevenue || 0).toLocaleString()}
            </div>
          </div>

          {/* Best Selling Week */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              🗓️ Best-Selling Week
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-accent-strong)', margin: '0.35rem 0' }}>
              {report.bestSellingWeek || 'N/A'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Weekly Total: ₹{Number(report.bestSellingWeekRevenue || 0).toLocaleString()}
            </div>
          </div>

          {/* Best Selling Month */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              📊 Best-Selling Month
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-accent-strong)', margin: '0.35rem 0' }}>
              {report.bestSellingMonth || 'N/A'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Monthly Gross: ₹{Number(report.bestSellingMonthRevenue || 0).toLocaleString()}
            </div>
          </div>

          {/* Period Growth Comparison */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              📈 Period Comparison Growth
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: (report.growthPercentage || 0) >= 0 ? 'var(--color-success)' : 'var(--color-danger)', margin: '0.35rem 0' }}>
              {(report.growthPercentage || 0) >= 0 ? '▲ +' : '▼ '}{report.growthPercentage || 0}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              vs Prev Period (₹{Number(report.previousPeriodSales || 0).toLocaleString()})
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sales Comparison Tool (Feature 13) */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Interactive Period & Day Velocity Comparison</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Select aggregation view to compare day-of-week, monthly, or daily revenue patterns
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--color-surface-subtle)', border: '1px solid var(--color-border)', padding: '0.2rem', borderRadius: 'var(--radius-sm)' }}>
            <button
              className={`btn btn-sm ${comparisonMode === 'DayOfWeek' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setComparisonMode('DayOfWeek')}
            >
              Day of Week (Mon-Sun)
            </button>
            <button
              className={`btn btn-sm ${comparisonMode === 'Timeline' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setComparisonMode('Timeline')}
            >
              Daily Timeline
            </button>
            <button
              className={`btn btn-sm ${comparisonMode === 'Monthly' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setComparisonMode('Monthly')}
            >
              Monthly Comparison
            </button>
          </div>
        </div>

        {comparisonMode === 'DayOfWeek' && (
          <ChartCard
            title="Day of Week Sales Comparison (Monday vs Sunday)"
            subtitle="Identifies peak footfall days to optimize staffing and procurement"
            data={dayOfWeekBarData}
            type="bar"
            height={260}
          />
        )}

        {comparisonMode === 'Timeline' && (
          <ChartCard
            title="Daily Sales Velocity Trend"
            subtitle="Aggregated continuous daily sales timeline"
            data={lineChartData}
            type="line"
            height={260}
          />
        )}

        {comparisonMode === 'Monthly' && (
          <ChartCard
            title="Month-over-Month Revenue Comparison"
            subtitle="Aggregated gross revenue by calendar month"
            data={monthlyBarData}
            type="bar"
            height={260}
          />
        )}
      </div>

      {/* Product Sales Ranking & Slow-Selling Identification Grid (Features 8 & 9) */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        {/* Top-Selling Product Table */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>🏆 Top Fast-Moving Products</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Highest grossing inventory items
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product</th>
                  <th style={{ textAlign: 'center' }}>Sold</th>
                  <th style={{ textAlign: 'right' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {report.topProducts && report.topProducts.length > 0 ? (
                  report.topProducts.map((p, idx) => (
                    <tr key={p.productId || idx}>
                      <td style={{ fontWeight: 700, color: idx === 0 ? 'var(--color-accent-strong)' : 'var(--color-text-muted)' }}>
                        #{idx + 1}
                      </td>
                      <td style={{ fontWeight: 600 }}>{p.productName}</td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{p.quantitySold}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>
                        ₹{Number(p.revenue).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="table-empty-state">No sales transactions recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Slow-Selling Product Identification Table (Feature 9) */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--color-warning)' }}>
                🐢 Slow-Moving Inventory Identification
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Items with low velocity; avoid over-purchasing & apply targeted discounts
              </span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style={{ textAlign: 'center' }}>Units Sold</th>
                  <th>Action Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {report.slowProducts && report.slowProducts.length > 0 ? (
                  report.slowProducts.map((p, idx) => (
                    <tr key={p.productId || idx}>
                      <td style={{ fontWeight: 600 }}>{p.productName}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge status-badge-lowstock">{p.quantitySold} units</span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                          💡 Run 15% discount promo or hold orders
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="table-empty-state">No slow-moving products identified.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Channel Breakdown */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Payment Method Distribution</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>UPI, Cash, Cards & Other transfers</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {report.paymentMethodDistribution && Object.keys(report.paymentMethodDistribution).length > 0 ? (
            Object.entries(report.paymentMethodDistribution).map(([method, amount]) => {
              const pct = report.totalSales > 0 ? ((amount / report.totalSales) * 100).toFixed(1) : 0;
              return (
                <div
                  key={method}
                  style={{
                    flex: '1 1 200px',
                    background: 'var(--color-surface-subtle)',
                    padding: '1.1rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{method}</span>
                    <span className="badge" style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent-strong)' }}>{pct}%</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
                    ₹{Number(amount).toFixed(2)}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>No payment distribution records available</div>
          )}
        </div>
      </div>
    </div>
  );
}
