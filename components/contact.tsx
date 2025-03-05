"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react"
import { initializeApp, getApps } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"

// Dynamically import the 3D components with no SSR to avoid hydration issues
const ThreeCanvas = dynamic(
  () => import("@/components/three-canvas").then((mod) => mod.ThreeCanvas),
  { ssr: false }
);

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Helper function to check if Firebase config is valid
const isFirebaseConfigValid = () => {
  return Boolean(firebaseConfig.apiKey) && Boolean(firebaseConfig.projectId)
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Use a separate useEffect for mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    // Check if Firebase config is valid before attempting to initialize
    if (!isFirebaseConfigValid()) {
      console.error("Firebase configuration is missing or contains placeholder values")
      setSubmitError("Contact form is currently unavailable. Please try again later or reach out via email.")
      setIsSubmitting(false)
      return
    }

    try {
      // Initialize Firebase if not already initialized
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

      try {
        const db = getFirestore(app)

        // Wrap Firebase operations in additional error handling for JSON parse errors
        try {
          // Save message to Firestore
          await addDoc(collection(db, "messages"), {
            ...formData,
            timestamp: serverTimestamp(),
          })

          // Reset form and show success message
          setFormData({ name: "", email: "", message: "" })
          setSubmitSuccess(true)

          // Reset success message after 5 seconds
          setTimeout(() => {
            setSubmitSuccess(false)
          }, 5000)
        } catch (dataError) {
          // Specifically handle JSON parse errors from Firebase
          if (dataError instanceof SyntaxError && dataError.message.includes('Unexpected token')) {
            console.error("Firebase returned an invalid response. This could be a temporary service issue.", dataError);
            setSubmitError("We're experiencing a temporary issue with our contact service. Please try again later or email directly.");
          } else {
            console.error("Error saving data to Firestore:", dataError);
            setSubmitError("There was an error sending your message. Please try again later or contact me directly via email.");
          }
        }
      } catch (firestoreError) {
        console.error("Firestore error:", firestoreError)
        setSubmitError("There was an error sending your message. Please try again later or contact me directly via email.")
      }
    } catch (error) {
      console.error("Firebase initialization error:", error)
      setSubmitError("There was an error with our contact system. Please try reaching out via email instead.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-20 px-4 md:px-6 relative" ref={ref}>
      {isMounted && (
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <ThreeCanvas />
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to discuss potential opportunities? I'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          >
            {submitSuccess && (
              <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded relative mb-6">
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline"> Your message has been sent. I'll get back to you soon!</span>
              </div>
            )}

            {submitError && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-6">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  placeholder="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-background"
                  disabled={isSubmitting}
                  aria-label="Your Name"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-background"
                  disabled={isSubmitting}
                  aria-label="Your Email"
                />
              </div>
              <div>
                <Textarea
                  placeholder="Your Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="bg-background"
                  disabled={isSubmitting}
                  aria-label="Your Message"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <a
                    href="mailto:zachcilwa@gmail.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    zachcilwa@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <a href="tel:+16233133383" className="text-muted-foreground hover:text-primary transition-colors">
                    (623) 313-3383
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-muted-foreground">San Francisco, CA</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

