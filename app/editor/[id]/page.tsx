"use client";

import { useState } from "react";
import { useDocumentStore } from "@/lib/store/documentStore";
import { DocumentViewer } from "@/components/document/DocumentViewer";
import { EditMode } from "@/components/editor/EditMode";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen, Eye, Edit3, FilePlus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

export default function EditorPage({ params }: { params: { id: string } }) {
  const [appMode, setAppMode] = useState<"preview" | "edit">("preview");
  // Ensure store is initialized
  const document = useDocumentStore((state) => state.document);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 flex flex-col">
      {/* --- TOP HEADER (APP MODE) --- */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-2 flex items-center justify-between sticky top-0 z-50 shadow-sm print:hidden">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
          <h1 className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-100 mr-4">
            ScholarMate
          </h1>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            <FilePlus className="w-3.5 h-3.5" />
            New
          </Link>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setAppMode("preview")}
            className={cn(
              "flex items-center gap-2 px-6 py-1.5 text-sm font-medium rounded-md transition-all",
              appMode === "preview"
                ? "bg-white dark:bg-slate-700 shadow text-indigo-700 dark:text-indigo-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button
            onClick={() => setAppMode("edit")}
            className={cn(
              "flex items-center gap-2 px-6 py-1.5 text-sm font-medium rounded-md transition-all",
              appMode === "edit"
                ? "bg-white dark:bg-slate-700 shadow text-indigo-700 dark:text-indigo-400"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            )}
          >
            <Edit3 className="w-4 h-4" /> Edit Text
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-[100px]"></div> {/* Spacer for centering */}
          <ThemeToggle />
        </div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row h-[calc(100vh-57px)]">
        {/* --- Sidebar / Tools (Only visible in Preview Mode) --- */}
        {appMode === "preview" && <Sidebar />}

        {/* --- MAIN CONTENT AREA --- */}
        {appMode === "preview" ? (
          <DocumentViewer />
        ) : (
          <EditMode onSave={() => setAppMode("preview")} />
        )}
      </div>
    </div>
  );
}

