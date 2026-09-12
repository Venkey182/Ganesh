import React, { useState } from 'react';
import { useUtsav } from '../context/UtsavContext';
import { ExpenseRecord } from '../types';
import {
  X,
  Plus,
  ReceiptText,
  User,
  Store,
  CreditCard,
  Layers,
  Sparkles,
  Paperclip,
} from 'lucide-react';

interface AddExpenseModalProps {
  initialData?: ExpenseRecord | null;
  onClose: () => void;
  onSuccess: (record: ExpenseRecord) => void;
  onOpenDynamicFieldManager?: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  initialData,
  onClose,
  onSuccess,
  onOpenDynamicFieldManager,
}) => {
  const {
    expenseCategories,
    addExpense,
    updateExpense,
    currentUser,
    language,
  } = useUtsav();

  const isTe = language === 'te';

  const [purpose, setPurpose] = useState(initialData?.purpose || '');
  const [purchasedItems, setPurchasedItems] = useState(initialData?.purchasedItems || '');
  const [amount, setAmount] = useState(initialData?.amount ? String(initialData.amount) : '');
  const [category, setCategory] = useState(
    initialData?.category || expenseCategories[0]?.name || 'Pandal & Tent Decoration'
  );
  const [spentBy, setSpentBy] = useState(
    initialData?.spentBy || currentUser.name || 'కమిటీ సభ్యుడు'
  );
  const [vendorName, setVendorName] = useState(initialData?.vendorName || '');
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split('T')[0]
  );
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Bank Transfer'>(
    initialData?.paymentMode || 'Cash'
  );
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [internalReceiptDoc, setInternalReceiptDoc] = useState(
    initialData?.internalReceiptDoc || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!purpose.trim() || !numAmount || numAmount <= 0) {
      alert(
        isTe
          ? 'దయచేసి ఖర్చు ఉద్దేశం మరియు మొత్తాన్ని నమోదు చేయండి'
          : 'Please enter purpose and valid amount'
      );
      return;
    }

    if (initialData) {
      const updated: ExpenseRecord = {
        ...initialData,
        purpose: purpose.trim(),
        purchasedItems: purchasedItems.trim() || undefined,
        amount: numAmount,
        category,
        spentBy: spentBy.trim(),
        vendorName: vendorName.trim() || undefined,
        date,
        paymentMode,
        notes: notes.trim() || undefined,
        internalReceiptDoc: internalReceiptDoc.trim() || undefined,
      };
      updateExpense(updated);
      onSuccess(updated);
    } else {
      const created = addExpense({
        purpose: purpose.trim(),
        purchasedItems: purchasedItems.trim() || undefined,
        amount: numAmount,
        category,
        spentBy: spentBy.trim(),
        vendorName: vendorName.trim() || undefined,
        date,
        paymentMode,
        notes: notes.trim() || undefined,
        internalReceiptDoc: internalReceiptDoc.trim() || undefined,
      });
      onSuccess(created);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-rose-300 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <ReceiptText className="w-5 h-5 text-rose-100" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {initialData
                  ? isTe
                    ? `ఖర్చు వోచర్ సవరణ (${initialData.voucherNo})`
                    : `Edit Expense (${initialData.voucherNo})`
                  : isTe
                  ? 'నూతన ఖర్చు నమోదు (New Expense)'
                  : 'Record Festival Expense'}
              </h2>
              <p className="text-xs text-rose-100">
                {isTe ? 'ఏ పనులకు ఖర్చు చేశారు మరియు రసీదు వివరాలు' : 'Enter expenditure details and purpose'}
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
          {/* Purpose (Which Purpose Spent) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              {isTe ? 'ఖర్చు ఉద్దేశం (ఏ పనికి ఖర్చు చేశారు?) *' : 'Expense Purpose (Which purpose spent) *'}
            </label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder={
                isTe
                  ? 'ఉదా: టెంట్ కర్టెన్లు, సౌండ్ బాక్స్‌లు లేదా అన్నదానం కూరగాయలు'
                  : 'e.g., Pandal tent decoration, Sound boxes or Daily vegetables'
              }
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-medium text-stone-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Manually Entered Items Purchased */}
          <div className="bg-rose-50/70 border border-rose-200 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-rose-950 uppercase tracking-wide">
                {isTe ? 'కొనుగోలు చేసిన వస్తువులు (Items Purchased - Manually Entered) *' : 'Purchased Items (Manually Entered) *'}
              </label>
              <span className="text-[10px] text-rose-700 font-semibold bg-rose-100 px-2 py-0.5 rounded-full">
                {isTe ? 'మాన్యువల్ ఎంట్రీ' : 'Manual Entry'}
              </span>
            </div>
            <textarea
              required
              rows={2}
              value={purchasedItems}
              onChange={(e) => setPurchasedItems(e.target.value)}
              placeholder={
                isTe
                  ? 'ఉదా: 50 కిలోల సోనా మసూరి బియ్యం (2 బస్తాలు), 15 కిలోల పప్పు, 10 లీటర్ల నూనె, విస్తరాకులు (300) లేదా 4 జేబీఎల్ బాక్స్‌లు, మైక్ సెట్, వైరింగ్'
                  : 'e.g., 50kg rice (2 bags), 15kg dal, 10L oil, 300 plates OR 4 JBL speakers, 2 mics, 100m wiring'
              }
              className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-xs sm:text-sm font-medium text-stone-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <p className="text-[11px] text-stone-600 italic">
              {isTe
                ? 'ఏ ఏ వస్తువులు కొనుగోలు చేశారో వివరాలు మరియు పరిమాణాలను ఇక్కడ నమోదు చేయండి.'
                : 'Enter the exact items and quantities purchased for this expenditure.'}
            </p>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isTe ? 'ఖర్చు మొత్తం (Amount in ₹) *' : 'Amount (₹) *'}
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
                  placeholder="e.g. 8000"
                  className="w-full pl-8 pr-3 py-2 text-base font-bold text-rose-600 rounded-xl bg-stone-50 border border-stone-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isTe ? 'ఖర్చు చేసిన తేదీ *' : 'Date *'}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Dynamic Category Selector with Inline Field Manager */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700">
                {isTe ? 'ఖర్చు విభాగం (Expense Category) *' : 'Expense Category *'}
              </label>
              {onOpenDynamicFieldManager && (
                <button
                  type="button"
                  onClick={onOpenDynamicFieldManager}
                  className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isTe ? '+ క్రొత్త విభాగం జోడించు' : '+ Add Dynamic Field'}</span>
                </button>
              )}
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm font-semibold text-stone-800 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              {expenseCategories.map((c) => (
                <option key={c.key} value={c.name}>
                  {isTe ? `${c.teluguName} (${c.name})` : c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Vendor Name & Paid By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isTe ? 'దుకాణం / వెండర్ పేరు' : 'Vendor / Shop Name'}
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder={isTe ? 'ఉదా: శ్రీ బాలాజీ టెంట్ హౌస్' : 'e.g. Balaji Tent House'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isTe ? 'ఖర్చు చేసిన కమిటీ సభ్యుడు *' : 'Paid By Committee Member *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={spentBy}
                  onChange={(e) => setSpentBy(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {isTe ? 'చెల్లింపు విధానం (Payment Mode)' : 'Payment Mode'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Cash', 'UPI', 'Bank Transfer'] as const).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    paymentMode === mode
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Internal Receipt Memo / Bill No */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {isTe ? 'అంతర్గత బిల్లు / రసీదు నంబర్ (ఐచ్ఛికం)' : 'Internal Bill / Receipt Ref (Optional)'}
            </label>
            <div className="relative">
              <Paperclip className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={internalReceiptDoc}
                onChange={(e) => setInternalReceiptDoc(e.target.value)}
                placeholder="ఉదా: ఇన్వాయిస్ నం. 842 లేదా రసీదు లింక్"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>
            <p className="text-[11px] text-stone-500 mt-1 italic">
              {isTe
                ? 'గమనిక: డాష్‌బోర్డ్‌లో రసీదుల ఫోటోల రద్దీ లేకుండా ఈ సమాచారం కేవలం అంతర్గత ఆడిట్ కోసం దాచబడుతుంది.'
                : 'Notice: Kept for internal committee verification and hidden from the dashboard view.'}
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {isTe ? 'అదనపు వివరాలు (Notes)' : 'Additional Notes'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ఉదా: 9 రోజుల అద్దె బిల్లు చెల్లించాము"
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <ReceiptText className="w-4 h-4" />
              <span>
                {initialData
                  ? isTe
                    ? 'ఖర్చు వివరాలు నవీకరించు'
                    : 'Update Expense'
                  : isTe
                  ? 'ఖర్చు వోచర్‌ను భద్రపరచు (Save Expense Voucher)'
                  : 'Save Expense Record'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
