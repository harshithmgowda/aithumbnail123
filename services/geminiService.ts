import { GoogleGenerativeAI, GenerativeModel, Part } from "@google/generative-ai";

// Ensure the API key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is missing from environment variables.");
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(apiKey || "");

// Use an image-capable model; gemini-1.5-flash supports vision/images
const model: GenerativeModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: {
    role: "system",
    parts: [
      {
        text: `
🎯 Thumbnail Generator Prompt
You are an expert thumbnail designer. Your job is to take:

1) A short text description of the content
2) One or more user-uploaded images

And generate the most attractive, eye-catching, high-contrast thumbnail image possible.

Requirements:
- Make the colors vibrant and attention-grabbing.
- Add clean, bold, readable text if the user mentions a title.
- Improve lighting, contrast, and sharpness.
- Add professional cropping, framing, and composition.
- Focus on faces / main subject.
- Maintain the original theme but enhance visual appeal.
- Make it suitable for video thumbnails (16:9 ratio).
- Do not add any platform logos (like YouTube, TikTok, etc) unless explicitly asked in the description.
- Never over-edit to the point it becomes unrealistic.

Return only the final enhanced thumbnail as output.
      `,
      },
    ],
  },
});

/**
 * Converts a File object to a Base64-based Part compatible with the Gemini SDK.
 */
const fileToGenerativePart = async (file: File): Promise<Part> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(",")[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateThumbnail = async (
  files: File[],
  description: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your configuration.");
  }

  try {
    // For Imagen, we need to convert the description to a prompt
    // and optionally include reference images
    const prompt = `Create a professional, eye-catching thumbnail image for a video. ${description}. Make it high-contrast, vibrant colors, suitable for video platforms like YouTube. 16:9 aspect ratio.`;

    // Imagen API uses generateImages method
    const result = await model.generateImages({
      prompt: prompt,
      // Optionally include reference images if supported
      // For now, we'll generate from text description only
    });

    // Parse the response - Imagen returns an array of images
    if (result.response && result.response.images && result.response.images.length > 0) {
      const image = result.response.images[0];
      if (image.bytesBase64Encoded) {
        // Imagen returns base64 encoded bytes
        const mimeType = image.mimeType || "image/png";
        return `data:${mimeType};base64,${image.bytesBase64Encoded}`;
      }
    }

    throw new Error("No image was generated. Please try again with a different description.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error?.message || "Failed to generate thumbnail.");
  }
};