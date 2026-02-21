export interface ResponseLengthOption {
  id: "short" | "medium" | "auto";
  title: string;
  description: string;
  prompt: string;
}

export interface LanguageOption {
  id: string;
  name: string;
  flag: string;
  prompt: string;
}

export const RESPONSE_LENGTHS: ResponseLengthOption[] = [
  {
    id: "short",
    title: "Short",
    description:
      "Best for quick answers, summaries, and when you need to save time",
    prompt:
      "IMPORTANT: You must keep your response extremely brief and concise. Limit your answer to 2-4 sentences maximum. Provide only the most essential information. Do not include explanations, examples, or additional context unless explicitly requested. Get straight to the point. This is a strict requirement.",
  },
  {
    id: "medium",
    title: "Medium",
    description: "Balanced responses with adequate explanations for most tasks",
    prompt:
      "IMPORTANT: Provide responses with moderate length - not too brief, not too lengthy. Keep your answer to 1-2 paragraphs (approximately 4-8 sentences). Include key explanations and relevant details, but avoid being overly verbose or adding unnecessary elaboration. Stay focused and well-organized. This is a strict requirement.",
  },
  {
    id: "auto",
    title: "Auto",
    description:
      "AI determines the best length based on your question's complexity",
    prompt:
      "IMPORTANT: Carefully assess the complexity and scope of the question, then adjust your response length accordingly. For simple questions, be brief (2-4 sentences). For moderate questions, provide balanced detail (1-2 paragraphs). For complex questions, give comprehensive answers with appropriate depth. Always match the response length to what the question actually requires - no more, no less.",
  },
];

export const LANGUAGES: LanguageOption[] = [
  {
    id: "english",
    name: "English",
    flag: "🇺🇸",
    prompt: "Respond in English.",
  },
  {
    id: "spanish",
    name: "Spanish",
    flag: "🇪🇸",
    prompt: "Respond in Spanish (Español).",
  },
  {
    id: "french",
    name: "French",
    flag: "🇫🇷",
    prompt: "Respond in French (Français).",
  },
  {
    id: "german",
    name: "German",
    flag: "🇩🇪",
    prompt: "Respond in German (Deutsch).",
  },
  {
    id: "italian",
    name: "Italian",
    flag: "🇮🇹",
    prompt: "Respond in Italian (Italiano).",
  },
  {
    id: "portuguese",
    name: "Portuguese",
    flag: "🇵🇹",
    prompt: "Respond in Portuguese (Português).",
  },
  {
    id: "dutch",
    name: "Dutch",
    flag: "🇳🇱",
    prompt: "Respond in Dutch (Nederlands).",
  },
  {
    id: "russian",
    name: "Russian",
    flag: "🇷🇺",
    prompt: "Respond in Russian (Русский).",
  },
  {
    id: "chinese",
    name: "Chinese",
    flag: "🇨🇳",
    prompt: "Respond in Simplified Chinese (简体中文).",
  },
  {
    id: "japanese",
    name: "Japanese",
    flag: "🇯🇵",
    prompt: "Respond in Japanese (日本語).",
  },
  {
    id: "korean",
    name: "Korean",
    flag: "🇰🇷",
    prompt: "Respond in Korean (한국어).",
  },
  {
    id: "arabic",
    name: "Arabic",
    flag: "🇸🇦",
    prompt: "Respond in Arabic (العربية).",
  },
  {
    id: "turkish",
    name: "Turkish",
    flag: "🇹🇷",
    prompt: "Respond in Turkish (Türkçe).",
  },
  {
    id: "polish",
    name: "Polish",
    flag: "🇵🇱",
    prompt: "Respond in Polish (Polski).",
  },
  {
    id: "swedish",
    name: "Swedish",
    flag: "🇸🇪",
    prompt: "Respond in Swedish (Svenska).",
  },
  {
    id: "norwegian",
    name: "Norwegian",
    flag: "🇳🇴",
    prompt: "Respond in Norwegian (Norsk).",
  },
  {
    id: "danish",
    name: "Danish",
    flag: "🇩🇰",
    prompt: "Respond in Danish (Dansk).",
  },
  {
    id: "finnish",
    name: "Finnish",
    flag: "🇫🇮",
    prompt: "Respond in Finnish (Suomi).",
  },
  {
    id: "greek",
    name: "Greek",
    flag: "🇬🇷",
    prompt: "Respond in Greek (Ελληνικά).",
  },
  {
    id: "czech",
    name: "Czech",
    flag: "🇨🇿",
    prompt: "Respond in Czech (Čeština).",
  },
  {
    id: "hungarian",
    name: "Hungarian",
    flag: "🇭🇺",
    prompt: "Respond in Hungarian (Magyar).",
  },
  {
    id: "romanian",
    name: "Romanian",
    flag: "🇷🇴",
    prompt: "Respond in Romanian (Română).",
  },
  {
    id: "ukrainian",
    name: "Ukrainian",
    flag: "🇺🇦",
    prompt: "Respond in Ukrainian (Українська).",
  },
  {
    id: "vietnamese",
    name: "Vietnamese",
    flag: "🇻🇳",
    prompt: "Respond in Vietnamese (Tiếng Việt).",
  },
  {
    id: "thai",
    name: "Thai",
    flag: "🇹🇭",
    prompt: "Respond in Thai (ไทย).",
  },
  {
    id: "indonesian",
    name: "Indonesian",
    flag: "🇮🇩",
    prompt: "Respond in Indonesian (Bahasa Indonesia).",
  },
  {
    id: "malay",
    name: "Malay",
    flag: "🇲🇾",
    prompt: "Respond in Malay (Bahasa Melayu).",
  },
  {
    id: "hebrew",
    name: "Hebrew",
    flag: "🇮🇱",
    prompt: "Respond in Hebrew (עברית).",
  },
  {
    id: "filipino",
    name: "Filipino",
    flag: "🇵🇭",
    prompt: "Respond in Filipino (Tagalog).",
  },
];

export const DEFAULT_RESPONSE_LENGTH = "auto";
export const DEFAULT_LANGUAGE = "english";
export const DEFAULT_AUTO_SCROLL = true;
