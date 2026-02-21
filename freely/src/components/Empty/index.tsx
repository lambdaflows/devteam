import {
  EmptyComponent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components";
import { Loader2 } from "lucide-react";

export const Empty = ({
  icon,
  title,
  description,
  isLoading = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  isLoading?: boolean;
}) => {
  const Icon = icon;
  return isLoading ? (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="size-8 animate-spin" />
    </div>
  ) : (
    <EmptyComponent>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon icon={icon} />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription className="-mt-2">{description}</EmptyDescription>
      </EmptyHeader>
    </EmptyComponent>
  );
};
