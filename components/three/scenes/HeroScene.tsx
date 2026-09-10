"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * GeometricMesh handles continuous slow rotation and smooth mouse tracking.
 * We use useFrame and a ref to manipulate 3D transforms directly on the WebGL thread
 * without triggering React state updates or component re-renders.
 */
function GeometricMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. Subtle continuous idle rotation
    meshRef.current.rotation.x += delta * 0.25;
    meshRef.current.rotation.y += delta * 0.35;

    // 2. Subtle mouse reaction using normalized pointer coords (-1 to 1)
    // Lerping ensures smooth damping instead of rigid jumps
    const targetX = state.pointer.x * 0.3;
    const targetY = state.pointer.y * 0.3;

    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      targetX,
      0.06
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      targetY,
      0.06
    );
  });

  return (
    <mesh ref={meshRef}>
      {/* Simple geometric object: Torus with smooth facets */}
      <torusGeometry args={[1.1, 0.38, 24, 64]} />
      {/* Basic material responding to lighting */}
      <meshStandardMaterial
        color="#8b5cf6"
        roughness={0.3}
        metalness={0.4}
        wireframe={false}
      />
    </mesh>
  );
}

/**
 * Self-contained 3D Hero Scene for Phase 1 experiment.
 * Encapsulates the R3F Canvas, perspective camera, basic lights, and geometric mesh.
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

        {/* 3D Object */}
        <GeometricMesh />
      </Canvas>
    </div>
  );
}

export default HeroScene;
