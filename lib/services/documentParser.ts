import mammoth from "mammoth";
import { marked } from "marked";
import type { Document } from "@/types/document";

// Dynamic import for pdf-parse to handle ESM/CJS compatibility
const getPdfParse = async () => {
  const pdfParseModule = await import("pdf-parse");
  // pdf-parse exports the function directly, not as default
  return (pdfParseModule as any).default || pdfParseModule;
};

export async function parseDocument(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<Document> {
  const extension = filename.split(".").pop()?.toLowerCase();

  let text = "";
  let sections: Document["sections"] = [];
  let metadata: Document["metadata"] = {
    title: filename.replace(/\.[^/.]+$/, ""),
    author: "",
    date: new Date().toLocaleDateString(),
  };

  try {
    if (extension === "pdf" || mimeType === "application/pdf") {
      const pdfParse = await getPdfParse();
      const data = await pdfParse(buffer);
      text = data.text;
      metadata.title = data.info?.Title || metadata.title;
      metadata.author = data.info?.Author || metadata.author;
    } else if (
      extension === "docx" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
      const htmlResult = await mammoth.convertToHtml({ buffer });
      // Try to extract metadata from HTML if available
    } else if (extension === "md" || mimeType === "text/markdown") {
      text = buffer.toString("utf-8");
      const html = await marked.parse(text);
      // Extract sections from markdown headers
      sections = extractSectionsFromMarkdown(text);
    } else if (extension === "rtf" || mimeType === "text/rtf" || mimeType === "application/rtf") {
      text = parseRTF(buffer.toString("utf-8"));
    } else {
      text = buffer.toString("utf-8");
    }

    // If no sections were extracted, create default structure
    if (sections.length === 0) {
      sections = extractSectionsFromText(text);
    }

    return {
      metadata,
      sections,
      bibliography: [],
      style: "APA",
      paperSize: "letter",
      viewMode: "print",
      showIndex: false,
    };
  } catch (error) {
    console.error("Parsing error:", error);
    throw new Error(
      `Failed to parse document: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

function extractSectionsFromText(text: string): Document["sections"] {
  const lines = text.split("\n").filter((line) => line.trim());
  const sections: Document["sections"] = [];
  let currentSection: Document["sections"][0] | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    // Check if line looks like a section header (numbered or all caps)
    const isHeader =
      /^\d+\.\s+[A-Z]/.test(line) ||
      /^[A-Z][A-Z\s]{10,}$/.test(line) ||
      /^#{1,3}\s+/.test(line);

    if (isHeader && currentContent.length > 0) {
      // Save previous section
      if (currentSection) {
        currentSection.content.push({
          text: currentContent.join("\n"),
        });
        sections.push(currentSection);
      }

      // Start new section
      currentSection = {
        id: `section-${sections.length + 1}`,
        title: line.replace(/^#+\s+/, "").trim(),
        content: [],
      };
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    } else {
      // First section
      currentSection = {
        id: "section-1",
        title: "Introduction",
        content: [],
      };
      currentContent.push(line);
    }
  }

  // Add last section
  if (currentSection && currentContent.length > 0) {
    currentSection.content.push({
      text: currentContent.join("\n"),
    });
    sections.push(currentSection);
  }

  // If no sections found, create one with all text
  if (sections.length === 0) {
    sections.push({
      id: "section-1",
      title: "Content",
      content: [{ text }],
    });
  }

  return sections;
}

function extractSectionsFromMarkdown(text: string): Document["sections"] {
  const sections: Document["sections"] = [];
  const lines = text.split("\n");
  let currentSection: Document["sections"][0] | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headerMatch) {
      if (currentSection && currentContent.length > 0) {
        currentSection.content.push({
          text: currentContent.join("\n"),
        });
        sections.push(currentSection);
      }

      currentSection = {
        id: `section-${sections.length + 1}`,
        title: headerMatch[2],
        content: [],
      };
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentSection) {
    if (currentContent.length > 0) {
      currentSection.content.push({
        text: currentContent.join("\n"),
      });
    }
    sections.push(currentSection);
  }

  return sections.length > 0 ? sections : extractSectionsFromText(text);
}

function parseRTF(rtfText: string): string {
  // Basic RTF parsing - remove RTF control codes
  let text = rtfText
    .replace(/\\[a-z]+\d*\s?/gi, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

