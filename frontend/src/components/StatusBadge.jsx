import React from 'react';

export default function StatusBadge({ status, stock, minStock = 10 }) {
  let normalizedStatus = status;

  if (!normalizedStatus && stock !== undefined) {
    if (stock <= 0) {
      normalizedStatus = 'OUT_OF_STOCK';
    } else if (stock <= minStock) {
      normalizedStatus = 'LOW_STOCK';
    } else {
      normalizedStatus = 'IN_STOCK';
    }
  }

  const upper = (normalizedStatus || '').toUpperCase().replace(/[\s-]/g, '_');

  if (upper === 'IN_STOCK' || upper === 'INSTOCK') {
    return <span className="badge status-badge-instock">● In Stock</span>;
  }

  if (upper === 'LOW_STOCK' || upper === 'LOWSTOCK') {
    return <span className="badge status-badge-lowstock">▲ Low Stock</span>;
  }

  return <span className="badge status-badge-outofstock">■ Out of Stock</span>;
}
