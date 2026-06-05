import { motion } from 'framer-motion';
import HeroBadge from './HeroBadge';
import BottomLeftCard from './BottomLeftCard';
import BottomRightCorner from './BottomRightCorner';
import heroImage from '../assets/images/newherobg.png';

export default function Hero() {
  return (
    <div id="home" className="w-full h-screen flex items-center justify-center p-0 md:p-5 bg-[#f0f0f0]">
      <section className="relative w-full max-w-[1536px] h-full rounded-none md:rounded-[3rem] overflow-hidden shadow-none flex flex-col items-center bg-white/10 group">
        {/* The Image Background */}
        <img
          src={heroImage}
          alt="Elysian Nation Background"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40 z-[1]" />
        {/* Slight black fade at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/70 to-transparent z-[1] pointer-events-none" />

        {/* The Content Layer */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-start pb-24 md:pb-6 lg:pb-10">
          {/* Text Container */}
          <div className="w-full flex flex-col items-center my-auto -translate-y-20 md:translate-y-0 md:my-0 pt-0 md:pt-36 px-6 text-center max-w-4xl mx-auto z-10">
            <HeroBadge />
            <motion.h1
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[80px] font-normal text-[#FAF6F0] mb-3 tracking-tight leading-[1.05] font-serif drop-shadow-md"
            >
              Aedes Elysiae
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg text-[#EAE0D5] leading-relaxed max-w-2xl font-normal font-sans drop-shadow-sm"
            >
              An Elysian Nation of the Kupal Community SMP. Carry the noble legacy of Ynares Compound and Ave Stellaris.
            </motion.p>
          </div>

          {/* Bottom Overlays */}
          <BottomLeftCard />
          <BottomRightCorner />
        </div>
      </section>
    </div>
  );
}
