"use client"

import { useEffect, useState } from "react"
import { initializeApp, getApps } from "firebase/app"
import { getAnalytics, logEvent } from "firebase/analytics"
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"

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
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Check if Firebase config is available and appears valid
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "your-api-key" || !firebaseConfig.projectId) {
      console.log("Firebase config not available or contains placeholder values. Analytics disabled.")
      return
    }

    const initializeFirebase = async () => {
      try {
        // Check if we're in a development environment with potential API issues
        if (process.env.NODE_ENV === 'development') {
          console.log('Firebase initialization in development mode with enhanced error handling');
        }

        // Initialize Firebase only if it hasn't been initialized yet
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

        // Initialize Analytics if measurement ID exists
        if (process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID &&
          process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID !== "your-measurement-id") {
          try {
            const analytics = getAnalytics(app)
            logEvent(analytics, "page_view")

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

        // Log visitor to Firestore with better error handling
        try {
          const db = getFirestore(app)

          // Wrap Firebase calls in more robust error handling
          try {
            await addDoc(collection(db, "visitors"), {
              timestamp: serverTimestamp(),
              userAgent: navigator.userAgent,
              language: navigator.language,
              referrer: document.referrer || "direct",
              path: window.location.pathname,
              screenWidth: window.innerWidth,
              screenHeight: window.innerHeight,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
            console.log("Visitor logged successfully")
            setIsInitialized(true)
          } catch (innerError) {
            // Check specifically for JSON parse errors that might come from Firebase
            if (innerError instanceof SyntaxError && innerError.message.includes('Unexpected token')) {
              console.error("Firebase returned an invalid response format. This could be a temporary service issue.", innerError);
            } else {
              console.error("Error logging visitor to Firestore:", innerError)
            }
            // Don't rethrow - let the app continue
          }
        } catch (firestoreError) {
          console.error("Error initializing Firestore:", firestoreError)
          // Don't throw - allow the application to continue functioning
        }
      } catch (error) {
        console.error("Firebase initialization error:", error)
        // Gracefully handle Firebase initialization failure
        // We don't want to crash the app if analytics fails
      }
    }

    initializeFirebase()
  }, [])

  return null
}

