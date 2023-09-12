import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const prompts = await prisma.prompt.findMany();

  return NextResponse.json({ prompts });
}
