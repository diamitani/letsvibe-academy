import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink } from "lucide-react"
import NewsletterArchive from "@/components/newsletter-archive"
import Link from "next/link"

export default function NewsletterPage() {
  return (
    <div className="container py-12">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">LiveBuildAI Newsletter</h1>
          <p className="text-muted-foreground text-lg max-w-3xl">
            Stay updated with the latest AI trends, tools, and insights delivered straight to your inbox. Our curated
            newsletter brings you the most important developments in the AI world every day.
          </p>
        </div>

        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Subscribe to our newsletter</CardTitle>
            <CardDescription>Get daily updates on AI trends, tools, and tutorials.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link
                href="https://www.linkedin.com/newsletters/livebuildai-7301188906387968001/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Subscribe on LinkedIn
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Newsletter Archive</h2>
          <Tabs defaultValue="2025" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="2025">2025</TabsTrigger>
              <TabsTrigger value="2024">2024</TabsTrigger>
            </TabsList>

            <TabsContent value="2025" className="mt-0">
              <NewsletterArchive year="2025" />
            </TabsContent>

            <TabsContent value="2024" className="mt-0">
              <NewsletterArchive year="2024" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
