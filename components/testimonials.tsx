import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      content:
        "LiveBuildAI has been an invaluable resource for my AI learning journey. The curated tools and tutorials have helped me build my first AI-powered application.",
      author: "Sarah Johnson",
      role: "Software Developer",
      avatar: "/placeholder.svg?height=40&width=40&query=woman with glasses",
    },
    {
      id: 2,
      content:
        "As someone new to AI, I was overwhelmed by the amount of information out there. LiveBuildAI simplified everything with its beginner-friendly resources.",
      author: "Michael Chen",
      role: "Data Scientist",
      avatar: "/placeholder.svg?height=40&width=40&query=asian man smiling",
    },
    {
      id: 3,
      content:
        "The newsletter is my weekly dose of AI insights. It keeps me updated with the latest trends and tools without having to spend hours researching.",
      author: "Emily Rodriguez",
      role: "Product Manager",
      avatar: "/placeholder.svg?height=40&width=40&query=latina woman professional",
    },
  ]

  return (
    <section className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">What Our Community Says</h2>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Hear from AI enthusiasts and professionals who have benefited from our platform.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="h-full flex flex-col">
            <CardContent className="pt-6 flex-grow">
              <Quote className="h-8 w-8 text-primary/40 mb-4" />
              <p className="text-muted-foreground">{testimonial.content}</p>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.author} />
                  <AvatarFallback>
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
