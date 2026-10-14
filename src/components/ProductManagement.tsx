import React, { useState, useMemo } from 'react';
import { Product, PRODUCT_CATEGORIES } from '../types';
import { formatFCFA, calculateMarginPercent } from '../utils/formatters';
import { 
  Package, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  ShoppingCart, 
  PlusCircle, 
  X,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

interface ProductManagementProps {
  products: Product[];
  onAddProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenNewSale: (product: Product) => void;
  onOpenRestock: (product: Product) => void;
  initialAddModalOpen?: boolean;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onOpenNewSale,
  onOpenRestock,
  initialAddModalOpen = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'in_stock'>('all');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(initialAddModalOpen);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>(PRODUCT_CATEGORIES[0]);
  const [costPrice, setCostPrice] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>(5);
  const [minAlertStock, setMinAlertStock] = useState<number | ''>(3);
  const [formError, setFormError] = useState('');

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setCategory(PRODUCT_CATEGORIES[0]);
    setCostPrice('');
    setSellingPrice('');
    setQuantity(5);
    setMinAlertStock(3);
    setFormError('');
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setCostPrice(p.costPrice);
    setSellingPrice(p.sellingPrice);
    setQuantity(p.quantity);
    setMinAlertStock(p.minAlertStock ?? 3);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setFormError('');
  };

  // Submit Add or Edit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Le nom du produit est obligatoire.');
      return;
    }
    const cost = Number(costPrice);
    const selling = Number(sellingPrice);
    const qty = Number(quantity);
    const minAlert = Number(minAlertStock);

    if (isNaN(cost) || cost < 0) {
      setFormError('Le prix d\'achat en FCFA doit être supérieur ou égal à 0.');
      return;
    }
    if (isNaN(selling) || selling <= 0) {
      setFormError('Le prix de vente en FCFA doit être supérieur à 0.');
      return;
    }
    if (isNaN(qty) || qty < 0) {
      setFormError('La quantité en stock doit être un nombre positif ou nul.');
      return;
    }

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        name: name.trim(),
        category,
        costPrice: cost,
        sellingPrice: selling,
        quantity: qty,
        minAlertStock: isNaN(minAlert) || minAlert < 0 ? 3 : minAlert,
        updatedAt: new Date().toISOString(),
      });
    } else {
      onAddProduct({
        name: name.trim(),
        category,
        costPrice: cost,
        sellingPrice: selling,
        quantity: qty,
        minAlertStock: isNaN(minAlert) || minAlert < 0 ? 3 : minAlert,
      });
    }

    handleCloseForm();
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      // Stock status
      const threshold = p.minAlertStock ?? 3;
      let matchesStock = true;
      if (stockFilter === 'low') {
        matchesStock = p.quantity > 0 && p.quantity <= threshold;
      } else if (stockFilter === 'out') {
        matchesStock = p.quantity <= 0;
      } else if (stockFilter === 'in_stock') {
        matchesStock = p.quantity > threshold;
      }

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  // Calculated preview values in form
  const parsedCost = Number(costPrice) || 0;
  const parsedSelling = Number(sellingPrice) || 0;
  const unitProfitPreview = parsedSelling - parsedCost;
  const marginPercentPreview = calculateMarginPercent(parsedCost, parsedSelling);

  return (
    <div className="space-y-6">
      {/* Top action & header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-slate-700" />
            <span>Gestion des Produits & Stock</span>
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Ajoutez, ajustez et surveillez tous vos articles et accessoires de boutique.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Produit</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher par nom (Tecno, écouteur, câble...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800 focus:bg-white transition-colors"
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

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800 focus:bg-white transition-colors"
            >
              <option value="all">Toutes les catégories</option>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Level Filter (Segmented control) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setStockFilter('all')}
              className={`flex-1 py-1.5 px-2 rounded-md transition-colors text-center ${
                stockFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous ({products.length})
            </button>
            <button
              onClick={() => setStockFilter('low')}
              className={`flex-1 py-1.5 px-2 rounded-md transition-colors text-center ${
                stockFilter === 'low'
                  ? 'bg-white text-amber-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Faible
            </button>
            <button
              onClick={() => setStockFilter('out')}
              className={`flex-1 py-1.5 px-2 rounded-md transition-colors text-center ${
                stockFilter === 'out'
                  ? 'bg-white text-red-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rupture
            </button>
          </div>
        </div>
      </div>

      {/* Product List / Table */}
      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {products.length === 0
              ? 'Aucun produit dans le catalogue'
              : 'Aucun produit ne correspond à votre recherche'}
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {products.length === 0
              ? 'Commencez par ajouter votre premier téléphone ou accessoire pour lancer vos ventes.'
              : 'Essayez de modifier vos filtres ou le texte de recherche.'}
          </p>
          {products.length === 0 ? (
            <button
              onClick={handleOpenAdd}
              className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter un produit
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setStockFilter('all');
              }}
              className="mt-4 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4 text-right">Prix Achat</th>
                  <th className="py-3 px-4 text-right">Prix Vente</th>
                  <th className="py-3 px-4 text-right">Marge / Gain</th>
                  <th className="py-3 px-4 text-center">Quantité</th>
                  <th className="py-3 px-4 text-center">État Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const threshold = p.minAlertStock ?? 3;
                  const isOut = p.quantity <= 0;
                  const isLow = p.quantity > 0 && p.quantity <= threshold;
                  const unitGain = p.sellingPrice - p.costPrice;
                  const marginPct = calculateMarginPercent(p.costPrice, p.sellingPrice);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {p.name}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {p.category}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-slate-600">
                        {formatFCFA(p.costPrice)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold tabular-nums text-slate-900">
                        {formatFCFA(p.sellingPrice)}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        <span className="font-semibold text-emerald-700">
                          +{formatFCFA(unitGain)}
                        </span>
                        <span className="text-xs text-slate-500 block">
                          ({marginPct}%)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center tabular-nums">
                        <span className={`font-bold text-base ${isOut ? 'text-red-600' : isLow ? 'text-amber-700' : 'text-slate-900'}`}>
                          {p.quantity}
                        </span>
                        <span className="text-xs text-slate-500 block">
                          seuil: {threshold}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isOut ? (
                          <span className="text-xs font-bold text-red-600 flex items-center justify-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Rupture
                          </span>
                        ) : isLow ? (
                          <span className="text-xs font-semibold text-amber-700 flex items-center justify-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Stock faible
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-emerald-700">
                            En stock
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenNewSale(p)}
                            disabled={isOut}
                            className="px-2.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-md transition-colors flex items-center gap-1"
                            title="Vendre cet article"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Vendre</span>
                          </button>

                          <button
                            onClick={() => onOpenRestock(p)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Réapprovisionner le stock (+)"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                            title="Modifier ce produit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Supprimer ce produit"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Cards View */}
          <div className="lg:hidden divide-y divide-slate-100">
            {filteredProducts.map((p) => {
              const threshold = p.minAlertStock ?? 3;
              const isOut = p.quantity <= 0;
              const isLow = p.quantity > 0 && p.quantity <= threshold;
              const unitGain = p.sellingPrice - p.costPrice;

              return (
                <div key={p.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {p.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {p.category}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-base text-slate-900 tabular-nums">
                        {formatFCFA(p.sellingPrice)}
                      </div>
                      <div className="text-xs text-slate-500 tabular-nums">
                        Achat : {formatFCFA(p.costPrice)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg">
                    <div>
                      <span className="text-slate-500">Stock restant : </span>
                      <strong className={`tabular-nums text-sm ${isOut ? 'text-red-600' : isLow ? 'text-amber-700' : 'text-slate-800'}`}>
                        {p.quantity} pièce{p.quantity > 1 ? 's' : ''}
                      </strong>
                    </div>
                    <div>
                      {isOut ? (
                        <span className="font-bold text-red-600 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Rupture
                        </span>
                      ) : isLow ? (
                        <span className="font-semibold text-amber-700 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Stock faible (≤ {threshold})
                        </span>
                      ) : (
                        <span className="font-semibold text-emerald-700">
                          Gain: +{formatFCFA(unitGain)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions mobile */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => onOpenNewSale(p)}
                      disabled={isOut}
                      className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Vendre</span>
                    </button>

                    <button
                      onClick={() => onOpenRestock(p)}
                      className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                      title="Ajouter du stock"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Stock</span>
                    </button>

                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                      title="Modifier"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setProductToDelete(p)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
              </h3>
              <button
                onClick={handleCloseForm}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom du produit ou modèle *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Tecno Spark 20, Oraimo Air F9, Vitre 9D iPhone..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catégorie *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prices Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Cost Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prix d'achat unitaire (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    placeholder="Ex : 50000"
                    value={costPrice}
                    onChange={(e) =>
                      setCostPrice(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full px-3.5 py-2.5 text-sm tabular-nums bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800"
                  />
                  <span className="text-2xs text-slate-500 mt-0.5 block">
                    Combien vous l'avez payé au fournisseur
                  </span>
                </div>

                {/* Selling Price */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prix de vente en boutique (FCFA) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    placeholder="Ex : 65000"
                    value={sellingPrice}
                    onChange={(e) =>
                      setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full px-3.5 py-2.5 text-sm tabular-nums bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800"
                  />
                  <span className="text-2xs text-slate-500 mt-0.5 block">
                    Prix proposé à vos clients
                  </span>
                </div>
              </div>

              {/* Profit Preview Box */}
              {parsedSelling > 0 && parsedCost > 0 && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between text-emerald-950 font-bold">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      Marge bénéficiaire unitaire estimée :
                    </span>
                    <span className="text-sm tabular-nums text-emerald-700">
                      +{formatFCFA(unitProfitPreview)}
                    </span>
                  </div>
                  <div className="text-emerald-800 flex justify-between">
                    <span>Taux de marge brute :</span>
                    <strong className="tabular-nums">{marginPercentPreview}%</strong>
                  </div>
                </div>
              )}

              {/* Quantities Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Stock Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantité en stock actuelle *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Ex : 10"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full px-3.5 py-2.5 text-sm tabular-nums bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800"
                  />
                  <span className="text-2xs text-slate-500 mt-0.5 block">
                    Nombre d'unités physiques disponibles
                  </span>
                </div>

                {/* Min Stock Alert */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seuil d'alerte stock faible *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Ex : 3"
                    value={minAlertStock}
                    onChange={(e) =>
                      setMinAlertStock(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full px-3.5 py-2.5 text-sm tabular-nums bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800"
                  />
                  <span className="text-2xs text-slate-500 mt-0.5 block">
                    Déclenche une alerte quand le stock descend à ce niveau
                  </span>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
                >
                  {editingProduct ? 'Enregistrer les modifications' : 'Ajouter le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-center text-slate-900">
              Supprimer ce produit ?
            </h4>
            <p className="text-xs text-slate-600 text-center mt-1">
              Êtes-vous sûr de vouloir supprimer <strong className="text-slate-900">{productToDelete.name}</strong> du stock ?
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onDeleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
