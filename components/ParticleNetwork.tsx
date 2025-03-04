import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import dynamic from "next/dynamic"

// Configuration
const PARTICLES = 8000
const RADIUS = 4.0
const CONNECTIONS = 3000

// This is the component that will be rendered client-side only
function ParticleNetworkImpl() {
    const pointsRef = useRef<THREE.Points>(null!)
    const linesRef = useRef<THREE.LineSegments>(null!)

    // Generate particles
    const { positions, colors, sizes, initialData } = useMemo(() => {
        const positions = []
        const colors = []
        const sizes = []
        const initialData = []

        // Use Fibonacci sphere for better distribution
        const phi = Math.PI * (3 - Math.sqrt(5))

        for (let i = 0; i < PARTICLES; i++) {
            const y = 1 - (i / (PARTICLES - 1)) * 2
            const radius = Math.sqrt(1 - y * y)
            const theta = phi * i

            const x = Math.cos(theta) * radius
            const z = Math.sin(theta) * radius

            // Randomize radius slightly for more organic look
            const r = RADIUS * (0.8 + Math.random() * 0.4)

            positions.push(x * r, y * r, z * r)

            // Colors from white-blue spectrum with touches of purple
            const intensity = 0.5 + Math.random() * 0.5
            colors.push(intensity, intensity, intensity + Math.random() * 0.3)

            // Random sizes
            sizes.push(2 + Math.random() * 6)

            // Store initial positions for animation
            initialData.push({ x: x * r, y: y * r, z: z * r })
        }

        return { positions, colors, sizes, initialData }
    }, [])

    // Animation
    useFrame(({ clock }) => {
        if (!pointsRef.current || !linesRef.current) return

        const time = clock.getElapsedTime()
        const positions = pointsRef.current.geometry.attributes.position.array

        // Update particles
        for (let i = 0; i < PARTICLES; i++) {
            const idx = i * 3
            const initialPos = initialData[i]

            // Apply wave-like noise movement
            const noiseX = Math.sin(time * 0.5 + initialPos.x * 0.5) * 0.3
            const noiseY = Math.cos(time * 0.4 + initialPos.y * 0.5) * 0.3
            const noiseZ = Math.sin(time * 0.3 + initialPos.z * 0.5) * 0.3

            positions[idx] = initialPos.x + noiseX
            positions[idx + 1] = initialPos.y + noiseY
            positions[idx + 2] = initialPos.z + noiseZ
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true

        // Create random connections
        const connections = []
        const particlePositions = pointsRef.current.geometry.attributes.position.array

        // Create connections between close particles
        for (let i = 0; i < CONNECTIONS; i++) {
            const idx1 = Math.floor(Math.random() * PARTICLES)
            const idx2 = Math.floor(Math.random() * PARTICLES)

            const pos1X = particlePositions[idx1 * 3]
            const pos1Y = particlePositions[idx1 * 3 + 1]
            const pos1Z = particlePositions[idx1 * 3 + 2]

            const pos2X = particlePositions[idx2 * 3]
            const pos2Y = particlePositions[idx2 * 3 + 1]
            const pos2Z = particlePositions[idx2 * 3 + 2]

            connections.push(pos1X, pos1Y, pos1Z)
            connections.push(pos2X, pos2Y, pos2Z)
        }

        const lineGeometry = new THREE.BufferGeometry()
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connections, 3))

        linesRef.current.geometry.dispose()
        linesRef.current.geometry = lineGeometry
    })

    return (
        <group>
            {/* Glow */}
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
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={positions.length / 3}
                        array={new Float32Array(positions)}
                        itemSize={3}
                        args={[new Float32Array(positions), 3]}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={colors.length / 3}
                        array={new Float32Array(colors)}
                        itemSize={3}
                        args={[new Float32Array(colors), 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    sizeAttenuation
                    vertexColors
                    transparent
                    opacity={0.8}
                />
            </points>

            {/* Connections */}
            <lineSegments ref={linesRef}>
                <bufferGeometry />
                <lineBasicMaterial
                    color="#ffffff"
                    opacity={0.2}
                    transparent
                    blending={THREE.AdditiveBlending}
                />
            </lineSegments>
        </group>
    )
}

// Export a client-side only version of the component to avoid hydration issues
const ParticleNetwork = dynamic(() => Promise.resolve(ParticleNetworkImpl), {
    ssr: false
})

export default ParticleNetwork
