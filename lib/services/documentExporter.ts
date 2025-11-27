import { Document } from "@/types/document";
import { formatCitation } from "@/lib/utils/citationFormatter";
import { getStyleRules } from "@/lib/utils/styleRules";
import { Document as DocxDocument, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

export interface ExportResult {
  buffer: Buffer;
  mimeType: string;
  filename: string;
}

export async function exportDocument(
  document: Document,
  format: "pdf" | "docx" | "md"
): Promise<ExportResult> {
  switch (format) {
    case "pdf":
      // For PDF, we'll use browser print for MVP
      // In production, you'd use puppeteer or @react-pdf/renderer
      throw new Error("PDF export via API not implemented. Use browser print instead.");
    
    case "docx":
      return await exportToDOCX(document);
    
    case "md":
      return await exportToMarkdown(document);
    
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

async function exportToDOCX(document: Document): Promise<ExportResult> {
  const styleRules = getStyleRules(document.style);
  const children: Paragraph[] = [];

  // Title
  children.push(
    new Paragraph({
      text: document.metadata.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Author and metadata
  if (document.metadata.author) {
    children.push(
      new Paragraph({
        text: document.metadata.author,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  if (document.metadata.institution) {
    children.push(
      new Paragraph({
        text: document.metadata.institution,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  // Sections
  for (const section of document.sections) {
    children.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );

    for (const block of section.content) {
      if (block.subtitle) {
        children.push(
          new Paragraph({
            text: block.subtitle,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          })
        );
      }

      // Split text into paragraphs
      const paragraphs = block.text.split(/\n\n+/);
      for (const para of paragraphs) {
        children.push(
          new Paragraph({
            text: para.trim(),
            spacing: { after: 200 },
            indent: {
              firstLine: styleRules.paragraphIndent === "0.5in" ? 720 : 0, // 0.5in = 720 twips
            },
          })
        );
      }
    }
  }

  // Bibliography
  if (document.bibliography.length > 0) {
    children.push(
      new Paragraph({
        text:
          document.style === "APA"
            ? "References"
            : document.style === "MLA"
              ? "Works Cited"
              : "Bibliography",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 },
      })
    );

    for (const citation of document.bibliography.sort((a, b) =>
      a.authors[0].localeCompare(b.authors[0])
    )) {
      const citationText = formatCitation(citation, document.style);
      children.push(
        new Paragraph({
          text: citationText,
          spacing: { after: 200 },
          indent: {
            hanging: 720, // Hanging indent
          },
        })
      );
    }
  }

  const doc = new DocxDocument({
    sections: [
      {
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  return {
    buffer: Buffer.from(buffer),
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    filename: `${document.metadata.title || "document"}.docx`,
  };
}

async function exportToMarkdown(document: Document): Promise<ExportResult> {
  let markdown = `# ${document.metadata.title}\n\n`;

  if (document.metadata.author) {
    markdown += `**Author:** ${document.metadata.author}\n`;
  }
  if (document.metadata.date) {
    markdown += `**Date:** ${document.metadata.date}\n`;
  }
  if (document.metadata.institution) {
    markdown += `**Institution:** ${document.metadata.institution}\n`;
  }
  if (document.metadata.course) {
    markdown += `**Course:** ${document.metadata.course}\n`;
  }

  markdown += "\n---\n\n";

  // Sections
  for (const section of document.sections) {
    markdown += `## ${section.title}\n\n`;

    for (const block of section.content) {
      if (block.subtitle) {
        markdown += `### ${block.subtitle}\n\n`;
      }
      markdown += `${block.text}\n\n`;
    }
  }

  // Bibliography
  if (document.bibliography.length > 0) {
    markdown += `## ${
      document.style === "APA"
        ? "References"
        : document.style === "MLA"
          ? "Works Cited"
          : "Bibliography"
    }\n\n`;

    for (const citation of document.bibliography.sort((a, b) =>
      a.authors[0].localeCompare(b.authors[0])
    )) {
      markdown += `- ${formatCitation(citation, document.style)}\n`;
    }
  }

  return {
    buffer: Buffer.from(markdown, "utf-8"),
    mimeType: "text/markdown",
    filename: `${document.metadata.title || "document"}.md`,
  };
}

