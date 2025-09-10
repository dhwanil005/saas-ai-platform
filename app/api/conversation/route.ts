import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const HF_TOKEN = process.env.HF_TOKEN;

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    if (!HF_TOKEN) {
      return new NextResponse("HF Token not configured", { status: 500 });
    }

    const body = await req.json();
    const { messages } = body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    
    if (!freeTrial && !isPro) {
      return new NextResponse("Free Trial expired", { status: 403 });
    }
    
    if (!isPro) {
      await increaseApiLimit();
    }

    const hfMessages = messages
      .filter((msg: any) => msg.role && msg.content && msg.content.trim() !== "")
      .map((msg: any) => ({
        role: msg.role, 
        content: msg.content.trim(), 
      }));

    if (hfMessages.length === 0) {
      return new NextResponse("No valid messages to send to HF", { status: 400 });
    }

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "HuggingFaceTB/SmolLM3-3B:hf-inference",
        messages: hfMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF API Error:", response.status, errorText);
      return new NextResponse(`HuggingFace API error: ${response.status}`, { 
        status: response.status 
      });
    }

    const result = await response.json();
  
    let hfContent = "I apologize, but I couldn't generate a response.";

    if (result?.choices?.[0]?.message?.content) {
      hfContent = result.choices[0].message.content;
    }

    if (hfContent.includes("<think>") && hfContent.includes("</think>")) {
   
      const thinkEndIndex = hfContent.indexOf("</think>");
      if (thinkEndIndex !== -1) {
        hfContent = hfContent.substring(thinkEndIndex + 8).trim();
      }
    }

    if (!hfContent || hfContent.trim() === "") {
      hfContent = "I apologize, but I couldn't generate a response.";
    }
    return NextResponse.json({
      role: "assistant",
      content: hfContent
    });

  } catch (error) {
    console.error("CONVERSATION_ERROR:", error);
    
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}