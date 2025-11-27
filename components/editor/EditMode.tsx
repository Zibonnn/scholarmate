"use client";

import { useDocumentStore } from "@/lib/store/documentStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface EditModeProps {
  onSave?: () => void;
}

export function EditMode({ onSave }: EditModeProps) {
  const document = useDocumentStore((state) => state.document);
  const updateMetadata = useDocumentStore((state) => state.updateMetadata);
  const updateSection = useDocumentStore((state) => state.updateSection);
  const updateContentBlock = useDocumentStore((state) => state.updateContentBlock);
  const addParagraph = useDocumentStore((state) => state.addParagraph);

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-200/50 dark:bg-slate-800/50">
        <p className="text-slate-500 dark:text-slate-400">No document loaded</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-200/50 dark:bg-slate-800/50 py-8 px-8">
      <div className="max-w-4xl w-full mx-auto space-y-8 pb-20">
        <Card>
          <CardHeader>
            <CardTitle>Edit Document Content</CardTitle>
            <CardDescription>
              Modifying the text here will instantly update the Preview mode.
              Formatting options (fonts, spacing) are handled in the Preview tab.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Metadata Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Report Metadata (Cover Page)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title" className="text-xs font-semibold text-muted-foreground mb-1">
                  Report Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={document.metadata.title}
                  onChange={(e) => updateMetadata({ title: e.target.value })}
                  className="text-lg font-semibold"
                />
              </div>
              <div>
                <Label htmlFor="author" className="text-xs font-semibold text-muted-foreground mb-1">
                  Author Name
                </Label>
                <Input
                  id="author"
                  type="text"
                  value={document.metadata.author}
                  onChange={(e) => updateMetadata({ author: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="institution" className="text-xs font-semibold text-muted-foreground mb-1">
                  Institution / Department
                </Label>
                <Input
                  id="institution"
                  type="text"
                  value={document.metadata.institution || ""}
                  onChange={(e) => updateMetadata({ institution: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="course" className="text-xs font-semibold text-muted-foreground mb-1">
                  Course Name
                </Label>
                <Input
                  id="course"
                  type="text"
                  value={document.metadata.course || ""}
                  onChange={(e) => updateMetadata({ course: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="instructor" className="text-xs font-semibold text-muted-foreground mb-1">
                  Instructor Name
                </Label>
                <Input
                  id="instructor"
                  type="text"
                  value={document.metadata.instructor || ""}
                  onChange={(e) => updateMetadata({ instructor: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="date" className="text-xs font-semibold text-muted-foreground mb-1">
                  Submission Date
                </Label>
                <Input
                  id="date"
                  type="text"
                  value={document.metadata.date}
                  onChange={(e) => updateMetadata({ date: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections Editor */}
        {document.sections.map((section, sIdx) => (
          <Card key={section.id}>
            <CardHeader>
              <Label htmlFor={`section-${section.id}`} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Section Title
              </Label>
              <Input
                id={`section-${section.id}`}
                type="text"
                value={section.title}
                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                className="text-xl font-bold border-b-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-none px-0"
              />
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {section.content.map((block, cIdx) => (
                  <div
                    key={cIdx}
                    className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md border border-slate-200 dark:border-slate-700 group hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
                  >
                    <div className="mb-3">
                      <Label
                        htmlFor={`subtitle-${section.id}-${cIdx}`}
                        className="text-xs font-semibold text-muted-foreground mb-1"
                      >
                        Subtitle (Optional)
                      </Label>
                      <Input
                        id={`subtitle-${section.id}-${cIdx}`}
                        type="text"
                        value={block.subtitle || ""}
                        onChange={(e) =>
                          updateContentBlock(section.id, cIdx, {
                            subtitle: e.target.value,
                          })
                        }
                        className="bg-transparent border-b border-slate-300 dark:border-slate-600 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-none px-0 text-sm font-semibold"
                        placeholder="Add subtitle..."
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor={`text-${section.id}-${cIdx}`}
                        className="text-xs font-semibold text-muted-foreground mb-1"
                      >
                        Paragraph Text
                      </Label>
                      <Textarea
                        id={`text-${section.id}-${cIdx}`}
                        value={block.text}
                        onChange={(e) =>
                          updateContentBlock(section.id, cIdx, {
                            text: e.target.value,
                          })
                        }
                        rows={6}
                        className="resize-y"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => addParagraph(section.id)}
                variant="ghost"
                size="sm"
                className="mt-4 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add new paragraph to section
              </Button>
            </CardContent>
          </Card>
        ))}

        <div className="fixed bottom-6 right-8 z-10">
          <Button
            onClick={onSave}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105"
          >
            <Save className="w-4 h-4" /> Save & Preview
          </Button>
        </div>
      </div>
    </div>
  );
}

