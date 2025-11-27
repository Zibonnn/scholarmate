"use client";

import { useDocumentStore } from "@/lib/store/documentStore";
import { PrintPreview } from "./PrintPreview";
import { WebPreview } from "./WebPreview";

export function DocumentViewer() {
  const document = useDocumentStore((state) => state.document);

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-200/50 dark:bg-slate-800/50">
        <p className="text-slate-500 dark:text-slate-400">No document loaded</p>
      </div>
    );
  }

  const viewMode = document.viewMode || "print";

  return (
    <div
      className={`
        flex-1 flex justify-center overflow-y-auto bg-slate-200/50 dark:bg-slate-800/50
        print:p-0 print:overflow-visible print:bg-white
        ${viewMode === "web" ? "py-8 px-4" : "py-12 px-8"}
      `}
    >
      <div
        className={`
          transition-all duration-300
          print:w-full print:max-w-none print:p-0
        `}
      >
        {viewMode === "print" ? <PrintPreview /> : <WebPreview />}
      </div>
    </div>
  );
}

