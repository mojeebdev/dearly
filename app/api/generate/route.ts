import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { streamMessage } from "@/lib/gemini"; 
import { supabase } from "@/lib/supabase";

// Standard Node.js runtime for stability (allows for 30s+ processing)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      recipientName, 
      senderName, 
      relationship, 
      occasion, 
      traits, 
      hobbies, 
      tone, 
      photoUrl 
    } = body;

    
    if (!recipientName || !senderName || !occasion) {
      return NextResponse.json({ error: "Dearly | Missing fields" }, { status: 400 });
    }

    const id = nanoid(8);
    
    
    const stream = await streamMessage({
      recipientName,
      senderName,
      relationship: relationship || "someone special",
      occasion: occasion,
      traits: traits || "wonderful",
      hobbies: hobbies || "life",
      tone: tone || "dearly",
    });

    const encoder = new TextEncoder();
    
    const customStream = new ReadableStream({
      async start(controller) {
        let fullMessage = "";
        
        // Immediate metadata for the frontend to handle the 30s wait
        controller.enqueue(encoder.encode(JSON.stringify({ 
          id, 
          status: "Patiently creating your beautiful message...",
          info: "Takes about 30 seconds · Free · No sign-up required" 
        }) + "\n"));

        try {
          for await (const chunk of stream) {
            const chunkText = chunk.text();
            fullMessage += chunkText;
            
            controller.enqueue(encoder.encode(chunkText));
          }

          
          await supabase.from("greetings").insert({
            id: id,
            recipient_name: recipientName,
            sender_name: senderName,
            relationship: relationship || "Special Person",
            occasion: occasion,
            traits: traits || "Kind",
            hobbies: hobbies || "",
            tone: tone || "sincere",
            message: fullMessage, 
            photo_url: photoUrl || null,
            created_at: new Date().toISOString(),
          });
          
        } catch (streamErr) {
          console.error("Streaming error inside ReadableStream:", streamErr);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(customStream, {
      headers: { 
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      },
    });

  } catch (err) {
    console.error("Dearly Generate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}