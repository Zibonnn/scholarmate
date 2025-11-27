# ScholarMate - Issues to Fix

This document tracks current issues that need to be addressed.

## Critical Issues

### 1. Duplicate Section IDs

**Status:** 🔴 Active  
**Priority:** High  
**First Reported:** Current session

**Description:**
React is throwing warnings about duplicate section IDs (`section-1` appears multiple times). This causes:
- Console errors in FormatPanel.tsx (line 132)
- Console errors in PrintPreview.tsx (line 123)
- Potential rendering issues with duplicate keys

**Error Messages:**
```
Encountered two children with the same key, `section-1`. Keys should be unique so that components maintain their identity across updates.
```

**Locations:**
- `components/sidebar/FormatPanel.tsx:132` - Quick Jump navigation
- `components/document/PrintPreview.tsx:123` - Section rendering

**Attempted Fixes:**
1. ✅ Added `sectionCounter` in `extractSectionsFromText()` and `extractSectionsFromMarkdown()`
2. ✅ Added normalization in `setDocument()` in `lib/store/documentStore.ts` to ensure unique IDs

**Root Cause:**
- Parser may still be creating duplicate IDs in edge cases
- Normalization may not be working as expected
- Need to investigate if sections are being duplicated during parsing

**Next Steps:**
- [ ] Add logging to track section ID generation
- [ ] Verify normalization is actually running
- [ ] Check if sections are being duplicated during document parsing
- [ ] Consider using UUIDs for section IDs instead of sequential numbers
- [ ] Add validation to prevent duplicate IDs at the parser level

**Related Files:**
- `lib/services/documentParser.ts`
- `lib/store/documentStore.ts`
- `components/sidebar/FormatPanel.tsx`
- `components/document/PrintPreview.tsx`

---

## Medium Priority Issues

### 2. Bibliography Parsing Quality

**Status:** 🟡 Needs Improvement  
**Priority:** Medium

**Description:**
Bibliography extraction is working but may need refinement:
- Some citations may not be parsed correctly
- Author extraction could be more accurate
- Citation type detection needs improvement

**Related Files:**
- `lib/services/documentParser.ts` - `extractBibliography()` and `parseCitation()`

---

## Low Priority / Future Enhancements

### 3. ContentBlock ID Field

**Status:** 🟢 Optional  
**Priority:** Low

**Description:**
ContentBlock type doesn't have an `id` field, but EditMode might benefit from it for better content block management.

**Related Files:**
- `types/document.ts`
- `components/editor/EditMode.tsx`

---

## Notes

- All issues should be tested after fixes
- Consider adding unit tests for section ID uniqueness
- Document parser should be more defensive about ID generation

