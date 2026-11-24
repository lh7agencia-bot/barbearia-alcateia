import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Pause, Play } from 'lucide-react';

type FinishPreset = 'steel' | 'graphite' | 'chrome';
type CameraPreset = 'front' | 'detail' | 'top';

interface CameraTarget {
  pos: [number, number, number];
  look: [number, number, number];
}

const CAMERA_PRESETS: Record<CameraPreset, CameraTarget> = {
  front: { pos: [0.45, 1.8, 5.75], look: [0, 1.05, 0] },
  detail: { pos: [2.25, 1.35, 2.55], look: [0, 0.85, 0] },
  top: { pos: [0.2, 4.35, 2.75], look: [0, 1.35, 0] },
};

const FINISH_CONFIGS: Record<
  FinishPreset,
  { label: string; metalColor: number; metalRoughness: number; metalness: number; stripeAccent: string }
> = {
  steel: {
    label: 'Aço Escovado',
    metalColor: 0xb8bcc2,
    metalRoughness: 0.24,
    metalness: 0.92,
    stripeAccent: '#4A4A4A',
  },
  graphite: {
    label: 'Grafite Fosco',
    metalColor: 0x4a4a4a,
    metalRoughness: 0.42,
    metalness: 0.82,
    stripeAccent: '#6B6B6B',
  },
  chrome: {
    label: 'Cromado Clássico',
    metalColor: 0xe6e8eb,
    metalRoughness: 0.1,
    metalness: 0.98,
    stripeAccent: '#3A3A3A',
  },
};

function createBarberStripeTexture(accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(0, 0, 512, 512);

  // Crisp diagonal architectural barber stripes in charcoal, silver, and graphite
  const stripeWidth = 64;
  ctx.save();
  for (let i = -512; i < 1024; i += stripeWidth * 4) {
    // Silver / warm ivory stripe
    ctx.fillStyle = '#E5E5E0';
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + stripeWidth, 0);
    ctx.lineTo(i + stripeWidth + 512, 512);
    ctx.lineTo(i + 512, 512);
    ctx.closePath();
    ctx.fill();

    // Graphite accent stripe
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.moveTo(i + stripeWidth * 2, 0);
    ctx.lineTo(i + stripeWidth * 3, 0);
    ctx.lineTo(i + stripeWidth * 3 + 512, 512);
    ctx.lineTo(i + stripeWidth * 2 + 512, 512);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2.5);
  return texture;
}

function createBrushedMetalMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  for (let y = 0; y < 256; y++) {
    const shade = 112 + ((y * 17) % 32);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(0, y, 256, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 126);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.32)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function BarberPole3DCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [finish, setFinish] = useState<FinishPreset>('steel');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('front');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [controlsCollapsed, setControlsCollapsed] = useState<boolean>(false);
  const [webglUnavailable, setWebglUnavailable] = useState<boolean>(false);

  const finishRef = useRef<FinishPreset>(finish);
  const rotatingRef = useRef<boolean>(isRotating);
  const cameraGoalRef = useRef<{
    active: boolean;
    pos: THREE.Vector3;
    look: THREE.Vector3;
  }>({
    active: false,
    pos: new THREE.Vector3(...CAMERA_PRESETS.front.pos),
    look: new THREE.Vector3(...CAMERA_PRESETS.front.look),
  });

  const applyFinishRef = useRef<((preset: FinishPreset) => void) | null>(null);

  useEffect(() => {
    finishRef.current = finish;
    applyFinishRef.current?.(finish);
  }, [finish]);

  useEffect(() => {
    rotatingRef.current = isRotating;
  }, [isRotating]);

  const handleSelectCamera = (preset: CameraPreset) => {
    setCameraPreset(preset);
    const target = CAMERA_PRESETS[preset];
    cameraGoalRef.current.pos.set(...target.pos);
    cameraGoalRef.current.look.set(...target.look);
    cameraGoalRef.current.active = true;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRotating(false);
      rotatingRef.current = false;
    }

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 480;

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglUnavailable(true);
    };
    const onContextRestored = () => {
      setWebglUnavailable(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    scene.fog = new THREE.FogExp2(0x1a1a1a, 0.085);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 40);
    camera.position.set(...CAMERA_PRESETS.front.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS.front.look);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2.6;
    controls.maxDistance = 6.8;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.update();

    controls.addEventListener('start', () => {
      cameraGoalRef.current.active = false;
    });

    // Studio 3-point + Hemisphere lighting
    const hemiLight = new THREE.HemisphereLight(0xcbd5e1, 0x161616, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.4);
    keyLight.position.set(3.8, 5.4, 4.2);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 14;
    const d = 2.6;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9ca3af, 1.5);
    rimLight.position.set(-4.2, 3.2, -3.5);
    scene.add(rimLight);

    // Architectural studio floor blended into fog horizon
    const floorGeo = new THREE.CircleGeometry(14, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x171717,
      roughness: 0.92,
      metalness: 0.08,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Soft radial contact shadow plane
    const contactTex = createContactShadowTexture();
    const contactGeo = new THREE.CircleGeometry(1.45, 32);
    const contactMat = new THREE.MeshBasicMaterial({
      map: contactTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.75,
    });
    const contactPlane = new THREE.Mesh(contactGeo, contactMat);
    contactPlane.rotation.x = -Math.PI / 2;
    contactPlane.position.y = 0.015;
    scene.add(contactPlane);

    // Composite 11-part Hero Subject: Barber Pole & Straight-Razor Pedestal
    const totemGroup = new THREE.Group();
    totemGroup.position.set(0, 0, 0);
    scene.add(totemGroup);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const brushedMap = createBrushedMetalMap();
    brushedMap.anisotropy = maxAniso;

    let stripeTexture = createBarberStripeTexture(FINISH_CONFIGS[finishRef.current].stripeAccent);
    stripeTexture.anisotropy = maxAniso;

    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x202020,
      roughness: 0.72,
      metalness: 0.18,
    });

    const matteGraphiteMat = new THREE.MeshStandardMaterial({
      color: 0x4a4a4a,
      roughness: 0.56,
      metalness: 0.35,
      bumpMap: brushedMap,
      bumpScale: 0.012,
    });

    const metalTrimMat = new THREE.MeshPhysicalMaterial({
      color: FINISH_CONFIGS[finishRef.current].metalColor,
      metalness: FINISH_CONFIGS[finishRef.current].metalness,
      roughness: FINISH_CONFIGS[finishRef.current].metalRoughness,
      anisotropy: 0.75,
      bumpMap: brushedMap,
      bumpScale: 0.008,
    });

    const poleCoreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: stripeTexture,
      roughness: 0.32,
      metalness: 0.08,
    });

    const glassSleeveMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5f5f5,
      roughness: 0.08,
      metalness: 0.02,
      transmission: isSoftwareGl ? 0 : 0.9,
      transparent: true,
      opacity: isSoftwareGl ? 0.24 : 1,
      ior: 1.5,
      thickness: 0.25,
      clearcoat: 1.0,
      depthWrite: false,
    });

    // Part 1: Heavy stepped obsidian plinth
    const plinthGeo = new THREE.CylinderGeometry(0.92, 1.02, 0.22, 32);
    const plinthMesh = new THREE.Mesh(plinthGeo, obsidianMat);
    plinthMesh.position.y = 0.11;
    plinthMesh.castShadow = true;
    plinthMesh.receiveShadow = true;
    totemGroup.add(plinthMesh);

    // Part 2: Upper graphite bevelled tier
    const tierGeo = new THREE.CylinderGeometry(0.72, 0.84, 0.14, 32);
    const tierMesh = new THREE.Mesh(tierGeo, matteGraphiteMat);
    tierMesh.position.y = 0.29;
    tierMesh.castShadow = true;
    tierMesh.receiveShadow = true;
    totemGroup.add(tierMesh);

    // Part 3: Lower lathe-turned metallic collar & cup
    const lowerCupPoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.46, 0.0),
      new THREE.Vector2(0.48, 0.08),
      new THREE.Vector2(0.36, 0.18),
      new THREE.Vector2(0.41, 0.28),
      new THREE.Vector2(0.38, 0.34),
      new THREE.Vector2(0.0, 0.34),
    ];
    const lowerCupGeo = new THREE.LatheGeometry(lowerCupPoints, 32);
    const lowerCupMesh = new THREE.Mesh(lowerCupGeo, metalTrimMat);
    lowerCupMesh.position.y = 0.36;
    lowerCupMesh.castShadow = true;
    totemGroup.add(lowerCupMesh);

    // Part 4: Helical rotating barber core
    const poleCoreGeo = new THREE.CylinderGeometry(0.28, 0.28, 1.72, 32);
    const poleCoreMesh = new THREE.Mesh(poleCoreGeo, poleCoreMat);
    poleCoreMesh.position.y = 1.56;
    poleCoreMesh.castShadow = true;
    totemGroup.add(poleCoreMesh);

    // Part 5: Outer optical glass cylinder
    const glassGeo = new THREE.CylinderGeometry(0.36, 0.36, 1.74, 32, 1, true);
    const glassMesh = new THREE.Mesh(glassGeo, glassSleeveMat);
    glassMesh.position.y = 1.56;
    glassMesh.renderOrder = 2;
    totemGroup.add(glassMesh);

    // Part 6: Upper lathe-turned metallic crown
    const upperCapPoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.4, 0.0),
      new THREE.Vector2(0.44, 0.07),
      new THREE.Vector2(0.38, 0.16),
      new THREE.Vector2(0.28, 0.24),
      new THREE.Vector2(0.14, 0.28),
      new THREE.Vector2(0.0, 0.28),
    ];
    const upperCapGeo = new THREE.LatheGeometry(upperCapPoints, 32);
    const upperCapMesh = new THREE.Mesh(upperCapGeo, metalTrimMat);
    upperCapMesh.position.y = 2.43;
    upperCapMesh.castShadow = true;
    totemGroup.add(upperCapMesh);

    // Part 7: Crown finial sphere & neck ring
    const neckRingGeo = new THREE.TorusGeometry(0.15, 0.032, 14, 32);
    const neckRingMesh = new THREE.Mesh(neckRingGeo, matteGraphiteMat);
    neckRingMesh.rotation.x = Math.PI / 2;
    neckRingMesh.position.y = 2.71;
    totemGroup.add(neckRingMesh);

    const finialGeo = new THREE.SphereGeometry(0.16, 24, 24);
    const finialMesh = new THREE.Mesh(finialGeo, metalTrimMat);
    finialMesh.position.y = 2.86;
    finialMesh.castShadow = true;
    totemGroup.add(finialMesh);

    // Part 8: 24 Precision collar bolts via InstancedMesh
    const boltGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.03, 12);
    const boltsMesh = new THREE.InstancedMesh(boltGeo, metalTrimMat, 24);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 24; i++) {
      const ringIndex = i < 12 ? 0 : 1;
      const angle = ((i % 12) / 12) * Math.PI * 2;
      const radius = ringIndex === 0 ? 0.39 : 0.41;
      const yPos = ringIndex === 0 ? 0.67 : 2.47;
      dummy.position.set(Math.cos(angle) * radius, yPos, Math.sin(angle) * radius);
      dummy.rotation.set(0, -angle, Math.PI / 2);
      dummy.updateMatrix();
      boltsMesh.setMatrixAt(i, dummy.matrix);
    }
    boltsMesh.instanceMatrix.needsUpdate = true;
    boltsMesh.computeBoundingSphere();
    totemGroup.add(boltsMesh);

    // Part 9 & 10: Architectural Straight-Razor Sculpture resting beside base
    const razorGroup = new THREE.Group();
    razorGroup.position.set(0.54, 0.36, 0.42);
    razorGroup.rotation.set(0, -0.55, 0.14);

    // Razor Handle (ExtrudeGeometry with bevel)
    const handleShape = new THREE.Shape();
    handleShape.moveTo(0, -0.045);
    handleShape.lineTo(0.62, -0.03);
    handleShape.quadraticCurveTo(0.69, 0, 0.62, 0.035);
    handleShape.lineTo(0, 0.045);
    handleShape.quadraticCurveTo(-0.05, 0, 0, -0.045);

    const handleGeo = new THREE.ExtrudeGeometry(handleShape, {
      depth: 0.045,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.01,
      bevelSegments: 3,
    });
    handleGeo.center();
    const handleMesh = new THREE.Mesh(handleGeo, matteGraphiteMat);
    handleMesh.position.set(0, 0.05, 0);
    handleMesh.rotation.y = 0.25;
    handleMesh.castShadow = true;
    razorGroup.add(handleMesh);

    // Razor Blade (ExtrudeGeometry)
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, -0.035);
    bladeShape.lineTo(0.56, -0.05);
    bladeShape.lineTo(0.58, 0.04);
    bladeShape.lineTo(0, 0.032);
    bladeShape.closePath();

    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
      depth: 0.014,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.004,
      bevelSegments: 2,
    });
    bladeGeo.center();
    const bladeMesh = new THREE.Mesh(bladeGeo, metalTrimMat);
    bladeMesh.position.set(-0.22, 0.11, 0.12);
    bladeMesh.rotation.set(0.15, -0.35, 0.35);
    bladeMesh.castShadow = true;
    razorGroup.add(bladeMesh);

    // Razor pivot pin
    const pivotGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.075, 16);
    const pivotMesh = new THREE.Mesh(pivotGeo, metalTrimMat);
    pivotMesh.rotation.x = Math.PI / 2;
    pivotMesh.position.set(-0.28, 0.06, 0.07);
    razorGroup.add(pivotMesh);

    totemGroup.add(razorGroup);

    // Part 11: Vertical architectural spine support bar behind glass
    const spinePoints = [
      new THREE.Vector3(0, 0.42, -0.46),
      new THREE.Vector3(0, 1.56, -0.5),
      new THREE.Vector3(0, 2.55, -0.44),
    ];
    const spineCurve = new THREE.CatmullRomCurve3(spinePoints);
    const spineGeo = new THREE.TubeGeometry(spineCurve, 24, 0.035, 12, false);
    const spineMesh = new THREE.Mesh(spineGeo, matteGraphiteMat);
    spineMesh.castShadow = true;
    totemGroup.add(spineMesh);

    applyFinishRef.current = (preset: FinishPreset) => {
      const cfg = FINISH_CONFIGS[preset];
      metalTrimMat.color.setHex(cfg.metalColor);
      metalTrimMat.roughness = cfg.metalRoughness;
      metalTrimMat.metalness = cfg.metalness;
      metalTrimMat.needsUpdate = true;

      const nextTex = createBarberStripeTexture(cfg.stripeAccent);
      nextTex.anisotropy = maxAniso;
      stripeTexture.dispose();
      stripeTexture = nextTex;
      poleCoreMat.map = stripeTexture;
      poleCoreMat.needsUpdate = true;
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let frameId = 0;
    let disposed = false;
    let lastTimeMs = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const nowMs = performance.now();
      const dt = Math.min((nowMs - lastTimeMs) / 1000, 0.1);
      lastTimeMs = nowMs;

      if (rotatingRef.current) {
        poleCoreMesh.rotation.y += dt * 1.15;
      }

      if (cameraGoalRef.current.active) {
        const alpha = 1 - Math.exp(-5.5 * dt);
        camera.position.lerp(cameraGoalRef.current.pos, alpha);
        controls.target.lerp(cameraGoalRef.current.look, alpha);
        if (
          camera.position.distanceTo(cameraGoalRef.current.pos) < 0.02 &&
          controls.target.distanceTo(cameraGoalRef.current.look) < 0.02
        ) {
          cameraGoalRef.current.active = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    const handleResize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();
      plinthGeo.dispose();
      tierGeo.dispose();
      lowerCupGeo.dispose();
      poleCoreGeo.dispose();
      glassGeo.dispose();
      upperCapGeo.dispose();
      neckRingGeo.dispose();
      finialGeo.dispose();
      boltGeo.dispose();
      handleGeo.dispose();
      bladeGeo.dispose();
      pivotGeo.dispose();
      spineGeo.dispose();
      floorGeo.dispose();
      contactGeo.dispose();
      obsidianMat.dispose();
      matteGraphiteMat.dispose();
      metalTrimMat.dispose();
      poleCoreMat.dispose();
      glassSleeveMat.dispose();
      floorMat.dispose();
      contactMat.dispose();
      stripeTexture.dispose();
      brushedMap.dispose();
      contactTex.dispose();
      envTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className="relative w-full h-[420px] sm:h-[480px] lg:h-[540px] rounded-lg overflow-hidden border border-white/10 bg-[#181818]"
      data-testid="barber-3d-viewport"
    >
      {/* Isolated WebGL mount container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="Visualização 3D interativa do símbolo da Barbearia Alcateia"
      />

      {webglUnavailable && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1A1A1A] p-6 text-center">
          <p className="font-display text-2xl text-[#F2F2F0]">Barbearia Alcateia</p>
          <p className="mt-2 text-sm text-[#A3A3A3] max-w-xs">
            Visualização 3D indisponível neste navegador. Explore nossa galeria de fotos reais abaixo.
          </p>
        </div>
      )}

      {/* Top minimal caption inside 3D frame */}
      <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-[#A3A3A3]">
        <span className="bg-[#1A1A1A]/90 border border-white/10 px-2.5 py-1 rounded">
          Emblema 3D · Arraste para girar
        </span>
      </div>

      {/* Collapsible bottom control dock (solid/rgba surface, zero backdrop-filter over WebGL) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-lg flex flex-col items-center z-10">
        <button
          type="button"
          onClick={() => setControlsCollapsed((prev) => !prev)}
          aria-expanded={!controlsCollapsed}
          className="mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-[#D4D4D4] bg-[#1A1A1A]/95 border border-white/15 rounded hover:text-white transition-colors whitespace-nowrap"
        >
          {controlsCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Mostrar Controles
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              Ocultar Controles
            </>
          )}
        </button>

        {!controlsCollapsed && (
          <div className="w-full bg-[#1A1A1A]/95 border border-white/15 rounded-md p-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1" role="group" aria-label="Acabamento do modelo 3D">
              {(Object.keys(FINISH_CONFIGS) as FinishPreset[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFinish(key)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                    finish === key
                      ? 'bg-[#4A4A4A] text-white'
                      : 'text-[#B5B5B5] hover:text-white hover:bg-[#2A2A2A]'
                  }`}
                >
                  {FINISH_CONFIGS[key].label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1" role="group" aria-label="Ângulo de câmera">
              {(['front', 'detail', 'top'] as CameraPreset[]).map((preset) => {
                const labelMap: Record<CameraPreset, string> = {
                  front: 'Frontal',
                  detail: 'Detalhe',
                  top: 'Topo',
                };
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSelectCamera(preset)}
                    className={`px-2 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                      cameraPreset === preset
                        ? 'bg-[#2E2E2E] text-white border border-white/20'
                        : 'text-[#A3A3A3] hover:text-white'
                    }`}
                  >
                    {labelMap[preset]}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setIsRotating((prev) => !prev)}
                aria-label={isRotating ? 'Pausar rotação' : 'Retomar rotação'}
                className="ml-1 inline-flex items-center justify-center w-8 h-8 rounded bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white transition-colors"
              >
                {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
