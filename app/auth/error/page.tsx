"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "An unexpected error occurred."

  const errorMessages: Record<string, string> = {
    OAuthSignin: "There was a problem signing in with your provider. Please try again.",
    OAuthCallback: "There was a problem with the authentication callback. Please try again.",
    OAuthCreateAccount: "There was a problem creating your account. Please try again.",
    EmailCreateAccount: "There was a problem creating your account. Please try again.",
    Callback: "There was a problem with the authentication callback.",
    OAuthAccountNotLinked: "This account is already linked to another sign-in method.",
    EmailSignin: "The sign-in link is invalid or has expired.",
    CredentialsSignin: "Invalid email or password.",
    SessionRequired: "You must be signed in to access this page.",
    default: "An unexpected authentication error occurred. Please try again.",
  }

  const message = errorMessages[error] || errorMessages.default

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/signin">Try Again</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthErrorPage() {
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
      <ErrorContent />
    </Suspense>
  )
}