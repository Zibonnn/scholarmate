export type AcademicStyle = "APA" | "MLA" | "Chicago" | "Custom";

export type PaperSize = "a4" | "letter" | "legal";

export type ViewMode = "print" | "web";

export interface PaperSizeConfig {
  name: string;
  width: string;
  height: string;
  label: string;
}

export interface DocumentMetadata {
  title: string;
  author: string;
  course?: string;
  instructor?: string;
  date: string;
  institution?: string;
}

export interface ContentBlock {
  subtitle?: string;
  text: string;
}

export interface DocumentSection {
  id: string;
  title: string;
  content: ContentBlock[];
}

export interface Citation {
  id: number;
  authors: string[];
  year: string;
  title: string;
  source: string;
  location?: string;
  note?: string;
  type: "journal" | "book" | "website" | "other";
}

export interface Document {
  id?: string;
  metadata: DocumentMetadata;
  sections: DocumentSection[];
  bibliography: Citation[];
  style: AcademicStyle;
  paperSize: PaperSize;
  viewMode: ViewMode;
  showIndex: boolean;
}

export interface DocumentState {
  document: Document | null;
  isLoading: boolean;
  error: string | null;
  setDocument: (document: Document) => void;
  updateMetadata: (metadata: Partial<DocumentMetadata>) => void;
  updateSection: (sectionId: string, section: Partial<DocumentSection>) => void;
  updateContentBlock: (
    sectionId: string,
    blockIndex: number,
    block: Partial<ContentBlock>
  ) => void;
  addSection: (section: DocumentSection) => void;
  deleteSection: (sectionId: string) => void;
  setStyle: (style: AcademicStyle) => void;
  setPaperSize: (size: PaperSize) => void;
  setViewMode: (mode: ViewMode) => void;
  setShowIndex: (show: boolean) => void;
  addParagraph: (sectionId: string) => void;
  reset: () => void;
}

