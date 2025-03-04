import { NextResponse } from "next/server"

// Sample product data to avoid external API dependency
const sampleProducts = [
  {
    id: "1",
    name: "Project Alpha",
    description: "A cutting-edge web application",
    price: 99.99,
    image: "/placeholder.svg?height=600&width=800",
  },
  {
    id: "2",
    name: "Project Beta",
    description: "Mobile-first responsive design",
    price: 149.99,
    image: "/placeholder.svg?height=600&width=800",
  },
  {
    id: "3",
    name: "Project Gamma",
    description: "AI-powered analytics dashboard",
    price: 199.99,
    image: "/placeholder.svg?height=600&width=800",
  },
]

export async function GET() {
  try {
    // Instead of fetching from an external API that might not exist,
    // return our sample data
    return NextResponse.json(sampleProducts)
  } catch (error) {
    console.error("Error in products API route:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

