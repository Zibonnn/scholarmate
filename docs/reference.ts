import React, { useState, useRef, useEffect } from 'react';
import { Printer, Upload, Settings, BookOpen, ChevronRight, LayoutTemplate, FileText, Type, Sparkles, Brain, Volume2, Play, Pause, CheckCircle, XCircle, Edit3, Eye, Save } from 'lucide-react';

/**
 * GEMINI API CONFIGURATION
 */
const apiKey = ""; // API Key injected by environment

/**
 * MOCK DATA EXTRACTION - INITIAL STATE
 */

const INITIAL_METADATA = {
  title: "Impact of Influencers on the Consumer Decision-Making Process",
  author: "Alex Rivera", 
  course: "MKT 401: Consumer Psychology",
  instructor: "Dr. Sarah Jenkins",
  date: "October 14, 2025",
  institution: "Department of Marketing, State University"
};

const BIBLIOGRAPHY_DATA = [
  {
    id: 1,
    authors: ["Audrezet, A.", "de Kerviler, G.", "Guidry Moulard, J."],
    year: "2020",
    title: "Authenticity under threat: When social media influencers need to go beyond self-presentation",
    source: "Journal of Business Research",
    type: "journal"
  },
  {
    id: 2,
    authors: ["Blackwell, R. D.", "Miniard, P. W.", "Engel, J. F."],
    year: "2006",
    title: "Consumer Behavior",
    source: "Thomson Business and Economics",
    location: "Mason, OH",
    type: "book"
  },
  {
    id: 3,
    authors: ["Casaló, L. V.", "Flavián, C.", "Ibáñez-Sánchez, S."],
    year: "2020",
    title: "Influencers on Instagram: Antecedents and consequences of opinion leadership",
    source: "Journal of Business Research",
    type: "journal"
  },
  {
    id: 4,
    authors: ["Djafarova, E.", "Trofimenko, O."],
    year: "2019",
    title: "'Instafamous' – credibility and self-presentation of micro-celebrities on social media",
    source: "Information, Communication & Society",
    type: "journal"
  },
  {
    id: 5,
    authors: ["Evans, N. J.", "Phua, J.", "Lim, J.", "Jun, H."],
    year: "2017",
    title: "Disclosing Instagram sponsorship: A psychological perspective",
    source: "Journal of Interactive Marketing",
    type: "journal"
  },
  {
    id: 6,
    authors: ["Hovland, C. I.", "Janis, I. L.", "Kelley, H. H."],
    year: "1953",
    title: "Communication and Persuasion",
    source: "Yale University Press",
    location: "New Haven, CT",
    note: "(Source Credibility Theory)",
    type: "book"
  },
  {
    id: 7,
    authors: ["Jin, S. V.", "Muqaddam, A.", "Ryu, E."],
    year: "2019",
    title: "Instafamous and social media influencer marketing",
    source: "Marketing Intelligence & Planning",
    type: "journal"
  },
  {
    id: 8,
    authors: ["Lou, C.", "Yuan, S."],
    year: "2019",
    title: "Influencer marketing: How message value and credibility affect consumer trust of branded content on social media",
    source: "Journal of Interactive Advertising",
    type: "journal"
  },
  {
    id: 9,
    authors: ["McCracken, G."],
    year: "1989",
    title: "Who is the celebrity endorser? Cultural foundations of the endorsement process",
    source: "Journal of Consumer Research",
    note: "(Meaning Transfer Model)",
    type: "journal"
  },
  {
    id: 10,
    authors: ["Ohanian, R."],
    year: "1990",
    title: "Construction and validation of a scale to measure celebrity endorsers' perceived expertise, trustworthiness, and attractiveness",
    source: "Journal of Advertising",
    type: "journal"
  },
  {
    id: 11,
    authors: ["Silveira, P.", "J."],
    year: "2024",
    title: "Influencing Consumer Decisions on Instagram: The Differential Impact of Posts and Stories across the EKB Model",
    source: "Communication Today",
    type: "journal"
  },
  {
    id: 12,
    authors: ["Tajfel, H.", "Turner, J. C."],
    year: "1979",
    title: "An integrative theory of intergroup conflict",
    source: "The Social Psychology of Intergroup Relations",
    note: "(Social Identity Theory)",
    type: "book"
  }
];

