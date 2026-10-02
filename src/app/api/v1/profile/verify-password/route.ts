// src/app/api/profile/route.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { password } = await req.json();

  try {
    await auth.api.verifyPassword({
      body: { password },
      headers: req.headers,
    });
  } catch {
    return Response.json({ error: `Invalid password` }, { status: 400 });
  }

  return Response.json({ verified: true });
}
