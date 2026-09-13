import React, { useRef, useEffect, useState } from 'react';
import { DimensionId, ModuleId } from '../../types';
import { 
  ArrowRight, 
  Layers, 
  Orbit, 
  Compass, 
  Sparkles, 
  ShieldCheck, 
  Maximize2,
  Atom,
  ChevronRight,
  Activity
} from 'lucide-react';

interface DimensionalObservatoryHeroProps {
  activeDimension: DimensionId;
  onSelectDimension: (dim: DimensionId) => void;
  onSelectModule: (module: ModuleId) => void;
  onOpenEpistemicLegend: () => void;
  onJumpTo2DWorld?: () => void;
}

interface NodeData {
  id: DimensionId;
  name: string;
  symbol: string;
  coords: string;
  vertices: number;
  edges: number;
  faces: number;
  cells: number;
  rotationPlanes: number;
  status: 'ESTABLISHED' | 'MATHEMATICAL' | 'HYPOTHETICAL';
  desc: string;
}

const DIMENSION_NODES: NodeData[] = [
  {
    id: '1D',
    name: 'Line Segment',
    symbol: 'ℝ¹',
    coords: '(x)',
    vertices: 2,
    edges: 1,
    faces: 0,
    cells: 0,
    rotationPlanes: 0,
    status: 'ESTABLISHED',
    desc: 'Linear 1-manifold. Translation along a single continuous degree of freedom.',
  },
  {
    id: '2D',
    name: 'Square / Flatland',
    symbol: 'ℝ²',
    coords: '(x, y)',
    vertices: 4,
    edges: 4,
    faces: 1,
    cells: 0,
    rotationPlanes: 1,
    status: 'ESTABLISHED',
    desc: 'Planar 2-manifold with SO(2) rotation in the XY coordinate plane.',
  },
  {
    id: '3D',
    name: 'Cube / Spatial World',
    symbol: 'ℝ³',
    coords: '(x, y, z)',
    vertices: 8,
    edges: 12,
    faces: 6,
    cells: 1,
    rotationPlanes: 3,
    status: 'ESTABLISHED',
    desc: 'Human experiential macroscopic spatial realm with SO(3) Euler rotations.',
  },
  {
    id: '4D',
    name: 'Tesseract (8-Cell)',
    symbol: 'ℝ⁴',
    coords: '(x, y, z, w)',
    vertices: 16,
    edges: 32,
    faces: 24,
    cells: 8,
    rotationPlanes: 6,
    status: 'MATHEMATICAL',
    desc: 'Euclidean 4-space with 6 canonical rotation planes and double rotations in SO(4).',
  },
  {
    id: '5D',
    name: 'Penteract (10-Cell)',
    symbol: 'ℝ⁵',
    coords: '(x, y, z, w, v)',
    vertices: 32,
    edges: 80,
    faces: 80,
    cells: 40,
    rotationPlanes: 10,
    status: 'HYPOTHETICAL',
    desc: 'Higher dimensional manifold. Studied in Kaluza-Klein and superstring compactifications.',
  },
];

