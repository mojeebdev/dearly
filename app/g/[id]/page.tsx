import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Use your existing central client
import GreetingPage from "@/components/GreetingPage";
import { getOccasionEmoji } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // 1. Await the Promise to get the ID
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
  const description = `${greeting.sender_name} created a beautiful personal greeting.`;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/g/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: greeting.photo_url ? [{ url: greeting.photo_url }] : [],
    },
  };
}

export default async function GreetingLandingPage({ params }: PageProps) {
  // 2. Await the Promise here as well
  const { id } = await params;

  const { data: greeting, error } = await supabase
    .from("greetings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !greeting) {
    notFound();
  }

  // Fire-and-forget view count update
  // Note: Ensure 'view_count' column exists in your Supabase table!
  supabase
    .from("greetings")
    .update({ view_count: (greeting.view_count || 0) + 1 })
    .eq("id", id)
    .then();

  return (
    <>
      <GreetingPage greeting={greeting} />
      {/* Share to social functionality is handled within GreetingPage or here */}
    </>
  );
}