import { redirect, notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GreetingRedirect({ params }: PageProps) {
  const { slug } = await params;

  const { data: greeting } = await supabase
    .from("greetings")
    .select("id, slug")
    .eq("id", slug)
    .single();

  if (!greeting) notFound();

  if (greeting.slug) {
    redirect(`/g/${greeting.slug}`);
  }

  notFound();
}