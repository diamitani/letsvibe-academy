import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play } from "lucide-react"
import Link from "next/link"

interface VideosGridProps {
  category: string
}

export default function VideosGrid({ category }: VideosGridProps) {
  // This would typically come from an API or database
  const videos = [
    {
      id: 1,
      title: "Getting Started with GPT-4",
      description: "Learn how to use OpenAI's GPT-4 for various applications and use cases.",
      duration: "15:24",
      thumbnail: "/ai-tutorial-thumbnail-code.png",
      category: "Tutorial",
      date: "2025-04-15",
    },
    {
      id: 2,
      title: "Building AI-Powered Applications",
      description: "A step-by-step guide to integrating AI capabilities into your applications.",
      duration: "22:10",
      thumbnail: "/ai-developer.png",
      category: "Development",
      date: "2025-04-10",
    },
    {
      id: 3,
      title: "The Future of AI: Expert Panel",
      description: "Industry experts discuss the future trends and developments in artificial intelligence.",
      duration: "45:30",
      thumbnail: "/placeholder.svg?height=200&width=350&query=AI expert panel discussion",
      category: "Interview",
      date: "2025-04-05",
    },
    {
      id: 4,
      title: "Machine Learning Fundamentals",
      description: "An introduction to the core concepts and techniques in machine learning.",
      duration: "28:15",
      thumbnail: "/placeholder.svg?height=200&width=350&query=machine learning concepts visualization",
      category: "Tutorial",
      date: "2025-03-28",
    },
    {
      id: 5,
      title: "AI Ethics and Responsible Development",
      description: "Understanding the ethical considerations in AI development and deployment.",
      duration: "33:42",
      thumbnail: "/placeholder.svg?height=200&width=350&query=AI ethics concept",
      category: "Discussion",
      date: "2025-03-20",
    },
    {
      id: 6,
      title: "Computer Vision Applications",
      description: "Exploring real-world applications of computer vision technology.",
      duration: "19:55",
      thumbnail: "/placeholder.svg?height=200&width=350&query=computer vision technology",
      category: "Demonstration",
      date: "2025-03-15",
    },
    {
      id: 7,
      title: "Natural Language Processing Deep Dive",
      description: "Advanced techniques and models in natural language processing.",
      duration: "26:18",
      thumbnail: "/placeholder.svg?height=200&width=350&query=NLP concept visualization",
      category: "Tutorial",
      date: "2025-03-08",
    },
    {
      id: 8,
      title: "AI in Healthcare: Transforming Patient Care",
      description: "How artificial intelligence is revolutionizing healthcare and improving patient outcomes.",
      duration: "38:05",
      thumbnail: "/placeholder.svg?height=200&width=350&query=AI in healthcare concept",
      category: "Interview",
      date: "2025-03-01",
    },
  ]

  // Filter videos based on category
  const filteredVideos =
    category === "all"
      ? videos
      : videos.filter(
          (video) =>
            video.category.toLowerCase() === category ||
            (category === "tutorials" && video.category === "Tutorial") ||
            (category === "interviews" && video.category === "Interview") ||
            (category === "demos" && video.category === "Demonstration"),
        )

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredVideos.map((video) => (
        <Link href={`/videos/${video.id}`} key={video.id}>
          <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={video.thumbnail || "/placeholder.svg"}
                alt={video.title}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                <div className="rounded-full bg-primary p-3">
                  <Play className="h-6 w-6 text-white" fill="white" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
              <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                {video.category}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{video.description}</p>
              <div className="flex justify-between items-center">
                <Badge variant="outline">{new Date(video.date).toLocaleDateString()}</Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
