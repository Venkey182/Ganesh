import React, { useState } from 'react';
import { useUtsav } from '../context/UtsavContext';
import {
  Shield,
  ShieldCheck,
  Tv,
  LogIn,
  LogOut,
  Settings,
  Sparkles,
  PlusCircle,
  Layers,
  Radio,
  Calendar,
  Copy,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenSuperAdmin: () => void;
  onOpenDynamicFields: () => void;
  onOpenProjector: () => void;
  onOpenAddCollection: () => void;
  onOpenAddExpense: () => void;
  onOpenYearModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenLogin,
  onOpenSuperAdmin,
  onOpenDynamicFields,
  onOpenProjector,
  onOpenAddCollection,
  onOpenAddExpense,
  onOpenYearModal,
}) => {
  const {
    settings,
    currentUser,
    isAdmin,
    isSuperAdmin,
    logout,
    language,
    setLanguage,
    lastSyncTimestamp,
    activeYear,
    availableYears,
    switchYear,
    copyToNextYear,
    isCurrentYearArchived,
  } = useUtsav();

  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [copySuccessToast, setCopySuccessToast] = useState<string | null>(null);

  const maxYear = availableYears.length > 0 ? Math.max(...availableYears) : 2026;
  const nextTargetYear = maxYear + 1;

  const handleQuickNextYearCopy = () => {
    const created = copyToNextYear(true);
    setCopySuccessToast(
      language === 'te'
        ? `🎉 ${created} ఉత్సవం కాపీ చేయబడింది! రశీదులు REC-001 నుండి ప్రారంభమవుతాయి.`
        : `🎉 ${created} Edition ready! Receipts start fresh from REC-001.`
    );
    setTimeout(() => setCopySuccessToast(null), 4000);
  };

  const t = {
    live: language === 'te' ? 'లైవ్ అప్‌డేట్స్' : 'Live Sync',
    projector: language === 'te' ? 'బిగ్ స్క్రీన్ / ప్రొజెక్టర్' : 'Projector TV',
    viewOnly: language === 'te' ? 'ప్రేక్షకులు (View Only)' : 'Public View Only',
    admin: language === 'te' ? 'కమిటీ అడ్మిన్' : 'Committee Admin',
    superAdmin: language === 'te' ? 'సూపర్ అడ్మిన్' : 'Super Admin',
    login: language === 'te' ? 'అడ్మిన్ లాగిన్ (OTP)' : 'Admin Login (OTP)',
    logout: language === 'te' ? 'లాగౌట్' : 'Logout',
    addChanda: language === 'te' ? '+ చందా రశీదు' : '+ Add Collection',
    addExpense: language === 'te' ? '+ ఖర్చు నమోదు' : '+ Add Expense',
    dynamicFields: language === 'te' ? 'డైనమిక్ ఫీల్డ్స్' : 'Dynamic Fields',
    adminManage: language === 'te' ? 'అడ్మిన్ ఫోన్ నంబర్లు' : 'Manage Admins',
    nextYearCopy: language === 'te' ? `+ ${nextTargetYear} వచ్చే ఏడాది సైట్ కాపీ` : `+ Copy to ${nextTargetYear}`,
  };

  return (
    <header className="sticky top-0 z-40 bg-linear-to-r from-amber-700 via-orange-600 to-amber-800 text-white shadow-lg border-b border-amber-500/40">
      {/* Top Auspicious Ticker Banner */}
      <div className="bg-amber-950/80 px-4 py-1.5 text-xs text-amber-200 border-b border-amber-800/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-semibold text-amber-300 whitespace-nowrap flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            {t.live}:
          </span>
          <span className="truncate text-amber-100 font-medium">
            {settings.headerBannerText}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs ml-auto">
          {/* Year Switcher Toggle Pills inside ticker */}
          <div className="flex items-center bg-amber-900/90 rounded-lg p-0.5 border border-amber-700/80">
            <span className="text-[10px] text-amber-300/80 px-1 font-semibold flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-400" />
              {language === 'te' ? 'ఏడాది:' : 'Year:'}
            </span>
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => switchYear(yr)}
                className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                  yr === activeYear
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'text-amber-200 hover:text-white'
                }`}
                title={`Switch to ${yr}`}
              >
                {yr}
              </button>
            ))}

            {/* Quick 1-click next year copy button for admin */}
            {isAdmin && (
              <button
                onClick={handleQuickNextYearCopy}
                className="px-1.5 py-0.5 text-[11px] font-bold text-amber-300 hover:text-white bg-amber-950/60 hover:bg-amber-800 rounded ml-0.5 flex items-center gap-0.5 border border-amber-500/30"
                title={`1-Click Copy website to ${nextTargetYear} (Receipts start at REC-001)`}
              >
                <Copy className="w-2.5 h-2.5" />
                <span>+{nextTargetYear}</span>
              </button>
            )}
          </div>

          <span className="hidden sm:inline text-amber-300/80">
            సింక్: {lastSyncTimestamp}
          </span>

          {/* Language Switch */}
          <div className="flex items-center bg-amber-900/90 rounded-md p-0.5 border border-amber-700/80">
            <button
              onClick={() => setLanguage('te')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                language === 'te'
                  ? 'bg-amber-500 text-amber-950 shadow-xs'
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              తెలుగు
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                language === 'en'
                  ? 'bg-amber-500 text-amber-950 shadow-xs'
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Copy Success Toast */}
      {copySuccessToast && (
        <div className="bg-emerald-800 text-white px-4 py-2 text-xs sm:text-sm font-semibold text-center border-b border-emerald-600 animate-in slide-in-from-top-1">
          {copySuccessToast}
        </div>
      )}

      {/* Archived Year Banner Alert */}
      {isCurrentYearArchived && (
        <div className="bg-amber-900 text-amber-100 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/50">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              {language === 'te'
                ? `గమనిక: మీరు ప్రస్తుతం ${activeYear} ఉత్సవ ఆర్కైవ్ రికార్డులను చూస్తున్నారు.`
                : `Notice: You are viewing ${activeYear} archived edition records.`}
            </span>
          </div>
          <button
            onClick={() => switchYear(maxYear)}
            className="px-2.5 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs flex items-center gap-1 transition-colors"
          >
            <span>{language === 'te' ? `తాజా ${maxYear} ఉత్సవానికి మారండి` : `Switch to latest ${maxYear}`}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Dynamic Logo & Title */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative group shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-amber-300 shadow-md bg-amber-900/60 flex items-center justify-center">
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt="Ganesh Utsav Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border border-amber-900">
                {activeYear}
              </span>
            </div>

            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white truncate flex items-center gap-2">
                <span>{language === 'te' ? settings.teluguTitle : settings.title}</span>
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/90 truncate font-medium">
                {language === 'te' ? settings.teluguSubTitle : settings.subTitle}
              </p>
            </div>
          </div>

          {/* Action Buttons & Role Indicator */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Projector Screen Launch */}
            <button
              onClick={onOpenProjector}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-amber-900/80 hover:bg-amber-900 text-amber-200 hover:text-white border border-amber-400/30 text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
              title="Open Fullscreen Projector / TV View"
            >
              <Tv className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="hidden md:inline">{t.projector}</span>
            </button>

            {/* Admin Controls */}
            {isAdmin ? (
              <div className="relative">
                <button
                  onClick={() => setShowAdminMenu(!showAdminMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md transition-colors cursor-pointer"
                >
                  {isSuperAdmin ? (
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                  ) : (
                    <Shield className="w-4 h-4 text-white" />
                  )}
                  <span className="hidden sm:inline">
                    {isSuperAdmin ? t.superAdmin : t.admin}
                  </span>
                  <span className="sm:hidden font-bold">Admin</span>
                </button>

                {/* Dropdown Menu */}
                {showAdminMenu && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-stone-900 text-stone-100 rounded-xl shadow-2xl border border-amber-500/30 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onClick={() => setShowAdminMenu(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-800 text-xs">
                      <div className="text-amber-400 font-semibold">
                        {currentUser.name || 'Admin'}
                      </div>
                      <div className="text-stone-400">{currentUser.mobile}</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">
                        {isSuperAdmin ? 'Full Super Admin Access' : 'Admin Write Access'}
                      </div>
                    </div>

                    <button
                      onClick={onOpenAddCollection}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-stone-800 flex items-center gap-2 text-amber-300 font-medium cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-400" />
                      {t.addChanda}
                    </button>

                    <button
                      onClick={onOpenAddExpense}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-stone-800 flex items-center gap-2 text-amber-300 font-medium cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 text-rose-400" />
                      {t.addExpense}
                    </button>

                    <button
                      onClick={onOpenDynamicFields}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-stone-800 flex items-center gap-2 text-stone-200 cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-amber-400" />
                      {t.dynamicFields}
                    </button>

                    {/* 1-Click Copy Next Year from menu */}
                    <button
                      onClick={handleQuickNextYearCopy}
                      className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-stone-800 flex items-center gap-2 text-amber-400 font-semibold border-t border-stone-800 cursor-pointer"
                    >
                      <Copy className="w-4 h-4 text-amber-400" />
                      {t.nextYearCopy}
                    </button>

                    {isSuperAdmin && (
                      <button
                        onClick={onOpenSuperAdmin}
                        className="w-full text-left px-4 py-2.5 text-xs sm:text-sm hover:bg-stone-800 flex items-center gap-2 text-amber-200 font-medium border-t border-stone-800 cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-amber-400" />
                        {t.adminManage}
                      </button>
                    )}

                    <div className="border-t border-stone-800 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs sm:text-sm text-rose-300 hover:bg-stone-800 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        {t.logout}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-amber-200 bg-amber-900/40 px-2 py-1 rounded border border-amber-500/20">
                  <Shield className="w-3 h-3 text-amber-400" />
                  {t.viewOnly}
                </span>

                <button
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-amber-950" />
                  <span>{t.login}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
