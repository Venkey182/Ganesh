import React, { useState } from 'react';
import { useUtsav } from '../context/UtsavContext';
import {
  Layers,
  Plus,
  Trash2,
  X,
  Check,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from 'lucide-react';

interface DynamicFieldManagerProps {
  onClose: () => void;
}

export const DynamicFieldManager: React.FC<DynamicFieldManagerProps> = ({ onClose }) => {
  const { dynamicFields, addDynamicField, deleteDynamicField, language, isAdmin } = useUtsav();

  const [target, setTarget] = useState<'collection' | 'expense'>('collection');
  const [name, setName] = useState('');
  const [teluguName, setTeluguName] = useState('');
  const [isCategory, setIsCategory] = useState(true);
  const [fieldType, setFieldType] = useState<'text' | 'number' | 'category'>('category');
  const [statusMsg, setStatusMsg] = useState('');

  const isTe = language === 'te';

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addDynamicField({
      target,
      name: name.trim(),
      teluguName: teluguName.trim() || name.trim(),
      type: isCategory ? 'category' : fieldType,
      isCategory,
      required: false,
    });

    setStatusMsg(
      isTe
        ? 'ఫీల్డ్ విజయవంతంగా జోడించబడింది! నూతన రశీదుల నమోదులో వెంటనే అందుబాటులో ఉంటుంది.'
        : 'Field added successfully! It is now immediately available in forms.'
    );

    setName('');
    setTeluguName('');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const collectionFields = dynamicFields.filter((f) => f.target === 'collection');
  const expenseFields = dynamicFields.filter((f) => f.target === 'expense');

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-amber-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Layers className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {isTe ? 'డైనమిక్ ఫీల్డ్స్ & కేటగిరీల నిర్వహణ' : 'Dynamic Fields & Categories'}
              </h2>
              <p className="text-xs text-amber-100">
                {isTe
                  ? 'కొత్త రకమైన చందా లేదా ఖర్చును తక్షణమే సృష్టించండి'
                  : 'Add or modify any collection & expense categories dynamically'}
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

        <div className="p-5 sm:p-6 space-y-6">
          {statusMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Form to add a new dynamic field */}
          {isAdmin && (
            <form onSubmit={handleAddField} className="bg-amber-50/60 rounded-xl p-4 border border-amber-200/80 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{isTe ? 'నూతన ఫీల్డ్ లేదా కేటగిరీని సృష్టించండి' : 'Create New Dynamic Field or Category'}</span>
              </div>

              {/* Target Selector */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTarget('collection');
                    setIsCategory(true);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all ${
                    target === 'collection'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{isTe ? 'వసూళ్లు (Collections)' : 'Collection Field'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTarget('expense');
                    setIsCategory(true);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all ${
                    target === 'expense'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>{isTe ? 'ఖర్చులు (Expenses)' : 'Expense Field'}</span>
                </button>
              </div>

              {/* Field Names in Telugu & English */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isTe ? 'ఫీల్డ్ పేరు (English లో)' : 'Field Name (in English)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Flower Garlands Sponsor"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isTe ? 'ఫీల్డ్ పేరు (తెలుగులో - ఐచ్ఛికం)' : 'Field Name (in Telugu)'}
                  </label>
                  <input
                    type="text"
                    value={teluguName}
                    onChange={(e) => setTeluguName(e.target.value)}
                    placeholder="ఉదా: పూల అలంకరణ స్పాన్సర్"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category vs Extra Attribute */}
              <div className="flex items-center gap-4 text-xs font-medium text-stone-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="fieldMode"
                    checked={isCategory}
                    onChange={() => {
                      setIsCategory(true);
                      setFieldType('category');
                    }}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>
                    {isTe
                      ? 'ప్రధాన విభాగం (Category - ఉదా: అన్నదానం, లడ్డూ వేలం)'
                      : 'Main Purpose Category'}
                  </span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="fieldMode"
                    checked={!isCategory}
                    onChange={() => {
                      setIsCategory(false);
                      setFieldType('text');
                    }}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>
                    {isTe
                      ? 'అదనపు వివరాల ఫీల్డ్ (Extra Field - ఉదా: గోత్రం, వాహనం నెం)'
                      : 'Extra Field'}
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{isTe ? '+ నూతన ఫీల్డ్ జోడించండి' : '+ Add Dynamic Field'}</span>
              </button>
            </form>
          )}

          {/* Existing Fields Lists */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-800 border-b border-stone-200 pb-2">
              {isTe ? 'ప్రస్తుతం ఉన్న ఫీల్డ్స్ & కేటగిరీలు' : 'Configured Dynamic Categories & Fields'}
            </h3>

            {/* Collection Fields */}
            <div>
              <div className="text-xs font-bold text-emerald-800 uppercase mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{isTe ? 'వసూళ్ల విభాగాలు (Collection Heads)' : 'Collection Heads'} ({collectionFields.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {collectionFields.map((f) => (
                  <div
                    key={f.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold"
                  >
                    <span>{f.teluguName || f.name}</span>
                    <span className="text-[10px] text-emerald-600">({f.name})</span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => deleteDynamicField(f.id)}
                        className="text-emerald-400 hover:text-rose-600 transition-colors ml-1"
                        title="Delete Field"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Fields */}
            <div className="pt-2">
              <div className="text-xs font-bold text-rose-800 uppercase mb-2 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{isTe ? 'ఖర్చుల విభాగాలు (Expense Heads)' : 'Expense Heads'} ({expenseFields.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {expenseFields.map((f) => (
                  <div
                    key={f.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold"
                  >
                    <span>{f.teluguName || f.name}</span>
                    <span className="text-[10px] text-rose-600">({f.name})</span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => deleteDynamicField(f.id)}
                        className="text-rose-400 hover:text-rose-600 transition-colors ml-1"
                        title="Delete Field"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs sm:text-sm font-semibold transition-colors"
          >
            {isTe ? 'పూర్తయింది (Close)' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
