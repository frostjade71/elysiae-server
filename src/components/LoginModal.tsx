import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import { loginStaff } from '../firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const staffUser = await loginStaff(email, password);
      onLoginSuccess(staffUser);
      onClose();
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError("Kupal kba? Hindi ka admin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-[#FAF9F7]/95 border border-[#1C1C1C]/10 w-full max-w-md p-8 rounded-[1.8rem] shadow-2xl relative z-10 font-sans"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#1C1C1C]/50 hover:text-[#1C1C1C] transition-colors p-1.5 hover:bg-[#1C1C1C]/5 rounded-full cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-[10px] tracking-widest text-[#727270] uppercase font-bold block mb-1">
            Access Portal
          </span>
          <h2 className="text-2xl font-normal font-serif text-[#1C1C1C]">
            Staff Panel
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1C1C]/70 mb-1.5 uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C1C1C]/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#ECEBE7]/50 border border-[#1C1C1C]/10 rounded-full pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#333333] transition-colors font-medium text-[#1C1C1C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1C1C]/70 mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C1C1C]/40" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#ECEBE7]/50 border border-[#1C1C1C]/10 rounded-full pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:border-[#333333] transition-colors font-medium text-[#1C1C1C]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1C1C1C]/40 hover:text-[#1C1C1C] transition-colors cursor-pointer flex items-center justify-center"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-full text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-[#1C1C1C] hover:bg-[#333333] text-white py-3 rounded-full font-medium text-sm transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Authenticating...
              </>
            ) : (
              'Enter Panel'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
