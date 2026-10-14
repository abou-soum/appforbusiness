import React, { useState } from 'react';
import { Product } from '../types';
import { formatFCFA } from '../utils/formatters';
import { PackagePlus, X, Plus } from 'lucide-react';

interface RestockModalProps {
  product: Product;
  onClose: () => void;
  onRestock: (productId: string, quantityToAdd: number, updatedCostPrice?: number) => void;
}

export const RestockModal: React.FC<RestockModalProps> = ({
  product,
  onClose,
  onRestock,
}) => {
  const [quantityToAdd, setQuantityToAdd] = useState<number>(5);
  const [costPrice, setCostPrice] = useState<number>(product.costPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantityToAdd <= 0) return;
    onRestock(product.id, quantityToAdd, costPrice !== product.costPrice ? costPrice : undefined);
    onClose();
  };

  const newStockTotal = product.quantity + quantityToAdd;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PackagePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Réapprovisionner le stock
              </h3>
              <p className="text-xs text-slate-500">
                {product.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Current Stock Banner */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
            <span className="text-slate-600">Stock actuellement en rayon :</span>
            <strong className="text-sm font-bold text-slate-900 tabular-nums">
              {product.quantity} pièce{product.quantity > 1 ? 's' : ''}
            </strong>
          </div>

          {/* Quick preset buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ajout rapide d'exemplaires :
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 5, 10, 20].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setQuantityToAdd(preset)}
                  className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    quantityToAdd === preset
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Quantity */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantité d'unités reçues *
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantityToAdd(Math.max(1, quantityToAdd - 1))}
                className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                required
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 px-3 py-2 text-center text-base font-bold tabular-nums border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800"
              />
              <button
                type="button"
                onClick={() => setQuantityToAdd(quantityToAdd + 1)}
                className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Price adjustment if supplier price changed */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Prix d'achat unitaire de ce lot (FCFA)
            </label>
            <input
              type="number"
              min="0"
              step="100"
              value={costPrice}
              onChange={(e) => setCostPrice(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm tabular-nums border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800"
            />
            <span className="text-2xs text-slate-500 mt-0.5 block">
              Modifiez seulement si votre fournisseur a changé son prix.
            </span>
          </div>

          {/* Preview result */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-950 font-bold">
            <span>Nouveau stock après validation :</span>
            <span className="text-sm font-extrabold text-emerald-700 tabular-nums">
              {newStockTotal} pièces ({product.quantity} + {quantityToAdd})
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Valider le réapprovisionnement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
