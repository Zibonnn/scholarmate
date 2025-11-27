import type { PaperSize, PaperSizeConfig } from "@/types/document";

export const PAPER_SIZES: Record<PaperSize, PaperSizeConfig> = {
  a4: {
    name: "A4",
    width: "210mm",
    height: "297mm",
    label: "A4 (210 x 297mm)",
  },
  letter: {
    name: "Letter",
    width: "215.9mm",
    height: "279.4mm",
    label: "US Letter (8.5 x 11in)",
  },
  legal: {
    name: "Legal",
    width: "215.9mm",
    height: "355.6mm",
    label: "US Legal (8.5 x 14in)",
  },
};

export const getRecommendedPaperSize = (
  style: string
): PaperSize => {
  switch (style) {
    case "APA":
    case "MLA":
      return "letter";
    case "Chicago":
      return "a4";
    default:
      return "a4";
  }
};

