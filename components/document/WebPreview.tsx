"use client";

import { useDocumentStore } from "@/lib/store/documentStore";
import { PaperSheet } from "./PaperSheet";
import { getStyleRules } from "@/lib/utils/styleRules";
import { formatCitation, getCitationClassName } from "@/lib/utils/citationFormatter";
import { cn } from "@/lib/utils/cn";

export function WebPreview() {
  const document = useDocumentStore((state) => state.document);
  if (!document) return null;

  const styleRules = getStyleRules(document.style);

  return (
    <div className="py-8 px-4">
      <PaperSheet viewMode="web">
        <div
          className="border-b border-black pb-8 mb-8 text-center"
          style={{
            fontFamily: styleRules.fontFamily,
          }}
        >
          <h1 className="text-3xl font-bold font-serif mb-4">
            {document.metadata.title}
          </h1>
          <p className="text-slate-600">
            {document.metadata.author} • {document.metadata.date}
          </p>
        </div>
      </PaperSheet>

      {document.sections.map((section) => (
        <PaperSheet key={section.id} viewMode="web" className="scroll-mt-8" id={section.id}>
          <section
            style={{
              fontFamily: styleRules.fontFamily,
              fontSize: styleRules.fontSize,
              lineHeight: styleRules.lineHeight,
            }}
          >
            <h2
              className={cn(
                "font-bold mb-4",
                styleRules.headingAlignment === "center" && "text-center",
                styleRules.headingAlignment === "left" && "text-left"
              )}
            >
              {section.title}
            </h2>

            <div>
              {section.content.map((block, idx) => (
                <div key={idx} className="mb-4">
                  {block.subtitle && (
                    <h3 className="font-bold mb-2 mt-4">{block.subtitle}</h3>
                  )}
                  <p
                    className="text-justify"
                    style={{
                      textIndent: styleRules.paragraphIndent,
                    }}
                  >
                    {block.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </PaperSheet>
      ))}

      <PaperSheet viewMode="web" id="bibliography">
        <section className="pt-8">
          <h2
            className={cn(
              "font-bold mb-4",
              styleRules.headingAlignment === "center" && "text-center"
            )}
            style={{
              fontFamily: styleRules.fontFamily,
              fontSize: styleRules.fontSize,
            }}
          >
            {document.style === "APA"
              ? "References"
              : document.style === "MLA"
                ? "Works Cited"
                : "Bibliography"}
          </h2>

          <div className="citation-list">
            {document.bibliography
              .sort((a, b) => a.authors[0].localeCompare(b.authors[0]))
              .map((citation) => (
                <div
                  key={citation.id}
                  className={getCitationClassName(document.style)}
                  dangerouslySetInnerHTML={{
                    __html: formatCitation(citation, document.style),
                  }}
                />
              ))}
          </div>
        </section>
      </PaperSheet>
    </div>
  );
}

