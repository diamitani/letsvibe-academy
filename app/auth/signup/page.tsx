"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Logo from "@/components/logo"
import { Mail, AlertCircle, CheckCircle2 } from "lucide-react"

function SignUpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validatePassword = (pw: string): string | null => {
    if (pw.length < 8) return "Password must be at least 8 characters."
    if (!/[A-Z]/.test(pw)) return "Password must contain at least one uppercase letter."
    if (!/[a-z]/.test(pw)) return "Password must contain at least one lowercase letter."
    if (!/[0-9]/.test(pw)) return "Password must contain at least one number."
    return null
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name || !email || !password) {
      setError("All fields are required.")
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    setIsLoading(true)

    const result = await signIn("email-signup", {
      name,
      email,
      password,
      action: "signup",
      redirect: false,
    })

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push(callbackUrl)
        router.refresh()
      }, 1500)
    }
  }

  if (success) {
    return (
      <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-12 pb-8 space-y-4">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="text-2xl font-bold">Account Created!</h2>
            <p className="text-muted-foreground">
              Welcome to LetsVibeAI. Redirecting you to your dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-8" />
              <span className="font-bold text-xl">LetsVibeAI</span>
            </Link>
          </div>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Start building AI-powered projects today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                autoComplete="name"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                required
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with uppercase, lowercase, and a number.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              <Mail className="mr-2 h-4 w-4" />
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-12 pb-8">
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  )
}