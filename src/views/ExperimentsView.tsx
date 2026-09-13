import { useState } from 'react';
import { EXPERIMENTS_FOUNDATION } from '../data/experimentsData';
import { EpistemicBadge } from '../components/common/EpistemicBadge';
import { ExperimentEntry } from '../types';
import { FlaskConical, CheckCircle2, ShieldAlert, Cpu, Sparkles, ExternalLink, Play } from 'lucide-react';

interface ExperimentsViewProps {
  onOpenEpistemicLegend: () => void;
}

export function ExperimentsView({ onOpenEpistemicLegend }: ExperimentsViewProps) {
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentEntry>(EXPERIMENTS_FOUNDATION[0]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium tracking-wider bg-amber-950 text-amber-400 border border-amber-800">
              MODULE 04
            </span>
            <span className="text-xs font-mono text-slate-400">HYPOTHESIS & EXPERIMENT BENCH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
            Experiments Lab: <span className="text-amber-400">Thought & Physical Bounds</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Simulated thought experiments, dimensional analogies, and empirical null tests constraining extra dimensions.
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-amber-400" />
          <span>4 PROTOCOL EXPERIMENTS READY</span>
        </div>
      </div>

      {/* Main Grid: Experiment List + Active Bench Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Experiment Selector List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
            Standard Experiment Protocols
          </div>

          {EXPERIMENTS_FOUNDATION.map((exp) => {
            const isSelected = selectedExperiment.id === exp.id;
            return (
              <div
                key={exp.id}
                id={`experiment-item-${exp.id}`}
                onClick={() => setSelectedExperiment(exp)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-950/20 shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/40'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-400 font-semibold">
                    {exp.code}
                  </span>
                  <EpistemicBadge status={exp.epistemicStatus} size="sm" />
                </div>

                <h3 className="text-sm font-bold font-display text-white">
                  {exp.title}
                </h3>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>CATEGORY: {exp.category}</span>
                  <span className="text-cyan-400">{exp.dimensionTarget}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Experiment Bench */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    {selectedExperiment.code}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    TARGET: {selectedExperiment.dimensionTarget}
                  </span>
                </div>
                <h2 className="text-xl font-bold font-display text-white">
                  {selectedExperiment.title}
                </h2>
              </div>
              <EpistemicBadge
                status={selectedExperiment.epistemicStatus}
                size="md"
                interactive={true}
                onInspect={onOpenEpistemicLegend}
              />
            </div>

            {/* Hypothesis Box */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Primary Hypothesis:
              </span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed font-sans">
                {selectedExperiment.hypothesis}
              </div>
            </div>

            {/* Methodology */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Methodology & Setup:
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedExperiment.methodology}
              </p>
            </div>

            {/* Mathematical Model */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">
                Mathematical Formalism:
              </span>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 leading-relaxed overflow-x-auto">
                {selectedExperiment.mathematicalProofOrModel}
              </div>
            </div>

            {/* Physical Reality Check (Strict Anti-Slop / Anti-Fake Claim Protection) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>PHYSICAL REALITY CHECK & BOUNDS:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedExperiment.physicalRealityCheck}
              </p>
            </div>

            {/* Bench Controls / Status */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>BENCH STATUS: {selectedExperiment.statusPhase}</span>
              </div>
              <span className="text-slate-400">EXPANSION SIMULATOR READY IN PHASE 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
