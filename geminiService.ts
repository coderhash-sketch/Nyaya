
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, DocumentSource, RiskLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Optimized analysis for speed and reliability.
 * Focuses on key legal sections rather than every single line to prevent timeouts.
 */
export const analyzeDocument = async (source: DocumentSource): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: source.data,
                mimeType: source.mimeType
              }
            },
            {
              text: `Analyze this legal document. 
              
              INSTRUCTIONS:
              1. Identify and group the document's content into the most critical logical clauses/sections.
              2. For each identified section, provide:
                 - A short reference ID (e.g., "Section 1.1", "Termination Clause").
                 - The most important verbatim quote from that section.
                 - A single, clear explanation in plain English.
                 - A risk assessment (SAFE, CAUTION, or DANGER).
                 - Explicitly list the RIGHTS and OBLIGATIONS for the user found in that specific section.
              3. Provide a high-level summary of the entire document.

              STRICT GROUNDING: 
              - Use ONLY the provided document. 
              - If information for a field is missing, do not guess.
              - Output MUST be valid JSON.`
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            clauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  originalText: { type: Type.STRING },
                  simpleExplanation: { type: Type.STRING },
                  riskLevel: { type: Type.STRING, enum: Object.values(RiskLevel) },
                  riskJustification: { type: Type.STRING },
                  obligations: { type: Type.ARRAY, items: { type: Type.STRING } },
                  rights: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["id", "originalText", "simpleExplanation", "riskLevel", "riskJustification", "obligations", "rights"]
              }
            },
            summary: {
              type: Type.OBJECT,
              properties: {
                overview: { type: Type.STRING },
                keyRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                criticalClauses: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["overview", "keyRisks", "suggestedActions"]
            }
          },
          required: ["title", "clauses", "summary"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from analysis engine.");
    
    // Attempt to parse directly; if fail, try cleaning
    try {
      return JSON.parse(text);
    } catch (e) {
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    }
  } catch (error: any) {
    console.error("NYAYA Analysis Error:", error);
    throw new Error(error.message || "The document analysis timed out. Please try a smaller file or a clearer PDF.");
  }
};

/**
 * Strictly grounded Q&A.
 */
export const chatWithDocument = async (
  source: DocumentSource,
  history: { role: 'user' | 'assistant'; content: string }[],
  question: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: source.data,
                mimeType: source.mimeType
              }
            },
            {
              text: `You are NYAYA AI. You interpret legal documents verbatim. 
              Only use the provided text. If not found, say it is missing.`
            }
          ]
        },
        ...history.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        })),
        {
          role: 'user',
          parts: [{ text: question }]
        }
      ]
    });

    return response.text || "This information is not mentioned in the document.";
  } catch (error: any) {
    console.error("NYAYA Chat Error:", error);
    return "Verification failed. Please try a simpler question.";
  }
};
