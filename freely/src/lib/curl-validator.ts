import curl2Json from "@bany/curl-to-json";

export interface CurlValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateCurl = (
  curl: string,
  requiredVariables: string[]
): CurlValidationResult => {
  if (!curl.trim().startsWith("curl")) {
    return {
      isValid: false,
      message: "The command must start with 'curl'.",
    };
  }

  try {
    curl2Json(curl);
  } catch (error) {
    return {
      isValid: false,
      message:
        "Invalid cURL command syntax. Please check for typos or try validating it on an online tool like reqbin.com/curl-online.",
    };
  }

  const missingVariables = requiredVariables.filter(
    (variable) => !curl.includes(`{{${variable}}}`)
  );

  if (missingVariables.length > 0) {
    const missingVarsString = missingVariables
      .map((v) => `{{${v}}}`)
      .join(", ");
    return {
      isValid: false,
      message: `The following required variables are missing: ${missingVarsString}.`,
    };
  }

  return { isValid: true };
};
