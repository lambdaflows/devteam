import { CursorSelection, ShortcutManager } from "./components";
import { PageLayout } from "@/layouts";

const Shortcuts = () => {
  return (
    <PageLayout
      title="Cursor & Keyboard Shortcuts"
      description="Manage your cursor and keyboard shortcuts"
    >
      <div className="flex flex-col gap-6 pb-8">
        {/* Cursor Selection */}
        <CursorSelection />

        {/* Keyboard Shortcuts */}
        <ShortcutManager />
      </div>
    </PageLayout>
  );
};

export default Shortcuts;
