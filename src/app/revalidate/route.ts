import { revalidatePath } from "next/cache"
import type { NextRequest } from "next/server"

export function POST(request: NextRequest) {
  const sp = request.nextUrl.searchParams.get('t')
  if (sp === process.env.REVALIDATE_TOKEN) {
    revalidatePath('/')
  }
}