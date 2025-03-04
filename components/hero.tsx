"use client"

import { useRef, useState, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Text, useHelper } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { ArrowDown, ChevronRight } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import * as THREE from "three"
import { useTheme } from "next-themes"

function Model() {
  const particlesRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const surfaceRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"
  const { scene } = useThree()

  // Configuration
  const COUNT = 6000
  const RADIUS = 3.5

  // Animation values - use refs to avoid re-renders
  const noiseFactorRef = useRef(0.2)
  const smoothnessPhaseRef = useRef(0)

  // Generate particles
  const { positions, colors, sizes, original } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const sizes = new Float32Array(COUNT)
    const original = []

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3

      // Fibonacci sphere for even distribution
      const phi = Math.acos(1 - 2 * (i + 0.5) / COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)

      // Add some variation
      const radius = RADIUS * (0.6 + Math.random() * 0.4)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      // Store original positions
      original.push({ x, y, z, phase: Math.random() * Math.PI * 2 })

      // Initial positions
      positions[i3] = x
      positions[i3 + 1] = y
      positions[i3 + 2] = z

      // Generate particle colors with more contrast - use purples to match theme
      if (isDarkMode) {
        // Dark mode theme - purples and whites
        if (Math.random() > 0.7) {
          // Accent particles - vibrant purple
          colors[i3] = 0.8     // Red
          colors[i3 + 1] = 0.2 // Green
          colors[i3 + 2] = 1.0 // Blue
        } else if (Math.random() > 0.6) {
          // Highlight particles - bright white/blue
          const brightness = 0.8 + Math.random() * 0.2
          colors[i3] = brightness - 0.1 // Red
          colors[i3 + 1] = brightness    // Green
          colors[i3 + 2] = 1.0           // Blue
        } else if (Math.random() > 0.3) {
          // Mid-tone particles - medium purple
          colors[i3] = 0.5     // Red
          colors[i3 + 1] = 0.2 // Green
          colors[i3 + 2] = 0.8 // Blue
        } else {
          // Shadow particles - dark purple
          colors[i3] = 0.2    // Red
          colors[i3 + 1] = 0.1 // Green
          colors[i3 + 2] = 0.4 // Blue
        }
      } else {
        // Light mode theme - purples to match the rest of the app
        if (Math.random() > 0.7) {
          // Accent particles - vivid purple (matches the primary color)
          colors[i3] = 0.6     // Red
          colors[i3 + 1] = 0.1 // Green
          colors[i3 + 2] = 0.9 // Blue
        } else if (Math.random() > 0.6) {
          // Highlight particles - bright purple
          colors[i3] = 0.7     // Red
          colors[i3 + 1] = 0.3 // Green
          colors[i3 + 2] = 0.9 // Blue
        } else if (Math.random() > 0.3) {
          // Mid-tone particles - medium purple
          colors[i3] = 0.5     // Red
          colors[i3 + 1] = 0.2 // Green
          colors[i3 + 2] = 0.7 // Blue
        } else {
          // Shadow particles - light purple/gray
          colors[i3] = 0.4     // Red
          colors[i3 + 1] = 0.3 // Green
          colors[i3 + 2] = 0.5 // Blue
        }
      }

      // Size - vary by distance and position
      const dist = Math.sqrt(x * x + y * y + z * z) / RADIUS
      const angle = Math.atan2(y, x)
      const sizeFactor = 0.05 + Math.cos(angle * 3) * 0.02 + Math.sin(phi * 4) * 0.02
      sizes[i] = sizeFactor * (1 - dist * 0.5)
    }

    return { positions, colors, sizes, original }
  }, [isDarkMode])

  // Create geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return geo
  }, [positions, colors, sizes])

  // Create sphere geometry with original positions for reference
  const sphereGeometryRef = useRef<THREE.SphereGeometry | null>(null);
  const originalSphereVertices = useRef<Float32Array | null>(null);

  // Create refs for 4 point lights that will orbit the sphere
  const orbitalLights = useRef<THREE.PointLight[]>([]);

  // Initialize lights on first render
  useEffect(() => {
    // Create orbital lights for consistent illumination from all angles
    if (orbitalLights.current.length === 0) {
      for (let i = 0; i < 4; i++) {
        const light = new THREE.PointLight(
          i % 2 === 0 ? "#ffffff" : "#9d4edd",
          0.5,
          15
        );
        light.position.set(
          Math.sin(i * Math.PI / 2) * 8,
          Math.cos(i * Math.PI / 2) * 8,
          (i % 2 === 0 ? 1 : -1) * 5
        );
        orbitalLights.current.push(light);
        scene.add(light);
      }
    }

    return () => {
      // Cleanup lights when component unmounts
      orbitalLights.current.forEach(light => {
        if (light && scene) scene.remove(light);
      });
      orbitalLights.current = [];
    };
  }, [scene]);

  // Store original sphere vertices on first render
  const initializeSphere = () => {
    if (!surfaceRef.current || !sphereGeometryRef.current || originalSphereVertices.current) return;

    // Store original vertices
    const positions = sphereGeometryRef.current.attributes.position.array;
    originalSphereVertices.current = new Float32Array(positions.length);
    for (let i = 0; i < positions.length; i++) {
      originalSphereVertices.current[i] = positions[i];
    }
  };

  // Animation
  useFrame(({ clock }) => {
    if (!particlesRef.current || !linesRef.current) return;

    // Initialize sphere if needed
    initializeSphere();

    const time = clock.getElapsedTime();

    // Update orbital lights
    orbitalLights.current.forEach((light, i) => {
      const speed = 0.2 + (i * 0.05);
      const radius = 8;
      const offset = i * Math.PI / 2;

      light.position.x = Math.sin(time * speed + offset) * radius;
      light.position.z = Math.cos(time * speed + offset) * radius * 0.8;
      light.position.y = Math.sin(time * speed * 0.5 + offset) * radius * 0.5;
    });

    // Control the smoothness cycle (every ~10 seconds we move from chunky to smooth and back)
    smoothnessPhaseRef.current = (time * 0.1) % (Math.PI * 2);

    // Oscillate between chunky (0.4-0.5) and smooth (0.05-0.1)
    // Using a sharper transition curve for more distinct states
    const transitionCurve = Math.pow(Math.sin(smoothnessPhaseRef.current), 2);
    const currentNoiseFactor = 0.05 + transitionCurve * 0.45;
    noiseFactorRef.current = currentNoiseFactor;

    // Only change time scale slightly - we want the smoothness to be the main effect
    const timeScale = 0.3 + Math.sin(time * 0.05) * 0.1;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const sizes = particlesRef.current.geometry.attributes.size?.array as Float32Array;

    // Update surface distortion if it exists and we have original vertices
    if (surfaceRef.current &&
      surfaceRef.current.geometry instanceof THREE.SphereGeometry &&
      originalSphereVertices.current) {

      const surfacePositions = surfaceRef.current.geometry.attributes.position;
      const originalPositions = originalSphereVertices.current;

      // Much more controlled noise application
      for (let i = 0; i < surfacePositions.count; i++) {
        const i3 = i * 3;

        // Get original position
        const origX = originalPositions[i3];
        const origY = originalPositions[i3 + 1];
        const origZ = originalPositions[i3 + 2];

        // Calculate normalized direction (for consistent noise application)
        const length = Math.sqrt(origX * origX + origY * origY + origZ * origZ);
        const normX = origX / length;
        const normY = origY / length;
        const normZ = origZ / length;

        // Calculate orientation-independent noise value
        // Using spherical coordinates for consistency from all angles
        const theta = Math.atan2(normY, normX);
        const phi = Math.acos(normZ);

        // Calculate noise based on spherical coordinates
        const noiseFreq = 2 + currentNoiseFactor * 3;
        const noiseScale = Math.min(0.15, currentNoiseFactor * 0.15);

        // Multiple noise frequencies for more interesting patterns
        const noise1 = Math.sin(theta * noiseFreq + phi * noiseFreq * 0.5 + time * 0.5);
        const noise2 = Math.cos(phi * noiseFreq + theta * noiseFreq * 0.7 + time * 0.4);
        const noise3 = Math.sin((theta + phi) * noiseFreq * 0.5 + time * 0.3);

        // Combine noise values with different weights
        const noiseVal = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);

        // Apply noise only in the normal direction (preserves spherical shape)
        const displacement = noiseVal * noiseScale * RADIUS;

        // Update position with controlled displacement along normal
        surfacePositions.setXYZ(
          i,
          origX + normX * displacement,
          origY + normY * displacement,
          origZ + normZ * displacement
        );
      }

      surfacePositions.needsUpdate = true;
      surfaceRef.current.geometry.computeVertexNormals();
    }

    // Update particles
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      const data = original[i]

      // Create more chunky or smooth effect based on noise factor
      // For chunky: use higher frequency noise with larger amplitude
      // For smooth: use lower frequency noise with smaller amplitude
      const frequency = 0.5 + currentNoiseFactor;

      positions[i3] = data.x + (
        Math.sin(time * timeScale + data.phase) * currentNoiseFactor +
        Math.sin(time * frequency + data.phase * 3.7) * currentNoiseFactor * 0.3
      );

      positions[i3 + 1] = data.y + (
        Math.cos(time * timeScale + data.phase * 1.3) * currentNoiseFactor +
        Math.cos(time * frequency + data.phase * 2.9) * currentNoiseFactor * 0.3
      );

      positions[i3 + 2] = data.z + (
        Math.sin(time * timeScale + data.phase * 2.1) * currentNoiseFactor +
        Math.sin(time * frequency + data.phase * 4.3) * currentNoiseFactor * 0.3
      );

      // Also vary the particle size based on noise factor for more dynamic effect
      if (sizes) {
        const baseSizeMultiplier = 1.0 + Math.sin(time * 0.2 + data.phase) * 0.2;
        sizes[i] *= 0.99; // Slightly reduce size
        sizes[i] = Math.max(sizes[i], (0.04 + Math.random() * 0.02) * baseSizeMultiplier * (1 + currentNoiseFactor * 0.5));
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    if (sizes) {
      particlesRef.current.geometry.attributes.size.needsUpdate = true;
    }

    // Create connections
    const connections: number[] = [];

    // Connection strategy - more connections when chunky, fewer when smooth
    // When chunky: larger threshold, more connections
    // When smooth: smaller threshold, fewer connections
    const connectionThreshold = 0.4 + currentNoiseFactor * 0.8;
    const connectionCount = Math.floor(500 + currentNoiseFactor * 1500);

    for (let i = 0; i < connectionCount; i++) {
      const idx1 = Math.floor(Math.random() * COUNT)
      const idx2 = Math.floor(Math.random() * COUNT)

      if (idx1 !== idx2) {
        const idx1_3 = idx1 * 3
        const idx2_3 = idx2 * 3

        const dx = positions[idx1_3] - positions[idx2_3]
        const dy = positions[idx1_3 + 1] - positions[idx2_3 + 1]
        const dz = positions[idx1_3 + 2] - positions[idx2_3 + 2]
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (distance < connectionThreshold) {
          connections.push(
            positions[idx1_3], positions[idx1_3 + 1], positions[idx1_3 + 2],
            positions[idx2_3], positions[idx2_3 + 1], positions[idx2_3 + 2]
          )
        }
      }
    }

    // Update lines
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connections, 3))

    linesRef.current.geometry.dispose()
    linesRef.current.geometry = lineGeometry
  })

  // Theme-appropriate colors - purple-based to match app theme
  const glowColor = isDarkMode ? "#7c3aed" : "#9d4edd"   // Purple glow
  const lineColor = isDarkMode ? "#e9d5ff" : "#7c3aed"   // Light purple in dark mode, darker in light
  const surfaceColor = isDarkMode ? "#7c3aed" : "#9d4edd" // Match primary purple

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Surface mesh that responds to lighting */}
      <mesh ref={surfaceRef} castShadow receiveShadow>
        <sphereGeometry
          ref={sphereGeometryRef}
          args={[RADIUS * 0.95, 64, 64]}
        />
        <meshPhysicalMaterial
          color={surfaceColor}
          transparent={true}
          opacity={0.12}
          roughness={0.5}
          metalness={0.4}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
          emissive={surfaceColor}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Ambient glow */}
      <mesh>
        <sphereGeometry args={[RADIUS * 1.1, 32, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Particles */}
      <points ref={particlesRef} geometry={geometry}>
        <pointsMaterial
          vertexColors
          sizeAttenuation
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          alphaTest={0.01}
        />
      </points>

      {/* Connections */}
      <lineSegments ref={linesRef}>
        <lineBasicMaterial
          color={lineColor}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {hovered && (
        <mesh position={[0, -2, 0]}>
          <Text fontSize={0.2} color={isDarkMode ? "#ffffff" : "#7c3aed"}>
            Interactive Portfolio
          </Text>
          <meshBasicMaterial color={isDarkMode ? "#ffffff" : "#7c3aed"} />
        </mesh>
      )}
    </group>
  )
}

