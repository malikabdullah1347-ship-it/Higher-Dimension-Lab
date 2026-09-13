import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { 
  Geometry4D, 
  Mesh3D, 
  CrossSectionTelemetry, 
  ObservationMode 
} from '../../engine/geometry/types';
import { OBJECTS_4D_CATALOG, Object4DDefinition, getObject4DById } from '../../engine/geometry';
import { TransformationPipeline4D, Preset4DRotation } from '../../engine/transforms/TransformationPipeline4D';
import { PerspectiveProjection4Dto3D, Projection4DConfig } from '../../engine/projections/PerspectiveProjection4Dto3D';
import { HyperplaneSlicer4D } from '../../engine/slicing/HyperplaneSlicer4D';
import { ThreeDimensionRenderer } from '../../engine/rendering/ThreeDimensionRenderer';
import { RotationPlane4D } from '../../engine/math/Matrix4D';
import { SlicingControls } from '../controls/SlicingControls';
import { RotationControls } from '../controls/RotationControls';
import { ProjectionControls } from '../controls/ProjectionControls';
import { ScientificTelemetryPanel } from './ScientificTelemetryPanel';
import { TransformationInspectorModal } from './TransformationInspectorModal';
import { GuidedExplanationDrawer } from './GuidedExplanationDrawer';
import { TutorHelpModal } from './TutorHelpModal';
import { SliceVsProjectionModal } from './SliceVsProjectionModal';
import { 
  Eye, 
  Scissors, 
  Layers, 
  Sliders, 
  HelpCircle, 
  Sparkles, 
  Code2, 
  RotateCcw, 
  Compass, 
  Info,
  Maximize2
} from 'lucide-react';

interface FourDimensionWorkstationProps {
  onOpenEpistemicLegend: () => void;
}

