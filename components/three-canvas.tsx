"use client"

import { Canvas } from "@react-three/fiber"
import { Environment, ContactShadows, Float } from "@react-three/drei"

function ContactModel() {
    return (
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
            <mesh scale={1.5}>
                <torusGeometry args={[1, 0.3, 16, 32]} />
                <meshStandardMaterial color="#7928CA" wireframe />
            </mesh>
        </Float>
    )
}

export function ThreeCanvas() {
    return (
        <Canvas>
            <ambientLight intensity={0.5} />
            <ContactModel />
            <ContactShadows opacity={0.5} scale={10} blur={1} far={10} resolution={256} />
            <Environment preset="city" />
        </Canvas>
    )
}
