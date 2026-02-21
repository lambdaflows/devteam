import { useState } from "react";
import {
  InfoIcon,
  ChevronDownIcon,
  KeyboardIcon,
  AudioWaveformIcon,
  MicIcon,
  CameraIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WarningProps {
  isVadMode: boolean;
}

export const Warning = ({ isVadMode }: WarningProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isMac = navigator.platform.toLowerCase().includes("mac");
  const modKey = isMac ? "⌘" : "Ctrl";

  return (
    <div className="rounded-lg border border-border/50 bg-muted/30 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <InfoIcon className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium">Help & Keyboard Shortcuts</span>
        </div>
        <ChevronDownIcon
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Current Mode Info */}
          <div className="flex items-start gap-2 p-2 rounded-md bg-primary/5">
            {isVadMode ? (
              <AudioWaveformIcon className="w-4 h-4 text-primary mt-0.5" />
            ) : (
              <MicIcon className="w-4 h-4 text-primary mt-0.5" />
            )}
            <div>
              <p className="text-xs font-medium">
                {isVadMode ? "Auto-detect Mode" : "Manual Mode"}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {isVadMode
                  ? "Speech is automatically detected from system audio. When someone speaks, it will be captured and transcribed."
                  : "Press the record button or use keyboard shortcuts to manually control recording."}
              </p>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <KeyboardIcon className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Keyboard Shortcuts
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="flex items-center justify-between p-1.5 rounded bg-muted/50">
                <span className="text-muted-foreground">Scroll down</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono">
                  ↓
                </kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-muted/50">
                <span className="text-muted-foreground">Scroll up</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono">
                  ↑
                </kbd>
              </div>
              {!isVadMode && (
                <>
                  <div className="flex items-center justify-between p-1.5 rounded bg-muted/50">
                    <span className="text-muted-foreground">Start/Stop</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono">
                      Enter
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-muted/50">
                    <span className="text-muted-foreground">Start record</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono">
                      Space
                    </kbd>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-muted/50">
                    <span className="text-muted-foreground">Discard</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono">
                      Esc
                    </kbd>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between p-1.5 rounded bg-muted/50">
                <span className="text-muted-foreground">Toggle view</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono">
                  {modKey}+K
                </kbd>
              </div>
            </div>
          </div>

          {/* Screenshot Feature */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <CameraIcon className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Screenshot Feature
              </span>
            </div>
            <div className="p-2 rounded-md bg-primary/5 text-[10px] text-muted-foreground space-y-1">
              <p>
                Screenshot: Captures your current screen and attaches it to your
                next transcription.
              </p>
              <p>
                The AI will receive both the transcribed audio and the
                screenshot image, allowing it to provide context-aware responses
                based on what you're viewing.
              </p>
              <p className="text-[9px] opacity-70">
                The screenshot is automatically cleared after each message is
                sent.
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="text-[10px] text-muted-foreground space-y-1 pt-2 border-t border-border/50">
            <p>
              <strong>Tip:</strong> Use Auto-detect for hands-free operation
              during interviews.
            </p>
            <p>
              <strong>Tip:</strong> Use Manual mode when you need precise
              control over what gets transcribed.
            </p>
            <p>
              <strong>Tip:</strong> Quick Actions let you send follow-up prompts
              with one click.
            </p>
            <p>
              <strong>Tip:</strong> Use Screenshot to share your screen context
              with the AI for more relevant responses.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
