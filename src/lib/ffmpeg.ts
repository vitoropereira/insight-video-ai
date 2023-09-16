import { FFmpeg } from "@ffmpeg/ffmpeg";
import { env } from "@/env";
import { toBlobURL } from "@ffmpeg/util";

let ffmpeg: FFmpeg | null;

const coreURL = new URL(
  "/ffmpeg-dist/ffmpeg-core.js",
  env.NEXT_PUBLIC_VERCEL_URL
).href;

const wasmURL = new URL(
  "/ffmpeg-dist/ffmpeg-core.wasm",
  env.NEXT_PUBLIC_VERCEL_URL
).href;

const workerURL = new URL(
  "/ffmpeg-dist/ffmpeg-core.worker.js",
  env.NEXT_PUBLIC_VERCEL_URL
).href;

export async function getFfmpeg() {
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";

  if (ffmpeg) {
    return ffmpeg;
  }

  ffmpeg = new FFmpeg();

  // const coreURL = await toBlobURL(
  //   `../ffmpeg-dist/ffmpeg-core.js`,
  //   "text/javascript"
  // );
  // const wasmURL = await toBlobURL(
  //   `../ffmpeg-dist/ffmpeg-core.wasm`,
  //   "application/wasm"
  // );
  // const workerURL = await toBlobURL(
  //   `../ffmpeg-dist/ffmpeg-core.worker.js`,
  //   "text/javascript"
  // );

  // console.log({
  //   coreURL,
  //   wasmURL,
  //   workerURL,
  // });

  if (!ffmpeg.loaded) {
    console.log("entrei!!");

    await ffmpeg.load({
      // coreURL,
      // wasmURL,
      // workerURL,
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript"
      ),
    });
  }
  // console.log("ffmpeg");
  // console.log(ffmpeg);
  return ffmpeg;
}
