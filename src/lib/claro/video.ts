import { createServerFn } from "@tanstack/react-start";
import { threeBeats, type Lang } from "@/lib/claro/compose";

type VideoAsk = {
  name: string;
  line: string;
  city: string;
  hours: string;
  price: string;
  who: string;
  post: string;
  visit: string;
  script: string;
  lang: Lang;
  image?: string;
  fromVideo?: boolean;
};

function clip(value: string, max: number) {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function cleanScript(value: string) {
  return value
    .split("\n")
    .map((line) => line.replace(/[^\S\n]+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 3)
    .join("\n")
    .slice(0, 400);
}

function promptFor(data: VideoAsk) {
  const edited = data.script
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 3);
  const lines =
    edited.length === 3
      ? edited
      : threeBeats(
          {
            line: data.line,
            name: data.name,
            city: data.city,
            hours: data.hours,
            price: data.price,
            visit: data.visit,
          },
          data.lang,
        );
  const language = data.lang === "es" ? "Spanish" : "English";
  const listed = lines.map((line, index) => `${index + 1}. ${line}`).join(" ");
  const words = `Speak these three lines in ${language}, slowly, every word, including the last word. Show only these three lines, one per row, in the top half. The bottom third stays empty. Do not repeat a line. Do not add a title under them. Do not cut a word. Do not add a price, a day, or a claim that is not in the lines. ${listed}`;
  if (data.image) {
    return [
      "A 6-second vertical phone video that starts on this photo.",
      data.fromVideo ? "The photo is one frame from a video the owner filmed." : "",
      "Keep the same place and objects. Do not add people who are not already there. No logos. Never write a web address.",
      words,
    ]
      .filter(Boolean)
      .join(" ");
  }
  return [
    "A 6-second vertical phone video.",
    "Warm paper background, large ink type, one terracotta accent, like a printed card.",
    "Never write a web address on screen.",
    words,
  ].join(" ");
}

function cleanImage(value: string) {
  if (!value) return "";
  if (!/^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=\s]+$/i.test(value)) {
    throw new Error("Use a photo.");
  }
  if (value.length > 1_800_000) throw new Error("That photo is too big.");
  return value;
}

export const startShopVideo = createServerFn({ method: "POST" })
  .validator((input: VideoAsk) => {
    const image = cleanImage(input?.image ?? "");
    const line = clip(input?.line ?? "", 400);
    if (!image && line.length < 8) throw new Error("Add words, a photo, or a video first.");
    return {
      name: clip(input?.name ?? "", 80) || line.slice(0, 80) || "Shop",
      line: line || clip(input?.post ?? "", 400),
      city: clip(input?.city ?? "", 60),
      hours: clip(input?.hours ?? "", 80),
      price: clip(input?.price ?? "", 40),
      who: clip(input?.who ?? "", 80),
      post: clip(input?.post ?? "", 700),
      visit: clip(input?.visit ?? "", 80),
      script: cleanScript(input?.script ?? ""),
      lang: input?.lang === "en" ? "en" : "es",
      image,
      fromVideo: Boolean(input?.fromVideo),
    } satisfies VideoAsk;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Video isn't available right now." };

    const payload: {
      model: string;
      prompt: string;
      duration: number;
      aspect_ratio?: string;
      resolution: string;
      image?: { url: string };
    } = {
      model: "grok-imagine-video",
      prompt: promptFor(data),
      duration: 6,
      resolution: "480p",
    };
    if (data.image) payload.image = { url: data.image };
    else payload.aspect_ratio = "9:16";

    const res = await fetch("https://api.x.ai/v1/videos/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) return { ok: false as const, error: `Couldn't start the video (${res.status}).` };
    const body = (await res.json()) as { request_id?: string };
    if (!body.request_id) return { ok: false as const, error: "No video id came back." };
    return { ok: true as const, requestId: body.request_id };
  });

export const pollShopVideo = createServerFn({ method: "POST" })
  .validator((input: { requestId: string }) => {
    if (!input?.requestId || !/^[\w-]{8,80}$/.test(input.requestId)) {
      throw new Error("Bad video id.");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Video isn't available right now." };

    const res = await fetch(`https://api.x.ai/v1/videos/${data.requestId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (res.status === 202) return { ok: true as const, status: "pending" as const };
    if (!res.ok) return { ok: false as const, error: `Video check failed (${res.status}).` };

    const body = (await res.json()) as {
      status?: string;
      progress?: number;
      video?: { url?: string };
      error?: { message?: string };
    };
    if (body.status === "done" && body.video?.url) {
      return { ok: true as const, status: "done" as const, url: body.video.url };
    }
    if (body.status === "failed") {
      return { ok: false as const, error: body.error?.message || "The video didn't finish." };
    }
    return { ok: true as const, status: "pending" as const, progress: body.progress ?? 0 };
  });
