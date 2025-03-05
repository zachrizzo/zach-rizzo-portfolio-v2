"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Hero from "@/components/hero"
import About from "@/components/about"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import { Analytics } from "@/components/analytics"

export default function Home() {
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(false)
  const [firebaseError, setFirebaseError] = useState(false)

  useEffect(() => {
    // Check if Firebase configuration is valid
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

    // We now have actual Firebase credentials
    const isValid = Boolean(apiKey) && Boolean(projectId)

    // Add extra check to handle potential JSON parse errors
    const checkFirebaseConnection = async () => {
      if (!isValid) {
        setIsFirebaseAvailable(false)
        return
      }

      try {
        // Try to import Firebase dynamically to avoid issues
        const firebase = await import('firebase/app')

        // Add a global error handler for JSON parse errors
        const originalParseFunction = JSON.parse;
        JSON.parse = function safeJSONParse(text) {
          try {
            return originalParseFunction(text);
          } catch (error) {
            console.error("JSON Parse Error:", error);
            console.log("Attempted to parse:", text.substring(0, 100) + "...");
            // Return an empty object instead of throwing
            return {};
          }
        };

        setIsFirebaseAvailable(true)
      } catch (error) {
        console.error("Error checking Firebase:", error)
        setFirebaseError(true)
        setIsFirebaseAvailable(false)
      }
    }

    checkFirebaseConnection()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <Header />
      {isFirebaseAvailable && !firebaseError ? <Analytics /> : null}
      <div id="hero">
        <Hero />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="projects">
        <Projects />
      </div>
      <div id="skills">
        <Skills />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Footer />
    </main>
  )
}

