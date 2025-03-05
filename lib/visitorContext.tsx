"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { initializeApp, getApps } from "firebase/app"
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    query,
    where,
    getDocs
} from "firebase/firestore"

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Types
interface VisitorLocation {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    ip?: string;
    timezone?: string;
}

interface VisitorData {
    id?: string;
    timestamp: any;
    userAgent: string;
    language: string;
    referrer: string;
    path: string;
    screenWidth: number;
    screenHeight: number;
    timezone: string;
    location?: VisitorLocation;
    sessionId: string;
    visitCount: number;
}

interface VisitorContextType {
    visitorData: VisitorData | null;
    isLoading: boolean;
    error: Error | null;
}

// Create context
const VisitorContext = createContext<VisitorContextType>({
    visitorData: null,
    isLoading: true,
    error: null,
});

// Generate a unique session ID
const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
};

// Get session ID from storage or create a new one
const getSessionId = () => {
    if (typeof window !== "undefined") {
        let sessionId = localStorage.getItem("visitor_session_id");
        if (!sessionId) {
            sessionId = generateSessionId();
            localStorage.setItem("visitor_session_id", sessionId);
        }
        return sessionId;
    }
    return generateSessionId();
};

// Provider component
export function VisitorProvider({ children }: { children: ReactNode }) {
    const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    // Use a separate useEffect for mounting to prevent hydration issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Only run on client side and after component is mounted
        if (typeof window === "undefined" || !isMounted) return;

        // Check if Firebase config is available and appears valid
        if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "your-api-key" || !firebaseConfig.projectId) {
            console.log("Firebase config not available or contains placeholder values. Visitor tracking disabled.");
            setIsLoading(false);
            return;
        }

        const trackVisitor = async () => {
            try {
                // Initialize Firebase only if it hasn't been initialized yet
                const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
                const db = getFirestore(app);

                // Get session ID
                const sessionId = getSessionId();

                // Get visitor count from localStorage
                let visitCount = 1;
                if (typeof window !== "undefined") {
                    const storedCount = localStorage.getItem("visitor_count");
                    if (storedCount) {
                        visitCount = parseInt(storedCount, 10) + 1;
                    }
                    localStorage.setItem("visitor_count", visitCount.toString());
                }

                // Get timezone information
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

                // Basic visitor data
                const visitorData: VisitorData = {
                    timestamp: serverTimestamp(),
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    referrer: document.referrer || "direct",
                    path: window.location.pathname,
                    screenWidth: window.innerWidth,
                    screenHeight: window.innerHeight,
                    timezone,
                    sessionId,
                    visitCount,
                };

                // Silently try to get location data from IP without user awareness
                try {
                    // Using ipapi.co which doesn't require user consent
                    const response = await fetch("https://ipapi.co/json/", {
                        method: "GET",
                        headers: {
                            "Accept": "application/json",
                        },
                        // No credentials to avoid CORS issues
                        credentials: "omit",
                        // Make the request in the background
                        mode: "cors",
                        cache: "no-cache",
                    });

                    if (response.ok) {
                        const locationData = await response.json();
                        visitorData.location = {
                            country: locationData.country_name,
                            region: locationData.region,
                            city: locationData.city,
                            latitude: locationData.latitude,
                            longitude: locationData.longitude,
                            ip: locationData.ip,
                            timezone: locationData.timezone
                        };
                    }
                } catch (locationError) {
                    // Silently fail - don't log the error to avoid drawing attention
                    // Just continue without location data
                    visitorData.location = {
                        timezone
                    };
                }
                // if the url is localhost, don't track the visitor
                if (window.location.hostname === "localhost") {
                    return;
                }
                // Check if this session already exists in Firestore
                const visitorQuery = query(
                    collection(db, "visitors"),
                    where("sessionId", "==", sessionId)
                );

                const querySnapshot = await getDocs(visitorQuery);

                if (!querySnapshot.empty) {
                    // Update existing visitor document
                    const visitorDoc = querySnapshot.docs[0];
                    await updateDoc(doc(db, "visitors", visitorDoc.id), {
                        ...visitorData,
                        lastVisit: serverTimestamp(),
                        visitCount,
                    });

                    setVisitorData({
                        ...visitorData,
                        id: visitorDoc.id,
                    });
                } else {
                    // Add new visitor document
                    const docRef = await addDoc(collection(db, "visitors"), visitorData);
                    setVisitorData({
                        ...visitorData,
                        id: docRef.id,
                    });
                }

                setIsLoading(false);
            } catch (error) {
                // Silently handle errors to avoid drawing attention
                console.error("Error tracking visitor:", error);
                setError(error instanceof Error ? error : new Error(String(error)));
                setIsLoading(false);
            }
        };

        // Execute tracking with a slight delay to avoid impacting page load performance
        const timeoutId = setTimeout(() => {
            trackVisitor();
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [isMounted]); // Only run when isMounted changes

    return (
        <VisitorContext.Provider value={{ visitorData, isLoading, error }}>
            {children}
        </VisitorContext.Provider>
    );
}

// Hook to use the visitor context
export const useVisitor = () => useContext(VisitorContext);
