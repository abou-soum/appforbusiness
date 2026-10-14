import { Product, Sale, ShopSettings } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'stockfacile_products_v1',
  SALES: 'stockfacile_sales_v1',
  SETTINGS: 'stockfacile_settings_v1',
  ONBOARDING_DONE: 'stockfacile_onboarded_v1',
};

export const DEFAULT_SETTINGS: ShopSettings = {
  shopName: 'Boutique Mobile & Accessoires',
  phone: '+225 07 00 00 00',
  address: 'Marché Central / Avenue Principale',
  currency: 'FCFA',
};

// Realistic sample catalog for phones & accessories in case the user clicks "Charger des exemples"
export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Tecno Spark 20 (128 Go / 8 Go RAM)',
    category: 'Smartphones',
    costPrice: 65000,
    sellingPrice: 82000,
    quantity: 6,
    minAlertStock: 2,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Infinix Hot 40i (256 Go / 8 Go RAM)',
    category: 'Smartphones',
    costPrice: 78000,
    sellingPrice: 96000,
    quantity: 4,
    minAlertStock: 2,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Samsung Galaxy A15 (128 Go)',
    category: 'Smartphones',
    costPrice: 92000,
    sellingPrice: 115000,
    quantity: 3,
    minAlertStock: 2,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Téléphone Itel 2160 à touches (Double SIM)',
    category: 'Téléphones à touches',
    costPrice: 6000,
    sellingPrice: 9000,
    quantity: 12,
    minAlertStock: 4,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Écouteurs Sans Fil Oraimo FreePods 4',
    category: 'Écouteurs & Airpods',
    costPrice: 14000,
    sellingPrice: 22000,
    quantity: 2, // Stock faible pour démonstration
    minAlertStock: 3,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Chargeur Rapide 20W Type-C Original',
    category: 'Chargeurs & Câbles',
    costPrice: 2500,
    sellingPrice: 5000,
    quantity: 15,
    minAlertStock: 5,
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-7',
    name: 'Câble USB vers Type-C Renforcé 1m',
    category: 'Chargeurs & Câbles',
    costPrice: 800,
    sellingPrice: 2000,
    quantity: 20,
    minAlertStock: 5,
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-8',
    name: 'Vitre de Protection Incassable 9D Universelle',
    category: 'Coques & Vitres trempées',
    costPrice: 500,
    sellingPrice: 2000,
    quantity: 25,
    minAlertStock: 6,
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-9',
    name: 'Powerbank Oraimo 20000 mAh Toast 10',
    category: 'Batteries & Powerbanks',
    costPrice: 9500,
    sellingPrice: 15000,
    quantity: 1, // Alerte stock très faible
    minAlertStock: 3,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEMO_SALES: Sale[] = [
  {
    id: 'sale-demo-1',
    productId: 'prod-6',
    productName: 'Chargeur Rapide 20W Type-C Original',
    category: 'Chargeurs & Câbles',
    quantity: 2,
    unitCostPrice: 2500,
    unitSellingPrice: 5000,
    totalAmount: 10000,
    profit: 5000,
    paymentMethod: 'Wave',
    customerName: 'Kouassi Jean',
    date: new Date().toISOString(), // Vente d'aujourd'hui
  },
  {
    id: 'sale-demo-2',
    productId: 'prod-8',
    productName: 'Vitre de Protection Incassable 9D Universelle',
    category: 'Coques & Vitres trempées',
    quantity: 1,
    unitCostPrice: 500,
    unitSellingPrice: 2000,
    totalAmount: 2000,
    profit: 1500,
    paymentMethod: 'Espèces',
    customerName: 'Client Comptoir',
    date: new Date().toISOString(), // Vente d'aujourd'hui
  },
];

/**
 * Load products from localStorage
 */
export function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erreur lecture products localStorage', err);
    return [];
  }
}

/**
 * Save products to localStorage
 */
export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (err) {
    console.error('Erreur sauvegarde products localStorage', err);
  }
}

/**
 * Load sales from localStorage
 */
export function loadSales(): Sale[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SALES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erreur lecture sales localStorage', err);
    return [];
  }
}

/**
 * Save sales to localStorage
 */
export function saveSales(sales: Sale[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  } catch (err) {
    console.error('Erreur sauvegarde sales localStorage', err);
  }
}

/**
 * Load shop settings
 */
export function loadSettings(): ShopSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save shop settings
 */
export function saveSettings(settings: ShopSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Erreur sauvegarde settings localStorage', err);
  }
}

/**
 * Clear all data from localStorage
 */
export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
  localStorage.removeItem(STORAGE_KEYS.SALES);
}

/**
 * Export full state as JSON backup string
 */
export function exportBackupJSON(products: Product[], sales: Sale[], settings: ShopSettings): void {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    settings,
    products,
    sales,
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sauvegarde_stockfacile_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
