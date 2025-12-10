
import { GoogleGenAI, Type } from "@google/genai";
import { ImageSize, AspectRatio, UniverseNode, WorldLocation, WorldEvent } from "../types";

// Helper to ensure we get a fresh instance with the selected key
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const checkApiKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const promptApiKeySelection = async (): Promise<void> => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  } else {
    alert("AI Studio environment not detected. Please ensure you are running in a compatible environment.");
  }
};

/**
 * Chat with the Diplomat (Text) - Now Context Aware
 */
export const sendDiplomatMessage = async (history: string, userMessage: string, systemPersona: string): Promise<string> => {
  const ai = getAI();
  const model = "gemini-2.5-flash"; 

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `History:\n${history}\n\nUser: ${userMessage}\nChronicler:`,
      config: {
        systemInstruction: systemPersona || "You are a helpful assistant.",
      }
    });
    return response.text || "...";
  } catch (error) {
    console.error("Diplomat Error:", error);
    return "The connection to the realm is unstable.";
  }
};

/**
 * Generate World Event (Map Logic)
 */
export const generateWorldEvent = async (locations: WorldLocation[], worldDescription: string): Promise<WorldEvent | null> => {
  const ai = getAI();
  const model = "gemini-2.5-flash";

  // Simplify location data for token efficiency
  const locData = locations.map(l => ({ id: l.id, name: l.name, type: l.type, blueprint: l.description }));

  const systemInstruction = `
    You are the Game Master of the following world: ${worldDescription}.
    1. Select ONE location from the provided list where an interesting event happens next.
    2. Write a short 1-sentence narrative about the event consistent with the world's lore.
    3. Create a vivid image prompt that combines the location's 'blueprint' with the specific details of your event.
    
    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Available Locations: ${JSON.stringify(locData)}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            locationId: { type: Type.STRING },
            narrative: { type: Type.STRING },
            imagePrompt: { type: Type.STRING }
          }
        }
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("World Event Error:", error);
    return null;
  }
};

/**
 * Evolve the Universe (Game Logic) - DEPRECATED for Map, but kept for compatibility if needed
 */
export const evolveUniverse = async (leafNodes: UniverseNode[]): Promise<any[]> => {
  return [];
};

/**
 * Generate Image using Nano Banana Pro (Gemini 3 Pro Image)
 */
export const generateCyberImage = async (prompt: string, size: ImageSize): Promise<string> => {
  const ai = getAI();
  const model = "gemini-3-pro-image-preview";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1" // Default square for chat images
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

/**
 * Generate Video using Veo
 */
export const generateVeoVideo = async (
  prompt: string, 
  imageBase64: string | null, 
  aspectRatio: AspectRatio
): Promise<string> => {
  const ai = getAI();
  const model = "veo-3.1-fast-generate-preview";

  try {
    let operation;

    if (imageBase64) {
      // Image-to-Video
      const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");
      
      operation = await ai.models.generateVideos({
        model,
        prompt: prompt || "Animate this scene in the cyber universe style.",
        image: {
          imageBytes: cleanBase64,
          mimeType: mimeType
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });
    } else {
      // Text-to-Video
      operation = await ai.models.generateVideos({
        model,
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });
    }

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("Video URI not found in response.");

    const fetchUrl = `${videoUri}&key=${process.env.API_KEY}`;
    const vidResponse = await fetch(fetchUrl);
    const blob = await vidResponse.blob();
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error("Veo Error:", error);
    throw error;
  }
};
