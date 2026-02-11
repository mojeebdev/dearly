import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import GreetingPage from "@/components/GreetingPage";
import { getOccasionEmoji } from "@/lib/utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface PageProps {
  params: Promise<{ id: string }>; // Updated to Promise
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params; // Await the ID
  
  const { data: greeting } = await supabase
    .from("greetings")
    .select("recipient_name, occasion, sender_name, photo_url")
    .eq("id", id)
    .single();

  if (!greeting) {
    return { title: "Greeting Not Found | Dearly" };
  }

  const emoji = getOccasionEmoji(greeting.occasion);
  const title = `${emoji} A Special Message for ${greeting.recipient_name}`;
  const description = `${greeting.sender_name} created a beautiful personal greeting for ${greeting.recipient_name}. Open to read it on Dearly.`;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/g/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Dearly",
      images: greeting.photo_url
        ? [{ url: greeting.photo_url, width: 1200, height: 630 }]
        : [{ url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-default.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function GreetingLandingPage({ params }: PageProps) {
  const { id } = await params; // Await the ID

  const { data: greeting, error } = await supabase
    .from("greetings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !greeting) {
    notFound();
  }

  // Increment view count (fire-and-forget)
  supabase
    .from("greetings")
    .update({ view_count: (greeting.view_count || 0) + 1 })
    .eq("id", id)
    .then();

  return <GreetingPage greeting={greeting} />;
}