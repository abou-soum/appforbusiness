import React from 'react';
import { Product, Sale, ActiveTab } from '../types';
import { formatFCFA, formatDateTime, isToday } from '../utils/formatters';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  AlertTriangle, 
  PlusCircle, 
  ShoppingCart, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewSale: (product?: Product) => void;
  onOpenAddProduct: () => void;
  onOpenRestock: (product: Product) => void;
  onLoadDemoData: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  products,
  sales,
  setActiveTab,
  onOpenNewSale,
  onOpenAddProduct,
  onOpenRestock,
  onLoadDemoData,
}) => {
  // Calculations
  const todaySales = sales.filter((s) => isToday(s.date));
  const todayRevenue = todaySales.reduce((acc, s) => acc + s.totalAmount, 0);
  const todayProfit = todaySales.reduce((acc, s) => acc + s.profit, 0);
  const todayCount = todaySales.reduce((acc, s) => acc + s.quantity, 0);

  const totalStockUnits = products.reduce((acc, p) => acc + p.quantity, 0);
  const totalStockValue = products.reduce((acc, p) => acc + p.costPrice * p.quantity, 0);
  const totalSalesAllTime = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalProfitAllTime = sales.reduce((acc, s) => acc + s.profit, 0);

  // Low stock products
  const lowStockItems = products.filter(
    (p) => p.quantity <= (p.minAlertStock ?? 3)
  );

  const recentSales = [...sales].reverse().slice(0, 5);

  const isStoreEmpty = products.length === 0 && sales.length === 0;

  return (
    <div className="space-y-8">
      {/* Welcome / Quick Banner for beginners if empty */}
      {isStoreEmpty && (
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Bienvenue sur StockFacile !</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Votre boutique est prête. Commencez à gérer votre commerce.
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                Ajoutez vos premiers téléphones et accessoires, ou chargez notre catalogue d'exemples réalistes (Tecno, iPhone, chargeurs, vitres) pour tester immédiatement les ventes et calculs de bénéfice.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={onLoadDemoData}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Charger des exemples de test
              </button>
              <button
                onClick={onOpenAddProduct}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-2"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Ajouter mon 1er produit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary KPI Cards Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">
            Aperçu des performances
          </h2>
          <span className="text-xs text-slate-500">
            Aujourd'hui : {new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Ventes du Jour */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Ventes du jour
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {formatFCFA(todayRevenue)}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
              <span className="font-medium text-slate-700 tabular-nums">{todaySales.length}</span> transaction{todaySales.length > 1 ? 's' : ''}
              <span>·</span>
              <span className="font-medium text-slate-700 tabular-nums">{todayCount}</span> article{todayCount > 1 ? 's' : ''} vendu{todayCount > 1 ? 's' : ''}
            </div>
          </div>

          {/* Card 2: Bénéfice du Jour */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Bénéfice net du jour
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-600 tabular-nums">
              {formatFCFA(todayProfit)}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              {todayRevenue > 0 ? (
                <span>
                  Marge : <strong className="text-slate-800 tabular-nums">{Math.round((todayProfit / todayRevenue) * 100)}%</strong> sur le C.A.
                </span>
              ) : (
                <span>Aucune vente aujourd'hui pour le moment</span>
              )}
            </div>
          </div>

          {/* Card 3: Stock Disponible */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Articles en Stock
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {totalStockUnits} <span className="text-sm font-medium text-slate-500">pièces</span>
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center gap-2">
              <span className="font-medium text-slate-700 tabular-nums">{products.length}</span> référence{products.length > 1 ? 's' : ''}
              <span>·</span>
              <span>Valeur : {formatFCFA(totalStockValue)}</span>
            </div>
          </div>

          {/* Card 4: Chiffre d'Affaires Global */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Bénéfice Cumulé
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {formatFCFA(totalProfitAllTime)}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Total C.A. encaissé : <strong className="text-slate-700 tabular-nums">{formatFCFA(totalSalesAllTime)}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Stock Alerts Section (if any product is low or out) */}
      {lowStockItems.length > 0 && (
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  Alerte Stock Faible ({lowStockItems.length} produit{lowStockItems.length > 1 ? 's' : ''} concerné{lowStockItems.length > 1 ? 's' : ''})
                </h3>
                <p className="text-xs text-amber-800">
                  Ces produits ont atteint leur seuil critique. Pensez à vous réapprovisionner auprès de vos fournisseurs.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs font-semibold text-amber-900 hover:text-amber-950 underline flex items-center gap-1 self-start sm:self-auto"
            >
              Gérer dans le catalogue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockItems.slice(0, 6).map((item) => {
              const isOut = item.quantity <= 0;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-amber-200 rounded-lg p-3.5 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.category} · Prix : {formatFCFA(item.sellingPrice)}
                    </p>
                    <p className="text-xs mt-1">
                      {isOut ? (
                        <span className="font-bold text-red-600">Rupture totale (0 restant)</span>
                      ) : (
                        <span className="font-semibold text-amber-700">
                          Reste seulement {item.quantity} pièce{item.quantity > 1 ? 's' : ''} (alerte si ≤ {item.minAlertStock})
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenRestock(item)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors shrink-0"
                    title="Ajouter du stock"
                  >
                    + Stock
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Quick Actions & Recent Sales Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Launch & Helpful Tips */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Actions Rapides
          </h3>

          <div className="space-y-2.5">
            <button
              onClick={() => onOpenNewSale()}
              className="w-full p-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl shadow-xs transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/40 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold">Enregistrer une vente</span>
                  <span className="block text-xs text-emerald-100">Décrémente le stock et calcule le gain</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenAddProduct}
              className="w-full p-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 rounded-xl shadow-2xs transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <Package className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold">Ajouter un produit</span>
                  <span className="block text-xs text-slate-500">Téléphone, écouteur, câble, vitre...</span>
                </div>
              </div>
              <PlusCircle className="w-5 h-5 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className="w-full p-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 rounded-xl shadow-2xs transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold">Bilan & Historique</span>
                  <span className="block text-xs text-slate-500">Consulter et exporter les ventes</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick Helper Box */}
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Comment est calculé le bénéfice brut ?</span>
            </div>
            <p>
              Pour chaque vente : <br />
              <code className="text-slate-800 font-mono">Bénéfice = (Prix de Vente - Prix d'Achat) × Quantité</code>.
            </p>
            <p className="text-slate-500">
              Si vous accordez une remise au client au moment de la vente, le bénéfice s'ajuste automatiquement.
            </p>
          </div>
        </div>

        {/* Recent Sales List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Dernières Ventes Enregistrées
            </h3>
            {sales.length > 0 && (
              <button
                onClick={() => setActiveTab('history')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                Voir tout l'historique ({sales.length}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            {sales.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  Aucune vente enregistrée pour le moment
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Dès que vous enregistrerez votre première vente, elle apparaîtra ici avec son bénéfice net calculé en direct.
                </p>
                <button
                  onClick={() => onOpenNewSale()}
                  disabled={products.length === 0}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors"
                >
                  Faire une vente test
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {sale.productName}
                        </p>
                        <span className="text-xs text-slate-500">
                          × {sale.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>{formatDateTime(sale.date)}</span>
                        <span>·</span>
                        <span className="text-slate-700">{sale.paymentMethod}</span>
                        {sale.customerName && (
                          <>
                            <span>·</span>
                            <span className="italic">{sale.customerName}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-slate-900 tabular-nums">
                        {formatFCFA(sale.totalAmount)}
                      </div>
                      <div className="text-xs font-semibold text-emerald-600 tabular-nums">
                        +{formatFCFA(sale.profit)} gain
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
