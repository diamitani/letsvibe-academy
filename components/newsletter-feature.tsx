import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Mail } from "lucide-react"
import Link from "next/link"
import { newsletterArticles, formatDate } from "@/lib/newsletter-data"

export default function NewsletterFeature() {
  // Get the most recent newsletter
  const latestNewsletter = newsletterArticles[0]

  return (
    <section className="container py-8 md:py-10">
      <div className="rounded-lg bg-primary/5 border p-8 md:p-12">
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6">
          <div className="rounded-full bg-primary/10 p-3">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">LetsVibeAI Newsletter</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Stay updated with the latest AI trends, tools, and insights delivered straight to your inbox every day.
          </p>

          {latestNewsletter && (
            <Card className="w-full max-w-2xl mt-4">
              <CardHeader>
                <CardTitle>{latestNewsletter.title}</CardTitle>
                <CardDescription>{formatDate(latestNewsletter.date)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{latestNewsletter.description}</p>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={latestNewsletter.url} target="_blank" rel="noopener noreferrer">
                    Read Latest Issue
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}

          <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
            <Button size="lg" className="w-full" asChild>
              <Link
                href="https://www.linkedin.com/newsletters/letsvibeai-7301188906387968001/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Subscribe on LinkedIn
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