export default function Hero() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0" suppressHydrationWarning>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 60 }} shadows>
          {/* Ambient light for base illumination */}
          <ambientLight intensity={0.2} />

          {/* Main key light */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.0}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />

          {/* Fill light */}
          <directionalLight
            position={[-5, -3, -5]}
            intensity={0.5}
            color="#9d4edd"
          />

          {/* Center light for core illumination */}
          <pointLight
            position={[0, 0, 3]}
            intensity={0.5}
            color="#ffffff"
            distance={10}
          />

          <Model />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
          />
        </Canvas>
      </div>

      <motion.div
        className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto backdrop-blur-sm py-8 rounded-xl bg-background/30"
        style={{ opacity, scale }}
      >
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Zachary Rizzo
        </motion.h1>
        <motion.h2
          className="text-xl md:text-3xl font-medium text-foreground mb-6"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Full Stack Software Engineer
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-muted-foreground"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Building innovative AI-powered applications with 6+ years of experience in full-stack development
        </motion.p>
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="rounded-full px-8 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90"
          >
            <Link href="#projects" className="flex items-center">
              View My Work
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 border-primary text-primary hover:bg-primary/10"
          >
            <Link href="#contact" className="flex items-center">
              Contact Me <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <Button variant="ghost" size="icon" aria-label="Scroll down" className="bg-background/30 backdrop-blur-sm hover:bg-background/50">
          <ArrowDown className="h-6 w-6" />
        </Button>
      </div>
    </section>
  )
}

