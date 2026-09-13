import * as THREE from 'three';
import { Mesh3D, ObservationMode, Geometry4D } from '../geometry/types';
import { Vector3 } from '../math/Vector3';

export interface RendererOptions {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  mode: ObservationMode;
  showAxes?: boolean;
  showGrid?: boolean;
  showVertices?: boolean;
  wireframeOnly?: boolean;
}

export class ThreeDimensionRenderer {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  // Render objects
  private projectionGroup: THREE.Group;
  private sliceGroup: THREE.Group;
  private compareGroup: THREE.Group;
  private gridHelper: THREE.GridHelper;
  private axesHelper: THREE.AxesHelper;
  private hyperplaneVisualizer: THREE.Mesh;

  // Interaction / Orbit State
  private isDragging = false;
  private isRightDragging = false;
  private prevMouseX = 0;
  private prevMouseY = 0;
  private cameraDistance = 5.2;
  private cameraAzimuth = Math.PI / 4;
  private cameraPolar = Math.PI / 3;
  private cameraTarget = new THREE.Vector3(0, 0, 0);

  private mode: ObservationMode = 'PROJECTION';
  private animFrameId: number | null = null;
  private disposed = false;

  constructor(options: RendererOptions) {
    this.canvas = options.canvas;
    this.mode = options.mode;

    // 1. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(options.width, options.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // 2. Scene
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent, respects CSS dark background

    // 3. Camera
    this.camera = new THREE.PerspectiveCamera(42, options.width / options.height, 0.1, 100);
    this.updateCameraPosition();

    // 4. Lighting (Controlled, non-flashy scientific rim lighting)
    const ambientLight = new THREE.AmbientLight(0xdcf8ff, 0.7);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(5, 8, 6);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 0.8);
    rimLight.position.set(-6, -4, -5);
    this.scene.add(rimLight);

    // 5. Reference Grid & Axes
    this.gridHelper = new THREE.GridHelper(6, 12, 0x1e293b, 0x0f172a);
    this.gridHelper.position.y = -2.2;
    this.scene.add(this.gridHelper);

    this.axesHelper = new THREE.AxesHelper(1.5);
    this.axesHelper.position.set(-2.5, -2.1, -2.5);
    this.scene.add(this.axesHelper);

    // 6. Hyperplane visualizer (indicates w = w₀ position)
    const planeGeo = new THREE.PlaneGeometry(4, 4);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    this.hyperplaneVisualizer = new THREE.Mesh(planeGeo, planeMat);
    this.hyperplaneVisualizer.rotation.x = Math.PI / 2;
    this.hyperplaneVisualizer.visible = false;
    this.scene.add(this.hyperplaneVisualizer);

    // 7. Groups
    this.projectionGroup = new THREE.Group();
    this.sliceGroup = new THREE.Group();
    this.compareGroup = new THREE.Group();

    this.scene.add(this.projectionGroup);
    this.scene.add(this.sliceGroup);
    this.scene.add(this.compareGroup);

