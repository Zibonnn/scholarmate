"use client";

import { useDocumentStore } from "@/lib/store/documentStore";
import { getStyleRules } from "@/lib/utils/styleRules";
import { PAPER_SIZES } from "@/lib/utils/paperSizes";
import type { ViewMode } from "@/types/document";

interface PaperSheetProps {
  children: React.ReactNode;
  className?: string;
  pageNum?: number;
  viewMode: ViewMode;
  id?: string;
}

export function PaperSheet({
  children,
  className = "",
  pageNum,
  viewMode,
  id,
}: PaperSheetProps) {
  const document = useDocumentStore((state) => state.document);
  if (!document) return null;

  const paperSize = PAPER_SIZES[document.paperSize];
  const styleRules = getStyleRules(document.style);

  const renderHeader = () => {
    if (!pageNum) return null;
    const pageNumberText = styleRules.pageNumberFormat(
      pageNum,
      document.metadata.author
    );
    return (
      <div className="absolute top-8 right-12 text-[12pt] font-serif">
        {pageNumberText}
      </div>
    );
  };

  if (viewMode === "print") {
    return (
      <div
        id={id}
        className={`bg-white shadow-xl mb-8 mx-auto relative print:shadow-none print:mb-0 print:mx-0 print:w-full print:break-after-page ${className}`}
        style={{
          width: paperSize.width,
          minHeight: paperSize.height,
          padding: "25.4mm", // 1 inch margins
        }}
      >
        <div className="print:block block">{renderHeader()}</div>
        {children}
      </div>
    );
  }

  return (
    <div
      id={id}
      className={`max-w-4xl mx-auto px-12 py-8 bg-white mb-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

