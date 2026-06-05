import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function BottomLeftCard({ count }: { count: number }) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="absolute bottom-28 right-4 left-auto md:left-6 md:right-auto md:bottom-6 lg:bottom-10 lg:left-10 p-3 md:p-4 lg:p-5 rounded-[1.2rem] md:rounded-[1.5rem] lg:rounded-[2.2rem] bg-black/45 backdrop-blur-xl border border-white/10 flex flex-col gap-2 lg:gap-3 min-w-[140px] md:min-w-[150px] lg:min-w-[180px] w-fit font-helvetica select-none shadow-lg"
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 md:gap-2">
          <Users className="w-5 h-5 md:w-6 md:h-6 text-[#FAF6F0]" />
          <span className="text-2xl md:text-3xl font-normal text-[#FAF6F0] tracking-tight">
            {count}
          </span>
        </div>
        <span className="text-[10px] md:text-[12px] font-normal text-[#EAE0D5]/70 uppercase tracking-wider">
          Active Citizens
        </span>
      </div>
    </motion.div>
  );
}
