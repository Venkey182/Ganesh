import React, { useState } from 'react';
import { useUtsav } from '../context/UtsavContext';
import {
  ShieldCheck,
  Phone,
  KeyRound,
  ArrowRight,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface OtpLoginModalProps {
  onClose: () => void;
}

export const OtpLoginModal: React.FC<OtpLoginModalProps> = ({ onClose }) => {
  const {
    admins,
    settings,
    requestOtp,
    verifyOtp,
    quickLoginAsSuperAdmin,
    language,
  } = useUtsav();

  const isTe = language === 'te';

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'MOBILE' | 'OTP'>('MOBILE');
  const [errorMsg, setErrorMsg] = useState('');
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = requestOtp(mobile);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setDemoCode(res.otp || null);
      if (res.otp) {
        setOtp(res.otp); // Pre-fill for effortless instant testing
      }
      setStep('OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsVerifying(true);
    try {
      const success = await verifyOtp(mobile, otp);
      if (!success) {
        setErrorMsg(
          isTe
            ? 'తప్పు OTP కోడ్ నమోదు చేశారు. దయచేసి మళ్ళీ ప్రయత్నించండి.'
            : 'Invalid OTP code. Please try again.'
        );
      } else {
        onClose();
      }
    } catch {
      setErrorMsg(isTe ? 'ధృవీకరణ లోపం ఏర్పడింది' : 'Verification error occurred');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleQuickDemo = async () => {
    await quickLoginAsSuperAdmin();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-amber-300 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {isTe ? 'కమిటీ అడ్మిన్ లాగిన్ (OTP)' : 'Committee Admin Login'}
              </h2>
              <p className="text-xs text-amber-100">
                {isTe ? 'అధీకృత మొబైల్ నంబర్ మరియు OTP ద్వారా లాగిన్' : 'Login using registered mobile & OTP'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* JWS Security Indicator */}
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 font-medium">
            <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              {isTe
                ? 'JWS (JSON Web Signature) క్రిప్టోగ్రాఫిక్ టోకెన్ భద్రతతో రక్షించబడింది'
                : 'Secured by cryptographic JWS (HMAC-SHA256) session tokens'}
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs sm:text-sm font-medium flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: ENTER MOBILE */}
          {step === 'MOBILE' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {isTe ? 'అడ్మిన్ మొబైల్ నంబర్ (10 అంకెలు)' : 'Admin Mobile Number (10 digits)'} *
                  </label>
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                    సూపర్ అడ్మిన్: 9885714587
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-stone-500 font-semibold text-xs sm:text-sm border-r border-stone-300 pr-2">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="9885714587"
                    className="w-full pl-16 pr-3 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-base font-bold font-mono tracking-wider text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  {isTe
                    ? 'సూపర్ అడ్మిన్ (9885714587) లేదా అధికారం పొందిన అడ్మిన్ల మొబైల్ నంబర్‌కు మాత్రమే అనుమతి ఉంది.'
                    : 'Authorized committee members and designated Super Admin (9885714587) only.'}
                </p>
              </div>

              {/* Quick Select of Pre-configured Admins for instant convenience */}
              <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 block mb-1">
                  {isTe ? 'త్వరిత ఎంపిక (Quick Mobiles):' : 'Pre-configured Mobiles:'}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() => setMobile('9885714587')}
                    className="px-2 py-1 bg-amber-600 text-white font-bold rounded-lg font-mono text-[11px] transition-colors shadow-xs"
                  >
                    9885714587 (Super Admin)
                  </button>
                  {admins
                    .filter((a) => a.mobile !== '9885714587')
                    .slice(0, 2)
                    .map((adm) => (
                      <button
                        type="button"
                        key={adm.id}
                        onClick={() => setMobile(adm.mobile)}
                        className="px-2 py-1 bg-white hover:bg-amber-100 text-stone-800 rounded-lg border border-amber-300 font-mono text-[11px] transition-colors"
                      >
                        {adm.mobile} ({adm.name.split(' ')[0]})
                      </button>
                    ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>{isTe ? 'OTP పంపండి (Get OTP)' : 'Send OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {demoCode && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs sm:text-sm text-emerald-900 font-medium">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 mb-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isTe ? 'OTP రూపొందించబడింది (Live Test Code)' : 'Instant Test OTP Code'}</span>
                  </div>
                  <div>
                    {isTe ? 'ధృవీకరణ కోడ్:' : 'Your OTP is:'}{' '}
                    <span className="font-mono text-base font-extrabold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      {demoCode}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {isTe ? '4 అంకెల OTP కోడ్ *' : 'Enter 4-Digit OTP *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('MOBILE')}
                    className="text-xs text-amber-700 hover:underline font-semibold"
                  >
                    {isTe ? 'మొబైల్ మార్చు' : 'Change Mobile'}
                  </button>
                </div>

                <input
                  type="text"
                  required
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="XXXX"
                  className="w-full text-center py-3 text-2xl font-mono font-black tracking-widest rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isVerifying
                    ? isTe
                      ? 'JWS టోకెన్ ధృవీకరిస్తోంది...'
                      : 'Verifying JWS Token...'
                    : isTe
                    ? 'ధృవీకరించి లాగిన్ అవ్వండి'
                    : 'Verify & Login (JWS Secured)'}
                </span>
              </button>
            </form>
          )}

          {/* Quick One-Click Super Admin Tester */}
          <div className="pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {isTe
                  ? 'ఒక్క క్లిక్‌తో సూపర్ అడ్మిన్ (9885714587) టెస్ట్ లాగిన్'
                  : '1-Click Super Admin (9885714587) Test Access'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
