import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import GreetingPage from "@/components/GreetingPage";
import { getOccasionEmoji } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params; 
  
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
  const description = `A heartfelt ${greeting.occasion} greeting from ${greeting.sender_name}.`;
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dearly.icu";
  const url = `${baseUrl}/g/${id}`;

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
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: greeting.photo_url ? [greeting.photo_url] : [],
    },
  };
}

export default async function GreetingLandingPage({ params }: PageProps) {
  const { id } = await params;

  const { data: greeting, error } = await supabase
    .from("greetings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !greeting) {
    notFound();
  }

  
  supabase
    .from("greetings")
    .update({ view_count: (greeting.view_count || 0) + 1 })
    .eq("id", id)
    .then();

  return (
    <>
      <GreetingPage greeting={greeting} />
    </>
  );
}