const INITIAL_SECTIONS = [
  {
    id: "intro",
    title: "1. Introduction",
    content: [
      {
        subtitle: "1.1 The Paradigm Shift",
        text: "The contemporary marketing landscape has undergone a metamorphosis that is fundamentally reshaping the architecture of consumer behavior. We have transitioned from the era of mass communication—characterized by a vertical, one-to-many broadcast model where corporate entities held a monopoly on brand messaging—to a networked era of peer-to-peer influence. This shift is not merely technological but sociological. The traditional \"gatekeepers\" of media have been displaced by a decentralized network of content creators known as Social Media Influencers (SMIs), who have effectively democratized the power of persuasion. This democratization has altered the fundamental \"trust dynamics\" of the marketplace. Historically, consumers relied on institutional authority or celebrity endorsement to validate purchase decisions. Today, the locus of trust has shifted horizontally to individuals who cultivate perceived accessibility and intimacy."
      },
      {
        subtitle: "1.2 Defining the Modern Influencer",
        text: "An \"influencer\" is distinct from a traditional celebrity endorser. While celebrities gain fame through traditional talent channels (film, music, sports), influencers acquire \"social capital\" through the creation of content on social media platforms. They are defined as third-party endorsers who shape audience attitudes through blogs, tweets, and other forms of social media content. However, this definition captures only the functional aspect of their role. Psychologically, influencers are \"relatable\" figures who position themselves as \"someone like me,\" fostering a sense of homophily that is absent in traditional celebrity-fan relationships."
      },
      {
        subtitle: "1.3 Research Objectives and Scope",
        text: "This report aims to provide an exhaustive analysis of how these actors impact the consumer decision-making process. By utilizing the Engel-Kollat-Blackwell (EKB) model as a structural lens, we will dissect the influencer's role at every stage of the journey—from the initial triggering of a need to the post-purchase evaluation. We will integrate theories of Source Credibility, Parasocial Interaction, and Social Identity to explain why these effects occur."
      }
    ]
  },
  {
    id: "theory",
    title: "2. Theoretical Underpinnings of Digital Influence",
    content: [
      {
        subtitle: "2.1 The Digital EKB Model",
        text: "The Engel-Kollat-Blackwell (EKB) model, traditionally comprising five linear stages—Need Recognition, Information Search, Evaluation of Alternatives, Purchase Decision, and Post-Purchase Behavior—remains a robust framework but requires adaptation for the digital age. In the context of social media, the linearity of the model is often disrupted. The \"stimulus\" input is no longer discrete (e.g., a TV commercial) but continuous and algorithmic."
      },
      {
        subtitle: "2.2 Source Credibility Theory",
        text: "Source Credibility Theory (SCT) posits that the effectiveness of a message is dependent on the perceived credibility of the source. This credibility is typically dimensionalized into Expertise, Trustworthiness, and Attractiveness. In the influencer context, trustworthiness is the single most critical predictor of purchase intention."
      },
      {
        subtitle: "2.3 Parasocial Interaction (PSI)",
        text: "One of the most potent mechanisms in influencer marketing is Parasocial Interaction (PSI). Originally coined to describe the one-sided relationships audiences formed with TV personalities, PSI in the social media age is far more intense due to the interactive affordances of the platforms. Likes, comments, and direct messages create a \"reciprocal illusion,\" leading followers to feel they are in a genuine friendship with the influencer."
      }
    ]
  },
  {
    id: "architecture",
    title: "3. The Architecture of Influence: Typologies and Tiers",
    content: [
      {
        subtitle: "3.1 The Hierarchy of Influence",
        text: "The influencer ecosystem ranges from \"Mega-influencers\" (celebrities with millions of followers) to \"Nano-influencers\" (everyday consumers with fewer than 10,000 followers). Each tier engages distinct psychological mechanisms: Mega-influencers drive aspirational desire, while Nano-influencers drive trust-based conversion through personal validation."
      },
      {
        subtitle: "3.2 The Engagement Paradox",
        text: "A consistent finding in influencer research is the inverse relationship between audience size and engagement rate. As follower counts rise, the rate of interaction tends to decline. Empirical data indicates that Nano-influencers often achieve engagement rates between 4% and 10%, whereas Mega-influencers frequently see rates drop below 1-2%."
      }
    ]
  },
  {
    id: "platform",
    title: "4. Platform Ecology and Cognitive Processing",
    content: [
      {
        subtitle: "4.1 TikTok: Algorithmic Serendipity",
        text: "TikTok operates on an \"Interest Graph\" rather than a \"Social Graph.\" Its \"For You Page\" (FYP) algorithm serves content based on user interest signals rather than who the user follows. This architecture creates a unique environment for Need Recognition. Users are passively fed content they didn't know they wanted."
      },
      {
        subtitle: "4.3 YouTube: Search Intent",
        text: "YouTube functions primarily as a video search engine, making it dominant in the Information Search and Evaluation of Alternatives stages. Unlike the passive consumption of TikTok, YouTube users often arrive with \"active intent.\""
      }
    ]
  },
  {
    id: "journey",
    title: "5. The Consumer Decision-Making Journey",
    content: [
      {
        subtitle: "5.1 Phase I: Need Recognition",
        text: "Need recognition occurs when a consumer perceives a discrepancy between their actual state and a desired state. Influencers are uniquely potent at widening this gap. By showcasing idealized lifestyles, influencers heighten the viewer's \"self-discrepancy\"."
      },
      {
        subtitle: "5.3 Phase III: Evaluation of Alternatives",
        text: "In this stage, consumers weigh the attributes of different solutions. Influencers impact this through \"Meaning Transfer\" and \"Social Proof.\" A massive trend in this stage is the hunt for \"Dupes\" (duplicates)—cheaper alternatives to high-end products."
      },
      {
        subtitle: "5.4 Phase IV: The Purchase Decision",
        text: "The actual moment of purchase is increasingly integrated into the social experience. Platforms are integrating \"Social Commerce\" features that reduce the steps to purchase. Influencers act as the storefront."
      }
    ]
  },
  {
    id: "conclusion",
    title: "10. Conclusion",
    content: [
      {
        text: "The integration of influencers into the marketing mix is not a transient trend but a structural evolution of the consumer marketplace. Influencers have fundamentally rewired the Consumer Decision-Making Process. They act as catalysts that accelerate Need Recognition, dominate Information Search, validate Evaluation, and drive Purchase. Success in 2025 and beyond will rely not on reach, but on resonance—the ability to foster genuine, value-based connections in a fragmented digital world."
      }
    ]
  }
];

