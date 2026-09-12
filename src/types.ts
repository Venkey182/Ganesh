export type UserRole = 'super_admin' | 'admin' | 'viewer';

export interface AuthorizedAdmin {
  id: string;
  mobile: string;
  name: string;
  role: 'super_admin' | 'admin';
  addedAt: string;
  notes?: string;
}

export interface DynamicField {
  id: string;
  target: 'collection' | 'expense';
  name: string;
  teluguName: string;
  type: 'text' | 'number' | 'category' | 'select';
  isCategory?: boolean;
  required?: boolean;
  options?: string[];
  createdAt: string;
}

export interface CollectionRecord {
  id: string;
  receiptNo: string;
  donorName: string;
  amount: number;
  category: string; // Dynamic e.g. "General Chanda", "Annadanam", "Laddu Auction", etc.
  sponsoredItem?: string; // Which item/cause sponsored e.g. "మహా అన్నదానం (Annadanam)", "లడ్డూ ప్రసాదం", etc.
  isFuturePurpose?: boolean; // Pledged or sponsored for future days / upcoming events
  futurePurposeDate?: string; // Date or festival day of the future purpose
  mobile?: string;
  gothram?: string;
  address?: string;
  paymentMode: 'Cash' | 'UPI (PhonePe / GPay)' | 'Bank Transfer';
  date: string;
  receivedBy: string;
  notes?: string;
  customFields?: Record<string, string | number>;
}

export interface ExpenseRecord {
  id: string;
  voucherNo: string;
  purpose: string; // What purpose spent
  purchasedItems?: string; // Manually entered items purchased (e.g. 50kg rice, tent 40x30, 4 LED focus lights)
  amount: number;
  category: string; // e.g. "Pandal & Lighting", "Idol", "Sound System", "Annadanam / Food", etc.
  spentBy: string;
  vendorName?: string;
  date: string;
  paymentMode: 'Cash' | 'UPI' | 'Bank Transfer';
  notes?: string;
  customFields?: Record<string, string | number>;
  // Optional receipt image link kept for internal records, but explicitly NOT rendered on main dashboard
  internalReceiptDoc?: string;
}

export interface UtsavSettings {
  title: string;
  teluguTitle: string;
  subTitle: string;
  teluguSubTitle: string;
  logoUrl: string;
  headerBannerText: string;
  organizerName: string;
  organizerPhone: string;
  venue: string;
  currencySymbol: string;
  projectorSpeedSeconds: number;
  superAdminMobile: string;
  // Website Design Credits & Sponsors
  websiteDesignCredits?: string; // "Designed by Venkata Prasad & Prasad"
  websiteDesignersTelugu?: string; // "రూపకల్పన: వెంకట ప్రసాద్ మరియు ప్రసాద్"
  websiteSponsorName?: string;
  websiteSponsorMessage?: string;
  websiteSponsors?: WebsiteSponsorItem[];
}

export interface WebsiteSponsorItem {
  id: string;
  name: string;
  roleOrNote?: string; // e.g. "Domain & Cloud Hosting", "సాంకేతిక సహకారం", "Digital Partner"
  addedAt?: string;
}

export interface FestivalYearInfo {
  year: number;
  isArchived: boolean;
  totalCollections: number;
  totalExpenses: number;
  collectionCount: number;
  expenseCount: number;
  balance: number;
}
