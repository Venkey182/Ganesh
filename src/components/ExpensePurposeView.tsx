import React, { useState, useMemo } from 'react';
import { useUtsav } from '../context/UtsavContext';
import { ExpenseRecord } from '../types';
import {
  Search,
  Plus,
  Calendar,
  User,
  Trash2,
  Edit2,
  Receipt,
  Layers,
  Filter,
} from 'lucide-react';

interface ExpensePurposeViewProps {
  onOpenAddExpense: () => void;
  onEditExpense: (expense: ExpenseRecord) => void;
}

export const ExpensePurposeView: React.FC<ExpensePurposeViewProps> = ({
  onOpenAddExpense,
  onEditExpense,
}) => {
  const { expenses, deleteExpense, language, isAdmin, expenseCategories } = useUtsav();

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

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchesSearch =
        item.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.purchasedItems && item.purchasedItems.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.vendorName && item.vendorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.spentBy && item.spentBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.voucherNo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchTerm, selectedCategory]);

  // Aggregate category sums for quick purpose cards
  const categoryAggregates = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    expenses.forEach((item) => {
      if (!map[item.category]) {
        map[item.category] = { count: 0, total: 0 };
      }
      map[item.category].count += 1;
      map[item.category].total += Number(item.amount) || 0;
    });
    return map;
  }, [expenses]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-200/80 p-4 sm:p-6 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900">
              {isTe ? 'ఖర్చుల వివరాలు (ఏ పనులకు ఖర్చు చేశారు)' : 'Expenses Breakdown by Purpose'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {isTe
              ? 'ఉత్సవ కమిటీ ద్వారా విగ్రహం, టెంట్, సౌండ్, అన్నదానం మరియు ఇతర సేవల కొరకు చేసిన చెల్లింపుల పూర్తి వివరాలు.'
              : 'Transparent record of all expenditures made for pandal, idol, sounds, food, and rituals.'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenAddExpense}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isTe ? 'నూతన ఖర్చు నమోదు' : '+ Add New Expense'}</span>
          </button>
        )}
      </div>

      {/* Purpose Quick Summaries Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
            selectedCategory === 'ALL'
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
          }`}
        >
          {isTe ? 'అన్ని ఖర్చులు' : 'All Expenses'} ({expenses.length})
        </button>

        {(Object.entries(categoryAggregates) as [string, { count: number; total: number }][]).map(([catName, stats]) => {
          const matchedCategoryObj = expenseCategories.find(
            (c) => c.name === catName || c.teluguName === catName
          );
          const displayName = isTe
            ? matchedCategoryObj?.teluguName || catName
            : matchedCategoryObj?.name || catName;

          return (
            <button
              key={catName}
              onClick={() => setSelectedCategory(catName)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border flex items-center gap-1.5 ${
                selectedCategory === catName
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <span>{displayName}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCategory === catName
                    ? 'bg-rose-800 text-rose-100'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {formatCurrency(stats.total)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={
            isTe
              ? 'ఖర్చు ఉద్దేశం, కేటగిరీ, చెల్లించిన వ్యక్తి లేదా వోచర్ నంబర్ శోధించండి...'
              : 'Search by purpose, category, paid by, vendor or voucher...'
          }
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Expenses Table / List */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-xl bg-stone-50 border border-dashed border-stone-200 text-stone-500">
          <p className="text-sm font-medium">
            {isTe ? 'ఎటువంటి ఖర్చు రికార్డులు కనపడలేదు' : 'No expense records found'}
          </p>
          <p className="text-xs text-stone-400 mt-1">
            {isTe ? 'వేరే శోధన పదాలతో ప్రయత్నించండి' : 'Try adjusting your search or category filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Mobile Card Layout & Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <th className="py-3 px-4"># వోచర్</th>
                  <th className="py-3 px-4">{isTe ? 'ఖర్చు ఉద్దేశం (Purpose)' : 'Purpose'}</th>
                  <th className="py-3 px-4">{isTe ? 'కేటగిరీ' : 'Category'}</th>
                  <th className="py-3 px-4">{isTe ? 'తేదీ' : 'Date'}</th>
                  <th className="py-3 px-4">{isTe ? 'మొత్తం' : 'Amount'}</th>
                  <th className="py-3 px-4">{isTe ? 'బాధ్యత' : 'Paid By'}</th>
                  {isAdmin && <th className="py-3 px-4 text-right">చర్యలు</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredExpenses.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-700">
                      {item.voucherNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">{item.purpose}</div>
                      {item.purchasedItems && (
                        <div className="mt-1 text-xs text-rose-900 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/80">
                          <strong className="text-rose-800">కొనుగోలు వస్తువులు:</strong> {item.purchasedItems}
                        </div>
                      )}
                      {item.vendorName && (
                        <div className="text-xs text-stone-500 mt-0.5">
                          దుకాణం/వెండర్: {item.vendorName}
                        </div>
                      )}
                      {item.notes && (
                        <div className="text-[11px] text-stone-400 italic">{item.notes}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600 whitespace-nowrap">{item.date}</td>
                    <td className="py-3 px-4 font-bold text-rose-600 whitespace-nowrap text-base">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      <div>{item.spentBy}</div>
                      <span className="text-[10px] text-stone-400">{item.paymentMode}</span>
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditExpense(item)}
                            className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                            title="Edit Expense"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  isTe
                                    ? `ఈ ఖర్చు రికార్డు (${item.voucherNo}) ను తొలగించాలా?`
                                    : `Delete voucher ${item.voucherNo}?`
                                )
                              ) {
                                deleteExpense(item.id);
                              }
                            }}
                            className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredExpenses.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-amber-50/30 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-stone-500 bg-stone-200/80 px-2 py-0.5 rounded">
                      {item.voucherNo}
                    </span>
                    <h3 className="font-bold text-stone-900 mt-1 text-sm">{item.purpose}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-extrabold text-rose-600">
                      {formatCurrency(item.amount)}
                    </div>
                    <span className="text-[10px] text-stone-400">{item.paymentMode}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[11px] font-medium">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-stone-500">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-500">
                    <User className="w-3 h-3 text-stone-400" />
                    <span>{item.spentBy}</span>
                  </div>
                </div>

                {item.purchasedItems && (
                  <div className="text-xs text-rose-950 bg-rose-50 p-2 rounded-lg border border-rose-200/80">
                    <span className="font-bold text-rose-800">కొనుగోలు వస్తువులు:</span> {item.purchasedItems}
                  </div>
                )}

                {item.vendorName && (
                  <div className="text-xs text-stone-600 bg-white/80 p-2 rounded-lg border border-stone-200/60">
                    <span className="font-semibold text-stone-700">దుకాణం/వెండర్:</span> {item.vendorName}
                  </div>
                )}

                {isAdmin && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200/60">
                    <button
                      onClick={() => onEditExpense(item)}
                      className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>సవరించు (Edit)</span>
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            isTe
                              ? `ఈ ఖర్చు రికార్డు (${item.voucherNo}) ను తొలగించాలా?`
                              : `Delete voucher ${item.voucherNo}?`
                          )
                        ) {
                          deleteExpense(item.id);
                        }
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>తొలగించు</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
