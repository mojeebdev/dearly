import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import GreetingPage from "@/components/GreetingPage";
import { getOccasionEmoji } from "@/lib/utils";

interface PageProps {
  params: Promise<{ occasion: string; name: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { occasion, name } = await params;
  const slug = `${occasion}/${name}`;

  const { data: greeting } = await supabase
    .from("greetings")
    .select("recipient_name, occasion, sender_name, photo_url")
    .eq("slug", slug)
    .single();

  if (!greeting) {
    return { title: "Greeting Not Found | Dearly" };
  }

  const emoji = getOccasionEmoji(greeting.occasion);
  const title = `${emoji} A Special Message for ${greeting.recipient_name}`;
  const description = `A heartfelt ${greeting.occasion} greeting from ${greeting.sender_name}.`;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dearly.icu";
  const url = `${baseUrl}/g/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Dearly",
      images: greeting.photo_url
        ? [{ url: greeting.photo_url, width: 800, height: 800 }]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: greeting.photo_url ? [greeting.photo_url] : [],
    },
  };
}

export default async function GreetingLandingPage({ params }: PageProps) {
  const { occasion, name } = await params;
  const slug = `${occasion}/${name}`;

  // Try slug first (new format: occasion/name)
  let { data: greeting } = await supabase
    .from("greetings")
    .select("*")
    .eq("slug", slug)
    .single();

  // Fall back to id for old records
  if (!greeting) {
    const { data: backupGreeting } = await supabase
      .from("greetings")
      .select("*")
      .eq("id", name)
      .single();

    if (!backupGreeting) notFound();
    greeting = backupGreeting;
  }

  // Fire-and-forget view count
  supabase
    .from("greetings")
    .update({ view_count: (greeting.view_count || 0) + 1 })
    .eq("id", greeting.id)
    .then();

  return <GreetingPage greeting={greeting} />;
}
