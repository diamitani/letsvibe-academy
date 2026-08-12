import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface HubCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
  meta?: string
  accent?: string
}

export default function HubCard({ title, description, href, icon: Icon, meta, accent }: HubCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full hover:shadow-md transition-all hover:-translate-y-0.5 group">
        <CardContent className="p-6">
          <div
            className={`h-11 w-11 rounded-lg flex items-center justify-center mb-4 ${
              accent ?? "bg-primary/10 text-primary"
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{title}</h3>
            {meta && <span className="text-xs font-medium text-muted-foreground">{meta}</span>}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
