import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

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
  const { recipientName, senderName, relationship, occasion, traits, hobbies, tone } = params;

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", 
    generationConfig: {
      temperature: 1.0,
      topP: 0.95,
      maxOutputTokens: 1000,
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    ],
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
4. Use elegant formatting (line breaks for readability).
5. End with a warm sign-off from ${senderName}.
6. Return JUST the message body.`;
  
  const result = await model.generateContentStream(prompt);
  return result.stream;
}