import { prisma } from "@/lib/prisma";
import { createReadStream } from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { openai } from "@/lib/openai";

const transcriptionVideoParamsSchema = z.object({
  videoId: z.string().uuid(),
});

const bodySchema = z.object({
  prompt: z.string(),
});

type TranscriptionVideoParamsSchema = z.infer<
  typeof transcriptionVideoParamsSchema
>;

export async function POST(
  request: NextRequest,
  { params }: { params: TranscriptionVideoParamsSchema }
) {
  const { videoId } = transcriptionVideoParamsSchema.parse(params);

  const { prompt } = bodySchema.parse(await request.json());

  const video = await prisma.video.findFirstOrThrow({
    where: {
      id: videoId,
    },
  });

  const videoPath = video.path;
  const audioReadStream = createReadStream(videoPath);

  const response = await openai.audio.transcriptions.create({
    file: audioReadStream,
    model: "whisper-1",
    language: "pt",
    response_format: "json",
    temperature: 0,
    prompt,
  });

  const transcription = response.text;

  await prisma.video.update({
    where: {
      id: videoId,
    },
    data: {
      transcription,
    },
  });

  return NextResponse.json(transcription);
}
