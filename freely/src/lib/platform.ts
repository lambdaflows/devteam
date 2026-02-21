/**
 * Get current platform
 */
export const getPlatform = (): "macos" | "windows" | "linux" => {
  // Try modern API first (if available)
  if ((navigator as any).userAgentData?.platform) {
    const platform = (navigator as any).userAgentData.platform.toLowerCase();
    if (platform.includes("mac")) return "macos";
    if (platform.includes("win")) return "windows";
    return "linux";
  }

  // Fallback to deprecated API
  const platform = navigator.platform.toLowerCase();
  if (platform.includes("mac")) return "macos";
  if (platform.includes("win")) return "windows";
  return "linux";
};

/**
 * Check if current platform is macOS
 */
export const isMacOS = (): boolean => getPlatform() === "macos";

/**
 * Check if current platform is Windows
 */
export const isWindows = (): boolean => getPlatform() === "windows";

/**
 * Check if current platform is Linux
 */
export const isLinux = (): boolean => getPlatform() === "linux";
