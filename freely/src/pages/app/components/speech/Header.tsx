import { AudioWaveformIcon, MicIcon, LoaderIcon, AlertCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusType = "ready" | "listening" | "recording" | "processing" | "ai-processing" | "error";

type Props = {
  setupRequired: boolean;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resizeWindow: (expanded: boolean) => Promise<void>;
  capturing: boolean;
  isVadMode: boolean;
  isRecording: boolean;
  isProcessing: boolean;
  isAIProcessing: boolean;
  error?: string;
};

const getStatus = (
  capturing: boolean,
  isVadMode: boolean,
  isRecording: boolean,
  isProcessing: boolean,
  isAIProcessing: boolean,
  error?: string
): StatusType => {
  if (error) return "error";
  if (isAIProcessing) return "ai-processing";
  if (isProcessing) return "processing";
  if (isRecording) return "recording";
  if (capturing && isVadMode) return "listening";
  return "ready";
};

const STATUS_CONFIG: Record<
  StatusType,
  { label: string; color: string; bgColor: string; icon?: React.ReactNode }
> = {
  ready: {
    label: "Ready",
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
  listening: {
    label: "Listening",
    color: "text-teal-600",
    bgColor: "bg-teal-100",
    icon: <AudioWaveformIcon className="w-3 h-3" />,
  },
  recording: {
    label: "Recording",
    color: "text-red-600",
    bgColor: "bg-red-100",
    icon: <MicIcon className="w-3 h-3" />,
  },
  processing: {
    label: "Transcribing",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    icon: <LoaderIcon className="w-3 h-3 animate-spin" />,
  },
  "ai-processing": {
    label: "AI Responding",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    icon: <LoaderIcon className="w-3 h-3 animate-spin" />,
  },
  error: {
    label: "Error",
    color: "text-red-600",
    bgColor: "bg-red-100",
    icon: <AlertCircleIcon className="w-3 h-3" />,
  },
};

export const Header = ({
  setupRequired,
  capturing,
  isVadMode,
  isRecording,
  isProcessing,
  isAIProcessing,
  error,
}: Props) => {
  const status = getStatus(capturing, isVadMode, isRecording, isProcessing, isAIProcessing, error);
  const statusConfig = STATUS_CONFIG[status];

  return (
    <div>
      <h2 className="font-semibold text-sm">
        {setupRequired ? "Setup Required" : "Speech Assistant"}
      </h2>
      {!setupRequired && (
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
              statusConfig.bgColor,
              statusConfig.color
            )}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {isVadMode ? "Auto-detect" : "Manual"} mode
          </span>
        </div>
      )}
    </div>
  );
};
