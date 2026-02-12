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
    model: "gemini-2.5-flash-lite", 
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

  const prompt = `You are a world-class creative writer. 
Write a ${occasion} message for ${recipientName} from ${senderName}.
Tone: ${tone} — ${toneGuide[tone] || toneGuide.dearly}.
Relationship: ${relationship}. Traits: ${traits}. Hobbies: ${hobbies}.
Rules: Address them directly, be elegant, 120-200 words, warm sign-off.`;
  
  const result = await model.generateContentStream(prompt);
  return result.stream;
}