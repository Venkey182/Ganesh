import React, { useState, useEffect } from 'react';
import { useUtsav } from '../context/UtsavContext';
import {
  Tv,
  Radio,
  Minimize2,
  Maximize2,
  TrendingUp,
  TrendingDown,
  Wallet,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
} from 'lucide-react';

interface LiveProjectorViewProps {
  onClose: () => void;
}

export const LiveProjectorView: React.FC<LiveProjectorViewProps> = ({ onClose }) => {
  const {
    settings,
    totalReceived,
    totalSpent,
    balanceAmount,
    expenses,
    collections,
    language,
    lastSyncTimestamp,
  } = useUtsav();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950 text-white flex flex-col overflow-y-auto selection:bg-amber-500 selection:text-black">
      {/* Top Projector Bar */}
      <div className="bg-amber-950/90 border-b border-amber-500/40 px-6 py-3 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>మండపం బిగ్ స్క్రీన్ లైవ్ డిస్ప్లే (LIVE PROJECTOR MODE)</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-mono text-amber-200 bg-amber-900/60 px-3 py-1 rounded-lg border border-amber-700">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentTime}</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-amber-200 hover:text-white bg-amber-900/40 hover:bg-amber-900 rounded-lg transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-xs transition-colors"
          >
            సాధారణ వీక్షణ (Exit)
          </button>
        </div>
      </div>

      {/* Main Projector Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-between space-y-6">
        {/* Festival Grand Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-4 bg-amber-900/40 border border-amber-500/30 px-6 py-2 rounded-full">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 bg-black shrink-0">
              <img
                src={settings.logoUrl}
                alt="Ganesh Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-300 tracking-wide font-heading">
                {settings.teluguTitle}
              </h1>
              <p className="text-xs sm:text-sm text-amber-100 font-medium">{settings.teluguSubTitle}</p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-amber-200/90 flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>వేదిక: {settings.venue}</span>
          </div>
        </div>

        {/* 3 High-Visibility Giant Metric Dials for Projector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Collections Received */}
          <div className="bg-gradient-to-b from-emerald-900/80 to-emerald-950/90 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="text-xs sm:text-sm font-bold text-emerald-300 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>మొత్తం వసూళ్లు (Total Received)</span>
            </div>
            <div className="text-3xl sm:text-5xl lg:text-6xl font-black text-emerald-100 tracking-tight font-mono py-2">
              {formatCurrency(totalReceived)}
            </div>
            <div className="text-xs sm:text-sm text-emerald-200/80 font-medium mt-2">
              దాతల సంఖ్య: {collections.length} మంది భక్తులు
            </div>
          </div>

          {/* Expenses Spent */}
          <div className="bg-gradient-to-b from-rose-900/80 to-rose-950/90 border-2 border-rose-500/60 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="text-xs sm:text-sm font-bold text-rose-300 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>మొత్తం ఖర్చులు (Total Spent)</span>
            </div>
            <div className="text-3xl sm:text-5xl lg:text-6xl font-black text-rose-100 tracking-tight font-mono py-2">
              {formatCurrency(totalSpent)}
            </div>
            <div className="text-xs sm:text-sm text-rose-200/80 font-medium mt-2">
              ఖర్చు వోచర్లు: {expenses.length} పనులకు
            </div>
          </div>

          {/* Net Balance */}
          <div className="bg-gradient-to-b from-amber-800/80 to-amber-950/90 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
              <Wallet className="w-4 h-4 text-amber-400" />
              <span>ప్రస్తుత నిల్వ (Net Balance)</span>
            </div>
            <div className="text-3xl sm:text-5xl lg:text-6xl font-black text-amber-200 tracking-tight font-mono py-2">
              {formatCurrency(balanceAmount)}
            </div>
            <div className="text-xs sm:text-sm text-amber-200/80 font-medium mt-2">
              కమిటీ ఖజానాలో నిధులు
            </div>
          </div>
        </div>

        {/* Live Projector Feeds: Sponsers Honor Roll & Expenditures */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sponsors Honor Roll (Which Item Sponsored by Which Person) */}
          <div className="bg-stone-900/85 border border-amber-500/40 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h2 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>దాతల గౌరవ జాబితా (Sponsors & Items Sponsored)</span>
              </h2>
              <span className="text-[11px] font-bold text-amber-400 bg-amber-950/70 border border-amber-600/40 px-2 py-0.5 rounded-full">
                {collections.length} దాతలు
              </span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
              {collections.slice(0, 8).map((col) => (
                <div
                  key={col.id}
                  className="bg-stone-800/90 border border-amber-500/20 p-2.5 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-amber-200 text-xs sm:text-sm truncate">
                      {col.donorName}
                      {col.gothram && <span className="text-stone-400 text-xs font-normal"> ({col.gothram})</span>}
                    </div>
                    <div className="text-[11px] text-amber-300 font-medium truncate mt-0.5">
                      స్పాన్సర్: <strong className="text-white">{col.sponsoredItem || col.notes || col.category}</strong>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-extrabold text-emerald-400 font-mono">
                      {formatCurrency(col.amount)}
                    </div>
                    <span className="text-[10px] text-stone-400">{col.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Expense Purposes & Purchased Items */}
          <div className="bg-stone-900/85 border border-rose-500/40 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h2 className="text-sm sm:text-base font-bold text-rose-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>ఖర్చు వివరాలు (Expenditures & Purchased Items)</span>
              </h2>
              <span className="text-xs text-stone-400">
                లైవ్ సింక్: {lastSyncTimestamp}
              </span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
              {expenses.slice(0, 8).map((exp) => (
                <div
                  key={exp.id}
                  className="bg-stone-800/90 border border-rose-500/20 p-2.5 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-stone-100 text-xs sm:text-sm truncate">
                      {exp.purpose}
                    </div>
                    {exp.purchasedItems && (
                      <div className="text-[11px] text-rose-300 font-medium truncate mt-0.5">
                        వస్తువులు: <span className="text-white">{exp.purchasedItems}</span>
                      </div>
                    )}
                    <div className="text-[10px] text-stone-400 mt-0.5">{exp.category}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-extrabold text-rose-400 font-mono">
                      {formatCurrency(exp.amount)}
                    </div>
                    <div className="text-[10px] text-stone-400">{exp.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Devotional Sanskrit Sloka Ticker Footer with Design & Sponsor Credits */}
        <div className="bg-amber-950/80 border border-amber-500/40 rounded-xl px-4 py-3 text-center text-xs sm:text-sm text-amber-200 font-medium space-y-1">
          <div className="animate-pulse">
            🕉️ వక్రతుండ మహాకాయ సూర్యకోటి సమప్రభ | నిర్విఘ్నం కురు మే దేవ సర్వకార్యేషు సర్వదా ||
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-amber-300/80 pt-1 border-t border-amber-800/60">
            <span>|| గణపతి బప్పా మోరియా! ||</span>
            <span>•</span>
            <span>
              {settings.websiteDesignCredits || 'Designed by Venkata Prasad & Prasad'}
            </span>
            {settings.websiteSponsorName && (
              <>
                <span>•</span>
                <span className="text-amber-200 font-bold">
                  {settings.websiteSponsorMessage || 'స్పాన్సర్'}: {settings.websiteSponsorName}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