export function DimensionalObservatoryHero({
  activeDimension,
  onSelectDimension,
  onSelectModule,
  onOpenEpistemicLegend,
  onJumpTo2DWorld,
}: DimensionalObservatoryHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredDim, setHoveredDim] = useState<DimensionId | null>(null);
  const activeNode = DIMENSION_NODES.find(n => n.id === (hoveredDim || activeDimension)) || DIMENSION_NODES[3];

  // 4D / 3D real-time interactive canvas visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.015;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Clear with dark subtle gradient
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw subtle background polar coordinate rings
      ctx.lineWidth = 1;
      for (let r = 50; r <= 220; r += 45) {
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Render based on currently active/hovered dimension
      const dimToRender = hoveredDim || activeDimension;

      if (dimToRender === '1D') {
        // 1D Line Segment oscillating
        const len = 140;
        const x1 = cx - len / 2 + Math.sin(time) * 20;
        const x2 = cx + len / 2 + Math.sin(time) * 20;

        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x1, cy);
        ctx.lineTo(x2, cy);
        ctx.stroke();

        // Endpoints
        [x1, x2].forEach((x, i) => {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(x, cy, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#f8fafc';
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`v${i} [${i === 0 ? '-1' : '+1'}]`, x, cy + 22);
        });
      } else if (dimToRender === '2D') {
        // 2D Rotating Square with coordinate axes
        const size = 110;
        const theta = time * 0.8;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        const pts = [
          { x: -size / 2, y: -size / 2 },
          { x: size / 2, y: -size / 2 },
          { x: size / 2, y: size / 2 },
          { x: -size / 2, y: size / 2 },
        ].map(p => ({
          sx: cx + p.x * cosT - p.y * sinT,
          sy: cy + p.x * sinT + p.y * cosT,
        }));

        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.5;
        ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
        ctx.beginPath();
        ctx.moveTo(pts[0].sx, pts[0].sy);
        pts.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        pts.forEach((p, i) => {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, 5, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (dimToRender === '3D') {
        // 3D Isometric Rotating Cube
        const cubeSize = 85;
        const rotY = time * 0.7;
        const rotX = Math.PI / 6;

        const vertices3D = [
          [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
          [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
        ];

        const edges = [
          [0,1],[1,2],[2,3],[3,0],
          [4,5],[5,6],[6,7],[7,4],
          [0,4],[1,5],[2,6],[3,7]
        ];

        const projPts = vertices3D.map(([x, y, z]) => {
          // Rotate Y
          const x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
          const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
          // Rotate X
          const y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
          const z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

          // Perspective
          const f = 250 / (3 + z2 * 0.4);
          return {
            sx: cx + x1 * cubeSize * (f / 100),
            sy: cy + y2 * cubeSize * (f / 100),
            z: z2,
          };
        });

        // Edges
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#a855f7'; // Purple for 3D
        edges.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(projPts[i].sx, projPts[i].sy);
          ctx.lineTo(projPts[j].sx, projPts[j].sy);
          ctx.stroke();
        });

        // Vertices
        projPts.forEach(p => {
          ctx.fillStyle = '#c084fc';
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (dimToRender === '4D' || dimToRender === '5D') {
        // 4D Tesseract perspective projection with SO(4) double rotation
        const angleXW = time * 0.7;
        const angleYZ = time * 0.4;

        // Generate 16 vertices of 4D hypercube [-1, 1]⁴
        const pts4D: number[][] = [];
        for (let i = 0; i < 16; i++) {
          pts4D.push([
            (i & 1) ? 1 : -1,
            (i & 2) ? 1 : -1,
            (i & 4) ? 1 : -1,
            (i & 8) ? 1 : -1,
          ]);
        }

        // Apply XW and YZ rotations
        const cosXW = Math.cos(angleXW), sinXW = Math.sin(angleXW);
        const cosYZ = Math.cos(angleYZ), sinYZ = Math.sin(angleYZ);

        const transformed = pts4D.map(([x, y, z, w]) => {
          // XW rotation (hyper-depth)
          const rx = x * cosXW - w * sinXW;
          const rw = x * sinXW + w * cosXW;
          // YZ rotation
          const ry = y * cosYZ - z * sinYZ;
          const rz = y * sinYZ + z * cosYZ;

          // 4D to 3D perspective projection
          const d4 = 2.4;
          const s4 = d4 / (d4 - rw);
          const px = rx * s4;
          const py = ry * s4;
          const pz = rz * s4;

          // 3D to 2D screen projection
          const scale = 55;
          return {
            sx: cx + px * scale,
            sy: cy + py * scale,
            w: rw,
          };
        });

        // Tesseract has 32 edges (differ by exactly 1 bit)
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 16; i++) {
          for (let bit = 0; bit < 4; bit++) {
            const j = i ^ (1 << bit);
            if (i < j) {
              const avgW = (transformed[i].w + transformed[j].w) / 2;
              // Color spectral mapping based on W depth
              const alpha = 0.35 + 0.6 * ((avgW + 1) / 2);
              ctx.strokeStyle = avgW >= 0 
                ? `rgba(6, 182, 212, ${alpha})` // Cyan for +W
                : `rgba(244, 63, 94, ${alpha})`; // Rose for -W

              ctx.beginPath();
              ctx.moveTo(transformed[i].sx, transformed[i].sy);
              ctx.lineTo(transformed[j].sx, transformed[j].sy);
              ctx.stroke();
            }
          }
        }

        // Draw vertices
        transformed.forEach(p => {
          const r = p.w >= 0 ? 4.5 : 3.5;
          ctx.fillStyle = p.w >= 0 ? '#38bdf8' : '#fb7185';
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, r, 0, Math.PI * 2);
          ctx.fill();
        });

        // If 5D, render secondary theoretical orbital halo
        if (dimToRender === '5D') {
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.arc(cx, cy, 140, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [activeDimension, hoveredDim]);

  return (
    <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 overflow-hidden shadow-2xl">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Main Grid: Info + Interactive Centerpiece */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-10 items-center">
        {/* Left Column: Conceptual Overview (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-800/80 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>DIMENSIONAL OBSERVATORY // SYSTEM ACTIVE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-white leading-tight">
              Observe Higher Geometry from <span className="text-cyan-400">1D to 5D</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              An advanced computational instrument investigating the geometry of higher Euclidean spaces, projection shadows, hyperplane cross-sections, and relativistic spacetime.
            </p>
          </div>

          {/* Dimensional Continuum Progression Pills */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              INTERACTIVE CONTINUUM NODES:
            </div>
            <div className="grid grid-cols-5 gap-2">
              {DIMENSION_NODES.map((node) => {
                const isSelected = activeDimension === node.id;
                const isHovered = hoveredDim === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    id={`hero-dim-node-${node.id}`}
                    onClick={() => onSelectDimension(node.id)}
                    onMouseEnter={() => setHoveredDim(node.id)}
                    onMouseLeave={() => setHoveredDim(null)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected || isHovered
                        ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-sm font-bold font-display">{node.id}</div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">{node.symbol}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Node Telemetry Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-display text-white">
                  {activeNode.id} — {activeNode.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300">
                  {activeNode.symbol}
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                activeNode.status === 'ESTABLISHED' 
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' 
                  : activeNode.status === 'MATHEMATICAL'
                  ? 'bg-purple-950/60 text-purple-300 border-purple-800'
                  : 'bg-amber-950/60 text-amber-300 border-amber-800'
              }`}>
                {activeNode.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeNode.desc}
            </p>

            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-850 text-xs font-mono">
              <div>
                <span className="text-slate-500 text-[10px] block">COORDINATES</span>
                <span className="text-slate-200 font-bold">{activeNode.coords}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">VERTICES</span>
                <span className="text-cyan-300 font-bold">{activeNode.vertices}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">EDGES</span>
                <span className="text-slate-200 font-bold">{activeNode.edges}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">ROT. PLANES</span>
                <span className="text-purple-300 font-bold">{activeNode.rotationPlanes}</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              id="hero-enter-dimension-lab-btn"
              onClick={() => onSelectModule('dimension-lab')}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm font-display tracking-wide transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
            >
              <span>Enter Dimension Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onJumpTo2DWorld && (
              <button
                type="button"
                id="hero-jump-2d-world-btn"
                onClick={onJumpTo2DWorld}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium text-sm border border-slate-700 transition-colors flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>2D Coordinate World</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenEpistemicLegend}
              className="px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 text-sm font-mono transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Epistemic Rules</span>
            </button>
          </div>
        </div>

        {/* Right Column: Hero Interactive Canvas (6 cols) */}
        <div className="lg:col-span-6 relative flex flex-col items-center">
          <div className="w-full h-[380px] sm:h-[440px] relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-inner flex flex-col justify-between">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
            />

            {/* Top Canvas Tag */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs font-mono text-cyan-400">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>LIVE DIMENSIONAL FIELD // {activeNode.id}</span>
            </div>

            {/* Bottom Canvas Tag */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-400">
              <span>Projection Mode: Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
