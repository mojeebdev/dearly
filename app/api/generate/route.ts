import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { streamMessage } from "../../../lib/gemini";
import { supabase } from "../../../lib/supabase";

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
      photoUrl,
    } = body;

    if (!recipientName || !senderName || !occasion) {
      return NextResponse.json({ error: "Dearly | Missing fields" }, { status: 400 });
    }

    
    const stream = await streamMessage({
      recipientName,
      senderName,
      relationship: relationship || "someone special",
      occasion,
      traits: traits || "wonderful",
      hobbies: hobbies || "life",
      tone: tone || "dearly",
    });

    const encoder = new TextEncoder();

    const customStream = new ReadableStream({
      async start(controller) {
        let fullMessage = "";

        try {
          
          for await (const chunk of stream) {
            const chunkText = chunk.text();
            fullMessage += chunkText;
            controller.enqueue(encoder.encode(chunkText));
          }

          
          const { data: savedGreeting, error: dbError } = await supabase
            .from("greetings")
            .insert({
              id: nanoid(8),
              recipient_name: recipientName,
              sender_name: senderName,
              relationship: relationship || "Special Person",
              occasion,
              traits: traits || "Kind",
              hobbies: hobbies || "",
              tone: tone || "sincere",
              message: fullMessage,
              photo_url: photoUrl || null,
            })
            .select("id, slug")
            .single();

          if (dbError) throw dbError;

          
          controller.enqueue(
            encoder.encode(
              "\n__META__" +
                JSON.stringify({
                  slug: savedGreeting.slug,
                  id: savedGreeting.id,
                })
            )
          );
        } catch (err) {
          console.error("Internal stream/save error:", err);
          controller.enqueue(
            encoder.encode("\n__META__" + JSON.stringify({ error: "Database save failed" }))
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Dearly Generate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
