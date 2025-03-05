# Visitor Tracking System

This document explains the visitor tracking system implemented in this project. The system tracks visitors and their location information discreetly using Firebase Firestore.

## Overview

The visitor tracking system collects information about visitors to your website and stores it in a Firebase Firestore collection called `visitors`. The system is designed to be discreet and collect location information without explicit user consent, using timezone data and IP-based geolocation.

## Implementation Details

### Data Collected

The system collects the following information about visitors:

- **Basic Information**:

  - Timestamp of visit
  - User agent (browser/device information)
  - Language preference
  - Referrer (where the visitor came from)
  - Current page path
  - Screen dimensions
  - Timezone

- **Location Information** (collected discreetly):
  - Country
  - Region
  - City (when available)
  - Latitude/Longitude (when available)
  - IP address
  - Timezone

### How It Works

1. The system is implemented using a React Context (`VisitorContext`) that wraps your application.
2. When a user visits your site, the system:

   - Generates a unique session ID stored in localStorage
   - Tracks visit count
   - Collects basic browser information
   - Silently attempts to get location data using the ipapi.co service
   - Stores all information in Firebase Firestore

3. The system uses a delayed initialization to avoid impacting page load performance.

4. For returning visitors, it updates their existing record with new visit information.

## Components

1. **VisitorProvider**: The main context provider that handles tracking and data collection.
2. **useVisitor**: A hook to access visitor data in your components.
3. **Admin Page**: A dashboard to view visitor analytics at `/admin`.

## Hydration Issues and Solutions

The visitor tracking system is designed to work with Next.js server-side rendering. To prevent hydration errors (mismatches between server and client rendering), the following measures have been implemented:

1. **Mounting State**: All components that access browser APIs use an `isMounted` state that only becomes true after the component has mounted on the client side.

2. **Conditional Rendering**: Browser-specific code only runs when `isMounted` is true and `typeof window !== "undefined"`.

3. **Delayed Initialization**: Tracking initialization is delayed using `setTimeout` to ensure it happens after hydration is complete.

4. **Dynamic Imports**: Components that use browser-specific APIs (like Three.js) are dynamically imported with `{ ssr: false }` to prevent them from running during server-side rendering.

If you encounter hydration errors like this:

```
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

Check that any component accessing browser APIs:

1. Has an `isMounted` state
2. Only accesses browser APIs when `isMounted` is true
3. Uses dynamic imports for browser-specific libraries

## Privacy Considerations

This implementation collects location data without explicit user consent. While this is technically possible, consider the following:

- This approach may not comply with privacy regulations like GDPR or CCPA in some jurisdictions
- Consider adding a privacy policy that discloses data collection
- For production use, you might want to implement a consent mechanism

## Usage

The visitor tracking is automatically enabled when the application loads. To view the collected data, visit the `/admin` page.

### Accessing Visitor Data in Components

You can access visitor data in any component using the `useVisitor` hook:

```tsx
import { useVisitor } from "@/lib/visitorContext";

function MyComponent() {
  const { visitorData, isLoading, error } = useVisitor();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <p>Visitor from: {visitorData?.location?.country || "Unknown"}</p>
      <p>Timezone: {visitorData?.timezone}</p>
    </div>
  );
}
```

## Firebase Setup

The system uses the following Firebase configuration:

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
```

Make sure these environment variables are properly set in your `.env` file.
