import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  AuthorizedAdmin,
  CollectionRecord,
  DynamicField,
  ExpenseRecord,
  UserRole,
  UtsavSettings,
  FestivalYearInfo,
} from '../types';
import {
  DEFAULT_SETTINGS,
  INITIAL_ADMINS,
  INITIAL_COLLECTIONS,
  INITIAL_DYNAMIC_FIELDS,
  INITIAL_EXPENSES,
} from '../data/initialData';
import {
  generateJwsToken,
  verifyJwsToken,
  JwsClaims,
} from '../utils/jwsAuth';

interface CurrentUser {
  role: UserRole;
  mobile?: string;
  name?: string;
  adminId?: string;
  authToken?: string;
}

interface UtsavContextType {
  settings: UtsavSettings;
  updateSettings: (newSettings: Partial<UtsavSettings>) => void;
  admins: AuthorizedAdmin[];
  appointAdmin: (admin: Omit<AuthorizedAdmin, 'id' | 'addedAt'>) => void;
  removeAdmin: (adminId: string) => void;
  currentUser: CurrentUser;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  // Year Management (Next Year Copy & Multi-Year Archiving)
  activeYear: number;
  availableYears: number[];
  switchYear: (year: number) => void;
  copyToNextYear: (carryBalance?: boolean) => number;
  deleteYear: (year: number) => void;
  isCurrentYearArchived: boolean;
  allYearsInfo: FestivalYearInfo[];
  // OTP & JWS Auth
  pendingOtpMobile: string | null;
  lastGeneratedOtp: string | null;
  jwsToken: string | null;
  jwsClaims: JwsClaims | null;
  requestOtp: (mobile: string) => { success: boolean; message: string; otp?: string };
  verifyOtp: (mobile: string, enteredOtp: string) => Promise<boolean>;
  logout: () => void;
  quickLoginAsSuperAdmin: () => Promise<void>;
  // Collections & Expenses
  collections: CollectionRecord[];
  expenses: ExpenseRecord[];
  addCollection: (col: Omit<CollectionRecord, 'id' | 'receiptNo' | 'date'> & { date?: string }) => CollectionRecord;
  updateCollection: (col: CollectionRecord) => void;
  deleteCollection: (id: string) => void;
  addExpense: (exp: Omit<ExpenseRecord, 'id' | 'voucherNo' | 'date'> & { date?: string }) => ExpenseRecord;
  updateExpense: (exp: ExpenseRecord) => void;
  deleteExpense: (id: string) => void;
  // Dynamic fields
  dynamicFields: DynamicField[];
  addDynamicField: (field: Omit<DynamicField, 'id' | 'createdAt'>) => DynamicField;
  deleteDynamicField: (fieldId: string) => void;
  // Totals & Analytics
  totalReceived: number;
  totalSpent: number;
  balanceAmount: number;
  collectionCategories: { key: string; name: string; teluguName: string }[];
  expenseCategories: { key: string; name: string; teluguName: string }[];
  // Website Sponsors Management
  addWebsiteSponsor: (name: string, roleOrNote?: string) => void;
  removeWebsiteSponsor: (id: string) => void;
  // Language
  language: 'te' | 'en';
  setLanguage: (lang: 'te' | 'en') => void;
  // Live Sync notification
  lastSyncTimestamp: string;
  triggerLiveBroadcast: () => void;
}

const UtsavContext = createContext<UtsavContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'ganesh_utsav_settings_v1',
  ADMINS: 'ganesh_utsav_admins_v1',
  COLLECTIONS: 'ganesh_utsav_collections_v1',
  EXPENSES: 'ganesh_utsav_expenses_v1',
  DYNAMIC_FIELDS: 'ganesh_utsav_dynamic_fields_v1',
  CURRENT_USER: 'ganesh_utsav_active_session_v1',
  AUTH_TOKEN: 'ganesh_utsav_jws_token_v1',
  LANG: 'ganesh_utsav_lang_v1',
  AVAILABLE_YEARS: 'ganesh_utsav_available_years_v1',
  ACTIVE_YEAR: 'ganesh_utsav_active_year_v1',
};

