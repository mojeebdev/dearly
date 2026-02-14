import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { supabase } from "../../../lib/supabase";
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No food item (file) provided" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File is too heavy! Limit is 5MB." }, { status: 400 });
    }

    const allowedTypes = [
      "image/jpeg", 
      "image/png", 
      "image/webp", 
      "image/heif", 
      "image/jpg", 
      "image/heic", 
      "image/avif", 
      "image/gif"
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Please use a common image format." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${nanoid(12)}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    
    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Dearly error (Upload):", uploadError);
      return NextResponse.json(
        { error: "The fridge is full! Upload failed." },
        { status: 500 }
      );
    }

    
    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("Dearly error (Server):", err);
    return NextResponse.json(
      { error: "Internal server error in the Dearly kitchen." },
      { status: 500 }
    );
  }
}