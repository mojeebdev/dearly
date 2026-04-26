import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import GreetingPage from "@/components/GreetingPage";
import { getOccasionEmoji } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Use .maybeSingle() to prevent the app from crashing if not found
  const { data: greeting } = await supabase
    .from("greetings")
    .select("recipient_name, occasion, sender_name, photo_url")
    .ilike("slug", slug) // Case-insensitive match
    .maybeSingle();

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
      images: greeting.photo_url ? [{ url: greeting.photo_url, width: 800, height: 800 }] : [],
      type: "website",
    },
  };
}

export default async function GreetingLandingPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Try finding by SLUG first (Case-Insensitive)
  let { data: greeting } = await supabase
    .from("greetings")
    .select("*")
    .ilike("slug", slug)
    .maybeSingle();

  // 2. Fallback: Check if the slug provided is actually an ID
  if (!greeting) {
    const { data: byId } = await supabase
      .from("greetings")
      .select("*")
      .eq("id", slug)
      .maybeSingle();

    if (byId) {
      // If we found it by ID and it has a slug, redirect to the clean URL
      if (byId.slug) {
        redirect(`/g/${byId.slug}`);
      }
      greeting = byId;
    }
  }

  // 3. Final 404 check
  if (!greeting) {
    notFound();
  }

  // Fire-and-forget view count update
  // We don't 'await' this so the page loads faster for the user
  supabase
    .rpc('increment_view_count', { row_id: greeting.id }) 
    // Note: It's better to use a DB function for increments to avoid race conditions
    .then();

  return <GreetingPage greeting={greeting} />;
}
