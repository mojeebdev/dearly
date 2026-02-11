import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { generateMessage } from "@/lib/gemini";
import { supabaseAdmin } from "@/lib/supabase";

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

    // Validate required fields
    if (!recipientName || !senderName || !traits) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate AI message
    const message = await generateMessage({
      recipientName,
      senderName,
      relationship: relationship || "someone special",
      occasion: occasion || "birthday",
      traits,
      hobbies: hobbies || "various interests",
      tone: tone || "dearly",
    });

    // Create unique ID
    const id = nanoid(8);

    // Save to Supabase
    const { error: dbError } = await supabaseAdmin.from("greetings").insert({
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
    });

    if (dbError) {
      console.error("DB Error:", dbError);
      return NextResponse.json(
        { error: "Failed to save greeting" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id, message });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Dearly server error" },
      { status: 500 }
    );
  }
}