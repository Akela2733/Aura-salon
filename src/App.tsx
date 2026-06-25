import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  Sun,
  Moon,
  MapPin,
  Clock,
  Phone,
  Mail,
  Instagram,
  ArrowRight,
  Info,
  Sliders,
  ChevronDown,
  Sparkles,
  Award,
  Scissors,
  ShoppingBag,
  Star,
  Check,
  BookOpen,
  Users,
  CheckCircle2,
  Maximize2
} from "lucide-react";
import ThreeCorridor from "./components/ThreeCorridor";
import AiConsultant from "./components/AiConsultant";
import BookingPortal, { SALON_SERVICES, SALON_PRODUCTS } from "./components/BookingPortal";
import ClientTestimonials from "./components/ClientTestimonials";
import { StyleProfile } from "./types";

const STATIONS = [
  { name: "Our Sanctuary", n: "00", eyebrow: "00 — AURA & HERITAGE" },
  { name: "Expert Services", n: "01", eyebrow: "01 — THE TREATMENT ATELIER" },
  { name: "Our Artisans", n: "02", eyebrow: "02 — MASTER ARTISANS" },
  { name: "Couture & AI Profile", n: "03", eyebrow: "03 — PORTRAIT OF ARTISTRY" },
  { name: "Reservations", n: "04", eyebrow: "04 — BESPOKE CHAIR BOOKING" },
  { name: "What Our Clients Say", n: "05", eyebrow: "05 — CLIENT TESTIMONIALS" }
];

const REAL_WORK_GALLERY = [
  {
    id: "g1",
    title: "Sleek Geometric Bob",
    artist: "Anura Senanayake",
    category: "hair",
    tag: "HAIR CUTS",
    img: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
    desc: "A custom dry-cut perimeter alignment designed to respect natural hair weight and organic structural gravity."
  },
  {
    id: "g2",
    title: "Colombo Sunset Balayage",
    artist: "Menaka Fernando",
    category: "color",
    tag: "BALAYAGE & LIGHT",
    img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
    desc: "Seamless copper & honey caramel hand-painted gradients made to beautifully capture the golden coastal sun."
  },
  {
    id: "g3",
    title: "The Royal Kandyan Glow",
    artist: "Menaka Fernando",
    category: "bridal",
    tag: "BRIDAL MAKEUP",
    img: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&w=600&q=80",
    desc: "Sweat-proof dewy HD airbrush base finish styled with meticulous luxury and traditional Sri Lankan bridal aesthetics."
  },
  {
    id: "g4",
    title: "Minimalist 24k Gold Nails",
    artist: "Dilki Alwis",
    category: "nails",
    tag: "NAIL ARTISTRY",
    img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80",
    desc: "Nude gel extensions detailed with custom hand-painted gold leaf lines and luxury cuticle care down to the millimeter."
  },
  {
    id: "g5",
    title: "Ayurvedic Scalp Sanctuary",
    artist: "Yolanda Koch",
    category: "treatment",
    tag: "SCALP & WELLNESS",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    desc: "Cascading warm water head spa using hand-pressed organic herbal elixirs, sandalwood serums, and deep quietude."
  },
  {
    id: "g6",
    title: "Bespoke Evening Contour",
    artist: "Yolanda Koch",
    category: "bridal",
    tag: "GLAMOUR",
    img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    desc: "Botanical skincare prep followed by custom light-refracting facial contouring for luxury evening engagements."
  }
];

