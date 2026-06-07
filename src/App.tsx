import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, X } from 'lucide-react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import journalImage from './assets/images/Cozy Enchanting room.jpg';
import netherImage from './assets/images/2964545.jpg';
import enchantedBookIcon from './assets/icons/EnchantedBookNew.gif';
import elysianWrIcon from './assets/icons/elysian_wr.png';
import methImage from './assets/images/meth.png';
import seiImage from './assets/images/2026-06-04_22.56.17.png';
import shiroImage from './assets/images/shiro.png';
import { subscribeToAuthChanges, subscribeToCitizens, logoutStaff } from './firebase';
import LoginModal from './components/LoginModal';
import StaffPanel from './components/StaffPanel';

import ironBlockIcon from './assets/titles/85890-nether-quartz.png';
import goldIcon from './assets/titles/45673-gold.png';
import diamondIcon from './assets/titles/16469-diamond (1).png';
import lapisIcon from './assets/titles/22752-lapis-lazuli.png';
import amethystIcon from './assets/titles/62315-minecraft-amethyst.png';
import redstoneIcon from './assets/titles/21630-redstone.png';
import emeraldIcon from './assets/titles/185424-esmeralda (1).png';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedJournal, setSelectedJournal] = useState<'season1' | 'season2'>('season2');
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const isUserClick = useRef(false);
  const visibleSections = useRef(new Set<string>());

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isStaffPanelOpen, setIsStaffPanelOpen] = useState(false);
  const [citizens, setCitizens] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem('elysiae_citizens');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const unsubscribe = subscribeToCitizens((newCitizens) => {
      setCitizens(newCitizens);
      try {
        localStorage.setItem('elysiae_citizens', JSON.stringify(newCitizens));
      } catch (err) {
        console.error('Failed to cache citizens:', err);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleCitizenAdded = () => {};

  const handleLogout = async () => {
    await logoutStaff();
  };

  useEffect(() => {
    const sectionIds = ['home', 'chronicle', 'decrees', 'council'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isUserClick.current) return;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSections.current.add(entry.target.id);
          } else {
            visibleSections.current.delete(entry.target.id);
          }
        }

        for (const id of sectionIds) {
          if (visibleSections.current.has(id)) {
            setActiveSection(id);
            return;
          }
        }
      },
      {
        threshold: [0.05, 0.2, 0.4],
        rootMargin: '-10% 0px -35% 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSetActiveSection = (id: string) => {
    isUserClick.current = true;
    setActiveSection(id);
    setTimeout(() => {
      isUserClick.current = false;
    }, 1000);
  };

  const sections = [
    { id: 'home', label: 'Home', href: '#' },
    { id: 'chronicle', label: 'Origins', href: '#chronicle' },
    { id: 'decrees', label: 'Decrees', href: '#decrees' },
    { id: 'council', label: 'Councils', href: '#council' }
  ];

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

      <div className="fixed top-0 left-0 right-0 z-50 p-3 md:p-5 pointer-events-none">
        <div className="w-full max-w-[1536px] mx-auto pointer-events-auto">
          <Navbar
            activeSection={activeSection}
            setActiveSection={handleSetActiveSection}
            sections={sections}
            isLoggedIn={isLoggedIn}
            onLoginClick={() => setIsLoginModalOpen(true)}
            onPanelClick={() => setIsStaffPanelOpen(true)}
          />
        </div>
      </div>

      <Hero citizensCount={citizens.length} />

      <main className="max-w-[1120px] mx-auto px-gutter md:px-0 pt-12 pb-stack-lg">

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-stack-lg scroll-mt-24"
          id="chronicle"
        >
          <div className="flex flex-col items-center mb-stack-lg">
            <motion.img
              variants={fadeInUp}
              src={elysianWrIcon}
              alt="Elysian Emblem"
              className="w-16 h-16 object-contain mb-3"
            />
            <motion.h2 variants={fadeInUp} className="font-headline-md text-headline-md text-center">
              Origins of Aedes Elysiae
            </motion.h2>
          </div>
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
                status: "(Currently inactive / busy IRL)",
                image: methImage
              },
              {
                name: "__Sei",
                role: "Vice-Magistrate & First Lady",
                status: "(Currently busy IRL also)",
                image: seiImage
              },
              {
                name: "DefNotShiro",
                role: "Co-founder",
                status: "(Currently busy IRL also)",
                image: shiroImage
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
                <div className="h-64 mb-4 overflow-hidden bg-surface-dim flex items-center justify-center border border-secondary/20 relative">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {[
              { name: "seelenlied", title: "FRAU PLATIN", status: "1st Authority", icon: ironBlockIcon, size: "w-6 h-6" },
              { name: "XenomiteGD", title: "FRAU AURUM", status: "Vice-Magistrate", icon: goldIcon, size: "w-6 h-6" },
              { name: "KSMiracle", title: "FRAU DIAMANT", status: "1st Edel", icon: diamondIcon, size: "w-5 h-5" },
              { name: "ANAFFYTAFFY", title: "FRAU SAPHIR", status: "2nd Edel", icon: lapisIcon, size: "w-5 h-5" },
              { name: "KaiFloxol", title: "FRAU AMÉTHYSTE", status: "3rd Edel", icon: amethystIcon, size: "w-5 h-5" },
              { name: "Gunnerlegend", title: "FRAU RUBIN", status: "4th Edel", icon: redstoneIcon, size: "w-5 h-5" },
              { name: "Pee_Highlighter", title: "FRAU JADE", status: "5th Edel", icon: emeraldIcon, size: "w-5 h-5" }
            ].map((item) => (
              <motion.div
                key={item.name}
                variants={fadeInUp}
                whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,1)" }}
                className="flex items-center justify-between p-stack-sm border-b border-secondary/10 bg-white/40 transition-colors duration-200 cursor-default"
              >
                <div className="flex items-center gap-4">
                  <img src={item.icon} alt={item.status} className={`${item.size} object-contain flex-shrink-0`} />
                  <div>
                    <p className="font-headline-sm text-headline-sm leading-tight">{item.name}</p>
                    <p className="font-label-sm text-label-sm text-secondary">{item.title}</p>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant italic">{item.status}</span>
              </motion.div>
            ))}
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-stretch bg-surface-container-lowest p-stack-lg border border-secondary/20 soft-whisper">
            <div className="relative group overflow-hidden h-96 md:h-auto">
              <motion.img
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover"
                alt="Minecraft cozy enchanting room"
                src={journalImage}
              />
            </div>
            <div className="relative overflow-hidden flex flex-col justify-center min-h-[350px]">
              <AnimatePresence mode="wait">
                {!isJournalOpen ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-6 flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 text-center md:text-left">
                      <img src={enchantedBookIcon} alt="Enchanted Book" className="w-9 h-9 object-contain flex-shrink-0" />
                      <span>Magistrate's Journal</span>
                    </h2>
                    
                    {/* Tabs / Selector Buttons */}
                    <div className="flex flex-wrap gap-2.5 mb-6">
                      <button
                        onClick={() => setSelectedJournal('season2')}
                        className={`px-4 py-2 text-xs font-label-lg uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                          selectedJournal === 'season2'
                            ? 'bg-secondary text-white border-secondary font-semibold'
                            : 'border-secondary/20 text-secondary hover:border-secondary/55'
                        }`}
                      >
                        KRP: MCVerse Season 2
                      </button>
                      <button
                        onClick={() => setSelectedJournal('season1')}
                        className={`px-4 py-2 text-xs font-label-lg uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                          selectedJournal === 'season1'
                            ? 'bg-secondary text-white border-secondary font-semibold'
                            : 'border-secondary/20 text-secondary hover:border-secondary/55'
                        }`}
                      >
                        Kupal Community SMP Season 1
                      </button>
                    </div>

                    <p className="text-[11px] font-label-sm uppercase tracking-wider text-secondary/60 mb-3 block">
                      Date Created: {selectedJournal === 'season2' ? 'Aug 3, 2025' : 'May 5, 2026'}
                    </p>

                    <div className="space-y-4 font-body-md text-body-md text-on-surface-variant italic leading-relaxed min-h-[80px]">
                      {selectedJournal === 'season2' ? (
                        <p>
                          “Welcome to Season 2!” This document will act as my journal as I, seelenlied, play through the 2nd season of KRP: MCVerse.
                        </p>
                      ) : (
                        <p>
                          “Welcome! To a fresh start, to a brand new world!” New name, new world, same community, same map. This document shall act as my journal as I, seelenlied, play through the 1st season of the Kupal Community SMP.
                        </p>
                      )}
                    </div>
                    
                    <motion.button
                      whileHover={{ x: 6 }}
                      onClick={() => setIsJournalOpen(true)}
                      className="mt-8 font-label-lg text-label-lg text-secondary flex items-center gap-2 transition-transform cursor-pointer font-semibold"
                    >
                      Read full entries <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="full"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="relative flex flex-col h-full w-full"
                  >
                    {/* Fixed Close Button */}
                    <button
                      onClick={() => setIsJournalOpen(false)}
                      className="absolute top-0 right-6 z-30 bg-[#1C1C1C] hover:bg-[#2A2A2A] text-white p-2 cursor-pointer transition-all duration-200 rounded-full shadow-md border border-black/10 flex items-center justify-center"
                      aria-label="Close Journal"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex flex-col h-full max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                      <div className="mb-4 border-b border-secondary/15 pb-2 pr-24">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                          {selectedJournal === 'season2' ? 'KRP: MCVerse Season 2' : 'Kupal Community SMP Season 1'}
                        </h3>
                        <p className="font-label-sm text-label-sm text-secondary">Magistrate seelenlied's Journal</p>
                      </div>
                      
                      {selectedJournal === 'season2' ? (
                        <div className="space-y-6 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                          <div>
                            <p className="font-semibold text-on-surface italic text-base mb-2">“Welcome to Season 2!”</p>
                            <p className="italic">This document will act as my journal as I, seelenlied, play through the 2nd season of KRP: MCVerse.</p>
                          </div>

                          <div className="border-l-2 border-secondary/25 pl-4 py-1">
                            <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-2">The New Team: Ave Stellaris</p>
                            <p className="font-semibold mb-2">Members:</p>
                            <ul className="list-disc pl-4 space-y-1 mb-3">
                              <li>Milkhype235 (leader)</li>
                              <li>XenomiteGD</li>
                              <li>PosViriSerb</li>
                              <li>__Hikaruu</li>
                              <li>godOFrobs</li>
                              <li>RissMov</li>
                              <li>NewForm</li>
                              <li>seelenlied</li>
                              <li>Pee_Highlighter</li>
                            </ul>
                            <p className="italic mb-2">“Ave Stellaris” meaning “hail the stars”. We are the celestial voyagers, the Herrschers, situated in Samar as our homebase.</p>
                            <p className="mb-2"><span className="font-medium text-on-surface">Our motto:</span> “Hail to our song, hail to the stars, for we are born to inherit the universe.”</p>
                            <p className="mb-3">
                              <span className="font-medium text-on-surface">Theme song:</span>{' '}
                              <a href="https://youtu.be/cXiYaB50O0k" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline break-all">
                                https://youtu.be/cXiYaB50O0k
                              </a>
                            </p>
                            <div className="text-[11px] grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-secondary/10">
                              <div><span className="font-medium">Milkhype:</span> Queen of the Herrschers</div>
                              <div><span className="font-medium">Xenomite:</span> Sentinel Herrscher</div>
                              <div><span className="font-medium">PosViriSerb:</span> Herrscher of Kleptomancy</div>
                              <div><span className="font-medium">Frobs:</span> Herrscher of Serenity</div>
                              <div><span className="font-medium">Hikaruu:</span> Herrscher of Wealth</div>
                              <div><span className="font-medium">RissMov:</span> Herrscher of Solitude</div>
                              <div><span className="font-medium">NewForm:</span> Herrscher of the Ancients</div>
                              <div><span className="font-medium">Seelenlied:</span> Herrscher of The Void</div>
                              <div><span className="font-medium">Pee_Highlighter:</span> Nameless Herrscher</div>
                            </div>
                          </div>

                          <div className="space-y-4 pt-2 border-t border-secondary/10">
                            <div>
                              <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">August 6 2025 - Griefing Incident</p>
                              <p className="mt-1">
                                Our base became subject to a grief by unknown players. Our current hypothesis is that these players are using alt accounts since Samar is a huge island and they have to be people who know us or people who have played since season 1 to target our base specifically. The admins; Rhongobongoooo (former Deepslate leader), Expo, DerukaA, Ringo, and Koshi launched a brief investigation to find the culprits and promptly ban them. What makes this whole situation all the more confusing is why they’d target us in the first place? RissMov’s house was untouched so the griefers probably never saw it. We salvaged whatever we could then moved to Hikaru’s suggested location and are now recuperating our losses.
                              </p>
                            </div>

                            <div>
                              <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">August 7 2025 - Trial Chamber</p>
                              <p className="mt-1">
                                Xeno found a trial chamber right underneath our new base therefore we both decided to check it out. He found a Sharpness V enchanted book and we also got a few bad omen potions. Xeno immediately drank one of his and we died of being overwhelmed by zombies (also because of the server tick rate dipping due to the amount of players online at this point). We had to get Hikaru to come help us get our stuff back.
                              </p>
                            </div>

                            <div>
                              <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">August 8 - 9 - Uneventful</p>
                              <p className="mt-1">
                                Not much these days other than the fact that we received a new member: Pee_Highlighter. He shall henceforth be known as the Nameless Herrscher.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                          <div>
                            <p className="font-semibold text-on-surface italic text-base mb-2">“Welcome! To a fresh start, to a brand new world!”</p>
                            <p className="italic">New name, new world, same community, same map. This document shall act as my journal as I, seelenlied, play through the 1st season of the Kupal Community SMP.</p>
                          </div>

                          <div>
                            <p className="mt-1">
                              From KRP MCVerse Season 2 Chapter 2, a coalition was born between the players of Ynares Compound and the remnants of Ave Stellaris; this new coalition had no name until Season 3 where it was called Aedes Elysiae. From then on, this faction of ours has bore this name.
                            </p>
                          </div>

                          <div className="border-l-2 border-secondary/25 pl-4 py-1 space-y-2">
                            <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">Founders</p>
                            <ul className="list-disc pl-4 space-y-1">
                              <li><span className="font-medium text-on-surface">__Meth</span> - Current Magistrate (inactive/busy irl)</li>
                              <li><span className="font-medium text-on-surface">__Sei</span> - Current Vice-Magistrate and First Lady (busy irl also)</li>
                              <li><span className="font-medium text-on-surface">DefNotShiro</span> - Co-founder (busy irl also)</li>
                            </ul>
                            <p className="italic">
                              Due to the founding trio being busy irl, Meth and Sei appointed me as Standing Magistrate to take charge during their absence. They have also appointed XenomiteGD as Standing Vice-Magistrate to help me. Below is Sei’s decree, affirming our positions.
                            </p>
                          </div>

                          <div className="bg-surface-variant/40 border border-secondary/15 p-4 rounded italic space-y-2">
                            <p>“I hereby decree seelenlied the acting founder of Elysiae (former Ynares) starting now and until further notice.</p>
                            <p>All decisions and questions regarding Elysiae shall now be under his concern</p>
                            <p>Furthermore, As Elysiae wasn’t built alone, but with the friends and hard-work everyone has put in. Our new Founder will need assistance,</p>
                            <p>Acting Co-Founder shall now be XenomiteGD. replacing __Meth</p>
                            <p className="font-semibold text-secondary">People of Elysiae, Our story has only begun! The memories live in the people of Elysiae, Long Live Elysia!”</p>
                            <p className="text-right font-label-sm text-label-sm text-secondary not-italic">— __Sei (former Elysiae Founder)</p>
                          </div>

                          <div className="space-y-2">
                            <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">Members</p>
                            <div className="flex flex-wrap gap-1.5 text-[11px]">
                              {citizens.map((citizen) => (
                                <span key={citizen} className="bg-surface-container-low px-2 py-0.5 border border-secondary/5 rounded">
                                  {citizen}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4 pt-2 border-t border-secondary/10">
                            <div>
                              <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">Establishment of the Council</p>
                              <p className="mt-1">
                                For my first act as Standing Magistrate, I have decided to establish a council for advisors to aid and guide me in this endeavor.
                              </p>
                              <p className="mt-2">
                                The Hoshigumi Council is the advisory council of Aedes Elysiae consisting of five individuals, these individuals are referred to as Edels (nobles). They are to support the current Standing Magistrate during his tenure as ruler of Aedes Elysiae.
                              </p>
                              <ul className="list-decimal pl-5 mt-2 space-y-1">
                                <li>1st Edel - KSMiracle (SaintSteins)</li>
                                <li>2nd Edel - ANAFFYTAFFY</li>
                                <li>3rd Edel - KaiFloxol</li>
                                <li>4th Edel - Gunnerlegend</li>
                                <li>5th Edel - Pee_Highlighter</li>
                              </ul>
                            </div>

                            <div className="pt-2 border-t border-secondary/10">
                              <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-semibold">Aristocratic Titles</p>
                              <p className="mt-1 mb-2">
                                Each Edel is the recipient of an aristocratic title which expresses their standing, authority, and responsibility, as is myself and my Vice-Magistrate.
                              </p>
                              <div className="space-y-2 text-xs">
                                <div>
                                  <span className="font-semibold text-on-surface">Frau Platin</span> - seelenlied
                                  <p className="text-on-surface-variant/80 italic pl-4">(Platinum denotes the Magistrate as holding the first and highest authority in the order)</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-on-surface">Frau Aurum</span> - XenomiteGD
                                  <p className="text-on-surface-variant/80 italic pl-4">(Gold denotes the Vice-Magistrate)</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-on-surface">Frau Diamant</span> - KSMiracle
                                  <p className="text-on-surface-variant/80 italic pl-4">(Diamond denotes the 1st Edel)</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-on-surface">Frau Saphir</span> - ANAFFYTAFFY
                                  <p className="text-on-surface-variant/80 italic pl-4">(Sapphire denotes the 2nd Edel)</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-on-surface">Frau Améthyste</span> - KaiFloxol
                                  <p className="text-on-surface-variant/80 italic pl-4">(Amethyst denotes the 3rd Edel)</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-on-surface">Frau Rubin</span> - Gunnerlegend
                                  <p className="text-on-surface-variant/80 italic pl-4">(Ruby denotes the 4th Edel)</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-on-surface">Frau Jade</span> - Pee_Highlighter
                                  <p className="text-on-surface-variant/80 italic pl-4">(Jade denotes the 5th Edel)</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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

      {/* Staff Authentication & Portal Components */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={() => {
              setIsLoggedIn(true);
              setIsStaffPanelOpen(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isStaffPanelOpen && (
          <StaffPanel
            isOpen={isStaffPanelOpen}
            onClose={() => setIsStaffPanelOpen(false)}
            onLogout={handleLogout}
            citizens={citizens}
            onCitizenAdded={handleCitizenAdded}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
