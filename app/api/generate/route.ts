import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { generateMessage } from "@/lib/gemini";
// Keeping your specific path and name
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

    // Validate required fields for our Guardians
    if (!recipientName || !senderName || !traits) {
      return NextResponse.json(
        { error: "Missing required fields for Dearly greeting" },
        { status: 400 }
      );
    }

    
    const message = await generateMessage({
      recipientName,
      senderName,
      relationship: relationship || "someone special",
      occasion: occasion || "a special moment",
      traits,
      hobbies: hobbies || "their unique passions",
      tone: tone || "heartfelt",
    });

    
    const id = nanoid(8);

    const { error: dbError } = await supabase.from("greetings").insert({
      id,
      recipient_name: recipientName,
      sender_name: senderName,
      relationship,
      occasion,
      traits,
      hobbies,
      tone,
      message,
      photo_url: photoUrl || null,
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("Dearly DB Error:", dbError);
      return NextResponse.json(
        { error: "Failed to save your Dearly greeting" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id, message });
  } catch (err) {
    console.error("Dearly Gemini Generate error:", err);
    return NextResponse.json(
      { error: "Internal server error in Dearly Gemini engine" },
      { status: 500 }
    );
  }
}