import React, { useState, useMemo } from 'react';
import { useUtsav } from '../context/UtsavContext';
import { CollectionRecord } from '../types';
import {
  Sparkles,
  Search,
  Gift,
  User,
  Heart,
  Calendar,
  Award,
  Filter,
  CheckCircle2,
  Share2,
  Plus,
  X,
  Phone,
  Clock,
  ChevronRight,
  HandHeart,
  Flame,
} from 'lucide-react';

interface UpcomingNeed {
  id: string;
  titleTe: string;
  titleEn: string;
  descTe: string;
  descEn: string;
  suggestedAmount: number;
  icon: string;
  day: string;
}

const UPCOMING_NEEDS: UpcomingNeed[] = [
  {
    id: 'need_1',
    titleTe: '5వ రోజు మహా అన్నదానం',
    titleEn: 'Day 5 Maha Annadanam',
    descTe: '1000 మంది భక్తులకు సంపూర్ణ భోజన వితరణ & అన్నప్రసాదం',
    descEn: 'Full Mahaprasadam meal distribution for 1,000 devotees',
    suggestedAmount: 10116,
    icon: '🍚',
    day: '5వ రోజు (Day 5)',
  },
  {
    id: 'need_2',
    titleTe: 'మహా లడ్డూ ప్రసాదం',
    titleEn: 'Maha Laddu Prasadam',
    descTe: 'గణపతి బప్పాకు సమర్పించే 21 కేజీల పవిత్ర నెయ్యి లడ్డూ',
    descEn: '21 KG Sacred Ghee Laddu for Lord Ganesha',
    suggestedAmount: 5116,
    icon: '🥮',
    day: 'విశేష పూజ రోజు',
  },
  {
    id: 'need_3',
    titleTe: 'నిత్య సుగంధ పుష్పాలంకరణ',
    titleEn: 'Daily Flower Garlands & Mandapam',
    descTe: 'స్వామివారికి గులాబీ, చామంతి, తులసి & కమలాల ప్రత్యేక అలంకరణ',
    descEn: 'Daily floral garlands & mandapam arch decor',
    suggestedAmount: 2116,
    icon: '🌺',
    day: 'నిత్య సేవ (Daily)',
  },
  {
    id: 'need_4',
    titleTe: 'నిమజ్జనం రథం & ఊరేగింపు వాహనం',
    titleEn: 'Visarjan Chariot & Vehicle',
    descTe: 'శ్రీ స్వామివారి వైభవ నిమజ్జన ఊరేగింపు రథం, వాహనం & డెకరేషన్',
    descEn: 'Grand procession decorated chariot & vehicle',
    suggestedAmount: 15116,
    icon: '🚜',
    day: 'నిమజ్జనం రోజు (Visarjan Day)',
  },
  {
    id: 'need_5',
    titleTe: 'తీన్మార్ & నాసిక్ డోలు బాజా',
    titleEn: 'Procession Band & Beats',
    descTe: 'వైభవ ఊరేగింపులో సంప్రదాయ మంగళ వాద్యాలు, డప్పులు & బాజా',
    descEn: 'Traditional rhythm band, drums & procession music',
    suggestedAmount: 8116,
    icon: '🥁',
    day: 'నిమజ్జనం రోజు (Visarjan Day)',
  },
  {
    id: 'need_6',
    titleTe: 'భవిష్యత్ గణేష్ శాశ్వత నిధి',
    titleEn: 'Mandapam Future Development Fund',
    descTe: 'భవిష్యత్ ఉత్సవాల శాశ్వత వస్తువులు, సౌండ్ & మందిర అభివృద్ధి',
    descEn: 'Permanent assets & future utsav development corpus',
    suggestedAmount: 5116,
    icon: '🏛️',
    day: 'భవిష్యత్ శాశ్వత నిధి',
  },
];

