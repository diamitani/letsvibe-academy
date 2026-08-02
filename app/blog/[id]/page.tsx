"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getArticleById } from "@/lib/article-data"

interface BlogPostPageProps {
  params: {
    id: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const router = useRouter()

  useEffect(() => {
    const article = getArticleById(params.id)

    if (article) {
      // Redirect to the external article URL
      window.location.href = article.url
    } else {
      // If article not found, redirect to blog listing
      router.push("/blog")
    }
  }, [params.id, router])

  return (
    <div className="container py-12 flex justify-center items-center">
      <div className="text-center">
        <p className="text-lg">Redirecting to article...</p>
        <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  )
}
