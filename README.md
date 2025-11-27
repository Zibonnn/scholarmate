# ScholarMate

A professional academic document formatting tool that allows users to upload documents in various formats (PDF, DOCX, MD, RTF) and format them according to academic style guides (APA 7, MLA 9, Chicago).

## Features

- **Document Upload**: Support for PDF, DOCX, Markdown, and RTF formats
- **Academic Formatting**: Strict formatting for APA 7, MLA 9, Chicago, and Custom styles
- **Dual Preview Modes**: 
  - Print Preview: Shows exactly how the document will look when printed with page breaks
  - Web Preview: Continuous scroll view for easy reading
- **Paper Size Recommendations**: Automatically recommends paper size based on selected style
- **Export Options**: Export to PDF (via print), DOCX, and Markdown
- **Light/Dark Theme**: Beautiful UI with theme switching
- **Table of Contents**: Auto-generate table of contents
- **Citation Formatting**: Proper citation formatting with hanging indents

## Tech Stack

- **Next.js 16.0.5** with Turbopack
- **React 19** with TypeScript
- **Tailwind CSS** with dark mode
- **Zustand** for state management
- **next-themes** for theme switching
- **Document Parsing**: pdf-parse, mammoth, marked, rtf-parser
- **Document Export**: docx library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
scholarmate/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── editor/            # Editor pages
│   └── page.tsx           # Home/upload page
├── components/            # React components
│   ├── document/         # Document viewer components
│   ├── sidebar/           # Sidebar panels
│   ├── upload/            # Upload components
│   └── ui/                # UI components
├── lib/                   # Utilities and services
│   ├── services/         # Document parsing, formatting, export
│   ├── store/            # Zustand store
│   └── utils/            # Helper functions
└── types/                 # TypeScript types
```

## Usage

1. **Upload a Document**: Drag and drop or click to upload a PDF, DOCX, MD, or RTF file
2. **Choose Formatting Style**: Select APA, MLA, Chicago, or Custom
3. **Select Paper Size**: Choose A4, Letter, or Legal (recommended size shown)
4. **Preview**: Switch between Print Preview and Web Preview
5. **Export**: Download as PDF (print), DOCX, or Markdown

## Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

ISC
