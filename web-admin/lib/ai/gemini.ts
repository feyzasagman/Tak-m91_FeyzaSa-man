import "server-only";

import { GoogleGenAI } from "@google/genai";

export const GEMINI_MODEL = "gemini-2.5-flash-lite";

let client: GoogleGenAI | null = null;

export function hasGeminiApiKey() {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY ortam değişkeni tanımlı değil.");
  }
  client ??= new GoogleGenAI({ apiKey });
  return client;
}
