"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Brain,
    Network,
    Sparkles,
    Zap,
    Bot,
    Layers,
    Cpu,
    Database,
    LineChart,
    Eye,
    MessageSquare,
    Code2,
    Workflow
} from "lucide-react"

// AI concept nodes for the journey map
interface AIConceptNode {
    id: string;
    title: string;
    icon: React.ReactNode;
    description: string;
    examples: string[];
    color: string;
    position: { x: number; y: number };
    tags?: string[];
}

const aiConcepts: AIConceptNode[] = [
    {
        id: "nlp",
        title: "Natural Language Processing",
        icon: <MessageSquare className="h-6 w-6" />,
        description: "Building systems that understand, interpret, and generate human language",
        examples: ["Sentiment analysis", "Text summarization", "Language translation", "Question answering"],
        color: "from-blue-500 to-indigo-600",
        position: { x: 20, y: 30 }
    },
    {
        id: "cv",
        title: "Computer Vision",
        icon: <Eye className="h-6 w-6" />,
        description: "Enabling machines to interpret and make decisions based on visual data",
        examples: ["Object detection", "Image classification", "Facial recognition", "Scene understanding"],
        color: "from-purple-500 to-pink-600",
        position: { x: 70, y: 20 }
    },
    {
        id: "ml",
        title: "Machine Learning",
        icon: <Layers className="h-6 w-6" />,
        description: "Algorithms that improve through experience without explicit programming",
        examples: ["Classification", "Regression", "Clustering", "Anomaly detection"],
        color: "from-green-500 to-emerald-600",
        position: { x: 40, y: 60 }
    },
    {
        id: "dl",
        title: "Deep Learning",
        icon: <Network className="h-6 w-6" />,
        description: "Neural networks with multiple layers that can learn complex patterns",
        examples: ["Convolutional neural networks", "Recurrent neural networks", "Transformers", "GANs"],
        color: "from-red-500 to-orange-600",
        position: { x: 80, y: 70 }
    },
    {
        id: "rl",
        title: "Reinforcement Learning",
        icon: <Zap className="h-6 w-6" />,
        description: "Training agents to make sequences of decisions by rewarding desired behaviors",
        examples: ["Game playing AI", "Robotics control", "Resource management", "Recommendation systems"],
        color: "from-yellow-500 to-amber-600",
        position: { x: 15, y: 80 }
    },
    {
        id: "gen",
        title: "Generative AI",
        icon: <Sparkles className="h-6 w-6" />,
        description: "Creating new content like images, text, music, and code",
        examples: ["Text-to-image generation", "Code completion", "Music composition", "Content creation"],
        color: "from-cyan-500 to-blue-600",
        position: { x: 60, y: 40 }
    }
]

// Connection paths between concepts
interface Connection {
    from: string;
    to: string;
    strength: number;
}

const connections: Connection[] = [
    { from: "ml", to: "dl", strength: 0.8 },
    { from: "ml", to: "rl", strength: 0.6 },
    { from: "dl", to: "nlp", strength: 0.7 },
    { from: "dl", to: "cv", strength: 0.7 },
    { from: "dl", to: "gen", strength: 0.9 },
    { from: "nlp", to: "gen", strength: 0.5 },
    { from: "cv", to: "rl", strength: 0.4 }
]

// AI Journey Map Node Component
const AINode = ({ concept, isActive, onClick }: {
    concept: AIConceptNode;
    isActive: boolean;
    onClick: (id: string) => void
}) => {
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === 'dark'

    return (
        <motion.div
            className={`absolute cursor-pointer`}
            style={{
                left: `${concept.position.x}%`,
                top: `${concept.position.y}%`,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
                scale: isActive ? 1.1 : 1,
                opacity: 1,
                zIndex: isActive ? 10 : 1
            }}
            transition={{ duration: 0.3 }}
            onClick={() => onClick(concept.id)}
        >
            <div className={`rounded-full bg-gradient-to-br ${concept.color} p-3 shadow-lg
        ${isActive ? 'ring-4 ring-white/30 dark:ring-black/30' : ''}
        ${isDarkMode ? 'shadow-black/20' : 'shadow-black/10'}`}>
                <div className="text-white">
                    {concept.icon}
                </div>
            </div>
            {isActive && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-4 h-4 bg-background rotate-45 border-t border-l border-border"></div>
                </div>
            )}
        </motion.div>
    )
}

