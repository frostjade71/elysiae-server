import { motion } from 'framer-motion';
import blockIcon from '../assets/icons/35549-block-mini-minecraft.png';

export default function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col md:flex-row items-center gap-2 md:gap-2.5 mb-4 select-none font-helvetica justify-center text-center"
    >
      <img
        src={blockIcon}
        alt="Minecraft Block"
        className="w-8 h-8 object-contain flex-shrink-0"
      />
      <span className="font-label-lg text-[12px] text-[#EAE0D5] uppercase tracking-[0.2em] block">
        From the Kupal Community SMP
      </span>
    </motion.div>
  );
}
