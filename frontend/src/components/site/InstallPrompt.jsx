import { useState } from 'react';
import { Download, X, Share } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useConfig } from '@/lib/ConfigContext';

export default function InstallPrompt() {
  const { canInstall, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const { config } = useConfig();
  const corPrimaria = config?.cor_primaria || '#B67D35';
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;
  if (!canInstall && !isIOS) return null;

  const handleInstall = async () => {
    const outcome = await promptInstall();
    if (outcome) setDismissed(true);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:max-w-sm z-30 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white border border-[#E0DCD6] rounded-2xl shadow-lg p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#B67D35]/10 flex items-center justify-center shrink-0">
          <Download size={18} className="text-[#B67D35]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#2b2622]">Instalar aplicativo</p>
          <p className="text-xs text-[#2b2622]/50 leading-snug">
            {isIOS
              ? 'Toque em Compartilhar e depois "Adicionar à Tela de Início"'
              : 'Acesse rapidamente sem abrir o navegador'}
          </p>
        </div>
        {isIOS ? (
          <Share size={18} className="text-[#B67D35] shrink-0" />
        ) : (
          <button
            onClick={handleInstall}
            className="px-4 py-2 text-white text-xs font-medium rounded-full transition-colors shrink-0 hover:opacity-90"
            style={{ backgroundColor: corPrimaria }}
          >
            Instalar
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-[#2b2622]/30 hover:text-[#2b2622] shrink-0"
          aria-label="Fechar"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
