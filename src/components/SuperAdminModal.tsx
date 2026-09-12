import React, { useState } from 'react';
import { useUtsav } from '../context/UtsavContext';
import {
  ShieldCheck,
  Phone,
  User,
  Plus,
  Trash2,
  X,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Check,
  MapPin,
  FileText,
  Calendar,
  Copy,
  History,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface SuperAdminModalProps {
  onClose: () => void;
}

export const SuperAdminModal: React.FC<SuperAdminModalProps> = ({ onClose }) => {
  const {
    admins,
    appointAdmin,
    removeAdmin,
    settings,
    updateSettings,
    addWebsiteSponsor,
    removeWebsiteSponsor,
    language,
    isSuperAdmin,
    activeYear,
    availableYears,
    switchYear,
    copyToNextYear,
    deleteYear,
    allYearsInfo,
    balanceAmount,
  } = useUtsav();

  const isTe = language === 'te';

  // Admin management state
  const [newMobile, setNewMobile] = useState('');
  const [newName, setNewName] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Settings state
  const [title, setTitle] = useState(settings.title);
  const [teluguTitle, setTeluguTitle] = useState(settings.teluguTitle);
  const [subTitle, setSubTitle] = useState(settings.subTitle);
  const [teluguSubTitle, setTeluguSubTitle] = useState(settings.teluguSubTitle);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);
  const [headerBannerText, setHeaderBannerText] = useState(settings.headerBannerText);
  const [venue, setVenue] = useState(settings.venue);
  const [superAdminMobile, setSuperAdminMobile] = useState(settings.superAdminMobile);
  const [websiteDesignCredits, setWebsiteDesignCredits] = useState(
    settings.websiteDesignCredits || 'Designed by Venkata Prasad and Prasad'
  );
  const [websiteDesignersTelugu, setWebsiteDesignersTelugu] = useState(
    settings.websiteDesignersTelugu || 'రూపకల్పన: వెంకట ప్రసాద్ మరియు ప్రసాద్'
  );

  // Future Website Sponsor inline entry
  const [futureSponsorName, setFutureSponsorName] = useState('');
  const [futureSponsorRole, setFutureSponsorRole] = useState('');

  // Year management state
  const [carryBalance, setCarryBalance] = useState(true);

  const [activeTab, setActiveTab] = useState<'admins' | 'settings' | 'years'>('admins');
  const [successMsg, setSuccessMsg] = useState('');

  const maxYear = availableYears.length > 0 ? Math.max(...availableYears) : 2026;
  const nextTargetYear = maxYear + 1;

  // Pre-set devotional logos
  const PRESET_LOGOS = [
    {
      name: 'Golden Ganesha',
      url: 'https://images.unsplash.com/photo-1567591414240-e144a2df815a?w=160&auto=format&fit=crop&q=80',
    },
    {
      name: 'Vibrant Vinayaka',
      url: 'https://images.unsplash.com/photo-1600271772470-bd22a42787b3?w=160&auto=format&fit=crop&q=80',
    },
    {
      name: 'Devotional Idol',
      url: 'https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?w=160&auto=format&fit=crop&q=80',
    },
  ];

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = newMobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      alert(isTe ? 'దయచేసి 10 అంకెల సరైన మొబైల్ నంబర్ ఇవ్వండి' : 'Enter valid 10-digit mobile');
      return;
    }
    if (!newName.trim()) {
      alert(isTe ? 'దయచేసి అడ్మిన్ పేరు ఇవ్వండి' : 'Enter admin name');
      return;
    }

    appointAdmin({
      mobile: cleanMobile,
      name: newName.trim(),
      role: 'admin',
      notes: newNotes.trim() || undefined,
    });

    setNewMobile('');
    setNewName('');
    setNewNotes('');
    setSuccessMsg(
      isTe
        ? 'నూతన అడ్మిన్ విజయవంతంగా జోడించబడ్డారు! ఆ మొబైల్ నంబర్ ద్వారా OTP తో లాగిన్ కావచ్చు.'
        : 'Admin successfully appointed! They can now log in via mobile OTP.'
    );
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      title,
      teluguTitle,
      subTitle,
      teluguSubTitle,
      logoUrl,
      headerBannerText,
      venue,
      superAdminMobile: superAdminMobile.replace(/\D/g, ''),
      websiteDesignCredits,
      websiteDesignersTelugu,
    });
    setSuccessMsg(
      isTe
        ? 'ఉత్సవ శీర్షిక, లోగో, వెబ్‌సైట్ డిజైన్ మరియు సెట్టింగ్స్ నవీకరించబడ్డాయి!'
        : 'Settings, Logo and Website Design credits updated successfully!'
    );
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleInlineAddWebsiteSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!futureSponsorName.trim()) return;
    addWebsiteSponsor(
      futureSponsorName.trim(),
      futureSponsorRole.trim() || undefined
    );
    setFutureSponsorName('');
    setFutureSponsorRole('');
    setSuccessMsg(
      isTe
        ? 'భవిష్యత్ వెబ్‌సైట్ స్పాన్సర్ పేరు విజయవంతంగా ఫూటర్‌లో చేర్చబడింది!'
        : 'Future website sponsor added successfully to footer!'
    );
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <X className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            {isTe ? 'సూపర్ అడ్మిన్ అనుమతి అవసరం' : 'Super Admin Access Required'}
          </h3>
          <p className="text-xs text-stone-600">
            {isTe
              ? 'ఈ విభాగాన్ని కేవలం ప్రధాన సూపర్ అడ్మిన్ మాత్రమే నిర్వహించగలరు.'
              : 'Only the designated Super Admin can manage authorized mobile numbers and branding.'}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold"
          >
            మూసివేయి (Close)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-amber-300 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {isTe ? 'సూపర్ అడ్మిన్ నియంత్రణ ప్యానెల్' : 'Super Admin Control Center'}
              </h2>
              <p className="text-xs text-amber-100">
                {isTe
                  ? 'అడ్మిన్ మొబైల్ నంబర్లు & ఉత్సవ శీర్షిక/లోగో నిర్వహణ'
                  : 'Appoint admin mobile numbers, configure branding & logo'}
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

        {/* Tab Selector */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('admins')}
            className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'admins'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>{isTe ? 'అడ్మిన్ మొబైల్ నంబర్లు' : 'Authorized Admins'}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isTe ? 'ఉత్సవ పేరు, లోగో & వేదిక' : 'Title, Logo & Venue'}</span>
          </button>

          <button
            onClick={() => setActiveTab('years')}
            className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'years'
                ? 'border-amber-600 text-amber-900 bg-amber-50/50'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>{isTe ? 'ఉత్సవ సంవత్సరాలు & నూతన కాపీ' : 'Festival Years & Copy'}</span>
            <span className="bg-amber-200 text-amber-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              {activeYear}
            </span>
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: ADMIN MOBILE NUMBERS */}
          {activeTab === 'admins' && (
            <div className="space-y-6">
              {/* Form to appoint new admin mobile */}
              <form
                onSubmit={handleAddAdmin}
                className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3"
              >
                <div className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-700" />
                  <span>
                    {isTe
                      ? 'నూతన అడ్మిన్ మొబైల్ నంబర్‌కు అనుమతి ఇవ్వండి'
                      : 'Authorize New Mobile Number as Admin'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isTe ? '10 అంకెల మొబైల్ నంబర్ *' : 'Mobile Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={newMobile}
                      onChange={(e) => setNewMobile(e.target.value)}
                      placeholder="98480XXXXX"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isTe ? 'వ్యక్తి / సభ్యుని పేరు *' : 'Admin / Member Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="ఉదా: రాజేష్ (ఖజాంచీ)"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isTe ? 'బాధ్యతలు / హోదా (Designation / Notes)' : 'Designation / Notes'}
                  </label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="ఉదా: చందాల రశీదుల నమోదు & ఖర్చుల పర్యవేక్షణ"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {isTe ? '+ అడ్మిన్‌గా నియమించు (Appoint Admin)' : '+ Appoint as Admin'}
                  </span>
                </button>
              </form>

              {/* Current Authorized Admins List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-800 uppercase">
                    {isTe
                      ? 'అధీకృత అడ్మిన్ మొబైల్ నంబర్ల జాబితా'
                      : 'Currently Authorized Admin Mobiles'}
                  </h3>
                  <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    {admins.length} Admins
                  </span>
                </div>

                <div className="space-y-2">
                  {admins.map((adm) => (
                    <div
                      key={adm.id}
                      className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">{adm.name}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              adm.role === 'super_admin'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {adm.role === 'super_admin' ? 'Super Admin' : 'Admin (Write)'}
                          </span>
                        </div>
                        <div className="text-xs font-mono text-stone-600 mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span>+91 {adm.mobile}</span>
                        </div>
                        {adm.notes && (
                          <div className="text-[11px] text-stone-500 mt-0.5 italic">{adm.notes}</div>
                        )}
                      </div>

                      {adm.role !== 'super_admin' && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                isTe
                                  ? `${adm.name} గారికి అడ్మిన్ అనుమతిని రద్దు చేయాలా?`
                                  : `Revoke admin access for ${adm.name}?`
                              )
                            ) {
                              removeAdmin(adm.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Revoke Admin Access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FESTIVAL TITLE, DYNAMIC LOGO & VENUE */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isTe ? 'ఉత్సవ పేరు (తెలుగులో) *' : 'Festival Title (Telugu) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={teluguTitle}
                    onChange={(e) => setTeluguTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isTe ? 'ఉత్సవ పేరు (English) *' : 'Festival Title (English) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isTe ? 'ఉప శీర్షిక (తెలుగు)' : 'Subtitle (Telugu)'}
                  </label>
                  <input
                    type="text"
                    value={teluguSubTitle}
                    onChange={(e) => setTeluguSubTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isTe ? 'ఉప శీర్షిక (English)' : 'Subtitle (English)'}
                  </label>
                  <input
                    type="text"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Logo Section */}
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/80 space-y-3">
                <label className="block text-xs font-bold text-amber-900 uppercase">
                  {isTe ? 'డైనమిక్ గణేష్ లోగో (Dynamic Logo)' : 'Dynamic Ganesh Logo'}
                </label>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500 bg-stone-100 shrink-0">
                    <img
                      src={logoUrl}
                      alt="Logo Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div>
                      <input
                        type="text"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="Image URL https://..."
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isTe ? 'కంప్యూటర్/మొబైల్ నుండి అప్‌లోడ్ చేయండి' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Preset Logo Icons */}
                <div>
                  <div className="text-[11px] font-semibold text-stone-500 mb-1.5">
                    {isTe ? 'లేదా ఈ భక్తి చిహ్నాలను ఎంచుకోండి:' : 'Or choose devotional presets:'}
                  </div>
                  <div className="flex items-center gap-3">
                    {PRESET_LOGOS.map((p) => (
                      <button
                        type="button"
                        key={p.name}
                        onClick={() => setLogoUrl(p.url)}
                        className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all p-0.5 ${
                          logoUrl === p.url
                            ? 'border-amber-600 scale-105 shadow-md'
                            : 'border-stone-300 hover:border-amber-400'
                        }`}
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover rounded-full" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ticker Banner */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isTe ? 'పై భాగంలో స్క్రోల్ అయ్యే శుభాకాంక్షల ట్యాగ్‌లైన్ (Banner Ticker)' : 'Announcement Ticker'}
                </label>
                <input
                  type="text"
                  value={headerBannerText}
                  onChange={(e) => setHeaderBannerText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Venue */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isTe ? 'మండపం ప్రదేశం & వేదిక (Mandapam Venue)' : 'Mandapam Venue Address'}
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Super Admin Mobile */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {isTe ? 'ప్రధాన సూపర్ అడ్మిన్ మొబైల్ నంబర్ (Super Admin Mobile)' : 'Primary Super Admin Mobile'}
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={superAdminMobile}
                  onChange={(e) => setSuperAdminMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Website Design Credits & Future Website Sponsor */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-300 space-y-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>
                    {isTe
                      ? 'వెబ్‌సైట్ డిజైన్ & భవిష్యత్ స్పాన్సర్లు (Website Design & Future Sponsors)'
                      : 'Website Design & Future Sponsors'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isTe ? 'డిజైన్ క్రెడిట్స్ (English)' : 'Website Design Credits (English)'}
                    </label>
                    <input
                      type="text"
                      value={websiteDesignCredits}
                      onChange={(e) => setWebsiteDesignCredits(e.target.value)}
                      placeholder="Designed by Venkata Prasad and Prasad"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isTe ? 'రూపకల్పన వివరాలు (Telugu)' : 'Design Details (Telugu)'}
                    </label>
                    <input
                      type="text"
                      value={websiteDesignersTelugu}
                      onChange={(e) => setWebsiteDesignersTelugu(e.target.value)}
                      placeholder="రూపకల్పన: వెంకట ప్రసాద్ మరియు ప్రసాద్"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-stone-500">
                  {isTe
                    ? 'ఫూటర్‌లో మొబైల్ మరియు డెస్క్‌టాప్ రెండింటిలోనూ "Designed by Venkata Prasad and Prasad" క్రెడిట్స్ స్పష్టంగా కనిపిస్తాయి.'
                    : 'Displayed prominently in the footer across mobile and desktop.'}
                </p>

                {/* Future Website Sponsors List & Quick Add */}
                <div className="pt-3 border-t border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950">
                      {isTe
                        ? 'భవిష్యత్ వెబ్‌సైట్ డిజైన్ స్పాన్సర్లు (Future Website Sponsors)'
                        : 'Future Website Sponsors List'}
                    </span>
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                      {(settings.websiteSponsors || []).length}
                    </span>
                  </div>

                  {/* List of current website sponsors */}
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {(settings.websiteSponsors || []).length === 0 ? (
                      <p className="text-xs text-stone-400 italic">
                        {isTe
                          ? 'స్పాన్సర్లు ఎవరూ చేర్చబడలేదు. క్రింద కొత్త స్పాన్సర్ పేరును చేర్చవచ్చు.'
                          : 'No sponsors added yet. Add a future sponsor below.'}
                      </p>
                    ) : (
                      (settings.websiteSponsors || []).map((sp) => (
                        <div
                          key={sp.id}
                          className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-stone-200 text-xs"
                        >
                          <div>
                            <span className="font-bold text-stone-800">{sp.name}</span>
                            {sp.roleOrNote && (
                              <span className="text-stone-500 ml-1 font-normal">
                                ({sp.roleOrNote})
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeWebsiteSponsor(sp.id)}
                            className="text-stone-400 hover:text-rose-600 p-1 rounded"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Inline Form to Add Any Future Sponsor */}
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200 space-y-2">
                    <div className="text-[11px] font-bold text-stone-700">
                      {isTe ? '+ భవిష్యత్ స్పాన్సర్‌ను చేర్చండి' : '+ Add Future Sponsor to Website'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={futureSponsorName}
                        onChange={(e) => setFutureSponsorName(e.target.value)}
                        placeholder={isTe ? 'స్పాన్సర్ లేదా సంస్థ పేరు *' : 'Sponsor Name *'}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={futureSponsorRole}
                        onChange={(e) => setFutureSponsorRole(e.target.value)}
                        placeholder={isTe ? 'హోదా / సహాయం (ఐచ్ఛికం)' : 'Note / Tagline (Optional)'}
                        className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleInlineAddWebsiteSponsor}
                      disabled={!futureSponsorName.trim()}
                      className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isTe ? 'ఫూటర్‌లో చేర్చు' : 'Add to Footer'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                {isTe ? 'సెట్టింగ్స్‌ను సేవ్ చేయండి (Save Settings)' : 'Save All Settings'}
              </button>
            </form>
          )}

          {/* TAB 3: FESTIVAL YEARS & 1-CLICK NEXT YEAR COPY */}
          {activeTab === 'years' && (
            <div className="space-y-6">
              {/* Notice Banner */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-stone-700 text-xs sm:text-sm space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <span>{isTe ? 'ఉత్సవ సంవత్సరాల ఆర్కైవ్ & నూతన ఎడిషన్ కాపీ' : 'Festival Years Archive & 1-Click Copy'}</span>
                </div>
                <p className="text-stone-600">
                  {isTe
                    ? 'ప్రతి సంవత్సరం ఒకే వెబ్‌సైట్‌ను వాడుకోవచ్చు. ప్రస్తుత డేటాను భద్రపరుస్తూ, వచ్చే ఏడాదికి (ఉదా: 2027) ఒకే ఒక్క క్లిక్‌తో సైట్ కాపీ అవుతుంది. రశీదులు REC-001 నుండి, ఖర్చులు VOU-01 నుండి తాజాగా (#1) ప్రారంభమవుతాయి.'
                    : 'Use the same website year after year. Securely preserve archive records and clone everything to the next year (e.g. 2027) in 1-click. Receipts restart clean from REC-001.'}
                </p>
              </div>

              {/* 1-Click Next Year Action Card */}
              <div className="bg-linear-to-br from-amber-50 via-orange-50 to-amber-100/60 border-2 border-amber-400 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200 px-2 py-0.5 rounded-md">
                      {isTe ? 'వచ్చే ఏడాది ప్రారంభం' : 'Launch Next Edition'}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-amber-950">
                      {isTe
                        ? `✨ ${nextTargetYear} వినాయక ఉత్సవాన్ని కాపీ చేసి ప్రారంభించండి`
                        : `✨ 1-Click Launch & Copy to ${nextTargetYear}`}
                    </h3>
                  </div>
                  <span className="text-2xl font-black text-amber-800 font-mono">
                    {nextTargetYear}
                  </span>
                </div>

                <p className="text-xs text-stone-700">
                  {isTe
                    ? `శీర్షిక, ఉప శీర్షిక, మండపం వేదిక, కమిటీ అడ్మిన్లు, స్పాన్సర్లు, కేటగిరీలు అన్నీ ${nextTargetYear} కి కాపీ అవుతాయి. రశీదులు REC-001 నుండి (#1) ప్రారంభమవుతాయి.`
                    : `Mandapam setup, organizers, committee admins, dynamic fields, and sponsors are cloned into ${nextTargetYear}. Receipts restart fresh from #1.`}
                </p>

                {/* Carry balance toggle */}
                <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-amber-300 cursor-pointer hover:border-amber-500 transition-colors">
                  <input
                    type="checkbox"
                    checked={carryBalance}
                    onChange={(e) => setCarryBalance(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-stone-900 block">
                      {isTe
                        ? `${activeYear} ముగింపు నిల్వ (₹${balanceAmount}) ను ${nextTargetYear} ప్రారంభ నిధిగా బదిలీ చేయండి`
                        : `Carry forward ${activeYear} balance (₹${balanceAmount}) to ${nextTargetYear} Opening Fund`}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {isTe
                        ? `ఆటోమేటిక్‌గా ${nextTargetYear} లో REC-001 గా ఓపెనింగ్ బ్యాలెన్స్ రశీదు సృష్టించబడుతుంది.`
                        : `Will automatically create REC-001 as Opening Balance donation.`}
                    </span>
                  </div>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    const created = copyToNextYear(carryBalance);
                    setSuccessMsg(
                      isTe
                        ? `🎉 ${created} ఉత్సవం విజయవంతంగా సృష్టించబడింది! సైట్ ${created} కి మారింది.`
                        : `🎉 ${created} festival edition launched! App switched to ${created}.`
                    );
                    setTimeout(() => setSuccessMsg(''), 4000);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Copy className="w-4 h-4" />
                  <span>
                    {isTe
                      ? `🚀 ${nextTargetYear} ఉత్సవాన్ని కాపీ చేసి ప్రారంభించండి (Launch ${nextTargetYear})`
                      : `🚀 Launch & Copy to ${nextTargetYear}`}
                  </span>
                </button>
              </div>

              {/* All Years Overview */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-4 h-4 text-amber-600" />
                  <span>{isTe ? 'అన్ని ఉత్సవ సంవత్సరాలు (All Festival Years)' : 'All Festival Years'}</span>
                </h4>

                <div className="space-y-2">
                  {allYearsInfo.map((yrInfo) => {
                    const isActive = yrInfo.year === activeYear;
                    return (
                      <div
                        key={yrInfo.year}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          isActive
                            ? 'bg-amber-100/60 border-amber-400 ring-2 ring-amber-300'
                            : 'bg-white border-stone-200 hover:border-amber-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-extrabold text-stone-900">
                              {yrInfo.year} ఉత్సవం
                            </span>
                            {isActive ? (
                              <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full">
                                {isTe ? 'ప్రస్తుతం యాక్టివ్' : 'Currently Active'}
                              </span>
                            ) : (
                              <span className="text-[10px] bg-stone-200 text-stone-700 font-semibold px-2 py-0.5 rounded-full">
                                {yrInfo.isArchived ? (isTe ? 'ఆర్కైవ్' : 'Archived') : (isTe ? 'తాజా' : 'Latest')}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 mt-1">
                            <span>
                              {isTe ? 'చందాలు:' : 'Income:'}{' '}
                              <strong className="text-emerald-700">₹{yrInfo.totalCollections}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              {isTe ? 'ఖర్చులు:' : 'Expenses:'}{' '}
                              <strong className="text-rose-700">₹{yrInfo.totalExpenses}</strong>
                            </span>
                            <span>•</span>
                            <span>
                              {isTe ? 'నిల్వ:' : 'Balance:'}{' '}
                              <strong className={yrInfo.balance >= 0 ? 'text-amber-800' : 'text-rose-800'}>
                                ₹{yrInfo.balance}
                              </strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {!isActive && (
                            <button
                              type="button"
                              onClick={() => {
                                switchYear(yrInfo.year);
                                setSuccessMsg(
                                  isTe
                                    ? `${yrInfo.year} ఉత్సవ రికార్డులకు మారారు.`
                                    : `Switched to ${yrInfo.year} festival edition.`
                                );
                                setTimeout(() => setSuccessMsg(''), 3000);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>{isTe ? 'ఈ ఏడాదికి మారండి' : 'Switch to this year'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {availableYears.length > 1 && !isActive && (
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  confirm(
                                    isTe
                                      ? `ఖచ్చితంగా ${yrInfo.year} రికార్డులను తొలగించాలనుకుంటున్నారా?`
                                      : `Are you sure you want to delete records for ${yrInfo.year}?`
                                  )
                                ) {
                                  deleteYear(yrInfo.year);
                                }
                              }}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Year"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
