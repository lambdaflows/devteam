import { cn } from "@/lib/utils";
import { AudioWaveformIcon, MicIcon } from "lucide-react";

interface ModeSwitcherProps {
  isVadMode: boolean;
  onModeChange: (vadEnabled: boolean) => void;
  disabled?: boolean;
}

export const ModeSwitcher = ({
  isVadMode,
  onModeChange,
  disabled = false,
}: ModeSwitcherProps) => {
  return (
    <div
      className={cn(
        "flex bg-muted rounded-lg w-full p-0.5 gap-0.5",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      <button
        type="button"
        onClick={() => onModeChange(true)}
        disabled={disabled}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-md transition-all",
          isVadMode
            ? "bg-background shadow-sm text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <AudioWaveformIcon className="w-4 h-4 flex-shrink-0" />
        <div className="flex flex-col items-start">
          <span className="text-xs font-medium leading-tight">Auto-detect</span>
          <span className="text-[9px] font-normal opacity-60 leading-tight">
            (voice activity)
          </span>
        </div>
      </button>
      <button
        type="button"
        onClick={() => onModeChange(false)}
        disabled={disabled}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-md transition-all",
          !isVadMode
            ? "bg-background shadow-sm text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <MicIcon className="w-4 h-4 flex-shrink-0" />
        <div className="flex flex-col items-start">
          <span className="text-xs font-medium leading-tight">Manual</span>
          <span className="text-[9px] font-normal opacity-60 leading-tight">
            (press to record)
          </span>
        </div>
      </button>
    </div>
  );
};
