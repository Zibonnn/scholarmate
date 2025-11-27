import type { AcademicStyle } from "@/types/document";

export interface StyleRules {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  paragraphIndent: string;
  headingAlignment: "left" | "center" | "right";
  pageNumberFormat: (pageNum: number, author?: string) => string;
  titlePageRequired: boolean;
}

export function getStyleRules(style: AcademicStyle): StyleRules {
  switch (style) {
    case "APA":
      return {
        fontFamily: "'Times New Roman', serif",
        fontSize: "12pt",
        lineHeight: "2.0",
        paragraphIndent: "0.5in",
        headingAlignment: "center",
        pageNumberFormat: (pageNum) => `${pageNum}`,
        titlePageRequired: true,
      };

    case "MLA":
      return {
        fontFamily: "'Times New Roman', serif",
        fontSize: "12pt",
        lineHeight: "2.0",
        paragraphIndent: "0.5in",
        headingAlignment: "left",
        pageNumberFormat: (pageNum, author) => {
          const lastName = author?.split(" ").pop() || "";
          return `${lastName} ${pageNum}`;
        },
        titlePageRequired: false,
      };

    case "Chicago":
      return {
        fontFamily: "'Times New Roman', serif",
        fontSize: "12pt",
        lineHeight: "2.0",
        paragraphIndent: "0.5in",
        headingAlignment: "center",
        pageNumberFormat: (pageNum) => `${pageNum}`,
        titlePageRequired: true,
      };

    default: // Custom
      return {
        fontFamily: "'Inter', sans-serif",
        fontSize: "14pt",
        lineHeight: "1.6",
        paragraphIndent: "0",
        headingAlignment: "left",
        pageNumberFormat: (pageNum) => `${pageNum}`,
        titlePageRequired: false,
      };
  }
}

