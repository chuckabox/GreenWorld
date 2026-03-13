/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_AI_DEMO_MODE?: string;
  readonly VITE_AI_FALLBACK_TO_DEMO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