export const PublicSponsorsView: React.FC = () => {
  const { collections, addCollection, language, settings } = useUtsav();
  const isTe = language === 'te';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNeedsShowcase, setShowNeedsShowcase] = useState(true);

  // Modal State for Future Purpose Sponsorship
  const [showFutureModal, setShowFutureModal] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [mobile, setMobile] = useState('');
  const [gothram, setGothram] = useState('');
  const [address, setAddress] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState(UPCOMING_NEEDS[0].titleTe);
  const [customPurpose, setCustomPurpose] = useState('');
  const [targetDay, setTargetDay] = useState(UPCOMING_NEEDS[0].day);
  const [amount, setAmount] = useState('5116');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI (PhonePe / GPay)' | 'Bank Transfer'>('UPI (PhonePe / GPay)');
  const [isPledge, setIsPledge] = useState(false);
  const [notes, setNotes] = useState('');
  const [justSubmittedRecord, setJustSubmittedRecord] = useState<CollectionRecord | null>(null);

  // Helper to open modal pre-filled with an upcoming need
  const handleOpenFutureModal = (need?: UpcomingNeed) => {
    if (need) {
      setSelectedPurpose(isTe ? need.titleTe : need.titleEn);
      setTargetDay(need.day);
      setAmount(String(need.suggestedAmount));
    } else {
      setSelectedPurpose(isTe ? UPCOMING_NEEDS[0].titleTe : UPCOMING_NEEDS[0].titleEn);
      setTargetDay(UPCOMING_NEEDS[0].day);
      setAmount('5116');
    }
    setCustomPurpose('');
    setJustSubmittedRecord(null);
    setShowFutureModal(true);
  };

  const handleSaveFutureSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !amount.trim()) return;

    const finalPurpose = customPurpose.trim() || selectedPurpose;
    const finalItemDesc = `${finalPurpose} (${targetDay})`;

    const record = addCollection({
      donorName: donorName.trim(),
      amount: Number(amount) || 0,
      category: 'భవిష్యత్ సేవ (Future Purpose)',
      sponsoredItem: finalItemDesc,
      isFuturePurpose: true,
      futurePurposeDate: targetDay,
      mobile: mobile.trim() || undefined,
      gothram: gothram.trim() || undefined,
      address: address.trim() || undefined,
      paymentMode,
      receivedBy: 'ఆన్‌లైన్ స్పాన్సర్ పోర్టల్',
      notes: isPledge
        ? `[భవిష్యత్ హామీ / Pledge] ${notes.trim()}`
        : notes.trim() || 'భవిష్యత్ సేవా స్పాన్సర్‌షిప్',
    });

    setJustSubmittedRecord(record);
    // Reset form fields
    setDonorName('');
    setMobile('');
    setGothram('');
    setAddress('');
    setNotes('');
  };

  // Filter only collections that have a sponsoredItem or category
  const sponsoredRecords = useMemo(() => {
    return collections.filter((c) => {
      const itemDesc = (c.sponsoredItem || c.notes || c.category || '').toLowerCase();
      const donor = (c.donorName || '').toLowerCase();
      const gothram = (c.gothram || '').toLowerCase();
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        itemDesc.includes(q) || donor.includes(q) || gothram.includes(q);

      if (!matchesSearch) return false;

      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'future') {
        return (
          c.isFuturePurpose === true ||
          c.category.toLowerCase().includes('future') ||
          itemDesc.includes('భవిష్యత్') ||
          itemDesc.includes('రాబోయే')
        );
      }
      if (selectedCategory === 'annadanam') {
        return (
          c.category.toLowerCase().includes('annadanam') ||
          itemDesc.includes('అన్నదాన')
        );
      }
      if (selectedCategory === 'laddu') {
        return (
          c.category.toLowerCase().includes('laddu') ||
          itemDesc.includes('లడ్డూ')
        );
      }
      if (selectedCategory === 'pooja') {
        return (
          c.category.toLowerCase().includes('pooja') ||
          c.category.toLowerCase().includes('harathi') ||
          itemDesc.includes('పూజ') ||
          itemDesc.includes('హారతి') ||
          itemDesc.includes('హోమం')
        );
      }
      return true;
    });
  }, [collections, searchQuery, selectedCategory]);

  const totalSponsorsCount = collections.length;
  const futurePurposeCount = useMemo(() => {
    return collections.filter(
      (c) =>
        c.isFuturePurpose === true ||
        c.category.toLowerCase().includes('future') ||
        (c.sponsoredItem && c.sponsoredItem.includes('భవిష్యత్'))
    ).length;
  }, [collections]);

  const totalSponsoredValue = useMemo(() => {
    return collections.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [collections]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const copyShareText = () => {
    const text = `${settings.teluguTitle}\nశ్రీ వినాయక ఉత్సవ దాతలు & స్పాన్సర్ల గౌరవ జాబితా:\nమొత్తం దాతలు: ${totalSponsorsCount} మంది భక్తులు\nదర్శించండి!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert(isTe ? 'స్పాన్సర్ల వివరాలు కాపీ చేయబడ్డాయి!' : 'Sponsors list link copied!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Exactly as in screenshot 172509, enhanced with Future Purpose action */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-400/40">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-900/60 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-bold text-amber-200 uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-300" />
            <span>{isTe ? 'ప్రజా వీక్షణ • దాతల గౌరవ ఫలకం' : 'Public View • Sponsors Honor Board'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-amber-100 tracking-tight">
            {isTe
              ? 'శ్రీ గణేష్ ఉత్సవ దాతలు & స్పాన్సర్ల జాబితా'
              : 'Ganesh Utsav Sponsors & Donors Board'}
          </h2>

          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            {isTe
              ? 'ఏ భక్తుడు ఏ వస్తువు / సేవను స్పాన్సర్ చేశారో ప్రజలందరికీ పారదర్శకంగా ప్రదర్శించే గౌరవ జాబితా.'
              : 'Publicly transparent display of which festival item or service was sponsored by which devotee.'}
          </p>

          {/* Highlights Row with Future Purpose Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-amber-200">
            <div className="bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span>
                {isTe ? 'మొత్తం స్పాన్సర్లు' : 'Total Sponsors'}:{' '}
                <strong className="text-white">{totalSponsorsCount} మంది</strong>
              </span>
            </div>

            <div className="bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-2">
              <Gift className="w-4 h-4 text-emerald-400" />
              <span>
                {isTe ? 'మొత్తం విరాళాల విలువ' : 'Total Sponsored'}:{' '}
                <strong className="text-emerald-300">{formatCurrency(totalSponsoredValue)}</strong>
              </span>
            </div>

            {futurePurposeCount > 0 && (
              <div className="bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>
                  {isTe ? 'భవిష్యత్ సేవలు' : 'Future Purpose'}:{' '}
                  <strong className="text-yellow-200">{futurePurposeCount} మంది</strong>
                </span>
              </div>
            )}

            {/* Action Buttons: Add Sponsor on Future Purpose & Share */}
            <div className="ml-auto flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleOpenFutureModal()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer border border-amber-200"
                title={isTe ? 'భవిష్యత్ సేవలకు స్పాన్సర్‌గా చేరండి' : 'Add Sponsor for Future Purpose'}
              >
                <Plus className="w-4 h-4 text-stone-950" />
                <span>{isTe ? '+ భవిష్యత్ స్పాన్సర్‌గా చేరండి' : '+ Add Sponsor (Future Purpose)'}</span>
              </button>

              <button
                type="button"
                onClick={copyShareText}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all shadow-sm cursor-pointer"
                title="Share Sponsors List"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isTe ? 'షేర్ చేయండి' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Showcase of Future Purpose Opportunities / Upcoming Festival Needs */}
      {showNeedsShowcase && (
        <div className="bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-amber-100/50 rounded-2xl p-5 border border-amber-300/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  {isTe
                    ? 'రాబోయే సేవా కార్యక్రమాలు - భవిష్యత్ స్పాన్సర్‌షిప్ అంశాలు'
                    : 'Upcoming Festival Needs - Available to Sponsor'}
                </h3>
                <p className="text-[11px] text-amber-800/80">
                  {isTe
                    ? 'కింది వాటిలో ఏదైనా సేవను ఎంచుకుని భవిష్యత్ స్పాన్సర్‌గా మీ పేరు నమోదు చేసుకోండి'
                    : 'Choose any upcoming item to register as a future sponsor'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowNeedsShowcase(false)}
              className="text-stone-400 hover:text-stone-600 text-xs"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {UPCOMING_NEEDS.map((need) => (
              <div
                key={need.id}
                className="bg-white rounded-xl p-3.5 border border-amber-200/90 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between gap-2.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-2xl">{need.icon}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                      {need.day}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-stone-900 text-sm mt-1.5">
                    {isTe ? need.titleTe : need.titleEn}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {isTe ? need.descTe : need.descEn}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase font-semibold">
                      {isTe ? 'సూచించిన మొత్తం' : 'Suggested'}
                    </div>
                    <div className="text-xs font-black text-amber-900 font-mono">
                      {formatCurrency(need.suggestedAmount)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenFutureModal(need)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>{isTe ? 'స్పాన్సర్ చేయండి' : 'Sponsor'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isTe
                  ? 'దాత పేరు లేదా స్పాన్సర్ చేసిన వస్తువుతో వెతకండి (Search sponsor or item)...'
                  : 'Search by donor name or sponsored item...'
              }
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {isTe ? 'అన్నీ (All)' : 'All Items'}
            </button>

            <button
              onClick={() => setSelectedCategory('future')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer ${
                selectedCategory === 'future'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isTe ? 'భవిష్యత్ సేవలు (Future Purpose)' : 'Future Purpose'}</span>
            </button>

            <button
              onClick={() => setSelectedCategory('annadanam')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'annadanam'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {isTe ? 'అన్నదానం (Annadanam)' : 'Annadanam'}
            </button>

            <button
              onClick={() => setSelectedCategory('laddu')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'laddu'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {isTe ? 'లడ్డూ ప్రసాదం (Laddu)' : 'Laddu Prasadam'}
            </button>

            <button
              onClick={() => setSelectedCategory('pooja')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'pooja'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {isTe ? 'పూజ & హారతి (Pooja/Aarti)' : 'Pooja & Aarti'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Sponsors: Item Sponsored -> Sponsored by Person */}
      {sponsoredRecords.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8">
          <Gift className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-700 font-bold text-sm">
            {isTe
              ? 'ఈ శోధనకు ఎటువంటి స్పాన్సర్ వివరాలు కనుగొనబడలేదు'
              : 'No matching sponsor records found'}
          </p>
          <p className="text-xs text-stone-500 mt-1">
            {isTe
              ? 'దయచేసి శోధన పదాన్ని మార్చి ప్రయత్నించండి లేదా పైన "+ భవిష్యత్ స్పాన్సర్‌గా చేరండి" పై క్లిక్ చేయండి.'
              : 'Try adjusting your search criteria or click "+ Add Sponsor (Future Purpose)" above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sponsoredRecords.map((item, idx) => {
            const sponsoredItemDisplay =
              item.sponsoredItem || item.notes || item.category;
            const isFuture =
              item.isFuturePurpose === true ||
              item.category.toLowerCase().includes('future') ||
              sponsoredItemDisplay.toLowerCase().includes('భవిష్యత్') ||
              sponsoredItemDisplay.toLowerCase().includes('రాబోయే');

            return (
              <div
                key={item.id || idx}
                className={`bg-white rounded-2xl p-5 border-2 ${
                  isFuture
                    ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md'
                    : 'border-amber-200 hover:border-amber-400 shadow-sm hover:shadow-md'
                } transition-all relative overflow-hidden flex flex-col justify-between`}
              >
                {/* Decorative Auspicious Top Bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    isFuture
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500'
                      : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600'
                  }`}
                ></div>

                <div className="space-y-3">
                  {/* Top Item Badge */}
                  <div className="flex items-start justify-between gap-3 pt-1">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider">
                        {isFuture ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px]">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>
                              {isTe ? 'భవిష్యత్ సేవ (Future Purpose)' : 'Future Purpose Sponsorship'}
                            </span>
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-700">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{isTe ? 'స్పాన్సర్ చేసిన వస్తువు / సేవ' : 'Item Sponsored'}</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-stone-900 leading-snug">
                        {sponsoredItemDisplay}
                      </h3>
                      {item.futurePurposeDate && (
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>{item.futurePurposeDate}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
                      <div className="text-[10px] uppercase font-bold text-amber-800">
                        {isTe ? 'విరాళం మొత్తం' : 'Amount'}
                      </div>
                      <div className="text-base font-black text-amber-950 font-mono">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                  </div>

                  {/* Sponsored By Person Highlight Card */}
                  <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                        {item.donorName.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-stone-500 uppercase">
                          {isTe ? 'దాత / స్పాన్సర్ చేసిన వ్యక్తి' : 'Sponsored By Person / Family'}
                        </div>
                        <div className="font-bold text-stone-900 text-sm sm:text-base truncate">
                          {item.donorName}
                        </div>
                        {item.gothram && (
                          <div className="text-[11px] text-amber-800 font-medium mt-0.5">
                            గోత్రం: <strong>{item.gothram}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{isTe ? 'స్పాన్సర్డ్' : 'Sponsored'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Sponsoring Date and Location Details */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 pt-1 border-t border-stone-100">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>తేదీ: {item.date}</span>
                    </div>

                    <div className="text-[11px] text-stone-400 font-mono">
                      రశీదు నెం: {item.receiptNo}
                    </div>
                  </div>
                </div>

                {/* Blessings Note */}
                <div className="mt-3 pt-2 text-[11px] text-amber-900/80 bg-amber-50/60 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 italic">
                  <Heart className="w-3 h-3 text-rose-500 shrink-0 fill-rose-500" />
                  <span>
                    {isTe
                      ? 'శ్రీ సిద్ధి వినాయక స్వామివారి దివ్య ఆశీస్సులు మీకు మరియు మీ కుటుంబానికి సదా ఉండుగాక!'
                      : 'May Lord Siddhi Vinayaka bless the donor and their family with health and prosperity!'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Registering a Sponsor for Future Purpose */}
      {showFutureModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white text-stone-900 rounded-3xl shadow-2xl max-w-lg w-full border-2 border-amber-400 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header with Auspicious Gradient */}
            <div className="bg-gradient-to-r from-amber-700 via-orange-600 to-amber-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/30 border border-amber-300/40 flex items-center justify-center shrink-0">
                  <HandHeart className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-amber-100">
                    {isTe ? 'భవిష్యత్ సేవా స్పాన్సర్‌షిప్ నమోదు' : 'Add Sponsor for Future Purpose'}
                  </h3>
                  <p className="text-xs text-amber-200/90">
                    {isTe
                      ? 'రాబోయే ఉత్సవ పూజలు, అన్నదానం మరియు సేవా కార్యక్రమాల నమోదు'
                      : 'Pledge or sponsor upcoming festival days & events'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFutureModal(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If Just Submitted, show Auspicious Receipt Card */}
            {justSubmittedRecord ? (
              <div className="p-6 space-y-4 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-lg font-black text-stone-900">
                    {isTe ? 'స్పాన్సర్‌షిప్ విజయవంతంగా నమోదయింది!' : 'Sponsorship Recorded Successfully!'}
                  </h4>
                  <p className="text-xs text-stone-600">
                    {isTe
                      ? 'దాతల గౌరవ ఫలకంలో మీ వివరాలు వెంటనే చేర్చబడ్డాయి. స్వామివారి ఆశీస్సులు మీ కుటుంబానికి ఉండుగాక!'
                      : 'Your sponsor record is now published live on the honor board.'}
                  </p>
                </div>

                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-300/80 text-left space-y-2 text-xs">
                  <div className="flex justify-between border-b border-amber-200 pb-2">
                    <span className="text-stone-500">{isTe ? 'రశీదు సంఖ్య' : 'Receipt No'}:</span>
                    <strong className="text-stone-900 font-mono font-bold">{justSubmittedRecord.receiptNo}</strong>
                  </div>
                  <div className="flex justify-between border-b border-amber-200 pb-2">
                    <span className="text-stone-500">{isTe ? 'దాత పేరు' : 'Donor'}:</span>
                    <strong className="text-stone-900 font-bold">{justSubmittedRecord.donorName}</strong>
                  </div>
                  <div className="flex justify-between border-b border-amber-200 pb-2">
                    <span className="text-stone-500">{isTe ? 'స్పాన్సర్ చేసిన అంశం' : 'Item'}:</span>
                    <strong className="text-amber-900 font-bold">{justSubmittedRecord.sponsoredItem}</strong>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-bold">
                    <span className="text-stone-700">{isTe ? 'విరాళం మొత్తం' : 'Amount'}:</span>
                    <span className="text-emerald-700 font-mono text-base">{formatCurrency(justSubmittedRecord.amount)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const text = `శ్రీ గణేష్ ఉత్సవాల స్పాన్సర్‌షిప్ రశీదు:\nదాత: ${justSubmittedRecord.donorName}\nసేవ: ${justSubmittedRecord.sponsoredItem}\nమొత్తం: ${formatCurrency(justSubmittedRecord.amount)}\nరశీదు నెం: ${justSubmittedRecord.receiptNo}`;
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(text);
                        alert(isTe ? 'రశీదు వివరాలు కాపీ చేయబడ్డాయి!' : 'Copied to clipboard!');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors"
                  >
                    {isTe ? 'రశీదు కాపీ చేయి' : 'Copy Receipt'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowFutureModal(false)}
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-md"
                  >
                    {isTe ? 'పూర్తయింది (Close)' : 'Done'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveFutureSponsor} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                {/* 1. Select / Pick Purpose */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    {isTe
                      ? 'స్పాన్సర్ చేయాలనుకుంటున్న భవిష్యత్ సేవ / అంశం *'
                      : 'Future Purpose / Event to Sponsor *'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-2">
                    {UPCOMING_NEEDS.map((need) => {
                      const needTitle = isTe ? need.titleTe : need.titleEn;
                      const isSelected = selectedPurpose === needTitle && !customPurpose;
                      return (
                        <button
                          key={need.id}
                          type="button"
                          onClick={() => {
                            setSelectedPurpose(needTitle);
                            setTargetDay(need.day);
                            setCustomPurpose('');
                            setAmount(String(need.suggestedAmount));
                          }}
                          className={`p-2 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-100 border-amber-500 font-bold text-amber-950 ring-2 ring-amber-500/20'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <span className="text-base mr-1">{need.icon}</span>
                          <span className="line-clamp-1">{needTitle}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Or Custom Purpose Input */}
                  <input
                    type="text"
                    value={customPurpose}
                    onChange={(e) => setCustomPurpose(e.target.value)}
                    placeholder={
                      isTe
                        ? 'లేదా ఇతర సేవ పేరు రాయండి (ఉదా: 7వ రోజు పూలమాలలు / డీజే / సౌండ్)...'
                        : 'Or type custom future purpose (e.g. Day 7 flower garlands)...'
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* 2. Target Festival Day or Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isTe ? 'ఏ రోజు సేవ / ఉత్సవ తేదీ *' : 'Festival Day / Target Date *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={targetDay}
                      onChange={(e) => setTargetDay(e.target.value)}
                      placeholder={isTe ? 'ఉదా: 5వ రోజు / నిమజ్జనం రోజు' : 'e.g. Day 5 / Visarjan Day'}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isTe ? 'స్పాన్సర్‌షిప్ మొత్తం (₹) *' : 'Sponsorship Amount (₹) *'}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="5116"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm font-black text-amber-950 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Auspicious Amount Quick Picks */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-stone-500 font-medium mr-1">
                    {isTe ? 'శుభ ప్రదమైన మొత్తం:' : 'Auspicious amounts:'}
                  </span>
                  {[1116, 2116, 5116, 10116, 15116, 25116].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(String(amt))}
                      className="px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold hover:bg-amber-100 font-mono cursor-pointer"
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                {/* 3. Devotee / Sponsor Name & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isTe ? 'భక్తుని / దాత పేరు *' : 'Devotee / Sponsor Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder={isTe ? 'ఉదా: గంధం శ్రీనివాస్ & కుటుంబం' : 'e.g. Srinivas & Family'}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isTe ? 'మొబైల్ నంబర్ (సంప్రదింపుకు)' : 'Mobile Number'}
                    </label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="9849012345"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4. Gothram & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isTe ? 'గోత్రం (పూజ సంకల్పం కోసం)' : 'Gothram (For Sankalpam)'}
                    </label>
                    <input
                      type="text"
                      value={gothram}
                      onChange={(e) => setGothram(e.target.value)}
                      placeholder={isTe ? 'ఉదా: కౌండిన్యస / కాశ్యప' : 'e.g. Koundinyasa'}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {isTe ? 'చిరునామా / కాలనీ' : 'Colony / House No'}
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={isTe ? 'ఉదా: రోడ్ నెం. 3, ఫ్లాట్ 101' : 'e.g. Road 3'}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 5. Payment Mode & Pledge Option */}
                <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-950">
                      {isTe ? 'చెల్లింపు విధానం (Payment Mode)' : 'Payment Mode'}
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-amber-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPledge}
                        onChange={(e) => setIsPledge(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                      />
                      <span>{isTe ? 'ఉత్సవం రోజున చెల్లిస్తాను (Pledge)' : 'Pledge / Pay on Event Day'}</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(['UPI (PhonePe / GPay)', 'Cash', 'Bank Transfer'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPaymentMode(mode)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          paymentMode === mode
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {mode.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Special Wishes / Family Names */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {isTe
                      ? 'కుటుంబ సభ్యుల పేర్లు లేదా విశేష ప్రార్థన (ఐచ్ఛికం)'
                      : 'Family Members Names or Prayer Note (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      isTe
                        ? 'ఉదా: స్వామివారి ఆశీస్సులతో కుటుంబం సుఖశాంతులతో ఉండాలని ప్రార్థన...'
                        : 'e.g. Prayer for family wellbeing and happiness...'
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  ></textarea>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setShowFutureModal(false)}
                    className="px-4 py-2 rounded-xl text-stone-600 text-xs font-semibold hover:bg-stone-100 cursor-pointer"
                  >
                    {isTe ? 'రద్దు చేయి' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-black shadow-md transition-all cursor-pointer"
                  >
                    {isTe ? 'స్పాన్సర్‌గా నమోదు చేయి' : 'Confirm Sponsorship'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
