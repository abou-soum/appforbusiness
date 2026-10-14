export interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number;     // Prix d'achat en FCFA
  sellingPrice: number;  // Prix de vente conseillé en FCFA
  quantity: number;      // Quantité actuellement en stock
  minAlertStock: number; // Seuil d'alerte stock faible (ex: 3)
  createdAt: string;     // ISO date string
  updatedAt: string;     // ISO date string
}

export type PaymentMethod =
  | 'Espèces'
  | 'Wave'
  | 'Orange Money'
  | 'Moov Money'
  | 'MTN Momo'
  | 'Carte / Virement';

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unitCostPrice: number;     // Prix d'achat unitaire au moment de la vente
  unitSellingPrice: number;  // Prix de vente effectif unitaire
  totalAmount: number;       // quantity * unitSellingPrice
  profit: number;            // (unitSellingPrice - unitCostPrice) * quantity
  paymentMethod: PaymentMethod;
  customerName?: string;
  notes?: string;
  date: string;              // ISO date string
}

export interface ShopSettings {
  shopName: string;
  phone: string;
  address: string;
  currency: string;
}

export type ActiveTab = 'dashboard' | 'products' | 'sale' | 'history' | 'guide';

export const PRODUCT_CATEGORIES = [
  'Smartphones',
  'Téléphones à touches',
  'Écouteurs & Airpods',
  'Chargeurs & Câbles',
  'Coques & Vitres trempées',
  'Batteries & Powerbanks',
  'Cartes mémoire & Flash USB',
  'Haut-parleurs & Enceintes',
  'Autres accessoires'
] as const;

export const PAYMENT_METHODS: PaymentMethod[] = [
  'Espèces',
  'Wave',
  'Orange Money',
  'Moov Money',
  'MTN Momo',
  'Carte / Virement'
];
