import React, { useState } from 'react';
import { 
  Palette, 
  Sparkles, 
  Globe, 
  Box, 
  Cpu, 
  Film, 
  Layers, 
  ArrowUpRight, 
  CheckCircle2, 
  X,
  Compass,
  Zap
} from 'lucide-react';
import { sound } from '../utils/soundEffects';
import Service3DCanvas from './Service3DCanvas';

interface ServiceItem {
  id: string;
  num: string;
  title: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  description: string;
  deliverables: string[];
  techStack: string[];
  estimatedTimeline: string;
}

const servicesData: ServiceItem[] = [
  {
    id: 'creative-design',
    num: '01',
    title: 'Creative Design',
    tagline: 'Art direction, spatial aesthetics & human-centric design architectures.',
    icon: Palette,
    accentColor: '#6366F1',
    description: 'We conceive high-concept creative directions that elevate brands into memorable cultural statements. From editorial layouts to immersive spatial installations, every curve and pixel serves an intentional narrative.',
    deliverables: ['Art Direction & Creative Pitchbooks', 'Spatial UI & Experimental Prototypes', 'Editorial Typography Systems', 'Digital Asset Libraries'],
    techStack: ['Figma Pro', 'Three.js Spatial Prototypes', 'Blender Mockups'],
    estimatedTimeline: '2–4 Weeks',
  },
  {
    id: 'branding-identity',
    num: '02',
    title: 'Branding & Visual Identity',
    tagline: 'Distinctive brand worlds forged with holographic depth and kinetic soul.',
    icon: Sparkles,
    accentColor: '#7C3AED',
    description: 'Comprehensive brand systems built for the dimensional digital era. We craft logo marks, dynamic color palettes, generative tokens, and guidelines that adapt across physical print and interactive screen media.',
    deliverables: ['Responsive Logo Systems', 'Holographic & Chromatic Style Guides', 'Custom Type Specimen Guidance', 'Brand Collateral & Motion Toolkits'],
    techStack: ['Vector Geometry', 'Design Tokens', 'Generative Motion Guides'],
    estimatedTimeline: '3–6 Weeks',
  },
  {
    id: 'website-design',
    num: '03',
    title: 'Website Design & Architecture',
    tagline: 'Ultra-fast, responsive web experiences with visceral tactile interactions.',
    icon: Globe,
    accentColor: '#06B6D4',
    description: 'Bespoke web applications engineered with cutting-edge frontend discipline. Zero generic templates: every layout features custom typographic tension, effortless responsiveness, and micro-interactions.',
    deliverables: ['Custom High-Fidelity UI Layouts', 'Responsive Mobile-First Architecture', 'Interactive Design System Components', 'SEO & Core Web Vitals Optimization'],
    techStack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Vite'],
    estimatedTimeline: '4–8 Weeks',
  },
  {
    id: '3d-graphics-animation',
    num: '04',
    title: '3D Graphics & Animation',
    tagline: 'Procedural 3D assets, custom WebGL shaders & physical PBR materials.',
    icon: Box,
    accentColor: '#3B82F6',
    description: 'Turn static digital spaces into interactive 3D realms. We build zero-404 procedural WebGL scenes, PBR lighting rigs, transmission glass materials, and smooth kinematic camera choreography.',
    deliverables: ['Procedural 3D WebGL Models', 'Custom GLSL Shaders & Reflections', 'Interactive Product Viewports', 'Contact Shadow Grounding Rigs'],
    techStack: ['Three.js r183', 'WebGL2', 'GLSL Shaders', 'PMREM Studio Rigs'],
    estimatedTimeline: '3–6 Weeks',
  },
  {
    id: 'ai-creative-concepts',
    num: '05',
    title: 'AI-Powered Creative Concepts',
    tagline: 'Strategic human curation merged with algorithmic visual exploration.',
    icon: Cpu,
    accentColor: '#8B5CF6',
    description: 'We leverage cutting-edge neural models as brainstorming amplifiers and visual synthesizers, orchestrating high-fidelity concept explorations, generative moodboards, and algorithmic art directions.',
    deliverables: ['Curated Generative Concept Studies', 'Algorithmic Moodboards & Aesthetic Proofs', 'Neural Creative Pipelines', 'Rapid Ideation Visualizations'],
    techStack: ['Gemini Visual Synthesis', 'Procedural Algorithms', 'Creative Direction'],
    estimatedTimeline: '2–3 Weeks',
  },
  {
    id: 'video-motion-design',
    num: '06',
    title: 'Video & Motion Design',
    tagline: 'Cinematic brand showreels, kinetic typography & visual storytelling.',
    icon: Film,
    accentColor: '#F59E0B',
    description: 'Dynamic pacing, fluid choreography, and cinematic light transitions that stop thumbs in their tracks. We craft promotional trailers, UI motion systems, and editorial brand teasers.',
    deliverables: ['Cinematic Brand Showreels', 'Micro-Interaction Motion Curves', 'Kinetic Typography Sequences', '4K Commercial Video Deliverables'],
    techStack: ['After Effects', 'Framer Motion 12', 'Cinema 4D Rendering'],
    estimatedTimeline: '2–5 Weeks',
  },
  {
    id: 'digital-experiences',
    num: '07',
    title: 'Digital Experiences',
    tagline: 'Interactive virtual pavilions, experiential microsites & sensory journeys.',
    icon: Layers,
    accentColor: '#10B981',
    description: 'Unforgettable digital events and experiential campaigns. From real-time audio-reactive visualizers to interactive product unveiling stages that command global audience attention.',
    deliverables: ['Interactive Event Microsites', 'Virtual Showrooms & Product Stages', 'Web Audio Synthesizer Integrations', 'Real-Time Spatial Interactive Canvases'],
    techStack: ['Web Audio API', 'Three.js Spatial Engine', 'Full-bleed WebGL'],
    estimatedTimeline: '5–10 Weeks',
  },
];