// Connection lines between nodes
const ConnectionLine = ({ from, to, strength, activeNode }: {
    from: string;
    to: string;
    strength: number;
    activeNode: string | null
}) => {
    const fromConcept = aiConcepts.find(c => c.id === from)
    const toConcept = aiConcepts.find(c => c.id === to)

    if (!fromConcept || !toConcept) return null

    const isActive = activeNode === from || activeNode === to

    // Calculate line coordinates
    const x1 = fromConcept.position.x
    const y1 = fromConcept.position.y
    const x2 = toConcept.position.x
    const y2 = toConcept.position.y

    // Calculate line length for animation
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

    return (
        <motion.div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isActive ? 0.8 : 0.3 }}
            transition={{ duration: 0.3 }}
        >
            <svg width="100%" height="100%" className="absolute top-0 left-0">
                <motion.line
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke={isActive ? "#ffffff" : "#888888"}
                    strokeWidth={isActive ? 3 : 1.5}
                    strokeOpacity={isActive ? 0.8 : 0.3}
                    strokeDasharray={strength < 0.7 ? "5,5" : "none"}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
            </svg>
        </motion.div>
    )
}

// AI Project Card Component
const AIProjectCard = ({ project }: { project: AIConceptNode }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="shadow-lg border-2 h-full">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                        <div className={`rounded-full bg-gradient-to-br ${project.color} p-2`}>
                            <div className="text-white">
                                {project.icon}
                            </div>
                        </div>
                        <CardTitle>{project.title}</CardTitle>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium mb-2">Key Applications:</h4>
                            <ul className="space-y-1 text-sm">
                                {project.examples.map((example, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                            <svg className="h-2 w-2 text-primary" fill="currentColor" viewBox="0 0 8 8">
                                                <circle cx="4" cy="4" r="3" />
                                            </svg>
                                        </div>
                                        <span>{example}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {project.tags?.map((tag, i) => (
                                <Badge key={i} variant="outline" className="bg-primary/5">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

// Sample AI projects for each concept
const getProjectsForConcept = (conceptId: string): AIConceptNode[] => {
    const concept = aiConcepts.find(c => c.id === conceptId)
    if (!concept) return []

    // Add tags and additional details to the concept
    return [{
        ...concept,
        tags: ["Python", "TensorFlow", "PyTorch", "Hugging Face"]
    }]
}

// Client-side only particle component
const ClientParticle = ({ index, isDarkMode }: { index: number, isDarkMode: boolean }) => {
    const [styles, setStyles] = useState({
        width: 4,
        height: 4,
        left: "50%",
        top: "50%",
        xMovement: 0,
        yMovement: 0,
        duration: 15
    });

    useEffect(() => {
        // Only run random calculations on the client
        setStyles({
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            xMovement: Math.random() * 50 - 25,
            yMovement: Math.random() * 50 - 25,
            duration: Math.random() * 10 + 10
        });
    }, []);

    return (
        <motion.div
            className={`absolute rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}
            style={{
                width: styles.width,
                height: styles.height,
                left: styles.left,
                top: styles.top,
            }}
            animate={{
                x: [0, styles.xMovement],
                y: [0, styles.yMovement],
                opacity: [0.7, 0.1, 0.7],
            }}
            transition={{
                duration: styles.duration,
                repeat: Infinity,
                repeatType: "reverse",
            }}
        />
    );
};

export default function AIJourneyMap() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.1 })
    const [activeNode, setActiveNode] = useState<string | null>(null)
    const [projects, setProjects] = useState<AIConceptNode[]>([])
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === 'dark'

    // Handle node click
    const handleNodeClick = (nodeId: string) => {
        if (activeNode === nodeId) {
            setActiveNode(null)
            setProjects([])
        } else {
            setActiveNode(nodeId)
            setProjects(getProjectsForConcept(nodeId))
        }
    }

    // Use theme-consistent classes that rely on CSS variables instead of direct theme conditionals
    return (
        <section
            id="ai-showcase"
            className="py-24 px-4 md:px-6 bg-gradient-to-b from-background via-background to-background/80"
            ref={ref}
            suppressHydrationWarning
        >
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Brain className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl md:text-4xl font-bold">AI Expertise Map</h2>
                    </div>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explore my journey through the landscape of artificial intelligence.
                        Click on any node to discover my expertise and projects in that area.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* AI Journey Map */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-7 relative"
                    >
                        <Card className="shadow-xl border-2 overflow-hidden">
                            <CardHeader className="pb-2 border-b">
                                <div className="flex items-center gap-2">
                                    <Workflow className="h-5 w-5 text-primary" />
                                    <CardTitle>AI Knowledge Graph</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div
                                    className="relative w-full bg-gradient-radial from-muted/50 to-muted/80"
                                    style={{ height: "500px" }}
                                    suppressHydrationWarning
                                >
                                    {/* Connection lines */}
                                    {connections.map((conn, i) => (
                                        <ConnectionLine
                                            key={i}
                                            from={conn.from}
                                            to={conn.to}
                                            strength={conn.strength}
                                            activeNode={activeNode}
                                        />
                                    ))}

                                    {/* AI Concept Nodes */}
                                    {aiConcepts.map((concept) => (
                                        <AINode
                                            key={concept.id}
                                            concept={concept}
                                            isActive={activeNode === concept.id}
                                            onClick={handleNodeClick}
                                        />
                                    ))}

                                    {/* Floating particles for visual effect */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        {[...Array(20)].map((_, i) => {
                                            // Use keys for consistent rendering
                                            const key = `particle-${i}`;
                                            return (
                                                <ClientParticle
                                                    key={key}
                                                    index={i}
                                                    isDarkMode={isDarkMode}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Legend */}
                        <div className="mt-4 flex flex-wrap gap-4 justify-center">
                            {aiConcepts.map((concept) => (
                                <Badge
                                    key={concept.id}
                                    variant="outline"
                                    className={`cursor-pointer ${activeNode === concept.id ? 'bg-primary/20 border-primary' : 'bg-primary/5'}`}
                                    onClick={() => handleNodeClick(concept.id)}
                                >
                                    <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${concept.color} mr-1.5`}></div>
                                    {concept.title}
                                </Badge>
                            ))}
                        </div>
                    </motion.div>

                    {/* AI Project Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="lg:col-span-5"
                    >
                        <div className="sticky top-24">
                            {activeNode ? (
                                <AnimatePresence mode="wait">
                                    {projects.map((project) => (
                                        <AIProjectCard key={project.id} project={project} />
                                    ))}
                                </AnimatePresence>
                            ) : (
                                <Card className="shadow-lg border-2 bg-primary/5">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <Bot className="h-5 w-5 text-primary" />
                                            <CardTitle>AI Expertise</CardTitle>
                                        </div>
                                        <CardDescription>
                                            Click on any node in the knowledge graph to explore my expertise in that area
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <p className="text-sm">
                                                My AI journey spans multiple domains including natural language processing,
                                                computer vision, and generative AI. The knowledge graph visualizes how these
                                                areas interconnect and form the foundation of my technical expertise.
                                            </p>

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Cpu className="h-4 w-4" />
                                                <span>Select a node to view details</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* AI Capabilities Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-20"
                >
                    <div className="text-center mb-10">
                        <h3 className="text-2xl font-bold">AI Development Capabilities</h3>
                        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                            From concept to deployment, I bring AI solutions to life
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <Card className="bg-primary/5 border-primary/20 shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-primary/10 p-1.5">
                                        <Brain className="h-4 w-4 text-primary" />
                                    </div>
                                    <CardTitle className="text-base">Model Development</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">
                                    Building custom AI models tailored to specific business needs, from traditional ML to cutting-edge deep learning architectures.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary/5 border-primary/20 shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-primary/10 p-1.5">
                                        <Database className="h-4 w-4 text-primary" />
                                    </div>
                                    <CardTitle className="text-base">Data Pipeline Engineering</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">
                                    Designing robust data processing pipelines for training and inference, ensuring efficient and scalable AI operations.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary/5 border-primary/20 shadow-sm">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-primary/10 p-1.5">
                                        <LineChart className="h-4 w-4 text-primary" />
                                    </div>
                                    <CardTitle className="text-base">AI Integration</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">
                                    Seamlessly integrating AI capabilities into existing products and workflows, creating intuitive interfaces for non-technical users.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
