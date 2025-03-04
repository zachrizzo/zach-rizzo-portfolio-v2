# Zach Rizzo Portfolio v3.0

A modern, interactive portfolio website built with Next.js and Three.js showcasing my professional experience, projects, and skills as a developer.

## Project Overview

This portfolio features a cutting-edge design with interactive 3D elements, animations, and a clean user interface. It's built with performance, accessibility, and responsiveness in mind, providing visitors with an engaging experience across all devices.

### Key Features

- **Interactive 3D Hero Section**: Using Three.js and React Three Fiber for immersive 3D visualizations
- **Dynamic Project Showcase**: Filterable project gallery with detailed project information
- **Skills Visualization**: Interactive presentation of technical skills and proficiencies
- **AI Visualization**: Custom visualization of AI/ML concepts
- **Particle Network Effects**: Beautiful particle animations throughout the site
- **Dark/Light Theme**: Full theme support with next-themes
- **Responsive Design**: Optimized for all device sizes
- **Firebase Integration**: Analytics tracking and backend functionality
- **Framer Motion Animations**: Smooth, engaging UI animations

### Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui components
- **3D Rendering**: Three.js, React Three Fiber, React Three Drei
- **Animation**: Framer Motion, Typewriter Effect
- **Data Visualization**: Recharts
- **Backend/Services**: Firebase
- **Styling**: Tailwind CSS with custom animations
- **Build Tools**: Turbopack for faster development

## Project Structure

- `app/`: Next.js app router pages and layouts
- `components/`: Reusable UI components
  - `hero.tsx`: 3D interactive hero section
  - `about.tsx`: About me section with interactive elements
  - `projects.tsx`: Project showcase component
  - `skills.tsx`: Skills visualization component
  - `contact.tsx`: Contact form and information
  - `ai-visualization.tsx`: Custom AI/ML visualizations
  - `ParticleNetwork.tsx`: Background particle effects
  - `ui/`: Reusable UI components built with shadcn/ui
- `lib/`: Utility functions and shared logic
- `public/`: Static assets and images

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
