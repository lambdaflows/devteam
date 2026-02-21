import { Button, Input, Textarea } from "@/components";
import { Trash2 } from "lucide-react";

interface CreateSystemPromptProps {
  form: {
    id?: number;
    name: string;
    prompt: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      id?: number;
      name: string;
      prompt: string;
    }>
  >;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  isSaving?: boolean;
}

export const CreateSystemPrompt = ({
  form,
  setForm,
  onClose,
  onSave,
  onDelete,
  isEditing = false,
  isSaving = false,
}: CreateSystemPromptProps) => {
  const isFormValid = form.name.trim() && form.prompt.trim();

  return (
    <div className="space-y-3">
      <Input
        className="h-11"
        placeholder="Enter a name for the system prompt"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        disabled={isSaving}
      />
      <Textarea
        placeholder="You are a helpful AI assistant. Be concise, accurate, and friendly in your responses..."
        className="min-h-[100px] resize-none border-1 border-input/50 focus:border-primary/50 transition-colors"
        value={form.prompt}
        onChange={(e) => setForm({ ...form, prompt: e.target.value })}
        disabled={isSaving}
      />
      <div className="flex flex-row w-full gap-2">
        {isEditing && onDelete ? (
          <>
            <div className="flex-1 flex gap-2">
              <Button
                className="flex-1"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
              >
                Close
              </Button>
              <Button
                className="w-1/3"
                variant="destructive"
                onClick={onDelete}
                disabled={isSaving}
                title="Delete this prompt"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                className="flex-1"
                onClick={onSave}
                disabled={!isFormValid || isSaving}
              >
                {isSaving ? "Updating..." : "Update"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <Button
              className="w-1/2"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              className="w-1/2"
              onClick={onSave}
              disabled={!isFormValid || isSaving}
            >
              {isSaving ? "Creating..." : "Create"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
