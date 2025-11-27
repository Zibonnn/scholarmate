import mammoth from "mammoth";
import { marked } from "marked";
import type { Document, Citation } from "@/types/document";

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

    // Extract bibliography from text
    const bibliography = extractBibliography(text);

    return {
      metadata,
      sections,
      bibliography,
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
  let sectionCounter = 1; // Use a counter to ensure unique IDs

  for (const line of lines) {
    // Check if line looks like a section header (numbered or all caps)
    // But skip bibliography/references headers
    const isBibliographyHeader = /^(?:bibliography|references|works\s+cited|works\s+consulted|citations?|sources?)[\s:]*$/i.test(line);
    if (isBibliographyHeader) {
      // If we hit bibliography, save current section and stop
      if (currentSection && currentContent.length > 0) {
        currentSection.content.push({
          text: currentContent.join("\n"),
        });
        sections.push(currentSection);
      }
      break;
    }
    
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

      // Start new section with unique ID
      currentSection = {
        id: `section-${sectionCounter++}`,
        title: line.replace(/^#+\s+/, "").trim(),
        content: [],
      };
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    } else {
      // First section
      currentSection = {
        id: `section-${sectionCounter++}`,
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
      id: `section-${sectionCounter++}`,
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
  let sectionCounter = 1; // Use a counter to ensure unique IDs

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
        id: `section-${sectionCounter++}`,
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

function extractBibliography(text: string): Citation[] {
  const citations: Citation[] = [];
  
  // ONLY look for explicit bibliography section headers (case-insensitive)
  // Do NOT use fallback pattern matching - too aggressive
  const bibliographyPatterns = [
    /^(?:bibliography|references|works\s+cited|works\s+consulted)[\s:]*$/i,
  ];
  
  const lines = text.split("\n").map(line => line.trim()).filter(line => line.length > 0);
  let bibliographyStartIndex = -1;
  
  // Find the bibliography section - MUST have explicit header
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (bibliographyPatterns.some(pattern => pattern.test(line))) {
      bibliographyStartIndex = i + 1;
      break;
    }
  }
  
  // Only extract if we found an explicit bibliography header
  if (bibliographyStartIndex === -1) {
    return citations;
  }
  
  // Extract citations from bibliography section
  let citationId = 1;
  let currentCitationLines: string[] = [];
  
  for (let i = bibliographyStartIndex; i < lines.length; i++) {
    const line = lines[i];
    
    // Stop if we hit another major section header (not part of bibliography)
    if (/^#{1,3}\s+[A-Z]/.test(line) && !line.toLowerCase().includes("bibliography") && !line.toLowerCase().includes("reference")) {
      break;
    }
    
    // Skip empty lines
    if (!line) {
      if (currentCitationLines.length > 0) {
        const citation = parseCitation(currentCitationLines.join(" "), citationId++);
        if (citation && citation.authors[0] !== "Unknown Author") {
          citations.push(citation);
        }
        currentCitationLines = [];
      }
      continue;
    }
    
    // Check if this line starts a new citation (numbered, bulleted, or starts with author name pattern)
    if (currentCitationLines.length > 0 && isNewCitationStart(line)) {
      // Save previous citation
      const citation = parseCitation(currentCitationLines.join(" "), citationId++);
      if (citation && citation.authors[0] !== "Unknown Author") {
        citations.push(citation);
      }
      currentCitationLines = [line];
    } else {
      currentCitationLines.push(line);
    }
  }
  
  // Don't forget the last citation
  if (currentCitationLines.length > 0) {
    const citation = parseCitation(currentCitationLines.join(" "), citationId++);
    if (citation && citation.authors[0] !== "Unknown Author") {
      citations.push(citation);
    }
  }
  
  return citations;
}

function isNewCitationStart(line: string): boolean {
  // Check if line starts a new citation:
  // - Starts with number or bullet
  // - Starts with author name pattern
  // - Starts with hanging indent (common in formatted citations)
  return (
    /^\d+[\.\)]\s/.test(line) ||
    /^[•\-\*]\s/.test(line) ||
    /^[A-Z][a-z]+,\s*[A-Z]/.test(line) ||
    /^[A-Z][a-z]+\s+&/.test(line)
  );
}

function parseCitation(citationText: string, id: number): Citation | null {
  // Clean up the citation text
  citationText = citationText
    .replace(/^\d+[\.\)]\s*/, "") // Remove leading numbers
    .replace(/^[•\-\*]\s*/, "") // Remove bullets
    .trim();
  
  // Must be long enough and have some structure
  if (citationText.length < 30) {
    return null; // Too short to be a valid citation
  }
  
  // Must have at least a year or author pattern to be considered a citation
  const hasYear = /\(?\d{4}\)?/.test(citationText);
  const hasAuthorPattern = /^[A-Z][a-z]+,\s*[A-Z]/.test(citationText) || /^[A-Z][a-z]+\s+&/.test(citationText);
  
  if (!hasYear && !hasAuthorPattern) {
    return null; // Doesn't look like a citation
  }
  
  // Try to extract components using common patterns
  // Pattern 1: Author (Year). Title. Source, Location.
  // Pattern 2: Author. "Title." Source, Year, Location.
  // Pattern 3: Author. Year. "Title." Source. Location.
  
  let authors: string[] = [];
  let year = "";
  let title = "";
  let source = "";
  let location = "";
  let note = "";
  let type: Citation["type"] = "other";
  
  // Extract year (most reliable)
  const yearMatch = citationText.match(/\((\d{4})\)|\[(\d{4})\]|,\s*(\d{4})/);
  if (yearMatch) {
    year = yearMatch[1] || yearMatch[2] || yearMatch[3] || "";
  }
  
  // Extract authors (usually at the start, before year or first period)
  // Look for patterns like "Last, First" or "Last, F." or "Last & Last"
  const authorEndMatch = citationText.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?(?:\s*,\s*[A-Z][a-z]+(?:\.[A-Z])?)?(?:\s*&\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)?)(?:\s*\(|\s*\[|\s*\.|$)/);
  if (authorEndMatch) {
    const authorPart = authorEndMatch[1].trim();
    // Split by "&" or "," to get multiple authors
    if (authorPart.includes("&")) {
      authors = authorPart.split("&").map(a => a.trim().replace(/,$/, "")).filter(a => a.length > 0);
    } else if (authorPart.includes(",")) {
      // Could be "Last, First" or multiple authors
      const parts = authorPart.split(",").map(a => a.trim()).filter(a => a.length > 0);
      // If first part looks like a last name (single word, capitalized), it's probably "Last, First"
      if (parts.length === 2 && /^[A-Z][a-z]+$/.test(parts[0])) {
        authors = [authorPart]; // Keep as "Last, First"
      } else if (parts.length <= 3) {
        authors = parts;
      } else {
        authors = [authorPart];
      }
    } else {
      authors = [authorPart];
    }
  }
  
  // If we couldn't extract authors, return null (don't create citation with Unknown Author)
  if (authors.length === 0 || authors[0].length < 2) {
    return null;
  }
  
  // Extract title (usually in quotes or between periods)
  const titleMatch = citationText.match(/[""]([^""]+)[""]|\.\s*([^\.]+?)\s*\./);
  if (titleMatch) {
    title = (titleMatch[1] || titleMatch[2] || "").trim();
  } else {
    // Try to extract title from text after authors/year
    const afterAuthor = citationText.replace(/^[^\(\[\.,]+/, "").trim();
    const titlePart = afterAuthor.split(/[\.\?\!]/)[0]?.trim();
    if (titlePart && titlePart.length > 5) {
      title = titlePart;
    }
  }
  
  // Extract source (often italicized, in quotes, or after title)
  // Look for journal names, book titles, website names
  const sourcePatterns = [
    /<i>([^<]+)<\/i>/,
    /[""]([^""]+)[""]/,
    /,\s*([A-Z][^,\.]+?)(?:,|\s*\.)/,
  ];
  
  for (const pattern of sourcePatterns) {
    const match = citationText.match(pattern);
    if (match && match[1] && match[1] !== title) {
      source = match[1].trim();
      break;
    }
  }
  
  // Extract location (page numbers, URLs, etc.)
  const locationMatch = citationText.match(/(?:pp?\.|pages?|retrieved from|from)\s*([^,\.]+)/i);
  if (locationMatch) {
    location = locationMatch[1].trim();
  }
  
  // Determine type based on content
  if (citationText.toLowerCase().includes("journal") || citationText.toLowerCase().includes("vol.")) {
    type = "journal";
  } else if (citationText.toLowerCase().includes("http") || citationText.toLowerCase().includes("www")) {
    type = "website";
  } else if (citationText.toLowerCase().includes("publisher") || citationText.toLowerCase().includes("press")) {
    type = "book";
  }
  
  // If we couldn't extract enough info, try a simpler approach
  if (!title && !source) {
    // Fallback: use the citation text as title
    const parts = citationText.split(/[\.\?\!]/).filter(p => p.trim().length > 0);
    if (parts.length > 0) {
      title = parts.slice(0, 2).join(". ").trim();
    }
  }
  
  // Only return citation if we have meaningful data
  // Must have at least authors and either title or source
  if (authors.length === 0 || (!title && !source)) {
    return null;
  }
  
  return {
    id,
    authors,
    year: year || new Date().getFullYear().toString(),
    title: title || "Untitled",
    source: source || "Unknown Source",
    location,
    note,
    type,
  };
}

