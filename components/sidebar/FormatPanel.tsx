"use client";

import { useDocumentStore } from "@/lib/store/documentStore";
import { getRecommendedPaperSize } from "@/lib/utils/paperSizes";
import { PAPER_SIZES } from "@/lib/utils/paperSizes";
import type { AcademicStyle, PaperSize, ViewMode } from "@/types/document";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function FormatPanel() {
  const document = useDocumentStore((state) => state.document);
  const setStyle = useDocumentStore((state) => state.setStyle);
  const setPaperSize = useDocumentStore((state) => state.setPaperSize);
  const setViewMode = useDocumentStore((state) => state.setViewMode);
  const setShowIndex = useDocumentStore((state) => state.setShowIndex);

  if (!document) return null;

  const handleStyleChange = (style: AcademicStyle) => {
    setStyle(style);
    const recommendedSize = getRecommendedPaperSize(style);
    setPaperSize(recommendedSize);
  };

  return (
    <div className="space-y-6 pr-4">
      <div className="space-y-2">
        <Label htmlFor="academic-style">Academic Style</Label>
        <Select
          value={document.style}
          onValueChange={(value) => handleStyleChange(value as AcademicStyle)}
        >
          <SelectTrigger id="academic-style">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="APA">APA 7 (Strict)</SelectItem>
            <SelectItem value="MLA">MLA 9 (Strict)</SelectItem>
            <SelectItem value="Chicago">Chicago / Turabian</SelectItem>
            <SelectItem value="Custom">Custom (Modern)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[10px] text-muted-foreground leading-tight">
          Enforces font (Times New Roman), margins (1"), spacing (2.0), and
          citation rules.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="paper-size">Paper Size</Label>
        <Select
          value={document.paperSize}
          onValueChange={(value) => setPaperSize(value as PaperSize)}
        >
          <SelectTrigger id="paper-size">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PAPER_SIZES).map(([key, size]) => (
              <SelectItem key={key} value={key}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {getRecommendedPaperSize(document.style) === document.paperSize && (
          <p className="text-[10px] text-green-600 dark:text-green-400">
            Recommended for {document.style}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>View Mode</Label>
        <div className="flex bg-muted p-1 rounded-lg">
          <button
            onClick={() => setViewMode("web")}
            className={cn(
              "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
              document.viewMode === "web"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Continuous
          </button>
          <button
            onClick={() => setViewMode("print")}
            className={cn(
              "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
              document.viewMode === "print"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Print Preview
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="show-index" className="text-sm">
          Generate Index / TOC
        </Label>
        <Switch
          id="show-index"
          checked={document.showIndex}
          onCheckedChange={setShowIndex}
        />
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Jump
        </Label>
        <ScrollArea className="h-48">
          <nav className="space-y-1">
            {document.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group flex items-start gap-2 p-2 rounded-md hover:bg-accent transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5 mt-1 text-muted-foreground group-hover:text-primary" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground line-clamp-1">
                  {section.title}
                </span>
              </a>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  );
}
