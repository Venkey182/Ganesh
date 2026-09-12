import React from 'react';
import { useUtsav } from '../context/UtsavContext';
import { CollectionRecord } from '../types';
import {
  X,
  Printer,
  Share2,
  Sparkles,
  CheckCircle2,
  MapPin,
  Phone,
} from 'lucide-react';

interface ReceiptCardProps {
  collection: CollectionRecord;
  onClose: () => void;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ collection, onClose }) => {
  const { settings, language } = useUtsav();
  const isTe = language === 'te';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `🙏 *${settings.teluguTitle}* 🙏\n\nరశీదు నెం: ${collection.receiptNo}\nదాత పేరు: ${collection.donorName}\nమొత్తం: ₹${collection.amount}\nవిభాగం: ${collection.category}\nతేదీ: ${collection.date}\nస్వీకరించిన వారు: ${collection.receivedBy}\n\nస్వామివారి కృపా కటాక్షములు మీ కుటుంబానికి ఎల్లప్పుడూ ఉండాలని ప్రార్థిస్తున్నాము! || గణపతి బప్పా మోరియా ||`;
    const cleanPhone = collection.mobile ? collection.mobile.replace(/\D/g, '') : '';
    const url = cleanPhone
      ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Printable Receipt Frame */}
        <div id="printable-receipt" className="p-6 sm:p-8 bg-amber-50/40 relative">
          {/* Watermark/Emblem */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Sparkles className="w-72 h-72 text-amber-900" />
          </div>

          {/* Close button (hidden during print) */}
          <div className="flex justify-end print:hidden mb-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Header */}
          <div className="text-center border-b-2 border-dashed border-amber-300 pb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500 mx-auto mb-2 bg-white shadow-xs">
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-amber-950 font-heading">
              {settings.teluguTitle}
            </h2>
            <p className="text-xs font-semibold text-amber-800">{settings.teluguSubTitle}</p>
            <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-center gap-1">
              <MapPin className="w-3 h-3 text-amber-700" />
              <span>{settings.venue}</span>
            </div>
          </div>

          {/* Receipt Badge */}
          <div className="flex items-center justify-between mt-4 text-xs font-bold text-stone-700">
            <div className="bg-amber-100 text-amber-900 px-3 py-1 rounded-lg border border-amber-300 font-mono">
              రశీదు నెం: {collection.receiptNo}
            </div>
            <div className="text-stone-600">తేదీ: {collection.date}</div>
          </div>

          {/* Donor & Amount Details */}
          <div className="mt-5 space-y-3 bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs text-xs sm:text-sm">
            <div className="flex justify-between items-start border-b border-stone-100 pb-2">
              <span className="text-stone-500 font-medium">దాత పేరు (Donor):</span>
              <span className="font-extrabold text-stone-900 text-right">
                {collection.donorName}
              </span>
            </div>

            {collection.gothram && (
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <span className="text-stone-500 font-medium">గోత్రం (Gothram):</span>
                <span className="font-semibold text-stone-800">{collection.gothram}</span>
              </div>
            )}

            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <span className="text-stone-500 font-medium">విరాళ విభాగం (Category):</span>
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                {collection.category}
              </span>
            </div>

            {collection.sponsoredItem && (
              <div className="flex justify-between items-start border-b border-stone-100 pb-2">
                <span className="text-stone-500 font-medium">స్పాన్సర్ సేవ (Sponsored):</span>
                <span className="font-semibold text-amber-900 text-right max-w-[220px]">
                  {collection.sponsoredItem}
                  {collection.futurePurposeDate && (
                    <span className="block text-[10px] text-amber-700 font-bold">
                      🌟 భవిష్యత్ కార్యక్రమం: {collection.futurePurposeDate}
                    </span>
                  )}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center border-b border-stone-100 pb-2">
              <span className="text-stone-500 font-medium">చెల్లింపు విధానం (Mode):</span>
              <span className="font-medium text-stone-700">{collection.paymentMode}</span>
            </div>

            {collection.mobile && (
              <div className="flex justify-between items-center border-b border-stone-100 pb-2">
                <span className="text-stone-500 font-medium">మొబైల్ నంబర్:</span>
                <span className="font-mono text-stone-800">{collection.mobile}</span>
              </div>
            )}

            {/* Prominent Amount Box */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-xl border border-emerald-200 flex items-center justify-between">
              <span className="font-bold text-emerald-950">స్వీకరించిన మొత్తం:</span>
              <span className="text-2xl font-black text-emerald-700 font-mono">
                {formatCurrency(collection.amount)}
              </span>
            </div>
          </div>

          {/* Devotional Footer Note */}
          <div className="mt-5 text-center space-y-1">
            <p className="text-xs text-amber-900 font-bold">
              గణపతి బప్పా మోరియా! మంగళమూర్తి మోరియా!
            </p>
            <p className="text-[11px] text-stone-500 leading-snug">
              శ్రీ విఘ్నేశ్వరుని కృపా కటాక్షములు మీ కుటుంబానికి సదా లభించాలని ప్రార్థిస్తున్నాము.
            </p>
            <div className="pt-4 flex items-center justify-between text-xs text-stone-600 border-t border-dashed border-amber-300 mt-4">
              <span>నిర్వాహకుడు: {collection.receivedBy}</span>
              <span className="font-bold text-amber-900">ఉత్సవ కమిటీ ఆమోదం ✔️</span>
            </div>
          </div>
        </div>

        {/* Action Controls (Print & WhatsApp) */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>రశీదు ప్రింట్ (Print)</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp రశీదు</span>
          </button>
        </div>
      </div>
    </div>
  );
};
