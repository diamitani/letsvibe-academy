"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import VideoGrid from "@/components/video-grid"
import { getAllCategories } from "@/lib/video-data"

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const categories = ["all", ...getAllCategories()]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search functionality would be implemented here
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">AI Video Content</h1>
          <p className="text-muted-foreground text-lg">
            Watch tutorials, interviews, and demonstrations about AI technologies, automation, and applications.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2">
          <Input
            placeholder="Search videos..."
            className="h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" size="icon" className="h-10 w-10">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8 flex flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category === "all" ? "All Videos" : category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <VideoGrid category={category} searchQuery={searchQuery} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
