// SAARTHI — AR 3D Model WebGL Canvas
// Renders the provided GLB 3D monument with high-fidelity lighting, soft ground shadow,
// 1-finger rotation, pinch-to-scale, and 2-finger planar repositioning

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from 'react';
import { StyleSheet, View, Text, Platform, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { ARModelConfig } from '../../types/ar';

export interface ARModelViewerRef {
  recenter: () => void;
  adjustScale: (delta: number) => void;
  resetScale: () => void;
  getScalePercent: () => number;
}

interface ARModelViewerProps {
  modelConfig: ARModelConfig;
  isARMode: boolean; // true = transparent background over camera, false = 3D studio background
  isPlaced: boolean;
  onModelLoaded?: () => void;
  onError?: (errMessage: string) => void;
  onScaleChange?: (scalePercent: number) => void;
}

export const ARModelViewer = forwardRef<ARModelViewerRef, ARModelViewerProps>(
  ({ modelConfig, isARMode, isPlaced, onModelLoaded, onError, onScaleChange }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const modelGroupRef = useRef<THREE.Group | null>(null);
    const shadowMeshRef = useRef<THREE.Mesh | null>(null);
    const animFrameRef = useRef<number | null>(null);

    // Transform tracking refs for 60fps gesture responsiveness
    const currentScaleMultiplier = useRef(1.0);
    const baseScale = useRef(modelConfig.initialScale || 0.22);
    // Orient India Gate's grand front arch directly toward the viewer (90 deg)
    const modelRotationY = useRef(Math.PI / 2);
    const modelRotationX = useRef(0);
    const modelPosition = useRef({ x: 0, y: 0, z: 0 });

    // Gesture interaction tracking
    const isDragging = useRef(false);
    const lastTouchPos = useRef({ x: 0, y: 0 });
    const initialPinchDistance = useRef<number | null>(null);
    const initialPinchScale = useRef(1.0);

    const [isLoadingModel, setIsLoadingModel] = useState(true);

    // Sync scale percentage back to parent UI
    const reportScale = useCallback(() => {
      const percent = Math.round(currentScaleMultiplier.current * 100);
      onScaleChange?.(percent);
    }, [onScaleChange]);

    // Imperative control handlers
    useImperativeHandle(ref, () => ({
      recenter: () => {
        modelPosition.current = { x: 0, y: 0, z: 0 };
        modelRotationY.current = Math.PI / 2;
        modelRotationX.current = 0;
        currentScaleMultiplier.current = 1.0;
        if (modelGroupRef.current) {
          modelGroupRef.current.position.set(0, 0, 0);
          modelGroupRef.current.rotation.set(0, Math.PI / 2, 0);
          const s = baseScale.current;
          modelGroupRef.current.scale.set(s, s, s);
        }
        reportScale();
      },
      adjustScale: (delta: number) => {
        const next = Math.max(0.2, Math.min(3.0, currentScaleMultiplier.current + delta));
        currentScaleMultiplier.current = next;
        if (modelGroupRef.current) {
          const s = baseScale.current * next;
          modelGroupRef.current.scale.set(s, s, s);
        }
        reportScale();
      },
      resetScale: () => {
        currentScaleMultiplier.current = 1.0;
        if (modelGroupRef.current) {
          const s = baseScale.current;
          modelGroupRef.current.scale.set(s, s, s);
        }
        reportScale();
      },
      getScalePercent: () => Math.round(currentScaleMultiplier.current * 100),
    }));

    // WebGL Initialization & Scene Setup
    useEffect(() => {
      if (Platform.OS !== 'web' || !containerRef.current) return;

      const container = containerRef.current;
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      // 1. Scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // In 3D Studio mode, use subtle dark ambient environment; in AR Mode, fully transparent
      if (!isARMode) {
        scene.background = new THREE.Color(0x0f172a); // Slate 900
      } else {
        scene.background = null;
      }

      // 2. Camera
      const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
      // Perspective positioned to view monument grounded on surface
      camera.position.set(0, 1.4, 3.2);
      camera.lookAt(0, 0.6, 0);
      cameraRef.current = camera;

      // 3. Renderer with Alpha support for AR Camera overlay
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;

      // Transparent clear color so live camera feed shines through completely
      renderer.setClearColor(0x000000, isARMode ? 0 : 1);
      renderer.domElement.style.backgroundColor = 'transparent';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';

      container.innerHTML = '';
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // 4. Lighting Rig tailored for Architectural Sandstone
      const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.4); // Warm light
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xffedd5, 2.0);
      sunLight.position.set(4, 7, 5);
      sunLight.castShadow = true;
      scene.add(sunLight);

      const frontLight = new THREE.DirectionalLight(0xffffff, 1.2);
      frontLight.position.set(0, 3, 5);
      scene.add(frontLight);

      const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.7);
      fillLight.position.set(-4, 3, -2);
      scene.add(fillLight);

      const groundLight = new THREE.HemisphereLight(0xffffff, 0x475569, 0.6);
      scene.add(groundLight);

      // 5. Soft Ground Shadow Plane (anchors model visually to surface)
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 128;
      shadowCanvas.height = 128;
      const ctx = shadowCanvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
        grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.18)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
      }
      const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
      });
      const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = 0.002; // Just above ground
      scene.add(shadowMesh);
      shadowMeshRef.current = shadowMesh;

      // 6. Master Model Group
      const modelGroup = new THREE.Group();
      scene.add(modelGroup);
      modelGroupRef.current = modelGroup;

      // 7. Load GLB Model
      setIsLoadingModel(true);
      const loader = new GLTFLoader();
      const rawUrl = modelConfig.modelUrl;
      const glbUrl =
        typeof window !== 'undefined' && !rawUrl.startsWith('http')
          ? `${window.location.origin}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`
          : rawUrl;

      loader.load(
        glbUrl,
        (gltf: any) => {
          const loadedScene = gltf.scene;

          // Compute exact bounding box
          const box = new THREE.Box3().setFromObject(loadedScene);
          const size = new THREE.Vector3();
          box.getSize(size);
          const center = new THREE.Vector3();
          box.getCenter(center);

          // Center geometry: align horizontal center to 0,0, and base bottom flush to y=0
          loadedScene.position.x = -center.x;
          loadedScene.position.z = -center.z;
          loadedScene.position.y = -box.min.y;

          // Enable shadow casting and double-sided rendering on all meshes
          loadedScene.traverse((child: any) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              if (mesh.material) {
                const mat = mesh.material as THREE.MeshStandardMaterial;
                mat.side = THREE.DoubleSide;
                mat.roughness = 0.65;
                mat.metalness = 0.05;
                mat.needsUpdate = true;
              }
            }
          });

          // Normalize overall scale: determine scale factor so monument height is ~1.6 units
          const maxDim = Math.max(size.x, size.y, size.z);
          const targetHeight = 1.6;
          const calculatedBaseScale = maxDim > 0 ? targetHeight / maxDim : 0.22;
          baseScale.current = calculatedBaseScale;

          const s = calculatedBaseScale * currentScaleMultiplier.current;
          modelGroup.scale.set(s, s, s);
          modelGroup.add(loadedScene);

          // Synchronize visibility with surface placement
          const isVisible = !isARMode || isPlaced;
          modelGroup.visible = isVisible;
          if (shadowMeshRef.current) {
            shadowMeshRef.current.visible = isVisible;
          }

          setIsLoadingModel(false);
          onModelLoaded?.();
        },
        undefined,
        (err: any) => {
          console.error('[ARModelViewer] GLB loading failed:', err);
          setIsLoadingModel(false);
          onError?.("We couldn't load the India Gate 3D model. Please try again.");
        }
      );

      // 8. Animation & Render Loop
      const animate = () => {
        animFrameRef.current = requestAnimationFrame(animate);

        if (modelGroupRef.current) {
          modelGroupRef.current.position.set(
            modelPosition.current.x,
            modelPosition.current.y,
            modelPosition.current.z
          );
          modelGroupRef.current.rotation.y = modelRotationY.current;
          modelGroupRef.current.rotation.x = modelRotationX.current;

          // In 3D Studio mode, if user isn't interacting, apply gentle idle rotation
          if (!isARMode && !isDragging.current) {
            modelRotationY.current += 0.003;
          }

          // Keep shadow under model
          if (shadowMeshRef.current) {
            shadowMeshRef.current.position.x = modelPosition.current.x;
            shadowMeshRef.current.position.z = modelPosition.current.z;
            const currentScale = baseScale.current * currentScaleMultiplier.current;
            shadowMeshRef.current.scale.set(currentScale * 5, currentScale * 5, 1);
          }
        }

        renderer.render(scene, camera);
      };

      animate();

      // 9. Resize Observer
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    }, [modelConfig.modelUrl]);

    // Update scene background and clear color when isARMode changes
    useEffect(() => {
      if (!sceneRef.current || !rendererRef.current) return;
      if (!isARMode) {
        sceneRef.current.background = new THREE.Color(0x0f172a);
        rendererRef.current.setClearColor(0x0f172a, 1);
      } else {
        sceneRef.current.background = null;
        rendererRef.current.setClearColor(0x000000, 0);
      }
    }, [isARMode]);

    // Control model and shadow visibility based on surface placement
    useEffect(() => {
      const isVisible = !isARMode || isPlaced;
      if (modelGroupRef.current) {
        modelGroupRef.current.visible = isVisible;
      }
      if (shadowMeshRef.current) {
        shadowMeshRef.current.visible = isVisible;
      }
    }, [isARMode, isPlaced]);

    // Touch & Mouse Gesture Handlers for Web
    useEffect(() => {
      if (Platform.OS !== 'web' || !containerRef.current) return;
      const dom = containerRef.current;

      const handlePointerDown = (e: PointerEvent) => {
        isDragging.current = true;
        lastTouchPos.current = { x: e.clientX, y: e.clientY };
      };

      const handlePointerMove = (e: PointerEvent) => {
        if (!isDragging.current) return;
        const deltaX = e.clientX - lastTouchPos.current.x;
        const deltaY = e.clientY - lastTouchPos.current.y;
        lastTouchPos.current = { x: e.clientX, y: e.clientY };

        if (e.shiftKey || e.buttons === 2) {
          // Reposition model across surface plane (X-Z)
          modelPosition.current.x += deltaX * 0.005;
          modelPosition.current.z += deltaY * 0.005;
        } else {
          // Rotate model
          modelRotationY.current += deltaX * 0.012;
          modelRotationX.current = Math.max(-0.35, Math.min(0.45, modelRotationX.current + deltaY * 0.005));
        }
      };

      const handlePointerUp = () => {
        isDragging.current = false;
      };

      // Mouse Wheel for Scaling
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.08 : -0.08;
        const next = Math.max(0.2, Math.min(3.0, currentScaleMultiplier.current + delta));
        currentScaleMultiplier.current = next;
        if (modelGroupRef.current) {
          const s = baseScale.current * next;
          modelGroupRef.current.scale.set(s, s, s);
        }
        reportScale();
      };

      // Mobile Multi-touch pinch-to-scale and two-finger move
      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length === 2) {
          const t1 = e.touches[0];
          const t2 = e.touches[1];
          const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
          initialPinchDistance.current = dist;
          initialPinchScale.current = currentScaleMultiplier.current;
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 2 && initialPinchDistance.current !== null) {
          const t1 = e.touches[0];
          const t2 = e.touches[1];
          const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
          const scaleFactor = dist / initialPinchDistance.current;
          const next = Math.max(0.2, Math.min(3.0, initialPinchScale.current * scaleFactor));
          currentScaleMultiplier.current = next;
          if (modelGroupRef.current) {
            const s = baseScale.current * next;
            modelGroupRef.current.scale.set(s, s, s);
          }
          reportScale();
        }
      };

      const handleTouchEnd = () => {
        initialPinchDistance.current = null;
      };

      dom.addEventListener('pointerdown', handlePointerDown);
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      dom.addEventListener('wheel', handleWheel, { passive: false });
      dom.addEventListener('touchstart', handleTouchStart);
      dom.addEventListener('touchmove', handleTouchMove);
      dom.addEventListener('touchend', handleTouchEnd);

      return () => {
        dom.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        dom.removeEventListener('wheel', handleWheel);
        dom.removeEventListener('touchstart', handleTouchStart);
        dom.removeEventListener('touchmove', handleTouchMove);
        dom.removeEventListener('touchend', handleTouchEnd);
      };
    }, [reportScale]);

    return (
      <View style={styles.container}>
        {/* Native WebGL Container */}
        {Platform.OS === 'web' && (
          <div
            ref={containerRef as any}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              touchAction: 'none',
              cursor: isDragging.current ? 'grabbing' : 'grab',
            }}
          />
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 8,
  },
});
