import { create } from "zustand";
import type {
  Document,
  DocumentState,
  AcademicStyle,
  PaperSize,
  ViewMode,
  DocumentMetadata,
  DocumentSection,
  ContentBlock,
} from "@/types/document";

const initialState: Document = {
  metadata: {
    title: "",
    author: "",
    course: "",
    instructor: "",
    date: new Date().toLocaleDateString(),
    institution: "",
  },
  sections: [],
  bibliography: [],
  style: "APA",
  paperSize: "letter",
  viewMode: "print",
  showIndex: false,
};

export const useDocumentStore = create<DocumentState>((set) => ({
  document: initialState,
  isLoading: false,
  error: null,

  setDocument: (document: Document) => {
    // Ensure all section IDs are unique
    const seenIds = new Set<string>();
    const normalizedSections = document.sections.map((section, index) => {
      let uniqueId = section.id;
      // If ID is already seen or empty, generate a new one
      if (!uniqueId || seenIds.has(uniqueId)) {
        let counter = index + 1;
        uniqueId = `section-${counter}`;
        while (seenIds.has(uniqueId)) {
          counter++;
          uniqueId = `section-${counter}`;
        }
      }
      seenIds.add(uniqueId);
      return { ...section, id: uniqueId };
    });

    set({
      document: { ...document, sections: normalizedSections },
      error: null,
    });
  },

  updateMetadata: (metadata: Partial<DocumentMetadata>) =>
    set((state) => ({
      document: state.document
        ? { ...state.document, metadata: { ...state.document.metadata, ...metadata } }
        : null,
    })),

  updateSection: (sectionId: string, section: Partial<DocumentSection>) =>
    set((state) => {
      if (!state.document) return state;
      return {
        document: {
          ...state.document,
          sections: state.document.sections.map((s) =>
            s.id === sectionId ? { ...s, ...section } : s
          ),
        },
      };
    }),

  updateContentBlock: (
    sectionId: string,
    blockIndex: number,
    block: Partial<ContentBlock>
  ) =>
    set((state) => {
      if (!state.document) return state;
      return {
        document: {
          ...state.document,
          sections: state.document.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const newContent = [...s.content];
            newContent[blockIndex] = { ...newContent[blockIndex], ...block };
            return { ...s, content: newContent };
          }),
        },
      };
    }),

  addSection: (section: DocumentSection) =>
    set((state) => {
      if (!state.document) return state;
      return {
        document: {
          ...state.document,
          sections: [...state.document.sections, section],
        },
      };
    }),

  deleteSection: (sectionId: string) =>
    set((state) => {
      if (!state.document) return state;
      return {
        document: {
          ...state.document,
          sections: state.document.sections.filter((s) => s.id !== sectionId),
        },
      };
    }),

  addParagraph: (sectionId: string) =>
    set((state) => {
      if (!state.document) return state;
      return {
        document: {
          ...state.document,
          sections: state.document.sections.map((s) => {
            if (s.id !== sectionId) return s;
            return {
              ...s,
              content: [
                ...s.content,
                { subtitle: "", text: "New paragraph text..." },
              ],
            };
          }),
        },
      };
    }),

  setStyle: (style: AcademicStyle) =>
    set((state) => ({
      document: state.document ? { ...state.document, style } : null,
    })),

  setPaperSize: (size: PaperSize) =>
    set((state) => ({
      document: state.document ? { ...state.document, paperSize: size } : null,
    })),

  setViewMode: (mode: ViewMode) =>
    set((state) => ({
      document: state.document ? { ...state.document, viewMode: mode } : null,
    })),

  setShowIndex: (show: boolean) =>
    set((state) => ({
      document: state.document ? { ...state.document, showIndex: show } : null,
    })),

  reset: () => set({ document: null, error: null }),
}));

