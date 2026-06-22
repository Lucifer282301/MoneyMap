import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  rightAction?: ReactNode;
  renderPageHeader?: ReactNode;
}

const PageHeader = ({
  title,
  subtitle,
  rightAction,
  renderPageHeader,
}: PageHeaderProps) => {
  return (
    <div
      className={cn(
        "sticky top-14 z-40 w-full pt-4 px-5 lg:px-0 bg-[var(--secondary-dark-color)] text-white",
        renderPageHeader ? "pb-8" : "pb-4",
      )}
    >
      <div className="w-full px-4 md:px-6 lg:px-8">
        {renderPageHeader ? (
          renderPageHeader
        ) : (
          <div className="w-full flex flex-col gap-3 items-start justify-start lg:items-center lg:flex-row lg:justify-between">
            {(title || subtitle) && (
              <div className="space-y-1">
                {title && (
                  <h2 className="text-2xl lg:text-4xl font-medium">{title}</h2>
                )}
                {subtitle && (
                  <p className="text-white/60 text-sm">{subtitle}</p>
                )}
              </div>
            )}
            {rightAction}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
