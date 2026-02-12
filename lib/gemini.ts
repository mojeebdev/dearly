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

  const prompt = `Write a ${occasion} message for ${recipientName} from ${senderName}. 
  Tone: ${tone}. Relationship: ${relationship}. Traits: ${traits}. Hobbies: ${hobbies}.`;
  
  const result = await model.generateContentStream(prompt);
  return result.stream;
}