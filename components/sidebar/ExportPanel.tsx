"use client";

import { useDocumentStore } from "@/lib/store/documentStore";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ExportPanel() {
  const doc = useDocumentStore((state) => state.document);

  if (!doc) return null;

  const handleExportPDF = async () => {
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "pdf", document: doc }),
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.metadata.title || "document"}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF export error:", error);
      alert("Failed to export PDF. Try using Print instead.");
    }
  };

  const handleExportDOCX = async () => {
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "docx", document: doc }),
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.metadata.title || "document"}.docx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("DOCX export error:", error);
      alert("Failed to export DOCX");
    }
  };

  const handleExportMD = async () => {
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "md", document: doc }),
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.metadata.title || "document"}.md`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("MD export error:", error);
      alert("Failed to export Markdown");
    }
  };

  return (
    <div className="space-y-4 pr-4">
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Export Options
        </Label>

        <Button
          onClick={handleExportPDF}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>

        <Button
          onClick={handleExportDOCX}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Download DOCX
        </Button>

        <Button
          onClick={handleExportMD}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Download Markdown
        </Button>
      </div>
    </div>
  );
}
