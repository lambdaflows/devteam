import { ScreenshotConfigs } from "./components";
import { useSettings } from "@/hooks";
import { PageLayout } from "@/layouts";

const Settings = () => {
  const settings = useSettings();
  return (
    <PageLayout
      title="Screenshot"
      description="Manage your screenshot settings"
    >
      {/* Screenshot Configs */}
      <ScreenshotConfigs {...settings} />
    </PageLayout>
  );
};

export default Settings;
