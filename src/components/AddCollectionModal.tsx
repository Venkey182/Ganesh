import React, { useState } from 'react';
import { useUtsav } from '../context/UtsavContext';
import { CollectionRecord } from '../types';
import {
  X,
  Plus,
  Receipt,
  User,
  Phone,
  Layers,
  Sparkles,
  CreditCard,
  Building,
} from 'lucide-react';

interface AddCollectionModalProps {
  initialData?: CollectionRecord | null;
  onClose: () => void;
  onSuccess: (record: CollectionRecord) => void;
  onOpenDynamicFieldManager?: () => void;
}

export const AddCollectionModal: React.FC<AddCollectionModalProps> = ({
  initialData,
  onClose,
  onSuccess,
  onOpenDynamicFieldManager,
}) => {
  const {
    collectionCategories,
    addCollection,
    updateCollection,
    dynamicFields,
    currentUser,
    language,
  } = useUtsav();

  const isTe = language === 'te';

  const [donorName, setDonorName] = useState(initialData?.donorName || '');
  const [sponsoredItem, setSponsoredItem] = useState(initialData?.sponsoredItem || '');
  const [amount, setAmount] = useState(initialData?.amount ? String(initialData.amount) : '');
  const [category, setCategory] = useState(
    initialData?.category || collectionCategories[0]?.name || 'General Chanda'
  );
  const [mobile, setMobile] = useState(initialData?.mobile || '');
  const [gothram, setGothram] = useState(initialData?.gothram || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI (PhonePe / GPay)' | 'Bank Transfer'>(
    initialData?.paymentMode || 'UPI (PhonePe / GPay)'
  );
  const [receivedBy, setReceivedBy] = useState(
    initialData?.receivedBy || currentUser.name || 'కమిటీ అడ్మిన్'
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split('T')[0]
  );
  const [isFuturePurpose, setIsFuturePurpose] = useState<boolean>(
    initialData?.isFuturePurpose || false
  );
  const [futurePurposeDate, setFuturePurposeDate] = useState<string>(
    initialData?.futurePurposeDate || ''
  );

  // Telugu traditional auspicious amounts
  const auspiciousAmounts = [501, 1116, 2116, 5116, 11116, 25000];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!donorName.trim() || !numAmount || numAmount <= 0) {
      alert(isTe ? 'దయచేసి దాత పేరు మరియు సరైన మొత్తాన్ని నమోదు చేయండి' : 'Please enter donor name and valid amount');
      return;
    }

    if (initialData) {
      const updated: CollectionRecord = {
        ...initialData,
        donorName: donorName.trim(),
        sponsoredItem: sponsoredItem.trim() || undefined,
        isFuturePurpose,
        futurePurposeDate: isFuturePurpose ? (futurePurposeDate.trim() || undefined) : undefined,
        amount: numAmount,
        category,
        mobile: mobile.trim() || undefined,
        gothram: gothram.trim() || undefined,
        address: address.trim() || undefined,
        paymentMode,
        date,
        receivedBy: receivedBy.trim(),
        notes: notes.trim() || undefined,
      };
      updateCollection(updated);
      onSuccess(updated);
    } else {
      const created = addCollection({
        donorName: donorName.trim(),
        sponsoredItem: sponsoredItem.trim() || undefined,
        isFuturePurpose,
        futurePurposeDate: isFuturePurpose ? (futurePurposeDate.trim() || undefined) : undefined,
        amount: numAmount,
        category,
        mobile: mobile.trim() || undefined,
        gothram: gothram.trim() || undefined,
        address: address.trim() || undefined,
        paymentMode,
        date,
        receivedBy: receivedBy.trim(),
        notes: notes.trim() || undefined,
      });
      onSuccess(created);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-emerald-300 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {initialData
                  ? isTe
                    ? `చందా రశీదు సవరణ (${initialData.receiptNo})`
                    : `Edit Collection (${initialData.receiptNo})`
                  : isTe
                  ? 'నూతన చందా రశీదు నమోదు'
                  : 'New Devotee Collection / Chanda'}
              </h2>
              <p className="text-xs text-emerald-100">
                {isTe ? 'దాత వివరాలు నమోదు చేసి తక్షణ డిజిటల్ రశీదును రూపొందించండి' : 'Record donation & generate instant receipt'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Quick Auspicious Amounts */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">
              {isTe ? 'శుభ సూచక విరాళ మొత్తం (Quick Auspicious Amount)' : 'Select Auspicious Amount'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {auspiciousAmounts.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setAmount(String(amt))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                    amount === String(amt)
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isTe ? 'విరాళం మొత్తం (Amount in ₹) *' : 'Donation Amount (₹) *'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5116"
                  className="w-full pl-8 pr-3 py-2 text-base font-bold text-emerald-700 rounded-xl bg-stone-50 border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isTe ? 'తేదీ (Date) *' : 'Date *'}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Donor Name */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isTe ? 'దాత పేరు (Donor Name) *' : 'Donor Full Name *'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder={isTe ? 'ఉదా: గార్లపాటి శ్రీనివాసరావు & కుటుంబం' : 'e.g., G. Srinivasa Rao & Family'}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Sponsored Item / Cause */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-emerald-950 uppercase tracking-wide">
                {isTe ? 'స్పాన్సర్ చేసిన వస్తువు / సేవ (Item Sponsored)' : 'Item Sponsored (Public Honor Board)'}
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">
                {isTe ? 'ప్రజా వీక్షణ జాబితా' : 'Public List'}
              </span>
            </div>
            <input
              type="text"
              value={sponsoredItem}
              onChange={(e) => setSponsoredItem(e.target.value)}
              placeholder={
                isTe
                  ? 'ఉదా: 1వ రోజు మహా అన్నదానం (1000 మందికి) లేదా గణేష్ విగ్రహం లేదా లడ్డూ ప్రసాదం'
                  : 'e.g., Day 1 Maha Annadanam, Ganesh Idol, Laddu Prasadam, Mandapam Decoration'
              }
              className="w-full px-3 py-2 rounded-xl bg-white border border-emerald-300 text-xs sm:text-sm font-medium text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <p className="text-[11px] text-stone-500 italic">
              {isTe
                ? 'ఏ భక్తుడు ఏ వస్తువు స్పాన్సర్ చేశారో ప్రజా వీక్షణ (Public Sponsors List) లో ప్రదర్శించబడుతుంది.'
                : 'Displayed in the public sponsors board showing which item this devotee sponsored.'}
            </p>
          </div>

          {/* Future Purpose Sponsorship Toggle & Details */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              isFuturePurpose
                ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/20'
                : 'bg-stone-50 border-stone-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isFuturePurpose}
                  onChange={(e) => setIsFuturePurpose(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>
                    {isTe
                      ? 'భవిష్యత్ సేవా స్పాన్సర్‌షిప్ (Future Purpose Sponsor)'
                      : 'Future Purpose Sponsorship'}
                  </span>
                </span>
              </label>

              {isFuturePurpose && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  {isTe ? 'రాబోయే కార్యక్రమం' : 'Upcoming Event'}
                </span>
              )}
            </div>

            {isFuturePurpose && (
              <div className="mt-2.5 pt-2 border-t border-amber-200/80 space-y-2">
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    {isTe ? 'ఏ ఉత్సవ రోజు / భవిష్యత్ కార్యక్రమం?' : 'Target Festival Day / Future Event'}
                  </label>
                  <div className="flex gap-1.5 flex-wrap mb-1.5">
                    {['3వ రోజు', '5వ రోజు', '7వ రోజు', '9వ రోజు', 'నిమజ్జనం రోజు', 'శాశ్వత నిధి'].map(
                      (tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setFuturePurposeDate(tag)}
                          className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border cursor-pointer ${
                            futurePurposeDate === tag
                              ? 'bg-amber-600 text-white border-amber-600'
                              : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100/50'
                          }`}
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                  <input
                    type="text"
                    value={futurePurposeDate}
                    onChange={(e) => setFuturePurposeDate(e.target.value)}
                    placeholder={
                      isTe
                        ? 'ఉదా: 5వ రోజు మహా అన్నదానం లేదా 2026-09-14'
                        : 'e.g., Day 5 Mahaprasadam or Date'
                    }
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Category Selector with Inline Field Manager */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700">
                {isTe ? 'చందా విభాగం (Category / Purpose) *' : 'Donation Category *'}
              </label>
              {onOpenDynamicFieldManager && (
                <button
                  type="button"
                  onClick={onOpenDynamicFieldManager}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isTe ? '+ క్రొత్త విభాగం జోడించు' : '+ Add Dynamic Field'}</span>
                </button>
              )}
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-semibold text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {collectionCategories.map((c) => (
                <option key={c.key} value={c.name}>
                  {isTe ? `${c.teluguName} (${c.name})` : c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Phone & Gothram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isTe ? 'మొబైల్ నంబర్ (WhatsApp రశీదు కోసం)' : 'Mobile (for WhatsApp receipt)'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="98490XXXXX"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isTe ? 'గోత్రం (Gothram)' : 'Gothram'}
              </label>
              <input
                type="text"
                value={gothram}
                onChange={(e) => setGothram(e.target.value)}
                placeholder="ఉదా: కౌండిన్యస / భారద్వాజ"
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Address / Flat No */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {isTe ? 'చిరునామా / ఫ్లాట్ నంబర్' : 'Address / Flat or Plot No'}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ప్లాట్ నెం. 42, రోడ్ నెం. 3"
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {isTe ? 'చెల్లింపు విధానం (Payment Mode)' : 'Payment Mode'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['UPI (PhonePe / GPay)', 'Cash', 'Bank Transfer'] as const).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    paymentMode === mode
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {mode.includes('UPI') ? 'PhonePe/GPay' : mode}
                </button>
              ))}
            </div>
          </div>

          {/* Collector Name & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isTe ? 'స్వీకరించిన అడ్మిన్ పేరు' : 'Received By Admin'}
              </label>
              <input
                type="text"
                value={receivedBy}
                onChange={(e) => setReceivedBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isTe ? 'ప్రత్యేక సూచనలు (Notes)' : 'Special Notes'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ఉదా: మొదటి రోజు అన్నదానం"
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              <span>
                {initialData
                  ? isTe
                    ? 'రశీదు వివరాలు నవీకరించు'
                    : 'Update Collection Record'
                  : isTe
                  ? 'రశీదును జారీ చేసి భద్రపరచు (Save & Issue Receipt)'
                  : 'Save Collection & Issue Receipt'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
