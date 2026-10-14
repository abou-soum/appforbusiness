import React, { useState, useMemo } from 'react';
import { Sale, Product } from '../types';
import { formatFCFA, formatDateTime, exportSalesToCSV } from '../utils/formatters';
import { 
  History, 
  Search, 
  Download, 
  Trash2, 
  Receipt, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Filter,
  X,
  RotateCcw
} from 'lucide-react';

interface SalesHistoryProps {
  sales: Sale[];
  products: Product[];
  onCancelSale: (saleId: string) => void;
  onViewReceipt: (sale: Sale) => void;
  onOpenNewSale: () => void;
}

type DatePeriod = 'today' | 'yesterday' | 'week' | 'month' | 'all';

export const SalesHistory: React.FC<SalesHistoryProps> = ({
  sales,
  products,
  onCancelSale,
  onViewReceipt,
  onOpenNewSale,
}) => {
  const [period, setPeriod] = useState<DatePeriod>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [saleToCancel, setSaleToCancel] = useState<Sale | null>(null);

  // Filtered sales
  const filteredSales = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const weekStart = todayStart - 7 * 86400000;
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    return sales.filter((sale) => {
      const saleTime = new Date(sale.date).getTime();

      // Period filter
      if (period === 'today' && saleTime < todayStart) return false;
      if (period === 'yesterday' && (saleTime < yesterdayStart || saleTime >= todayStart)) return false;
      if (period === 'week' && saleTime < weekStart) return false;
      if (period === 'month' && saleTime < monthStart) return false;

      // Search filter (product name, customer name, payment method)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchProduct = sale.productName.toLowerCase().includes(query);
        const matchCustomer = sale.customerName?.toLowerCase().includes(query) || false;
        const matchPayment = sale.paymentMethod.toLowerCase().includes(query);
        const matchCategory = sale.category.toLowerCase().includes(query);
        if (!matchProduct && !matchCustomer && !matchPayment && !matchCategory) {
          return false;
        }
      }

      return true;
    });
  }, [sales, period, searchQuery]);

  // Aggregate metrics for filtered period
  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.totalAmount, 0);
  const totalProfit = filteredSales.reduce((acc, s) => acc + s.profit, 0);
  const totalItemsSold = filteredSales.reduce((acc, s) => acc + s.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Title & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-slate-700" />
            <span>Historique des Ventes & Recettes</span>
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Consultez toutes les transactions, analysez les bénéfices et imprimez les reçus.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={() => exportSalesToCSV(filteredSales)}
            disabled={filteredSales.length === 0}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-2xs transition-colors flex items-center gap-2"
            title="Télécharger un fichier Excel / CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exporter en Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Strip for the selected period */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Chiffre d'Affaires (Période)
          </span>
          <div className="text-xl font-bold text-slate-900 tabular-nums mt-1">
            {formatFCFA(totalRevenue)}
          </div>
          <span className="text-2xs text-slate-500 mt-1 block">
            {filteredSales.length} transaction{filteredSales.length > 1 ? 's' : ''} enregistrée{filteredSales.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Bénéfice Brut Réalisé
          </span>
          <div className="text-xl font-bold text-emerald-600 tabular-nums mt-1">
            {formatFCFA(totalProfit)}
          </div>
          <span className="text-2xs text-slate-500 mt-1 block">
            {totalRevenue > 0
              ? `Taux moyen : ${Math.round((totalProfit / totalRevenue) * 100)}% de marge`
              : 'Aucune rentabilité'}
          </span>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Volume Vendu
          </span>
          <div className="text-xl font-bold text-slate-900 tabular-nums mt-1">
            {totalItemsSold} <span className="text-sm font-medium text-slate-500">articles</span>
          </div>
          <span className="text-2xs text-slate-500 mt-1 block">
            Téléphones, coques, chargeurs, etc.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Period selector buttons */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setPeriod('today')}
              className={`py-1.5 px-3 rounded-md transition-colors whitespace-nowrap ${
                period === 'today'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => setPeriod('yesterday')}
              className={`py-1.5 px-3 rounded-md transition-colors whitespace-nowrap ${
                period === 'yesterday'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hier
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`py-1.5 px-3 rounded-md transition-colors whitespace-nowrap ${
                period === 'week'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 derniers jours
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`py-1.5 px-3 rounded-md transition-colors whitespace-nowrap ${
                period === 'month'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ce mois
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`py-1.5 px-3 rounded-md transition-colors whitespace-nowrap ${
                period === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tout ({sales.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher produit, client, Wave..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sales List Table */}
      {filteredSales.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {sales.length === 0
              ? 'Aucune vente enregistrée'
              : 'Aucune vente pour cette période ou recherche'}
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {sales.length === 0
              ? 'Dès que vous vendrez un téléphone ou un accessoire, l\'opération apparaîtra ici avec son ticket.'
              : 'Essayez de changer la période (Aujourd\'hui / Ce mois / Tout) ou de réinitialiser la recherche.'}
          </p>
          {sales.length === 0 ? (
            <button
              onClick={onOpenNewSale}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              Enregistrer une vente
            </button>
          ) : (
            <button
              onClick={() => {
                setPeriod('all');
                setSearchQuery('');
              }}
              className="mt-4 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Afficher tout l'historique
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date & Heure</th>
                  <th className="py-3 px-4">Produit & Catégorie</th>
                  <th className="py-3 px-4 text-center">Quantité</th>
                  <th className="py-3 px-4 text-right">Prix Unitaire</th>
                  <th className="py-3 px-4 text-right">Total Vente</th>
                  <th className="py-3 px-4 text-right">Bénéfice</th>
                  <th className="py-3 px-4">Paiement & Client</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                      {formatDateTime(s.date)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{s.productName}</div>
                      <span className="text-2xs text-slate-500 font-normal">
                        {s.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center tabular-nums font-bold text-slate-900">
                      {s.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums text-slate-600">
                      {formatFCFA(s.unitSellingPrice)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold tabular-nums text-slate-900">
                      {formatFCFA(s.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-right tabular-nums">
                      <span className="font-semibold text-emerald-700">
                        +{formatFCFA(s.profit)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <span className="font-semibold text-slate-800 block">
                        {s.paymentMethod}
                      </span>
                      {s.customerName && (
                        <span className="text-slate-500 italic block truncate max-w-[150px]">
                          Client : {s.customerName}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewReceipt(s)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1"
                          title="Voir / Imprimer le reçu"
                        >
                          <Receipt className="w-3.5 h-3.5 text-slate-500" />
                          <span>Reçu</span>
                        </button>
                        <button
                          onClick={() => setSaleToCancel(s)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Annuler la vente (restaure le stock)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="lg:hidden divide-y divide-slate-100">
            {filteredSales.map((s) => (
              <div key={s.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {s.productName}
                    </h4>
                    <span className="text-2xs text-slate-500">
                      {formatDateTime(s.date)} · {s.category}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-base text-slate-900 tabular-nums">
                      {formatFCFA(s.totalAmount)}
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 tabular-nums">
                      +{formatFCFA(s.profit)} gain
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg text-slate-700">
                  <div>
                    <span>Quantité : </span>
                    <strong className="tabular-nums">{s.quantity}</strong> à {formatFCFA(s.unitSellingPrice)}
                  </div>
                  <div>
                    <span className="font-semibold">{s.paymentMethod}</span>
                    {s.customerName && <span className="italic"> ({s.customerName})</span>}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => onViewReceipt(s)}
                    className="flex-1 py-1.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Voir le ticket</span>
                  </button>
                  <button
                    onClick={() => setSaleToCancel(s)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors"
                    title="Annuler la vente"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel Sale Modal */}
      {saleToCancel && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-center text-slate-900">
              Annuler cette vente ?
            </h4>
            <p className="text-xs text-slate-600 text-center mt-1">
              Cette action supprimera la vente de l'historique et <strong className="text-slate-900">restaurera automatiquement {saleToCancel.quantity} pièce(s)</strong> dans le stock de <span className="font-bold">{saleToCancel.productName}</span>.
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={() => setSaleToCancel(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Garder la vente
              </button>
              <button
                onClick={() => {
                  onCancelSale(saleToCancel.id);
                  setSaleToCancel(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
