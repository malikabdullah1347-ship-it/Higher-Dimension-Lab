import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid, 
  Move, 
  Sliders, 
  Layers, 
  Play, 
  Pause, 
  RotateCcw, 
  Info,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Shapes
} from 'lucide-react';

export type Shape2DType = 'POINT' | 'LINE' | 'SQUARE' | 'CIRCLE' | 'POLYGON';

interface ShapeDefinition {
  type: Shape2DType;
  label: string;
  dimType: string;
  dof: number;
  description: string;
}

const SHAPE_DEFINITIONS: Record<Shape2DType, ShapeDefinition> = {
  POINT: {
    type: 'POINT',
    label: 'Point (0D)',
    dimType: '0D Element in ℝ²',
    dof: 2,
    description: 'Zero-dimensional singularity with position coordinates (x, y) but zero length or area.',
  },
  LINE: {
    type: 'LINE',
    label: 'Line Segment (1D)',
    dimType: '1D Manifold in ℝ²',
    dof: 3, // pos (2) + rotation (1)
    description: 'One-dimensional continuum connecting 2 boundary vertices. Possesses length, zero area.',
  },
  SQUARE: {
    type: 'SQUARE',
    label: 'Square (2D Hypercube)',
    dimType: '2D Polytope (Orthotope)',
    dof: 4, // pos (2) + rot (1) + scale (1)
    description: 'Two-dimensional hypercube analog [0, 1]² with 4 vertices, 4 edges, and bounding area.',
  },
  CIRCLE: {
    type: 'CIRCLE',
    label: 'Circle (1-Sphere S¹)',
    dimType: '1-Sphere Boundary in ℝ²',
    dof: 3, // pos (2) + radius (1)
    description: 'Set of all points in ℝ² equidistant from a center. Boundary is 1D curve S¹.',
  },
  POLYGON: {
    type: 'POLYGON',
    label: 'Regular Hexagon (2D)',
    dimType: 'Regular Polytope in ℝ²',
    dof: 4,
    description: 'Symmetric 6-vertex 2D polygon with dihedral symmetry group D₆.',
  },
};

