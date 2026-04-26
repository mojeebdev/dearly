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

    // Initialize the AI stream from Gemini
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

        // Send initial status to the UI
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              status: "Patiently creating your beautiful message...",
              info: "Takes about 15 seconds · Free · No sign-up required",
            }) + "\n"
          )
        );

        try {
          // Stream the text chunks to the frontend as they arrive
          for await (const chunk of stream) {
            const chunkText = chunk.text();
            fullMessage += chunkText;
            controller.enqueue(encoder.encode(chunkText));
          }

          /** 
           * SAVE TO DATABASE 
           * We send 'id' to satisfy the DB constraint.
           * We DO NOT send 'slug' so the Trigger creates a clean one (e.g. 'fateemah').
           */
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
            .select("slug") 
            .single();

          if (dbError) throw dbError;

          // Send the final clean slug back to the client for redirecting
          controller.enqueue(
            encoder.encode(
              "\n" + JSON.stringify({
                done: true,
                slug: savedGreeting.slug,
              })
            )
          );

        } catch (err) {
          console.error("Internal stream/save error:", err);
          controller.enqueue(encoder.encode("\n" + JSON.stringify({ error: "Database save failed" })));
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
