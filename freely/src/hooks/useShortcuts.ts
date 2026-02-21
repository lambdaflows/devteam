import { useEffect } from "react";
import { useGlobalShortcuts } from "./useGlobalShortcuts";

interface UseShortcutsProps {
  onAudioRecording?: () => void;
  onScreenshot?: () => void;
  onSystemAudio?: () => void;
  customShortcuts?: Record<string, () => void>;
}

/**
 * Hook to manage global shortcuts for the application
 * Automatically registers callbacks for all shortcut actions
 */
export const useShortcuts = ({
  onAudioRecording,
  onScreenshot,
  onSystemAudio,
  customShortcuts = {},
}: UseShortcutsProps = {}) => {
  const {
    registerAudioCallback,
    registerScreenshotCallback,
    registerSystemAudioCallback,
    registerCustomShortcutCallback,
    unregisterCustomShortcutCallback,
  } = useGlobalShortcuts();

  // Register standard callbacks
  useEffect(() => {
    if (onAudioRecording) {
      registerAudioCallback(onAudioRecording);
    }
  }, [onAudioRecording, registerAudioCallback]);

  useEffect(() => {
    if (onScreenshot) {
      registerScreenshotCallback(onScreenshot);
    }
  }, [onScreenshot, registerScreenshotCallback]);

  useEffect(() => {
    if (onSystemAudio) {
      registerSystemAudioCallback(onSystemAudio);
    }
  }, [onSystemAudio, registerSystemAudioCallback]);

  // Register custom shortcut callbacks
  useEffect(() => {
    Object.entries(customShortcuts).forEach(([actionId, callback]) => {
      registerCustomShortcutCallback(actionId, callback);
    });

    // Cleanup on unmount
    return () => {
      Object.keys(customShortcuts).forEach((actionId) => {
        unregisterCustomShortcutCallback(actionId);
      });
    };
  }, [
    customShortcuts,
    registerCustomShortcutCallback,
    unregisterCustomShortcutCallback,
  ]);

  return useGlobalShortcuts();
};
