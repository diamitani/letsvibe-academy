"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, LayoutGrid, Sparkles, Wrench } from "lucide-react"
import ToolsGrid from "@/components/tools-grid"
import { tools } from "@/lib/tools-data"
import { directoryTools, getDirectoryCategories } from "@/lib/ai-directory-data"
import { Card, CardContent } from "@/components/ui/card"

interface Collection {
  id: string
  label: string
  count: number
  allTools: typeof tools
  categories: string[]
}

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [collectionId, setCollectionId] = useState("directory")
  const [directoryCategory, setDirectoryCategory] = useState("all")
  const [gptCategory, setGptCategory] = useState("all")

  const collections: Collection[] = useMemo(
    () => [
      {
        id: "directory",
        label: "AI Directory",
        count: directoryTools.length,
        allTools: directoryTools,
        categories: ["all", ...getDirectoryCategories()],
      },
      {
        id: "gpts",
        label: "Custom GPTs",
        count: tools.length,
        allTools: tools,
        categories: ["all", ...Array.from(new Set(tools.map((t) => t.category)))],
      },
    ],
    []
  )

  const active = collections.find((c) => c.id === collectionId) ?? collections[0]
  const activeCategory = collectionId === "directory" ? directoryCategory : gptCategory

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return active.allTools.filter((tool) => {
      const categoryOk = activeCategory === "all" || tool.category === activeCategory
      const searchOk =
        q === "" ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
      return categoryOk && searchOk
    })
  }, [active, activeCategory, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">AI Tools Directory</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {directoryTools.length}+ free AI tools — chatbots, image & video generators, marketing, and
            creative apps — plus our curated custom GPTs. Powered by the open{" "}
            <a
              href="https://github.com/diamitani/aitooldirectory"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              aitooldirectory
            </a>{" "}
            dataset.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <LayoutGrid className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="text-2xl font-bold">{directoryTools.length}+</p>
                <p className="text-sm text-muted-foreground">AI tools listed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="text-2xl font-bold">{getDirectoryCategories().length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <Wrench className="h-8 w-8 text-primary shrink-0" />
              <div>
                <p className="text-2xl font-bold">{tools.length}</p>
                <p className="text-sm text-muted-foreground">Custom GPTs</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <form onSubmit={handleSearch} className="flex w-full max-w-lg items-center space-x-2">
          <Input
            placeholder={`Search ${active.count.toLocaleString()} tools...`}
            className="h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" size="icon" className="h-10 w-10" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <Tabs defaultValue="directory" value={collectionId} onValueChange={setCollectionId} className="w-full">
          <TabsList className="h-auto">
            {collections.map((c) => (
              <TabsTrigger key={c.id} value={c.id} className="text-sm">
                {c.label}
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{c.count}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {collections.map((c) => (
            <TabsContent key={c.id} value={c.id} className="mt-6">
              <Tabs
                defaultValue="all"
                value={collectionId === c.id ? activeCategory : "all"}
                onValueChange={(v) => {
                  if (c.id === "directory") setDirectoryCategory(v)
                  else setGptCategory(v)
                }}
                className="w-full"
              >
                <TabsList className="mb-8 flex flex-wrap h-auto">
                  {c.categories.map((category) => (
                    <TabsTrigger key={category} value={category} className="capitalize">
                      {category === "all" ? "All" : category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value={activeCategory} className="mt-0">
                  <div className="mb-4 text-sm text-muted-foreground">
                    Showing {filteredTools.length.toLocaleString()} tool{filteredTools.length === 1 ? "" : "s"}
                    {searchQuery.trim() && (
                      <>
                        {" "}
                        for “<span className="font-medium text-foreground">{searchQuery}</span>”
                      </>
                    )}
                  </div>
                  <ToolsGrid tools={filteredTools} buttonLabel={c.id === "gpts" ? "Open GPT" : "Visit"} />
                </TabsContent>
              </Tabs>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
