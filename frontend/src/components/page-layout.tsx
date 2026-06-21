import { type ReactNode } from "react";

import { cn } from "@/lib/utils";
import PageHeader from "./page-header";

interface PropsType {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  rightAction?: ReactNode;
  showHeader?: boolean;
  addMarginTop?: boolean;
  renderPageHeader?: ReactNode;
}

const PageLayout = ({
  children,
  className,
  title,
  subtitle,
  rightAction,
  showHeader = true,
  addMarginTop = false,
  renderPageHeader,
}: PropsType) => {
  return (
    <div className="w-full">
      {showHeader && (
        <PageHeader
          title={title}
          subtitle={subtitle}
          rightAction={rightAction}
          renderPageHeader={renderPageHeader}
        />
      )}
      <div
        className={cn(
          "w-full px-4 md:px-6 lg:px-8 pt-8 scrollbar-hide",
          addMarginTop && "-mt-20",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
