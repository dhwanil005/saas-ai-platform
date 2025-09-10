import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const hf = new InferenceClient(process.env.HF_TOKEN!);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free Trial has expired", { status: 403 });
    }

    const response = await hf.textToVideo({
    provider: "replicate",
    model: "Wan-AI/Wan2.2-TI2V-5B",
	inputs: prompt,
});

    if (isPro) {
      await increaseApiLimit();
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const base64 = buffer.toString("base64");
    const videoUrl = `data:video/mp4;base64,${base64}`;
    return NextResponse.json(videoUrl);
  } catch (error) {
    console.log("CONVERSATION_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
