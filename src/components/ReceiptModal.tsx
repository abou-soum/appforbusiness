import React from 'react';
import { Sale, ShopSettings } from '../types';
import { formatFCFA, formatDateTime } from '../utils/formatters';
import { Printer, X, Smartphone, Check } from 'lucide-react';

interface ReceiptModalProps {
  sale: Sale;
  settings: ShopSettings;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  sale,
  settings,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
        {/* Top actions */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Reçu de Vente
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
              title="Imprimer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Receipt Body */}
        <div id="printable-receipt" className="py-4 space-y-4 text-slate-900 font-sans">
          {/* Header */}
          <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
            <div className="w-10 h-10 mx-auto rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center mb-1">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-base tracking-tight text-slate-900">
              {settings.shopName || 'StockFacile Boutique'}
            </h4>
            <p className="text-xs text-slate-500">
              {settings.address || 'Téléphones & Accessoires'}
            </p>
            <p className="text-xs text-slate-500">
              Tél : {settings.phone || '+225 00 00 00 00'}
            </p>
          </div>

          {/* Transaction Metadata */}
          <div className="text-xs space-y-1 text-slate-600 pb-2 border-b border-slate-100">
            <div className="flex justify-between">
              <span>Date :</span>
              <strong className="text-slate-800">{formatDateTime(sale.date)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Reçu N° :</span>
              <strong className="font-mono text-slate-800">{sale.id.slice(-8).toUpperCase()}</strong>
            </div>
            {sale.customerName && (
              <div className="flex justify-between">
                <span>Client :</span>
                <strong className="text-slate-800">{sale.customerName}</strong>
              </div>
            )}
            <div className="flex justify-between">
              <span>Paiement :</span>
              <strong className="text-slate-800">{sale.paymentMethod}</strong>
            </div>
          </div>

          {/* Purchased Items */}
          <div className="space-y-2 py-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 border-b border-slate-200 pb-1">
              <span>Désignation</span>
              <span>Total</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs items-start">
                <div className="pr-2">
                  <p className="font-bold text-slate-900">{sale.productName}</p>
                  <p className="text-2xs text-slate-500">
                    {sale.quantity} × {formatFCFA(sale.unitSellingPrice)}
                  </p>
                </div>
                <div className="font-bold text-slate-900 tabular-nums whitespace-nowrap text-right">
                  {formatFCFA(sale.totalAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* Total & Receipt Summary */}
          <div className="border-t border-dashed border-slate-300 pt-3 space-y-1.5">
            <div className="flex justify-between text-base font-extrabold text-slate-900">
              <span>NET À PAYER :</span>
              <span className="tabular-nums text-emerald-700">
                {formatFCFA(sale.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-2xs text-slate-500">
              <span>Statut :</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-0.5">
                <Check className="w-3 h-3" /> Payé intégralement
              </span>
            </div>
          </div>

          {/* Note or Footer */}
          {sale.notes && (
            <div className="p-2 bg-slate-50 rounded-md text-2xs text-slate-600 italic">
              Note : {sale.notes}
            </div>
          )}

          <div className="text-center pt-3 border-t border-slate-100 text-2xs text-slate-500 space-y-0.5">
            <p className="font-semibold text-slate-700">Merci pour votre confiance !</p>
            <p>Vérifiez vos articles avant de quitter le comptoir.</p>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={handlePrint}
            className="w-full py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
