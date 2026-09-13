import { useState, useMemo } from 'react';
import { CODEX_FOUNDATION_ENTRIES } from '../data/codexData';
import { EpistemicBadge } from '../components/common/EpistemicBadge';
import { CodexEntry, EpistemicStatus } from '../types';
import { 
  Search, 
  BookOpen, 
  Filter, 
  Tag, 
  Sigma, 
  ExternalLink, 
  X, 
  Layers, 
  Clock, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface CodexViewProps {
  onOpenEpistemicLegend: () => void;
}

export function CodexView({ onOpenEpistemicLegend }: CodexViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<EpistemicStatus | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeEntry, setActiveEntry] = useState<CodexEntry | null>(null);

  const categories = ['ALL', 'GEOMETRY', 'PHYSICS', 'TOPOLOGY', 'EPISTEMOLOGY'];

  const filteredEntries = useMemo(() => {
    return CODEX_FOUNDATION_ENTRIES.filter((entry) => {
      const matchesSearch = 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = selectedStatus === 'ALL' || entry.epistemicStatus === selectedStatus;
      const matchesCategory = selectedCategory === 'ALL' || entry.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, selectedStatus, selectedCategory]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium tracking-wider bg-purple-950 text-purple-400 border border-purple-800">
              MODULE 03
            </span>
            <span className="text-xs font-mono text-slate-400">ENCYCLOPEDIC ARCHIVE FOUNDATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
            Explorer&apos;s Codex: <span className="text-purple-400">Theoretical Knowledge Base</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Foundation index of the planned 300+ article codex, providing mathematically precise formulations and empirical boundary verifications.
          </p>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>8 FOUNDATION ENTRIES // 300+ IN DEVELOPMENT</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="codex-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts, mathematical theorems, formulas, or tags..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Epistemic Status Filter */}
          <div className="md:col-span-3">
            <select
              id="codex-status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Epistemic Classes</option>
              <option value="ESTABLISHED">Established Science</option>
              <option value="MATHEMATICAL">Mathematical Truth</option>
              <option value="HYPOTHETICAL">Hypothetical Model</option>
              <option value="SPECULATIVE">Theoretical Speculation</option>
              <option value="FICTIONAL">Fictional / Pedagogical</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              id="codex-category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-purple-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-500 font-mono text-[11px]">Active Filters:</span>
          {selectedStatus !== 'ALL' && (
            <span className="px-2 py-0.5 rounded-md bg-purple-950 text-purple-300 border border-purple-800 font-mono text-[10px] flex items-center gap-1">
              Status: {selectedStatus}
              <button onClick={() => setSelectedStatus('ALL')} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedCategory !== 'ALL' && (
            <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono text-[10px] flex items-center gap-1">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('ALL')} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}
          {searchQuery && (
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono text-[10px] flex items-center gap-1">
              Query: &quot;{searchQuery}&quot;
              <button onClick={() => setSearchQuery('')} className="hover:text-white"><X className="w-3 h-3" /></button>
            </span>
          )}
          {(selectedStatus !== 'ALL' || selectedCategory !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedStatus('ALL');
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="text-[10px] font-mono text-slate-400 hover:text-white underline ml-1"
            >
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* Entries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            id={`codex-entry-${entry.id}`}
            onClick={() => setActiveEntry(entry)}
            className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {entry.category}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">
                    DIM: {entry.dimension}
                  </span>
                </div>
                <EpistemicBadge status={entry.epistemicStatus} size="sm" />
              </div>

              <h3 className="text-base font-bold font-display text-white group-hover:text-purple-300 transition-colors">
                {entry.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                {entry.summary}
              </p>

              {entry.mathematicalFormalism && (
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs text-cyan-300/90 overflow-x-auto">
                  {entry.mathematicalFormalism}
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="text-[11px] text-slate-400">
                <span className="font-mono text-slate-500">EMPIRICAL STATUS: </span>
                {entry.empiricalStatus}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-850"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal Reader for Codex Entry */}
      {activeEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setActiveEntry(null)}
        >
          <div
            className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                    {activeEntry.category}
                  </span>
                  <span className="text-xs font-mono text-cyan-400">
                    TARGET: {activeEntry.dimension}
                  </span>
                </div>
                <h2 className="text-xl font-bold font-display text-white">
                  {activeEntry.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveEntry(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="font-mono text-slate-400 text-xs">EPISTEMOLOGICAL STATUS:</span>
                <EpistemicBadge status={activeEntry.epistemicStatus} size="md" />
              </div>

              <div>
                <span className="font-mono text-slate-400 text-xs block mb-1">DETAILED ANALYSIS:</span>
                <p className="text-slate-200 leading-relaxed">{activeEntry.summary}</p>
              </div>

              {activeEntry.mathematicalFormalism && (
                <div>
                  <span className="font-mono text-slate-400 text-xs block mb-1">MATHEMATICAL FORMALISM:</span>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300 text-xs">
                    {activeEntry.mathematicalFormalism}
                  </div>
                </div>
              )}

              <div>
                <span className="font-mono text-slate-400 text-xs block mb-1">EMPIRICAL BOUNDS / PHYSICAL CLAIM CHECK:</span>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs leading-relaxed">
                  {activeEntry.empiricalStatus}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveEntry(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono"
              >
                Close Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
