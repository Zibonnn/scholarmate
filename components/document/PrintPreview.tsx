"use client";

import { useDocumentStore } from "@/lib/store/documentStore";
import { PaperSheet } from "./PaperSheet";
import { getStyleRules } from "@/lib/utils/styleRules";
import { formatCitation, getCitationClassName } from "@/lib/utils/citationFormatter";
import { cn } from "@/lib/utils/cn";

export function PrintPreview() {
  const document = useDocumentStore((state) => state.document);
  if (!document) return null;

  const styleRules = getStyleRules(document.style);

  const renderTitleSection = () => {
    if (document.style === "MLA" && !document.showIndex) {
      return null;
    }

    if (document.style === "APA" || document.style === "Chicago") {
      return (
        <PaperSheet pageNum={1} viewMode="print">
          <div
            className={cn(
              "flex flex-col items-center justify-center h-full text-center space-y-6 pt-20",
              document.style === "Chicago" && "mt-48 mb-48"
            )}
            style={{
              fontFamily: styleRules.fontFamily,
              fontSize: styleRules.fontSize,
              lineHeight: styleRules.lineHeight,
            }}
          >
            <h1
              className={cn(
                "font-bold w-2/3 mb-4",
                document.style === "Chicago" && "uppercase tracking-wide"
              )}
            >
              {document.metadata.title}
            </h1>
            <div className="space-y-2">
              <p>{document.metadata.author}</p>
              {document.metadata.institution && (
                <p>{document.metadata.institution}</p>
              )}
              {document.metadata.course && <p>{document.metadata.course}</p>}
              {document.metadata.instructor && (
                <p>{document.metadata.instructor}</p>
              )}
              <p>{document.metadata.date}</p>
            </div>
          </div>
        </PaperSheet>
      );
    }

    return null;
  };

  const renderTableOfContents = () => {
    if (!document.showIndex) return null;

    const pageNum = document.style === "MLA" ? 1 : 2;

    return (
      <PaperSheet pageNum={pageNum} viewMode="print">
        <section>
          <h2
            className="uppercase tracking-widest text-xl mb-8 font-bold text-center"
            style={{
              fontFamily: styleRules.fontFamily,
              fontSize: styleRules.fontSize,
            }}
          >
            Table of Contents
          </h2>
          <div className="space-y-2">
            {document.sections.map((section) => (
              <div
                key={section.id}
                className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1"
              >
                <span className="font-semibold">{section.title}</span>
                <span className="text-slate-400 text-sm">pg.</span>
              </div>
            ))}
            <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1 pt-2">
              <span className="font-semibold">
                {document.style === "APA"
                  ? "References"
                  : document.style === "MLA"
                    ? "Works Cited"
                    : "Bibliography"}
              </span>
              <span className="text-slate-400 text-sm">pg.</span>
            </div>
          </div>
        </section>
      </PaperSheet>
    );
  };

  const calculatePageOffset = () => {
    if (document.style === "MLA") {
      return document.showIndex ? 2 : 1;
    }
    return document.showIndex ? 3 : 2;
  };

  const pageOffset = calculatePageOffset();

  return (
    <div id="print-preview-content" className="py-12 px-8">
      {renderTitleSection()}
      {renderTableOfContents()}

      {document.sections.map((section, index) => {
        const pageNum = pageOffset + index;
        const isFirstSection = index === 0;

        return (
          <PaperSheet
            key={section.id}
            pageNum={pageNum}
            viewMode="print"
            className="scroll-mt-8"
            id={section.id}
          >
            {document.style === "MLA" && isFirstSection && !document.showIndex && (
              <div className="mb-6" style={{ lineHeight: styleRules.lineHeight }}>
                <p>{document.metadata.author}</p>
                {document.metadata.instructor && (
                  <p>{document.metadata.instructor}</p>
                )}
                {document.metadata.course && <p>{document.metadata.course}</p>}
                <p>{document.metadata.date}</p>
                <h1 className="text-center font-bold mt-6 mb-0">
                  {document.metadata.title}
                </h1>
              </div>
            )}

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
                  <div key={idx}>
                    {block.subtitle && (
                      <h3 className="font-bold mb-2 mt-4">{block.subtitle}</h3>
                    )}
                    <p
                      className="text-justify"
                      style={{
                        textIndent: styleRules.paragraphIndent,
                        marginBottom: "1rem",
                      }}
                    >
                      {block.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </PaperSheet>
        );
      })}

      <PaperSheet
        pageNum={document.sections.length + (document.style === "MLA" ? 1 : 2)}
        viewMode="print"
        id="bibliography"
      >
        <section className={document.style === "MLA" ? "" : "pt-8"}>
          <h2
            className={cn(
              "font-bold text-center mb-4",
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

