import React from 'react';
import { useUtsav } from '../context/UtsavContext';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  ReceiptText,
  MapPin,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface DashboardSummaryProps {
  onOpenAddCollection?: () => void;
  onOpenAddExpense?: () => void;
  onOpenAdminPanel?: () => void;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  onOpenAddCollection,
  onOpenAddExpense,
  onOpenAdminPanel,
}) => {
  const {
    totalReceived,
    totalSpent,
    balanceAmount,
    collections,
    expenses,
    settings,
    language,
    isAdmin,
    isSuperAdmin,
    activeYear,
  } = useUtsav();

  const isTe = language === 'te';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Devotional Pandal & Mandapam Sub-bar */}
      <div className="bg-amber-100/70 border border-amber-300/70 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 uppercase tracking-wider">
              <span>{isTe ? 'ఉత్సవ కమిటీ వేదిక' : 'Festival Venue & Mandapam'}</span>
              <span className="inline-flex items-center gap-1 text-[11px] bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full font-medium">
                <Calendar className="w-3 h-3" />
                {activeYear} {isTe ? 'ఉత్సవం' : 'Utsav Live'}
              </span>
            </div>
            <div className="text-sm font-medium text-stone-800 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{settings.venue}</span>
            </div>
          </div>
        </div>

        {/* Live Admin status or call to action */}
        {isAdmin ? (
          <div className="flex items-center gap-2 bg-white/90 border border-emerald-300 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {isSuperAdmin
                ? isTe
                  ? 'సూపర్ అడ్మిన్ లాగిన్ అయి ఉంది'
                  : 'Super Admin Active'
                : isTe
                ? 'కమిటీ అడ్మిన్ లాగిన్ అయి ఉంది'
                : 'Admin Active'}
            </span>
          </div>
        ) : (
          <div className="text-xs text-stone-600 bg-white/70 px-3 py-1.5 rounded-xl border border-amber-200/80">
            {isTe
              ? 'ఈ పేజీని అందరూ చూడవచ్చు (View Only). కేవలం కమిటీ అడ్మిన్ మాత్రమే రికార్డులను రాయగలరు.'
              : 'Public View Only. Only authorized Committee Admins can write and edit records.'}
          </div>
        )}
      </div>

      {/* 3 Core Financial Summary Cards (Strictly No Receipts Snaps Clutter) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Received */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-emerald-100 uppercase tracking-wide">
              {isTe ? 'మొత్తం వసూళ్లు' : 'Total Amount Received'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <TrendingUp className="w-5 h-5 text-emerald-200" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {formatCurrency(totalReceived)}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-emerald-100 font-medium">
              <Users className="w-3.5 h-3.5 text-emerald-200" />
              <span>
                {collections.length} {isTe ? 'మంది దాతల విరాళాలు' : 'Total Contributors'}
              </span>
            </div>
          </div>

          {isAdmin && onOpenAddCollection && (
            <div className="mt-4 pt-3 border-t border-emerald-500/30">
              <button
                onClick={onOpenAddCollection}
                className="w-full text-center py-1.5 px-3 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span>{isTe ? '+ చందా రశీదు నమోదు' : '+ Add Collection'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Total Spent */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-red-700 to-rose-800 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-rose-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-rose-100 uppercase tracking-wide">
              {isTe ? 'మొత్తం ఖర్చులు' : 'Total Amount Spent'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <TrendingDown className="w-5 h-5 text-rose-200" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {formatCurrency(totalSpent)}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-rose-100 font-medium">
              <ReceiptText className="w-3.5 h-3.5 text-rose-200" />
              <span>
                {expenses.length} {isTe ? 'ఖర్చుల వోచర్లు నమోదయ్యాయి' : 'Expense Vouchers Recorded'}
              </span>
            </div>
          </div>

          {isAdmin && onOpenAddExpense && (
            <div className="mt-4 pt-3 border-t border-rose-500/30">
              <button
                onClick={onOpenAddExpense}
                className="w-full text-center py-1.5 px-3 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span>{isTe ? '+ ఖర్చు వివరాలు నమోదు' : '+ Add Expense'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Balance Remaining */}
        <div
          className={`relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-md border text-white ${
            balanceAmount >= 0
              ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-orange-800 border-amber-500/40'
              : 'bg-gradient-to-br from-stone-800 via-stone-900 to-black border-stone-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-amber-100 uppercase tracking-wide">
              {isTe ? 'ప్రస్తుత నిల్వ (మిగిలిన మొత్తం)' : 'Remaining Net Balance'}
            </span>
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
              <Wallet className="w-5 h-5 text-amber-200" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              {formatCurrency(balanceAmount)}
            </div>
            <div className="mt-1 text-xs text-amber-100 font-medium">
              {balanceAmount >= 0
                ? isTe
                  ? 'కమిటీ వద్ద అందుబాటులో ఉన్న నిధులు'
                  : 'Surplus Funds Available in Treasury'
                : isTe
                ? 'లోటు బడ్జెట్ (ఖర్చులు వసూళ్ల కన్నా ఎక్కువయ్యాయి)'
                : 'Deficit Balance'}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-500/30 text-[11px] text-amber-200/90 flex items-center justify-between">
            <span>{isTe ? 'పారదర్శక ఆడిట్ రికార్డు' : 'Transparent Audit'}</span>
            <span className="font-semibold bg-amber-900/60 px-2 py-0.5 rounded text-amber-200">
              100% Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
