import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

// The JSON body the watchdog POSTs (application/json) to REVALIDATE_URL whenever
// a new presence mark lands for a bot. `bot-<id>` fires on every mark write;
// `bot-<id>-pages` fires only when the merged timeline's total_pages changed.
// The receiving endpoint must verify `token` and treat only 2xx as success
// (posting is fire-and-forget; failures are logged, never retried).
type RevalidateRequest = {
  token: string // REVALIDATE_TOKEN, the shared secret
  tag: string   // `bot-<id>` or `bot-<id>-pages`
}

// Example literal the watchdog sends:
//   POST https://site.example/revalidate
//   Content-Type: application/json
//   { "token": "s3cret", "tag": "bot-1450060292716494940" }

// Response the receiving endpoint should return. The watchdog checks only
// response.ok, but a structured body is handy for debugging/curl.
type RevalidateResponse = {
  revalidated: boolean
  now: number
  message?: string
}

// export async function POST(request: NextRequest) {
//   const body = await request.json()
//   if (body.token === process.env.REVALIDATE_TOKEN || process.env.NODE_ENV === "development") {
//     revalidatePath('/')
//   }
// }

export function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    revalidatePath('/')
    redirect('/')
  }
}


export async function POST(request: NextRequest) {
  const body = (await request.json()) as RevalidateRequest
  if (body.token !== process.env.REVALIDATE_TOKEN) {
    return Response.json({ revalidated: false, now: Date.now(), message: "invalid token" }, { status: 401 })
  }
  if (!body.tag.startsWith("bot-")) {
    return Response.json({ revalidated: false, now: Date.now(), message: "unexpected tag" }, { status: 400 })
  }
  revalidateTag('all-bots', 'max')
  revalidateTag(body.tag, 'max') // busts pages cached under this tag
  return Response.json({ revalidated: true, now: Date.now() })
}