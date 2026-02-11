import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client with your private key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface GenerateParams {
  recipientName: string;
  senderName: string;
  relationship: string;
  occasion: string;
  traits: string;
  hobbies: string;
  tone: string;
}

export async function generateMessage(params: GenerateParams): Promise<string> {
  const {
    recipientName,
    senderName,
    relationship,
    occasion,
    traits,
    hobbies,
    tone,
  } = params;

  // Using gemini-2.0-flash for high-speed, free-tier generation
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 1.0,
      topP: 0.95,
      maxOutputTokens: 1000,
    }
  });

  const toneGuide: Record<string, string> = {
    dearly: "deeply sincere, warm, emotionally moving — like a handwritten letter",
    romantic: "poetic, intimate, tender — like a love letter under moonlight",
    funny: "witty, playful, affectionate humor — like a best friend's toast",
    inspirational: "uplifting, empowering, celebratory — like a mentor's speech",
  };

  const prompt = `You are a world-class creative writer specializing in personal, bespoke messages.

Write a ${occasion} message for **${recipientName}** from **${senderName}**.

CONTEXT:
- Relationship: ${relationship}
- ${recipientName}'s traits: ${traits}
- ${recipientName}'s hobbies/interests: ${hobbies}
- Desired tone: ${tone} — ${toneGuide[tone] || toneGuide.dearly}

RULES:
1. Address ${recipientName} directly and personally.
2. Weave in specific details about their traits and hobbies naturally.
3. Keep it between 120-200 words — impactful, not bloated.
4. Use elegant formatting: short paragraphs, maybe one poetic line.
5. End with a warm sign-off from ${senderName}.
6. Do NOT use generic filler. Every sentence must feel personal.
7. Do NOT include a subject line or title — just the message body.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Return text or a fallback if the result is empty
    return text.trim() || "A dearly message for you.";
  } catch (error) {
    console.error("Dearly Generation Error:", error);
    // Return a warm fallback message so the user isn't left with an error screen
    return "The stars couldn't align for this message, but you are truly loved.";
  }
}