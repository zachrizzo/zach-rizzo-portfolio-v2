"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Instagram } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <motion.div
          className="mb-6 md:mb-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold">Zachary Rizzo</h3>
          <p className="text-muted-foreground">Full Stack Software Engineer</p>
        </motion.div>

        <motion.div
          className="flex space-x-6 mb-6 md:mb-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Link href="https://github.com/zachrizzo" className="text-muted-foreground hover:text-foreground transition-colors">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </Link>
        </motion.div>

        <motion.div
          className="text-center md:text-right"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-muted-foreground">© {currentYear} Zachary Rizzo. All rights reserved.</p>
          <div className="mt-2 flex justify-center md:justify-end space-x-4 text-sm">
            <Link href="https://zach-rizzo.vercel.app" className="text-muted-foreground hover:text-foreground transition-colors">
              Portfolio
            </Link>
            <Link href="https://github.com/zachrizzo" className="text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

