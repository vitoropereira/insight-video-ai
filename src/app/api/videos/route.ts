import fs from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { writeFile } from "node:fs/promises";
import { prisma } from "@/lib/prisma";

const pump = promisify(pipeline);

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  console.log("file");
  console.log(file);
  if (!file) {
    return NextResponse.json({ error: "Missing file input." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const extension = path.extname(file.name);

  if (extension !== ".mp3") {
    return NextResponse.json(
      { error: "Invalid input type, please upload a MP3." },
      { status: 400 }
    );
  }

  const fileBaseName = path.basename(file.name, extension);

  const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`;

  const uploadDestination = path.resolve(
    __dirname,
    "../../../../../temp",
    fileUploadName
  );

  const originalPath = uploadDestination;
  await writeFile(originalPath, buffer);

  const video = await prisma.video.create({
    data: {
      name: file.name,
      path: uploadDestination,
    },
  });

  return NextResponse.json({ video });
}
