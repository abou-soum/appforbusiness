import React, { useState } from 'react';
import { ShopSettings, Product, Sale } from '../types';
import { exportBackupJSON } from '../utils/storage';
import { 
  HelpCircle, 
  Settings, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen, 
  Smartphone,
  Save
} from 'lucide-react';

interface SettingsAndHelpProps {
  settings: ShopSettings;
  products: Product[];
  sales: Sale[];
  onUpdateSettings: (newSettings: ShopSettings) => void;
  onLoadDemoData: () => void;
  onClearAllData: () => void;
  onImportData: (products: Product[], sales: Sale[], settings?: ShopSettings) => void;
  onOpenAndroidInstall: () => void;
}

export const SettingsAndHelp: React.FC<SettingsAndHelpProps> = ({
  settings,
  products,
  sales,
  onUpdateSettings,
  onLoadDemoData,
  onClearAllData,
  onImportData,
  onOpenAndroidInstall,
}) => {
  const [shopName, setShopName] = useState(settings.shopName);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [savedNotice, setSavedNotice] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importError, setImportError] = useState('');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      shopName: shopName.trim() || 'Ma Boutique Télécom',
      phone: phone.trim(),
      address: address.trim(),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.products || !Array.isArray(parsed.products)) {
          setImportError('Fichier de sauvegarde invalide : liste des produits manquante.');
          return;
        }
        onImportData(parsed.products, parsed.sales || [], parsed.settings);
        setImportError('');
        alert('Sauvegarde restaurée avec succès !');
      } catch (err) {
        setImportError('Impossible de lire le fichier JSON de sauvegarde.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-700" />
          <span>Guide d'Utilisation & Réglages</span>
        </h2>
        <p className="text-sm text-slate-600 mt-0.5">
          Apprenez à utiliser l'application pas à pas, personnalisez le nom de votre boutique et sécurisez vos données.
        </p>
      </div>

      {/* Guide Débutant Pas à Pas */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Guide Pas à Pas pour Débutant
            </h3>
            <p className="text-xs text-slate-500">
              Comment fonctionne StockFacile au quotidien dans votre boutique ?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1 */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">1</span>
              <span>Enregistrez vos articles en stock</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Allez dans l'onglet <strong>Produits & Stock</strong> et cliquez sur <em>Ajouter un Produit</em>. Indiquez le nom (ex : <em>iPhone 11</em>, <em>Chargeur 20W</em>), son prix d'achat fournisseur en FCFA, son prix de vente, la quantité reçue et le seuil d'alerte (ex : 3 pièces).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">2</span>
              <span>Enregistrez chaque vente dès qu'un client paie</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Quand un client achète, cliquez sur <strong>Nouvelle Vente</strong>. Sélectionnez l'article et la quantité. Le stock diminue automatiquement et le reçu peut être imprimé ou montré au client.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">3</span>
              <span>Suivez votre bénéfice net et le C.A.</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sur le <strong>Tableau de bord</strong>, l'application calcule automatiquement : <br />
              <code className="text-emerald-700 font-mono text-2xs">Bénéfice = Prix de vente - Prix d'achat</code>.<br />
              Vous savez exactement combien votre boutique a gagné aujourd'hui en FCFA.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">4</span>
              <span>Surveillez les alertes de stock faible</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dès qu'un article passe sous son seuil d'alerte (ou tombe à 0 en rupture), un message s'affiche sur le tableau de bord pour vous inviter à vous réapprovisionner auprès de votre grossiste.
            </p>
          </div>
        </div>
      </section>

      {/* Android App Section */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Application Mobile Android
              </h3>
              <p className="text-xs text-slate-500">
                Installez StockFacile sur votre téléphone comme une véritable application native.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAndroidInstall}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Guide & Installation Android</span>
          </button>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-600">
          <p className="font-bold text-slate-900">
            📱 Comment l'installer sur n'importe quel smartphone Android :
          </p>
          <p>
            1. Ouvrez ce site sur votre téléphone dans <strong>Google Chrome</strong>.<br />
            2. Appuyez sur le menu en haut à droite <strong>(⋮)</strong>.<br />
            3. Choisissez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.<br />
            4. L'application apparaît alors avec son icône sur votre écran d'accueil, s'ouvre en <strong>plein écran sans barre d'adresse</strong>, et conserve vos stocks et ventes même hors-ligne !
          </p>
        </div>
      </section>

      {/* Boutique Settings */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Coordonnées de votre Boutique
            </h3>
            <p className="text-xs text-slate-500">
              Ces informations s'affichent sur l'en-tête et sur les reçus de caisse remis aux clients.
            </p>
          </div>
        </div>

        {savedNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Coordonnées de la boutique enregistrées avec succès !</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nom commercial de la boutique *
              </label>
              <input
                type="text"
                required
                placeholder="Ex : Ivoire Mobile & Accessoires"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Téléphone de contact / WhatsApp *
              </label>
              <input
                type="text"
                placeholder="Ex : +225 07 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Adresse ou emplacement
            </label>
            <input
              type="text"
              placeholder="Ex : Marché Cocody, Face à la Pharmacie, Abidjan"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:border-slate-800"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Enregistrer les coordonnées</span>
            </button>
          </div>
        </form>
      </section>

      {/* Local Storage & Backup Management */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Sauvegarde & Données Locales (localStorage)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Toutes vos données sont stockées directement dans votre navigateur. Vous pouvez exporter une sauvegarde sur votre ordinateur ou charger des exemples pour tester.
          </p>
        </div>

        {importError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-lg">
            {importError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Export */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Télécharger une sauvegarde</span>
            </div>
            <p className="text-xs text-slate-600">
              Génère un fichier de sécurité contenant tous vos produits, quantités et ventes.
            </p>
            <button
              type="button"
              onClick={() => exportBackupJSON(products, sales, settings)}
              className="mt-2 w-full py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter mon fichier .JSON</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Restaurer une sauvegarde</span>
            </div>
            <p className="text-xs text-slate-600">
              Sélectionnez un fichier .JSON précédemment exporté pour recharger vos données.
            </p>
            <label className="mt-2 w-full py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Importer un fichier .JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Demo & Reset Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onLoadDemoData}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Charger le catalogue d'exemple (Téléphones & Accessoires)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Réinitialiser toutes les données</span>
          </button>
        </div>
      </section>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-center text-slate-900">
              Vider toutes les données ?
            </h4>
            <p className="text-xs text-slate-600 text-center mt-1">
              Cette action supprimera tous les produits, stocks et historiques de ventes de votre navigateur. Cette action est irréversible.
            </p>
            <div className="flex items-center justify-center gap-3 mt-5">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onClearAllData();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Oui, tout effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
