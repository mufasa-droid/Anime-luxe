"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface EnergyAuraProps {
  /** Overall intensity multiplier for the aura (default: 0.8) */
  intensity?: number;
  /** Scale multiplier for the aura bounds (default: 1.0) */
  scale?: number;
  /** Primary inner energy color (default: violet #8b5cf6) */
  colorViolet?: string;
  /** Secondary outer energy color (default: cyan #22d3ee) */
  colorCyan?: string;
  /** Number of floating energy motes (default: 32) */
  particleCount?: number;
}

// Custom vertex shader for the breathing Fresnel glow shell
const shellVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vPosition;
  uniform float uTime;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Gentle breathing displacement along surface normals
    float displacement = sin(position.y * 3.5 + uTime * 1.8) * 0.025
                       + cos(position.x * 3.0 + uTime * 1.2) * 0.02;
    vec3 displaced = position + normal * displacement;

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Custom fragment shader for soft, restrained violet-cyan rim glow
const shellFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColorViolet;
  uniform vec3 uColorCyan;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Fresnel rim calculation
    float NdotV = dot(normal, viewDir);
    float fresnel = clamp(1.0 - abs(NdotV), 0.0, 1.0);
    float rim = pow(fresnel, 2.4);

    // Vertical wave pulsation
    float pulse = 0.85 + 0.15 * sin(uTime * 2.2 + vPosition.y * 2.5);

    // Subtle color blend: deeper violet at inner rim, bright cyan at grazing edges
    vec3 auraColor = mix(uColorViolet, uColorCyan, pow(rim, 1.5));

    // Restrained alpha to keep crystal as the primary visual focus
    float alpha = rim * 0.32 * uIntensity * pulse;

    gl_FragColor = vec4(auraColor, alpha);
  }