export default function App() {
  const [progress, setProgress] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadPercentage, setLoadPercentage] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Client customization state linked between components
  const [clientName, setClientName] = useState("");
  const [aiProfile, setAiProfile] = useState<StyleProfile | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStylist, setSelectedStylist] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [aboutTab, setAboutTab] = useState<"about" | "mission" | "stats" | "atelier">("about");
  const [serviceCategory, setServiceCategory] = useState<string>("hair");
  const [productCategory, setProductCategory] = useState<string>("hair_care");
  const [galleryCategory, setGalleryCategory] = useState<string>("hair");
  const [activeLightboxImage, setActiveLightboxImage] = useState<any | null>(null);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState<string>("all");
  const [station4Tab, setStation4Tab] = useState<"gallery" | "transformations" | "ai">("gallery");
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Custom Cursor Coordinate State
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [supportsWebGL, setSupportsWebGL] = useState(true);

  // Check WebGL availability and media queries on mount
  useEffect(() => {
    // Media query checks
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(prefersReduced);

    // Test WebGL
    try {
      const c = document.createElement("canvas");
      const available = !!(
        window.WebGLRenderingContext &&
        (c.getContext("webgl") || c.getContext("experimental-webgl"))
      );
      setSupportsWebGL(available);
    } catch (e) {
      setSupportsWebGL(false);
    }

    // Cursor tracking
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Smooth percentage loader
    let timer = setInterval(() => {
      setLoadPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoaded(true), 250);
          return 100;
        }
        return prev + Math.floor(4 + Math.random() * 8);
      });
    }, 60);

    const updateIsMobile = () => setIsMobile(window.innerWidth < 768);
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => {
      clearInterval(timer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("aura-theme") as "dark" | "light" | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    window.localStorage.setItem("aura-theme", theme);
  }, [theme]);

  // Update scrolled state
  useEffect(() => {
    if (progress > 0.015) {
      setHasScrolled(true);
    }
  }, [progress]);

  // Handle jump to index
  const handleJumpToStation = (idx: number) => {
    setTargetProgress(idx / 5);
    setMenuOpen(false);
  };

  const getActiveStationIndex = () => {
    return Math.max(0, Math.min(5, Math.round(progress * 5)));
  };

  const activeIdx = getActiveStationIndex();

  // Get active opacity/scale multiplier for specific panel based on current scroll progress
  const getPanelOffsetStyle = (idx: number) => {
    const step = idx / 5;
    const distance = Math.abs(progress - step);

    // Smooth fade in as we get close to the station (within 0.08 range)
    let opacityFactor = 0;
    const maxDist = 0.08;
    if (distance < maxDist) {
      const t = 1 - (distance / maxDist);
      opacityFactor = t * t * (3 - 2 * t); // Smoothstep curve
    }

    return {
      opacity: opacityFactor,
      transform: `translateY(${(1 - opacityFactor) * 20}px)`,
      visibility: opacityFactor < 0.01 ? ("hidden" as const) : ("visible" as const),
      pointerEvents: opacityFactor > 0.5 ? ("auto" as const) : ("none" as const),
      transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
    };
  };

  return (
    <div className={`relative min-h-screen select-none overflow-hidden ${theme === "dark" ? "bg-black text-white" : "bg-neutral-100 text-slate-900"} antialiased`}>
      {/* Film grain and vignette shader overlays */}
      <div className="fixed inset-0 z-1 pointer-events-none bg-radial-gradient(ellipse at 50% 45%, rgba(250,248,245,0) 35%, rgba(180,136,67,0.12) 100%) mix-blend-multiply" />
      <div className="fixed inset-0 z-1 pointer-events-none opacity-[0.03] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')]" />

      {/* Luxury Brand Custom Cursor */}
      {!window.matchMedia("(hover: none)").matches && (
        <div
          className={`fixed pointer-events-none z-50 rounded-full border border-amber-600/80 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hidden sm:block ${
            isHovered ? "h-12 w-12 bg-amber-600/5 border-amber-700" : "h-6 w-6"
          }`}
          style={{ left: cursorPos.x, top: cursorPos.y }}
        />
      )}

      {/* 1. Loader screen */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-[#FAF8F5]"
          >
            <span className="font-display text-2xl font-light tracking-[0.3em] uppercase text-neutral-900">
              AURA
            </span>
            <div className="h-[1px] w-48 bg-neutral-200 relative overflow-hidden">
              <div
                className="h-full bg-amber-600 transition-all duration-100 ease-linear"
                style={{ width: `${loadPercentage}%` }}
              />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-amber-700/80">
              HORTON PLACE, COLOMBO 7
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ThreeJS Immersive canvas backing */}
      {supportsWebGL ? (
        <ThreeCorridor
          progress={progress}
          onProgressChange={setProgress}
          targetProgress={targetProgress}
          setTargetProgress={setTargetProgress}
          reduceMotion={reduceMotion}
          theme={theme}
        />
      ) : (
        // WebGL Fallback gradient background
        <div className={`fixed inset-0 z-0 bg-gradient-to-b ${theme === "dark" ? "from-[#15110d] to-[#0e0b08]" : "from-[#f7efe4] to-[#e5d8ca]"}`} />
      )}

      {/* 3. Global Static Header (Chrome) */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-6 md:px-8 pointer-events-none">
        <button
          onClick={() => setTargetProgress(0)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="pointer-events-auto font-display text-base md:text-xl font-light tracking-[0.3em] uppercase text-white hover:text-amber-300 transition-colors" style={{textShadow:'0 2px 20px rgba(0,0,0,0.9)'}}
        >
          AURA
        </button>

        <div className="flex items-center gap-4 pointer-events-auto">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex items-center justify-center gap-2 rounded-full border backdrop-blur-md px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-all ${
              theme === "dark"
                ? "border-white/15 bg-black/40 text-white/80 hover:border-amber-500/50 hover:text-amber-300"
                : "border-slate-300/60 bg-white/80 text-slate-900/90 hover:border-amber-500/70 hover:text-slate-700"
            }`}
          >
            {theme === "dark" ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
            <span>{theme === "dark" ? "LIGHT" : "DARK"}</span>
          </button>

          <button
            onClick={() => setTargetProgress(1)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="hidden md:inline-flex items-center gap-1.5 btn-gold font-mono text-[10px] uppercase tracking-widest font-semibold px-5 py-2.5 rounded-full cursor-pointer"
          >
            Reserve Chair →
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/40 backdrop-blur-md px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-white/80 hover:border-amber-500/50 hover:text-amber-300 transition-all"
          >
            {menuOpen ? <X className="h-3 w-3" /> : <Menu className="h-3 w-3" />}
            Index
          </button>
        </div>
      </header>

      {/* 4. Index Nav Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-35 bg-neutral-900/40 backdrop-blur-sm"
            />

            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-40 w-full max-w-[340px] border-l border-amber-500/15 bg-black/75 backdrop-blur-2xl p-6 pt-24 shadow-2xl text-left flex flex-col justify-between text-white"
            >
              <div>
                <span className="block font-display text-[11px] font-light uppercase tracking-[0.3em] text-amber-400 mb-6">
                  AURA
                </span>

                <ul className="space-y-1">
                  {STATIONS.map((st, sidx) => (
                    <li key={st.n}>
                      <button
                        onClick={() => handleJumpToStation(sidx)}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className="flex w-full items-baseline gap-4 border-b border-white/8 py-4 text-white/60 transition-all hover:pl-3 hover:text-amber-300"
                      >
                        <span className="font-mono text-xs text-amber-600">{st.n}</span>
                        <span className="font-sans text-lg font-light tracking-wide">{st.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sri Lankan contact footer in index */}
              <div className="space-y-4 font-mono text-[10px] leading-relaxed text-white/40">
                <div className="flex gap-2">
                  <MapPin className="h-3.5 w-3.5 text-amber-600 flex-none" />
                  <span>
                    14 Horton Place,
                    <br /> Colombo 7, Sri Lanka
                  </span>
                </div>
                <div className="flex gap-2">
                  <Clock className="h-3.5 w-3.5 text-amber-600 flex-none" />
                  <span>Tue–Sun, 10:00–19:00</span>
                </div>
                <div className="flex gap-2 border-t border-neutral-100 pt-3">
                  <Mail className="h-3.5 w-3.5 text-amber-600" />
                  <a href="mailto:hello@aura.lk" className="hover:text-amber-700 transition-colors">
                    hello@aura.lk
                  </a>
                </div>
                <div className="flex gap-2">
                  <Instagram className="h-3.5 w-3.5 text-amber-600" />
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700 transition-colors">
                    instagram.com/aura.colombo
                  </a>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* 5. Progress Tracker Sidebar (Vertical Rail) */}
      <aside className="hidden md:flex fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-25 flex-col items-center gap-4 pointer-events-auto">
        <div className="relative w-[2px] h-[200px] bg-white/15 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-amber-400 to-amber-600 rounded-full transition-all duration-100"
            style={{ height: `${progress * 100}%` }}
          />
        </div>

        <ul className="flex flex-col gap-6 font-sans text-[10px] tracking-widest text-white/30 uppercase">
          {STATIONS.map((st, idx) => {
            const isActive = activeIdx === idx;
            return (
              <li key={st.n} className="flex items-center gap-3 relative">
                <button
                  onClick={() => setTargetProgress(idx / 5)}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className={`h-2.5 w-2.5 rounded-full border transition-all ${
                    isActive ? "bg-amber-400 border-amber-300 scale-125 shadow-lg shadow-amber-400/40" : "bg-white/20 border-white/30 hover:border-amber-400"
                  }`}
                  aria-label={`Jump to ${st.name}`}
                />
                <span
                  className={`absolute right-6 top-1/2 -translate-y-1/2 transition-opacity duration-300 pointer-events-none whitespace-nowrap text-xs ${
                    isActive ? "opacity-100 text-amber-300 font-medium" : "opacity-0"
                  }`}
                  style={isActive ? {textShadow:'0 1px 12px rgba(0,0,0,0.9)'} : {}}
                >
                  {st.name}
                </span>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* 6. Main Interactive Floating Contents */}
      <main className="fixed inset-0 z-10 pointer-events-none mt-28 pt-28 mb-28 pb-28 flex items-center justify-center">
        {/* STATION 00 — ARRIVAL */}
        <section
          className="absolute inset-0 flex items-center justify-center p-4 pt-28 md:p-8 md:pt-12 pointer-events-none"
          style={getPanelOffsetStyle(0)}
        >
          <div className="pointer-events-auto max-h-[90vh] overflow-y-auto hud-scroll w-full max-w-3xl text-center">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold" style={{textShadow:'0 1px 12px rgba(0,0,0,0.9)'}}>
              {STATIONS[0].eyebrow}
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-light tracking-wide text-white mt-4 mb-5" style={{textShadow:'0 4px 40px rgba(0,0,0,0.95),0 8px 80px rgba(0,0,0,0.75)'}}>
              {clientName ? `Welcome, ${clientName}` : "Where Beauty Meets Artistry"}
            </h1>
            <p className="font-sans text-base md:text-xl text-white/90 leading-relaxed font-light mb-8" style={{textShadow:'0 2px 20px rgba(0,0,0,0.9)'}}>
              At <strong className="text-amber-300 font-medium font-display italic">AURA</strong>, we believe beauty is an organic sculpture. Our master stylists and sensory artisans customize hair design, bespoke balayages, and botanical treatments within a serene, light-filled Colombo 7 sanctuary.
            </p>

            <div className="mt-4">
              <label className="block text-center font-mono text-xs uppercase tracking-widest text-amber-400 font-semibold mb-3" style={{textShadow:'0 1px 12px rgba(0,0,0,0.9)'}}>
                Customize Your Walkway Greeting
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter your name to begin..."
                className="glass-input w-full text-center max-w-md mx-auto rounded-full p-4 font-sans text-sm"
              />
            </div>

            {/* Elegant Interactive About Us Module */}
            <div className="mt-8 glass-card rounded-2xl p-6 text-left">
              <span className="block font-mono text-xs uppercase tracking-[0.22em] text-amber-400 font-semibold mb-4" style={{textShadow:'0 1px 12px rgba(0,0,0,0.9)'}}>
                Sanctuary Profile & Heritage
              </span>
              <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-5">
                {[
                  { id: "about", label: "Our Story" },
                  { id: "mission", label: "Aesthetic" },
                  { id: "stats", label: "The Atelier" },
                  { id: "atelier", label: "Live Chairs ✂️" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAboutTab(tab.id as any)}
                    className={`font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-all cursor-pointer ${
                      aboutTab === tab.id
                        ? "btn-gold"
                        : "btn-ghost-gold"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="min-h-[140px] text-base font-sans text-white/70 leading-relaxed font-light">
                {aboutTab === "about" && (
                  <div className="space-y-3">
                    <p>
                      Aura & Corridor is Colombo’s premium luxury beauty atelier. Combining accredited botanical safety with custom facial silhouette consultations, we transform cosmetic care into a restorative sensory ritual.
                    </p>
                    <p className="text-base text-amber-300/90 italic font-display">
                      "Each station along your virtual walkthrough mimics a real physical room of sensory quietude in Colombo 7."
                    </p>
                  </div>
                )}
                {aboutTab === "mission" && (
                  <div className="space-y-3">
                    <p>
                      <strong className="text-amber-300 font-medium">Our Vision:</strong> To translate visual geometry, structural organic weight, and natural skin undertones into bespoke personal artworks.
                    </p>
                    <p>
                      <strong className="text-amber-300 font-medium">Accreditation:</strong> Meticulously curated vegan-certified formulas, sustainable water filtration, and transparent luxury pricing are our guiding promises.
                    </p>
                  </div>
                )}
                {aboutTab === "stats" && (
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    {[
                      { val: "8+ Years", label: "Couture Experience" },
                      { val: "3,000+", label: "Sensory Clients" },
                      { val: "10+", label: "Master Artisans" },
                      { val: "15+", label: "Signature Services" }
                    ].map((stat, sIdx) => (
                      <div key={sIdx} className="p-4 rounded-xl border border-white/10 bg-white/5 text-center">
                        <span className="block font-display text-2xl font-medium italic text-amber-300">{stat.val}</span>
                        <span className="block font-sans text-[10px] text-white/40 uppercase tracking-wider mt-1">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                {aboutTab === "atelier" && (
                  <div className="space-y-4">
                    {/* Live indicators */}
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-white/50 uppercase tracking-wider font-semibold text-xs">Atelier Chair Occupancy</span>
                        <span className="flex items-center gap-1.5 font-mono text-emerald-400 font-semibold uppercase text-xs animate-pulse">
                          <span className="h-2 w-2 rounded-full bg-emerald-400 block"></span> LIVE
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="border border-amber-500/20 p-3 rounded-lg bg-white/5">
                          <span className="font-mono text-amber-500/70 block uppercase text-[10px] mb-1">Chair 01 — Cut</span>
                          <span className="font-semibold text-white">Anura (Cutting)</span>
                        </div>
                        <div className="border border-amber-500/20 p-3 rounded-lg bg-white/5">
                          <span className="font-mono text-amber-500/70 block uppercase text-[10px] mb-1">Chair 02 — Color</span>
                          <span className="font-semibold text-white">Menaka (Balayage)</span>
                        </div>
                        <div className="border border-amber-500/20 p-3 rounded-lg bg-white/5">
                          <span className="font-mono text-amber-500/70 block uppercase text-[10px] mb-1">Chair 03 — Scalp</span>
                          <span className="font-semibold text-white">Yolanda (Massage)</span>
                        </div>
                        <div className="border border-amber-500/20 p-3 rounded-lg bg-white/5 opacity-50">
                          <span className="font-mono text-amber-500/70 block uppercase text-[10px] mb-1">Chair 04 — Nails</span>
                          <span className="font-semibold text-white">Dilki (Ready)</span>
                        </div>
                      </div>
                    </div>

                    {/* Coastal humidity monitor */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">💧</span>
                        <div className="text-left leading-tight">
                          <span className="font-mono text-[10px] text-amber-400 block uppercase tracking-wider font-semibold">Colombo Humidity Advisor</span>
                          <span className="text-xs text-white/50">Current: 82% (High Frizz Risk)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[10px] uppercase btn-gold px-3 py-1.5 rounded-full font-semibold">Lipid Serum Recommended</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setTargetProgress(1 / 5)}
              className="mt-8 flex items-center justify-center gap-2 mx-auto btn-gold rounded-full px-10 py-4 text-sm font-mono uppercase tracking-widest cursor-pointer"
            >
              Explore Expert Services <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section
          className="absolute inset-0 flex items-center justify-center p-4 pt-20 md:p-6 md:pt-6 pointer-events-none"
          style={getPanelOffsetStyle(1)}
        >
          <div className="pointer-events-auto max-h-[90vh] overflow-y-auto hud-scroll w-full max-w-3xl text-left">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold" style={{textShadow:'0 1px 12px rgba(0,0,0,0.9)'}}>
              {STATIONS[1].eyebrow}
            </span>
            <h2 className="font-display text-5xl md:text-7xl font-light tracking-wide text-white mt-4 mb-5 leading-tight" style={{textShadow:'0 4px 40px rgba(0,0,0,0.95),0 8px 80px rgba(0,0,0,0.75)'}}>
              Bespoke Services Menu
            </h2>
            <p className="font-sans text-sm md:text-base text-neutral-600 leading-relaxed font-light">
              Explore our selection of premium beauty therapies. Select a signature category to view our specialized Hair, Makeup, Nails, Skin, Spa, and starting packages.
            </p>

            {/* Elegant Interactive Services Menu */}
            <div className="mt-6 glass-card rounded-2xl p-6">
              <span className="block font-mono text-xs uppercase tracking-[0.22em] text-amber-400 font-semibold mb-4" style={{textShadow:'0 1px 12px rgba(0,0,0,0.9)'}}>
                Salon Service Categories
              </span>
              <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 mb-5">
                {[
                  { id: "hair", label: "Hair" },
                  { id: "makeup", label: "Makeup" },
                  { id: "nail", label: "Nails" },
                  { id: "skin", label: "Skin" },
                  { id: "spa", label: "Spa" },
                  { id: "package", label: "Packages" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setServiceCategory(cat.id)}
                    className={`font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-all cursor-pointer ${
                      serviceCategory === cat.id
                        ? "btn-gold"
                        : "btn-ghost-gold"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3 pr-1">
                {SALON_SERVICES.filter((s) => s.category === serviceCategory).map((s) => {
                  const isSelected = selectedServices.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedServices((prev) =>
                          isSelected ? prev.filter((x) => x !== s.id) : [...prev, s.id]
                        );
                      }}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex justify-between items-start gap-4 cursor-pointer ${
                        isSelected
                          ? "border-amber-500/50 bg-amber-500/10"
                          : "border-white/10 bg-white/5 hover:border-amber-500/30"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="font-sans text-sm font-semibold text-white">{s.name}</span>
                          <span className="font-mono text-sm text-amber-400 font-semibold flex-none">
                            LKR {s.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-white/50 leading-normal mt-1">{s.description}</p>
                        <span className="inline-block mt-1.5 font-mono text-[10px] uppercase text-amber-500/60 gold-badge px-2 py-0.5 rounded">
                          Duration: {s.duration}
                        </span>
                      </div>
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center flex-none mt-0.5 transition-all ${
                        isSelected ? "border-amber-500 bg-amber-500 text-white" : "border-white/20 bg-white/5"
                      }`}>
                        {isSelected && <Check className="h-3 w-3 stroke-[3px]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setTargetProgress(2 / 5)}
              className="mt-8 inline-flex items-center gap-2 btn-ghost-gold rounded-full px-8 py-4 text-xs font-mono uppercase tracking-widest cursor-pointer"
            >
              Continue to Master Artisans <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* STATION 02 — BEAUTY EXPERTS */}
        <section
          className="absolute inset-0 flex items-center justify-center p-4 pt-20 md:p-6 md:pt-6 pointer-events-none"
          style={getPanelOffsetStyle(2)}
        >
          <div className="pointer-events-auto max-h-[90vh] overflow-y-auto hud-scroll w-full max-w-4xl text-left">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold" style={{textShadow:'0 1px 12px rgba(0,0,0,0.9)'}}>
              {STATIONS[2].eyebrow}
            </span>
            <h2 className="font-display text-5xl md:text-7xl font-light tracking-wide text-white mt-4 mb-5 leading-tight" style={{textShadow:'0 4px 40px rgba(0,0,0,0.95),0 8px 80px rgba(0,0,0,0.75)'}}>
              Artisans of Aesthetic Balance
            </h2>
            <p className="font-sans text-base md:text-xl text-white/75 leading-relaxed font-light" style={{textShadow:'0 2px 20px rgba(0,0,0,0.9)'}}>
              Meet our elite master stylists who translate organic hair fall, custom pigments, and facial anatomy into exquisite, wearable art. Swipe horizontally to view their profiles, contact numbers, and select your artist.
            </p>

            {/* Elegant Horizontal Scrolling Beauty Experts Carousel */}
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-3 mb-5">
                <span className="block font-mono text-xs uppercase tracking-[0.22em] text-amber-400 font-semibold" style={{textShadow:'0 1px 12px rgba(0,0,0,0.9)'}}>
                  Our Master Artisans
                </span>
                {!isMobile && (
                  <span className="font-mono text-xs uppercase tracking-wider gold-badge px-3.5 py-1.5 rounded-full animate-pulse">
                    ← Swipe →
                  </span>
                )}
              </div>
              
              <div className={`${isMobile ? "grid grid-cols-1 gap-5" : "flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory"}`}>
                {[
                  {
                    name: "Anura Senanayake",
                    role: "Creative Director",
                    spec: "Geometric Silhouette Cuts",
                    exp: "8+ Years",
                    phone: "+94 77 123 4567",
                    bio: "Trained in London, Anura views hair as a structured architectural form. 'Every shear angle must respect structural gravity and movement.'"
                  },
                  {
                    name: "Menaka Fernando",
                    role: "Master Colorist",
                    spec: "Pigment & Light Balancing",
                    exp: "6+ Years",
                    phone: "+94 77 234 5678",
                    bio: "Bespoke tones engineered to enhance natural skin undertones and reflect soft tropical light. 'We sculpt light reflections.'"
                  },
                  {
                    name: "Yolanda Koch",
                    role: "Senior Aesthetic Specialist",
                    spec: "Skin Care & Scalp Wellness",
                    exp: "5+ Years",
                    phone: "+94 77 345 6789",
                    bio: "Master of traditional holistic botanical therapies and dermaceutical facials. 'Luminous skin begins with absolute quietude.'"
                  },
                  {
                    name: "Dilki Alwis",
                    role: "Nail Expert & Artist",
                    spec: "Luxury Manicure & Nail Art",
                    exp: "4+ Years",
                    phone: "+94 77 456 7890",
                    bio: "Crafting hand-painted miniature modern art and bespoke cuticle care. 'Precision is our language down to the millimeter.'"
                  }
                ].map((st) => {
                  const isSelected = selectedStylist === st.name;
                  return (
                    <button
                      key={st.name}
                      type="button"
                      onClick={() => setSelectedStylist(isSelected ? null : st.name)}
                      className={`w-full ${isMobile ? "" : "w-[300px] sm:w-[340px] shrink-0 snap-center"} text-left p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-5 cursor-pointer ${
                        isSelected
                          ? "border-amber-500/50 bg-amber-500/10"
                          : "border-white/10 bg-black/40 backdrop-blur-md hover:border-amber-500/30"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="font-sans text-lg font-semibold text-white block">{st.name}</span>
                            <span className="font-mono text-xs uppercase tracking-wider text-amber-400/80 block mt-1">
                              {st.role} • {st.spec} • {st.exp}
                            </span>
                          </div>
                          <div className={`h-5 w-5 rounded-full border flex items-center justify-center flex-none transition-all ${
                            isSelected ? "border-amber-500 bg-amber-500 text-white" : "border-white/20 bg-white/5"
                          }`}>
                            {isSelected && <Check className="h-3 w-3 stroke-[3px]" />}
                          </div>
                        </div>

                        <p className="font-sans text-sm text-white/60 leading-relaxed mt-4 italic font-light">
                          "{st.bio}"
                        </p>
                      </div>

                      <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs">
                        <span className="font-mono text-white/30 uppercase tracking-widest">
                          Contact Artist
                        </span>
                        <span className="font-mono text-amber-400 font-semibold tracking-wide">
                          {st.phone}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setTargetProgress(3 / 5)}
              className="mt-8 inline-flex items-center gap-2 btn-ghost-gold rounded-full px-8 py-4 text-xs font-mono uppercase tracking-widest cursor-pointer pointer-events-auto"
            >
              Continue to Couture & AI Profile <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* STATION 03 — COUTURE GALLERY & AI STYLIST */}
        <section
          className="absolute inset-0 flex items-center justify-center p-4 pt-20 md:p-6 md:pt-6 pointer-events-none"
          style={getPanelOffsetStyle(3)}
        >
          <div className="pointer-events-auto max-h-[90vh] overflow-y-auto hud-scroll w-full max-w-5xl text-left">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold" style={{textShadow:'0 1px 12px rgba(0,0,0,0.9)'}}>
              {STATIONS[3].eyebrow}
            </span>
            <h2 className="font-display text-5xl md:text-7xl font-light tracking-wide text-white mt-4 mb-3 leading-tight" style={{textShadow:'0 4px 40px rgba(0,0,0,0.95),0 8px 80px rgba(0,0,0,0.75)'}}>
              Couture, AI & Transformations
            </h2>
            <p className="font-sans text-base md:text-xl text-white/75 leading-relaxed font-light mb-6" style={{textShadow:'0 2px 20px rgba(0,0,0,0.9)'}}>
              Step into the Reveal Station. Explore our design portfolio, browse real-life client transformations, or receive a customized styling blueprint using Google Gemini AI.
            </p>

            {/* Elegant Sub-tabs for Station 3 */}
            <div className="flex flex-wrap gap-3 border-b border-white/10 pb-4 mb-6">
              {[
                { id: "gallery", label: "Couture Portfolio ✦" },
                { id: "transformations", label: "Real Reveals ✂️" },
                { id: "ai", label: "AI Style Prescription ⚡" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStation4Tab(tab.id as any)}
                  className={`font-mono text-sm uppercase tracking-wider px-6 py-3 rounded-full border transition-all duration-300 cursor-pointer ${
                    station4Tab === tab.id
                      ? "btn-gold"
                      : "btn-ghost-gold"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content wrapper */}
            <div className="min-h-[300px]">
              {station4Tab === "gallery" && (
                <div>
                  {/* Gallery Filters */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {[
                      { id: "all", label: "All Masterpieces" },
                      { id: "hair", label: "Hair Cuts" },
                      { id: "color", label: "Balayage" },
                      { id: "bridal", label: "Glamour & Bridal" },
                      { id: "nails", label: "Nail Art" }
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setActiveGalleryFilter(f.id)}
                        className={`font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer ${
                          activeGalleryFilter === f.id
                            ? "btn-gold"
                            : "btn-ghost-gold"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Gallery Image Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[320px] overflow-y-auto pr-1">
                    {REAL_WORK_GALLERY.filter(item => activeGalleryFilter === "all" || item.category === activeGalleryFilter).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setActiveLightboxImage(item)}
                        className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/20 cursor-pointer transition-all duration-500 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10"
                      >
                        {/* Photo container */}
                        <div className="aspect-[4/3] w-full overflow-hidden relative">
                          <img
                            src={item.img}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/10 to-transparent opacity-40 group-hover:opacity-75 transition-opacity duration-300" />
                          
                          {/* Zoom icon on hover */}
                          <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 border border-white/20 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Maximize2 className="h-3.5 w-3.5" />
                          </div>
                        </div>

                        {/* Caption */}
                        <div className="p-3.5">
                          <span className="font-mono text-[10px] tracking-widest text-amber-400 uppercase block mb-1">
                            {item.tag}
                          </span>
                          <h4 className="font-sans text-sm font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                            {item.title}
                          </h4>
                          <p className="font-mono text-[10px] text-white/40 mt-0.5">
                            By {item.artist}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {station4Tab === "transformations" && (
                <div className="space-y-5">
                  {/* Gallery Category Filter */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/10 pb-4 gap-3">
                    <span className="block font-mono text-xs uppercase tracking-[0.22em] text-amber-400 font-semibold" style={{textShadow:'0 1px 12px rgba(0,0,0,0.9)'}}>
                      Filter Transformation Portfolio
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {["hair", "makeup", "bridal", "nails"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setGalleryCategory(cat)}
                          className={`font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full transition-all border cursor-pointer ${
                            galleryCategory === cat
                              ? "btn-gold"
                              : "btn-ghost-gold"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Before/After cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[200px] overflow-y-auto pr-1">
                    {[
                      {
                        cat: "hair",
                        title: "Sandalwood Balayage Transformation",
                        before: "Dry, uneven copper brassy hair with 3-inch root outgrowth.",
                        after: "Deep caramel base with masterfully placed warm amber balayage and geometric bounce.",
                        stylist: "Menaka Fernando"
                      },
                      {
                        cat: "makeup",
                        title: "Luminous Glow Gala Makeover",
                        before: "Dull, fatigued skin with minor blemishes and minimal natural contrast.",
                        after: "Hydrated flawless dewy HD airbrush base, shimmering bronze lids, and defined contours.",
                        stylist: "Anura Senanayake"
                      },
                      {
                        cat: "bridal",
                        title: "Traditional Royal Kandyan Bride",
                        before: "Plain hair structure and basic everyday skin hydration.",
                        after: "Majestic layered hair setup supporting gold headwear, paired with premium sweat-proof makeup.",
                        stylist: "Menaka & Anura"
                      },
                      {
                        cat: "nails",
                        title: "Emerald & GoldExtensions",
                        before: "Short, brittle cuticles with uneven shapes and standard polish chips.",
                        after: "Perfect gel extensions with custom organic hand-painted minimal geometric gold lines.",
                        stylist: "Dilki Alwis"
                      }
                    ]
                      .filter((item) => item.cat === galleryCategory)
                      .map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-white/10 bg-black/30 backdrop-blur-md font-sans text-sm">
                          <div className="flex justify-between items-baseline mb-3">
                            <span className="font-sans text-sm font-semibold text-white">{item.title}</span>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-semibold">By {item.stylist}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                              <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest block font-bold">Before</span>
                              <p className="font-sans text-white/50 font-light leading-relaxed">{item.before}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                              <span className="font-mono text-[9px] text-amber-400 uppercase tracking-widest block font-bold">After Transformation</span>
                              <p className="font-sans text-white/70 font-light leading-relaxed">{item.after}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Testimonials moved to Station 02 */}
                </div>
              )}

              {station4Tab === "ai" && (
                <div>
                  <AiConsultant
                    clientName={clientName}
                    onProfileGenerated={setAiProfile}
                    savedProfile={aiProfile}
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => setTargetProgress(4 / 5)}
              className="mt-8 inline-flex items-center gap-2 btn-gold rounded-full px-10 py-4 text-sm font-mono uppercase tracking-widest cursor-pointer pointer-events-auto"
            >
              Go to Booking Desk <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* STATION 04 — RESERVATIONS */}
        <section
          className="absolute inset-0 flex items-center justify-center p-4 pt-20 md:p-6 md:pt-6 pointer-events-none"
          style={getPanelOffsetStyle(4)}
        >
          <div className="pointer-events-auto max-h-[90vh] overflow-y-auto hud-scroll w-full max-w-5xl text-left">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold" style={{textShadow:'0 1px 12px rgba(0,0,0,0.9)'}}>
              {STATIONS[4].eyebrow}
            </span>
            <h2 className="font-display text-5xl md:text-7xl font-light tracking-wide text-white mt-4 mb-5 leading-tight" style={{textShadow:'0 4px 40px rgba(0,0,0,0.95),0 8px 80px rgba(0,0,0,0.75)'}}>
              Reserve Your Chair
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="font-sans text-base md:text-xl text-white/75 leading-relaxed font-light max-w-3xl" style={{textShadow:'0 2px 20px rgba(0,0,0,0.9)'}}>
                Your virtual walkway journey culminates here. Review your chosen services, selected artisan, and book your secure Colombo 7 chair reservation.
              </p>
              <button
                type="button"
                onClick={() => setTargetProgress(0)}
                className="btn-ghost-gold rounded-full px-5 py-2.5 text-xs font-mono uppercase tracking-widest cursor-pointer whitespace-nowrap self-start pointer-events-auto shadow-sm"
              >
                ← Back to Welcome Page
              </button>
            </div>

            {/* Comprehensive Reservation Portal & Checkout */}
            <BookingPortal
              initialStation={activeIdx}
              aiProfile={aiProfile}
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
              selectedStylist={selectedStylist}
              setSelectedStylist={setSelectedStylist}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              onRedirectToWelcome={() => setTargetProgress(0)}
            />

            <button
              onClick={() => setTargetProgress(5 / 5)}
              className="mt-6 flex items-center justify-center gap-2 mx-auto btn-ghost-gold rounded-full px-8 py-3 text-xs font-mono uppercase tracking-widest cursor-pointer pointer-events-auto"
            >
              Continue to Guest Reviews <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* STATION 05 — CLIENT TESTIMONIALS */}
        <section
          className="absolute inset-0 flex items-center justify-center p-4 pt-20 md:p-6 md:pt-6 pointer-events-none"
          style={getPanelOffsetStyle(5)}
        >
          <div className="pointer-events-auto max-h-[90vh] overflow-y-auto hud-scroll w-full max-w-4xl text-left">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold" style={{textShadow:'0 1px 12px rgba(0,0,0,0.9)'}}>
              {STATIONS[5].eyebrow}
            </span>
            <h2 className="font-display text-5xl md:text-7xl font-light tracking-wide text-white mt-4 mb-5 leading-tight" style={{textShadow:'0 4px 40px rgba(0,0,0,0.95),0 8px 80px rgba(0,0,0,0.75)'}}>
              What Our Clients Say
            </h2>
            <p className="font-sans text-base md:text-xl text-white/75 leading-relaxed font-light mb-6" style={{textShadow:'0 2px 20px rgba(0,0,0,0.9)'}}>
              Read verified reviews from our esteemed guests or share your own Aura & Corridor experience.
            </p>

            <ClientTestimonials />

            <button
              onClick={() => setTargetProgress(0)}
              className="mt-8 inline-flex items-center gap-2 btn-gold rounded-full px-10 py-4 text-sm font-mono uppercase tracking-widest cursor-pointer pointer-events-auto"
            >
              ← Restart Walkthrough
            </button>
          </div>
        </section>
      </main>

      {/* Lightbox Modal for Real Work Gallery */}
      <AnimatePresence>
        {activeLightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-md cursor-zoom-out pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl cursor-default ${theme === "dark" ? "bg-[#120f0d]" : "bg-[#f5ede5]"}`}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveLightboxImage(null)}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full border transition-all cursor-pointer shadow-md ${
                  theme === "dark"
                    ? "bg-black/50 border-white/10 text-white/70 hover:text-amber-400 hover:border-amber-500/50"
                    : "bg-slate-100/80 border-slate-300 text-slate-800 hover:text-amber-600 hover:border-amber-300"
                }`}
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col md:flex-row h-full">
                {/* Photo */}
                <div className={`w-full md:w-3/5 aspect-video md:aspect-auto md:h-[400px] relative ${theme === "dark" ? "bg-black/40" : "bg-white/80"}`}>
                  <img
                    src={activeLightboxImage.img}
                    alt={activeLightboxImage.title}
                    referrerPolicy="no-referrer"
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Info Column */}
                <div className={`w-full md:w-2/5 p-6 flex flex-col justify-between ${theme === "dark" ? "bg-[#120f0d]" : "bg-[#faf5ef]"}`}>
                  <div>
                    <span className="font-mono text-[9px] tracking-widest text-amber-400 font-semibold uppercase block mb-1">
                      {activeLightboxImage.tag}
                    </span>
                    <h3 className="font-display text-lg font-light text-white mb-2">
                      {activeLightboxImage.title}
                    </h3>
                    <p className="font-sans text-[11px] text-white/70 leading-relaxed font-light mb-4">
                      {activeLightboxImage.desc}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4 mt-auto">
                    <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest block mb-1">
                      Artisan Stylist
                    </span>
                    <span className="font-sans text-xs font-semibold text-white/90 block">
                      {activeLightboxImage.artist}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Scroll cue helper */}
      {!hasScrolled && !isMobile && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none opacity-80 animate-pulse">
          <span className="font-sans text-sm uppercase tracking-widest font-light text-white/60" style={{textShadow:'0 1px 12px rgba(0,0,0,0.9)'}}>
            Scroll or drag to walk the walkway
          </span>
          <ChevronDown className="h-5 w-5 text-amber-400 animate-bounce" />
        </div>
      )}
    </div>
  );
}
