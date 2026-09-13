import { useEffect, useRef, useState, useMemo, type MouseEvent } from 'react';
import { DimensionId } from '../../types';
import { Play, Pause, RotateCcw, Maximize2, Compass, Layers, Eye } from 'lucide-react';

interface DimensionCanvasPreviewProps {
  dimension: DimensionId;
  onDimensionChange?: (dim: DimensionId) => void;
  interactive?: boolean;
}

export function DimensionCanvasPreview({
  dimension,
  interactive = true,
}: DimensionCanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.015);
  const [angle1, setAngle1] = useState<number>(0.4);
  const [angle2, setAngle2] = useState<number>(0.2);
  const [projectionDepth, setProjectionDepth] = useState<number>(2.8);
  const [colorMode, setColorMode] = useState<'cyan' | 'spectrum' | 'wireframe'>('cyan');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Mouse drag control
  const isDragging = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Pre-generate geometric topologies
  const geometry = useMemo(() => {
    switch (dimension) {
      case '1D': {
        // Line segment
        const vertices = [[-1], [1]];
        const edges: [number, number][] = [[0, 1]];
        return { vertices, edges, label: '1D Line Segment ([-1, 1])' };
      }
      case '2D': {
        // Square
        const vertices = [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
        ];
        const edges: [number, number][] = [
          [0, 1], [1, 2], [2, 3], [3, 0]
        ];
        return { vertices, edges, label: '2D Square (4 Vertices, 4 Edges)' };
      }
      case '3D': {
        // 3D Cube
        const vertices: number[][] = [];
        for (let i = 0; i < 8; i++) {
          vertices.push([
            (i & 1) ? 1 : -1,
            (i & 2) ? 1 : -1,
            (i & 4) ? 1 : -1,
          ]);
        }
        const edges: [number, number][] = [];
        for (let i = 0; i < 8; i++) {
          for (let j = i + 1; j < 8; j++) {
            // Edges exist if hamming distance is 1
            const diff = (i ^ j);
            if ((diff & (diff - 1)) === 0) {
              edges.push([i, j]);
            }
          }
        }
        return { vertices, edges, label: '3D Cube (8 Vertices, 12 Edges)' };
      }
      case '4D': {
        // 4D Tesseract (Hypercube)
        const vertices: number[][] = [];
        for (let i = 0; i < 16; i++) {
          vertices.push([
            (i & 1) ? 1 : -1,
            (i & 2) ? 1 : -1,
            (i & 4) ? 1 : -1,
            (i & 8) ? 1 : -1,
          ]);
        }
        const edges: [number, number][] = [];
        for (let i = 0; i < 16; i++) {
          for (let j = i + 1; j < 16; j++) {
            const diff = (i ^ j);
            if ((diff & (diff - 1)) === 0) {
              edges.push([i, j]);
            }
          }
        }
        return { vertices, edges, label: '4D Tesseract (16 Vertices, 32 Edges, 8 Cells)' };
      }
      case '5D': {
        // 5D Penteract (5-Cube)
        const vertices: number[][] = [];
        for (let i = 0; i < 32; i++) {
          vertices.push([
            (i & 1) ? 1 : -1,
            (i & 2) ? 1 : -1,
            (i & 4) ? 1 : -1,
            (i & 8) ? 1 : -1,
            (i & 16) ? 1 : -1,
          ]);
        }
        const edges: [number, number][] = [];
        for (let i = 0; i < 32; i++) {
          for (let j = i + 1; j < 32; j++) {
            const diff = (i ^ j);
            if ((diff & (diff - 1)) === 0) {
              edges.push([i, j]);
            }
          }
        }
        return { vertices, edges, label: '5D Penteract (32 Vertices, 80 Edges, 10 Hypercells)' };
      }
    }
  }, [dimension]);

  // Main animation / projection loop
  useEffect(() => {
    let animId: number;
    let t = 0;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const baseScale = Math.min(width, height) * 0.38;

      // Clear background
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle scientific radar/coordinate circles & crosshairs
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.07)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, baseScale * 0.5, 0, Math.PI * 2);
      ctx.arc(cx, cy, baseScale * 1.0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - baseScale * 1.2, cy);
      ctx.lineTo(cx + baseScale * 1.2, cy);
      ctx.moveTo(cx, cy - baseScale * 1.2);
      ctx.lineTo(cx, cy + baseScale * 1.2);
      ctx.stroke();

      if (isPlaying) {
        t += rotationSpeed;
      }

      const rotA = angle1 + (isPlaying ? t : 0);
      const rotB = angle2 + (isPlaying ? t * 0.7 : 0);

      // Project vertices to 2D screen coordinates
      const projectedPoints: { x: number; y: number; depth: number; originalDim: number }[] = [];

      geometry.vertices.forEach((v) => {
        let x = v[0] || 0;
        let y = v[1] || 0;
        let z = v[2] || 0;
        let w = v[3] || 0;
        let u = v[4] || 0;

        if (dimension === '1D') {
          // Dynamic 1D point translation
          const sweep = Math.sin(t * 2);
          const screenX = cx + x * baseScale * 0.9;
          projectedPoints.push({ x: screenX, y: cy, depth: 1, originalDim: 1 });
        } else if (dimension === '2D') {
          // 2D rotation in xy
          const cosA = Math.cos(rotA);
          const sinA = Math.sin(rotA);
          const rx = x * cosA - y * sinA;
          const ry = x * sinA + y * cosA;
          projectedPoints.push({
            x: cx + rx * baseScale * 0.7,
            y: cy + ry * baseScale * 0.7,
            depth: 1,
            originalDim: 2
          });
        } else if (dimension === '3D') {
          // 3D rotation in XZ and YZ
          const cosA = Math.cos(rotA);
          const sinA = Math.sin(rotA);
          const cosB = Math.cos(rotB);
          const sinB = Math.sin(rotB);

          // Rotate XZ
          let x1 = x * cosA - z * sinA;
          let z1 = x * sinA + z * cosA;

          // Rotate YZ
          let y1 = y * cosB - z1 * sinB;
          let z2 = y * sinB + z1 * cosB;

          // Perspective
          const distance = projectionDepth;
          const scale = distance / (distance - z2 * 0.7);
          projectedPoints.push({
            x: cx + x1 * scale * baseScale * 0.6,
            y: cy + y1 * scale * baseScale * 0.6,
            depth: z2,
            originalDim: 3
          });
        } else if (dimension === '4D') {
          // 4D Double Rotation: XW plane and YZ plane
          const cosA = Math.cos(rotA);
          const sinA = Math.sin(rotA);
          const cosB = Math.cos(rotB);
          const sinB = Math.sin(rotB);

          // Rotate in XW plane
          let x1 = x * cosA - w * sinA;
          let w1 = x * sinA + w * cosA;

          // Rotate in YZ plane
          let y1 = y * cosB - z * sinB;
          let z1 = y * sinB + z * cosB;

          // Rotate in ZW plane slightly
          const rotZW = t * 0.4;
          let z2 = z1 * Math.cos(rotZW) - w1 * Math.sin(rotZW);
          let w2 = z1 * Math.sin(rotZW) + w1 * Math.cos(rotZW);

          // 4D to 3D perspective projection
          const d4 = projectionDepth;
          const factor4 = d4 / (d4 - w2 * 0.65);
          const x3 = x1 * factor4;
          const y3 = y1 * factor4;
          const z3 = z2 * factor4;

          // 3D to 2D projection
          const d3 = 3.5;
          const factor3 = d3 / (d3 - z3 * 0.5);

          projectedPoints.push({
            x: cx + x3 * factor3 * baseScale * 0.45,
            y: cy + y3 * factor3 * baseScale * 0.45,
            depth: w2,
            originalDim: 4
          });
        } else if (dimension === '5D') {
          // 5D Rotation: XU, YW, and Z rotations
          const cosA = Math.cos(rotA * 0.9);
          const sinA = Math.sin(rotA * 0.9);
          const cosB = Math.cos(rotB * 0.7);
          const sinB = Math.sin(rotB * 0.7);

          // Rotate XU
          let x1 = x * cosA - u * sinA;
          let u1 = x * sinA + u * cosA;

          // Rotate YW
          let y1 = y * cosB - w * sinB;
          let w1 = y * sinB + w * cosB;

          // Rotate ZW
          let z1 = z;

          // 5D to 4D projection
          const d5 = 3.2;
          const factor5 = d5 / (d5 - u1 * 0.55);
          let x4 = x1 * factor5;
          let y4 = y1 * factor5;
          let z4 = z1 * factor5;
          let w4 = w1 * factor5;

          // 4D to 3D projection
          const d4 = 3.0;
          const factor4 = d4 / (d4 - w4 * 0.55);
          let x3 = x4 * factor4;
          let y3 = y4 * factor4;
          let z3 = z4 * factor4;

          // 3D to 2D projection
          const d3 = 3.5;
          const factor3 = d3 / (d3 - z3 * 0.5);

          projectedPoints.push({
            x: cx + x3 * factor3 * baseScale * 0.38,
            y: cy + y3 * factor3 * baseScale * 0.38,
            depth: u1,
            originalDim: 5
          });
        }
      });

      // Draw Edges
      geometry.edges.forEach(([i, j]) => {
        const p1 = projectedPoints[i];
        const p2 = projectedPoints[j];
        if (!p1 || !p2) return;

        const avgDepth = (p1.depth + p2.depth) / 2;
        const alpha = Math.max(0.15, Math.min(0.9, 0.5 + avgDepth * 0.35));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (colorMode === 'spectrum') {
          const hue = ((avgDepth + 2) * 60) % 360;
          ctx.strokeStyle = `hsla(${hue}, 80%, 65%, ${alpha})`;
        } else if (colorMode === 'wireframe') {
          ctx.strokeStyle = `rgba(226, 232, 240, ${alpha * 0.8})`;
        } else {
          // Cyan / Emerald laboratory glow
          if (dimension === '4D') {
            // Differentiate inner and outer hypercube cells
            ctx.strokeStyle = avgDepth > 0 
              ? `rgba(56, 189, 248, ${alpha})` 
              : `rgba(168, 85, 247, ${alpha * 0.9})`;
          } else if (dimension === '5D') {
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha * 0.85})`;
          } else {
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          }
        }

        ctx.lineWidth = dimension === '5D' ? 1 : dimension === '4D' ? 1.4 : 2;
        ctx.stroke();
      });

      // Draw Vertices
      projectedPoints.forEach((p, idx) => {
        const radius = dimension === '5D' ? 2.5 : dimension === '4D' ? 3.5 : 4.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);

        if (dimension === '4D' || dimension === '5D') {
          ctx.fillStyle = p.depth > 0 ? '#38bdf8' : '#a855f7';
        } else {
          ctx.fillStyle = '#38bdf8';
        }
        ctx.fill();

        // Vertex glow
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 1D Special Dynamic Coordinate Marker
      if (dimension === '1D') {
        const sweepVal = Math.sin(t * 2);
        const sweepX = cx + sweepVal * baseScale * 0.9;
        ctx.beginPath();
        ctx.arc(sweepX, cy, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Coordinate tag
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`x = ${sweepVal.toFixed(3)}`, sweepX - 25, cy - 16);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [dimension, isPlaying, rotationSpeed, angle1, angle2, projectionDepth, colorMode, geometry]);

  // Handle canvas mouse drag for interactive rotation
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setAngle1((prev) => prev + dx * 0.008);
    setAngle2((prev) => prev + dy * 0.008);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleReset = () => {
    setAngle1(0.4);
    setAngle2(0.2);
    setProjectionDepth(2.8);
  };

  return (
    <div 
      id="dimension-canvas-container"
      className="relative flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Canvas Header & Telemetry Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3.5 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/80 text-[11px] font-mono text-cyan-400">
            <Layers className="w-3 h-3" />
            <span>ORTHOGONAL PROJECTION ENGINE</span>
          </div>
          <span className="hidden sm:inline text-xs font-mono text-slate-400">
            {geometry.label}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            id="canvas-play-pause-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            title={isPlaying ? 'Pause Continuous Rotation' : 'Resume Rotation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            id="canvas-reset-btn"
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            title="Reset Rotation Angles"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Rendering Viewport */}
      <div className="relative w-full aspect-square sm:aspect-[4/3] flex items-center justify-center cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          id="dimension-projection-canvas"
          width={640}
          height={480}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full h-full object-contain"
        />

        {/* Future WebGL Engine Hook Badge */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>PHASE 1 ENGINE // WEBGL2/GPU EXTENSION READY</span>
        </div>

        {/* Vertex/Edge Readout Overlay */}
        <div className="absolute bottom-3 right-3 z-10 pointer-events-none hidden sm:flex items-center gap-2.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
          <div>V: <span className="text-cyan-400 font-bold">{geometry.vertices.length}</span></div>
          <div className="text-slate-600">|</div>
          <div>E: <span className="text-cyan-400 font-bold">{geometry.edges.length}</span></div>
          {dimension === '4D' && (
            <>
              <div className="text-slate-600">|</div>
              <div>Cells: <span className="text-purple-400 font-bold">8</span></div>
            </>
          )}
          {dimension === '5D' && (
            <>
              <div className="text-slate-600">|</div>
              <div>Hypercells: <span className="text-amber-400 font-bold">10</span></div>
            </>
          )}
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>DRAG CANVAS TO ROTATE MULTI-PLANE</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">COLOR:</span>
            <div className="flex items-center rounded-lg bg-slate-950 p-0.5 border border-slate-800">
              <button
                type="button"
                id="color-mode-cyan"
                onClick={() => setColorMode('cyan')}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  colorMode === 'cyan' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Lab Cyan
              </button>
              <button
                type="button"
                id="color-mode-spectrum"
                onClick={() => setColorMode('spectrum')}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  colorMode === 'spectrum' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Depth Spectrum
              </button>
              <button
                type="button"
                id="color-mode-wireframe"
                onClick={() => setColorMode('wireframe')}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  colorMode === 'wireframe' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Clean
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-slate-500">SPEED:</span>
            <input
              type="range"
              id="rotation-speed-slider"
              min={0.002}
              max={0.04}
              step={0.002}
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