`;

// Particle vertex shader for floating energy motes
const particleVertexShader = `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  varying float vPhase;
  varying float vSpeed;
  uniform float uTime;

  void main() {
    vPhase = aPhase;
    vSpeed = aSpeed;

    vec3 pos = position;
    // Gentle orbital drifting and floating oscillation
    float angle = uTime * 0.25 * aSpeed + aPhase;
    float radiusOffset = sin(uTime * aSpeed + aPhase) * 0.08;
    
    // Rotate in XZ with height oscillation
    float cosA = cos(angle);
    float sinA = sin(angle);
    float newX = pos.x * cosA - pos.z * sinA;
    float newZ = pos.x * sinA + pos.z * cosA;
    float newY = pos.y + sin(uTime * 1.5 * aSpeed + aPhase) * 0.12;

    vec3 animatedPos = vec3(newX + radiusOffset * cosA, newY, newZ + radiusOffset * sinA);

    vec4 mvPosition = modelViewMatrix * vec4(animatedPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Attenuate point size by distance to camera
    float pulseSize = aSize * (0.8 + 0.3 * sin(uTime * 2.0 * aSpeed + aPhase));
    gl_PointSize = pulseSize * (150.0 / -mvPosition.z);
  }
`;

// Particle fragment shader for soft circular energy motes with radial falloff
const particleFragmentShader = `
  varying float vPhase;
  varying float vSpeed;
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3 uColorViolet;
  uniform vec3 uColorCyan;

  void main() {
    vec2 centerCoord = gl_PointCoord - vec2(0.5);
    float dist = length(centerCoord);
    if (dist > 0.5) discard;

    // Soft Gaussian-like radial falloff
    float falloff = smoothstep(0.5, 0.0, dist);
    falloff = pow(falloff, 1.8);

    // Color gradient over time per particle
    float t = sin(uTime * vSpeed + vPhase) * 0.5 + 0.5;
    vec3 moteColor = mix(uColorViolet, uColorCyan, t);

    float alpha = falloff * 0.55 * uIntensity;
    gl_FragColor = vec4(moteColor, alpha);
  }
`;

// Pure deterministic pseudo-random generator
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

// Pure helper function to create deterministic particle buffer geometry
function createParticleGeometry(count: number): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);

  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
  for (let i = 0; i < count; i++) {
    const yNorm = 1 - (count > 1 ? (i / (count - 1)) * 2 : 0); // -1 to 1
    const radiusAtY = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
    const theta = (2 * Math.PI * i) / phi;

    const rOffset = 0.85 + pseudoRandom(i * 5 + 1) * 0.55;
    positions[i * 3] = Math.cos(theta) * radiusAtY * rOffset;
    positions[i * 3 + 1] = yNorm * 1.35 * rOffset; // elongated along crystal height
    positions[i * 3 + 2] = Math.sin(theta) * radiusAtY * rOffset;

    sizes[i] = 0.08 + pseudoRandom(i * 5 + 2) * 0.12;
    phases[i] = pseudoRandom(i * 5 + 3) * Math.PI * 2;
    speeds[i] = 0.5 + pseudoRandom(i * 5 + 4) * 0.8;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
  geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
  return geo;
}

/**
 * Procedural Energy Aura component.
 * Creates a restrained, premium violet/cyan ambient energy field around the FloatingCrystal.
 * Features:
 *  1. Animated Fresnel energy shell with subtle normal displacement.
 *  2. Procedural orbiting energy motes / sparks.
 *  3. Dual faint orbital flux rings.
 */
export function EnergyAura({
  intensity = 0.8,
  scale = 1.0,
  colorViolet = "#8b5cf6",
  colorCyan = "#22d3ee",
  particleCount = 32,
}: EnergyAuraProps) {
  const shellMatRef = useRef<THREE.ShaderMaterial>(null);
  const particleMatRef = useRef<THREE.ShaderMaterial>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  // Parse 3D color uniforms
  const cViolet = useMemo(() => new THREE.Color(colorViolet), [colorViolet]);
  const cCyan = useMemo(() => new THREE.Color(colorCyan), [colorCyan]);

  // Shell Shader Uniforms
  const shellUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: intensity },
      uColorViolet: { value: cViolet },
      uColorCyan: { value: cCyan },
    }),
    [cViolet, cCyan, intensity]
  );

  // Particle Shader Uniforms
  const particleUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: intensity },
      uColorViolet: { value: cViolet },
      uColorCyan: { value: cCyan },
    }),
    [cViolet, cCyan, intensity]
  );

  // Generate procedural energy motes buffer geometry
  const particleGeometry = useMemo(
    () => createParticleGeometry(particleCount),
    [particleCount]
  );

  // Real-time animation loop (no React state updates)
  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;

    // 1. Update shader uniforms safely with strict null checks
    if (shellMatRef.current?.uniforms) {
      if (shellMatRef.current.uniforms.uTime) {
        shellMatRef.current.uniforms.uTime.value = elapsed;
      }
      if (shellMatRef.current.uniforms.uIntensity) {
        shellMatRef.current.uniforms.uIntensity.value = intensity;
      }
    }

    if (particleMatRef.current?.uniforms) {
      if (particleMatRef.current.uniforms.uTime) {
        particleMatRef.current.uniforms.uTime.value = elapsed;
      }
      if (particleMatRef.current.uniforms.uIntensity) {
        particleMatRef.current.uniforms.uIntensity.value = intensity;
      }
    }

    // 2. Animate subtle orbital rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.4;
      ring1Ref.current.rotation.x = Math.sin(elapsed * 0.8) * 0.2 + 0.4;
      const ringMat = ring1Ref.current.material as THREE.MeshBasicMaterial;
      if (ringMat) {
        ringMat.opacity = (0.15 + 0.08 * Math.sin(elapsed * 2.0)) * intensity;
      }
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.3;
      ring2Ref.current.rotation.y = Math.cos(elapsed * 0.7) * 0.2 - 0.3;
      const ringMat = ring2Ref.current.material as THREE.MeshBasicMaterial;
      if (ringMat) {
        ringMat.opacity = (0.12 + 0.06 * Math.cos(elapsed * 2.2)) * intensity;
      }
    }
  });

  return (
    <group scale={scale}>
      {/* 1. Outer Fresnel Energy Glow Shell */}
      <mesh>
        <sphereGeometry args={[1.05, 32, 32]} />
        <shaderMaterial
          ref={shellMatRef}
          vertexShader={shellVertexShader}
          fragmentShader={shellFragmentShader}
          uniforms={shellUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Floating Energy Motes / Sparks */}
      <points geometry={particleGeometry}>
        <shaderMaterial
          ref={particleMatRef}
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
          uniforms={particleUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* 3. Delicate Orbital Flux Ring 1 (Cyan-biased) */}
      <mesh ref={ring1Ref} rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[0.95, 0.008, 16, 64]} />
        <meshBasicMaterial
          color={colorCyan}
          transparent
          opacity={0.15 * intensity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Delicate Orbital Flux Ring 2 (Violet-biased) */}
      <mesh ref={ring2Ref} rotation={[-0.3, -0.4, 0.5]}>
        <torusGeometry args={[1.12, 0.006, 16, 64]} />
        <meshBasicMaterial
          color={colorViolet}
          transparent
          opacity={0.12 * intensity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default EnergyAura;
