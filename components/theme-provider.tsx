"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps {
    children: React.ReactNode
    [prop: string]: any
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    // Force light theme on initial server render to match client hydration
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme={!mounted ? "light" : undefined}
            enableSystem={false}
            {...props}
        >
            {children}
        </NextThemesProvider>
    )
}
