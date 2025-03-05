"use client"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Search } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const projects = [
  {
    id: 1,
    title: "Helix AI tooling dashboard board (prototype)",
    description: "A stock forecasting application leveraging transformer architecture to predict 30-day market trajectories.",
    longDescription:
      "Engineered a stock forecasting application using transformer architecture to predict 30-day market trajectories. Implemented customized pre-training on historical price data, integrating news sentiment analysis and flexible technical indicators. Designed an intuitive AI Tooling interface that streamlines data extraction, model training, and visualization processes across any publicly traded security, enabling efficient forecasting and parameter optimization.",
    image: "/placeholder.svg?height=600&width=800",
    category: "ai",
    tags: ["Pytorch", "Numpy", "Pandas", "Python", "scikit-learn", "matplotlib"],
    demoUrl: "#",
    githubUrl: "https://github.com/zachrizzo/Helix-ai-tooling",
  },
  {
    id: 2,
    title: "AI Transformer Stock Trader (Research)",
    description: "Advanced AI trading system combining transformer architecture with technical and sentiment analysis.",
    longDescription:
      "Engineered a sophisticated trading application leveraging Pytorch, Numpy, Pandas, Python, scikit-learn, and matplotlib. Designed with customized pre-training on historical price data, integrating news sentiment analysis and flexible technical indicators. Created an intuitive AI Tooling interface that streamlines data extraction, model training, and visualization processes across any publicly traded security, enabling efficient backtesting and parameter optimization.",
    image: "/stock-trainner.png",
    category: "ai",
    tags: ["Pytorch", "Numpy", "Pandas", "Python", "scikit-learn", "matplotlib"],
    demoUrl: null,
    githubUrl: "https://github.com/zachrizzo/transfomer_stocks",
  },
  {
    id: 3,
    title: "AI Robot (Research)",
    description: "An autonomous robot that can navigate in map, detect and identify objects using computer vision.",
    longDescription:
      "Developed an AI robot using Ros 2, Rviz, Map, Slam, LangChain technologies. Created a system that can navigate in map space around itself, identify objects it has seen through visual inquiry, and efficiently search using a 3D depth camera, Lidar, and vector search capabilities.",
    image: "/robot_screenshot.png",
    category: "ai",
    tags: ["Ros 2", "Rviz", "Map", "Slam", "LangChain"],
    demoUrl: "#",
    githubUrl: "https://github.com/zachrizzo/robot_smart_camera",
  },
  // {
  //   id: 4,
  //   title: "AI Agent Development",
  //   description: "Created the 'Kit Assistant' for vector search and AI-driven task execution in speech therapy.",
  //   longDescription:
  //     "Architected and engineered the 'Kit Assistant' using OpenAI's, Langchain, and Genkit for vector search. Implemented Agentic task execution for speech therapy domain-specific tasks, developing an AI-driven fine-tuning pipeline for improved accuracy. Created systems that generate structured summaries of therapy objectives and outcomes.",
  //   image: "/placeholder.svg?height=600&width=800",
  //   category: "ai",
  //   tags: ["OpenAI", "Langchain", "Genkit", "Vector Search", "Fine-tuning"],
  //   demoUrl: "#",
  //   githubUrl: "#",
  // },

  // {
  //   id: 5,
  //   title: "SaaS Application with React & Next.js",
  //   description: "Co-led the design and development of an AI-powered SaaS product with comprehensive frontend and backend.",
  //   longDescription:
  //     "Co-led the design and development of an AI-powered SaaS Product built with React, Next.js, JavaScript, and MUI Components. Created React Full Calendar and lexical integrations, enhancing user experience with consistent interfaces. Architected API development and backend integration with Python and Node.js, building serverless functions for AI processing and secure data operations.",
  //   image: "/placeholder.svg?height=600&width=800",
  //   category: "web",
  //   tags: ["React", "Next.js", "JavaScript", "MUI", "Python", "Node.js"],
  //   demoUrl: "#",
  //   githubUrl: "#",
  // },
  // {
  //   id: 6,
  //   title: "Unified Web & Mobile Application",
  //   description: "Led the development of a unified web and mobile application for healthcare services.",
  //   longDescription:
  //     "Led the creation of a unified web and mobile application using React, React Native & Redux, enhancing user experience with consistent, responsive interfaces across all platforms. Implemented robust support for both iOS and Android environments using Next.js and Expo for streamlined development and platform-specific compliance. Spearheaded backend infrastructure development with Node.js and Express.js, and integrated with Firebase for secure data handling and patient privacy.",
  //   image: "/placeholder.svg?height=600&width=800",
  //   category: "mobile",
  //   tags: ["React", "React Native", "Redux", "Next.js", "Expo", "Node.js", "Firebase"],
  //   demoUrl: "#",
  //   githubUrl: "#",
  // },
]

export default function Projects() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedProject, setSelectedProject] = useState<null | {
    id: number;
    title: string;
    description: string;
    longDescription: string;
    image: string;
    category: string;
    tags: string[];
    demoUrl: string | null;
    githubUrl: string;
  }>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const filteredProjects = activeTab === "all" ? projects : projects.filter((project) => project.category === activeTab)

  return (
    <section id="projects" className="py-20 px-4 md:px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore my recent work across various technologies and industries
          </p>
        </motion.div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="web">Web</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
              <TabsTrigger value="ai">AI</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden h-full flex flex-col group">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="rounded-full"
                              onClick={() => setSelectedProject(project)}
                            >
                              <Search className="h-5 w-5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>{selectedProject?.title}</DialogTitle>
                              <DialogDescription>
                                {selectedProject && selectedProject.category &&
                                  `${selectedProject.category.charAt(0).toUpperCase()}${selectedProject.category.slice(1)}`}{" "}
                                Project
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="relative h-[250px] rounded-md overflow-hidden">
                                <Image
                                  src={selectedProject?.image || "/placeholder.svg"}
                                  alt={selectedProject?.title || "Project"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground mb-4">{selectedProject?.longDescription}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {selectedProject?.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="flex gap-4">
                                  <Button size="sm" asChild>
                                    {selectedProject?.demoUrl && (
                                      <a href={selectedProject?.demoUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Live Demo
                                      </a>
                                    )}
                                  </Button>
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={selectedProject?.githubUrl} target="_blank" rel="noopener noreferrer">
                                      <Github className="mr-2 h-4 w-4" />
                                      View Code
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          Code
                        </a>
                      </Button>
                      <Button size="sm" asChild>
                        {project.demoUrl ? (
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Demo
                          </a>
                        ) : (
                          <span className="mr-2 h-4 w-24">
                            No live demo
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

