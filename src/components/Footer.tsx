import React from 'react';
import { useUtsav } from '../context/UtsavContext';
import {
  Heart,
  Sparkles,
  Tv,
  ShieldCheck,
  Phone,
} from 'lucide-react';

interface FooterProps {
  onOpenProjector: () => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenProjector, onOpenLogin }) => {
  const {
    settings,
    isAdmin,
    isSuperAdmin,
    language,
    activeYear,
  } = useUtsav();

  const isTe = language === 'te';

  return (
    <footer className="mt-auto bg-stone-950 text-stone-300 border-t border-amber-900/50 pb-20 sm:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Left: Mandapam Title & Organizer */}
          <div className="space-y-1">
            <div className="text-amber-400 font-extrabold text-sm sm:text-base flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{isTe ? settings.teluguTitle : settings.title}</span>
            </div>
            <div className="text-stone-400 text-xs">
              {isTe ? settings.teluguSubTitle : settings.subTitle} • {settings.venue}
            </div>
            <div className="text-[11px] text-amber-500/80 font-medium">
              || ఓం శ్రీ గణేశాయ నమః || సర్వే జనాః సుఖినో భవంతు ||
            </div>
          </div>

          {/* Right: Quick Links & Contact */}
          <div className="flex flex-col items-center md:items-end gap-2 text-xs">
            <div className="flex flex-wrap items-center justify-center gap-3 text-stone-400">
              <button
                type="button"
                onClick={onOpenProjector}
                className="text-amber-300 hover:text-amber-200 underline font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Tv className="w-3.5 h-3.5 text-amber-400" />
                <span>{isTe ? 'లైవ్ ప్రొజెక్టర్ (TV View)' : 'Live Projector'}</span>
              </button>
              <span>•</span>
              {!isAdmin ? (
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="text-stone-300 hover:text-amber-300 underline font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isTe ? 'కమిటీ అడ్మిన్ లాగిన్' : 'Admin Login'}</span>
                </button>
              ) : (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isSuperAdmin ? 'సూపర్ అడ్మిన్' : 'కమిటీ అడ్మిన్'}</span>
                </span>
              )}
            </div>

            <div className="text-[11px] text-stone-400 flex items-center gap-1.5 font-mono">
              <Phone className="w-3 h-3 text-amber-400" />
              <span>{isTe ? 'సహాయవాణి:' : 'Helpline:'} {settings.superAdminMobile || '9885714587'}</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits Line */}
        <div className="pt-3 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400 text-center">
          <div>
            © {activeYear} {isTe ? settings.teluguTitle : settings.title}. {isTe ? 'సర్వహక్కులు ప్రత్యేకించబడినవి.' : 'All Rights Reserved.'}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-amber-500/30 text-amber-200 font-medium">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 shrink-0" />
            <span>Designed by Venkata Prasad & Prasad</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
