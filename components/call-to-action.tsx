import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CallToAction() {
  return (
    <section className="container py-8 md:py-10">
      <div className="rounded-lg bg-primary text-primary-foreground p-8 md:p-12">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Start Your AI Journey?</h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Join our community of AI enthusiasts and gain access to exclusive resources, tools, and insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/tools">Explore Tools</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/newsletter">Subscribe to Newsletter</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
