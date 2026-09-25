import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { getSoundPreference, setSoundEnabled } from "@/audio/soundscape";
import { initTheme } from "@/utils/theme";
import "@/App.css";
import { NightSkyBackground } from "@/components/NightSkyBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { SoundToggle } from "@/components/SoundToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CobwebNav } from "@/components/CobwebNav";
import { HomeScene } from "@/components/HomeScene";
import AboutView from "@/components/views/AboutView";
import ProjectsView from "@/components/views/ProjectsView";
import TimelineView from "@/components/views/TimelineView";
import SkillsView from "@/components/views/SkillsView";
import ContactView from "@/components/views/ContactView";
import BlogView from "@/components/views/BlogView";
import BlogPostView from "@/components/views/BlogPostView";

function App() {
  const [view, setView] = useState("home");
  const [viewParams, setViewParams] = useState(null);
  const [homeVisits, setHomeVisits] = useState(0);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisRef.current = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    initTheme();
  }, []);

  useEffect(() => {
    if (!getSoundPreference()) return;
    const arm = () => {
      setSoundEnabled(true);
      window.removeEventListener("pointerdown", arm);
    };
    window.addEventListener("pointerdown", arm);
    return () => window.removeEventListener("pointerdown", arm);
  }, []);

  const navigate = (v, params = null) => {
    if (v === "home") setHomeVisits((n) => n + 1);
    setView(v);
    setViewParams(params);
    window.scrollTo(0, 0);
    lenisRef.current?.scrollTo(0, { immediate: true });
  };

  const back = () => navigate("home");

  return (
    <div className="App min-h-screen text-neutral-200">
      <NightSkyBackground />
      <div className="grain-overlay" />
      <CustomCursor />
      <ThemeToggle />
      <SoundToggle />
      <AnimatePresence mode="wait">
        {view === "home" && (
          <HomeScene key="home" quick={homeVisits > 0} onNavigate={navigate} />
        )}
        {view === "about" && <AboutView key="about" onBack={back} />}
        {view === "projects" && <ProjectsView key="projects" onBack={back} />}
        {view === "timeline" && <TimelineView key="timeline" onBack={back} />}
        {view === "skills" && <SkillsView key="skills" onBack={back} />}
        {view === "contact" && <ContactView key="contact" onBack={back} />}
        {view === "blog" && <BlogView key="blog" onBack={back} onNavigate={navigate} />}
        {view === "blog-post" && (
          <BlogPostView
            key={`blog-post-${viewParams?.slug}`}
            params={viewParams}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>
      {view !== "home" && (
        <CobwebNav currentView={view} onNavigate={navigate} />
      )}
    </div>
  );
}

export default App;
