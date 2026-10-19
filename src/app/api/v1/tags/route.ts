import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const tags = await prisma.tag.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, createdAt: true },
  });

  return NextResponse.json(
    tags.map((t) => ({
      tagId: t.id,
      label: t.name,
      createdAt: t.createdAt.toISOString(),
    })),
  );
}
