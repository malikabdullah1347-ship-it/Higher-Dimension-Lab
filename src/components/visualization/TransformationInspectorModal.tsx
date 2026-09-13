import { useState } from 'react';
import { Matrix4D, RotationPlane4D } from '../../engine/math/Matrix4D';
import { Vector4 } from '../../engine/math/Vector4';
import { Geometry4D } from '../../engine/geometry/types';
import { RotationState } from '../../engine/transforms/TransformationPipeline4D';
import { Projection4DConfig } from '../../engine/projections/PerspectiveProjection4Dto3D';
import { X, Code2, BookOpen, Sigma, Compass, Layers, Check } from 'lucide-react';

interface TransformationInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  matrix: Matrix4D;
  geometry: Geometry4D;
  transformedVertices: Vector4[];
  rotationState: RotationState;
  projectionConfig: Projection4DConfig;
  currentW: number;
}

export function TransformationInspectorModal({
  isOpen,
  onClose,
  matrix,
  geometry,
  transformedVertices,
  rotationState,
  projectionConfig,
  currentW,
}: TransformationInspectorModalProps) {
  const [viewMode, setViewMode] = useState<'BEGINNER' | 'MATHEMATICAL'>('BEGINNER');

  if (!isOpen) return null;

  const matrixGrid = matrix.toGrid();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto">
        {/* Header with Mode Toggle */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                TRANSFORMATION INSPECTOR
              </span>
              <span className="text-xs font-mono text-slate-400">ℝ⁴ SO(4) FORMALISM</span>
            </div>
            <h2 className="text-lg font-bold font-display text-white mt-1">
              4D Coordinate & Transformation Analytics
            </h2>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Beginner vs Mathematical View Switcher */}
            <div className="p-1 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => setViewMode('BEGINNER')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === 'BEGINNER'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Beginner View</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('MATHEMATICAL')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === 'MATHEMATICAL'
                    ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sigma className="w-3.5 h-3.5" />
                <span>Mathematical View</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 max-h-[calc(85vh-90px)]">
          {viewMode === 'BEGINNER' ? (
            /* Beginner Conceptual Walkthrough */
            <div className="space-y-5 text-slate-300 text-xs sm:text-sm leading-relaxed">
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
                <h4 className="font-bold text-cyan-300 font-display text-base">
                  What Does &quot;Rotating in 4D&quot; Actually Mean?
                </h4>
                <p>
                  In everyday 3D space, an object rotates around a <strong>1D line (an axis of rotation)</strong>, such as the spindle of a spinning top or the Earth&apos;s north-south pole.
                </p>
                <p>
                  In 4-dimensional space ℝ⁴, an object does <em>not</em> rotate around an axis line! Instead, it rotates around a <strong>stationary 2D plane</strong>. Every 4D rotation leaves an entire 2D plane completely stationary while turning points inside an orthogonal 2D plane.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-white font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>The XW Hyper-Depth Rotation</span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    When you turn the tesseract in the <strong className="text-cyan-300">XW plane</strong>, the Y and Z coordinates do not change at all. Instead, the X-axis coordinate trades places with the 4th axis W.
                  </p>
                  <p className="text-slate-400 text-xs">
                    This causes the &quot;inner cube&quot; (which was further away along W) to travel forward to W=0 and expand outward, while the &quot;outer cube&quot; moves into the background and shrinks. This creates the famous &quot;turning inside out&quot; visual illusion.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-white font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span>Double (Clifford) Rotation</span>
                  </div>
                  <p className="text-slate-400 text-xs">
                    In 3D, an object can only rotate in one plane at any given instant. In 4D, because there are two completely independent pairs of perpendicular dimensions (for example, <strong className="text-purple-300">XW and YZ</strong>), an object can rotate in <em>two separate planes at the same time</em>!
                  </p>
                  <p className="text-slate-400 text-xs">
                    When both rotation speeds are identical, this is called an <em>isoclinic rotation</em> or <em>Clifford rotation</em>. Every point moves at the exact same velocity along great circles of S³.
                  </p>
                </div>
              </div>

              {/* Slicing vs Projection Explanation */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
                <h4 className="font-bold text-purple-300 font-display text-base">
                  Why Slicing Is Totally Different From Projection
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-cyan-300 block mb-1">PROJECTION (Shadow):</strong>
                    Takes all 16 vertices of the 4D tesseract and flattens them into 3D. You see the entire object at once, but depths and angles are distorted because the 4th axis W is compressed.
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-purple-300 block mb-1">SLICING (Hyperplane Cut):</strong>
                    Takes a single 3D &quot;knife&quot; at position <code className="font-mono text-purple-300">w = {currentW.toFixed(2)}</code>. You only see the parts of the 4D shape that actually touch this knife. Shapes morph dynamically as the knife slides through.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Advanced Mathematical View */
            <div className="space-y-6 text-xs font-mono">
              {/* 4x4 SO(4) Rotation Matrix Display */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 font-bold uppercase">
                    Active SO(4) Rotation Matrix R ∈ ℝ⁴ˣ⁴:
                  </span>
                  <span className="text-[10px] text-slate-500">
                    det(R) = +1.000 (Special Orthogonal Lie Group)
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 overflow-x-auto">
                  <div className="grid grid-cols-4 gap-3 text-center min-w-[320px]">
                    {matrixGrid.map((row, rIdx) =>
                      row.map((val, cIdx) => {
                        const isDiag = rIdx === cIdx;
                        const isNonZero = Math.abs(val) > 1e-4;
                        return (
                          <div
                            key={`${rIdx}-${cIdx}`}
                            className={`p-2 rounded border text-xs ${
                              isDiag
                                ? 'bg-purple-950/40 text-purple-300 border-purple-800'
                                : isNonZero
                                ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800'
                                : 'bg-slate-950 text-slate-500 border-slate-800'
                            }`}
                          >
                            <div className="text-[9px] text-slate-500">
                              R[{rIdx},{cIdx}]
                            </div>
                            <div className="font-bold">{val.toFixed(4)}</div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Transformation rule for any vertex <code className="text-cyan-300">v&apos; = R · v</code>:
                  <div className="mt-1 text-[10px] text-slate-500">
                    x&apos; = R₀₀x + R₀₁y + R₀₂z + R₀₃w | y&apos; = R₁₀x + R₁₁y + R₁₂z + R₁₃w | ...
                  </div>
                </div>
              </div>

              {/* 4D -> 3D Perspective Projection Formulas */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold uppercase">
                  4D → 3D Perspective Projection Operator:
                </span>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1.5 text-slate-300">
                  <div>
                    Camera Position: <code className="text-cyan-300">(0, 0, 0, d₄)</code>, with focal distance <code className="text-cyan-300">d₄ = {projectionConfig.distance.toFixed(2)}</code>
                  </div>
                  <div>
                    Perspective Scale Factor: <code className="text-cyan-300">s(w) = d₄ / (d₄ - w)</code>
                  </div>
                  <div>
                    Projected 3D Point: <code className="text-cyan-300">[X, Y, Z] = [s(w) · x, s(w) · y, s(w) · z]</code>
                  </div>
                </div>
              </div>

              {/* Live Transformed Coordinates Sample Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 uppercase text-[11px]">
                    First 8 Vertex Coordinate States (v₀ ... v₇):
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {geometry.vertices.length} total vertices in {geometry.name}
                  </span>
                </div>

                <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                      <tr>
                        <th className="p-2.5">ID</th>
                        <th className="p-2.5">Original (x, y, z, w)</th>
                        <th className="p-2.5 text-purple-400">Transformed (x&apos;, y&apos;, z&apos;, w&apos;)</th>
                        <th className="p-2.5 text-cyan-400">Projected 3D (X, Y, Z)</th>
                        <th className="p-2.5 text-amber-400">w&apos; - w₀</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {geometry.vertices.slice(0, 8).map((v, idx) => {
                        const orig = v.originalPosition;
                        const trans = transformedVertices[idx] || orig;
                        const denom = Math.max(0.1, projectionConfig.distance - trans.w);
                        const s = projectionConfig.distance / denom;
                        const px = trans.x * s;
                        const py = trans.y * s;
                        const pz = trans.z * s;
                        const deltaW = trans.w - currentW;

                        return (
                          <tr key={v.id} className="hover:bg-slate-900/50">
                            <td className="p-2.5 text-slate-500">v{v.id}</td>
                            <td className="p-2.5 text-slate-400">
                              ({orig.x.toFixed(1)}, {orig.y.toFixed(1)}, {orig.z.toFixed(1)}, {orig.w.toFixed(1)})
                            </td>
                            <td className="p-2.5 text-purple-300 font-bold">
                              ({trans.x.toFixed(2)}, {trans.y.toFixed(2)}, {trans.z.toFixed(2)}, {trans.w.toFixed(2)})
                            </td>
                            <td className="p-2.5 text-cyan-300">
                              ({px.toFixed(2)}, {py.toFixed(2)}, {pz.toFixed(2)})
                            </td>
                            <td className={`p-2.5 ${Math.abs(deltaW) < 0.1 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                              {deltaW >= 0 ? `+${deltaW.toFixed(2)}` : deltaW.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-white transition-all"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
