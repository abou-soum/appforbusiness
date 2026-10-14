import React from 'react';
import { Smartphone, Download, X, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  canInstallDirectly: boolean;
  onDirectInstall: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
  canInstallDirectly,
  onDirectInstall,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Installer StockFacile sur Android
              </h3>
              <p className="text-xs text-slate-500">
                Application complète pour smartphones Samsung, Tecno, Infinix, Xiaomi...
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

        <div className="mt-4 space-y-4 text-xs text-slate-700">
          {/* Direct Install Button if supported */}
          {canInstallDirectly && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <p className="font-bold text-sm text-emerald-950">
                Votre téléphone est prêt pour l'installation directe !
              </p>
              <p className="text-emerald-800">
                Cliquez ci-dessous pour ajouter l'icône StockFacile sur votre écran d'accueil Android en 2 secondes.
              </p>
              <button
                onClick={() => {
                  onDirectInstall();
                  onClose();
                }}
                className="mt-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Installer maintenant sur mon Android</span>
              </button>
            </div>
          )}

          {/* Step by Step Android Manual Guide */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Méthode 1 : Installation instantanée (Recommandée)</span>
            </h4>
            <p className="text-slate-600">
              Grâce à la technologie <strong>PWA (Progressive Web App)</strong>, vous n'avez pas besoin de passer par le Play Store :
            </p>

            <ol className="list-decimal list-inside space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <li className="leading-relaxed">
                Ouvrez le lien de l'application sur votre téléphone Android dans le navigateur <strong>Google Chrome</strong>.
              </li>
              <li className="leading-relaxed">
                Appuyez sur les <strong>3 petits points verticaux (⋮)</strong> en haut à droite du navigateur.
              </li>
              <li className="leading-relaxed">
                Appuyez sur <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.
              </li>
              <li className="leading-relaxed">
                Appuyez sur <strong>Installer</strong> : l'icône StockFacile apparaît directement sur l'écran d'accueil de votre téléphone !
              </li>
            </ol>
          </div>

          {/* Advantages of the Android PWA */}
          <div className="p-3.5 bg-slate-100 rounded-xl space-y-1.5">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span>Avantages sur votre téléphone :</span>
            </p>
            <ul className="space-y-1 text-slate-600">
              <li>✓ S'ouvre en <strong>plein écran</strong> sans barre d'adresse comme une vraie application native.</li>
              <li>✓ Fonctionne même en cas de <strong>coupure internet</strong> grâce à la sauvegarde locale (`localStorage`).</li>
              <li>✓ N'encombre pas la mémoire (moins de 1 Mo).</li>
              <li>✓ Mises à jour automatiques transparentes.</li>
            </ul>
          </div>

          {/* Method 2: Convert to APK / Play Store */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">
              Méthode 2 : Vous souhaitez un fichier APK téléchargeable ?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Pour transformer cette application en fichier d'installation <strong>.APK</strong> ou la publier sur le <strong>Google Play Store</strong>, vous pouvez utiliser l'outil officiel gratuit <strong>PWABuilder</strong> (conçu par Microsoft et compatible Google Android) :
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-slate-600">
              <p>1. Allez sur <strong>pwabuilder.com</strong>.</p>
              <p>2. Collez l'URL de votre application.</p>
              <p>3. Cliquez sur <strong>« Package for Android »</strong> pour télécharger directement votre fichier APK signé.</p>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
