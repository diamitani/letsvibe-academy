import NextAuth from "next-auth"
import { getAuthOptions } from "@/lib/auth"

// Lazily create the handler to avoid environment variable evaluation at build time
async function handler(req: Request, ctx: { params: Promise<{ nextauth: string[] }> }) {
  const authHandler = NextAuth(getAuthOptions())
  // NextAuth returns { GET, POST, ... }, we need to route based on method
  const handlers = authHandler as unknown as Record<string, (req: Request, ctx: unknown) => Promise<Response>>
  const method = req.method.toUpperCase()
  const handlerFn = handlers[method]
  if (!handlerFn) {
    return new Response("Method Not Allowed", { status: 405 })
  }
  return handlerFn(req, ctx)
}

export { handler as GET, handler as POST }