import React, { useState, useRef, useEffect } from 'react';
import { useUtsav } from '../context/UtsavContext';
import {
  Calendar,
  Sparkles,
  Copy,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  History,
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertCircle,
  ChevronRight,
  GripHorizontal,
} from 'lucide-react';

export const FestivalYearFloatingWidget: React.FC = () => {
  const {
    activeYear,
    availableYears,
    switchYear,
    copyToNextYear,
    deleteYear,
    isCurrentYearArchived,
    allYearsInfo,
    balanceAmount,
    isAdmin,
    isSuperAdmin,
    language,
  } = useUtsav();

  const isTe = language === 'te';

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [carryBalance, setCarryBalance] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Dragging state
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });
  const hasMovedRef = useRef(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Next year calculation
  const maxYear = availableYears.length > 0 ? Math.max(...availableYears) : 2026;
  const nextTargetYear = maxYear + 1;

  // Initialize position to bottom-right on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !position) {
      const defaultX = Math.max(16, window.innerWidth - 220);
      const defaultY = Math.max(80, window.innerHeight - 100);
      setPosition({ x: defaultX, y: defaultY });
    }
  }, [position]);

  // Mouse / Touch drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag with primary pointer
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    hasMovedRef.current = false;
    setIsDragging(true);

    const currentX = position?.x ?? (window.innerWidth - 220);
    const currentY = position?.y ?? (window.innerHeight - 100);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: currentX,
      initY: currentY,
    };

    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      hasMovedRef.current = true;
    }

    const maxX = window.innerWidth - (buttonRef.current?.offsetWidth || 200) - 10;
    const maxY = window.innerHeight - (buttonRef.current?.offsetHeight || 60) - 10;

    const newX = Math.min(Math.max(10, dragStartRef.current.initX + deltaX), maxX);
    const newY = Math.min(Math.max(60, dragStartRef.current.initY + deltaY), maxY);

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    // If it was just a click (no significant movement), toggle modal
    if (!hasMovedRef.current) {
      setIsOpen(true);
    }
  };

  const handleLaunchNextYear = () => {
    const createdYear = copyToNextYear(carryBalance);
    setNotification(
      isTe
        ? `🎉 ${createdYear} ఉత్సవం విజయవంతంగా సృష్టించబడింది! రశీదులు REC-001 నుండి తాజాగా ప్రారంభమయ్యాయి.`
        : `🎉 ${createdYear} Edition created successfully! Receipts start fresh from REC-001.`
    );
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <>
      {/* Draggable Floating Button */}
      <div
        ref={buttonRef}
        id="festival-year-floating-btn"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: 'fixed',
          left: position ? `${position.x}px` : undefined,
          top: position ? `${position.y}px` : undefined,
          bottom: !position ? '24px' : undefined,
          right: !position ? '20px' : undefined,
          touchAction: 'none',
        }}
        className={`z-40 cursor-grab active:cursor-grabbing select-none transition-shadow ${
          isDragging ? 'scale-105 opacity-90 shadow-2xl' : 'shadow-xl'
        }`}
        title={isTe ? 'ఉత్సవ సంవత్సరం మార్చండి / నూతన కాపీ' : 'Switch Festival Year / Copy Next Year'}
      >
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-3.5 py-2.5 rounded-full border-2 border-amber-300/80 backdrop-blur-md hover:border-amber-200 transition-all hover:scale-102">
          {/* Ganesh Icon / Calendar Sparkle */}
          <div className="w-7 h-7 rounded-full bg-amber-900/80 border border-amber-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>

          <div className="text-left flex flex-col leading-tight">
            <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {isTe ? 'ఉత్సవ సంవత్సరం' : 'Festival Year'}
            </span>
            <div className="flex items-center gap-1.5 font-extrabold text-xs sm:text-sm text-white">
              <span>{activeYear}</span>
              {availableYears.length > 1 && (
                <span className="text-[10px] bg-amber-950/80 text-amber-300 px-1.5 py-0.2 rounded-full border border-amber-500/40">
                  {availableYears.join(' ⇄ ')}
                </span>
              )}
            </div>
          </div>

          {/* Drag grip icon */}
          <GripHorizontal className="w-3.5 h-3.5 text-amber-300/70 ml-1" />
        </div>
      </div>

      {/* Festival Year & 1-Click Copy Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-stone-900 text-stone-100 w-full max-w-xl rounded-3xl shadow-2xl border border-amber-500/40 overflow-hidden my-6">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-800 via-orange-700 to-amber-900 p-5 sm:p-6 border-b border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-300 flex items-center justify-center text-amber-300 shadow-md">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <span>{isTe ? 'వినాయక ఉత్సవ సంవత్సరాలు' : 'Festival Years Archive'}</span>
                    <span className="text-xs bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full font-extrabold">
                      {activeYear}
                    </span>
                  </h2>
                  <p className="text-xs text-amber-200">
                    {isTe
                      ? 'గత సంవత్సర రికార్డులను చూడండి లేదా 1-క్లిక్‌తో వచ్చే ఏడాదికి సైట్ కాపీ చేయండి'
                      : 'View past archives or 1-click copy to next festival edition'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Banner */}
            {notification && (
              <div className="bg-emerald-900/90 border-b border-emerald-500/50 p-3.5 text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                <span>{notification}</span>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Archived Notice if currently in an archived year */}
              {isCurrentYearArchived && (
                <div className="bg-amber-950/70 border border-amber-500/50 rounded-2xl p-4 flex items-start gap-3 text-amber-200 text-xs">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-amber-300">
                      {isTe
                        ? `గమనిక: మీరు ప్రస్తుతం ${activeYear} ఉత్సవ ఆర్కైవ్ రికార్డులను చూస్తున్నారు.`
                        : `Notice: You are viewing ${activeYear} archived records.`}
                    </p>
                    <p className="text-amber-200/80">
                      {isTe
                        ? `కొత్త రశీదులు లేదా ప్రస్తుత ఉత్సవం కోసం తాజా ${maxYear} ఉత్సవానికి మారండి.`
                        : `To issue current receipts or expenses, please switch to the latest ${maxYear} edition.`}
                    </p>
                    <button
                      onClick={() => switchYear(maxYear)}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-lg text-xs transition-colors"
                    >
                      <span>{isTe ? `తాజా ${maxYear} ఉత్సవానికి మారండి` : `Switch to latest ${maxYear}`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* 1. Quick Year Switcher Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-4 h-4" />
                    <span>{isTe ? 'లభ్యమైన ఉత్సవ సంవత్సరాలు' : 'Available Festival Years'}</span>
                  </label>
                  <span className="text-[11px] text-stone-400">
                    {isTe ? 'క్లిక్ చేసి సంవత్సరాన్ని ఎంచుకోండి' : 'Click year to switch view'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allYearsInfo.map((yrInfo) => {
                    const isActive = yrInfo.year === activeYear;
                    return (
                      <div
                        key={yrInfo.year}
                        onClick={() => switchYear(yrInfo.year)}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all relative overflow-hidden ${
                          isActive
                            ? 'bg-gradient-to-br from-amber-950/80 via-stone-900 to-amber-900/60 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                            : 'bg-stone-800/60 hover:bg-stone-800 border-stone-700/80 hover:border-stone-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-extrabold text-white">
                              {yrInfo.year}
                            </span>
                            {isActive ? (
                              <span className="text-[10px] bg-amber-400 text-amber-950 font-bold px-2 py-0.5 rounded-full">
                                {isTe ? 'ప్రస్తుతం చూస్తున్నారు' : 'Active'}
                              </span>
                            ) : (
                              <span className="text-[10px] bg-stone-700 text-stone-300 px-2 py-0.5 rounded-full">
                                {yrInfo.isArchived ? (isTe ? 'ఆర్కైవ్' : 'Archived') : (isTe ? 'తాజా' : 'Latest')}
                              </span>
                            )}
                          </div>

                          {/* Delete testing year (only if super admin, more than 1 year, and not active) */}
                          {isSuperAdmin && availableYears.length > 1 && !isActive && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (
                                  confirm(
                                    isTe
                                      ? `ఖచ్చితంగా ${yrInfo.year} ఉత్సవ రికార్డులను తొలగించాలనుకుంటున్నారా?`
                                      : `Are you sure you want to delete records for ${yrInfo.year}?`
                                  )
                                ) {
                                  deleteYear(yrInfo.year);
                                }
                              }}
                              className="p-1 rounded-md text-stone-500 hover:text-rose-400 hover:bg-stone-700/60 transition-colors"
                              title="Delete Year"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Financial summary for that year */}
                        <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-stone-700/50">
                          <div>
                            <span className="text-[10px] text-stone-400 block">{isTe ? 'చందాలు' : 'Income'}</span>
                            <span className="font-semibold text-emerald-400">
                              {formatCurrency(yrInfo.totalCollections)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block">{isTe ? 'ఖర్చులు' : 'Expenses'}</span>
                            <span className="font-semibold text-rose-400">
                              {formatCurrency(yrInfo.totalExpenses)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block">{isTe ? 'మిగులు' : 'Balance'}</span>
                            <span className={`font-bold ${yrInfo.balance >= 0 ? 'text-amber-300' : 'text-rose-300'}`}>
                              {formatCurrency(yrInfo.balance)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Admin 1-Click Copy to Next Year Action */}
              <div className="bg-gradient-to-br from-stone-800 via-stone-850 to-stone-900 border-2 border-amber-500/60 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isTe ? 'అడ్మిన్ వన్-క్లిక్ నూతన కాపీ' : 'Admin 1-Click Copy'}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {isTe
                        ? `వచ్చే ఏడాది (${nextTargetYear}) ఉత్సవాన్ని ప్రారంభించండి`
                        : `Start Next Year (${nextTargetYear}) Festival`}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      {nextTargetYear}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  {isTe
                    ? `ఒక్క బటన్ క్లిక్‌తో ప్రస్తుత సైట్ శీర్షికలు, మండపం వేదిక, కమిటీ అడ్మిన్లు, స్పాన్సర్లు, కేటగిరీలు అన్నీ ${nextTargetYear} కి కాపీ అవుతాయి. రశీదులు REC-001 నుండి, ఖర్చులు VOU-01 నుండి తాజాగా (#1) ప్రారంభమవుతాయి!`
                    : `In 1-click, all mandapam setup, organizers, committee admins, dynamic categories, and sponsors are duplicated into ${nextTargetYear}. Receipts start fresh from REC-001!`}
                </p>

                {/* Carry forward balance toggle */}
                <label className="flex items-center gap-3 p-3 rounded-xl bg-stone-950/60 border border-stone-700/80 cursor-pointer hover:border-amber-500/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={carryBalance}
                    onChange={(e) => setCarryBalance(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded border-stone-600 focus:ring-amber-500 focus:ring-offset-stone-900 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-stone-200 block">
                      {isTe
                        ? `${activeYear} ముగింపు మిగులు నిల్వ (${formatCurrency(balanceAmount)}) ను ప్రారంభ నిధిగా బదిలీ చేయండి`
                        : `Carry forward ${activeYear} balance (${formatCurrency(balanceAmount)}) to Opening Fund`}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {isTe
                        ? `ఇది ఆటోమేటిక్‌గా ${nextTargetYear} లో REC-001 గా ఓపెనింగ్ బ్యాలెన్స్ రికార్డును చేరుస్తుంది.`
                        : `Automatically creates REC-001 as Opening Balance in ${nextTargetYear}.`}
                    </span>
                  </div>
                </label>

                {/* Launch Button */}
                <button
                  type="button"
                  onClick={handleLaunchNextYear}
                  className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm sm:text-base shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Copy className="w-5 h-5" />
                  <span>
                    {isTe
                      ? `✨ ${nextTargetYear} ఉత్సవాన్ని సృష్టించి ప్రారంభించండి (Launch ${nextTargetYear})`
                      : `✨ Launch & Copy to ${nextTargetYear} Edition`}
                  </span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-stone-950 p-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>
                  {isAdmin
                    ? isTe
                      ? 'కమిటీ అడ్మిన్ అధికారాలు ఉన్నాయి'
                      : 'Committee Admin Privileges Active'
                    : isTe
                    ? 'ప్రేక్షక మోడ్ - అడ్మిన్ లాగిన్ ద్వారా కాపీ చేయవచ్చు'
                    : 'Public Mode'}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors"
              >
                {isTe ? 'పూర్తయింది (Close)' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
