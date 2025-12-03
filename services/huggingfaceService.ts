import { HfInference } from "@huggingface/inference";

// Get API key from environment
const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;

if (!apiKey) {
  console.warn(
    "VITE_HUGGINGFACE_API_KEY is missing. Image generation will not work."
  );
}

// Initialize Hugging Face client
const hf = new HfInference(apiKey || "");

/**
 * Converts a File object to a Blob for Hugging Face API
 */
const fileToBlob = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(new Blob([reader.result as ArrayBuffer], { type: file.type }));
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Generate thumbnail using Hugging Face's image-to-image model
 * This enhances the uploaded image based on the description
 */
export const generateThumbnail = async (
  files: File[],
  description: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error(
      "API Key is missing. Please set VITE_HUGGINGFACE_API_KEY in .env.local"
    );
  }

  if (files.length === 0) {
    throw new Error("No images provided");
  }

  try {
    // Use the first uploaded image as the base
    const imageFile = files[0];
    const imageBlob = await fileToBlob(imageFile);

    // Create a detailed prompt for thumbnail enhancement
    const enhancedPrompt = `
You are an expert thumbnail designer. Transform this image into a professional, eye-catching thumbnail by:
- Making colors vibrant and attention-grabbing
- Improving lighting, contrast, and sharpness
- Adding professional cropping and composition
- Focusing on the main subject
- Making it suitable for video thumbnails (16:9 ratio)
- Maintaining professional quality without overdoing effects

Context: ${description}

Generate the enhanced thumbnail now.
    `.trim();

    // Use Hugging Face's image-to-image model
    // Model: stabilityai/stable-diffusion-img2img
    const result = await hf.imageToImage({
      inputs: imageBlob,
      model: "stabilityai/stable-diffusion-img2img",
      parameters: {
        prompt: enhancedPrompt,
        negative_prompt:
          "blurry, low quality, distorted, ugly, bad composition",
        guidance_scale: 7.5,
        num_inference_steps: 30,
      },
    });

    // Convert the result to a data URL
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        resolve(dataUrl);
      };
      reader.onerror = reject;
      reader.readAsDataURL(result);
    });
  } catch (error: any) {
    console.error("Hugging Face API Error:", error);

    // If the model is overloaded, try a simpler model
    if (error?.message?.includes("overloaded")) {
      throw new Error(
        "Service is temporarily busy. Please try again in a moment."
      );
    }

    throw new Error(
      error?.message || "Failed to generate thumbnail. Please try again."
    );
  }
};

