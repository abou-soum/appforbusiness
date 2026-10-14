import React, { useState } from 'react';
import { ActiveTab, ShopSettings } from '../types';
import { 
  Smartphone, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  History, 
  HelpCircle, 
  Menu, 
  X,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lowStockCount: number;
  outOfStockCount: number;
  settings: ShopSettings;
  onOpenQuickSale: () => void;
  isInstalled: boolean;
  onOpenAndroidInstall: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  lowStockCount,
  outOfStockCount,
  settings,
  onOpenQuickSale,
  isInstalled,
  onOpenAndroidInstall,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalAlerts = lowStockCount + outOfStockCount;

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 lg:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-xs group-hover:bg-slate-800 transition-colors">
                <Smartphone className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                  StockFacile
                </span>
                <span className="text-xs text-slate-500 font-medium block truncate max-w-[140px] sm:max-w-[200px]">
                  {settings.shopName || 'Gestion de stock'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-slate-500" />
              <span>Tableau de bord</span>
            </button>

            <button
              onClick={() => handleNavClick('products')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Package className="w-4 h-4 text-slate-500" />
              <span>Produits & Stock</span>
              {totalAlerts > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-md">
                  {totalAlerts}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('sale')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'sale'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-slate-500" />
              <span>Nouvelle Vente</span>
            </button>

            <button
              onClick={() => handleNavClick('history')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>Historique</span>
            </button>

            <button
              onClick={() => handleNavClick('guide')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'guide'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Guide & Réglages</span>
            </button>
          </nav>

          {/* Zone 3: Actions & Install */}
          <div className="flex items-center gap-2.5 shrink-0">
            {!isInstalled && (
              <button
                onClick={onOpenAndroidInstall}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title="Installer sur Android"
              >
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Installer sur Android</span>
              </button>
            )}

            <button
              onClick={onOpenQuickSale}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Enregistrer une vente</span>
              <span className="sm:hidden">Vente</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg animate-in slide-in-from-top duration-150">
          {!isInstalled && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAndroidInstall();
              }}
              className="w-full flex items-center justify-between p-3 mb-2 text-sm font-bold text-emerald-950 bg-emerald-50 border border-emerald-200 rounded-xl"
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>Installer sur mon Android</span>
              </div>
              <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                Installer
              </span>
            </button>
          )}
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-base font-medium rounded-lg ${
              activeTab === 'dashboard'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-5 h-5 text-slate-500" />
              <span>Tableau de bord</span>
            </div>
          </button>

          <button
            onClick={() => handleNavClick('products')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-base font-medium rounded-lg ${
              activeTab === 'products'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-slate-500" />
              <span>Produits & Stock</span>
            </div>
            {totalAlerts > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-md flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {totalAlerts}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('sale')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-base font-medium rounded-lg ${
              activeTab === 'sale'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-slate-500" />
              <span>Nouvelle Vente</span>
            </div>
          </button>

          <button
            onClick={() => handleNavClick('history')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-base font-medium rounded-lg ${
              activeTab === 'history'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-slate-500" />
              <span>Historique des ventes</span>
            </div>
          </button>

          <button
            onClick={() => handleNavClick('guide')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 text-base font-medium rounded-lg ${
              activeTab === 'guide'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-slate-500" />
              <span>Guide & Réglages</span>
            </div>
          </button>
        </div>
      )}
    </header>
  );
};
