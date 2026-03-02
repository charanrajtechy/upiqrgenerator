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
export type QRSize = "small" | "medium" | "large";

export const QR_SIZE_MAP: Record<QRSize, number> = {
  small: 512,
  medium: 1024,
  large: 2048,
};

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
