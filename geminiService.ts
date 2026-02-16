import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AnalysisResult, DocumentSource, RiskLevel } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const ai = new GoogleGenerativeAI(apiKey);

export { ai };

export const analyzeDocument = async (source: DocumentSource): Promise<AnalysisResult> => {
  try {
    // UPDATED: Changed model to gemini-2.5-flash
    const model = ai.getGenerativeModel({ 
      model: "gemini-2.5-flash", 
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            clauses: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  id: { type: SchemaType.STRING },
                  originalText: { type: SchemaType.STRING },
                  simpleExplanation: { type: SchemaType.STRING },
                  riskLevel: { type: SchemaType.STRING, enum: Object.values(RiskLevel) },
                  riskJustification: { type: SchemaType.STRING },
                  obligations: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                  rights: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
                },
                required: ["id", "originalText", "simpleExplanation", "riskLevel", "riskJustification", "obligations", "rights"]
              }
            },
            summary: {
              type: SchemaType.OBJECT,
              properties: {
                overview: { type: SchemaType.STRING },
                keyRisks: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                suggestedActions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                criticalClauses: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
              },
              required: ["overview", "keyRisks", "suggestedActions"]
            }
          },
          required: ["title", "clauses", "summary"]
        }
      }
    });

    const result = await model.generateContent([
      {
        inlineData: {
          data: source.data,
          mimeType: source.mimeType
        }
      },
      { text: "Analyze this legal document. Output MUST be valid JSON." }
    ]);

    const response = await result.response;
    const text = response.text();
    return JSON.parse(text);
  } catch (error: any) {
    console.error("NYAYA Analysis Error:", error);
    throw new Error(error.message || "Analysis failed.");
  }
};

export const chatWithDocument = async (
  source: DocumentSource,
  history: { role: 'user' | 'assistant'; content: string }[],
  question: string
): Promise<string> => {
  try {
    // UPDATED: Changed model to gemini-2.5-flash
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    const contents = [
      {
        role: "user",
        parts: [
          { inlineData: { data: source.data, mimeType: source.mimeType } },
          { text: "You are NYAYA AI. Use the provided text to answer." }
        ]
      },
      ...history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      { role: 'user', parts: [{ text: question }] }
    ];

    const result = await model.generateContent({ contents });
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("NYAYA Chat Error:", error);
    return "Verification failed.";
  }
};
