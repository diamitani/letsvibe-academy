import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export default function Newsletter() {
  return (
    <section className="container py-12 md:py-16">
      <div className="rounded-lg bg-primary/5 border p-8 md:p-12">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          <div className="rounded-full bg-primary/10 p-3">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Subscribe to Our Newsletter</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Stay updated with the latest AI trends, tools, and insights delivered straight to your inbox every week.
          </p>
          <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <Input placeholder="Enter your email" className="h-10" />
            <Button size="lg" className="h-10">
              Subscribe
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  )
}
