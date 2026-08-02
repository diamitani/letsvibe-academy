"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

export default function Hero() {
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"

  return (
    <div className="relative overflow-hidden">
      <div className="container py-16 sm:py-20">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
              Build your first useful AI-powered project
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl">
              The practical AI-building academy where you learn structured prompting, build real projects in a
              safe sandbox, and turn ideas into tested, presentable results.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row mt-10">
            {isAuthenticated ? (
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Start Building Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button size="lg" variant="outline" asChild>
              <Link href="/videos">
                <Play className="mr-2 h-4 w-4" />
                Watch Overview
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}