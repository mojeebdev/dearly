import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API Key
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

export async function streamMessage(params: GenerateParams) {
  const {
    recipientName,
    senderName,
    relationship,
    occasion,
    traits,
    hobbies,
    tone,
  } = params;

  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
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
3. Keep it between 120-200 words.
4. Use elegant formatting.
5. End with a warm sign-off from ${senderName}.
6. Just the message body.`;

  const result = await model.generateContentStream(prompt);
  return result.stream;
}