    this.setupEventListeners();
  }

  setMode(mode: ObservationMode): void {
    this.mode = mode;
    this.projectionGroup.visible = mode === 'PROJECTION' || mode === 'COMPARE';
    this.sliceGroup.visible = mode === 'SLICE' || mode === 'COMPARE';

    if (mode === 'COMPARE') {
      this.projectionGroup.position.x = -1.8;
      this.sliceGroup.position.x = 1.8;
    } else {
      this.projectionGroup.position.x = 0;
      this.sliceGroup.position.x = 0;
    }
  }

  updateHyperplaneIndicator(w0: number, visible: boolean): void {
    this.hyperplaneVisualizer.visible = visible;
    this.hyperplaneVisualizer.position.y = w0;
  }

  /**
   * Updates the 4D Projected representation in the 3D scene.
   */
  updateProjectionMesh(mesh3D: Mesh3D, geometry4D: Geometry4D): void {
    // Clear previous
    while (this.projectionGroup.children.length > 0) {
      const obj = this.projectionGroup.children[0];
      this.projectionGroup.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
    }

    if (!mesh3D.vertices.length) return;

    // 1. Edges: Create LineSegments
    const linePositions: number[] = [];
    const lineColors: number[] = [];

    const cyanColor = new THREE.Color(0x06b6d4); // Cyan for w > 0
    const roseColor = new THREE.Color(0xf43f5e); // Rose for w < 0
    const neutralColor = new THREE.Color(0x38bdf8);

    for (const [v1Idx, v2Idx] of mesh3D.edges) {
      if (v1Idx < mesh3D.vertices.length && v2Idx < mesh3D.vertices.length) {
        const p1 = mesh3D.vertices[v1Idx];
        const p2 = mesh3D.vertices[v2Idx];

        linePositions.push(p1.x, p1.y, p1.z);
        linePositions.push(p2.x, p2.y, p2.z);

        const w1 = mesh3D.sourceW ? mesh3D.sourceW[v1Idx] : 0;
        const w2 = mesh3D.sourceW ? mesh3D.sourceW[v2Idx] : 0;

        const c1 = w1 >= 0 ? cyanColor.clone().lerp(new THREE.Color(0x10b981), w1) : roseColor.clone().lerp(neutralColor, 1 + w1);
        const c2 = w2 >= 0 ? cyanColor.clone().lerp(new THREE.Color(0x10b981), w2) : roseColor.clone().lerp(neutralColor, 1 + w2);

        lineColors.push(c1.r, c1.g, c1.b);
        lineColors.push(c2.r, c2.g, c2.b);
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: this.mode === 'COMPARE' ? 0.6 : 0.85,
      linewidth: 2,
    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    this.projectionGroup.add(lines);

    // 2. Vertices: Points with glow
    const pointPositions: number[] = [];
    const pointColors: number[] = [];

    for (let i = 0; i < mesh3D.vertices.length; i++) {
      const p = mesh3D.vertices[i];
      pointPositions.push(p.x, p.y, p.z);

      const w = mesh3D.sourceW ? mesh3D.sourceW[i] : 0;
      const c = w >= 0 ? cyanColor : roseColor;
      pointColors.push(c.r, c.g, c.b);
    }

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointPositions, 3));
    pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(pointColors, 3));

    const pointMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
    });

    const points = new THREE.Points(pointGeometry, pointMaterial);
    this.projectionGroup.add(points);

    // 3. Subtle translucent faces for tesseract cells
    if (mesh3D.faces && mesh3D.faces.length > 0 && mesh3D.faces.length <= 64) {
      const facePositions: number[] = [];
      for (const face of mesh3D.faces) {
        if (face.length >= 3) {
          // Triangulate face fan from face[0]
          const v0 = mesh3D.vertices[face[0]];
          for (let i = 1; i < face.length - 1; i++) {
            const v1 = mesh3D.vertices[face[i]];
            const v2 = mesh3D.vertices[face[i + 1]];
            facePositions.push(v0.x, v0.y, v0.z);
            facePositions.push(v1.x, v1.y, v1.z);
            facePositions.push(v2.x, v2.y, v2.z);
          }
        }
      }

      if (facePositions.length > 0) {
        const faceGeo = new THREE.BufferGeometry();
        faceGeo.setAttribute('position', new THREE.Float32BufferAttribute(facePositions, 3));
        faceGeo.computeVertexNormals();

        const faceMat = new THREE.MeshStandardMaterial({
          color: 0x0284c7,
          roughness: 0.4,
          metalness: 0.2,
          transparent: true,
          opacity: 0.08,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        const faceMesh = new THREE.Mesh(faceGeo, faceMat);
        this.projectionGroup.add(faceMesh);
      }
    }
  }

  /**
   * Updates the calculated 3D Slice in the scene.
   */
  updateSliceMesh(sliceMesh3D: Mesh3D): void {
    // Clear previous
    while (this.sliceGroup.children.length > 0) {
      const obj = this.sliceGroup.children[0];
      this.sliceGroup.remove(obj);
      if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
    }

    if (!sliceMesh3D.vertices.length) return;

    // 1. Solid Shaded 3D Body
    const facePositions: number[] = [];

    for (const face of sliceMesh3D.faces) {
      if (face.length >= 3) {
        const v0 = sliceMesh3D.vertices[face[0]];
        for (let i = 1; i < face.length - 1; i++) {
          const v1 = sliceMesh3D.vertices[face[i]];
          const v2 = sliceMesh3D.vertices[face[i + 1]];
          facePositions.push(v0.x, v0.y, v0.z);
          facePositions.push(v1.x, v1.y, v1.z);
          facePositions.push(v2.x, v2.y, v2.z);
        }
      }
    }

    if (facePositions.length > 0) {
      const faceGeo = new THREE.BufferGeometry();
      faceGeo.setAttribute('position', new THREE.Float32BufferAttribute(facePositions, 3));
      faceGeo.computeVertexNormals();

      const faceMat = new THREE.MeshStandardMaterial({
        color: 0xa855f7, // Purple / Violet for the calculated 3D Slice
        roughness: 0.35,
        metalness: 0.3,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
      });

      const solidMesh = new THREE.Mesh(faceGeo, faceMat);
      this.sliceGroup.add(solidMesh);
    }

    // 2. Wireframe Boundaries
    const linePositions: number[] = [];
    for (const [v1, v2] of sliceMesh3D.edges) {
      if (v1 < sliceMesh3D.vertices.length && v2 < sliceMesh3D.vertices.length) {
        const p1 = sliceMesh3D.vertices[v1];
        const p2 = sliceMesh3D.vertices[v2];
        linePositions.push(p1.x, p1.y, p1.z);
        linePositions.push(p2.x, p2.y, p2.z);
      }
    }

    if (linePositions.length > 0) {
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

      const lineMat = new THREE.LineBasicMaterial({
        color: 0xf3e8ff, // Bright white-purple outline
        linewidth: 2.5,
        transparent: true,
        opacity: 0.95,
      });

      const lines = new THREE.LineSegments(lineGeo, lineMat);
      this.sliceGroup.add(lines);
    }

    // 3. Intersection Vertices (Nodes)
    const ptPositions: number[] = [];
    for (const p of sliceMesh3D.vertices) {
      ptPositions.push(p.x, p.y, p.z);
    }

    if (ptPositions.length > 0) {
      const ptGeo = new THREE.BufferGeometry();
      ptGeo.setAttribute('position', new THREE.Float32BufferAttribute(ptPositions, 3));

      const ptMat = new THREE.PointsMaterial({
        color: 0xe879f9,
        size: 0.14,
        transparent: true,
        opacity: 1.0,
      });

      const pts = new THREE.Points(ptGeo, ptMat);
      this.sliceGroup.add(pts);
    }
  }

  render(): void {
    if (this.disposed) return;
    this.renderer.render(this.scene, this.camera);
  }

  resize(width: number, height: number): void {
    if (this.disposed || width <= 0 || height <= 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  resetCamera(): void {
    this.cameraDistance = 5.2;
    this.cameraAzimuth = Math.PI / 4;
    this.cameraPolar = Math.PI / 3;
    this.cameraTarget.set(0, 0, 0);
    this.updateCameraPosition();
  }

  private updateCameraPosition(): void {
    const x = this.cameraDistance * Math.sin(this.cameraPolar) * Math.sin(this.cameraAzimuth);
    const y = this.cameraDistance * Math.cos(this.cameraPolar);
    const z = this.cameraDistance * Math.sin(this.cameraPolar) * Math.cos(this.cameraAzimuth);

    this.camera.position.set(x + this.cameraTarget.x, y + this.cameraTarget.y, z + this.cameraTarget.z);
    this.camera.lookAt(this.cameraTarget);
  }

  private setupEventListeners(): void {
    const el = this.canvas;

    el.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.isDragging = true;
      } else if (e.button === 2) {
        this.isRightDragging = true;
      }
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.prevMouseX;
        const dy = e.clientY - this.prevMouseY;

        this.cameraAzimuth -= dx * 0.008;
        this.cameraPolar = Math.max(0.1, Math.min(Math.PI - 0.1, this.cameraPolar - dy * 0.008));

        this.updateCameraPosition();
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
      } else if (this.isRightDragging) {
        const dx = e.clientX - this.prevMouseX;
        const dy = e.clientY - this.prevMouseY;

        // Pan
        const right = new THREE.Vector3().crossVectors(this.camera.up, this.camera.position).normalize();
        this.cameraTarget.addScaledVector(right, dx * 0.005);
        this.cameraTarget.y += dy * 0.005;

        this.updateCameraPosition();
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.isRightDragging = false;
    });

    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.cameraDistance = Math.max(1.8, Math.min(18.0, this.cameraDistance + e.deltaY * 0.004));
      this.updateCameraPosition();
    }, { passive: false });

    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  dispose(): void {
    this.disposed = true;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.renderer.dispose();
  }
}
