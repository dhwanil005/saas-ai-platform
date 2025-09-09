import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!process.env.HF_TOKEN) {
      return new NextResponse("Hugging Face API Key not configured", { status: 500 });
    }

    if (!prompt) return new NextResponse("Prompt is required", { status: 400 });

    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount < 1) {
      return new NextResponse("Invalid amount", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free Trial has expired", { status: 403 });
    }

    const [width, height] = resolution.split("x").map(Number);
    if (isNaN(width) || isNaN(height)) {
      return new NextResponse("Invalid resolution", { status: 400 });
    }

    const hfBody = {
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      prompt,
      width,
      height,
      response_format: "b64_json",
      num_images: numAmount,
    };

    const hfResponse = await fetch(
      "https://router.huggingface.co/nscale/v1/images/generations",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hfBody),
      }
    );

    const data = await hfResponse.json();

    const imagesArray = data.data; 
    if (!imagesArray || imagesArray.length === 0) {
      console.error("No images generated. Full response:", data);
      return new NextResponse("No images generated", { status: 500 });
    }

    const urls = imagesArray.map((img: { b64_json: string }) => `data:image/png;base64,${img.b64_json}`);

    if (!isPro) await increaseApiLimit();

    return NextResponse.json(urls);

  } catch (error) {
    console.error("CODE_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
