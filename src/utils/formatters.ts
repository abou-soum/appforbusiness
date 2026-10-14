import { Product, Sale } from '../types';

/**
 * Format an integer or float into FCFA representation (e.g., 25 000 FCFA)
 */
export function formatFCFA(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 FCFA';
  }
  // Format with space as thousands separator
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} FCFA`;
}

/**
 * Format date to standard French readable format (e.g., 14 Oct 2026, 14:30)
 */
export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatDateOnly(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatTimeOnly(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return '';
  }
}

/**
 * Check if a date string is today
 */
export function isToday(dateString: string): boolean {
  const d = new Date(dateString);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Compute key dashboard metrics
 */
export function computeDashboardStats(products: Product[], sales: Sale[]) {
  // Today's sales
  const todaySales = sales.filter((s) => isToday(s.date));
  const todayRevenue = todaySales.reduce((acc, s) => acc + s.totalAmount, 0);
  const todayProfit = todaySales.reduce((acc, s) => acc + s.profit, 0);
  const todayItemsSold = todaySales.reduce((acc, s) => acc + s.quantity, 0);

  // All time sales
  const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalProfit = sales.reduce((acc, s) => acc + s.profit, 0);

  // Product inventory
  const totalUniqueProducts = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + p.quantity, 0);
  const totalStockPurchaseValue = products.reduce(
    (acc, p) => acc + p.costPrice * p.quantity,
    0
  );
  const totalStockSellingValue = products.reduce(
    (acc, p) => acc + p.sellingPrice * p.quantity,
    0
  );
  const potentialStockProfit = totalStockSellingValue - totalStockPurchaseValue;

  // Low stock products
  const lowStockProducts = products.filter(
    (p) => p.quantity > 0 && p.quantity <= (p.minAlertStock ?? 3)
  );
  const outOfStockProducts = products.filter((p) => p.quantity <= 0);

  return {
    todaySalesCount: todaySales.length,
    todayRevenue,
    todayProfit,
    todayItemsSold,
    totalRevenue,
    totalProfit,
    totalUniqueProducts,
    totalStockUnits,
    totalStockPurchaseValue,
    totalStockSellingValue,
    potentialStockProfit,
    lowStockCount: lowStockProducts.length,
    outOfStockCount: outOfStockProducts.length,
    lowStockProducts,
    outOfStockProducts,
  };
}

/**
 * Calculate margin percentage
 */
export function calculateMarginPercent(costPrice: number, sellingPrice: number): number {
  if (sellingPrice <= 0) return 0;
  const margin = ((sellingPrice - costPrice) / sellingPrice) * 100;
  return Math.round(margin);
}

/**
 * Export sales data to CSV
 */
export function exportSalesToCSV(sales: Sale[]): void {
  const headers = [
    'Date & Heure',
    'Produit',
    'Catégorie',
    'Quantité',
    'Prix unitaire (FCFA)',
    'Total Vente (FCFA)',
    'Prix d\'achat unitaire (FCFA)',
    'Bénéfice brut (FCFA)',
    'Mode de Paiement',
    'Client'
  ];

  const rows = sales.map((s) => [
    `"${formatDateTime(s.date)}"`,
    `"${s.productName.replace(/"/g, '""')}"`,
    `"${s.category}"`,
    s.quantity,
    s.unitSellingPrice,
    s.totalAmount,
    s.unitCostPrice,
    s.profit,
    `"${s.paymentMethod}"`,
    `"${(s.customerName || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `ventes_stockfacile_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