// --- Utilities ---

const PAPER_SIZES = {
  a4: { name: "A4", width: "210mm", height: "297mm", label: "A4 (210 x 297mm)" },
  letter: { name: "Letter", width: "215.9mm", height: "279.4mm", label: "US Letter (8.5 x 11in)" },
  legal: { name: "Legal", width: "215.9mm", height: "355.6mm", label: "US Legal (8.5 x 14in)" },
};

function formatCitation(item, style) {
  const authors = item.authors;
  const lastAuthor = authors.length > 1 ? authors[authors.length - 1] : null;
  const firstAuthors = authors.length > 1 ? authors.slice(0, -1).join(", ") : authors[0];
  
  // Basic author string construction
  let authorStr = authors.length > 1 
    ? `${firstAuthors} & ${lastAuthor}`
    : authors[0];

  // HANGING INDENT CLASSES: pl-8 (padding left 2rem) -indent-8 (negative indent 2rem)
  const hangClass = "block pl-8 -indent-8 mb-4 leading-loose text-justify";

  if (style === 'APA') {
    return (
      <span className={hangClass}>
        {authorStr} ({item.year}). {item.title}. <i>{item.source}</i>{item.location ? `, ${item.location}` : ''}. {item.note || ''}
      </span>
    );
  } else if (style === 'MLA') {
    return (
      <span className={hangClass}>
        {authorStr}. "{item.title}." <i>{item.source}</i>, {item.year}{item.location ? `, ${item.location}` : ''}. {item.note || ''}
      </span>
    );
  } else if (style === 'Chicago') {
    return (
      <span className={hangClass}>
        {authorStr}. {item.year}. "{item.title}." <i>{item.source}</i>. {item.location ? `${item.location}.` : ''} {item.note || ''}
      </span>
    );
  } else {
    // Custom
    return (
      <span className="block mb-2 text-sm text-slate-700">
         {authorStr}. ({item.year}). {item.title}.
      </span>
    )
  }
}

