"use client"

import { useRef, useState, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { ArrowDown, ChevronRight } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import * as THREE from "three"

function Model() {
  const particlesRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const [hovered, setHovered] = useState(false)

  // Configuration
  const COUNT = 6000
  const RADIUS = 3.5

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

      // Colors - mix of white/blue and purple
      if (Math.random() > 0.7) {
        // Purple accent
        colors[i3] = 0.7     // Red
        colors[i3 + 1] = 0.2 // Green
        colors[i3 + 2] = 1.0 // Blue
      } else {
        // White/blue
        const brightness = 0.6 + Math.random() * 0.4
        colors[i3] = brightness - 0.1 // Red
        colors[i3 + 1] = brightness    // Green
        colors[i3 + 2] = 1.0           // Blue
      }

      // Size - vary by distance
      const dist = Math.sqrt(x * x + y * y + z * z) / RADIUS
      sizes[i] = (0.05 + Math.random() * 0.05) * (1 - dist * 0.5)
    }

    return { positions, colors, sizes, original }
  }, [])

  // Create geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return geo
  }, [positions, colors, sizes])

  // Animation
  useFrame(({ clock }) => {
    if (!particlesRef.current || !linesRef.current) return

    const time = clock.getElapsedTime()
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

    // Update particles
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3
      const data = original[i]

      // Noise-like movement
      positions[i3] = data.x + Math.sin(time * 0.2 + data.phase) * 0.2
      positions[i3 + 1] = data.y + Math.cos(time * 0.15 + data.phase * 1.3) * 0.2
      positions[i3 + 2] = data.z + Math.sin(time * 0.1 + data.phase * 2.1) * 0.2
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true

    // Create connections
    const connections = []

    // Simple connection strategy
    for (let i = 0; i < 1000; i++) {
      const idx1 = Math.floor(Math.random() * COUNT)
      const idx2 = Math.floor(Math.random() * COUNT)

      if (idx1 !== idx2) {
        const idx1_3 = idx1 * 3
        const idx2_3 = idx2 * 3

        const dx = positions[idx1_3] - positions[idx2_3]
        const dy = positions[idx1_3 + 1] - positions[idx2_3 + 1]
        const dz = positions[idx1_3 + 2] - positions[idx2_3 + 2]
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (distance < 0.8) {
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

  return (
    <group
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Ambient glow */}
      <mesh>
        <sphereGeometry args={[RADIUS * 1.1, 32, 32]} />
        <meshBasicMaterial
          color="#4169E1"
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
        />
      </points>

      {/* Connections */}
      <lineSegments ref={linesRef}>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {hovered && (
        <mesh position={[0, -2, 0]}>
          <Text fontSize={0.2} color="#ffffff">
            Interactive Portfolio
          </Text>
          <meshBasicMaterial color="#ffffff" />
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
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} color="#9d4edd" intensity={0.5} />
          <Model />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
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

