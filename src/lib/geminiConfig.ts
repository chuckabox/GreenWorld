/**
 * Hardcoded Gemini API key for presentation.
 * Replace with your actual key; leave as-is or set to "" to use demo responses.
 */
export const GEMINI_API_KEY = "PASTE_YOUR_GEMINI_API_KEY_HERE";

/** True when we should call the real API (key set and not placeholder). */
export const USE_GEMINI_LIVE =
  Boolean(GEMINI_API_KEY) && !/^PASTE_YOUR_GEMINI_API_KEY_HERE$/i.test(GEMINI_API_KEY);
