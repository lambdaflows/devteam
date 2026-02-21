import { PostHog } from "tauri-plugin-posthog-api";

/**
 * Event names for tracking
 */
export const ANALYTICS_EVENTS = {
  // App Lifecycle
  APP_STARTED: "app_started",
  // License Events
  GET_LICENSE: "get_license",
} as const;

/**
 * Capture an analytics event
 */
export const captureEvent = async (
  eventName: string,
  properties?: Record<string, any>
) => {
  try {
    await PostHog.capture(eventName, properties || {});
  } catch (error) {
    // Silently fail - we don't want analytics to break the app
    console.debug("Analytics event failed:", eventName, error);
  }
};

/**
 * Track app initialization
 */
export const trackAppStart = async (appVersion: string, instanceId: string) => {
  await captureEvent(ANALYTICS_EVENTS.APP_STARTED, {
    app_version: appVersion,
    platform: navigator.platform,
    instance_id: instanceId,
  });
};
