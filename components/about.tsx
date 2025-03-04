"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Text, Center, Environment } from "@react-three/drei"
import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Typewriter from 'typewriter-effect'
import { useTheme } from "next-themes"

function FloatingText() {
  const textRef = useRef<any>(null)
  const [fontError, setFontError] = useState(false)

  useFrame((state) => {
    if (!textRef.current) return
    textRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Center ref={textRef}>
        <Text
          fontSize={0.5}
          color="#7928CA"
          anchorX="center"
          anchorY="middle"
        >
          About Me
        </Text>
      </Center>
    </Float>
  )
}

// Terminal component for the background section
function Terminal({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <div className={`font-mono rounded-md overflow-hidden ${isDark ? 'bg-[#1e1e1e]' : 'bg-[#f5f5f5]'} shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
      {/* Terminal header */}
      <div className={`flex items-center px-4 py-2 ${isDark ? 'bg-[#333333]' : 'bg-[#e0e0e0]'} border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-sm font-medium">zachary-rizzo-profile.sh</div>
      </div>

      {/* Terminal content */}
      <div className={`p-4 ${isDark ? 'text-gray-200' : 'text-gray-800'} overflow-auto`}>
        {children}
      </div>
    </div>
  )
}

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [activeTab, setActiveTab] = useState("background")
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  // Text content for the background section
  const backgroundText = `With over 6 years of experience in software engineering, I specialize in building AI-powered applications that combine cutting-edge technology with intuitive user experiences.

My expertise spans both front-end and back-end development, enabling me to create comprehensive solutions that integrate AI models, data processing pipelines, and responsive interfaces.`

  // Split the background text into lines for the terminal display
  const backgroundLines = backgroundText.split('\n')

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <section id="about" className="py-20 px-4 md:px-6 relative" ref={ref}>
      <div className="absolute top-0 left-0 w-full h-64 pointer-events-none" suppressHydrationWarning>
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <FloatingText />
          <Environment preset="city" />
        </Canvas>
      </div>

      <div className="max-w-6xl mx-auto mt-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl"
          >
            <Image src="/placeholder.svg?height=800&width=600" alt="Profile" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h3 className="text-xl font-bold">Zachary Rizzo</h3>
                <p className="text-sm opacity-80">Full Stack Software Engineer</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="relative">
              <div className="mb-6 flex bg-muted rounded-lg p-1 relative z-30">
                <button
                  onClick={() => handleTabChange("background")}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "background"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Background
                </button>
                <button
                  onClick={() => handleTabChange("experience")}
                  className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "experience"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Experience
                </button>
              </div>

              <div className="mt-6">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold mb-4">
                    {activeTab === "background" ? "My Journey" : "Work Experience"}
                  </h2>

                  {/* Fixed height container to prevent layout shift */}
                  <div className="h-[300px]">
                    {activeTab === "background" && (
                      <Terminal>
                        <div className="grid" style={{ gridTemplateColumns: "auto 1fr" }}>
                          {/* Line numbers */}
                          <div className={`pr-4 text-right ${isDark ? 'text-gray-500' : 'text-gray-400'} select-none border-r ${isDark ? 'border-gray-700' : 'border-gray-300'} mr-4`}>
                            {backgroundLines.map((_, i) => (
                              <div key={i} className="leading-6">
                                {i + 1}
                              </div>
                            ))}
                          </div>

                          {/* Content with typewriter effect */}
                          <div className="min-h-[120px]">
                            <Typewriter
                              options={{
                                delay: 30,
                                cursor: '|',
                                cursorClassName: `${isDark ? 'text-gray-200' : 'text-gray-800'}`,
                              }}
                              onInit={(typewriter) => {
                                typewriter
                                  .typeString(backgroundLines[0])
                                  .pauseFor(500)
                                  .typeString('<br><br>' + backgroundLines[1])
                                  .start();
                              }}
                            />
                          </div>
                        </div>
                      </Terminal>
                    )}

                    {activeTab === "experience" && (
                      <Terminal>
                        <div className="grid" style={{ gridTemplateColumns: "auto 1fr" }}>
                          {/* Line numbers */}
                          <div className={`pr-4 text-right ${isDark ? 'text-gray-500' : 'text-gray-400'} select-none border-r ${isDark ? 'border-gray-700' : 'border-gray-300'} mr-4`}>
                            {[...Array(9)].map((_, i) => (
                              <div key={i} className="leading-6">
                                {i + 1}
                              </div>
                            ))}
                          </div>

                          {/* Content with typewriter effect */}
                          <div className="min-h-[180px]">
                            <p className={`font-bold mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>// Software Engineer</p>
                            <p className={`text-sm mb-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>// SLP Toolkit, January 2024 - Present</p>
                            <div className="mb-4">
                              <Typewriter
                                options={{
                                  delay: 30,
                                  cursor: '|',
                                }}
                                onInit={(typewriter) => {
                                  typewriter
                                    .typeString('Co-leading design and development of an AI-powered SaaS product with React, Next.js, and Node.js.')
                                    .start();
                                }}
                              />
                            </div>

                            <p className={`font-bold mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>// Software Engineer</p>
                            <p className={`text-sm mb-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>// American Medical Associates, January 2022 - February 2024</p>
                            <div className="mb-4">
                              <Typewriter
                                options={{
                                  delay: 30,
                                  cursor: '|',
                                }}
                                onInit={(typewriter) => {
                                  typewriter
                                    .typeString('Led development of unified web and mobile applications using React Native and Redux.')
                                    .start();
                                }}
                              />
                            </div>

                            <p className={`font-bold mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>// Software Engineer</p>
                            <p className={`text-sm mb-1 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>// Flow Team, October 2020 - December 2021</p>
                            <div className="mb-4">
                              <Typewriter
                                options={{
                                  delay: 30,
                                  cursor: '|',
                                }}
                                onInit={(typewriter) => {
                                  typewriter
                                    .typeString('Developed team management and geolocation mobile applications with React Native.')
                                    .start();
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </Terminal>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

