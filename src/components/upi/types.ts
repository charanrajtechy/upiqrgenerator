export interface FormData {
  upiId: string;
  name: string;
  amount: string;
  note: string;
  label: string;
}

export interface QRData {
  upiLink: string;
  qrDataUrl: string;
  name: string;
  upiId: string;
  amount: string;
  note: string;
  label: string;
  logoDataUrl?: string;
}

export type CardStyle = "minimal" | "bold-amount" | "boxed" | "centered";

export interface Template {
  upiId: string;
  name: string;
}

export interface QRHistoryItem {
  id: string;
  qrDataUrl: string;
  upiId: string;
  name: string;
  amount: string;
  note: string;
  label: string;
  cardStyle: CardStyle;
  createdAt: string; // ISO string
}
