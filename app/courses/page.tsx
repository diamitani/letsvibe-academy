"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, Clock, ExternalLink, Rocket, Layers, CalendarDays } from "lucide-react"
import SectionRenderer from "@/components/section-renderer"
import {
  curriculumModules,
  projectLabs,
  bootcampDays,
  curriculumOverview,
} from "@/lib/curriculum-data"
import { courses, getCourseLevels, searchCourses } from "@/lib/course-directory-data"
import type { Course } from "@/lib/course-directory-data"

function ModuleAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {curriculumModules.map((module) => (
        <AccordionItem key={module.num} value={`m${module.num}`}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3 text-left">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {module.num}
              </span>
              <div>
                <p className="font-semibold">{module.title}</p>
                {module.duration && (
                  <p className="text-xs text-muted-foreground">
                    {module.duration}
                    {module.prerequisites && module.prerequisites !== "None" && (
                      <> · Prereq: {module.prerequisites}</>
                    )}
                  </p>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <SectionRenderer sections={module.sections} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

function LabsSection() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projectLabs.map((lab) => (
        <Card key={lab.num} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">Lab {lab.num}</Badge>
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">{lab.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <Accordion type="single" collapsible>
              <AccordionItem value="steps">
                <AccordionTrigger className="text-sm">Open build steps</AccordionTrigger>
                <AccordionContent>
                  <SectionRenderer sections={lab.sections} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function BootcampSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bootcampDays.map((day) => (
        <Card key={day.day}>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {day.day}
              </span>
              <p className="font-semibold">{day.focus}</p>
            </div>
            <p className="text-sm text-muted-foreground">{day.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function CourseDirectory() {
  const [query, setQuery] = useState("")
  const [level, setLevel] = useState("all")
  const levels = ["all", ...getCourseLevels()]

  const filtered: Course[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    return courses.filter((c) => {
      const levelOk = level === "all" || c.level === level
      const searchOk =
        q === "" ||
        c.name.toLowerCase().includes(q) ||
        c.provider.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      return levelOk && searchOk
    })
  }, [query, level])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${courses.length} courses...`}
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {levels.map((l) => (
            <Button
              key={l}
              size="sm"
              variant={level === l ? "default" : "outline"}
              onClick={() => setLevel(l)}
              className="capitalize"
            >
              {l === "all" ? "All Levels" : l}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {courses.length} courses
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardContent className="p-5 flex-grow">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl">{course.icon || "🎓"}</span>
                  <h3 className="font-semibold leading-snug truncate" title={course.name}>
                    {course.name}
                  </h3>
                </div>
              </div>
              <p className="text-sm font-medium text-primary mb-1">{course.provider}</p>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{course.description}</p>
              <div className="flex flex-wrap gap-2">
                {course.level && (
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                )}
                {course.price && (
                  <Badge variant="outline" className="text-xs">
                    {course.price}
                  </Badge>
                )}
              </div>
            </CardContent>
            <div className="px-5 pb-5">
              <Button size="sm" className="w-full" asChild>
                <a href={course.url} target="_blank" rel="noopener noreferrer">
                  View course
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function CoursesPage() {
  return (
    <div className="container py-12">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Learn Vibe Coding</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          A complete project-based path: foundations, hands-on labs, a 10-day bootcamp, and a directory of
          {courses.length} free courses from across the web.
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Layers className="h-4 w-4" /> {curriculumModules.length} modules
          </span>
          <span className="flex items-center gap-1.5">
            <Rocket className="h-4 w-4" /> {projectLabs.length} project labs
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" /> {bootcampDays.length}-day bootcamp
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> ~20 hours
          </span>
        </div>
      </div>

      <Tabs defaultValue="curriculum" className="w-full">
        <TabsList className="flex flex-wrap h-auto mb-8">
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="labs">Project Labs</TabsTrigger>
          <TabsTrigger value="bootcamp">10-Day Bootcamp</TabsTrigger>
          <TabsTrigger value="directory">
            Course Directory <span className="ml-1 text-xs">({courses.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum" className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {curriculumOverview}
              </p>
            </CardContent>
          </Card>
          <ModuleAccordion />
        </TabsContent>

        <TabsContent value="labs">
          <LabsSection />
        </TabsContent>

        <TabsContent value="bootcamp">
          <BootcampSection />
        </TabsContent>

        <TabsContent value="directory">
          <CourseDirectory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
