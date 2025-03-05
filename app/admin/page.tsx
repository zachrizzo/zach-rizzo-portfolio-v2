"use client"

import { useState, useEffect } from "react"
import { initializeApp, getApps } from "firebase/app"
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore"

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

interface VisitorLocation {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    ip?: string;
    timezone?: string;
}

interface Visitor {
    id: string;
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
    lastVisit?: any;
}

export default function AdminPage() {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visitorCount, setVisitorCount] = useState(0);
    const [uniqueLocations, setUniqueLocations] = useState<Set<string>>(new Set());
    const [timezones, setTimezones] = useState<Map<string, number>>(new Map());
    const [isMounted, setIsMounted] = useState(false);

    // Use a separate useEffect for mounting to prevent hydration issues
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Only run on client side and after component is mounted
        if (typeof window === "undefined" || !isMounted) return;

        const fetchVisitors = async () => {
            try {
                // Initialize Firebase only if it hasn't been initialized yet
                const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
                const db = getFirestore(app);

                // Query visitors collection
                const visitorQuery = query(
                    collection(db, "visitors"),
                    orderBy("timestamp", "desc"),
                    limit(100)
                );

                const querySnapshot = await getDocs(visitorQuery);
                const visitorData: Visitor[] = [];
                const locations = new Set<string>();
                const timezoneMap = new Map<string, number>();

                querySnapshot.forEach((doc) => {
                    const data = doc.data() as Omit<Visitor, "id">;
                    const visitor: Visitor = {
                        id: doc.id,
                        ...data,
                        timestamp: data.timestamp?.toDate?.() || new Date(),
                        lastVisit: data.lastVisit?.toDate?.() || null,
                    };

                    visitorData.push(visitor);

                    // Track unique locations
                    if (visitor.location?.country) {
                        const locationKey = `${visitor.location.country}${visitor.location.region ? `, ${visitor.location.region}` : ''}`;
                        locations.add(locationKey);
                    }

                    // Track timezones
                    const timezone = visitor.timezone || visitor.location?.timezone || "Unknown";
                    timezoneMap.set(timezone, (timezoneMap.get(timezone) || 0) + 1);
                });

                setVisitors(visitorData);
                setVisitorCount(visitorData.length);
                setUniqueLocations(locations);
                setTimezones(timezoneMap);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching visitors:", err);
                setError("Failed to fetch visitor data. Please try again later.");
                setLoading(false);
            }
        };

        fetchVisitors();
    }, [isMounted]); // Only run when isMounted changes

    if (!isMounted) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Visitor Analytics</h1>
                <p>Loading...</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Visitor Analytics</h1>
                <p>Loading visitor data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Visitor Analytics</h1>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Visitor Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Total Visitors</h2>
                    <p className="text-3xl font-bold">{visitorCount}</p>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Unique Locations</h2>
                    <p className="text-3xl font-bold">{uniqueLocations.size}</p>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Unique Timezones</h2>
                    <p className="text-3xl font-bold">{timezones.size}</p>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Timezone Distribution</h2>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from(timezones.entries()).sort((a, b) => b[1] - a[1]).map(([timezone, count]) => (
                        <div key={timezone} className="flex justify-between items-center">
                            <span className="font-medium">{timezone}</span>
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 px-2 py-1 rounded-full text-sm">
                                {count} {count === 1 ? 'visitor' : 'visitors'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Recent Visitors</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th className="py-2 px-4 border-b text-left">Time</th>
                            <th className="py-2 px-4 border-b text-left">Location</th>
                            <th className="py-2 px-4 border-b text-left">Timezone</th>
                            <th className="py-2 px-4 border-b text-left">Referrer</th>
                            <th className="py-2 px-4 border-b text-left">Device</th>
                            <th className="py-2 px-4 border-b text-left">Visits</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visitors.map((visitor) => (
                            <tr key={visitor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="py-2 px-4 border-b">
                                    {visitor.timestamp.toLocaleString()}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {visitor.location?.country ? (
                                        <>
                                            {visitor.location.country}
                                            {visitor.location.region && `, ${visitor.location.region}`}
                                        </>
                                    ) : (
                                        "Unknown"
                                    )}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {visitor.timezone || visitor.location?.timezone || "Unknown"}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {visitor.referrer || "Direct"}
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {visitor.userAgent.includes("Mobile") ? "Mobile" : "Desktop"} ({visitor.screenWidth}x{visitor.screenHeight})
                                </td>
                                <td className="py-2 px-4 border-b">
                                    {visitor.visitCount || 1}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
