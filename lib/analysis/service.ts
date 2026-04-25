import { model } from "../openai/client";

export async function analyzeContent(prompt: string) {
  const result = await model.generateContent(prompt);
  const response = await result.response;

  return await response.text();
}