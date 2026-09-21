import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()
  if (body.token === process.env.REVALIDATE_TOKEN || process.env.NODE_ENV === "development") {
    revalidatePath('/')
  }
}

export function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    revalidatePath('/')
    redirect('/')
  }
}