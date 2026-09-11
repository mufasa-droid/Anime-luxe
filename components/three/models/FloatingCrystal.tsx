"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

export interface FloatingCrystalProps {
  scale?: number;
  position?: [number, number, number];
}

const MODEL_PATH = "/models/crystal/floating-energy-crystal.glb";

/**
 * FloatingCrystal loads and renders the energy crystal GLB model.
 * Directs continuous rotation and smooth pointer tracking via useFrame
 * without triggering React state re-renders.
 */
export function FloatingCrystal({
  scale = 1.25,
  position = [0, 0, 0],
}: FloatingCrystalProps) {
  const { scene } = useGLTF(MODEL_PATH);
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
    <group ref={groupRef} position={position} scale={scale}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

export default FloatingCrystal;
