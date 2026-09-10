"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

/**
 * VoidPrismModel loads the AI_Void_Prism GLB asset and handles
 * continuous slow rotation and smooth mouse tracking on the WebGL thread.
 */
function VoidPrismModel() {
  const gltf = useGLTF("/models/crrystals/AI_Void_Prism.glb");
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. Subtle continuous idle rotation
    groupRef.current.rotation.x += delta * 0.25;
    groupRef.current.rotation.y += delta * 0.35;

    // 2. Subtle mouse reaction using normalized pointer coords (-1 to 1)
    const targetX = state.pointer.x * 0.3;
    const targetY = state.pointer.y * 0.3;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      0.06
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.06
    );
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={gltf.scene} />
      </Center>
    </group>
  );
}

useGLTF.preload("/models/crrystals/AI_Void_Prism.glb");

/**
 * Self-contained 3D Hero Scene.
 * Encapsulates the R3F Canvas, perspective camera, basic lights, and Void Prism GLB model.
 */
export function HeroScene() {
  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        className="h-full w-full"
      >
        {/* Basic lighting setup */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, -4, -2]} intensity={0.4} color="#ec4899" />

        {/* 3D GLB Model */}
        <Suspense fallback={null}>
          <VoidPrismModel />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroScene;
