import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import GreetingPage from "@/components/GreetingPage";
import { getOccasionEmoji } from "@/lib/utils";
import Link from "next/link";

// Server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface PageProps {
  params: { id: string };
}

// DYNAMIC META TAGS — This is the key for beautiful link previews on Dearly.icu!
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { data: greeting } = await supabase
    .from("greetings")
    .select("recipient_name, occasion, sender_name, photo_url")
    .eq("id", params.id)
    .single();

  if (!greeting) {
    return { title: "Greeting Not Found | Dearly" };
  }

  const emoji = getOccasionEmoji(greeting.occasion);
  const title = `${emoji} A Special Message for ${greeting.recipient_name}`;
  const description = `${greeting.sender_name} created a beautiful personal greeting for ${greeting.recipient_name}. Open to read it on Dearly.`;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/g/${params.id}`;

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
        ? [
            {
              url: greeting.photo_url,
              width: 1200,
              height: 630,
              alt: `A greeting for ${greeting.recipient_name}`,
            },
          ]
        : [
            {
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-default.png`,
              width: 1200,
              height: 630,
              alt: "Dearly Greeting",
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function GreetingLandingPage({ params }: PageProps) {
  // Fetch the greeting
  const { data: greeting, error } = await supabase
    .from("greetings")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !greeting) {
    notFound();
  }

  // Increment view count (fire-and-forget)
  supabase
    .from("greetings")
    .update({ view_count: (greeting.view_count || 0) + 1 })
    .eq("id", params.id)
    .then();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar Brand */}
      <header className="p-6">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <span className="font-serif text-xl font-bold text-guardian-deep cursor-pointer">
              Dearly
            </span>
          </Link>
        </nav>
      </header>

      {/* Main Greeting Content */}
      <main className="flex-grow">
        <GreetingPage greeting={greeting} />
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-gray-500 text-sm">
        Made with ❤️ by{" "}
        <a 
          href="https://mojeeb.xyz" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-semibold text-guardian-deep hover:underline"
        >
          Mojeeb
        </a> · {new Date().getFullYear()}
      </footer>
    </div>
  );
}