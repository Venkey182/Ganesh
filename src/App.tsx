import React, { useState } from 'react';
import { UtsavProvider, useUtsav } from './context/UtsavContext';
import { Header } from './components/Header';
import { DashboardSummary } from './components/DashboardSummary';
import { ExpensePurposeView } from './components/ExpensePurposeView';
import { AdminCollectionList } from './components/AdminCollectionList';
import { AddCollectionModal } from './components/AddCollectionModal';
import { AddExpenseModal } from './components/AddExpenseModal';
import { DynamicFieldManager } from './components/DynamicFieldManager';
import { SuperAdminModal } from './components/SuperAdminModal';
import { OtpLoginModal } from './components/OtpLoginModal';
import { LiveProjectorView } from './components/LiveProjectorView';
import { ReceiptCard } from './components/ReceiptCard';
import { PublicSponsorsView } from './components/PublicSponsorsView';
import { Footer } from './components/Footer';
import { FestivalYearFloatingWidget } from './components/FestivalYearFloatingWidget';
import { CollectionRecord, ExpenseRecord } from './types';
import {
  Receipt,
  ReceiptText,
  Plus,
  Layers,
  Sparkles,
  Tv,
  ShieldCheck,
  HeartHandshake,
  Award,
  Heart,
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { isAdmin, isSuperAdmin, language, settings } = useUtsav();

  // Active section tab: 'sponsors' | 'expenses' | 'collections'
  const [activeTab, setActiveTab] = useState<'sponsors' | 'expenses' | 'collections'>('sponsors');

  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuperAdminModal, setShowSuperAdminModal] = useState(false);
  const [showDynamicFieldManager, setShowDynamicFieldManager] = useState(false);
  const [showProjector, setShowProjector] = useState(false);

  const [showAddCollection, setShowAddCollection] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionRecord | null>(null);

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);

  const [viewingReceipt, setViewingReceipt] = useState<CollectionRecord | null>(null);

  const isTe = language === 'te';

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-800 flex flex-col font-sans selection:bg-amber-500 selection:text-white pb-20 sm:pb-8">
      {/* Top Header */}
      <Header
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenSuperAdmin={() => setShowSuperAdminModal(true)}
        onOpenDynamicFields={() => setShowDynamicFieldManager(true)}
        onOpenProjector={() => setShowProjector(true)}
        onOpenAddCollection={() => {
          setEditingCollection(null);
          setShowAddCollection(true);
        }}
        onOpenAddExpense={() => {
          setEditingExpense(null);
          setShowAddExpense(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dashboard Financial Summary (Strictly no receipts snaps clutter as per Requirement 1) */}
        <DashboardSummary
          onOpenAddCollection={() => {
            setEditingCollection(null);
            setShowAddCollection(true);
          }}
          onOpenAddExpense={() => {
            setEditingExpense(null);
            setShowAddExpense(true);
          }}
        />

        {/* Section Navigation Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 bg-white p-2 rounded-2xl shadow-xs gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            {/* Public Sponsors Honor Roll Tab */}
            <button
              onClick={() => setActiveTab('sponsors')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'sponsors'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>{isTe ? 'స్పాన్సర్ల గౌరవ బోర్డు (Public Sponsors)' : 'Public Sponsors'}</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full border border-amber-300">
                {isTe ? 'ప్రజా వీక్షణ' : 'Public'}
              </span>
            </button>

            {/* Expenses Breakdown Tab */}
            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === 'expenses'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <ReceiptText className="w-4 h-4" />
              <span>{isTe ? 'ఖర్చుల వివరాలు (Expenses)' : 'Expenses by Purpose'}</span>
            </button>

            {/* Collections Tab (Admins Only for full details) */}
            <button
              onClick={() => setActiveTab('collections')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all relative ${
                activeTab === 'collections'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>{isTe ? 'వసూళ్లు & చందాల డేటా' : 'Collections Data'}</span>
              {!isAdmin && (
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full border border-amber-300">
                  {isTe ? 'అడ్మిన్స్' : 'Admin'}
                </span>
              )}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => setShowDynamicFieldManager(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 text-xs font-semibold transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-amber-700" />
                <span>{isTe ? 'డైనమిక్ ఫీల్డ్స్ (+ Fields)' : 'Dynamic Fields (+)'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'sponsors' && <PublicSponsorsView />}

        {activeTab === 'expenses' && (
          <ExpensePurposeView
            onOpenAddExpense={() => {
              setEditingExpense(null);
              setShowAddExpense(true);
            }}
            onEditExpense={(exp) => {
              setEditingExpense(exp);
              setShowAddExpense(true);
            }}
          />
        )}

        {activeTab === 'collections' && (
          <AdminCollectionList
            onOpenLogin={() => setShowLoginModal(true)}
            onOpenAddCollection={() => {
              setEditingCollection(null);
              setShowAddCollection(true);
            }}
            onEditCollection={(col) => {
              setEditingCollection(col);
              setShowAddCollection(true);
            }}
            onViewReceipt={(col) => setViewingReceipt(col)}
          />
        )}
      </main>

      {/* Floating Action Bar for Mobile Administrators */}
      {isAdmin ? (
        <div className="sm:hidden fixed bottom-0 inset-x-0 bg-stone-900/95 backdrop-blur-md text-white border-t border-amber-500/40 p-2 z-40 flex items-center justify-around">
          <button
            onClick={() => {
              setEditingCollection(null);
              setShowAddCollection(true);
            }}
            className="flex flex-col items-center gap-1 text-[11px] font-bold text-emerald-300 hover:text-white"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
              <Plus className="w-5 h-5" />
            </div>
            <span>{isTe ? '+ చందా రశీదు' : '+ Collection'}</span>
          </button>

          <button
            onClick={() => {
              setEditingExpense(null);
              setShowAddExpense(true);
            }}
            className="flex flex-col items-center gap-1 text-[11px] font-bold text-rose-300 hover:text-white"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md">
              <ReceiptText className="w-5 h-5" />
            </div>
            <span>{isTe ? '+ ఖర్చు నమోదు' : '+ Expense'}</span>
          </button>

          <button
            onClick={() => setShowDynamicFieldManager(true)}
            className="flex flex-col items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md">
              <Layers className="w-5 h-5" />
            </div>
            <span>{isTe ? 'ఫీల్డ్స్' : 'Fields'}</span>
          </button>

          <button
            onClick={() => setShowProjector(true)}
            className="flex flex-col items-center gap-1 text-[11px] font-bold text-amber-200 hover:text-white"
          >
            <div className="w-9 h-9 rounded-xl bg-stone-800 flex items-center justify-center text-amber-300 shadow-md">
              <Tv className="w-5 h-5" />
            </div>
            <span>{isTe ? 'ప్రొజెక్టర్' : 'TV View'}</span>
          </button>
        </div>
      ) : (
        <div className="sm:hidden fixed bottom-0 inset-x-0 bg-stone-900/95 backdrop-blur-md text-white border-t border-amber-500/40 p-2 z-40 flex items-center justify-around">
          <button
            onClick={() => setActiveTab('sponsors')}
            className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
              activeTab === 'sponsors' ? 'text-amber-400' : 'text-stone-400'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-amber-900/60 flex items-center justify-center text-amber-300">
              <Award className="w-4 h-4" />
            </div>
            <span>{isTe ? 'స్పాన్సర్లు' : 'Sponsors'}</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex flex-col items-center gap-1 text-[11px] font-bold ${
              activeTab === 'expenses' ? 'text-rose-400' : 'text-stone-400'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 flex items-center justify-center text-rose-300">
              <ReceiptText className="w-4 h-4" />
            </div>
            <span>{isTe ? 'ఖర్చులు' : 'Expenses'}</span>
          </button>

          <button
            onClick={() => setShowProjector(true)}
            className="flex flex-col items-center gap-1 text-[11px] font-bold text-amber-200"
          >
            <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-amber-300">
              <Tv className="w-4 h-4" />
            </div>
            <span>{isTe ? 'ప్రొజెక్టర్' : 'Projector'}</span>
          </button>

          <button
            onClick={() => setShowLoginModal(true)}
            className="flex flex-col items-center gap-1 text-[11px] font-bold text-amber-400"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-amber-950 flex items-center justify-center font-black shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>{isTe ? 'లాగిన్ (OTP)' : 'Admin'}</span>
          </button>
        </div>
      )}

      {/* Modals */}
      {showLoginModal && (
        <OtpLoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {showSuperAdminModal && (
        <SuperAdminModal onClose={() => setShowSuperAdminModal(false)} />
      )}

      {showDynamicFieldManager && (
        <DynamicFieldManager onClose={() => setShowDynamicFieldManager(false)} />
      )}

      {showAddCollection && (
        <AddCollectionModal
          initialData={editingCollection}
          onClose={() => {
            setShowAddCollection(false);
            setEditingCollection(null);
          }}
          onSuccess={(saved) => {
            setShowAddCollection(false);
            setEditingCollection(null);
            setViewingReceipt(saved); // Immediately show digital receipt
          }}
          onOpenDynamicFieldManager={() => setShowDynamicFieldManager(true)}
        />
      )}

      {showAddExpense && (
        <AddExpenseModal
          initialData={editingExpense}
          onClose={() => {
            setShowAddExpense(false);
            setEditingExpense(null);
          }}
          onSuccess={() => {
            setShowAddExpense(false);
            setEditingExpense(null);
          }}
          onOpenDynamicFieldManager={() => setShowDynamicFieldManager(true)}
        />
      )}

      {viewingReceipt && (
        <ReceiptCard
          collection={viewingReceipt}
          onClose={() => setViewingReceipt(null)}
        />
      )}

      {showProjector && (
        <LiveProjectorView onClose={() => setShowProjector(false)} />
      )}

      {/* Draggable Festival Year Floating Switcher & 1-Click Copy Widget */}
      <FestivalYearFloatingWidget />

      {/* Dedicated Responsive Footer */}
      <Footer
        onOpenProjector={() => setShowProjector(true)}
        onOpenLogin={() => setShowLoginModal(true)}
      />
    </div>
  );
};

export default function App() {
  return (
    <UtsavProvider>
      <MainApp />
    </UtsavProvider>
  );
}
