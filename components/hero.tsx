import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="container py-16 sm:py-20">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl">
              Learn, Build, and Innovate with AI
            </h1>
            <p className="text-muted-foreground text-xl md:text-2xl">
              Your central hub for AI resources, tools, and learning. Stay updated with the latest trends and
              technologies in artificial intelligence.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row mt-10">
            <Button size="lg" asChild>
              <Link href="/tools">
                Explore AI Tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link
                href="https://www.linkedin.com/newsletters/livebuildai-7301188906387968001/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Subscribe to Newsletter
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
