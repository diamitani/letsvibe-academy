"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { Menu, Search, X, LogOut, LayoutDashboard, Settings, User } from "lucide-react"
import Logo from "@/components/logo"

export default function Header() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [showSearch, setShowSearch] = useState(false)

  const isAuthenticated = status === "authenticated"
  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session?.user?.email?.charAt(0).toUpperCase() || "U"

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/courses",
      label: "Learn",
      active: pathname === "/courses" || pathname.startsWith("/courses/"),
    },
    {
      href: "/tools",
      label: "Tools",
      active: pathname === "/tools",
    },
    {
      href: "/tutorials",
      label: "Tutorials",
      active: pathname === "/tutorials" || pathname.startsWith("/tutorials/"),
    },
    {
      href: "/videos",
      label: "Videos",
      active: pathname === "/videos" || pathname.startsWith("/videos/"),
    },
    {
      href: "/blog",
      label: "Articles",
      active: pathname === "/blog" || pathname.startsWith("/blog/"),
    },
    {
      href: "/resources",
      label: "Resources",
      active: pathname === "/resources",
    },
    {
      href: "/dashboard",
      label: "Workspace",
      active: pathname === "/dashboard",
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
            <span className="hidden font-bold sm:inline-block">LetsVibeAI</span>
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

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session?.user?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild className="hidden sm:flex">
                <Link href="/auth/signup">Start Free</Link>
              </Button>
            </>
          )}

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
                <div className="border-t pt-4 mt-2">
                  {isAuthenticated ? (
                    <>
                      <Link href="/dashboard" className="block py-2 text-base font-medium text-muted-foreground hover:text-primary">
                        Dashboard
                      </Link>
                      <Link href="/profile" className="block py-2 text-base font-medium text-muted-foreground hover:text-primary">
                        Profile
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="block py-2 text-base font-medium text-destructive hover:text-destructive/80"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/signin" className="block py-2 text-base font-medium text-muted-foreground hover:text-primary">
                        Sign In
                      </Link>
                      <Link href="/auth/signup" className="block py-2 text-base font-medium text-primary hover:text-primary/80">
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}