"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { Menu, Search, X } from "lucide-react"
import Logo from "@/components/logo"

export default function Header() {
  const pathname = usePathname()
  const [showSearch, setShowSearch] = useState(false)

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/tools",
      label: "Tools",
      active: pathname === "/tools",
    },
    {
      href: "/videos",
      label: "Videos",
      active: pathname === "/videos" || pathname.startsWith("/videos/"),
    },
    {
      href: "/blog",
      label: "AI Articles",
      active: pathname === "/blog" || pathname.startsWith("/blog/"),
    },
    {
      href: "/newsletter",
      label: "Newsletter",
      active: pathname === "/newsletter",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <span className="hidden font-bold sm:inline-block">LiveBuildAI</span>
          </Link>

          <nav className="hidden md:flex items-center justify-center gap-8 flex-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-base font-medium transition-colors hover:text-primary",
                  route.active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="flex items-center">
              <Input placeholder="Search..." className="w-[200px] lg:w-[300px] h-9 mr-2" autoFocus />
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)} className="hidden sm:flex">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <ModeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-base font-medium transition-colors hover:text-primary",
                      route.active ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