export default function ReportViewer() {
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [metaData, setMetaData] = useState(INITIAL_METADATA);
  const [docStyle, setDocStyle] = useState('APA');
  const [paperSize, setPaperSize] = useState('a4');
  const [viewMode, setViewMode] = useState('preview'); 
  const [showIndex, setShowIndex] = useState(false);
  const [activeTab, setActiveTab] = useState('format'); 
  const [appMode, setAppMode] = useState('preview'); // 'preview' | 'edit'

  // AI State
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const contentRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  // Helper: Get all text from sections for AI
  const getFullDocumentText = () => {
    return sections.map(s => 
      s.title + "\n" + s.content.map(c => (c.subtitle ? c.subtitle + "\n" : "") + c.text).join("\n")
    ).join("\n\n");
  };

  // Gemini API: Text Generation
  const callGeminiText = async (prompt) => {
    setLoadingAI(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );
      const data = await response.json();
      setLoadingAI(false);
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (e) {
      console.error(e);
      setLoadingAI(false);
      return "Error generating content.";
    }
  };

  // Gemini API: Text to Speech
  const callGeminiTTS = async (text) => {
    setLoadingAI(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: text }] }],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: "Aoede" },
                },
              },
            },
          }),
        }
      );
      const data = await response.json();
      const base64Audio = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        setAudioUrl(`data:audio/wav;base64,${base64Audio}`);
      }
      setLoadingAI(false);
    } catch (e) {
      console.error("TTS Error:", e);
      setLoadingAI(false);
    }
  };

  // Feature 1: Summarize
  const handleSummarize = async () => {
    const fullText = getFullDocumentText();
    const prompt = `You are an academic research assistant. Summarize the following academic report text into 3 concise, high-impact bullet points suitable for an executive summary. Make them professional and insightful.\n\nTEXT:\n${fullText.substring(0, 8000)}`; // Truncate for safety
    const result = await callGeminiText(prompt);
    setAiSummary(result);
  };

  // Feature 2: Generate Quiz
  const handleGenerateQuiz = async () => {
    const fullText = getFullDocumentText();
    const prompt = `Generate a JSON object containing 3 multiple-choice questions based on this academic text. 
    Format: [ { "question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0 }, ... ]
    Do not use markdown formatting like \`\`\`json. Just return the raw JSON array.
    
    TEXT:\n${fullText.substring(0, 8000)}`;
    
    const resultStr = await callGeminiText(prompt);
    try {
      // Clean string just in case
      const cleanJson = resultStr.replace(/```json/g, '').replace(/```/g, '').trim();
      setQuizData(JSON.parse(cleanJson));
      setQuizAnswers({});
      setQuizResult(null);
    } catch (e) {
      alert("Failed to parse quiz. Try again.");
    }
  };

  // Feature 3: Read Abstract (TTS)
  const handleTTS = () => {
    const introText = sections[0].content[0].text;
    const prompt = `Read this academic introduction in a professional, engaging tone:\n\n"${introText}"`;
    callGeminiTTS(prompt);
  };

  // Quiz Logic
  const handleQuizAnswer = (qIndex, optionIndex) => {
    setQuizAnswers(prev => ({...prev, [qIndex]: optionIndex}));
  };

  const checkQuiz = () => {
    let score = 0;
    quizData.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) score++;
    });
    setQuizResult(score);
  };

  // --- EDITING HANDLERS ---
  const handleMetaDataChange = (field, value) => {
    setMetaData(prev => ({ ...prev, [field]: value }));
  };

  const handleSectionTitleChange = (sectionId, newTitle) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, title: newTitle } : s));
  };

  const handleContentChange = (sectionId, contentIndex, field, value) => {
    setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const newContent = [...s.content];
      newContent[contentIndex] = { ...newContent[contentIndex], [field]: value };
      return { ...s, content: newContent };
    }));
  };

  const handleAddParagraph = (sectionId) => {
     setSections(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      return { ...s, content: [...s.content, { subtitle: "", text: "New paragraph text..." }] };
    }));
  }


  // Dynamically load fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=Times+New+Roman&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  /**
   * --- DOCUMENT FORMATTING ENGINE ---
   * Rules for APA 7, MLA 9, Chicago, and Custom
   */
  const getStyleClasses = () => {
    const common = "text-slate-900";
    
    // FONT: Academic Standard is Times New Roman 12pt
    const fontClass = (docStyle === 'APA' || docStyle === 'MLA' || docStyle === 'Chicago') 
      ? "font-serif text-[12pt]" 
      : "font-sans text-sm"; // Custom defaults to Sans/Inter

    // SPACING: Double spaced (leading-loose / leading-[2.0])
    const spacing = (docStyle === 'Custom') 
      ? "leading-relaxed" 
      : "leading-[2.0]"; 

    // INDENTATION: 0.5 inch (indent-12)
    const indent = (docStyle === 'Custom')
      ? "indent-0 mb-4" 
      : "indent-12"; 

    // HEADINGS
    let headingClass = "font-bold mb-4";
    if (docStyle === 'APA' || docStyle === 'Chicago') headingClass += " text-center";
    if (docStyle === 'MLA') headingClass += " text-left";

    return {
      wrapper: `${common} ${fontClass} ${spacing}`,
      heading: `${fontClass} ${headingClass}`,
      subheading: `${fontClass} font-bold mb-2 mt-4`,
      paragraph: `${indent} text-justify`,
    };
  };

  const styles = getStyleClasses();
  const currentPaper = PAPER_SIZES[paperSize];

  /**
   * Page Wrapper Component
   */
  const PaperSheet = ({ children, className = "", pageNum }) => {
    // Determine Page Header based on Style
    const renderHeader = () => {
      if (docStyle === 'APA') {
        return <div className="absolute top-8 right-12 text-[12pt] font-serif">{pageNum}</div>;
      }
      if (docStyle === 'MLA') {
        const lastName = metaData.author.split(' ').pop();
        return <div className="absolute top-8 right-12 text-[12pt] font-serif">{lastName} {pageNum}</div>;
      }
      if (docStyle === 'Chicago') {
        return <div className="absolute top-8 right-12 text-[12pt] font-serif">{pageNum}</div>;
      }
      return null;
    };

    if (viewMode === 'preview') {
      return (
        <div 
          className={`bg-white shadow-xl mb-8 mx-auto relative print:shadow-none print:mb-0 print:mx-0 print:w-full print:break-after-page ${className}`}
          style={{
            width: currentPaper.width,
            minHeight: currentPaper.height,
            padding: '25.4mm', // 1 inch margins
          }}
        >
          {/* Render Academic Header (Page Num etc) */}
          <div className="print:block block">{renderHeader()}</div>
          {children}
        </div>
      );
    }
    return (
      <div className={`max-w-4xl mx-auto px-12 py-8 bg-white mb-4 shadow-sm ${className}`}>
        {children}
      </div>
    );
  };

  /**
   * RENDER TITLE PAGE / HEADER BLOCK
   */
  const renderTitleSection = () => {
    if (docStyle === 'APA') {
      return (
        <PaperSheet pageNum={1}>
          <div className={`flex flex-col items-center justify-center h-full text-center space-y-6 pt-20 ${styles.wrapper}`}>
            <h1 className="font-bold text-[12pt] w-2/3 leading-double mb-4">{metaData.title}</h1>
            <div className="space-y-2">
              <p>{metaData.author}</p>
              <p>{metaData.institution}</p>
              <p>{metaData.course}</p>
              <p>{metaData.instructor}</p>
              <p>{metaData.date}</p>
            </div>
          </div>
        </PaperSheet>
      );
    }
    
    if (docStyle === 'Chicago') {
      return (
        <PaperSheet pageNum={1}>
          <div className={`flex flex-col items-center h-full text-center ${styles.wrapper}`}>
            <div className="mt-48 mb-48 w-2/3">
              <h1 className="font-bold text-[12pt] uppercase tracking-wide mb-4">{metaData.title}</h1>
            </div>
            <div className="mt-auto mb-20 space-y-2">
              <p>{metaData.author}</p>
              <p>{metaData.course}</p>
              <p>{metaData.date}</p>
            </div>
          </div>
        </PaperSheet>
      );
    }

    if (docStyle === 'MLA') {
       return null; 
    }

    // Custom
    return (
      <PaperSheet pageNum={1}>
         <div className="border-b border-black pb-8 mb-8 text-center">
            <h1 className="text-3xl font-bold font-serif mb-4">{metaData.title}</h1>
            <p className="text-slate-600">{metaData.author} • {metaData.date}</p>
         </div>
      </PaperSheet>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">

      {/* --- TOP HEADER (APP MODE) --- */}
      <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between sticky top-0 z-50 shadow-sm print:hidden">
         <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-700" />
            <h1 className="font-bold text-lg tracking-tight text-slate-900">ScholarPrint</h1>
         </div>
         <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setAppMode('preview')}
              className={`flex items-center gap-2 px-6 py-1.5 text-sm font-medium rounded-md transition-all ${appMode === 'preview' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button 
              onClick={() => setAppMode('edit')}
              className={`flex items-center gap-2 px-6 py-1.5 text-sm font-medium rounded-md transition-all ${appMode === 'edit' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Edit3 className="w-4 h-4" /> Edit Text
            </button>
         </div>
         <div className="w-[100px]"></div> {/* Spacer for centering */}
      </div>
      
      <div className="flex flex-1 flex-col md:flex-row h-[calc(100vh-57px)]">
        {/* --- Sidebar / Tools (Only visible in Preview Mode) --- */}
        {appMode === 'preview' && (
          <div className={`
            print:hidden 
            w-full md:w-80 bg-white border-r border-slate-200 h-full overflow-y-auto
            flex flex-col shadow-lg
          `}>
            {/* Tab Switcher */}
            <div className="px-6 pt-6">
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('format')}
                    className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'format' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Settings className="w-3 h-3" /> Format
                  </button>
                  <button 
                    onClick={() => setActiveTab('ai')}
                    className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2 ${activeTab === 'ai' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Sparkles className="w-3 h-3" /> AI Assist
                  </button>
              </div>
            </div>

            <div className="p-6 space-y-8 flex-1">
              
              {/* === FORMAT TAB === */}
              {activeTab === 'format' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                  
                  {/* Style Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 block">Academic Style</label>
                    <select 
                      value={docStyle}
                      onChange={(e) => setDocStyle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="APA">APA 7 (Strict)</option>
                      <option value="MLA">MLA 9 (Strict)</option>
                      <option value="Chicago">Chicago / Turabian</option>
                      <option value="Custom">Custom (Modern)</option>
                    </select>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      Enforces font (Times New Roman), margins (1"), spacing (2.0), and citation rules.
                    </p>
                  </div>

                  {/* Paper Size */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 block">Paper Size</label>
                    <select 
                      value={paperSize}
                      onChange={(e) => setPaperSize(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      {Object.entries(PAPER_SIZES).map(([key, size]) => (
                        <option key={key} value={key}>{size.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* View Mode */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 block">View Mode</label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                      <button 
                        onClick={() => setViewMode('continuous')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'continuous' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Continuous
                      </button>
                      <button 
                        onClick={() => setViewMode('preview')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'preview' ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Print Preview
                      </button>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Generate Index / TOC</span>
                    <button 
                      onClick={() => setShowIndex(!showIndex)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${showIndex ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${showIndex ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <button 
                    onClick={() => alert("This feature simulates uploading a new .docx or .pdf file.")}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-dashed border-slate-300 rounded-lg py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-indigo-300 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </button>

                  {/* Quick Jump */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quick Jump</h3>
                    <nav className="space-y-1 max-h-48 overflow-y-auto">
                      {sections.map((section) => (
                        <a 
                          key={section.id} 
                          href={`#${section.id}`}
                          className="group flex items-start gap-2 p-2 rounded-md hover:bg-indigo-50 transition-colors"
                        >
                          <ChevronRight className="w-3.5 h-3.5 mt-1 text-slate-300 group-hover:text-indigo-500" />
                          <span className="text-sm text-slate-600 group-hover:text-indigo-700 line-clamp-1">{section.title}</span>
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              )}

              {/* === AI TAB === */}
              {activeTab === 'ai' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-800">
                    <p className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      AI tools powered by Gemini 2.5 Flash to analyze and enhance your reading.
                    </p>
                  </div>

                  {/* Feature 1: Summary */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <FileText className="w-3 h-3" /> Executive Summary
                    </h3>
                    <button 
                      onClick={handleSummarize}
                      disabled={loadingAI}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 text-sm font-medium shadow-sm transition-all disabled:opacity-50"
                    >
                      {loadingAI ? 'Analyzing...' : '✨ Summarize Insights'}
                    </button>
                    {aiSummary && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {aiSummary}
                      </div>
                    )}
                  </div>

                  {/* Feature 2: Quiz */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Brain className="w-3 h-3" /> Comprehension Check
                    </h3>
                    <button 
                      onClick={handleGenerateQuiz}
                      disabled={loadingAI}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2.5 text-sm font-medium shadow-sm transition-all disabled:opacity-50"
                    >
                      {loadingAI ? 'Generating...' : '✨ Generate Study Quiz'}
                    </button>
                    
                    {quizData && (
                      <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        {quizData.map((q, idx) => (
                          <div key={idx} className="space-y-2">
                            <p className="text-xs font-bold text-slate-800">{idx + 1}. {q.question}</p>
                            <div className="space-y-1">
                              {q.options.map((opt, optIdx) => (
                                <button
                                  key={optIdx}
                                  onClick={() => handleQuizAnswer(idx, optIdx)}
                                  className={`w-full text-left text-xs px-3 py-2 rounded border transition-all
                                    ${quizAnswers[idx] === optIdx 
                                      ? 'bg-indigo-100 border-indigo-300 text-indigo-900' 
                                      : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-600'}
                                    `}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        {!quizResult && Object.keys(quizAnswers).length === 3 && (
                          <button onClick={checkQuiz} className="w-full text-xs bg-slate-800 text-white py-2 rounded">Check Answers</button>
                        )}
                        {quizResult !== null && (
                          <div className={`text-center font-bold text-sm p-2 rounded ${quizResult === 3 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                            Score: {quizResult} / 3
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Feature 3: TTS */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Volume2 className="w-3 h-3" /> Audio Overview
                    </h3>
                    <button 
                      onClick={handleTTS}
                      disabled={loadingAI}
                      className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-2.5 text-sm font-medium shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loadingAI ? 'Generating Audio...' : <> <Play className="w-4 h-4" /> ✨ Read Introduction </>}
                    </button>
                    {audioUrl && (
                      <audio controls src={audioUrl} className="w-full h-8 mt-2" />
                    )}
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <button 
                  onClick={handlePrint}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white shadow-lg py-3 rounded-lg font-medium transition-all transform active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MAIN CONTENT AREA --- */}
        <div className={`
          flex-1 flex justify-center overflow-y-auto bg-slate-200/50 
          print:p-0 print:overflow-visible print:bg-white
          ${appMode === 'preview' ? (viewMode === 'continuous' ? 'py-8 px-4' : 'py-12 px-8') : 'py-8 px-8'}
        `}>
          
          {/* ============ PREVIEW MODE ============ */}
          {appMode === 'preview' && (
            <div 
              ref={contentRef}
              className={`
                transition-all duration-300
                print:w-full print:max-w-none print:p-0
              `}
            >
              {/* RENDER TITLE PAGE (IF APPLICABLE) */}
              {renderTitleSection()}

              {/* RENDER CONTENT SHEETS */}
              <div className={styles.wrapper}>
                
                {/* Index / TOC Sheet */}
                {showIndex && (
                  <PaperSheet pageNum={docStyle === 'MLA' ? 1 : 2}>
                    <section>
                      <h2 className={`${styles.heading} uppercase tracking-widest text-xl mb-8`}>Table of Contents</h2>
                      <div className="space-y-2">
                        {sections.map((section) => (
                          <div key={section.id} className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1">
                            <span className="font-semibold">{section.title}</span>
                            <span className="text-slate-400 text-sm">pg.</span>
                          </div>
                        ))}
                        <div className="flex items-baseline justify-between border-b border-dotted border-slate-300 pb-1 pt-2">
                          <span className="font-semibold">{docStyle === 'APA' ? 'References' : docStyle === 'MLA' ? 'Works Cited' : 'Bibliography'}</span>
                          <span className="text-slate-400 text-sm">pg.</span>
                        </div>
                      </div>
                    </section>
                  </PaperSheet>
                )}

                {/* Document Body */}
                {sections.map((section, index) => {
                  // Calculate page offset based on style (MLA starts at 1, others at 2/3)
                  const pageOffset = docStyle === 'MLA' ? (showIndex ? 2 : 1) : (showIndex ? 3 : 2); 
                  const pageNum = pageOffset + index;

                  return (
                    <PaperSheet key={section.id} className="scroll-mt-8" id={section.id} pageNum={pageNum}>
                      {/* MLA SPECIAL HEADER ON FIRST PAGE */}
                      {docStyle === 'MLA' && index === 0 && !showIndex && (
                        <div className="mb-6 leading-[2.0]">
                          <p>{metaData.author}</p>
                          <p>{metaData.instructor}</p>
                          <p>{metaData.course}</p>
                          <p>{metaData.date}</p>
                          <h1 className="text-center font-bold mt-6 mb-0">{metaData.title}</h1>
                        </div>
                      )}

                      <section>
                        <h2 className={styles.heading}>
                          {section.title}
                        </h2>
                        
                        <div>
                          {section.content.map((block, idx) => (
                            <div key={idx}>
                              {block.subtitle && (
                                <h3 className={styles.subheading}>
                                  {block.subtitle}
                                </h3>
                              )}
                              <p className={styles.paragraph}>
                                {block.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>
                    </PaperSheet>
                  )
                })}

                {/* Bibliography Sheet */}
                <PaperSheet id="bibliography" pageNum={sections.length + (docStyle === 'MLA' ? 1 : 2)}>
                  <section className={docStyle === 'MLA' ? '' : 'pt-8'}>
                    <h2 className={`${styles.heading} text-center`}>
                      {docStyle === 'APA' ? 'References' : (docStyle === 'MLA' ? 'Works Cited' : 'Bibliography')}
                    </h2>
                    
                    <div className="citation-list">
                      {BIBLIOGRAPHY_DATA
                        .sort((a, b) => a.authors[0].localeCompare(b.authors[0]))
                        .map((item) => (
                        <div key={item.id}>
                          {formatCitation(item, docStyle)}
                        </div>
                      ))}
                    </div>
                  </section>
                </PaperSheet>
              </div>

              {/* Print Footer - Only visible on actual paper */}
              <div className="hidden print:block fixed bottom-4 left-0 w-full text-center text-[8pt] text-slate-400 font-sans">
                Generated via ScholarPrint • {new Date().toLocaleDateString()}
              </div>
            </div>
          )}

          {/* ============ EDIT MODE ============ */}
          {appMode === 'edit' && (
             <div className="max-w-4xl w-full mx-auto space-y-8 pb-20">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <h2 className="text-lg font-bold text-slate-800 mb-2">Edit Document Content</h2>
                  <p className="text-sm text-slate-500">
                    Modifying the text here will instantly update the Preview mode and AI analysis.
                    Formatting options (fonts, spacing) are handled in the Preview tab.
                  </p>
                </div>

                {/* --- METADATA EDITOR --- */}
                <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                   <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-6 pb-2 border-b border-slate-100">Report Metadata (Cover Page)</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Report Title</label>
                        <input 
                          type="text"
                          value={metaData.title}
                          onChange={(e) => handleMetaDataChange('title', e.target.value)}
                          className="w-full text-lg font-semibold border border-slate-300 rounded p-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Author Name</label>
                        <input 
                          type="text"
                          value={metaData.author}
                          onChange={(e) => handleMetaDataChange('author', e.target.value)}
                          className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Institution / Department</label>
                        <input 
                          type="text"
                          value={metaData.institution}
                          onChange={(e) => handleMetaDataChange('institution', e.target.value)}
                          className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Course Name</label>
                        <input 
                          type="text"
                          value={metaData.course}
                          onChange={(e) => handleMetaDataChange('course', e.target.value)}
                          className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Instructor Name</label>
                        <input 
                          type="text"
                          value={metaData.instructor}
                          onChange={(e) => handleMetaDataChange('instructor', e.target.value)}
                          className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
                        />
                      </div>
                       <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-1">Submission Date</label>
                        <input 
                          type="text"
                          value={metaData.date}
                          onChange={(e) => handleMetaDataChange('date', e.target.value)}
                          className="w-full border border-slate-300 rounded p-2 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
                        />
                      </div>
                   </div>
                </div>

                {sections.map((section, sIdx) => (
                  <div key={section.id} className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
                    {/* Section Title Input */}
                    <div className="mb-6">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Section Title</label>
                      <input 
                        type="text"
                        value={section.title}
                        onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                        className="w-full text-xl font-bold text-slate-900 border-b-2 border-slate-200 focus:border-indigo-500 outline-none py-2 transition-colors"
                      />
                    </div>

                    {/* Content Blocks */}
                    <div className="space-y-8">
                       {section.content.map((block, cIdx) => (
                         <div key={cIdx} className="bg-slate-50 p-4 rounded-md border border-slate-100 group hover:border-indigo-200 transition-colors">
                            {/* Subtitle Input (Optional) */}
                            <div className="mb-3">
                              <label className="block text-xs font-semibold text-slate-400 mb-1">Subtitle (Optional)</label>
                              <input 
                                type="text"
                                value={block.subtitle || ''}
                                onChange={(e) => handleContentChange(section.id, cIdx, 'subtitle', e.target.value)}
                                className="w-full bg-transparent border-b border-slate-300 focus:border-indigo-500 outline-none text-sm font-semibold text-slate-700 py-1"
                                placeholder="Add subtitle..."
                              />
                            </div>
                            
                            {/* Paragraph Text Area */}
                            <div>
                               <label className="block text-xs font-semibold text-slate-400 mb-1">Paragraph Text</label>
                               <textarea 
                                  value={block.text}
                                  onChange={(e) => handleContentChange(section.id, cIdx, 'text', e.target.value)}
                                  rows={6}
                                  className="w-full p-3 bg-white border border-slate-200 rounded text-sm text-slate-700 leading-relaxed focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none resize-y"
                               />
                            </div>
                         </div>
                       ))}
                    </div>
                    
                    <button 
                      onClick={() => handleAddParagraph(section.id)}
                      className="mt-4 text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      + Add new paragraph to section
                    </button>
                  </div>
                ))}

                <div className="fixed bottom-6 right-8">
                   <button 
                      onClick={() => setAppMode('preview')}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg px-6 py-3 rounded-full font-medium transition-all transform hover:scale-105"
                    >
                      <Save className="w-4 h-4" /> Save & Preview
                    </button>
                </div>
             </div>
          )}

        </div>
      </div>

      {/* Dynamic Styles for Print Size and Global Fonts */}
      <style>{`
        @media print {
          @page {
            size: ${currentPaper.width} ${currentPaper.height};
            margin: 25.4mm; /* 1 inch print margin */
          }
          body {
            background: white;
            color: black;
          }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:break-before-page { page-break-before: always !important; }
          .print\\:break-after-page { page-break-after: always !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:mb-0 { margin-bottom: 0 !important; }
          .print\\:mx-0 { margin-left: 0 !important; margin-right: 0 !important; }
          .print\\:w-full { width: 100% !important; max-width: none !important; }
          
          /* Prevent widows and orphans in print */
          p {
            orphans: 3;
            widows: 3;
          }
        }
        
        .font-serif { font-family: ${docStyle === 'Custom' ? "'IBM Plex Serif', serif" : "'Times New Roman', serif"}; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}