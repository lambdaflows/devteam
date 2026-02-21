import { Button } from "@/components";
import { LaptopMinimalIcon, Loader2, MousePointer2Icon } from "lucide-react";
import { MAX_FILES } from "@/config";
import { useApp } from "@/contexts";

interface ChatScreenshotProps {
  screenshotConfiguration: any;
  attachedFiles: any[];
  isLoading: boolean;
  captureScreenshot: () => Promise<void>;
  isScreenshotLoading: boolean;
  disabled: boolean;
}

export const ChatScreenshot = ({
  screenshotConfiguration,
  attachedFiles,
  isLoading,
  captureScreenshot,
  isScreenshotLoading,
  disabled,
}: ChatScreenshotProps) => {
  const { supportsImages } = useApp();
  const captureMode = screenshotConfiguration.enabled
    ? "Screenshot"
    : "Selection";
  const processingMode = screenshotConfiguration.mode;

  return (
    <Button
      size="icon"
      variant="outline"
      className="size-7 lg:size-9 rounded-lg lg:rounded-xl"
      title={
        !supportsImages
          ? "Screenshot not supported by current AI provider"
          : `${captureMode} mode (${processingMode}) - ${attachedFiles.length}/${MAX_FILES} files`
      }
      onClick={captureScreenshot}
      disabled={
        attachedFiles.length >= MAX_FILES ||
        isLoading ||
        isScreenshotLoading ||
        disabled
      }
    >
      {isScreenshotLoading ? (
        <Loader2 className="size-3 lg:size-4 animate-spin" />
      ) : screenshotConfiguration.enabled ? (
        <LaptopMinimalIcon className="size-3 lg:size-4" />
      ) : (
        <MousePointer2Icon className="size-3 lg:size-4" />
      )}
    </Button>
  );
};
