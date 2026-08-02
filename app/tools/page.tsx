"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, ExternalLink } from "lucide-react"
import ToolsGrid from "@/components/tools-grid"
import { getAllCategories } from "@/lib/tools-data"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export default function ToolsPage() {
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
          <h1 className="text-4xl font-bold tracking-tight">AI Tools Directory</h1>
          <p className="text-muted-foreground text-lg">
            Discover and explore our curated collection of custom GPTs to enhance your projects and workflow.
          </p>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Looking for more tools?</h2>
              <p className="text-muted-foreground">Check out our extended collection of AI tools and resources.</p>
            </div>
            <Button size="lg" className="whitespace-nowrap" asChild>
              <Link href="https://gptpataitools.vercel.app" target="_blank" rel="noopener noreferrer">
                Additional Tools
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2">
          <Input
            placeholder="Search for tools..."
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
                {category === "all" ? "All Tools" : category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <ToolsGrid category={category} searchQuery={searchQuery} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