export function TwoDimensionLiveWorld() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Geometry State
  const [selectedShape, setSelectedShape] = useState<Shape2DType>('SQUARE');
  const [polygonSides, setPolygonSides] = useState<number>(6);
  
  // Transformation Parameters
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  
  // Viewport / Camera State
  const [zoom, setZoom] = useState<number>(45); // pixels per coordinate unit
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragMode, setDragMode] = useState<'PAN' | 'OBJECT'>('OBJECT');
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dimensional Lift (2D -> 3D -> 4D) State
  const [liftStage, setLiftStage] = useState<number>(2); // 2: 2D, 3: 3D, 4: 4D
  const [isLiftPlaying, setIsLiftPlaying] = useState<boolean>(false);
  const [liftTransitionProgress, setLiftTransitionProgress] = useState<number>(0); // 0 to 1

  // Rotation animation
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  // Compute Base Vertices in local coordinate system (untransformed)
  const getBaseVertices = useCallback((): { x: number; y: number }[] => {
    switch (selectedShape) {
      case 'POINT':
        return [{ x: 0, y: 0 }];
      case 'LINE':
        return [
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ];
      case 'SQUARE':
        return [
          { x: -1, y: -1 },
          { x: 1, y: -1 },
          { x: 1, y: 1 },
          { x: -1, y: 1 },
        ];
      case 'CIRCLE': {
        const pts: { x: number; y: number }[] = [];
        const segments = 48;
        for (let i = 0; i < segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          pts.push({ x: Math.cos(theta), y: Math.sin(theta) });
        }
        return pts;
      }
      case 'POLYGON': {
        const pts: { x: number; y: number }[] = [];
        for (let i = 0; i < polygonSides; i++) {
          const theta = (i / polygonSides) * Math.PI * 2 - Math.PI / 2;
          pts.push({ x: Math.cos(theta), y: Math.sin(theta) });
        }
        return pts;
      }
    }
  }, [selectedShape, polygonSides]);

  // Compute Transformed Vertices
  const getTransformedVertices = useCallback((): { x: number; y: number }[] => {
    const base = getBaseVertices();
    const rad = (rotationDeg * Math.PI) / 180;
    const cosT = Math.cos(rad);
    const sinT = Math.sin(rad);

    return base.map((pt) => {
      // Scale
      const sx = pt.x * scale;
      const sy = pt.y * scale;
      // Rotate
      const rx = sx * cosT - sy * sinT;
      const ry = sx * sinT + sy * cosT;
      // Translate
      return {
        x: rx + position.x,
        y: ry + position.y,
      };
    });
  }, [getBaseVertices, rotationDeg, scale, position]);

  const transformedVertices = getTransformedVertices();

  // Metrics calculation
  const rad = (rotationDeg * Math.PI) / 180;
  const cosTheta = Math.cos(rad);
  const sinTheta = Math.sin(rad);

  // Bounding box
  let minX = 0, maxX = 0, minY = 0, maxY = 0;
  if (transformedVertices.length > 0) {
    minX = Math.min(...transformedVertices.map(v => v.x));
    maxX = Math.max(...transformedVertices.map(v => v.x));
    minY = Math.min(...transformedVertices.map(v => v.y));
    maxY = Math.max(...transformedVertices.map(v => v.y));
  }

  // Animation Loop for Auto-Rotate and Lift
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (autoRotate) {
        setRotationDeg((prev) => (prev + 30 * dt) % 360);
      }

      if (isLiftPlaying) {
        setLiftTransitionProgress((prev) => {
          const next = prev + dt * 0.5;
          if (next >= 1) {
            setLiftStage((stage) => (stage >= 4 ? 2 : stage + 1));
            return 0;
          }
          return next;
        });
      }

      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [autoRotate, isLiftPlaying]);

  // Main Canvas Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    // Retina DPI handling
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Deep slate background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // Origin in canvas coordinates
    const originX = width / 2 + pan.x;
    const originY = height / 2 + pan.y;

    // Helper: World to Screen
    const toScreen = (x: number, y: number) => ({
      sx: originX + x * zoom,
      sy: originY - y * zoom, // Invert Y for mathematical coordinate system
    });

    // Helper: Screen to World
    const toWorld = (sx: number, sy: number) => ({
      wx: (sx - originX) / zoom,
      wy: -(sy - originY) / zoom,
    });

    // 1. Draw Grid
    if (showGrid) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.6)'; // slate-800 subtle

      // Visible world bounds
      const topLeft = toWorld(0, 0);
      const bottomRight = toWorld(width, height);

      const startX = Math.floor(topLeft.wx);
      const endX = Math.ceil(bottomRight.wx);
      const startY = Math.floor(bottomRight.wy);
      const endY = Math.ceil(topLeft.wy);

      ctx.beginPath();
      // Vertical grid lines
      for (let x = startX; x <= endX; x++) {
        const { sx } = toScreen(x, 0);
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, height);
      }
      // Horizontal grid lines
      for (let y = startY; y <= endY; y++) {
        const { sy } = toScreen(0, y);
        ctx.moveTo(0, sy);
        ctx.lineTo(width, sy);
      }
      ctx.stroke();

      // Major grid labels (every 2 units)
      ctx.fillStyle = 'rgba(100, 116, 139, 0.6)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      for (let x = startX; x <= endX; x++) {
        if (x !== 0 && x % 2 === 0) {
          const { sx, sy } = toScreen(x, 0);
          if (sy >= 0 && sy <= height - 15) {
            ctx.fillText(x.toString(), sx, sy + 4);
          }
        }
      }

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let y = startY; y <= endY; y++) {
        if (y !== 0 && y % 2 === 0) {
          const { sx, sy } = toScreen(0, y);
          if (sx >= 25 && sx <= width) {
            ctx.fillText(y.toString(), sx - 6, sy);
          }
        }
      }
    }

    // 2. Draw Scientific Axes (X: Cyan, Y: Purple)
    ctx.lineWidth = 1.5;

    // X-Axis
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)'; // Cyan
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y-Axis
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)'; // Purple
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Axis Labels & Origin
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#06b6d4';
    ctx.textAlign = 'right';
    ctx.fillText('+X →', width - 12, originY - 8);

    ctx.fillStyle = '#a855f7';
    ctx.textAlign = 'left';
    ctx.fillText('↑ +Y', originX + 8, 16);

    // Origin marker (0, 0)
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(originX, originY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
    ctx.textAlign = 'left';
    ctx.fillText('(0, 0)', originX + 6, originY + 12);

    // 3. Render Geometry: 2D Base or Lift Mode (3D / 4D Analogy)
    if (liftStage === 2) {
      // Pure 2D Render
      renderShape2D(ctx, toScreen);
    } else if (liftStage === 3) {
      // 3D Extrusion Analogy: Sweeping through orthogonal Z axis
      renderExtrusion3D(ctx, toScreen, liftTransitionProgress);
    } else if (liftStage === 4) {
      // 4D Extrusion Analogy: Sweeping through orthogonal W axis
      renderExtrusion4D(ctx, toScreen, liftTransitionProgress);
    }

    // Bounding Box indicator (subtle dashed cyan)
    if (liftStage === 2 && selectedShape !== 'POINT') {
      const p1 = toScreen(minX, maxY);
      const p2 = toScreen(maxX, minY);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(p1.sx, p1.sy, p2.sx - p1.sx, p2.sy - p1.sy);
      ctx.setLineDash([]);
    }

    // Centroid marker
    const cPos = toScreen(position.x, position.y);
    ctx.fillStyle = '#f59e0b'; // Amber
    ctx.beginPath();
    ctx.arc(cPos.sx, cPos.sy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#030712';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }, [
    zoom, 
    pan, 
    showGrid, 
    selectedShape, 
    polygonSides, 
    position, 
    rotationDeg, 
    scale, 
    transformedVertices, 
    liftStage, 
    liftTransitionProgress,
    minX, maxX, minY, maxY
  ]);

  // Render 2D Flat Shape
  const renderShape2D = (
    ctx: CanvasRenderingContext2D, 
    toScreen: (x: number, y: number) => { sx: number; sy: number }
  ) => {
    if (selectedShape === 'POINT') {
      const p = toScreen(position.x, position.y);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, 6 * (scale / 1.2), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 3;
      ctx.stroke();
      return;
    }

    if (selectedShape === 'CIRCLE') {
      const p = toScreen(position.x, position.y);
      const rPx = scale * zoom;
      ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, rPx, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Radius line indicator
      const rad = (rotationDeg * Math.PI) / 180;
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
      ctx.beginPath();
      ctx.moveTo(p.sx, p.sy);
      ctx.lineTo(p.sx + Math.cos(rad) * rPx, p.sy - Math.sin(rad) * rPx);
      ctx.stroke();
      return;
    }

    // Polygons & Lines
    if (transformedVertices.length < 2) return;

    ctx.beginPath();
    const first = toScreen(transformedVertices[0].x, transformedVertices[0].y);
    ctx.moveTo(first.sx, first.sy);

    for (let i = 1; i < transformedVertices.length; i++) {
      const pt = toScreen(transformedVertices[i].x, transformedVertices[i].y);
      ctx.lineTo(pt.sx, pt.sy);
    }

    if (selectedShape !== 'LINE') {
      ctx.closePath();
      ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.fill();
    }

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw vertex handles
    transformedVertices.forEach((v, idx) => {
      const p = toScreen(v.x, v.y);
      ctx.fillStyle = '#030712';
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Vertex index label
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
      ctx.textAlign = 'center';
      ctx.fillText(`v${idx}`, p.sx, p.sy - 8);
    });
  };

  // Render 3D Extrusion Analogy
  const renderExtrusion3D = (
    ctx: CanvasRenderingContext2D,
    toScreen: (x: number, y: number) => { sx: number; sy: number },
    progress: number
  ) => {
    // Orthogonal vector in screen space representing Z-axis (+0.7x, +0.7y)
    const zOffset = (1.5 * scale) * (0.4 + 0.6 * progress);
    const zAngle = Math.PI / 4; // 45 deg oblique projection
    const zDx = Math.cos(zAngle) * zOffset;
    const zDy = Math.sin(zAngle) * zOffset;

    // Base face vertices (Z = 0)
    const baseScreen = transformedVertices.map(v => toScreen(v.x, v.y));
    // Top face vertices (Z = zOffset)
    const topScreen = transformedVertices.map(v => toScreen(v.x + zDx, v.y + zDy));

    // Connectors along Z
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)'; // Purple for Z dimension
    ctx.setLineDash([4, 4]);

    for (let i = 0; i < baseScreen.length; i++) {
      ctx.beginPath();
      ctx.moveTo(baseScreen[i].sx, baseScreen[i].sy);
      ctx.lineTo(topScreen[i].sx, topScreen[i].sy);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Base face (2D original in Cyan)
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(baseScreen[0].sx, baseScreen[0].sy);
    for (let i = 1; i < baseScreen.length; i++) ctx.lineTo(baseScreen[i].sx, baseScreen[i].sy);
    if (selectedShape !== 'LINE') ctx.closePath();
    ctx.stroke();

    // Top face (Extruded in Purple)
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
    ctx.beginPath();
    ctx.moveTo(topScreen[0].sx, topScreen[0].sy);
    for (let i = 1; i < topScreen.length; i++) ctx.lineTo(topScreen[i].sx, topScreen[i].sy);
    if (selectedShape !== 'LINE') {
      ctx.closePath();
      ctx.fill();
    }
    ctx.stroke();
  };

  // Render 4D Extrusion Analogy (Hypercube / Tesseract Projection)
  const renderExtrusion4D = (
    ctx: CanvasRenderingContext2D,
    toScreen: (x: number, y: number) => { sx: number; sy: number },
    progress: number
  ) => {
    // Draw 3D prism first
    renderExtrusion3D(ctx, toScreen, 1.0);

    // Hyper-depth expansion factor for 4th axis W
    const wFactor = 0.55 + 0.15 * Math.sin(progress * Math.PI);
    const zOffset = 1.5 * scale;
    const zAngle = Math.PI / 4;
    const zDx = Math.cos(zAngle) * zOffset;
    const zDy = Math.sin(zAngle) * zOffset;

    // Inner 3D cube representing hyper-depth perspective projection (W = -1)
    const innerBase = transformedVertices.map(v => {
      const cx = (v.x - position.x) * wFactor + position.x;
      const cy = (v.y - position.y) * wFactor + position.y;
      return toScreen(cx, cy);
    });

    const innerTop = transformedVertices.map(v => {
      const cx = (v.x - position.x) * wFactor + position.x;
      const cy = (v.y - position.y) * wFactor + position.y;
      return toScreen(cx + zDx * wFactor, cy + zDy * wFactor);
    });

    const outerBase = transformedVertices.map(v => toScreen(v.x, v.y));
    const outerTop = transformedVertices.map(v => toScreen(v.x + zDx, v.y + zDy));

    // Connect outer 3D cell to inner 3D cell (4D Hyper-edges in Rose)
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.7)'; // Rose for W axis

    for (let i = 0; i < outerBase.length; i++) {
      ctx.beginPath();
      ctx.moveTo(outerBase[i].sx, outerBase[i].sy);
      ctx.lineTo(innerBase[i].sx, innerBase[i].sy);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(outerTop[i].sx, outerTop[i].sy);
      ctx.lineTo(innerTop[i].sx, innerTop[i].sy);
      ctx.stroke();
    }

    // Inner cube faces
    ctx.strokeStyle = '#f43f5e';
    ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(innerBase[0].sx, innerBase[0].sy);
    for (let i = 1; i < innerBase.length; i++) ctx.lineTo(innerBase[i].sx, innerBase[i].sy);
    if (selectedShape !== 'LINE') {
      ctx.closePath();
      ctx.fill();
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(innerTop[0].sx, innerTop[0].sy);
    for (let i = 1; i < innerTop.length; i++) ctx.lineTo(innerTop[i].sx, innerTop[i].sy);
    if (selectedShape !== 'LINE') {
      ctx.closePath();
      ctx.fill();
    }
    ctx.stroke();
  };

  // Mouse / Pointer Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x: sx, y: sy });

    // Check if clicked near object centroid
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const originX = width / 2 + pan.x;
    const originY = height / 2 + pan.y;
    const cSx = originX + position.x * zoom;
    const cSy = originY - position.y * zoom;

    const dist = Math.hypot(sx - cSx, sy - cSy);
    if (dist < 40) {
      setDragMode('OBJECT');
    } else {
      setDragMode('PAN');
    }

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    const dx = sx - dragStart.x;
    const dy = sy - dragStart.y;

    if (dragMode === 'OBJECT') {
      // Convert screen delta to world delta
      const worldDx = dx / zoom;
      const worldDy = -dy / zoom; // Invert for cartesian coordinates
      setPosition(prev => ({
        x: Math.round((prev.x + worldDx) * 100) / 100,
        y: Math.round((prev.y + worldDy) * 100) / 100,
      }));
    } else {
      // Pan viewport
      setPan(prev => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
    }

    setDragStart({ x: sx, y: sy });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already released
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(prev => Math.max(15, Math.min(120, prev * delta)));
  };

  const resetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(45);
    setPosition({ x: 0, y: 0 });
    setRotationDeg(0);
    setScale(1.2);
    setLiftStage(2);
    setIsLiftPlaying(false);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl space-y-0">
      {/* Top Interactive Instrument Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-850 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Shapes className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-display text-white">
                2D Dimensional Observatory & Coordinate World
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                ℝ² Cartesian Plane
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct Euclidean manipulation of geometric manifolds and dimensional analogies.
            </p>
          </div>
        </div>

        {/* Dimensional Lift Switcher (2D -> 3D -> 4D) */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-mono text-slate-400 pl-2 pr-1">LIFT:</span>
          
          <button
            type="button"
            onClick={() => { setLiftStage(2); setIsLiftPlaying(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              liftStage === 2 
                ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            2D Flat
          </button>

          <button
            type="button"
            onClick={() => { setLiftStage(3); setIsLiftPlaying(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              liftStage === 3 
                ? 'bg-purple-500 text-white font-bold shadow' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            3D Prism
          </button>

          <button
            type="button"
            onClick={() => { setLiftStage(4); setIsLiftPlaying(false); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              liftStage === 4 
                ? 'bg-rose-500 text-white font-bold shadow' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            4D Tesseract
          </button>

          <button
            type="button"
            onClick={() => setIsLiftPlaying(!isLiftPlaying)}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors ${
              isLiftPlaying ? 'text-cyan-400 bg-cyan-950/60' : ''
            }`}
            title={isLiftPlaying ? 'Pause dimensional lift cycle' : 'Auto-cycle dimensional lift'}
          >
            {isLiftPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Canvas + Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left: Canvas Area (8 cols) */}
        <div className="lg:col-span-8 relative min-h-[440px] h-[520px] bg-slate-950 flex flex-col justify-between overflow-hidden">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
            className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
          />

          {/* Canvas Floating Overlay Controls */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl">
            {(Object.keys(SHAPE_DEFINITIONS) as Shape2DType[]).map((shapeKey) => (
              <button
                key={shapeKey}
                type="button"
                onClick={() => {
                  setSelectedShape(shapeKey);
                  if (liftStage !== 2) setLiftStage(2);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  selectedShape === shapeKey
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {SHAPE_DEFINITIONS[shapeKey].label.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Floating Viewport Actions (Bottom Right) */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-xl">
            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                showGrid ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Grid (G)"
            >
              <Grid className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setZoom(prev => Math.min(120, prev * 1.2))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setZoom(prev => Math.max(15, prev / 1.2))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={resetView}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
              title="Reset View & Coordinates"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Hint Indicator */}
          <div className="absolute bottom-4 left-4 pointer-events-none text-[11px] font-mono text-slate-500 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-850">
            <span>DRAG: Move Object / Drag Background: Pan Viewport</span>
          </div>
        </div>

        {/* Right: Scientific Telemetry & Controls (4 cols) */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-850 bg-slate-900/40 p-5 flex flex-col justify-between space-y-5 overflow-y-auto">
          {/* Section 1: Active Object Description */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-850">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                ACTIVE GEOMETRY
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {SHAPE_DEFINITIONS[selectedShape].dimType}
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold font-display text-white">
                {SHAPE_DEFINITIONS[selectedShape].label}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                {SHAPE_DEFINITIONS[selectedShape].description}
              </p>
            </div>

            {/* Polygon Sides Slider (if POLYGON) */}
            {selectedShape === 'POLYGON' && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Polygon Vertices (N):</span>
                  <span className="text-cyan-300 font-bold">{polygonSides}</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={12}
                  step={1}
                  value={polygonSides}
                  onChange={(e) => setPolygonSides(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800"
                />
              </div>
            )}
          </div>

          {/* Section 2: Mathematical Transformation Controls */}
          <div className="space-y-3 pt-3 border-t border-slate-850">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                TRANSFORMATION STATE
              </span>
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                  autoRotate
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Auto-Rotate: {autoRotate ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Position Controls */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-slate-500 text-[10px] block">POSITION X</span>
                <span className="text-cyan-300 font-bold text-sm">
                  {position.x >= 0 ? `+${position.x.toFixed(2)}` : position.x.toFixed(2)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                <span className="text-slate-500 text-[10px] block">POSITION Y</span>
                <span className="text-purple-300 font-bold text-sm">
                  {position.y >= 0 ? `+${position.y.toFixed(2)}` : position.y.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Rotation Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Rotation Angle (θ):</span>
                <span className="text-cyan-300 font-bold">
                  {rotationDeg.toFixed(1)}° ({(rad).toFixed(2)} rad)
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={rotationDeg}
                onChange={(e) => setRotationDeg(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800"
              />
            </div>

            {/* Scale Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Scale Factor (s):</span>
                <span className="text-cyan-300 font-bold">{scale.toFixed(2)}×</span>
              </div>
              <input
                type="range"
                min={0.4}
                max={3.0}
                step={0.1}
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800"
              />
            </div>
          </div>

          {/* Section 3: Live 2D Matrix Representation */}
          <div className="space-y-2 pt-3 border-t border-slate-850">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
              AFFINE TRANSFORMATION MATRIX [SO(2) ⋉ ℝ²]
            </span>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 font-mono text-xs text-slate-300 space-y-1">
              <div className="text-[11px] text-slate-500 pb-1 border-b border-slate-900">
                M(s, θ, t) = [s·cos θ, -s·sin θ, tx; s·sin θ, s·cos θ, ty; 0, 0, 1]
              </div>
              <div className="grid grid-cols-3 gap-1 text-center pt-1 text-[11px]">
                <div className="p-1 rounded bg-slate-900 text-cyan-300">{(scale * cosTheta).toFixed(2)}</div>
                <div className="p-1 rounded bg-slate-900 text-cyan-300">{(-scale * sinTheta).toFixed(2)}</div>
                <div className="p-1 rounded bg-slate-900 text-emerald-400">{position.x.toFixed(2)}</div>
                <div className="p-1 rounded bg-slate-900 text-cyan-300">{(scale * sinTheta).toFixed(2)}</div>
                <div className="p-1 rounded bg-slate-900 text-cyan-300">{(scale * cosTheta).toFixed(2)}</div>
                <div className="p-1 rounded bg-slate-900 text-emerald-400">{position.y.toFixed(2)}</div>
                <div className="p-1 rounded bg-slate-900 text-slate-500">0.00</div>
                <div className="p-1 rounded bg-slate-900 text-slate-500">0.00</div>
                <div className="p-1 rounded bg-slate-900 text-slate-500">1.00</div>
              </div>
            </div>
          </div>

          {/* Section 4: Dimensional Analogy Banner */}
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-cyan-300 font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>THE EXTENSION PRINCIPLE:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {liftStage === 2 && "In 2D, coordinates (x, y) span a plane. To form 3D, drag this boundary along an orthogonal axis Z."}
              {liftStage === 3 && "Extruding the 2D boundary along Z creates a 3D prism. 4 vertices become 8; 4 edges become 12."}
              {liftStage === 4 && "Extruding the 3D cell along an orthogonal axis W produces a 4D tesseract with 16 vertices and 8 cubic cells."}
            </p>
            <div className="text-[11px] font-mono text-cyan-400/80 pt-1">
              STATUS: ISO-EP CLASS II (MATHEMATICAL SIMULATION)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
