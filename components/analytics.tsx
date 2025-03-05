"use client"

import { useEffect, useState } from "react"
import { initializeApp, getApps } from "firebase/app"
import { getAnalytics, logEvent } from "firebase/analytics"
import { useVisitor } from "@/lib/visitorContext"

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

export function Analytics() {
  // Use the visitor context
  const { visitorData, isLoading, error } = useVisitor();
  const [isMounted, setIsMounted] = useState(false);

  // Use a separate useEffect for mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client side and after component is mounted
    if (typeof window === "undefined" || !isMounted) return;

    // Check if Firebase config is available and appears valid
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "your-api-key" || !firebaseConfig.projectId) {
      console.log("Firebase config not available or contains placeholder values. Analytics disabled.")
      return
    }

    const initializeAnalytics = async () => {
      try {
        // Check if we're in a development environment with potential API issues
        if (process.env.NODE_ENV === 'development') {
          console.log('Firebase analytics initialization in development mode with enhanced error handling');
        }

        // Initialize Firebase only if it hasn't been initialized yet
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

        // Initialize Analytics if measurement ID exists
        if (process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID &&
          process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID !== "your-measurement-id") {
          try {
            const analytics = getAnalytics(app)

            // Log page view
            logEvent(analytics, "page_view", {
              page_path: window.location.pathname,
              page_title: document.title,
              page_location: window.location.href,
            })

            // Track scroll depth
            const trackScrollDepth = () => {
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop
              const scrollHeight = document.documentElement.scrollHeight
              const clientHeight = document.documentElement.clientHeight

              const scrollPercentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100)

              if (
                scrollPercentage === 25 ||
                scrollPercentage === 50 ||
                scrollPercentage === 75 ||
                scrollPercentage === 100
              ) {
                logEvent(analytics, "scroll_depth", {
                  percentage: scrollPercentage,
                })
              }
            }

            window.addEventListener("scroll", trackScrollDepth)
            return () => window.removeEventListener("scroll", trackScrollDepth)
          } catch (analyticsError) {
            console.error("Analytics initialization failed:", analyticsError)
            // Continue execution - analytics failure shouldn't break the app
          }
        }
      } catch (error) {
        console.error("Firebase analytics initialization error:", error)
        // Gracefully handle Firebase initialization failure
        // We don't want to crash the app if analytics fails
      }
    }

    // Small delay to ensure hydration is complete
    const timeoutId = setTimeout(() => {
      initializeAnalytics();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [isMounted]) // Only run when isMounted changes

  return null
}

