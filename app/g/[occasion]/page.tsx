import { redirect, notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ occasion: string }>;
}

export default async function GreetingRedirect({ params }: PageProps) {
  const { occasion } = await params;

  
  const { data: greeting } = await supabase
    .from("greetings")
    .select("id, slug")
    .eq("id", occasion)
    .single();

  if (!greeting) notFound();

  if (greeting.slug) {
    redirect(`/g/${greeting.slug}`);
  }

  notFound();
}