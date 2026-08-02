import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { getNewsletterArticlesByYear, formatDate } from "@/lib/newsletter-data"

interface NewsletterArchiveProps {
  year: string
}

export default function NewsletterArchive({ year }: NewsletterArchiveProps) {
  const newsletters = getNewsletterArticlesByYear(year)

  return (
    <div className="space-y-6">
      {newsletters.length > 0 ? (
        newsletters.map((newsletter) => (
          <Card key={newsletter.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{newsletter.title}</CardTitle>
                <Badge variant="outline">{formatDate(newsletter.date)}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{newsletter.description}</p>
              <Button variant="outline" size="sm" asChild>
                <Link href={newsletter.url} target="_blank" rel="noopener noreferrer">
                  Read Newsletter
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No newsletters available for {year}.</p>
        </div>
      )}
    </div>
  )
}
