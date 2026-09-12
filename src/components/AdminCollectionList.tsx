import React, { useState, useMemo } from 'react';
import { useUtsav } from '../context/UtsavContext';
import { CollectionRecord } from '../types';
import {
  Lock,
  LogIn,
  Search,
  Plus,
  Share2,
  Receipt,
  Edit2,
  Trash2,
  Phone,
  Calendar,
  CheckCircle2,
  FileSpreadsheet,
  Users,
  Sparkles,
} from 'lucide-react';

interface AdminCollectionListProps {
  onOpenLogin: () => void;
  onOpenAddCollection: () => void;
  onEditCollection: (col: CollectionRecord) => void;
  onViewReceipt: (col: CollectionRecord) => void;
}

export const AdminCollectionList: React.FC<AdminCollectionListProps> = ({
  onOpenLogin,
  onOpenAddCollection,
  onEditCollection,
  onViewReceipt,
}) => {
  const { collections, deleteCollection, language, isAdmin, collectionCategories, totalReceived } =
    useUtsav();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const isTe = language === 'te';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredCollections = useMemo(() => {
    return collections.filter((item) => {
      const matchesSearch =
        item.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.mobile && item.mobile.includes(searchTerm)) ||
        (item.gothram && item.gothram.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.address && item.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.receivedBy && item.receivedBy.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [collections, searchTerm, selectedCategory]);

  const filteredSubtotal = useMemo(() => {
    return filteredCollections.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [filteredCollections]);

  // WhatsApp share helper for donor receipt
  const handleShareWhatsApp = (col: CollectionRecord) => {
    const text = `🙏 *శ్రీ గణేష్ ఉత్సవ కమిటీ - 2026* 🙏\n\nరశీదు నెం: ${col.receiptNo}\nదాత పేరు: ${col.donorName}\nమొత్తం: ₹${col.amount}\nవిభాగం: ${col.category}\nతేదీ: ${col.date}\nస్వీకరించిన వారు: ${col.receivedBy}\n\nస్వామివారి కృపా కటాక్షములు మీ కుటుంబానికి ఎల్లప్పుడూ ఉండాలని ప్రార్థిస్తున్నాము! || గణపతి బప్పా మోరియా ||`;
    const cleanPhone = col.mobile ? col.mobile.replace(/\D/g, '') : '';
    const url = cleanPhone
      ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Export CSV for committee
  const handleExportCSV = () => {
    const headers = ['Receipt No', 'Donor Name', 'Amount (INR)', 'Category', 'Mobile', 'Gothram', 'Address', 'Date', 'Received By'];
    const rows = collections.map((c) => [
      c.receiptNo,
      `"${c.donorName.replace(/"/g, '""')}"`,
      c.amount,
      `"${c.category}"`,
      c.mobile || '',
      `"${c.gothram || ''}"`,
      `"${c.address || ''}"`,
      c.date,
      `"${c.receivedBy}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ganesh_Utsav_Collections_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // RULE 2: "2. admins only see collection data"
  // If NOT admin, show privacy lock notice
  if (!isAdmin) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-amber-200/80 p-6 sm:p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8 text-amber-700" />
        </div>

        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold text-stone-900">
            {isTe
              ? 'వసూళ్ల వివరాలు (కేవలం కమిటీ అడ్మిన్లకు మాత్రమే)'
              : 'Collection Data (Restricted to Admins Only)'}
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            {isTe
              ? 'దాతల గోప్యత మరియు ఉత్సవ కమిటీ భద్రతా నియమావళి ప్రకారం, విరాళాలు ఇచ్చిన వారి పూర్తి పేర్లు మరియు ఫోన్ నంబర్లు కేవలం అధీకృత అడ్మిన్లకు మాత్రమే కనిపిస్తాయి.'
              : 'Per committee privacy policy, individual collection data and donor contact lists are exclusively accessible to logged-in committee admins.'}
          </p>
        </div>

        {/* Public Aggregates preview */}
        <div className="inline-flex items-center gap-4 bg-amber-50/80 px-4 py-2.5 rounded-xl border border-amber-200/80 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isTe ? 'మొత్తం వసూళ్లు:' : 'Total Received:'} {formatCurrency(totalReceived)}</span>
          </div>
          <span className="text-amber-300">|</span>
          <div className="flex items-center gap-1.5 font-medium text-stone-700">
            <Users className="w-4 h-4 text-amber-700" />
            <span>{collections.length} {isTe ? 'మంది దాతలు' : 'Registered Donors'}</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onOpenLogin}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>{isTe ? 'అడ్మిన్ మొబైల్ OTP ద్వారా లాగిన్ అవ్వండి' : 'Admin Login with Mobile OTP'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Admin View (Unlocked)
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-200/80 p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">
              {isTe ? 'వసూళ్ల వివరాలు & చందా రశీదులు' : 'Collection Records & Receipts'}
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full">
              Admin Exclusive
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {isTe
              ? 'దాతల వివరాలు, రశీదు నంబర్లు, గోత్రం మరియు వాట్సాప్ రశీదు పంపే సదుపాయం.'
              : 'Donor ledger, numbered receipts, gothram details, and instant WhatsApp receipt generator.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold transition-colors"
            title="Export Collections as CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Excel/CSV Export</span>
          </button>

          <button
            onClick={onOpenAddCollection}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{isTe ? '+ చందా రశీదు రాయండి' : '+ Add Collection'}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
            selectedCategory === 'ALL'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
          }`}
        >
          {isTe ? 'అన్ని విరాళాలు' : 'All Collections'} ({collections.length})
        </button>

        {collectionCategories.map((cat) => {
          const count = collections.filter((c) => c.category === cat.name || c.category === cat.teluguName).length;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
                selectedCategory === cat.name
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>{isTe ? cat.teluguName : cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCategory === cat.name
                    ? 'bg-emerald-800 text-emerald-100'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Subtotal Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              isTe
                ? 'దాత పేరు, రశీదు నం, ఫోన్, గోత్రం లేదా ఊరు శోధించండి...'
                : 'Search donor name, receipt number, phone, gothram...'
            }
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <span>{isTe ? 'ఎంచుకున్న మొత్తం:' : 'Filtered Subtotal:'}</span>
          <span className="text-sm font-extrabold text-emerald-700">
            {formatCurrency(filteredSubtotal)}
          </span>
        </div>
      </div>

      {/* Collections List */}
      {filteredCollections.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-xl bg-stone-50 border border-dashed border-stone-200 text-stone-500">
          <p className="text-sm font-medium">
            {isTe ? 'ఎటువంటి చందా రికార్డులు కనపడలేదు' : 'No collection records found'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <th className="py-3 px-4"># రశీదు నెం</th>
                  <th className="py-3 px-4">{isTe ? 'దాత పేరు & గోత్రం' : 'Donor Name & Gothram'}</th>
                  <th className="py-3 px-4">{isTe ? 'విభాగం (Category)' : 'Category'}</th>
                  <th className="py-3 px-4">{isTe ? 'మొత్తం' : 'Amount'}</th>
                  <th className="py-3 px-4">{isTe ? 'మొబైల్ & చిరునామా' : 'Contact & Address'}</th>
                  <th className="py-3 px-4">{isTe ? 'తేదీ & స్వీకర్త' : 'Date & Collector'}</th>
                  <th className="py-3 px-4 text-right">{isTe ? 'రశీదు & చర్యలు' : 'Receipt & Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCollections.map((col) => (
                  <tr key={col.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-700">
                      {col.receiptNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-stone-900">{col.donorName}</span>
                        {col.isFuturePurpose && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                            <span>{col.futurePurposeDate || (isTe ? 'భవిష్యత్ సేవ' : 'Future')}</span>
                          </span>
                        )}
                      </div>
                      {col.sponsoredItem && (
                        <div className="text-xs text-amber-800 font-semibold mt-0.5">
                          🎁 {col.sponsoredItem}
                        </div>
                      )}
                      {col.gothram && (
                        <div className="text-xs text-stone-500">
                          గోత్రం: <span className="font-medium text-stone-700">{col.gothram}</span>
                        </div>
                      )}
                      {col.notes && (
                        <div className="text-[11px] text-stone-400 italic">{col.notes}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {col.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-extrabold text-emerald-700 whitespace-nowrap text-base">
                      {formatCurrency(col.amount)}
                      <div className="text-[10px] text-stone-400 font-normal">{col.paymentMode}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {col.mobile ? (
                        <div className="flex items-center gap-1 font-mono text-xs">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{col.mobile}</span>
                        </div>
                      ) : (
                        <span className="text-stone-300">-</span>
                      )}
                      {col.address && (
                        <div className="text-xs text-stone-400 truncate max-w-[140px]">{col.address}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{col.date}</span>
                      </div>
                      <div className="text-xs text-stone-500">{col.receivedBy}</div>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewReceipt(col)}
                          className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View Digital Receipt"
                        >
                          <Receipt className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleShareWhatsApp(col)}
                          className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Share on WhatsApp"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditCollection(col)}
                          className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                isTe
                                  ? `ఈ చందా రశీదు (${col.receiptNo}) ను తొలగించాలా?`
                                  : `Delete receipt ${col.receiptNo}?`
                              )
                            ) {
                              deleteCollection(col.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredCollections.map((col) => (
              <div
                key={col.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-amber-50/30 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {col.receiptNo}
                      </span>
                      {col.isFuturePurpose && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          <span>{col.futurePurposeDate || (isTe ? 'భవిష్యత్ సేవ' : 'Future')}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-stone-900 mt-1 text-base">{col.donorName}</h3>
                    {col.sponsoredItem && (
                      <div className="text-xs text-amber-800 font-semibold mt-0.5">
                        🎁 {col.sponsoredItem}
                      </div>
                    )}
                    {col.gothram && (
                      <div className="text-xs text-stone-500">
                        గోత్రం: <span className="font-medium text-stone-700">{col.gothram}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-extrabold text-emerald-700">
                      {formatCurrency(col.amount)}
                    </div>
                    <span className="text-[10px] text-stone-400">{col.paymentMode}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium text-[11px]">
                    {col.category}
                  </span>
                  <span className="text-stone-500">{col.date}</span>
                  {col.mobile && (
                    <span className="font-mono text-stone-600 flex items-center gap-0.5">
                      <Phone className="w-3 h-3 text-stone-400" />
                      {col.mobile}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200/80 text-xs">
                  <span className="text-stone-500">రసీదుదారు: {col.receivedBy}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewReceipt(col)}
                      className="px-2 py-1 bg-stone-200 text-stone-800 rounded-lg font-semibold flex items-center gap-1"
                    >
                      <Receipt className="w-3 h-3" />
                      <span>రశీదు</span>
                    </button>
                    <button
                      onClick={() => handleShareWhatsApp(col)}
                      className="px-2 py-1 bg-emerald-600 text-white rounded-lg font-semibold flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => onEditCollection(col)}
                      className="p-1 text-stone-500 hover:text-amber-700"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            isTe
                              ? `ఈ చందా రశీదు (${col.receiptNo}) ను తొలగించాలా?`
                              : `Delete receipt ${col.receiptNo}?`
                          )
                        ) {
                          deleteCollection(col.id);
                        }
                      }}
                      className="p-1 text-stone-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
