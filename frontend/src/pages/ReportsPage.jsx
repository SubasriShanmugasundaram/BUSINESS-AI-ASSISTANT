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
    topProducts: [],
    paymentMethodDistribution: {}
  });
  const [timeframe, setTimeframe] = useState('This Month');
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await api.getReportsSummary(timeframe);
      setReport(data || {});
    } catch (err) {
      showToast('Error loading analytics reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [timeframe]);

  // Format line chart data
  const lineChartData = (report.salesByDate || []).map(d => ({
    label: d.date.slice(5),
    value: d.amount
  }));

  // Format bar chart data for top products
  const barChartData = (report.topProducts || []).slice(0, 6).map(p => ({
    label: p.productName.length > 14 ? p.productName.slice(0, 12) + '..' : p.productName,
    value: p.revenue
  }));

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            Sales Reports & Analytics
          </h1>
          <p className="page-subtitle">
            Gain business intelligence on revenue patterns, top-selling inventory, and average ticket sizes.
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
      <div className="grid-3" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          title="Total Gross Revenue"
          value={`₹${Number(report.totalSales || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={CurrencyIcon}
          colorClass="green"
          subtext={`Calculated across ${timeframe}`}
        />
        <StatCard
          title="Total Invoices Cleared"
          value={report.transactionCount || 0}
          icon={HistoryIcon}
          colorClass="blue"
          subtext="Completed business orders"
        />
        <StatCard
          title="Average Transaction Value"
          value={`₹${Number(report.averageSaleValue || 0).toFixed(2)}`}
          icon={SalesIcon}
          colorClass="purple"
          subtext="Mean spend per customer invoice"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        <ChartCard
          title="Sales Timeline (Revenue Trend)"
          subtitle="Daily sales velocity aggregated from database records"
          data={lineChartData}
          type="line"
          height={260}
        />

        <ChartCard
          title="Top-Selling Products by Revenue"
          subtitle="Highest grossing items in catalog"
          data={barChartData}
          type="bar"
          height={260}
        />
      </div>

      {/* Top Selling Products Table */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div className="card-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Product Performance Breakdown</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Data formatted for downstream ML sales forecasting and reorder planning
            </span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product Name</th>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>Units Sold</th>
                <th style={{ textAlign: 'right' }}>Total Revenue</th>
                <th style={{ textAlign: 'right' }}>Revenue Share</th>
              </tr>
            </thead>
            <tbody>
              {report.topProducts && report.topProducts.length > 0 ? (
                report.topProducts.map((p, idx) => {
                  const share = report.totalSales > 0 ? ((p.revenue / report.totalSales) * 100).toFixed(1) : 0;
                  return (
                    <tr key={p.productId || idx}>
                      <td style={{ fontWeight: 700, color: idx === 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                        #{idx + 1}
                      </td>
                      <td style={{ fontWeight: 600 }}>{p.productName}</td>
                      <td><span className="badge badge-primary">{p.category}</span></td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>{p.quantitySold}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-main)' }}>
                        ₹{Number(p.revenue).toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge-success">{share}%</span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="table-empty-state">
                    No product transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Channel Breakdown */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Payment Method Distribution</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UPI, Cash, Cards & Other transfers</span>
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
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No payment distribution records available</div>
          )}
        </div>
      </div>
    </div>
  );
}
