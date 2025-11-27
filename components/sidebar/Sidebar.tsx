"use client";

import { useDocumentStore } from "@/lib/store/documentStore";
import { FormatPanel } from "./FormatPanel";
import { ExportPanel } from "./ExportPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Settings, Download, Printer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar() {
  const document = useDocumentStore((state) => state.document);

  if (!document) return null;

  return (
    <div className="print:hidden w-full md:w-80 bg-background border-r border-border h-full flex flex-col shadow-lg">
      <div className="px-6 pt-6">
        <Tabs defaultValue="format" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="format" className="flex items-center gap-2">
              <Settings className="w-3 h-3" />
              Format
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-3 h-3" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="mt-6">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <FormatPanel />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="export" className="mt-6">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <ExportPanel />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-auto px-6 pb-6">
        <Separator className="mb-4" />
        <button
          onClick={() => window.print()}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white shadow-lg py-3 rounded-lg font-medium transition-all transform active:scale-95"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}
