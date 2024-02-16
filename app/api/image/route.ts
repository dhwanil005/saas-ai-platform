import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/index.mjs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
const instructionMessage: ChatCompletionMessageParam = {
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations."
}
export async function POST(
    req: Request
) {
    try {
        const {userId} = auth();
        const body = await req.json();
        const {prompt,amount=1,resolution="512x512"} = body;

        if(!userId){
            return new NextResponse("Unauthorised",{status:401})
        }

        if(!openai.apiKey) {
            return new NextResponse("OpenAI API Key not configured",{status:500})
        }

        if(!prompt) {
            return new NextResponse("Prompt is required", { status: 400})
        }

        if(!amount) {
            return new NextResponse("Amount is required", { status: 400})
        }

        if(!resolution) {
            return new NextResponse("Resolution is required", { status: 400})
        }
        const numAmount = parseInt(amount, 10);
        if (isNaN(numAmount) || numAmount < 1) {
          return new NextResponse("Invalid amount", { status: 400 });
        }
    
        const response = await openai.images.generate({
          model: "dall-e-2",
          prompt: prompt,
          n: numAmount,
          size: resolution,
        });

        let urls = response.data?.map((item) => item.url);
        if (!urls || urls.length === 0) {
          return new NextResponse("No images generated", { status: 404 });
        }
        
        return NextResponse.json(urls);
        
    } catch(error) {
        console.log("CODE_ERROR", error);
        return new NextResponse("Internal Error", {status:500})
    }
}