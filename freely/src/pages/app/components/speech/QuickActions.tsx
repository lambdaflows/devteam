import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2Icon,
  PlusIcon,
  EyeIcon,
  EyeOffIcon,
  Settings2Icon,
  ZapIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  actions: string[];
  onActionClick: (action: string) => void;
  onAddAction: (action: string) => void;
  onRemoveAction: (action: string) => void;
  isManaging: boolean;
  setIsManaging: (isManaging: boolean) => void;
  show: boolean;
  setShow: (show: boolean) => void;
}

export const QuickActions = ({
  actions,
  onActionClick,
  onAddAction,
  onRemoveAction,
  isManaging,
  setIsManaging,
  show,
  setShow,
}: QuickActionsProps) => {
  const [newAction, setNewAction] = useState("");

  const handleAdd = () => {
    onAddAction(newAction.trim());
    setNewAction("");
  };

  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 p-3 space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <ZapIcon className="w-3.5 h-3.5 text-primary" />
          <h4 className="text-xs font-medium">Quick Actions</h4>
        </div>
        <div className="flex items-center gap-1">
          {show && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-[10px]"
              onClick={() => setIsManaging(!isManaging)}
            >
              <Settings2Icon className="w-3 h-3 mr-1" />
              {isManaging ? "Done" : "Edit"}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => {
              setShow(!show);
              setIsManaging(false);
            }}
          >
            {show ? (
              <EyeOffIcon className="w-3 h-3" />
            ) : (
              <EyeIcon className="w-3 h-3" />
            )}
          </Button>
        </div>
      </div>

      {show && (
        <div className="flex flex-wrap gap-1.5 items-center">
          {actions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => {
                if (!isManaging) {
                  onActionClick(action);
                }
              }}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                "bg-primary/10 text-primary hover:bg-primary/20",
                isManaging && "pr-1.5"
              )}
            >
              {action}
              {isManaging && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveAction(action);
                  }}
                  className="ml-0.5 p-0.5 rounded-full hover:bg-red-500/20 text-red-500"
                >
                  <Trash2Icon className="w-2.5 h-2.5" />
                </button>
              )}
            </button>
          ))}

          {isManaging && (
            <div className="flex gap-1.5 items-center">
              <Input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="Add action..."
                className="h-7 text-xs w-28"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
              />
              <Button
                size="sm"
                className="h-7 text-xs px-2"
                onClick={handleAdd}
                disabled={!newAction.trim()}
              >
                <PlusIcon className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
