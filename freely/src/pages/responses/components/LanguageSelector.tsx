import { Header, Selection } from "@/components";
import { LANGUAGES } from "@/lib";
import { useApp } from "@/contexts";
import { updateLanguage } from "@/lib/storage/response-settings.storage";
import { useState, useEffect, useMemo } from "react";
import { getResponseSettings } from "@/lib";

export const LanguageSelector = () => {
  const { hasActiveLicense } = useApp();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("english");

  useEffect(() => {
    const settings = getResponseSettings();
    setSelectedLanguage(settings.language);
  }, []);

  const handleLanguageChange = (languageId: string) => {
    if (!hasActiveLicense) {
      return;
    }
    setSelectedLanguage(languageId);
    updateLanguage(languageId);
  };

  const languageOptions = useMemo(() => {
    return LANGUAGES.map((lang) => ({
      label: `${lang.flag} ${lang.name}`,
      value: lang.id,
    }));
  }, []);

  return (
    <div className="space-y-4">
      <Header
        title="Response Language"
        description="Select the language for AI responses. Setting applies globally to all providers and conversations. Language support may vary depending on your selected LLM provider"
        isMainTitle
      />

      <div className="max-w-md">
        <Selection
          selected={selectedLanguage}
          onChange={handleLanguageChange}
          options={languageOptions}
          placeholder="Select a language"
          disabled={!hasActiveLicense}
        />
      </div>
    </div>
  );
};
