import React, { useState, useEffect } from 'react';
import { Product, Sale, ShopSettings, ActiveTab, PaymentMethod } from './types';
import { 
  loadProducts, 
  saveProducts, 
  loadSales, 
  saveSales, 
  loadSettings, 
  saveSettings, 
  clearAllData,
  DEMO_PRODUCTS,
  DEMO_SALES
} from './utils/storage';
import { computeDashboardStats } from './utils/formatters';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ProductManagement } from './components/ProductManagement';
import { NewSaleView } from './components/NewSaleView';
import { SalesHistory } from './components/SalesHistory';
import { RestockModal } from './components/RestockModal';
import { ReceiptModal } from './components/ReceiptModal';
import { SettingsAndHelp } from './components/SettingsAndHelp';
import { AndroidInstallModal } from './components/AndroidInstallModal';
import { WifiOff } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => loadProducts());
  const [sales, setSales] = useState<Sale[]>(() => loadSales());
  const [settings, setSettings] = useState<ShopSettings>(() => loadSettings());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // PWA and offline status
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showAndroidModal, setShowAndroidModal] = useState<boolean>(false);

  // Modals & sub-flows
  const [productForSale, setProductForSale] = useState<Product | null>(null);
  const [productForRestock, setProductForRestock] = useState<Product | null>(null);
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    saveProducts(products);
  }, [products]);

  useEffect(() => {
    saveSales(sales);
  }, [sales]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Compute inventory metrics for header alert badges
  const stats = computeDashboardStats(products, sales);

  // Handler: Add Product
  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    setShowAddProductModal(false);
  };

  // Handler: Update Product
  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  // Handler: Delete Product
  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Handler: Restock Product
  const handleRestock = (productId: string, quantityToAdd: number, updatedCostPrice?: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          quantity: p.quantity + quantityToAdd,
          costPrice: updatedCostPrice !== undefined ? updatedCostPrice : p.costPrice,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // Handler: Record Sale
  const handleRecordSale = (saleData: {
    productId: string;
    productName: string;
    category: string;
    quantity: number;
    unitCostPrice: number;
    unitSellingPrice: number;
    paymentMethod: PaymentMethod;
    customerName?: string;
    notes?: string;
  }) => {
    const totalAmount = saleData.quantity * saleData.unitSellingPrice;
    const totalCost = saleData.quantity * saleData.unitCostPrice;
    const profit = totalAmount - totalCost;

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      productId: saleData.productId,
      productName: saleData.productName,
      category: saleData.category,
      quantity: saleData.quantity,
      unitCostPrice: saleData.unitCostPrice,
      unitSellingPrice: saleData.unitSellingPrice,
      totalAmount,
      profit,
      paymentMethod: saleData.paymentMethod,
      customerName: saleData.customerName,
      notes: saleData.notes,
      date: new Date().toISOString(),
    };

    // 1. Decrement product stock automatically
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== saleData.productId) return p;
        const remaining = Math.max(0, p.quantity - saleData.quantity);
        return {
          ...p,
          quantity: remaining,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    // 2. Add to sales history
    setSales((prev) => [newSale, ...prev]);

    // 3. Open receipt modal for printing or viewing
    setReceiptSale(newSale);
  };

  // Handler: Cancel Sale (rollback stock)
  const handleCancelSale = (saleId: string) => {
    const saleToCancel = sales.find((s) => s.id === saleId);
    if (!saleToCancel) return;

    // Restore stock
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== saleToCancel.productId) return p;
        return {
          ...p,
          quantity: p.quantity + saleToCancel.quantity,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    // Remove from sales list
    setSales((prev) => prev.filter((s) => s.id !== saleId));
  };

  // Handler: Open Quick Sale
  const handleOpenQuickSale = (product?: Product) => {
    if (product) {
      setProductForSale(product);
    } else {
      setProductForSale(null);
    }
    setActiveTab('sale');
  };

  // Demo data loader
  const handleLoadDemoData = () => {
    setProducts(DEMO_PRODUCTS);
    setSales(DEMO_SALES);
    alert('Exemples de téléphones et accessoires chargés avec succès !');
  };

  // Clear all data
  const handleClearAllData = () => {
    clearAllData();
    setProducts([]);
    setSales([]);
  };

  // Import JSON backup
  const handleImportData = (
    importedProducts: Product[],
    importedSales: Sale[],
    importedSettings?: ShopSettings
  ) => {
    setProducts(importedProducts);
    setSales(importedSales);
    if (importedSettings) {
      setSettings(importedSettings);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lowStockCount={stats.lowStockCount}
        outOfStockCount={stats.outOfStockCount}
        settings={settings}
        onOpenQuickSale={() => handleOpenQuickSale()}
        isInstalled={isInstalled}
        onOpenAndroidInstall={() => setShowAndroidModal(true)}
      />

      {/* Offline Mode Banner */}
      {!isOnline && (
        <div className="bg-amber-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Mode Hors-Ligne activé — Vos ventes et stocks sont enregistrés localement sur votre téléphone.</span>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            products={products}
            sales={sales}
            setActiveTab={setActiveTab}
            onOpenNewSale={handleOpenQuickSale}
            onOpenAddProduct={() => {
              setShowAddProductModal(true);
              setActiveTab('products');
            }}
            onOpenRestock={(product) => setProductForRestock(product)}
            onLoadDemoData={handleLoadDemoData}
          />
        )}

        {activeTab === 'products' && (
          <ProductManagement
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onOpenNewSale={handleOpenQuickSale}
            onOpenRestock={(product) => setProductForRestock(product)}
            initialAddModalOpen={showAddProductModal}
          />
        )}

        {activeTab === 'sale' && (
          <NewSaleView
            products={products}
            preselectedProduct={productForSale}
            onRecordSale={handleRecordSale}
            onOpenAddProduct={() => {
              setShowAddProductModal(true);
              setActiveTab('products');
            }}
          />
        )}

        {activeTab === 'history' && (
          <SalesHistory
            sales={sales}
            products={products}
            onCancelSale={handleCancelSale}
            onViewReceipt={(sale) => setReceiptSale(sale)}
            onOpenNewSale={() => handleOpenQuickSale()}
          />
        )}

        {activeTab === 'guide' && (
          <SettingsAndHelp
            settings={settings}
            products={products}
            sales={sales}
            onUpdateSettings={setSettings}
            onLoadDemoData={handleLoadDemoData}
            onClearAllData={handleClearAllData}
            onImportData={handleImportData}
            onOpenAndroidInstall={() => setShowAndroidModal(true)}
          />
        )}
      </main>

      {/* Restock Modal */}
      {productForRestock && (
        <RestockModal
          product={productForRestock}
          onClose={() => setProductForRestock(null)}
          onRestock={handleRestock}
        />
      )}

      {/* Printable Receipt Modal */}
      {receiptSale && (
        <ReceiptModal
          sale={receiptSale}
          settings={settings}
          onClose={() => setReceiptSale(null)}
        />
      )}

      {/* Android Install Modal */}
      <AndroidInstallModal
        isOpen={showAndroidModal}
        onClose={() => setShowAndroidModal(false)}
        canInstallDirectly={isInstallable}
        onDirectInstall={install}
      />

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium text-slate-700">
            StockFacile · Gestion de stock & ventes en FCFA
          </p>
          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-slate-800 transition-colors"
            >
              Guide débutant
            </button>
            <span>·</span>
            <span>Sauvegarde locale active</span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hover:text-slate-800 transition-colors"
            >
              Tableau de bord
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
