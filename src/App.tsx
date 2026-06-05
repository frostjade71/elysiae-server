import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import journalImage from './assets/images/Cozy Enchanting room.jpg';
import netherImage from './assets/images/2964545.jpg';
import enchantedBookIcon from './assets/icons/24967-enchanted-book-minecraft.png';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const isUserClick = useRef(false);
  const visibleSections = useRef(new Set<string>());

  // Scroll-spy: observe each section and update activeSection in real-time
  useEffect(() => {
    const sectionIds = ['home', 'chronicle', 'decrees', 'council'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Skip observer updates briefly after a user click
        if (isUserClick.current) return;

        // Track which sections are currently visible
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSections.current.add(entry.target.id);
          } else {
            visibleSections.current.delete(entry.target.id);
          }
        }

        // Pick the topmost visible section (by DOM order)
        for (const id of sectionIds) {
          if (visibleSections.current.has(id)) {
            setActiveSection(id);
            return;
          }
        }
      },
      {
        threshold: [0.05, 0.2, 0.4],
        // Require sections to be well into the viewport
        rootMargin: '-10% 0px -35% 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // When user clicks a nav item, briefly suppress the observer
  const handleSetActiveSection = (id: string) => {
    isUserClick.current = true;
    setActiveSection(id);
    // Allow observer to take back over after scroll settles
    setTimeout(() => {
      isUserClick.current = false;
    }, 1000);
  };

  const citizens = [
    "__METH",
    "__SEI",
    "SEELENLIED",
    "KSMIRACLE",
    "XENOMITEGD",
    "ANAFFYTAFFY",
    "KAIFLOXOL",
    "MILKHYPE235",
    "KLXYN",
    "PEE_HIGHLIGHTER",
    "GUNNERLEGEND",
    "EDELWEISSE",
    "TEIERI",
    "EXTREMEMEN",
    "HAKURIWAKURI",
    "FROSTTZY"
  ];

  const sections = [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'chronicle', label: 'Origins', href: '#chronicle' },
    { id: 'decrees', label: 'Decrees', href: '#decrees' },
    { id: 'council', label: 'Councils', href: '#council' }
  ];

  // Framer Motion presets for clean premium animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardHover = {
    hover: {
      y: -8,
      borderColor: "rgba(112, 88, 91, 0.8)",
      boxShadow: "0 20px 40px -15px rgba(60, 47, 47, 0.12)",
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  return (
    <div className="text-on-background min-h-screen selection:bg-secondary-container selection:text-secondary relative font-sans overflow-x-hidden">
      <div className="fixed inset-0 paper-grain opacity-50 z-[-1]"></div>

      {/* Sticky/Fixed Navbar Container */}
      <div className="fixed top-0 left-0 right-0 z-50 p-3 md:p-5 pointer-events-none">
        <div className="w-full max-w-[1536px] mx-auto pointer-events-auto">
          <Navbar
            activeSection={activeSection}
            setActiveSection={handleSetActiveSection}
            sections={sections}
          />
        </div>
      </div>

      {/* Full-Screen Immersive Background Hero */}
      <Hero />

      <main className="max-w-[1120px] mx-auto px-gutter md:px-0 pt-12 pb-stack-lg">

        {/* Origins & Lore Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-stack-lg scroll-mt-24"
          id="chronicle"
        >
          <motion.h2 variants={fadeInUp} className="font-headline-md text-headline-md text-center mb-stack-lg">
            Origins of Aedes Elysiae
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              { era: "ERA I", title: "KRP MCVerse S2 C2", desc: "The Unnamed Coalition: A strategic unification of Ynares and Ave Stellaris foundations." },
              { era: "ERA II", title: "Season 3", desc: "The Baptism: Officially christened as Aedes Elysiae, entering the global stage of sovereign nations." },
              { era: "ERA III", title: "Current Epoch", desc: "Kupal Community SMP Season 1: The current era of the journal and flourishing prosperity." }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover="hover"
                custom={idx}
                variants={{
                  ...fadeInUp,
                  ...cardHover
                }}
                className="bg-surface-container-low p-stack-md border border-secondary/10 flex flex-col items-center text-center soft-whisper cursor-default"
              >
                <span className="font-label-lg text-label-lg text-secondary mb-2">{item.era}</span>
                <h3 className="font-headline-sm text-headline-sm mb-2">{item.title}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Founders Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-stack-lg"
          id="dynasty"
        >
          <motion.h2 variants={fadeInUp} className="font-headline-md text-headline-md text-center mb-stack-lg">
            The Founding Trio
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              {
                name: "__Meth",
                role: "Founding Magistrate",
                status: "(Currently inactive / busy IRL)"
              },
              {
                name: "__Sei",
                role: "Vice-Magistrate & First Lady",
                status: "(Currently busy IRL also)"
              },
              {
                name: "DefNotShiro",
                role: "Co-founder",
                status: "(Currently busy IRL also)"
              }
            ].map((founder) => (
              <motion.div
                key={founder.name}
                whileHover="hover"
                variants={{
                  ...fadeInUp,
                  ...cardHover
                }}
                className="group relative bg-surface-container-lowest border border-secondary/20 p-stack-md transition-all duration-500 cursor-default"
              >
                <div className="h-64 mb-4 bg-surface-dim flex items-center justify-center border border-dashed border-secondary/30 relative text-on-surface-variant/60 italic font-medium select-none">
                  Need Images uwu
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">{founder.name}</h3>
                <p className="font-label-lg text-label-lg text-secondary uppercase tracking-widest mb-2">
                  {founder.role}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant italic">{founder.status}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Leadership Transition (The Decree) */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="mb-stack-lg scroll-mt-24"
          id="decrees"
        >
          <div className="max-w-3xl mx-auto bg-surface-variant border border-secondary/30 p-12 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, #333333 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            ></div>
            <div className="relative z-10">
              <div className="flex flex-col items-center mb-stack-md">
                <motion.span
                  initial={{ rotate: -20 }}
                  whileInView={{ rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="material-symbols-outlined text-secondary text-4xl mb-4"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  history_edu
                </motion.span>
                <h2 className="font-headline-md text-headline-md text-on-surface text-center">The Decree and New Leadership</h2>
              </div>
              <div className="space-y-4 font-body-lg text-body-lg text-on-surface text-center mb-stack-md leading-relaxed italic">
                <p>“I hereby decree seelenlied the acting founder of Elysiae (former Ynares) starting now and until further notice.”</p>
                <p>“All decisions and questions regarding Elysiae shall now be under his concern.”</p>
                <p> “Furthermore, As Elysiae wasn’t built alone, but with the friends and hard-work everyone has put in. Our new Founder will need assistance”</p>
                <p>“Acting Co-Founder shall now be XenomiteGD, replacing __Meth.”</p>
                <p className="font-semibold text-secondary">
                  “People of Elysiae, Our story has only begun! The memories live in the people of Elysiae, Long Live Elysia!”
                </p>
              </div>
              <div className="text-center">
                <p className="font-label-lg text-label-lg text-secondary tracking-widest">— __Sei</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant/70 mt-1">FORMER ELYSIAE FOUNDER</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mt-12 pt-8 border-t border-secondary/20">
                <div className="text-center md:text-left">
                  <h4 className="font-headline-sm text-headline-sm mb-1">seelenlied</h4>
                  <p className="font-label-lg text-label-lg text-secondary">Standing Magistrate</p>
                </div>
                <div className="text-center md:text-right">
                  <h4 className="font-headline-sm text-headline-sm mb-1">XenomiteGD</h4>
                  <p className="font-label-lg text-label-lg text-secondary">Standing Vice-Magistrate</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Titles & Honors */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-stack-lg"
        >
          <motion.h2 variants={fadeInUp} className="font-headline-md text-headline-md text-center mb-stack-lg">
            Titles of Elysian Nobility
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <motion.div variants={fadeInUp} className="flex flex-col gap-unit">
              {[
                { name: "seelenlied", title: "FRAU PLATIN", status: "1st Authority", dot: "bg-slate-300" },
                { name: "XenomiteGD", title: "FRAU AURUM", status: "Vice-Magistrate", dot: "bg-amber-400" },
                { name: "KSMiracle", title: "FRAU DIAMANT", status: "1st Edel", dot: "bg-sky-200" }
              ].map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,1)" }}
                  className="flex items-center justify-between p-stack-sm border-b border-secondary/10 bg-white/40 transition-colors duration-200 cursor-default"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${item.dot}`}></div>
                    <div>
                      <p className="font-headline-sm text-headline-sm leading-tight">{item.name}</p>
                      <p className="font-label-sm text-label-sm text-secondary">{item.title}</p>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant italic">{item.status}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="flex flex-col gap-unit">
              {[
                { name: "ANAFFYTAFFY", title: "FRAU SAPHIR", status: "2nd Edel", dot: "bg-blue-600" },
                { name: "KaiFloxol", title: "FRAU AMÉTHYSTE", status: "3rd Edel", dot: "bg-purple-500" },
                { name: "Gunnerlegend", title: "FRAU RUBIN", status: "4th Edel", dot: "bg-rose-600" }
              ].map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,1)" }}
                  className="flex items-center justify-between p-stack-sm border-b border-secondary/10 bg-white/40 transition-colors duration-200 cursor-default"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${item.dot}`}></div>
                    <div>
                      <p className="font-headline-sm text-headline-sm leading-tight">{item.name}</p>
                      <p className="font-label-sm text-label-sm text-secondary">{item.title}</p>
                    </div>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant italic">{item.status}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Council Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="mb-stack-lg bg-surface-container-low p-stack-lg border border-secondary/5 scroll-mt-24"
          id="council"
        >
          <h2 className="font-headline-md text-headline-md text-center mb-stack-sm">The Hoshigumi Council</h2>
          <p className="font-body-md text-body-md text-center text-on-surface-variant mb-stack-lg max-w-xl mx-auto">
            An advisory council of five Edels who stand as the pillars of the nation, supporting the Standing Magistrate in all matters of state.
          </p>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center gap-stack-sm max-w-md mx-auto"
          >
            {[
              { rank: "1ST EDEL", name: "KSMiracle (SaintSteins)" },
              { rank: "2ND EDEL", name: "ANAFFYTAFFY" },
              { rank: "3RD EDEL", name: "KaiFloxol" },
              { rank: "4TH EDEL", name: "Gunnerlegend" },
              { rank: "5TH EDEL", name: "Pee_Highlighter" }
            ].map((edel) => (
              <motion.div
                key={edel.rank}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, borderColor: "rgba(51, 51, 51, 0.4)" }}
                className="w-full flex flex-col md:flex-row md:justify-between p-4 border border-secondary/10 bg-surface-container-lowest transition-colors duration-250 cursor-default"
              >
                <span className="font-label-lg text-label-lg text-secondary mb-1 md:mb-0">{edel.rank}</span>
                <span className="font-headline-sm text-headline-sm">{edel.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Citizens Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-stack-lg"
        >
          <motion.h2 variants={fadeInUp} className="font-headline-md text-headline-md text-center mb-2">
            People of Aedes Elysiae
          </motion.h2>
          <motion.p variants={fadeInUp} className="font-label-lg text-label-lg text-center text-secondary uppercase tracking-widest mb-stack-lg">
            The Elysian Companions and Citizens
          </motion.p>
          <motion.div variants={staggerContainer} className="flex flex-wrap justify-center gap-4">
            {citizens.map((citizen) => (
              <motion.span
                key={citizen}
                variants={fadeInUp}
                whileHover={{ y: -4, scale: 1.05, boxShadow: "0 4px 10px rgba(51, 51, 51, 0.08)" }}
                className="bg-surface-variant text-on-surface-variant px-4 py-2 font-label-lg text-label-lg border border-secondary/5 transition-all duration-200 hover:bg-white cursor-default select-none"
              >
                {citizen}
              </motion.span>
            ))}
          </motion.div>
          <motion.p variants={fadeInUp} className="font-body-sm text-body-sm text-on-surface-variant/60 text-center mt-6 italic">
            All members should be on the Discord server to get on the list here.
          </motion.p>
        </motion.section>

        {/* Journal Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-stack-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center bg-surface-container-lowest p-stack-lg border border-secondary/20 soft-whisper">
            <div className="relative group overflow-hidden h-96">
              <motion.img
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover"
                alt="Minecraft cozy enchanting room"
                src={journalImage}
              />
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-stack-sm">
                <img src={enchantedBookIcon} alt="Enchanted Book" className="w-9 h-9 object-contain inline-block align-middle mr-3" />
                Magistrate's Journal
              </h2>
              <p className="font-label-lg text-label-lg text-secondary mb-4">SEASON 1 ENTRIES</p>
              <div className="space-y-4 font-body-md text-body-md text-on-surface-variant italic leading-relaxed">
                <p>
                  “we need a journal rq”
                </p>
              </div>
              <motion.button
                whileHover={{ x: 6 }}
                className="mt-8 font-label-lg text-label-lg text-secondary flex items-center gap-2 transition-transform"
              >
                Read full entries <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </motion.button>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Nether Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-[1536px] mx-auto h-[340px] md:h-[400px] overflow-hidden rounded-[2rem] md:rounded-[3rem] group"
      >
        <img
          src={netherImage}
          alt="Nether landscape"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-[1]" />

        <div className="relative z-10 w-full h-full flex items-center justify-center px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#FAF6F0] tracking-tight leading-[1.1] font-serif drop-shadow-md text-center"
          >
            Is Nether just a Myth?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-[#EAE0D5]/80 font-normal font-sans drop-shadow-sm mt-3 italic"
          >
            "e open nyo nether admin!"
          </motion.p>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="w-full py-stack-lg px-margin-page flex flex-col items-center gap-stack-md bg-surface-container-lowest border-t border-secondary/10">
        <div className="font-headline-sm text-headline-sm text-secondary italic">Aedes Elysiae</div>
        <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-lg italic">
          “The memories live in the people of Elysiae, Long Live Elysia.”
        </p>
        <div className="flex gap-gutter">
          <a className="font-label-sm text-label-sm text-secondary-fixed-variant hover:text-primary transition-colors" href="#">
            Lore
          </a>
          <a className="font-label-sm text-label-sm text-secondary-fixed-variant hover:text-primary transition-colors" href="#">
            Gallery
          </a>
          <a className="font-label-sm text-label-sm text-secondary-fixed-variant hover:text-primary transition-colors" href="#">
            Server Info
          </a>
          <a className="font-label-sm text-label-sm text-secondary-fixed-variant hover:text-primary transition-colors" href="#">
            Contact
          </a>
        </div>
        <div className="mt-stack-md text-center">
          <p className="font-label-sm text-label-sm text-secondary-fixed-variant">A nation of the Kupal Community SMP</p>
          <p className="font-label-sm text-label-sm text-secondary-fixed-variant mt-1">
            Long Live Elysia — An Aristocratic Chronicle of the Aedes Nation
          </p>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {activeSection !== 'home' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={() => {
              document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#1C1C1C]/70 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-lg hover:bg-[#1C1C1C]/90 transition-colors cursor-pointer"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
