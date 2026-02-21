import { Header, ScrollArea } from "@/components";

export const PageLayout = ({
  children,
  title,
  description,
  rightSlot,
  allowBackButton = false,
  isMainTitle = true,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  rightSlot?: React.ReactNode;
  allowBackButton?: boolean;
  isMainTitle?: boolean;
}) => {
  return (
    <div className="flex flex-1 flex-col">
      <header className="pt-8">
        <Header
          isMainTitle={isMainTitle}
          showBorder={true}
          title={title}
          description={description}
          rightSlot={rightSlot}
          allowBackButton={allowBackButton}
        />
      </header>

      <ScrollArea className="h-[calc(100vh-5rem)] pr-6">
        <div className="flex flex-col gap-6 pb-12 pt-4 px-1">{children}</div>
      </ScrollArea>
    </div>
  );
};
