import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Download, 
  ArrowRight,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface ProjectLabProps {
  initialService?: string;
  initialIdeaPrompt?: string;
}

export default function ProjectLab({ initialService, initialIdeaPrompt }: ProjectLabProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(initialService || 'Website Design & Architecture');
  const [customIdea, setCustomIdea] = useState(initialIdeaPrompt || '');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('$15k – $30k');
  const [timeline, setTimeline] = useState('1 – 2 Months');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; previewUrl?: string }>>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Validation & Form Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBrief, setSubmittedBrief] = useState<Record<string, unknown> | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialService) {
      setCategory(initialService);
    }
  }, [initialService]);

  useEffect(() => {
    if (initialIdeaPrompt) {
      setCustomIdea(initialIdeaPrompt);
    }
  }, [initialIdeaPrompt]);

  const categories = [
    'Creative Design',
    'Branding & Visual Identity',
    'Website Design & Architecture',
    '3D Graphics & Animation',
    'AI-Powered Creative Concepts',
    'Video & Motion Design',
    'Digital Experiences',
  ];

  const budgets = [
    '$5k – $15k',
    '$15k – $30k',
    '$30k – $60k',
    '$60k+ Enterprise',
  ];

  const timelines = [
    '2 – 4 Weeks',
    '1 – 2 Months',
    '2 – 4 Months',
    'Flexible Schedule',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    sound.playClick();
    const newUploads = Array.from(files).map((file) => {
      const sizeKB = (file.size / 1024).toFixed(1);
      const isImg = file.type.startsWith('image/');
      const previewUrl = isImg ? URL.createObjectURL(file) : undefined;
      return {
        name: file.name,
        size: `${sizeKB} KB`,
        previewUrl,
      };
    });

    setUploadedFiles((prev) => [...prev, ...newUploads]);
  };

  const removeFile = (idx: number) => {
    sound.playClick();
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Please provide your name or organization.';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Please provide a valid contact email address.';
    }
    if (!description.trim() || description.trim().length < 15) {
      newErrors.description = 'Please provide at least 15 characters describing your project vision.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      sound.playClick();
      return;
    }

    sound.playSweep();
    setIsSubmitting(true);

    // Simulate realistic frontend processing delay
    setTimeout(() => {
      setIsSubmitting(false);
      sound.playChime();
      setSubmittedBrief({
        briefId: `ANK-${Math.floor(100000 + Math.random() * 900000)}`,
        name,
        email,
        category,
        customIdea,
        description,
        budget,
        timeline,
        filesCount: uploadedFiles.length,
        submittedAt: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });
    }, 700);
  };

  const handleDownloadBrief = () => {
    sound.playClick();
    if (!submittedBrief) return;

    const content = `=========================================
AnK CREATIVE MIND — PROJECT SPECIFICATION
Brief Reference: ${submittedBrief.briefId}
Generated: ${submittedBrief.submittedAt}
=========================================

CLIENT / SPONSOR:
Name: ${submittedBrief.name}
Email: ${submittedBrief.email}

PROJECT CONFIGURATION:
Category: ${submittedBrief.category}
Budget Allocation: ${submittedBrief.budget}
Estimated Timeline: ${submittedBrief.timeline}

PROJECT SCOPE & VISION:
Idea Headline: ${submittedBrief.customIdea || 'Not specified'}
Detailed Description:
${submittedBrief.description}

ATTACHED ASSETS:
Uploaded Reference Assets: ${submittedBrief.filesCount} file(s)

ADDITIONAL NOTES:
${additionalNotes || 'None'}

-----------------------------------------
NOTICE: This is an exported project brief blueprint from the AnK Creative Mind frontend portal.
=========================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AnK-Project-Brief-${submittedBrief.briefId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    sound.playClick();
    setName('');
    setEmail('');
    setDescription('');
    setCustomIdea('');
    setUploadedFiles([]);
    setAdditionalNotes('');
    setErrors({});
    setSubmittedBrief(null);
  };

  return (
    <section id="project-lab" className="py-28 bg-[#FAFAFC] relative border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-indigo-600 tracking-widest uppercase mb-3">
            <span>Project Lab</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span>Bespoke Creative Intake</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            INITIATE YOUR VISION
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Configure your project parameters, budget tier, and aesthetic requirements. Experience our client brief simulator with zero commitments.
          </p>
        </div>

        {/* Demo Mode Notice */}
        <div className="mb-10 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Frontend Studio Demo:</strong> Form submissions are verified client-side and generate an instant project brief download without transmitting private data to remote servers.
            </span>
          </div>
          <span className="font-mono text-[11px] text-amber-800 uppercase tracking-wider hidden sm:inline-block">Client-Side Demo</span>
        </div>

        {/* Main Form Layout: Form on Left, Real-Time Brief Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Form Container (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="client-name" className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-2">
                    Your Name or Brand *
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elena Rostova / Lumina Labs"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                      errors.name ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                    }`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="client-email" className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-2">
                    Contact Email *
                  </label>
                  <input
                    id="client-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="elena@lumina.io"
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                      errors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
                </div>
              </div>

              {/* Row 2: Category Selector */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-2.5">
                  Core Project Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setCategory(cat);
                      }}
                      className={`p-3 text-xs font-medium rounded-xl text-left border transition-all ${
                        category === cat
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold shadow-xs'
                          : 'border-slate-200 bg-slate-50/40 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Custom Project Idea Headline */}
              <div>
                <label htmlFor="project-idea" className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-2">
                  Project Title or One-Line Idea
                </label>
                <input
                  id="project-idea"
                  type="text"
                  value={customIdea}
                  onChange={(e) => setCustomIdea(e.target.value)}
                  placeholder="e.g. Interactive 3D spatial web launch for our luxury titanium timepiece"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* Row 4: Detailed Project Description */}
              <div>
                <label htmlFor="project-desc" className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-2">
                  Project Scope & Creative Brief *
                </label>
                <textarea
                  id="project-desc"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your design objectives, target audience, core deliverables, and aesthetic inspirations..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                    errors.description ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                  }`}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1.5">{errors.description}</p>}
              </div>

              {/* Row 5: Budget Range & Timeline Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-2.5">
                    Estimated Budget Tier
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {budgets.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setBudget(b);
                        }}
                        className={`p-2.5 text-xs rounded-xl font-medium border text-center transition-all ${
                          budget === b
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold'
                            : 'border-slate-200 bg-slate-50/40 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-2.5">
                    Expected Timeline
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {timelines.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setTimeline(t);
                        }}
                        className={`p-2.5 text-xs rounded-xl font-medium border text-center transition-all ${
                          timeline === t
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold'
                            : 'border-slate-200 bg-slate-50/40 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 6: Reference File / Asset Upload Simulation */}
              <div>
                <label className="block text-xs font-mono font-semibold uppercase text-slate-700 mb-2">
                  Reference Assets or Design Moodboards (Optional)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/40 hover:bg-slate-50/80 rounded-2xl p-6 text-center cursor-pointer transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.zip"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">
                    Click to select reference moodboards, images, or PDFs
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Instant client-side preview · Max 25 MB per file
                  </p>
                </div>

                {/* Uploaded File Previews */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center gap-2.5 truncate">
                          {f.previewUrl ? (
                            <img src={f.previewUrl} alt="Preview" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                          )}
                          <span className="font-medium text-slate-800 truncate">{f.name}</span>
                          <span className="text-slate-400 font-mono text-[11px] shrink-0">({f.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="p-1 text-slate-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Instant client-side validation
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-indigo-600 rounded-full shadow-lg shadow-slate-900/10 hover:shadow-indigo-500/25 transition-all duration-200 active:scale-95 disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Synthesizing Brief...' : 'Generate Project Specification'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Project Estimate Summary Card (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-indigo-600 tracking-wider mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Live Estimate Summary</span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block font-mono mb-1">Target Discipline</span>
                  <span className="font-semibold text-slate-900 text-sm">{category}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block font-mono mb-1">Budget</span>
                    <span className="font-semibold text-slate-900">{budget}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block font-mono mb-1">Timeline</span>
                    <span className="font-semibold text-slate-900">{timeline}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-950">
                  <div className="font-semibold mb-1">What Happens Next?</div>
                  <p className="text-slate-600 leading-relaxed">
                    Upon generating your specification, our architectural team reviews asset requirements, computes WebGL optimization budgets, and schedules an interactive kickoff.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>AnK Studio Intake · Version 2026.4</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Celebratory Brief Modal */}
      {submittedBrief && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="font-mono text-xs font-semibold text-indigo-600 tracking-wider uppercase block mb-1">
              Specification Synthesized · Demo Mode
            </span>

            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              Project Brief Ready!
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 max-w-md mx-auto">
              Your custom project brief has been compiled client-side. Reference ID: <strong className="font-mono text-slate-900">{submittedBrief.briefId as string}</strong>.
            </p>

            <div className="text-left bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-6 text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Client:</span>
                <span className="font-semibold text-slate-900">{submittedBrief.name as string}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Discipline:</span>
                <span className="font-semibold text-slate-900">{submittedBrief.category as string}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Budget Tier:</span>
                <span className="font-semibold text-slate-900">{submittedBrief.budget as string}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Duration:</span>
                <span className="font-semibold text-slate-900">{submittedBrief.timeline as string}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleDownloadBrief}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md shadow-indigo-500/20 transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Brief (.txt)</span>
              </button>

              <button
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-all"
              >
                Create Another Brief
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
