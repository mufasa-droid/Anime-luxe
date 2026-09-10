"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { FloatingCrystal } from "../models/FloatingCrystal";

/**
 * Self-contained 3D Hero Scene.
 * Encapsulates the R3F Canvas, perspective camera, basic lights, and Floating Crystal GLB model.
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

        {/* 3D Crystal Model Component */}
        <Suspense fallback={null}>
          <FloatingCrystal />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HeroScene;
