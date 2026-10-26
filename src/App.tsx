import React, { useState } from 'react';
import CinematicIntro from './components/CinematicIntro';
import Navbar from './components/Navbar';
import ColorScrollController from './components/ColorScrollController';
import HeroSection from './components/HeroSection';
import CardSlideshow3D from './components/CardSlideshow3D';
import CreativeUniverseFiber from './components/CreativeUniverseFiber';
import ServicesSection from './components/ServicesSection';
import ProjectsGallery from './components/ProjectsGallery';
import RobotMascotSection from './components/RobotMascotSection';
import ProjectLab from './components/ProjectLab';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AuthModal3D from './components/AuthModal3D';
import CustomCursor from './components/CustomCursor';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return !sessionStorage.getItem('ank_intro_viewed');
  });
  const [selectedServiceForLab, setSelectedServiceForLab] = useState<string | undefined>(undefined);
  const [initialIdeaForLab, setInitialIdeaForLab] = useState<string | undefined>(undefined);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  const handleCompleteIntro = () => {
    sessionStorage.setItem('ank_intro_viewed', 'true');
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  const handleExploreSlideshow = () => {
    const el = document.getElementById('slideshow');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 selection:bg-purple-500/20 selection:text-purple-700">
      {/* Precision Trailing Custom Cursor */}
      <CustomCursor />

      {/* 1. Cinematic Website Opening with 3D AnK Starburst */}
      {showIntro && <CinematicIntro onComplete={handleCompleteIntro} />}

      {/* Dynamic Scroll Progress & Color Animation Aura Controller */}
      <ColorScrollController />

      {/* Main Top Navigation */}
      <Navbar
        onReplayIntro={handleReplayIntro}
        onOpenProjectLab={() => handleOpenProjectLab()}
        onOpenAuth={() => setIsAuthOpen(true)}
        currentUser={currentUser}
        onSignOut={() => setCurrentUser(null)}
      />

      {/* Dedicated 3D Authentication & Client Portal Modal */}
      <AuthModal3D
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      <main>
        {/* 2. Interactive 3D Hero with 3D AnK! Starburst */}
        <HeroSection
          onExploreSlideshow={handleExploreSlideshow}
          onExploreUniverse={handleExploreUniverse}
          onStartProjectClick={() => handleOpenProjectLab()}
        />

        {/* 3. Interactive 3D Card Animation Slideshow & Perspective Carousel */}
        <CardSlideshow3D
          onSelectSlideForProject={(title) => handleOpenProjectLab(`Interested in 3D Blueprint: ${title}`)}
        />

        {/* 4. Creative Universe (Fiber & Drei 3D Engine & Collapsible Dock) */}
        <CreativeUniverseFiber />

        {/* 5. Our Capabilities & Services */}
        <ServicesSection onSelectServiceForProject={handleSelectServiceForLab} />

        {/* 6. Experimental Project Gallery with Case Studies */}
        <ProjectsGallery onStartProject={(prompt) => handleOpenProjectLab(prompt)} />

        {/* 7. Custom 3D Robot Mascot ("Meet Your Creative Companion") */}
        <RobotMascotSection onStartProject={(prompt) => handleOpenProjectLab(prompt)} />

        {/* 8. Project Lab (Client Intake & Brief Generator) */}
        <ProjectLab
          initialService={selectedServiceForLab}
          initialIdeaPrompt={initialIdeaForLab}
        />

        {/* 9. Contact & Consultation Scheduler */}
        <ContactSection />
      </main>

      {/* 10. Footer */}
      <Footer onReplayIntro={handleReplayIntro} />
    </div>
  );
}