interface ServicesSectionProps {
  onSelectServiceForProject: (serviceTitle: string) => void;
}

export default function ServicesSection({ onSelectServiceForProject }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const openServiceModal = (item: ServiceItem) => {
    sound.playClick();
    setSelectedService(item);
  };

  const closeServiceModal = () => {
    sound.playClick();
    setSelectedService(null);
  };

  return (
    <section id="services" className="py-28 bg-[#FAFAFC] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-indigo-600 tracking-widest uppercase mb-3">
            <span>Capabilities</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span>Disciplines of Craft</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            OUR SERVICES
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
            We operate at the convergence of high aesthetic art direction and advanced frontend engineering. Every service is tailored for maximum dimensional impact.
          </p>
        </div>

        {/* Services Grid (Editorial asymmetric cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                onClick={() => openServiceModal(service)}
                onMouseEnter={() => sound.playHover()}
                className="group relative bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-2xl hover:border-purple-200/90 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div>
                  {/* Card Header with editorial number and icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-semibold text-slate-400 group-hover:text-purple-600 transition-colors">
                      {service.num}.
                    </span>
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-xs"
                      style={{ backgroundColor: `${service.accentColor}15`, color: service.accentColor }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Individual 3D Procedural Artwork Viewport */}
                  <div className="relative mb-5 group-hover:scale-[1.02] transition-transform duration-300">
                    <Service3DCanvas serviceId={service.id} accentColor={service.accentColor} className="w-full h-44" />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-white/85 backdrop-blur-xs text-[10px] font-mono text-slate-600 border border-slate-200/60 shadow-xs pointer-events-none">
                      3D Interactive
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {service.tagline}
                  </p>
                </div>

                {/* Card Footer: Unboxed metadata + click cue */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                    <Compass className="w-3.5 h-3.5 text-purple-500" />
                    <span>{service.estimatedTimeline}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-semibold text-purple-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect 3D</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Detail Modal Overlay */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeServiceModal}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs font-bold text-indigo-600 tracking-wider">
                {selectedService.num} / CAPABILITY
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              {selectedService.title}
            </h3>

            {/* Modal Interactive 3D Model Display */}
            <div className="mb-6 relative">
              <Service3DCanvas
                serviceId={selectedService.id}
                accentColor={selectedService.accentColor}
                className="w-full h-52 sm:h-64 shadow-inner"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-[11px] font-mono text-purple-700 border border-purple-200/80 shadow-xs pointer-events-none">
                Interactive 3D Asset · Mouse Responsive
              </div>
            </div>

            <p className="text-base text-slate-600 leading-relaxed mb-6">
              {selectedService.description}
            </p>

            {/* Deliverables Section */}
            <div className="mb-6">
              <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider mb-3">
                Key Studio Deliverables
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedService.deliverables.map((deliv, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack & Timeline */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs">
              <div>
                <span className="font-mono text-slate-500 block mb-1">Production Architecture</span>
                <span className="font-medium text-indigo-950">{selectedService.techStack.join(' · ')}</span>
              </div>
              <div>
                <span className="font-mono text-slate-500 block mb-1">Estimated Cycle</span>
                <span className="font-semibold text-indigo-950">{selectedService.estimatedTimeline}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={closeServiceModal}
                className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectServiceForProject(selectedService.title);
                  closeServiceModal();
                }}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Request Project With This Discipline</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
