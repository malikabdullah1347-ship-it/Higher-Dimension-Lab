import { X, ShieldAlert, CheckCircle2, Sigma, Lightbulb, Compass, Film, ExternalLink } from 'lucide-react';
import { EPISTEMIC_REGISTRY, SCIENTIFIC_DISCLAIMER } from '../../data/epistemicStatus';
import { EpistemicStatus } from '../../types';

interface EpistemicLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStatus?: EpistemicStatus | null;
}

export function EpistemicLegendModal({ isOpen, onClose, selectedStatus }: EpistemicLegendModalProps) {
  if (!isOpen) return null;

  const getStatusIcon = (status: EpistemicStatus) => {
    switch (status) {
      case 'ESTABLISHED': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'MATHEMATICAL': return <Sigma className="w-5 h-5 text-cyan-400" />;
      case 'HYPOTHETICAL': return <Lightbulb className="w-5 h-5 text-amber-400" />;
      case 'SPECULATIVE': return <Compass className="w-5 h-5 text-purple-400" />;
      case 'FICTIONAL': return <Film className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div 
      id="epistemic-legend-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="epistemic-legend-modal"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800">
                SCIENTIFIC RIGOR PROTOCOL
              </span>
              <span className="text-xs font-mono text-slate-400">STATUS CLASSIFICATION SYSTEM</span>
            </div>
            <h2 className="text-2xl font-bold font-display tracking-wide text-white">
              Epistemological Status Registry
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              Higher Dimension Lab strictly demarcates physical empirical evidence, deductive mathematical models, unconfirmed hypotheses, and speculative analogies.
            </p>
          </div>
          <button
            id="close-epistemic-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demarcation Directive Box */}
        <div className="my-6 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-sm flex gap-3.5">
          <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-300 font-display tracking-wide">
              {SCIENTIFIC_DISCLAIMER.title}
            </div>
            <p className="mt-1 text-slate-300 text-xs sm:text-sm">
              {SCIENTIFIC_DISCLAIMER.notice}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-amber-200/80 list-disc list-inside">
              {SCIENTIFIC_DISCLAIMER.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Classification Cards */}
        <div className="space-y-4">
          {(Object.keys(EPISTEMIC_REGISTRY) as EpistemicStatus[]).map((statusKey) => {
            const item = EPISTEMIC_REGISTRY[statusKey];
            const isHighlighted = selectedStatus === statusKey;
            
            return (
              <div
                key={statusKey}
                id={`epistemic-category-${statusKey.toLowerCase()}`}
                className={`p-4 rounded-xl border transition-all ${
                  isHighlighted 
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50' 
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    {getStatusIcon(statusKey)}
                    <h3 className="font-semibold text-base font-display tracking-wide text-white">
                      {item.label}
                    </h3>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono border ${item.badgeBg} ${item.badgeText} ${item.badgeBorder}`}>
                    {item.status}
                  </span>
                </div>

                <p className="text-sm text-slate-300 mb-3 font-medium">
                  {item.shortDefinition}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                  <div>
                    <span className="font-mono text-slate-400 block mb-1">EPISTEMIC CRITERIA:</span>
                    <span className="text-slate-300 leading-relaxed">{item.epistemicCriteria}</span>
                  </div>
                  <div>
                    <span className="font-mono text-slate-400 block mb-1">CONCRETE EXAMPLES:</span>
                    <span className="text-slate-300 leading-relaxed">{item.example}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div>
            ISO-EP-501 STANDARD FOR SCIENTIFIC VISUALIZATION INTEGRITY
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