// Broadcast Channel for live projector sync across tabs/devices in the same origin
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('ganesh_utsav_live_channel');
  }
} catch {
  // BroadcastChannel unavailable in some sandbox contexts
}

export const UtsavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 0. Festival Year Management State
  const [availableYears, setAvailableYears] = useState<number[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AVAILABLE_YEARS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
            .map((n: unknown) => Number(n))
            .filter((n: number) => !isNaN(n))
            .sort((a: number, b: number) => a - b);
        }
      } catch {
        // fallback
      }
    }
    return [2026];
  });

  const [activeYear, setActiveYearState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_YEAR);
    if (saved) {
      const yr = parseInt(saved, 10);
      if (!isNaN(yr)) return yr;
    }
    return 2026;
  });

  // 1. Settings state (Year-scoped with fallback to default)
  const [settings, setSettings] = useState<UtsavSettings>(() => {
    const yearKey = `ganesh_utsav_settings_${activeYear}`;
    const saved = localStorage.getItem(yearKey) || (activeYear === 2026 ? localStorage.getItem(STORAGE_KEYS.SETTINGS) : null);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure superAdminMobile is 9885714587
        if (!parsed.superAdminMobile || parsed.superAdminMobile === '9876543210') {
          parsed.superAdminMobile = '9885714587';
          parsed.organizerPhone = '9885714587';
        }
        if (!parsed.websiteDesignCredits || parsed.websiteDesignCredits.includes('&')) {
          parsed.websiteDesignCredits = 'Designed by Venkata Prasad and Prasad';
        }
        if (!parsed.websiteDesignersTelugu) {
          parsed.websiteDesignersTelugu = 'రూపకల్పన: వెంకట ప్రసాద్ మరియు ప్రసాద్';
        }
        if (!parsed.websiteSponsors || !Array.isArray(parsed.websiteSponsors) || parsed.websiteSponsors.length === 0) {
          parsed.websiteSponsors = DEFAULT_SETTINGS.websiteSponsors;
        }
        return parsed;
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // 2. Authorized Admins state (Committee administrators are preserved across festival years)
  const [admins, setAdmins] = useState<AuthorizedAdmin[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMINS);
    if (saved) {
      try {
        const parsed: AuthorizedAdmin[] = JSON.parse(saved);
        // Ensure super admin mobile is 9885714587
        return parsed.map((a) =>
          a.role === 'super_admin' && a.mobile === '9876543210'
            ? { ...a, mobile: '9885714587' }
            : a
        );
      } catch {
        return INITIAL_ADMINS;
      }
    }
    return INITIAL_ADMINS;
  });

  // 3. Collections state (Year-scoped: for active year, 2026 uses initial collections, future years start fresh)
  const [collections, setCollections] = useState<CollectionRecord[]>(() => {
    const yearKey = `ganesh_utsav_collections_${activeYear}`;
    const saved = localStorage.getItem(yearKey) || (activeYear === 2026 ? localStorage.getItem(STORAGE_KEYS.COLLECTIONS) : null);
    if (saved) {
      try {
        const parsed: CollectionRecord[] = JSON.parse(saved);
        return parsed.map((col) => {
          if (!col.sponsoredItem) {
            const initialMatch = INITIAL_COLLECTIONS.find((ic) => ic.id === col.id);
            if (initialMatch?.sponsoredItem) {
              return { ...col, sponsoredItem: initialMatch.sponsoredItem };
            }
          }
          return col;
        });
      } catch {
        return activeYear === 2026 ? INITIAL_COLLECTIONS : [];
      }
    }
    return activeYear === 2026 ? INITIAL_COLLECTIONS : [];
  });

  // 4. Expenses state (Year-scoped: 2026 uses initial expenses, future years start fresh)
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const yearKey = `ganesh_utsav_expenses_${activeYear}`;
    const saved = localStorage.getItem(yearKey) || (activeYear === 2026 ? localStorage.getItem(STORAGE_KEYS.EXPENSES) : null);
    if (saved) {
      try {
        const parsed: ExpenseRecord[] = JSON.parse(saved);
        return parsed.map((exp) => {
          if (!exp.purchasedItems) {
            const initialMatch = INITIAL_EXPENSES.find((ie) => ie.id === exp.id);
            if (initialMatch?.purchasedItems) {
              return { ...exp, purchasedItems: initialMatch.purchasedItems };
            }
          }
          return exp;
        });
      } catch {
        return activeYear === 2026 ? INITIAL_EXPENSES : [];
      }
    }
    return activeYear === 2026 ? INITIAL_EXPENSES : [];
  });

  // 5. Dynamic fields state (Year-scoped with fallback to initial dynamic fields)
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>(() => {
    const yearKey = `ganesh_utsav_dynamic_fields_${activeYear}`;
    const saved = localStorage.getItem(yearKey) || (activeYear === 2026 ? localStorage.getItem(STORAGE_KEYS.DYNAMIC_FIELDS) : null);
    return saved ? JSON.parse(saved) : INITIAL_DYNAMIC_FIELDS;
  });

  // 6. User session
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { role: 'viewer' };
      }
    }
    return { role: 'viewer' };
  });

  // 7. JWS Token and Claims state
  const [jwsToken, setJwsToken] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  });
  const [jwsClaims, setJwsClaims] = useState<JwsClaims | null>(null);

  // 8. OTP states
  const [pendingOtpMobile, setPendingOtpMobile] = useState<string | null>(null);
  const [lastGeneratedOtp, setLastGeneratedOtp] = useState<string | null>(null);

  // Validate stored JWS token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (storedToken) {
      verifyJwsToken(storedToken).then((res) => {
        if (res.valid && res.payload) {
          setJwsClaims(res.payload);
          setJwsToken(storedToken);
          setCurrentUser({
            role: res.payload.role,
            mobile: res.payload.sub,
            name: res.payload.name,
            adminId: res.payload.adminId,
            authToken: storedToken,
          });
        } else {
          // Token expired or altered
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          setJwsToken(null);
          setJwsClaims(null);
          setCurrentUser({ role: 'viewer' });
        }
      });
    }
  }, []);

  // 8. Language state (defaults to Telugu for community)
  const [language, setLanguageState] = useState<'te' | 'en'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return saved === 'en' ? 'en' : 'te';
  });

  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string>(() =>
    new Date().toLocaleTimeString('en-IN')
  );

  // Persist handlers (Year-scoped and global)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AVAILABLE_YEARS, JSON.stringify(availableYears));
  }, [availableYears]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_YEAR, String(activeYear));
  }, [activeYear]);

  useEffect(() => {
    localStorage.setItem(`ganesh_utsav_settings_${activeYear}`, JSON.stringify(settings));
    if (activeYear === 2026) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
  }, [settings, activeYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    localStorage.setItem(`ganesh_utsav_collections_${activeYear}`, JSON.stringify(collections));
    if (activeYear === 2026) {
      localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
    }
  }, [collections, activeYear]);

  useEffect(() => {
    localStorage.setItem(`ganesh_utsav_expenses_${activeYear}`, JSON.stringify(expenses));
    if (activeYear === 2026) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    }
  }, [expenses, activeYear]);

  useEffect(() => {
    localStorage.setItem(`ganesh_utsav_dynamic_fields_${activeYear}`, JSON.stringify(dynamicFields));
    if (activeYear === 2026) {
      localStorage.setItem(STORAGE_KEYS.DYNAMIC_FIELDS, JSON.stringify(dynamicFields));
    }
  }, [dynamicFields, activeYear]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  const setLanguage = (lang: 'te' | 'en') => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  };

  // Switch between festival years seamlessly
  const switchYear = (targetYear: number) => {
    if (targetYear === activeYear) return;

    // 1. Save current active year state first
    try {
      localStorage.setItem(`ganesh_utsav_collections_${activeYear}`, JSON.stringify(collections));
      localStorage.setItem(`ganesh_utsav_expenses_${activeYear}`, JSON.stringify(expenses));
      localStorage.setItem(`ganesh_utsav_settings_${activeYear}`, JSON.stringify(settings));
      localStorage.setItem(`ganesh_utsav_dynamic_fields_${activeYear}`, JSON.stringify(dynamicFields));
      if (activeYear === 2026) {
        localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        localStorage.setItem(STORAGE_KEYS.DYNAMIC_FIELDS, JSON.stringify(dynamicFields));
      }
    } catch {
      // ignore
    }

    // 2. Load target year records
    let nextCols: CollectionRecord[] = [];
    let nextExps: ExpenseRecord[] = [];
    let nextSettings: UtsavSettings = settings;
    let nextFields: DynamicField[] = dynamicFields;

    try {
      const savedCols =
        localStorage.getItem(`ganesh_utsav_collections_${targetYear}`) ||
        (targetYear === 2026 ? localStorage.getItem(STORAGE_KEYS.COLLECTIONS) : null);
      if (savedCols) {
        nextCols = JSON.parse(savedCols);
      }

      const savedExps =
        localStorage.getItem(`ganesh_utsav_expenses_${targetYear}`) ||
        (targetYear === 2026 ? localStorage.getItem(STORAGE_KEYS.EXPENSES) : null);
      if (savedExps) {
        nextExps = JSON.parse(savedExps);
      }

      const savedSet =
        localStorage.getItem(`ganesh_utsav_settings_${targetYear}`) ||
        (targetYear === 2026 ? localStorage.getItem(STORAGE_KEYS.SETTINGS) : null);
      if (savedSet) {
        nextSettings = JSON.parse(savedSet);
      }

      const savedFields =
        localStorage.getItem(`ganesh_utsav_dynamic_fields_${targetYear}`) ||
        (targetYear === 2026 ? localStorage.getItem(STORAGE_KEYS.DYNAMIC_FIELDS) : null);
      if (savedFields) {
        nextFields = JSON.parse(savedFields);
      }
    } catch (e) {
      console.error('Failed to load target year data:', e);
    }

    setCollections(nextCols);
    setExpenses(nextExps);
    setSettings(nextSettings);
    setDynamicFields(nextFields);
    setActiveYearState(targetYear);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_YEAR, String(targetYear));
    triggerLiveBroadcast();
  };

  // 1-Click "Copy to Next Year": Duplicates mandapam setup, organizers, dynamic fields,
  // while collections and expenses start fresh from receipt REC-001!
  const copyToNextYear = (carryBalance: boolean = false): number => {
    const maxYear = availableYears.length > 0 ? Math.max(...availableYears) : 2026;
    const nextYear = maxYear + 1;

    // 1. Ensure current year state is persisted
    try {
      localStorage.setItem(`ganesh_utsav_collections_${activeYear}`, JSON.stringify(collections));
      localStorage.setItem(`ganesh_utsav_expenses_${activeYear}`, JSON.stringify(expenses));
      localStorage.setItem(`ganesh_utsav_settings_${activeYear}`, JSON.stringify(settings));
      localStorage.setItem(`ganesh_utsav_dynamic_fields_${activeYear}`, JSON.stringify(dynamicFields));
    } catch {
      // ignore
    }

    // 2. Clone settings with year replacement
    const curYearStr = String(activeYear);
    const nextYearStr = String(nextYear);

    const clonedSettings: UtsavSettings = {
      ...settings,
      title: settings.title.includes(curYearStr)
        ? settings.title.split(curYearStr).join(nextYearStr)
        : `${settings.title} ${nextYearStr}`,
      teluguTitle: settings.teluguTitle.includes(curYearStr)
        ? settings.teluguTitle.split(curYearStr).join(nextYearStr)
        : `${settings.teluguTitle} ${nextYearStr}`,
      subTitle: settings.subTitle.includes(curYearStr)
        ? settings.subTitle.split(curYearStr).join(nextYearStr)
        : settings.subTitle,
      teluguSubTitle: settings.teluguSubTitle.includes(curYearStr)
        ? settings.teluguSubTitle.split(curYearStr).join(nextYearStr)
        : settings.teluguSubTitle,
      headerBannerText: settings.headerBannerText.includes(curYearStr)
        ? settings.headerBannerText.split(curYearStr).join(nextYearStr)
        : settings.headerBannerText,
    };

    // 3. Cloned dynamic fields (categories, custom fields)
    const clonedDynamicFields: DynamicField[] = [...dynamicFields];

    // 4. Fresh collections (Starts fresh! Receipt starts at REC-001)
    const freshCollections: CollectionRecord[] = [];
    if (carryBalance && balanceAmount > 0) {
      freshCollections.push({
        id: `col_opening_${nextYear}`,
        receiptNo: 'REC-001',
        donorName: `${activeYear} ఉత్సవ ముగింపు మిగులు నిల్వ (${activeYear} Closing Balance Carried Forward)`,
        amount: balanceAmount,
        category: 'సాధారణ చందా (General Chanda)',
        paymentMode: 'Bank Transfer',
        date: `${nextYear}-09-01`,
        receivedBy: 'గణేష్ ఉత్సవ కమిటీ (Committee)',
        notes: `${activeYear} వినాయక ఉత్సవాల నుండి బదిలీ చేయబడిన ప్రారంభ నిధి (Opening Fund from ${activeYear})`,
      });
    }

    // 5. Fresh expenses (Starts fresh! Voucher starts at VOU-01)
    const freshExpenses: ExpenseRecord[] = [];

    // 6. Save target year records to localStorage
    try {
      localStorage.setItem(`ganesh_utsav_settings_${nextYear}`, JSON.stringify(clonedSettings));
      localStorage.setItem(`ganesh_utsav_dynamic_fields_${nextYear}`, JSON.stringify(clonedDynamicFields));
      localStorage.setItem(`ganesh_utsav_collections_${nextYear}`, JSON.stringify(freshCollections));
      localStorage.setItem(`ganesh_utsav_expenses_${nextYear}`, JSON.stringify(freshExpenses));
    } catch {
      // ignore
    }

    // 7. Update available years list
    const updatedYears = Array.from(new Set([...availableYears, nextYear])).sort((a, b) => a - b);
    setAvailableYears(updatedYears);
    localStorage.setItem(STORAGE_KEYS.AVAILABLE_YEARS, JSON.stringify(updatedYears));

    // 8. Switch to the newly created year edition
    setSettings(clonedSettings);
    setDynamicFields(clonedDynamicFields);
    setCollections(freshCollections);
    setExpenses(freshExpenses);
    setActiveYearState(nextYear);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_YEAR, String(nextYear));

    triggerLiveBroadcast();
    return nextYear;
  };

  // Delete a festival year (if admin created test year by mistake, preserves if only 1 year exists)
  const deleteYear = (yearToDelete: number) => {
    if (availableYears.length <= 1) return;
    const remaining = availableYears.filter((y) => y !== yearToDelete);
    setAvailableYears(remaining);
    localStorage.setItem(STORAGE_KEYS.AVAILABLE_YEARS, JSON.stringify(remaining));
    localStorage.removeItem(`ganesh_utsav_collections_${yearToDelete}`);
    localStorage.removeItem(`ganesh_utsav_expenses_${yearToDelete}`);
    localStorage.removeItem(`ganesh_utsav_settings_${yearToDelete}`);
    localStorage.removeItem(`ganesh_utsav_dynamic_fields_${yearToDelete}`);
    if (activeYear === yearToDelete) {
      switchYear(remaining[remaining.length - 1]);
    } else {
      triggerLiveBroadcast();
    }
  };

  // Broadcast channel message listener for real-time projector live changes
  useEffect(() => {
    if (!broadcastChannel) return;
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SYNC_DATA') {
        // Read fresh items from local storage
        try {
          const freshCol = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
          const freshExp = localStorage.getItem(STORAGE_KEYS.EXPENSES);
          const freshSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
          const freshFields = localStorage.getItem(STORAGE_KEYS.DYNAMIC_FIELDS);
          if (freshCol) setCollections(JSON.parse(freshCol));
          if (freshExp) setExpenses(JSON.parse(freshExp));
          if (freshSettings) setSettings(JSON.parse(freshSettings));
          if (freshFields) setDynamicFields(JSON.parse(freshFields));
          setLastSyncTimestamp(new Date().toLocaleTimeString('en-IN'));
        } catch {
          // ignore parsing error
        }
      }
    };

    broadcastChannel.addEventListener('message', handleMessage);
    return () => {
      broadcastChannel?.removeEventListener('message', handleMessage);
    };
  }, []);

  const triggerLiveBroadcast = () => {
    const ts = new Date().toLocaleTimeString('en-IN');
    setLastSyncTimestamp(ts);
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage({ type: 'SYNC_DATA', timestamp: ts });
      } catch {
        // Broadcast fallback
      }
    }
  };

  // Settings update
  const updateSettings = (newSettings: Partial<UtsavSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
    triggerLiveBroadcast();
  };

  // Add website design sponsor (for future sponsors)
  const addWebsiteSponsor = (name: string, roleOrNote?: string) => {
    if (!name.trim()) return;
    const newSponsor = {
      id: `ws_${Date.now()}`,
      name: name.trim(),
      roleOrNote: roleOrNote?.trim() || 'డిజిటల్ వెబ్‌సైట్ సహకారం (Digital Website Supporter)',
      addedAt: new Date().toISOString().split('T')[0],
    };
    setSettings((prev) => {
      const existing = prev.websiteSponsors || [];
      const updated = {
        ...prev,
        websiteSponsors: [...existing, newSponsor],
      };
      return updated;
    });
    triggerLiveBroadcast();
  };

  // Remove website design sponsor
  const removeWebsiteSponsor = (id: string) => {
    setSettings((prev) => {
      const existing = prev.websiteSponsors || [];
      const updated = {
        ...prev,
        websiteSponsors: existing.filter((s) => s.id !== id),
      };
      return updated;
    });
    triggerLiveBroadcast();
  };

  // Admin Management by Super Admin
  const appointAdmin = (adminData: Omit<AuthorizedAdmin, 'id' | 'addedAt'>) => {
    const newAdmin: AuthorizedAdmin = {
      ...adminData,
      id: `adm_${Date.now()}`,
      addedAt: new Date().toISOString().split('T')[0],
    };
    setAdmins((prev) => [...prev, newAdmin]);
    triggerLiveBroadcast();
  };

  const removeAdmin = (adminId: string) => {
    setAdmins((prev) => prev.filter((a) => a.id !== adminId));
    triggerLiveBroadcast();
  };

  // Mobile OTP Request
  const requestOtp = (mobile: string) => {
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      return { success: false, message: 'దయచేసి 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి (Enter valid 10-digit mobile number)' };
    }

    // Check if registered as admin or matches super admin mobile (9885714587)
    const isSuperAdminMatch =
      cleanMobile === '9885714587' ||
      cleanMobile === settings.superAdminMobile.replace(/\D/g, '');
    const matchedAdmin = admins.find((a) => a.mobile.replace(/\D/g, '') === cleanMobile);

    if (!isSuperAdminMatch && !matchedAdmin) {
      return {
        success: false,
        message: 'ఈ మొబైల్ నంబర్‌కు అడ్మిన్ యాక్సెస్ లేదు. దయచేసి సూపర్ అడ్మిన్ (Super Admin) ను సంప్రదించండి. (Mobile not registered as Admin)',
      };
    }

    // Generate 4-digit OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setPendingOtpMobile(cleanMobile);
    setLastGeneratedOtp(generatedOtp);

    return {
      success: true,
      message: `OTP పంపబడింది! తక్షణ ధృవీకరణ కోసం కోడ్: ${generatedOtp} (OTP generated successfully)`,
      otp: generatedOtp,
    };
  };

  // Verify OTP with cryptographically signed JWS Token
  const verifyOtp = async (mobile: string, enteredOtp: string): Promise<boolean> => {
    const cleanMobile = mobile.replace(/\D/g, '');
    if (pendingOtpMobile !== cleanMobile) return false;
    if (enteredOtp.trim() !== lastGeneratedOtp) return false;

    // Check role
    const isSuperAdminMatch =
      cleanMobile === '9885714587' ||
      cleanMobile === settings.superAdminMobile.replace(/\D/g, '');
    const matchedAdmin = admins.find((a) => a.mobile.replace(/\D/g, '') === cleanMobile);

    let role: UserRole = 'admin';
    let name = 'అడ్మిన్';

    if (isSuperAdminMatch || matchedAdmin?.role === 'super_admin') {
      role = 'super_admin';
      name = matchedAdmin?.name || 'వెంకట ప్రసాద్ (Super Admin)';
    } else if (matchedAdmin) {
      role = 'admin';
      name = matchedAdmin.name;
    }

    // Generate signed JWS Token
    const token = await generateJwsToken({
      mobile: cleanMobile,
      name,
      role,
      adminId: matchedAdmin?.id,
      expiresInSeconds: 24 * 60 * 60, // 24 hours validity
    });

    const verifyCheck = await verifyJwsToken(token);
    if (verifyCheck.payload) {
      setJwsClaims(verifyCheck.payload);
    }
    setJwsToken(token);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

    const session: CurrentUser = {
      role,
      mobile: cleanMobile,
      name,
      adminId: matchedAdmin?.id,
      authToken: token,
    };

    setCurrentUser(session);
    setPendingOtpMobile(null);
    setLastGeneratedOtp(null);
    return true;
  };

  const logout = () => {
    setCurrentUser({ role: 'viewer' });
    setPendingOtpMobile(null);
    setLastGeneratedOtp(null);
    setJwsToken(null);
    setJwsClaims(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  };

  const quickLoginAsSuperAdmin = async () => {
    const mobile = '9885714587';
    const name = 'వెంకట ప్రసాద్ (Super Admin)';
    const role: UserRole = 'super_admin';

    const token = await generateJwsToken({
      mobile,
      name,
      role,
      adminId: 'adm_1',
      expiresInSeconds: 24 * 60 * 60,
    });

    const verifyCheck = await verifyJwsToken(token);
    if (verifyCheck.payload) {
      setJwsClaims(verifyCheck.payload);
    }
    setJwsToken(token);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

    const session: CurrentUser = {
      role,
      mobile,
      name,
      adminId: 'adm_1',
      authToken: token,
    };
    setCurrentUser(session);
  };

  // Dynamic Fields
  const addDynamicField = (fieldData: Omit<DynamicField, 'id' | 'createdAt'>): DynamicField => {
    const newField: DynamicField = {
      ...fieldData,
      id: `field_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDynamicFields((prev) => [...prev, newField]);
    triggerLiveBroadcast();
    return newField;
  };

  const deleteDynamicField = (fieldId: string) => {
    setDynamicFields((prev) => prev.filter((f) => f.id !== fieldId));
    triggerLiveBroadcast();
  };

  // Collections CRUD
  const addCollection = (
    colData: Omit<CollectionRecord, 'id' | 'receiptNo' | 'date'> & { date?: string }
  ): CollectionRecord => {
    const date = colData.date || new Date().toISOString().split('T')[0];
    const receiptNum = collections.length + 1;
    const receiptNo = `REC-${String(receiptNum).padStart(3, '0')}`;

    const newRecord: CollectionRecord = {
      ...colData,
      id: `col_${Date.now()}`,
      receiptNo,
      date,
    };

    setCollections((prev) => [newRecord, ...prev]);
    triggerLiveBroadcast();
    return newRecord;
  };

  const updateCollection = (col: CollectionRecord) => {
    setCollections((prev) => prev.map((item) => (item.id === col.id ? col : item)));
    triggerLiveBroadcast();
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((item) => item.id !== id));
    triggerLiveBroadcast();
  };

  // Expenses CRUD
  const addExpense = (
    expData: Omit<ExpenseRecord, 'id' | 'voucherNo' | 'date'> & { date?: string }
  ): ExpenseRecord => {
    const date = expData.date || new Date().toISOString().split('T')[0];
    const voucherNum = expenses.length + 1;
    const voucherNo = `VOU-${String(voucherNum).padStart(2, '0')}`;

    const newRecord: ExpenseRecord = {
      ...expData,
      id: `exp_${Date.now()}`,
      voucherNo,
      date,
    };

    setExpenses((prev) => [newRecord, ...prev]);
    triggerLiveBroadcast();
    return newRecord;
  };

  const updateExpense = (exp: ExpenseRecord) => {
    setExpenses((prev) => prev.map((item) => (item.id === exp.id ? exp : item)));
    triggerLiveBroadcast();
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
    triggerLiveBroadcast();
  };

  // Calculations
  const totalReceived = useMemo(() => {
    return collections.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [collections]);

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  const balanceAmount = useMemo(() => {
    return totalReceived - totalSpent;
  }, [totalReceived, totalSpent]);

  // Derived Category Lists from Dynamic Fields
  const collectionCategories = useMemo(() => {
    const dynamicCats = dynamicFields
      .filter((f) => f.target === 'collection' && f.isCategory)
      .map((f) => ({ key: f.name, name: f.name, teluguName: f.teluguName }));
    return dynamicCats;
  }, [dynamicFields]);

  const expenseCategories = useMemo(() => {
    const dynamicCats = dynamicFields
      .filter((f) => f.target === 'expense' && f.isCategory)
      .map((f) => ({ key: f.name, name: f.name, teluguName: f.teluguName }));
    return dynamicCats;
  }, [dynamicFields]);

  const isAdmin = currentUser.role === 'super_admin' || currentUser.role === 'admin';
  const isSuperAdmin = currentUser.role === 'super_admin';

  // Multi-year analytics & archival status
  const isCurrentYearArchived = useMemo(() => {
    if (availableYears.length <= 1) return false;
    return activeYear < Math.max(...availableYears);
  }, [activeYear, availableYears]);

  const allYearsInfo = useMemo<FestivalYearInfo[]>(() => {
    return availableYears.map((yr) => {
      let yrCols: CollectionRecord[] = [];
      let yrExps: ExpenseRecord[] = [];

      if (yr === activeYear) {
        yrCols = collections;
        yrExps = expenses;
      } else {
        try {
          const rawC =
            localStorage.getItem(`ganesh_utsav_collections_${yr}`) ||
            (yr === 2026 ? localStorage.getItem(STORAGE_KEYS.COLLECTIONS) : null);
          if (rawC) yrCols = JSON.parse(rawC);

          const rawE =
            localStorage.getItem(`ganesh_utsav_expenses_${yr}`) ||
            (yr === 2026 ? localStorage.getItem(STORAGE_KEYS.EXPENSES) : null);
          if (rawE) yrExps = JSON.parse(rawE);
        } catch {
          // ignore parsing error
        }
      }

      const totC = yrCols.reduce((s, i) => s + (Number(i.amount) || 0), 0);
      const totE = yrExps.reduce((s, i) => s + (Number(i.amount) || 0), 0);

      return {
        year: yr,
        isArchived: yr < Math.max(...availableYears),
        totalCollections: totC,
        totalExpenses: totE,
        collectionCount: yrCols.length,
        expenseCount: yrExps.length,
        balance: totC - totE,
      };
    });
  }, [availableYears, activeYear, collections, expenses]);

  return (
    <UtsavContext.Provider
      value={{
        settings,
        updateSettings,
        admins,
        appointAdmin,
        removeAdmin,
        currentUser,
        isAdmin,
        isSuperAdmin,
        // Festival Year Management
        activeYear,
        availableYears,
        switchYear,
        copyToNextYear,
        deleteYear,
        isCurrentYearArchived,
        allYearsInfo,
        // Auth & OTP
        pendingOtpMobile,
        lastGeneratedOtp,
        jwsToken,
        jwsClaims,
        requestOtp,
        verifyOtp,
        logout,
        quickLoginAsSuperAdmin,
        collections,
        expenses,
        addCollection,
        updateCollection,
        deleteCollection,
        addExpense,
        updateExpense,
        deleteExpense,
        dynamicFields,
        addDynamicField,
        deleteDynamicField,
        totalReceived,
        totalSpent,
        balanceAmount,
        collectionCategories,
        expenseCategories,
        addWebsiteSponsor,
        removeWebsiteSponsor,
        language,
        setLanguage,
        lastSyncTimestamp,
        triggerLiveBroadcast,
      }}
    >
      {children}
    </UtsavContext.Provider>
  );
};

export const useUtsav = () => {
  const context = useContext(UtsavContext);
  if (!context) {
    throw new Error('useUtsav must be used within an UtsavProvider');
  }
  return context;
};
