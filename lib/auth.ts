import { getServerSession, NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import { createClient, SupabaseClient } from "@supabase/supabase-js"

// Lazy-initialized clients — avoids module-scope crash during Next.js build
// when environment variables aren't set
let _supabaseAdmin: SupabaseClient | null = null
let _authOptions: NextAuthOptions | null = null

function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      throw new Error(
        "Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
      )
    }

    _supabaseAdmin = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }
  return _supabaseAdmin
}

export function getAuthOptions(): NextAuthOptions {
  if (_authOptions) return _authOptions

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseRoleKey) {
    throw new Error(
      "Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
    )
  }

  _authOptions = {
    adapter: SupabaseAdapter({
      url: supabaseUrl,
      secret: supabaseRoleKey,
    }),
    providers: [
      CredentialsProvider({
        id: "email-signup",
        name: "Email Sign Up",
        credentials: {
          email: { label: "Email", type: "email", placeholder: "you@example.com" },
          password: { label: "Password", type: "password" },
          name: { label: "Full Name", type: "text" },
          action: { label: "Action", type: "text" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required.")
          }

          const admin = getSupabaseAdmin()
          const isSignUp = credentials.action === "signup"

          if (isSignUp) {
            if (!credentials.name) {
              throw new Error("Name is required for sign up.")
            }

            const { data: existingUser } = await admin
              .from("profiles")
              .select("id")
              .eq("email", credentials.email.toLowerCase().trim())
              .single()

            if (existingUser) {
              throw new Error("An account with this email already exists. Please sign in instead.")
            }

            if (credentials.password.length < 8) {
              throw new Error("Password must be at least 8 characters.")
            }

            const { data: authUser, error: authError } =
              await admin.auth.admin.createUser({
                email: credentials.email.toLowerCase().trim(),
                password: credentials.password,
                email_confirm: true,
                user_metadata: { full_name: credentials.name },
              })

            if (authError) throw new Error(authError.message)

            if (authUser.user) {
              await admin.from("profiles").upsert({
                id: authUser.user.id,
                email: authUser.user.email!,
                full_name: credentials.name,
                onboarding_completed: false,
              })

              await admin.from("subscriptions").insert({
                user_id: authUser.user.id,
                plan_id: "00000000-0000-0000-0000-000000000001",
                status: "active",
              })

              return {
                id: authUser.user.id,
                email: authUser.user.email!,
                name: credentials.name,
              }
            }
            throw new Error("Failed to create user account.")
          }

          // Sign-in flow
          const { data: authData, error: signInError } =
            await admin.auth.signInWithPassword({
              email: credentials.email.toLowerCase().trim(),
              password: credentials.password,
            })

          if (signInError) {
            throw new Error("Invalid email or password. Please try again.")
          }

          if (!authData.user) {
            throw new Error("Unable to sign in.")
          }

          const { data: profile } = await admin
            .from("profiles")
            .select("full_name")
            .eq("id", authData.user.id)
            .single()

          return {
            id: authData.user.id,
            email: authData.user.email!,
            name: profile?.full_name || authData.user.email,
          }
        },
      }),
      CredentialsProvider({
        id: "email-signin",
        name: "Email Sign In",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required.")
          }

          const admin = getSupabaseAdmin()
          const { data: authData, error } =
            await admin.auth.signInWithPassword({
              email: credentials.email.toLowerCase().trim(),
              password: credentials.password,
            })

          if (error || !authData.user) {
            throw new Error("Invalid email or password.")
          }

          const { data: profile } = await admin
            .from("profiles")
            .select("full_name")
            .eq("id", authData.user.id)
            .single()

          return {
            id: authData.user.id,
            email: authData.user.email!,
            name: profile?.full_name || authData.user.email,
          }
        },
      }),
    ],
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
      async jwt({ token, user, account }) {
        if (user) {
          token.id = user.id
          token.email = user.email
          token.name = user.name
        }
        if (account) {
          token.provider = account.provider
        }
        return token
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.id = token.id as string
          session.user.email = token.email as string
          session.user.name = token.name as string | null
        }
        return session
      },
      async signIn() {
        return true
      },
    },
    events: {
      async createUser({ user }) {
        if (user.id) {
          const admin = getSupabaseAdmin()
          await admin.from("subscriptions").insert({
            user_id: user.id,
            plan_id: "00000000-0000-0000-0000-000000000001",
            status: "active",
          })
        }
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
  }

  return _authOptions
}

/**
 * Get the current session in server components or API routes.
 */
export async function getSession() {
  return getServerSession(getAuthOptions())
}

/**
 * Backward-compatible authOptions export for the NextAuth route handler.
 */
export const authOptions = getAuthOptions as unknown as NextAuthOptions