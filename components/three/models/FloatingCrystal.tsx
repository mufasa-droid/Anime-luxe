"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

import { EnergyAura } from "../effects/EnergyAura";

export interface FloatingCrystalProps {
  scale?: number;
  position?: [number, number, number];
  auraIntensity?: number;
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
  auraIntensity = 0.8,
}: FloatingCrystalProps) {
  const { scene } = useGLTF(MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null);
  const dynamicIntensityRef = useRef<number>(auraIntensity);
  const tempWorldPos = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // 1. Subtle continuous idle rotation
    groupRef.current.rotation.x += delta * 0.25;
    groupRef.current.rotation.y += delta * 0.35;

    // 2. Smooth vertical floating levitation (sine wave on elapsed time)
    const floatingY = Math.sin(state.clock.elapsedTime * 1.5) * 0.12;

    // 3. Subtle mouse reaction using normalized pointer coords (-1 to 1) combined with float & base position
    const targetX = position[0] + state.pointer.x * 0.3;
    const targetY = position[1] + floatingY + state.pointer.y * 0.3;

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

    // 4. Calculate pointer proximity to crystal in projected screen space (NDC: -1 to 1)
    groupRef.current.getWorldPosition(tempWorldPos.current);
    tempWorldPos.current.project(state.camera);

    const dx = state.pointer.x - tempWorldPos.current.x;
    const dy = state.pointer.y - tempWorldPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Proximity factor: 1.0 when pointer is right over crystal, 0.0 when distance >= maxProximityRadius
    const maxProximityRadius = 0.95;
    const rawProximity = THREE.MathUtils.clamp(
      1.0 - distance / maxProximityRadius,
      0.0,
      1.0
    );

    // Smoothstep curve for natural organic falloff (no harsh threshold jumps)
    const smoothProximity = rawProximity * rawProximity * (3.0 - 2.0 * rawProximity);

    // Target intensity: modest +40% boost at closest proximity, returning to base auraIntensity when far
    const targetIntensity = auraIntensity * (1.0 + smoothProximity * 0.4);

    // Smooth interpolation to avoid abrupt visual changes
    dynamicIntensityRef.current = THREE.MathUtils.lerp(
      dynamicIntensityRef.current,
      targetIntensity,
      0.08
    );
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <Center>
        <primitive object={scene} />
      </Center>
      <EnergyAura
        intensity={auraIntensity}
        dynamicIntensityRef={dynamicIntensityRef}
      />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

export default FloatingCrystal;
