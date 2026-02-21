import {
  Card,
  Button,
  Header,
  TextInput,
  Switch,
  Textarea,
  Selection,
} from "@/components";
import { PlusIcon, SaveIcon } from "lucide-react";
import { useCustomSttProviders } from "@/hooks";
import { useApp } from "@/contexts";
import { cn } from "@/lib/utils";

interface CreateEditProviderProps {
  customProviderHook?: ReturnType<typeof useCustomSttProviders>;
}

export const CreateEditProvider = ({
  customProviderHook,
}: CreateEditProviderProps) => {
  const { allSttProviders } = useApp();
  // Use the provided hook instance or create a new one
  const hookInstance = customProviderHook || useCustomSttProviders();

  const {
    showForm,
    setShowForm,
    editingProvider,
    formData,
    setFormData,
    errors,
    handleSave,
    setErrors,
    handleAutoFill,
  } = hookInstance;

  return (
    <>
      {!showForm ? (
        <Button
          onClick={() => {
            setShowForm(true);
            setErrors({});
          }}
          variant="outline"
          className="w-full h-11 border-1 border-input/50 focus:border-primary/50 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Custom STT Provider
        </Button>
      ) : (
        <Card className="p-4 border border-input/50 bg-transparent">
          <div className="flex justify-between items-center">
            <Header
              title={
                editingProvider
                  ? `Edit STT Provider`
                  : "Add Custom STT Provider"
              }
              description="Create a custom STT provider to use with your STT-powered applications."
            />
            <div className="w-[120px]">
              <Selection
                options={allSttProviders
                  ?.filter((provider) => !provider?.isCustom)
                  .map((provider) => {
                    return {
                      label: provider?.id || "STT Provider",
                      value: provider?.id || "STT Provider",
                    };
                  })}
                placeholder={"Auto-fill"}
                onChange={(value) => {
                  handleAutoFill(value);
                }}
              />
            </div>
          </div>

          <div className="">
            {/* Basic Configuration */}
            <div className="space-y-1">
              <Header
                title="Curl Command *"
                description="The curl command to use with the STT provider."
              />
              <Textarea
                className={cn(
                  "h-74 font-mono text-sm",
                  errors.curl && "border-red-500"
                )}
                placeholder={`curl -X POST "https://api.openai.com/v1/audio/transcriptions" \\
      -H "Authorization: Bearer {{API_KEY}}" \\
      -F "file={{AUDIO}}" \\
      -F "model={{MODEL}}"`}
                value={formData.curl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, curl: e.target.value }))
                }
              />
              {errors.curl && (
                <p className="text-xs text-red-500 mt-1">{errors.curl}</p>
              )}

              {/* Variable Instructions */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <div className="bg-card border p-3 rounded-lg">
                  <p className="text-sm font-medium text-primary mb-2">
                    💡 Important: You can add custom variables or directly
                    include your API keys/values
                  </p>
                  <p className="text-xs text-muted-foreground">
                    No need to enter variables separately when selecting the
                    provider - you can embed them directly in the curl command
                    (e.g., replace YOUR_API_KEY with your actual key or use{" "}
                    <code className="bg-muted px-1 rounded text-xs">
                      {"{{MODEL}}"}
                    </code>{" "}
                    for model name).
                  </p>
                </div>

                <h4 className="text-sm font-semibold text-foreground">
                  ⚠️ Required Variables for STT Providers:
                </h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                    <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                      {"{{AUDIO}}"}
                    </code>
                    <span className="text-foreground font-medium">
                      → REQUIRED: Base64 encoded audio data or audio file as wav
                      file if you are using multipart/form-data (using -F or
                      --form)
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Quick Setup:</strong>{" "}
                    Replace{" "}
                    <code className="bg-muted px-1 rounded text-xs">
                      YOUR_API_KEY
                    </code>{" "}
                    with your actual API key directly in the curl command.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">
                      Custom Variables:
                    </strong>{" "}
                    You can add your own variables using the same{" "}
                    <code className="bg-muted px-1 rounded text-xs">
                      {"{{VARIABLE_NAME}}"}
                    </code>{" "}
                    format and they'll be available for configuration when you
                    select this provider.
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    💡 Tip: The{" "}
                    <code className="bg-muted px-1 rounded text-xs">
                      {"{{AUDIO}}"}
                    </code>{" "}
                    variable is essential for STT functionality - make sure it's
                    properly included in your curl command.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-0">
            <div className="flex justify-between items-center space-x-2">
              <Header
                title="Streaming"
                description="streaming is used to stream the response from the AI provider."
              />
              <Switch
                checked={formData.streaming}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    streaming: checked,
                  }))
                }
                disabled={true}
              />
            </div>
            <span className="text-xs italic text-red-500">
              Streaming is not supported for STT providers. it will be fixed in
              the future.
            </span>
          </div>
          {/* Response Configuration */}
          <div className="space-y-2">
            <Header
              title="Response Content Path *"
              description="The path to extract content from the API response."
            />

            <TextInput
              placeholder="text"
              value={formData.responseContentPath || ""}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  responseContentPath: value,
                }))
              }
              error={errors.responseContentPath}
              notes="The path to extract content from the API response. Examples: text, transcript, results[0].alternatives[0].transcript"
            />
          </div>

          <div className="flex justify-end gap-2 -mt-3">
            <Button
              variant="outline"
              onClick={() => setShowForm(!showForm)}
              className="h-11 border-1 border-input/50 focus:border-primary/50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formData.curl.trim()}
              className={cn(
                "h-11 border-1 border-input/50 focus:border-primary/50 transition-colors",
                errors.curl && "bg-red-500 hover:bg-red-600 text-white"
              )}
            >
              {errors.curl ? (
                "Invalid cURL, try again"
              ) : (
                <>
                  <SaveIcon className="h-4 w-4 mr-2" />
                  {editingProvider ? "Update" : "Save"} Provider
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </>
  );
};
