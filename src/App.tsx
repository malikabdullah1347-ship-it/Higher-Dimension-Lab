/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { ModuleId, DimensionId, EpistemicStatus } from './types';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { StatusBar } from './components/layout/StatusBar';
import { EpistemicLegendModal } from './components/common/EpistemicLegendModal';
import { DashboardView } from './views/DashboardView';
import { DimensionLabView } from './views/DimensionLabView';
import { TimeLabView } from './views/TimeLabView';
import { CodexView } from './views/CodexView';
import { ExperimentsView } from './views/ExperimentsView';
import { FrontierView } from './views/FrontierView';

export default function App() {
  const [currentModule, setCurrentModule] = useState<ModuleId>('overview');
  const [activeDimension, setActiveDimension] = useState<DimensionId>('3D');
  const [isEpistemicLegendOpen, setIsEpistemicLegendOpen] = useState<boolean>(false);
  const [inspectedStatus, setInspectedStatus] = useState<EpistemicStatus | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  // Keyboard shortcut Ctrl+B / Cmd+B for sidebar toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleToggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleSidebar]);

  const handleOpenEpistemicLegend = (status?: EpistemicStatus) => {
    setInspectedStatus(status || null);
    setIsEpistemicLegendOpen(true);
  };

  const handleCloseEpistemicLegend = () => {
    setIsEpistemicLegendOpen(false);
    setInspectedStatus(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 bg-grid-pattern selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        currentDimension={activeDimension}
        onSelectDimension={setActiveDimension}
        onOpenEpistemicLegend={() => handleOpenEpistemicLegend()}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Workspace Body: Foldable Sidebar + Active View */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto min-w-0 transition-all duration-300">
        {/* Modular Left Sidebar with Real Expanded/Collapsed States */}
        <Sidebar
          currentModule={currentModule}
          onSelectModule={setCurrentModule}
          onOpenEpistemicLegend={() => handleOpenEpistemicLegend()}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />

        {/* Dynamic Module Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto transition-all duration-300">
          {currentModule === 'overview' && (
            <DashboardView
              onSelectModule={setCurrentModule}
              activeDimension={activeDimension}
              onSelectDimension={setActiveDimension}
              onOpenEpistemicLegend={() => handleOpenEpistemicLegend()}
            />
          )}

          {currentModule === 'dimension-lab' && (
            <DimensionLabView
              activeDimension={activeDimension}
              onSelectDimension={setActiveDimension}
              onOpenEpistemicLegend={() => handleOpenEpistemicLegend()}
            />
          )}

          {currentModule === 'time-lab' && (
            <TimeLabView
              onOpenEpistemicLegend={() => handleOpenEpistemicLegend()}
            />
          )}

          {currentModule === 'codex' && (
            <CodexView
              onOpenEpistemicLegend={() => handleOpenEpistemicLegend()}
            />
          )}

          {currentModule === 'experiments' && (
            <ExperimentsView
              onOpenEpistemicLegend={() => handleOpenEpistemicLegend()}
            />
          )}

          {currentModule === 'frontier' && (
            <FrontierView
              onOpenEpistemicLegend={() => handleOpenEpistemicLegend()}
            />
          )}
        </main>
      </div>

      {/* Global Status Bar */}
      <StatusBar
        currentDimension={activeDimension}
        currentModule={currentModule}
        onOpenEpistemicLegend={() => handleOpenEpistemicLegend()}
      />

      {/* Epistemological Status Protocol Modal */}
      <EpistemicLegendModal
        isOpen={isEpistemicLegendOpen}
        onClose={handleCloseEpistemicLegend}
        selectedStatus={inspectedStatus}
      />
    </div>
  );
}
