import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeCorridorProps {
  progress: number;
  onProgressChange: (p: number) => void;
  targetProgress: number;
  setTargetProgress: (p: number) => void;
  reduceMotion: boolean;
}

export default function ThreeCorridor({
  progress,
  onProgressChange,
  targetProgress,
  setTargetProgress,
  reduceMotion,
}: ThreeCorridorProps) {
  const mountRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    progress: 0,
    targetProgress: 0,
    isTouch: false,
    touchY: 0,
  });

  // Sync state values to ref for event handlers to avoid stale closures
  useEffect(() => {
    stateRef.current.progress = progress;
    stateRef.current.targetProgress = targetProgress;
  }, [progress, targetProgress]);

  useEffect(() => {
    if (!mountRef.current) return;

    const canvas = mountRef.current;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Detect if Touch is supported
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    stateRef.current.isTouch = isTouch;

    // Create Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 2));
    renderer.setSize(width, height);

    // Create Scene
    const scene = new THREE.Scene();
    const OBSIDIAN_DARK = 0x0d0b09;
    scene.background = new THREE.Color(OBSIDIAN_DARK);
    scene.fog = new THREE.FogExp2(OBSIDIAN_DARK, 0.035);

    // Create Camera
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 220);

    // Add Lights
    scene.add(new THREE.HemisphereLight(0xffffff, 0xe8dfd5, 0.85));
    const dirLight = new THREE.DirectionalLight(0xf7e2be, 0.7);
    dirLight.position.set(5, 12, 6);
    scene.add(dirLight);

    const pointLights: THREE.PointLight[] = [];
    function addGlow(x: number, y: number, z: number, color: number, intensity: number, distance: number) {
      const pl = new THREE.PointLight(color, intensity, distance, 2);
      pl.position.set(x, y, z);
      scene.add(pl);
      pointLights.push(pl);

      const sg = new THREE.SphereGeometry(0.09, 10, 10);
      const sm = new THREE.MeshBasicMaterial({ color });
      const sph = new THREE.Mesh(sg, sm);
      sph.position.set(x, y, z);
      scene.add(sph);
    }

    // Procedural Floor Texture
    function makeFloorTexture() {
      const size = 512;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#0d0b09";
      ctx.fillRect(0, 0, size, size);
      
      // Fine gold tile borders
      ctx.strokeStyle = "rgba(217,119,6,0.3)";
      ctx.lineWidth = 2;
      for (let i = 0; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (i * size) / 4);
        ctx.lineTo(size, (i * size) / 4);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(size / 2, 0);
      ctx.lineTo(size / 2, size);
      ctx.stroke();

      // Subtle travertine marble veins
      ctx.strokeStyle = "rgba(195,155,95,0.06)";
      for (let j = 0; j <= 8; j++) {
        ctx.beginPath();
        ctx.moveTo((j * size) / 8, 0);
        ctx.lineTo((j * size) / 8, size);
        ctx.stroke();
      }

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2.2, 14);
      return tex;
    }

    // Soft Particle Sprite
    function makeDotTexture() {
      const s = 64;
      const c = document.createElement("canvas");
      c.width = s;
      c.height = s;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, "rgba(228,183,104,0.9)");
      g.addColorStop(1, "rgba(228,183,104,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
      return new THREE.CanvasTexture(c);
    }

    const CORRIDOR_LEN = 118;
    const Z_START = 18;
    const Z_END = -100;

    // Floor & Walls
    const floorTex = makeFloorTexture();
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      metalness: 0.15,
      roughness: 0.25,
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(9, CORRIDOR_LEN + 30), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, (Z_START + Z_END) / 2);
    scene.add(floor);

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x141210, // luxury dark warm plaster
      roughness: 0.9,
      metalness: 0.02,
    });
    [-4.6, 4.6].forEach((x) => {
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(CORRIDOR_LEN + 30, 6.4), wallMat);
      wall.position.set(x, 3.2, (Z_START + Z_END) / 2);
      wall.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2;
      scene.add(wall);
    });

    const ceil = new THREE.Mesh(
      new THREE.PlaneGeometry(9, CORRIDOR_LEN + 30),
      new THREE.MeshStandardMaterial({ color: 0x0c0a08, roughness: 0.95 })
    );
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, 6.3, (Z_START + Z_END) / 2);
    scene.add(ceil);

    // Repeating columns & arch frames
    const BRASS = 0xc9974d;
    const BRASS_BRIGHT = 0xe4b768;
    const WINE = 0x6e2e2a;

    const frameCount = 13;
    const topGeo = new THREE.BoxGeometry(9.2, 0.14, 0.14);
    const topMat = new THREE.MeshStandardMaterial({
      color: BRASS,
      metalness: 0.9,
      roughness: 0.18,
      emissive: 0x221a10,
      emissiveIntensity: 0.1,
    });
    const topMesh = new THREE.InstancedMesh(topGeo, topMat, frameCount);

    const pilGeo = new THREE.CylinderGeometry(0.07, 0.07, 5.6, 8);
    const pilMesh = new THREE.InstancedMesh(pilGeo, topMat, frameCount * 2);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < frameCount; i++) {
      const z = Z_START - i * ((Z_START - Z_END) / (frameCount - 1));
      dummy.position.set(0, 5.5, z);
      dummy.updateMatrix();
      topMesh.setMatrixAt(i, dummy.matrix);

      dummy.position.set(-4.55, 2.7, z);
      dummy.updateMatrix();
      pilMesh.setMatrixAt(i * 2, dummy.matrix);

      dummy.position.set(4.55, 2.7, z);
      dummy.updateMatrix();
      pilMesh.setMatrixAt(i * 2 + 1, dummy.matrix);

      if (i % 2 === 0) {
        addGlow(0, 5.3, z, BRASS_BRIGHT, 1.1, 11);
      }
    }
    scene.add(topMesh, pilMesh);

    // Ambient Dust Particles
    const dustCount = 380;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustSpeed = new Float32Array(dustCount);
    for (let d = 0; d < dustCount; d++) {
      dustPos[d * 3] = (Math.random() - 0.5) * 8;
      dustPos[d * 3 + 1] = Math.random() * 5.6;
      dustPos[d * 3 + 2] = Z_START + (Z_END - Z_START) * Math.random();
      dustSpeed[d] = 0.15 + Math.random() * 0.25;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.06,
      map: makeDotTexture(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: BRASS_BRIGHT,
      opacity: 0.75,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // Station Z offsets
    const STATION_Z = [10, -8, -28, -48, -68, -92];

    const animatedCallbacks: ((t: number) => void)[] = [];

    // Station 0 — Reception Desk
    (() => {
      const z = STATION_Z[0];
      const deskTop = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.12, 1.1),
        new THREE.MeshStandardMaterial({
          color: BRASS,
          metalness: 0.8,
          roughness: 0.32,
          emissive: 0x1a1006,
          emissiveIntensity: 0.25,
        })
      );
      deskTop.position.set(-2.6, 1.05, z);
      scene.add(deskTop);

      const deskBody = new THREE.Mesh(
        new THREE.BoxGeometry(3.0, 1.0, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x161310, metalness: 0.2, roughness: 0.15 })
      );
      deskBody.position.set(-2.6, 0.5, z);
      scene.add(deskBody);

      addGlow(-2.6, 4.2, z + 1.4, BRASS_BRIGHT, 1.0, 9);
    })();

    // Station 1 — Wash Basin with running shader water
    (() => {
      const z = STATION_Z[1];
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.4, 0.95, 16),
        new THREE.MeshStandardMaterial({ color: 0x161310, metalness: 0.2, roughness: 0.15 })
      );
      pedestal.position.set(0, 0.48, z);
      scene.add(pedestal);

      const basin = new THREE.Mesh(
        new THREE.SphereGeometry(0.62, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({
          color: BRASS,
          metalness: 0.8,
          roughness: 0.32,
          emissive: 0x1a1006,
          emissiveIntensity: 0.15,
        })
      );
      basin.position.set(0, 0.95, z);
      basin.scale.set(1, 0.55, 1);
      scene.add(basin);

      const waterGeo = new THREE.CircleGeometry(0.52, 32);
      const waterMat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(0xdbe9f0) } },
        vertexShader: `
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec3 pos = position;
            pos.z += sin(pos.x * 6.0 + uTime * 2.0) * 0.025 + sin(pos.y * 7.0 + uTime * 1.4) * 0.02;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          varying vec2 vUv;
          void main() {
            float r = distance(vUv, vec2(0.5));
            float a = smoothstep(0.5, 0.0, r) * 0.55;
            gl_FragColor = vec4(uColor, a);
          }
        `,
      });
      const water = new THREE.Mesh(waterGeo, waterMat);
      water.rotation.x = -Math.PI / 2;
      water.position.set(0, 1.02, z);
      scene.add(water);

      animatedCallbacks.push((t) => {
        waterMat.uniforms.uTime.value = t;
      });

      addGlow(0, 4.0, z - 1.2, BRASS_BRIGHT, 0.9, 8);
    })();

    // Station 2 — Client Voice Waves
    (() => {
      const z = STATION_Z[5];
      const group = new THREE.Group();
      group.position.set(0, 1.9, z);
      scene.add(group);

      const colors = [BRASS, WINE, BRASS_BRIGHT];
      for (let r = 0; r < 3; r++) {
        const pts: THREE.Vector3[] = [];
        for (let p = 0; p < 6; p++) {
          pts.push(
            new THREE.Vector3((Math.random() - 0.5) * 2.4, (Math.random() - 0.5) * 1.6, (Math.random() - 0.5) * 2.4)
          );
        }
        const curve = new THREE.CatmullRomCurve3(pts, true);
        const tube = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 64, 0.045, 8, true),
          new THREE.MeshStandardMaterial({
            color: colors[r % colors.length],
            metalness: 0.4,
            roughness: 0.4,
            emissive: colors[r % colors.length],
            emissiveIntensity: 0.18,
          })
        );
        group.add(tube);
      }

      animatedCallbacks.push((t) => {
        group.rotation.y = t * 0.12;
      });

      addGlow(0, 4.4, z + 1, WINE, 0.8, 8);
      addGlow(0, 1.4, z - 1.6, BRASS_BRIGHT, 0.7, 7);
    })();

    // Station 3 — Haircut Chair & Mirror
    (() => {
      const z = STATION_Z[2];
      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.14, 0.9),
        new THREE.MeshStandardMaterial({ color: 0x1a1612, roughness: 0.6 })
      );
      seat.position.set(0, 0.85, z);
      scene.add(seat);

      const back = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 1.0, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x1a1612, roughness: 0.6 })
      );
      back.position.set(0, 1.45, z - 0.4);
      scene.add(back);

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.28, 0.8, 12),
        new THREE.MeshStandardMaterial({
          color: BRASS,
          metalness: 0.8,
          roughness: 0.32,
          emissive: 0x1a1006,
          emissiveIntensity: 0.2,
        })
      );
      base.position.set(0, 0.4, z);
      scene.add(base);

      const mirror = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 3.0),
        new THREE.MeshStandardMaterial({ color: 0xcdbfa5, metalness: 0.95, roughness: 0.06 })
      );
      mirror.position.set(0, 1.7, z - 2.19);
      scene.add(mirror);

      const border = new THREE.Mesh(
        new THREE.PlaneGeometry(2.34, 3.14),
        new THREE.MeshStandardMaterial({
          color: BRASS,
          metalness: 0.8,
          roughness: 0.32,
          emissive: 0x1a1006,
          emissiveIntensity: 0.3,
        })
      );
      border.position.set(0, 1.7, z - 2.21);
      scene.add(border);

      addGlow(-1.6, 2.6, z - 0.2, BRASS_BRIGHT, 0.9, 8);
      addGlow(1.6, 2.6, z - 0.2, BRASS_BRIGHT, 0.9, 8);
    })();

    // Station 4 — Reveal Station
    (() => {
      const z = STATION_Z[3];
      const border = new THREE.Mesh(
        new THREE.PlaneGeometry(4.3, 3.4),
        new THREE.MeshStandardMaterial({
          color: BRASS,
          metalness: 0.8,
          roughness: 0.32,
          emissive: 0x1a1006,
          emissiveIntensity: 0.35,
        })
      );
      border.position.set(0, 2.0, z - 1.21);
      scene.add(border);

      const mirror = new THREE.Mesh(
        new THREE.PlaneGeometry(4.0, 3.1),
        new THREE.MeshStandardMaterial({ color: 0xcdbfa5, metalness: 0.95, roughness: 0.06 })
      );
      mirror.position.set(0, 2.0, z - 1.2);
      scene.add(mirror);

      const ringGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const ringMat = new THREE.MeshBasicMaterial({ color: BRASS_BRIGHT });
      const ring = new THREE.InstancedMesh(ringGeo, ringMat, 16);
      const d2 = new THREE.Object3D();
      for (let k = 0; k < 16; k++) {
        const ang = (k / 16) * Math.PI * 2;
        d2.position.set(Math.cos(ang) * 1.9, 2.0 + Math.sin(ang) * 1.45, z - 1.18);
        d2.updateMatrix();
        ring.setMatrixAt(k, d2.matrix);
      }
      scene.add(ring);

      addGlow(0, 4.6, z + 1, BRASS_BRIGHT, 1.0, 9);
    })();

    // Station 5 — Exit flood
    (() => {
      const z = STATION_Z[4] - 9;
      const flood = new THREE.Mesh(
        new THREE.PlaneGeometry(7, 6),
        new THREE.MeshBasicMaterial({ color: 0x241d14, transparent: true, opacity: 0.9 })
      );
      flood.position.set(0, 3, z);
      scene.add(flood);

      const pl = new THREE.PointLight(0xd97706, 1.4, 26, 2);
      pl.position.set(0, 3, z + 4);
      scene.add(pl);
    })();

    // Camera Path
    const camPts: THREE.Vector3[] = [];
    const lookPts: THREE.Vector3[] = [];
    const CAM_X = [0, -1.3, 1.3, -1.3, 1.3, 0];
    const LOOK_X = [0, 0.55, -0.55, 0.55, -0.55, 0];
    const CAM_Y = [1.6, 1.5, 1.7, 1.55, 1.78, 1.62];
    for (let s = 0; s < 6; s++) {
      const z2 = STATION_Z[s] + 6;
      camPts.push(new THREE.Vector3(CAM_X[s], CAM_Y[s], z2));
      lookPts.push(new THREE.Vector3(LOOK_X[s], CAM_Y[s] - 0.05, z2 - 13));
    }
    const camCurve = new THREE.CatmullRomCurve3(camPts, false, "catmullrom", 0.4);
    const lookCurve = new THREE.CatmullRomCurve3(lookPts, false, "catmullrom", 0.4);

    let animationFrameId: number;
    let lastTime = performance.now();
    const clock = new THREE.Clock();

    const tmpV = new THREE.Vector3();
    const tmpL = new THREE.Vector3();

    function renderLoop() {
      animationFrameId = requestAnimationFrame(renderLoop);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsed = clock.getElapsedTime();

      // Smooth progress lerping
      const currentProg = stateRef.current.progress;
      const targetProg = stateRef.current.targetProgress;
      const damp = reduceMotion ? 0.22 : 0.085;
      const nextProg = currentProg + (targetProg - currentProg) * Math.min(damp * 60 * dt, 1);

      if (Math.abs(nextProg - currentProg) > 0.0001) {
        onProgressChange(nextProg);
      }

      // Camera Position & Bobbing
      camCurve.getPointAt(nextProg, tmpV);
      lookCurve.getPointAt(nextProg, tmpL);

      const moveSpeed = Math.abs(targetProg - nextProg);
      const bobAmt = reduceMotion ? 0 : Math.min(moveSpeed * 30, 1) * 0.025;
      const bob = Math.sin(elapsed * 7) * bobAmt;

      camera.position.set(tmpV.x, tmpV.y + bob, tmpV.z);
      camera.lookAt(tmpL.x, tmpL.y + bob, tmpL.z);

      // Ambient Dust drift
      const posAttr = dust.geometry.attributes.position as THREE.BufferAttribute;
      for (let di = 0; di < dustCount; di++) {
        let yi = di * 3 + 1;
        posAttr.array[yi] += dustSpeed[di] * dt * 0.4;
        if (posAttr.array[yi] > 5.8) posAttr.array[yi] = 0;
      }
      posAttr.needsUpdate = true;

      // Animate custom elements
      animatedCallbacks.forEach((cb) => cb(elapsed));

      renderer.render(scene, camera);
    }

    // Input handlers and automatic snapping
    const SENSITIVITY_WHEEL = 0.00055;
    const SENSITIVITY_TOUCH = 0.0026;
    let snapTimeoutId: any = null;

    function triggerSnapTimer() {
      if (snapTimeoutId) clearTimeout(snapTimeoutId);
      snapTimeoutId = setTimeout(() => {
        const currentTarget = stateRef.current.targetProgress;
        const snapped = Math.round(currentTarget * 5) / 5;
        setTargetProgress(snapped);
      }, 500); // 500ms of scroll/touch inactivity snaps to nearest station
    }

    function canElementScroll(el: HTMLElement, deltaY: number, deltaX: number): boolean {
      if (el.tagName === "TEXTAREA" || el.tagName === "INPUT" || el.tagName === "SELECT") {
        return true;
      }
      const style = window.getComputedStyle(el);
      if (Math.abs(deltaY) > 0) {
        const overflowY = style.overflowY;
        const isScrollableY = overflowY === "auto" || overflowY === "scroll" || el.classList.contains("overflow-y-auto") || el.classList.contains("overflow-y-scroll") || el.classList.contains("hud-scroll");
        const hasScrollableContentY = el.scrollHeight > el.clientHeight;
        if (isScrollableY && hasScrollableContentY) {
          return true;
        }
      }
      if (Math.abs(deltaX) > 0) {
        const overflowX = style.overflowX;
        const isScrollableX = overflowX === "auto" || overflowX === "scroll" || el.classList.contains("overflow-x-auto") || el.classList.contains("overflow-x-scroll");
        const hasScrollableContentX = el.scrollWidth > el.clientWidth;
        if (isScrollableX && hasScrollableContentX) {
          return true;
        }
      }
      return false;
    }

    function shouldScrollContent(target: EventTarget | null, deltaY: number, deltaX: number): boolean {
      if (!target || !(target instanceof HTMLElement)) return false;
      let current: HTMLElement | null = target;
      while (current && current !== document.body) {
        if (current.classList.contains("z-50") || current.tagName === "NAV") {
          return true;
        }
        if (canElementScroll(current, deltaY, deltaX)) {
          return true;
        }
        current = current.parentElement;
      }
      return false;
    }

    function handleWheel(e: WheelEvent) {
      if (shouldScrollContent(e.target, e.deltaY, e.deltaX)) {
        return;
      }
      e.preventDefault();
      const next = Math.max(0, Math.min(1, stateRef.current.targetProgress + e.deltaY * SENSITIVITY_WHEEL));
      setTargetProgress(next);
      triggerSnapTimer();
    }

    function handleTouchStart(e: TouchEvent) {
      if (snapTimeoutId) clearTimeout(snapTimeoutId);
      stateRef.current.touchY = e.touches[0].clientY;
    }

    function handleTouchMove(e: TouchEvent) {
      const y = e.touches[0].clientY;
      const dy = stateRef.current.touchY - y;
      stateRef.current.touchY = y;

      if (shouldScrollContent(e.target, dy, 0)) {
        return;
      }
      e.preventDefault();
      const next = Math.max(0, Math.min(1, stateRef.current.targetProgress + dy * SENSITIVITY_TOUCH));
      setTargetProgress(next);
    }

    function handleTouchEnd() {
      triggerSnapTimer();
    }

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    // Bind event listeners globally to the window
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("resize", handleResize);

    // Initial render call
    lastTime = performance.now();
    renderLoop();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (snapTimeoutId) clearTimeout(snapTimeoutId);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);

      // Clean memory
      scene.clear();
      floorMat.dispose();
      wallMat.dispose();
      topMat.dispose();
      dustMat.dispose();
      floorTex.dispose();
      renderer.dispose();
    };
  }, [onProgressChange, setTargetProgress, reduceMotion]);

  return (
    <canvas
      id="webgl"
      ref={mountRef}
      className="fixed inset-0 z-0 block outline-none"
      aria-hidden="true"
    />
  );
}
