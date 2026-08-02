import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Code, Database, Lightbulb, Newspaper, Video } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Database className="h-10 w-10 text-primary" />,
      title: "AI Tools Directory",
      description: "Discover and explore a curated collection of the latest AI tools and resources.",
    },
    {
      icon: <Video className="h-10 w-10 text-primary" />,
      title: "Video Content",
      description: "Watch tutorials, interviews, and demonstrations about AI technologies and applications.",
    },
    {
      icon: <Newspaper className="h-10 w-10 text-primary" />,
      title: "Curated Newsletter",
      description: "Stay updated with our weekly newsletter featuring the latest AI trends and insights.",
    },
    {
      icon: <Brain className="h-10 w-10 text-primary" />,
      title: "Learning Resources",
      description: "Access beginner-friendly guides and tutorials to start your AI journey.",
    },
    {
      icon: <Code className="h-10 w-10 text-primary" />,
      title: "Code Examples",
      description: "Explore practical code examples and implementations of AI technologies.",
    },
    {
      icon: <Lightbulb className="h-10 w-10 text-primary" />,
      title: "Community Insights",
      description: "Learn from experts and enthusiasts sharing their knowledge and experiences.",
    },
  ]

  return (
    <section className="container py-8 md:py-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything You Need to Master AI</h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          LiveBuildAI provides comprehensive resources to help you learn, build, and innovate with artificial
          intelligence.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="mb-2">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
