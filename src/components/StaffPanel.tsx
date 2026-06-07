import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard, Users, UserPlus, LogOut, CheckCircle2, User, Loader2, Trash2, Pencil, Check, GripVertical, Newspaper, BookOpen } from 'lucide-react';
import { addCitizen, deleteCitizen, updateCitizen, subscribeToActivityLogs, updateCitizensOrder, clearActivityLogs } from '../firebase';

interface StaffPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  citizens: string[];
  onCitizenAdded: () => void;
}

export default function StaffPanel({ isOpen, onClose, onLogout, citizens, onCitizenAdded }: StaffPanelProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'members'>('dashboard');
  const [newMemberName, setNewMemberName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingName, setDeletingName] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState<string>('');
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [activityLogs, setActivityLogs] = useState<Array<{ action: string; timestamp: string }>>([]);
  const [isClearingLogs, setIsClearingLogs] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Subscribe to real-time activity logs
  useEffect(() => {
    const unsubscribe = subscribeToActivityLogs(setActivityLogs);
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const name = newMemberName.trim();

    if (!name) {
      setErrorMsg('Member name is required.');
      return;
    }

    if (citizens.includes(name)) {
      setErrorMsg('This member is already registered.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await addCitizen(name);
      if (success) {
        setSuccessMsg(`"${name}" was successfully registered!`);
        setNewMemberName('');
        onCitizenAdded();
        // Clear message after 3 seconds
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg('Failed to save member.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from Aedes Elysiae?`)) {
      setDeletingName(name);
      setErrorMsg('');
      setSuccessMsg('');
      try {
        const success = await deleteCitizen(name);
        if (success) {
          setSuccessMsg(`"${name}" was successfully removed.`);
          onCitizenAdded();
          setTimeout(() => setSuccessMsg(''), 3000);
        } else {
          setErrorMsg(`Failed to remove "${name}".`);
        }
      } catch (e: any) {
        setErrorMsg(e.message || 'An error occurred.');
      } finally {
        setDeletingName(null);
      }
    }
  };

  const handleClearLogs = async () => {
    if (window.confirm("Are you sure you want to delete all activity logs from the database? This cannot be undone.")) {
      setIsClearingLogs(true);
      setErrorMsg('');
      setSuccessMsg('');
      try {
        const success = await clearActivityLogs();
        if (success) {
          setSuccessMsg('All activity logs have been cleared.');
          setTimeout(() => setSuccessMsg(''), 3000);
        } else {
          setErrorMsg('Failed to clear activity logs.');
        }
      } catch (e: any) {
        setErrorMsg(e.message || 'An error occurred while clearing logs.');
      } finally {
        setIsClearingLogs(false);
      }
    }
  };

  const startEdit = (name: string) => {
    setEditingName(name);
    setEditedValue(name);
  };

  const handleSaveEdit = async (oldName: string) => {
    const newName = editedValue.trim();
    if (!newName) {
      setErrorMsg('Name cannot be empty.');
      return;
    }
    if (newName === oldName) {
      setEditingName(null);
      return;
    }
    if (citizens.includes(newName)) {
      setErrorMsg('This name is already registered.');
      return;
    }

    setIsSubmittingUpdate(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const success = await updateCitizen(oldName, newName);
      if (success) {
        setSuccessMsg(`"${oldName}" was renamed to "${newName}".`);
        onCitizenAdded();
        setEditingName(null);
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg('Failed to update name.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'An error occurred during update.');
    } finally {
      setIsSubmittingUpdate(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (editingName !== null) {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const reordered = [...citizens];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, draggedItem);

    try {
      await updateCitizensOrder(reordered);
      onCitizenAdded();
    } catch (err) {
      console.error("Failed to update citizens order:", err);
    } finally {
      setDraggedIndex(null);
      setDragOverIndex(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* Main Panel Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-[#FAF9F7] border border-[#1C1C1C]/10 w-full max-w-4xl h-[90vh] md:h-[650px] rounded-[1.8rem] shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 font-sans"
      >
        {/* Close button for mobile/overall */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#1C1C1C]/50 hover:text-[#1C1C1C] transition-colors p-1.5 hover:bg-[#1C1C1C]/5 rounded-full cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-full md:w-64 bg-[#ECEBE7] border-r border-[#1C1C1C]/10 p-6 flex flex-col justify-between">
          <div>
            <div className="mb-8">
              <span className="text-[9px] tracking-widest text-[#727270] uppercase font-bold block mb-1">
                Elysian Administration
              </span>
              <h2 className="text-xl font-normal font-serif text-[#1C1C1C]">
                Staff Panel
              </h2>
            </div>

            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-[#1C1C1C] text-[#FAF6F0]'
                      : 'text-[#1C1C1C]/75 hover:bg-black/5'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'members'
                      ? 'bg-[#1C1C1C] text-[#FAF6F0]'
                      : 'text-[#1C1C1C]/75 hover:bg-black/5'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Members
                </button>
              </li>
              <li>
                <div
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#1C1C1C]/40 cursor-not-allowed select-none"
                  title="Coming Soon"
                >
                  <div className="flex items-center gap-3">
                    <Newspaper className="w-4 h-4" />
                    Decree
                  </div>
                  <span className="bg-[#1C1C1C]/5 border border-[#1C1C1C]/10 text-[9px] text-[#727270] px-2 py-0.5 rounded-full lowercase font-medium tracking-normal">
                    soon
                  </span>
                </div>
              </li>
              <li>
                <div
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#1C1C1C]/40 cursor-not-allowed select-none"
                  title="Coming Soon"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4" />
                    Journal
                  </div>
                  <span className="bg-[#1C1C1C]/5 border border-[#1C1C1C]/10 text-[9px] text-[#727270] px-2 py-0.5 rounded-full lowercase font-medium tracking-normal">
                    soon
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-[#1C1C1C]/10">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100/50 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-white/40">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-normal font-serif text-[#1C1C1C] mb-1">
                    System Overview
                  </h3>
                  <p className="text-xs text-[#727270]">
                    Current citizenship statistics and state records of Elysiae.
                  </p>
                </div>

                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2.5 rounded-xl"
                  >
                    {successMsg}
                  </motion.div>
                )}

                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl"
                  >
                    {errorMsg}
                  </motion.div>
                )}

                {/* Big Stat Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#FAF9F7] border border-[#1C1C1C]/5 p-6 rounded-2xl flex flex-col justify-between h-36">
                    <span className="text-[10px] uppercase tracking-wider text-[#727270] font-semibold">
                      Active Citizens
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-light font-serif text-[#1C1C1C]">
                        {citizens.length}
                      </span>
                      <span className="text-xs text-[#727270] font-semibold">
                        Registered
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FAF9F7] border border-[#1C1C1C]/5 p-6 rounded-2xl flex flex-col justify-between h-36">
                    <span className="text-[10px] uppercase tracking-wider text-[#727270] font-semibold">
                      System Status
                    </span>
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      Database Online
                    </div>
                    <span className="text-[10px] text-[#727270] italic">
                      Synchronized with Google Firebase
                    </span>
                  </div>
                </div>

                <div className="bg-[#FAF9F7] border border-[#1C1C1C]/5 p-5 rounded-2xl">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1C1C]">
                      Recent Activity Logs
                    </h4>
                    {activityLogs.length > 0 && (
                      <button
                        onClick={handleClearLogs}
                        disabled={isClearingLogs}
                        className="text-[#1C1C1C]/40 hover:text-red-600 transition-colors p-1 rounded-md cursor-pointer hover:bg-red-50 disabled:opacity-50"
                        title="Clear all logs"
                      >
                        {isClearingLogs ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                  {activityLogs.length === 0 ? (
                    <p className="text-xs text-[#727270] italic">No recent activity logs found.</p>
                  ) : (
                    <ul className="space-y-2.5 text-xs text-[#727270] max-h-48 overflow-y-auto pr-1">
                      {activityLogs.map((log, index) => (
                        <li key={index} className="flex justify-between items-center border-b border-black/5 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>{log.action}</span>
                          </div>
                          <span className="text-[10px] text-[#727270]/60 font-medium ml-2 flex-shrink-0">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="members"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-normal font-serif text-[#1C1C1C] mb-1">
                    Manage Citizens
                  </h3>
                  <p className="text-xs text-[#727270]">
                    Register new members to Aedes Elysiae and update the global records.
                  </p>
                </div>

                {/* Add Citizen Form */}
                <form onSubmit={handleAddMember} className="bg-[#FAF9F7] border border-[#1C1C1C]/5 p-6 rounded-2xl space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Register New Citizen
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1C1C1C]/40" />
                      <input
                        type="text"
                        placeholder="Citizen Name (e.g., __kupal69)"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="w-full bg-[#ECEBE7]/50 border border-[#1C1C1C]/10 rounded-full pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#333] font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#1C1C1C] hover:bg-[#333] text-white text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full cursor-pointer flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Member'
                      )}
                    </button>
                  </div>

                  {successMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full"
                    >
                      {successMsg}
                    </motion.div>
                  )}

                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 px-4 py-2 rounded-full"
                    >
                      {errorMsg}
                    </motion.div>
                  )}
                </form>

                {/* Directory / List */}
                <div className="bg-[#FAF9F7] border border-[#1C1C1C]/5 p-6 rounded-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1C1C]">
                      Current Directory ({citizens.length} Citizens)
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-2">
                    {citizens.map((citizen, idx) => {
                      const isEditingThis = editingName === citizen;
                      const isBeingDragged = draggedIndex === idx;
                      const isHoveredOver = dragOverIndex === idx;
                      return (
                        <div
                          key={idx}
                          draggable={!isEditingThis}
                          onDragStart={(e) => handleDragStart(e, idx)}
                          onDragOver={(e) => handleDragOver(e, idx)}
                          onDragEnd={handleDragEnd}
                          onDrop={(e) => handleDrop(e, idx)}
                          className={`bg-white border px-3 py-2 text-xs font-medium text-[#1C1C1C] rounded-lg flex items-center justify-between shadow-xs group/item transition-all duration-200 ${
                            isBeingDragged ? 'opacity-40 border-dashed border-[#1C1C1C]/40' : 'border-[#1C1C1C]/5'
                          } ${
                            isHoveredOver ? 'border-emerald-500 border bg-emerald-50/10 scale-102' : ''
                          } ${
                            !isEditingThis ? 'cursor-grab active:cursor-grabbing' : ''
                          }`}
                        >
                          {isEditingThis ? (
                            <input
                              type="text"
                              value={editedValue}
                              onChange={(e) => setEditedValue(e.target.value)}
                              className="bg-[#ECEBE7]/50 border border-[#1C1C1C]/20 rounded-md px-1.5 py-0.5 text-xs font-medium focus:outline-none focus:border-[#333] w-full mr-2"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(citizen);
                                if (e.key === 'Escape') setEditingName(null);
                              }}
                              autoFocus
                            />
                          ) : (
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <GripVertical className="w-3.5 h-3.5 text-[#1C1C1C]/20 cursor-grab flex-shrink-0 group-hover/item:text-[#1C1C1C]/40 transition-colors" />
                              <span className="truncate">{citizen}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-0.5">
                            {isEditingThis ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSaveEdit(citizen)}
                                  disabled={isSubmittingUpdate}
                                  className="text-emerald-600 hover:bg-emerald-50 p-1 rounded-md cursor-pointer disabled:opacity-50"
                                  title="Save Changes"
                                >
                                  {isSubmittingUpdate ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingName(null)}
                                  disabled={isSubmittingUpdate}
                                  className="text-red-500 hover:bg-red-50 p-1 rounded-md cursor-pointer disabled:opacity-50"
                                  title="Cancel"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEdit(citizen)}
                                  className="text-[#1C1C1C]/30 hover:text-[#333] transition-colors p-1 rounded-md cursor-pointer hover:bg-gray-100 mr-0.5"
                                  title={`Edit ${citizen}`}
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMember(citizen)}
                                  disabled={deletingName !== null}
                                  className="text-[#1C1C1C]/30 hover:text-red-600 transition-colors p-1 rounded-md cursor-pointer hover:bg-red-50 disabled:opacity-50"
                                  title={`Remove ${citizen}`}
                                >
                                  {deletingName === citizen ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
