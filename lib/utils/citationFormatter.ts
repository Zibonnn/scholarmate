import type { Citation, AcademicStyle } from "@/types/document";

export function formatCitation(
  citation: Citation,
  style: AcademicStyle
): string {
  const authors = citation.authors;
  const lastAuthor = authors.length > 1 ? authors[authors.length - 1] : null;
  const firstAuthors =
    authors.length > 1 ? authors.slice(0, -1).join(", ") : authors[0];

  const authorStr =
    authors.length > 1 ? `${firstAuthors} & ${lastAuthor}` : authors[0];

  switch (style) {
    case "APA":
      return `${authorStr} (${citation.year}). ${citation.title}. <i>${citation.source}</i>${
        citation.location ? `, ${citation.location}` : ""
      }.${citation.note ? ` ${citation.note}` : ""}`;

    case "MLA":
      return `${authorStr}. "${citation.title}." <i>${citation.source}</i>, ${citation.year}${
        citation.location ? `, ${citation.location}` : ""
      }.${citation.note ? ` ${citation.note}` : ""}`;

    case "Chicago":
      return `${authorStr}. ${citation.year}. "${citation.title}." <i>${citation.source}</i>.${
        citation.location ? ` ${citation.location}.` : ""
      }${citation.note ? ` ${citation.note}` : ""}`;

    default:
      return `${authorStr}. (${citation.year}). ${citation.title}.`;
  }
}

export function getCitationClassName(style: AcademicStyle): string {
  return "block pl-8 -indent-8 mb-4 leading-loose text-justify";
}

