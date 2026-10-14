import React, { useState, useEffect } from 'react';
import { Product, Sale, PaymentMethod, PAYMENT_METHODS } from '../types';
import { formatFCFA } from '../utils/formatters';
import { 
  ShoppingCart, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  TrendingUp, 
  User, 
  CreditCard,
  PackageCheck,
  RotateCcw
} from 'lucide-react';

interface NewSaleViewProps {
  products: Product[];
  preselectedProduct?: Product | null;
  onRecordSale: (saleData: {
    productId: string;
    productName: string;
    category: string;
    quantity: number;
    unitCostPrice: number;
    unitSellingPrice: number;
    paymentMethod: PaymentMethod;
    customerName?: string;
    notes?: string;
  }) => void;
  onOpenAddProduct: () => void;
}

export const NewSaleView: React.FC<NewSaleViewProps> = ({
  products,
  preselectedProduct,
  onRecordSale,
  onOpenAddProduct,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    preselectedProduct ? preselectedProduct.id : ''
  );
  const [productSearch, setProductSearch] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitSellingPrice, setUnitSellingPrice] = useState<number | ''>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Espèces');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [saleSuccess, setSaleSuccess] = useState(false);

  // Update selected product if prop changes
  useEffect(() => {
    if (preselectedProduct) {
      setSelectedProductId(preselectedProduct.id);
      setUnitSellingPrice(preselectedProduct.sellingPrice);
      setQuantity(1);
    } else if (products.length > 0 && !selectedProductId) {
      const firstAvailable = products.find((p) => p.quantity > 0) || products[0];
      setSelectedProductId(firstAvailable.id);
      setUnitSellingPrice(firstAvailable.sellingPrice);
    }
  }, [preselectedProduct, products]);

  // Find currently selected product object
  const currentProduct = products.find((p) => p.id === selectedProductId);

  // Whenever the user selects a new product from dropdown, update price
  const handleProductChange = (id: string) => {
    setSelectedProductId(id);
    const prod = products.find((p) => p.id === id);
    if (prod) {
      setUnitSellingPrice(prod.sellingPrice);
      setQuantity(1);
      setError('');
    }
  };

  // Calculations
  const numericPrice = Number(unitSellingPrice) || 0;
  const currentStock = currentProduct ? currentProduct.quantity : 0;
  const totalAmount = quantity * numericPrice;
  const totalCost = currentProduct ? quantity * currentProduct.costPrice : 0;
  const grossProfit = totalAmount - totalCost;
  const remainingStock = Math.max(0, currentStock - quantity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) {
      setError('Veuillez sélectionner un produit.');
      return;
    }
    if (currentStock <= 0) {
      setError(`Le produit "${currentProduct.name}" est en rupture de stock.`);
      return;
    }
    if (quantity <= 0) {
      setError('La quantité doit être supérieure ou égale à 1.');
      return;
    }
    if (quantity > currentStock) {
      setError(
        `Stock insuffisant : vous ne pouvez vendre que ${currentStock} pièce(s) maximum.`
      );
      return;
    }
    if (numericPrice <= 0) {
      setError('Le prix de vente doit être supérieur à 0 FCFA.');
      return;
    }

    onRecordSale({
      productId: currentProduct.id,
      productName: currentProduct.name,
      category: currentProduct.category,
      quantity,
      unitCostPrice: currentProduct.costPrice,
      unitSellingPrice: numericPrice,
      paymentMethod,
      customerName: customerName.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setSaleSuccess(true);
    // Reset inputs
    setQuantity(1);
    setCustomerName('');
    setNotes('');
    setTimeout(() => {
      setSaleSuccess(false);
    }, 4000);
  };

  // Filter available products for select box
  const availableProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  if (products.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white border border-slate-200 rounded-2xl text-center shadow-xs">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
          <ShoppingCart className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">
          Votre catalogue est vide
        </h3>
        <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
          Pour enregistrer une vente, commencez par ajouter au moins un produit ou un accessoire dans votre stock.
        </p>
        <button
          onClick={onOpenAddProduct}
          className="mt-5 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors inline-flex items-center gap-2"
        >
          Ajouter un premier produit
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-emerald-600" />
          <span>Enregistrer une Nouvelle Vente</span>
        </h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Sélectionnez le téléphone ou l'accessoire vendu. Le stock diminuera automatiquement.
        </p>
      </div>

      {/* Success Notification */}
      {saleSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-bold">Vente enregistrée avec succès !</p>
              <p className="text-xs text-emerald-700">
                Le stock a été décrémenté et les statistiques sont à jour.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSaleSuccess(false)}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Main Grid: Form Left (2 cols), Live summary Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Product selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Choisir l'article vendu *
                </label>
                {currentProduct && (
                  <span className={`text-xs font-semibold tabular-nums ${
                    currentProduct.quantity <= 0 
                      ? 'text-red-600 font-bold' 
                      : currentProduct.quantity <= (currentProduct.minAlertStock ?? 3) 
                      ? 'text-amber-700' 
                      : 'text-slate-600'
                  }`}>
                    Stock dispo : {currentProduct.quantity} pièce{currentProduct.quantity > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Fast search filter for products */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrer la liste des articles..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
                />
              </div>

              <select
                value={selectedProductId}
                onChange={(e) => handleProductChange(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800"
              >
                {availableProducts.map((p) => (
                  <option 
                    key={p.id} 
                    value={p.id} 
                    disabled={p.quantity <= 0}
                  >
                    {p.name} — {formatFCFA(p.sellingPrice)} ({p.quantity <= 0 ? 'RUPTURE' : `${p.quantity} en stock`})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity and Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantité à vendre *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={currentStock > 0 ? currentStock : 1}
                    required
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, val));
                    }}
                    className="flex-1 px-3 py-2 text-center text-base font-bold tabular-nums border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (quantity < currentStock) {
                        setQuantity(quantity + 1);
                      }
                    }}
                    disabled={quantity >= currentStock}
                    className="w-10 h-10 rounded-lg border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold"
                  >
                    +
                  </button>
                </div>
                {quantity > currentStock && (
                  <span className="text-2xs text-red-600 font-semibold block mt-1">
                    Dépasse le stock ({currentStock} max)
                  </span>
                )}
              </div>

              {/* Selling Price (editable for discounts!) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Prix unitaire vendu (FCFA) *
                  </label>
                  {currentProduct && currentProduct.sellingPrice !== numericPrice && (
                    <button
                      type="button"
                      onClick={() => setUnitSellingPrice(currentProduct.sellingPrice)}
                      className="text-2xs text-emerald-700 underline flex items-center gap-0.5"
                      title="Rétablir le prix normal"
                    >
                      <RotateCcw className="w-2.5 h-2.5" /> Normal : {formatFCFA(currentProduct.sellingPrice)}
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  required
                  min="0"
                  step="100"
                  value={unitSellingPrice}
                  onChange={(e) =>
                    setUnitSellingPrice(
                      e.target.value === '' ? '' : Number(e.target.value)
                    )
                  }
                  className="w-full px-3.5 py-2 text-base font-bold tabular-nums bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800"
                />
                <span className="text-2xs text-slate-500 mt-0.5 block">
                  Modifiable si vous accordez une remise au client.
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                <span>Moyen de paiement *</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-2.5 text-xs font-semibold rounded-lg border transition-all text-center whitespace-nowrap ${
                      paymentMethod === method
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Customer info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nom du client (optionnel)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex : Moussa, Client boutique..."
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Note / Remarque (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex : Garantie 3 mois, reçu demandé..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!currentProduct || currentStock <= 0 || quantity > currentStock}
            className="w-full py-3.5 px-4 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <PackageCheck className="w-5 h-5" />
            <span>Valider et enregistrer la vente ({formatFCFA(totalAmount)})</span>
          </button>
        </form>

        {/* Live Calculation & Stock Preview Sidebar */}
        <div className="space-y-4">
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Aperçu de la Transaction
            </h3>

            {/* Product details */}
            {currentProduct ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Article :</span>
                  <span className="text-sm font-bold text-slate-900 block">
                    {currentProduct.name}
                  </span>
                  <span className="text-2xs text-slate-500">
                    Catégorie : {currentProduct.category}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Stock actuel :</span>
                    <strong className="text-slate-900 tabular-nums">{currentStock} pièces</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Quantité vendue :</span>
                    <strong className="text-slate-900 tabular-nums">- {quantity} pièce{quantity > 1 ? 's' : ''}</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-800 font-bold">
                    <span>Stock restant :</span>
                    <span className={`tabular-nums ${remainingStock <= (currentProduct.minAlertStock ?? 3) ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {remainingStock} pièce{remainingStock > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Financial breakdown */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Total à encaisser (C.A.) :</span>
                    <span className="text-base font-extrabold text-slate-900 tabular-nums">
                      {formatFCFA(totalAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-500 text-2xs">
                    <span>Coût d'achat ({quantity} × {formatFCFA(currentProduct.costPrice)}) :</span>
                    <span className="tabular-nums">{formatFCFA(totalCost)}</span>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-emerald-950">
                    <div className="flex items-center gap-1.5 font-bold">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span>Bénéfice Net :</span>
                    </div>
                    <span className="text-base font-extrabold text-emerald-700 tabular-nums">
                      +{formatFCFA(grossProfit)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">
                Sélectionnez un article pour afficher les calculs en temps réel.
              </p>
            )}
          </div>

          {/* Quick guide reminder */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1.5">
            <p className="font-bold text-slate-900">
              💡 Conseil pour votre commerce
            </p>
            <p>
              Une fois la vente validée, le stock est immédiatement mis à jour et les bénéfices du jour s'ajustent sur votre tableau de bord.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
