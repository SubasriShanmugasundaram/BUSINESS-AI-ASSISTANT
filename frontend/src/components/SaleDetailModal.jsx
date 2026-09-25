import React from 'react';
import Modal from './Modal';
import { PrinterIcon, CheckIcon } from './Icons';

export default function SaleDetailModal({ isOpen, onClose, sale, businessInfo }) {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = sale.saleDate || (sale.createdAt ? sale.createdAt.split(' ')[0] : 'N/A');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Sale Details - ${sale.saleNumber || '#' + sale.id}`}
      maxWidth="720px"
      footer={
        <>
          <button className="btn btn-secondary no-print" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary no-print" onClick={handlePrint}>
            <PrinterIcon size={16} /> Print Receipt
          </button>
        </>
      }
    >
      <div className="printable-invoice">
        {/* Business Header */}
        <div className="invoice-header">
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
              {businessInfo?.name || 'Lakshmi Enterprise'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {businessInfo?.tagline || 'Wholesale & Retail Commercial Trading'}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {businessInfo?.address || '102 Market Road, Bengaluru - 560001'}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              GSTIN / MSME: {businessInfo?.gstin || '29ABCDE1234F1Z5'} • Ph: {businessInfo?.phone || '+91 9876543210'}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem', fontSize: '0.8rem' }}>
              <CheckIcon size={12} /> {sale.status || 'Completed'}
            </span>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {sale.saleNumber || `INV-${sale.id}`}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Date: <strong>{formattedDate}</strong>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Payment: <strong>{sale.paymentMethod || 'Cash'}</strong>
            </div>
          </div>
        </div>

        {/* Customer Details Box */}
        <div className="invoice-bill-info">
          <div style={{ background: 'var(--bg-subtle)', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--support-lavender)', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
              Billed To (Customer):
            </h4>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
              {sale.customerName || 'Walk-in Customer'}
            </div>
            {sale.customerPhone && (
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontFamily: 'monospace' }}>
                Phone: {sale.customerPhone}
              </div>
            )}
            {sale.customerAddress && (
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Address: {sale.customerAddress}
              </div>
            )}
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--support-lavender)', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
              Transaction Summary:
            </h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total Line Items: <strong style={{ color: 'var(--text-main)' }}>{sale.items ? sale.items.length : 1}</strong>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Payment Method: <span className="badge badge-primary">{sale.paymentMethod}</span>
            </div>
            {sale.notes && (
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Notes: <em style={{ color: 'var(--support-lavender)' }}>{sale.notes}</em>
              </div>
            )}
          </div>
        </div>

        {/* Itemized Table */}
        <div className="table-responsive" style={{ marginBottom: '1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Description</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Price (₹)</th>
                <th style={{ textAlign: 'center' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {sale.items && sale.items.length > 0 ? (
                sale.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td style={{ color: 'var(--text-subtle)' }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{item.productName || `Product #${item.productId}`}</td>
                    <td>
                      <span className="badge badge-secondary">{item.category || 'General'}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>₹{Number(item.sellingPrice).toFixed(2)}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{Number(item.totalAmount).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>1</td>
                  <td>General Sale Transaction</td>
                  <td>-</td>
                  <td style={{ textAlign: 'right' }}>₹{Number(sale.totalAmount).toFixed(2)}</td>
                  <td style={{ textAlign: 'center' }}>1</td>
                  <td style={{ textAlign: 'right' }}>₹{Number(sale.totalAmount).toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total Summary */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
              <span>₹{Number(sale.totalAmount).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>Tax (GST 0%):</span>
              <span>₹0.00</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderTop: '2px solid var(--border-color)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--primary)'
              }}
            >
              <span>Total Amount:</span>
              <span>₹{Number(sale.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ borderTop: '1px dashed var(--border-color)', marginTop: '2rem', paddingTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
          Thank you for your business! This is a computer generated invoice powered by BizPartner AI.
        </div>
      </div>
    </Modal>
  );
}