export function FourDimensionWorkstation({ onOpenEpistemicLegend }: FourDimensionWorkstationProps) {
  // 1. Core State
  const [selectedObjectId, setSelectedObjectId] = useState<string>('tesseract');
  const [mode, setMode] = useState<ObservationMode>('PROJECTION');
  const [activeControlTab, setActiveControlTab] = useState<'SLICING' | 'ROTATION' | 'PROJECTION'>('SLICING');

  // 2. Modals & Guided Drawers State
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isGuidedOpen, setIsGuidedOpen] = useState(false);
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [isSliceVsProjOpen, setIsSliceVsProjOpen] = useState(false);

  // 3. Engine Instances (memoized across renders)
  const pipeline = useMemo(() => new TransformationPipeline4D(), []);
  const projector = useMemo(() => new PerspectiveProjection4Dto3D({ distance: 2.8 }), []);
  const slicer = useMemo(() => new HyperplaneSlicer4D({ w: 0.0 }), []);

  // 4. Reactive Geometry & Control States
  const [currentGeometry, setCurrentGeometry] = useState<Geometry4D>(() => getObject4DById('tesseract'));
  const [w, setW] = useState<number>(0.0);
  const [isSweepingW, setIsSweepingW] = useState<boolean>(false);
  const [sweepSpeed, setSweepSpeed] = useState<number>(0.7);
  const [sweepDirection, setSweepDirection] = useState<number>(1);
  const [isPausedRotation, setIsPausedRotation] = useState<boolean>(false);
  const [projectionConfig, setProjectionConfig] = useState<Projection4DConfig>(projector.config);
  const [rotationState, setRotationState] = useState(() => ({ ...pipeline.state }));

  // 5. Computed Telemetry & Transformed Geometry
  const [sliceTelemetry, setSliceTelemetry] = useState<CrossSectionTelemetry>(() => {
    const transformed = pipeline.transform(currentGeometry);
    return slicer.sliceGeometry(currentGeometry, transformed).telemetry;
  });

  // 6. Canvas & Renderer References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<ThreeDimensionRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Handle Object Change
  const handleSelectObject = (id: string) => {
    setSelectedObjectId(id);
    const newGeom = getObject4DById(id);
    setCurrentGeometry(newGeom);
    pipeline.reset();
    setRotationState({ ...pipeline.state });
    setW(0.0);
    slicer.setW(0.0);
  };

  // Initialize Three.js Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const width = parent?.clientWidth || 800;
    const height = Math.min(width * 0.65, 520);

    const renderer = new ThreeDimensionRenderer({
      canvas,
      width,
      height,
      mode,
    });
    rendererRef.current = renderer;

    // Handle container resize with requestAnimationFrame to prevent ResizeObserver loop error
    let rafId: number | null = null;
    const resizeObserver = new ResizeObserver((entries) => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        for (const entry of entries) {
          const cr = entry.contentRect;
          if (cr.width > 0 && rendererRef.current) {
            const h = Math.min(cr.width * 0.65, 520);
            rendererRef.current.resize(cr.width, h);
          }
        }
      });
    });

    if (parent) resizeObserver.observe(parent);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (parent) resizeObserver.unobserve(parent);
      renderer.dispose();
      rendererRef.current = null;
    };
  }, []);

  // Update Renderer Observation Mode
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setMode(mode);
    }
  }, [mode]);

  // W Coordinate Manual Change
  const handleWChange = useCallback((newW: number) => {
    setW(newW);
    slicer.setW(newW);
  }, [slicer]);

  // Main Render and Animation Loop (60 FPS)
  useEffect(() => {
    let isRunning = true;

    const tick = (now: number) => {
      if (!isRunning) return;

      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // 1. Tick 4D rotation pipeline
      if (!isPausedRotation) {
        pipeline.tick(dt);
      }

      // 2. Tick Automated W Sweep if active
      if (isSweepingW) {
        setW((prevW) => {
          const bounds = currentGeometry.bounds;
          const limit = bounds.radius * 1.15;
          let nextW = prevW + sweepDirection * sweepSpeed * dt;

          if (nextW > limit) {
            nextW = limit;
            setSweepDirection(-1);
          } else if (nextW < -limit) {
            nextW = -limit;
            setSweepDirection(1);
          }

          slicer.setW(nextW);
          return nextW;
        });
      }

      // 3. Compute 4D Transformations
      const transformedVertices = pipeline.transform(currentGeometry);

      // 4. Compute 4D -> 3D Projection
      const projectedMesh = projector.projectGeometry(currentGeometry, transformedVertices);

      // 5. Compute Real 4D Hyperplane Slice
      const { mesh: sliceMesh, telemetry } = slicer.sliceGeometry(currentGeometry, transformedVertices);

      // 6. Update WebGL Scene & Render
      if (rendererRef.current) {
        rendererRef.current.updateProjectionMesh(projectedMesh, currentGeometry);
        rendererRef.current.updateSliceMesh(sliceMesh);
        rendererRef.current.updateHyperplaneIndicator(w, mode === 'SLICE' || mode === 'COMPARE');
        rendererRef.current.render();
      }

      // 7. Update Telemetry State periodically to avoid excess React rendering overhead
      setSliceTelemetry(telemetry);

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentGeometry, isPausedRotation, isSweepingW, sweepSpeed, sweepDirection, mode, w, pipeline, projector, slicer]);

  // Step along W
  const handleStepW = (delta: number) => {
    const nextW = Math.max(-3.0, Math.min(3.0, w + delta));
    handleWChange(nextW);
  };

  // Reset W
  const handleResetW = () => {
    handleWChange(0.0);
    setIsSweepingW(false);
  };

  // Rotation plane handlers
  const handleAngleChange = (plane: RotationPlane4D, angleRad: number) => {
    pipeline.setAngle(plane, angleRad);
    setRotationState({ ...pipeline.state });
  };

  const handleVelocityChange = (plane: RotationPlane4D, vel: number) => {
    pipeline.setVelocity(plane, vel);
    setRotationState({ ...pipeline.state });
  };

  const handleTogglePlane = (plane: RotationPlane4D) => {
    pipeline.togglePlane(plane);
    setRotationState({ ...pipeline.state });
  };

  const handleSelectPreset = (preset: Preset4DRotation) => {
    pipeline.setPreset(preset);
    setRotationState({ ...pipeline.state });
    setIsPausedRotation(preset === 'STATIC');
  };

  const handleResetRotations = () => {
    pipeline.reset();
    setRotationState({ ...pipeline.state });
  };

  // Projection handlers
  const handleDistanceChange = (d: number) => {
    projector.setDistance(d);
    setProjectionConfig({ ...projector.config });
  };

  const handleOrthographicToggle = (ortho: boolean) => {
    projector.setOrthographic(ortho);
    setProjectionConfig({ ...projector.config });
  };

  const handleResetProjection = () => {
    projector.setDistance(2.8);
    projector.setOrthographic(false);
    setProjectionConfig({ ...projector.config });
  };

  const activeDef = OBJECTS_4D_CATALOG.find((o) => o.id === selectedObjectId) || OBJECTS_4D_CATALOG[0];

  return (
    <div className="space-y-6">
      {/* Workstation Top Toolbar */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        {/* Left: 4D Polytope Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline">
            4D Object:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {OBJECTS_4D_CATALOG.map((obj) => (
              <button
                key={obj.id}
                type="button"
                id={`btn-select-4d-${obj.id}`}
                onClick={() => handleSelectObject(obj.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  selectedObjectId === obj.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{obj.shortName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Observation Mode Switcher (Projection vs Slice vs Compare) */}
        <div className="p-1 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => setMode('PROJECTION')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              mode === 'PROJECTION'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>4D Projection</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('SLICE');
              setActiveControlTab('SLICING');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              mode === 'SLICE'
                ? 'bg-purple-600 text-white font-bold shadow-sm shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>4D Slicing</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('COMPARE')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              mode === 'COMPARE'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Compare Mode</span>
          </button>
        </div>

        {/* Right: Educational & Inspector Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsGuidedOpen(true)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-mono bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800 flex items-center gap-1.5 transition-all"
            title="Step-by-step visual explanation of 4D slicing and projection"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Show Me What Is Happening</span>
            <span className="sm:hidden">Explain</span>
          </button>

          <button
            type="button"
            onClick={() => setIsInspectorOpen(true)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-mono bg-slate-950 hover:bg-slate-800 text-purple-300 border border-purple-800/60 flex items-center gap-1.5 transition-all"
            title="Inspect 4x4 matrix and 4D vertex coordinates"
          >
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Inspect SO(4)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTutorOpen(true)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-mono bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/60 flex items-center gap-1.5 transition-all"
            title="Having trouble understanding? Open the conceptual tutor guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">I Don&apos;t Understand</span>
          </button>
        </div>
      </div>

      {/* Main Workstation Stage: 3D WebGL Canvas & Live Telemetry HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 3D WebGL Viewport */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-2xl border border-slate-800 bg-slate-950/90 overflow-hidden shadow-2xl flex flex-col group">
            {/* Viewport Overlay HUD Bar */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800/80">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="text-xs font-mono font-bold text-white uppercase">
                  {currentGeometry.name}
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  [{mode}]
                </span>
              </div>

              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => rendererRef.current?.resetCamera()}
                  title="Reset 3D camera orientation and zoom"
                  className="px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1 transition-all shadow-md"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Camera</span>
                </button>
              </div>
            </div>

            {/* WebGL Canvas Container */}
            <div className="w-full relative flex items-center justify-center min-h-[380px] sm:min-h-[440px] bg-slate-950">
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-grab active:cursor-grabbing block"
              />

              {/* Bottom Canvas Interaction Guide */}
              <div className="absolute bottom-2.5 left-3 right-3 pointer-events-none flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-500 bg-slate-950/60 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800/50">
                <span>Left Drag: Orbit Camera | Right Drag: Pan | Scroll: Zoom</span>
                <span className="text-cyan-400">
                  {mode === 'COMPARE' ? 'Left: Projected 4D | Right: Calculated Slice' : mode === 'PROJECTION' ? '4D Perspective Shadow' : 'Exact 3D Hyperplane Cross-Section'}
                </span>
              </div>
            </div>
          </div>

          {/* Active Object Context & Slice Insight Card */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white font-display text-sm">
                Mathematical Context: {activeDef.name}
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                {activeDef.schläfliSymbol}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {activeDef.description}
            </p>
            <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-800/30 text-purple-300 text-[11px] font-mono mt-2">
              <strong>Slicing Behavior:</strong> {activeDef.sliceInsight}
            </div>
          </div>
        </div>

        {/* Right Column: Live Telemetry Instrument Panel */}
        <div className="lg:col-span-5 space-y-4">
          <ScientificTelemetryPanel
            geometry={currentGeometry}
            mode={mode}
            w={w}
            projectionDistance={projectionConfig.distance}
            rotationState={rotationState}
            sliceTelemetry={sliceTelemetry}
            onOpenEpistemicLegend={onOpenEpistemicLegend}
          />
        </div>
      </div>

      {/* Interactive Control Deck: Slicing / 4D Rotation / Projection Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Workstation Parameter Controls
            </span>
          </div>

          {/* Control Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveControlTab('SLICING')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                activeControlTab === 'SLICING'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scissors className="w-3 h-3" />
              <span>4D Slicing</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveControlTab('ROTATION')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                activeControlTab === 'ROTATION'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>4D Rotations (6 Planes)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveControlTab('PROJECTION')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all ${
                activeControlTab === 'PROJECTION'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Perspective Camera</span>
            </button>
          </div>
        </div>

        {/* Tab Viewport */}
        {activeControlTab === 'SLICING' && (
          <SlicingControls
            w={w}
            onWChange={handleWChange}
            isSweeping={isSweepingW}
            onToggleSweep={() => setIsSweepingW(!isSweepingW)}
            sweepSpeed={sweepSpeed}
            onSweepSpeedChange={setSweepSpeed}
            onStepW={handleStepW}
            onResetW={handleResetW}
            telemetry={sliceTelemetry}
            wBounds={[currentGeometry.bounds.wMin, currentGeometry.bounds.wMax]}
            onOpenSliceVsProjection={() => setIsSliceVsProjOpen(true)}
          />
        )}

        {activeControlTab === 'ROTATION' && (
          <RotationControls
            state={rotationState}
            isPaused={isPausedRotation}
            onTogglePause={() => setIsPausedRotation(!isPausedRotation)}
            onReset={handleResetRotations}
            onAngleChange={handleAngleChange}
            onVelocityChange={handleVelocityChange}
            onTogglePlane={handleTogglePlane}
            onSelectPreset={handleSelectPreset}
          />
        )}

        {activeControlTab === 'PROJECTION' && (
          <ProjectionControls
            config={projectionConfig}
            onDistanceChange={handleDistanceChange}
            onOrthographicToggle={handleOrthographicToggle}
            onScaleChange={() => {}}
            onReset={handleResetProjection}
          />
        )}
      </div>

      {/* Transformation Inspector Modal */}
      <TransformationInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        matrix={pipeline.currentMatrix}
        geometry={currentGeometry}
        transformedVertices={pipeline.transform(currentGeometry)}
        rotationState={rotationState}
        projectionConfig={projectionConfig}
        currentW={w}
      />

      {/* Guided Walkthrough Drawer */}
      <GuidedExplanationDrawer
        isOpen={isGuidedOpen}
        onClose={() => setIsGuidedOpen(false)}
        onJumpToStep={(step) => {
          if (step === 2 || step === 3) {
            setMode('SLICE');
            setActiveControlTab('SLICING');
          } else if (step === 4) {
            setMode('PROJECTION');
            setActiveControlTab('PROJECTION');
          } else if (step === 5) {
            setMode('COMPARE');
          }
        }}
      />

      {/* "I Don't Understand" Educational Tutor Modal */}
      <TutorHelpModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        activeObject={activeDef.name}
      />

      {/* Slicing vs Projection Demarcation Modal */}
      <SliceVsProjectionModal
        isOpen={isSliceVsProjOpen}
        onClose={() => setIsSliceVsProjOpen(false)}
        onSwitchToCompare={() => {
          setMode('COMPARE');
          setActiveControlTab('SLICING');
        }}
      />
    </div>
  );
}
