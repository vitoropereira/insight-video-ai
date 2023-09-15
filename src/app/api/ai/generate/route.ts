import { prisma } from "@/lib/prisma";
import { createReadStream } from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "@/lib/openai";
import { StreamingTextResponse, OpenAIStream } from "ai";

const bodySchema = z.object({
  videoId: z.string(),
  prompt: z.string(),
  temperature: z.number().min(0).max(1).default(0.5),
});

export async function POST(request: NextRequest) {
  const { videoId, prompt, temperature } = bodySchema.parse(
    await request.json()
  );

  const video = await prisma.video.findFirstOrThrow({
    where: {
      id: videoId,
    },
  });

  if (!video.transcription) {
    return NextResponse.json(
      { error: "Video transcription was not generated yet." },
      { status: 400 }
    );
  }

  const promptMessage = prompt.replace("{transcription}", video.transcription);

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    temperature,
    messages: [
      {
        role: "user",
        content: promptMessage,
      },
    ],
    stream: true,
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}
