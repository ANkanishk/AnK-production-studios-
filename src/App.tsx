import React, { useState } from 'react';
import CinematicIntro from './components/CinematicIntro';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CreativeUniverse from './components/CreativeUniverse';
import ServicesSection from './components/ServicesSection';
import ProjectsGallery from './components/ProjectsGallery';
import RobotMascotSection from './components/RobotMascotSection';
import ProjectLab from './components/ProjectLab';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [selectedServiceForLab, setSelectedServiceForLab] = useState<string | undefined>(undefined);
  const [initialIdeaForLab, setInitialIdeaForLab] = useState<string | undefined>(undefined);

  const handleCompleteIntro = () => {
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  const handleExploreUniverse = () => {
    const el = document.getElementById('universe');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenProjectLab = (ideaPrompt?: string) => {
    if (ideaPrompt) {
      setInitialIdeaForLab(ideaPrompt);
    }
    const el = document.getElementById('project-lab');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectServiceForLab = (serviceTitle: string) => {
    setSelectedServiceForLab(serviceTitle);
    const el = document.getElementById('project-lab');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-700">
      {/* 1. Cinematic Website Opening */}
      {showIntro && <CinematicIntro onComplete={handleCompleteIntro} />}

      {/* Main Website Structure */}
      <Navbar
        onReplayIntro={handleReplayIntro}
        onOpenProjectLab={() => handleOpenProjectLab()}
      />

      <main>
        {/* 2. Interactive 3D Hero Section */}
        <HeroSection
          onExploreClick={handleExploreUniverse}
          onStartProjectClick={() => handleOpenProjectLab()}
        />

        {/* 3. Creative Universe (Interactive 3D Engine & Collapsible Dock) */}
        <CreativeUniverse />

        {/* 4. Our Services */}
        <ServicesSection onSelectServiceForProject={handleSelectServiceForLab} />

        {/* 5. Experimental Project Gallery */}
        <ProjectsGallery onStartProject={(prompt) => handleOpenProjectLab(prompt)} />

        {/* 6. Custom 3D Robot Mascot ("Meet Your Creative Companion") */}
        <RobotMascotSection onStartProject={(prompt) => handleOpenProjectLab(prompt)} />

        {/* 7. Project Lab (Client Intake & Brief Generator) */}
        <ProjectLab
          initialService={selectedServiceForLab}
          initialIdeaPrompt={initialIdeaForLab}
        />

        {/* 8. Contact Section */}
        <ContactSection />
      </main>

      {/* 9. Footer */}
      <Footer onReplayIntro={handleReplayIntro} />
    </div>
  );
}
