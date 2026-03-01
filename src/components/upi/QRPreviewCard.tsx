import { forwardRef } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import type { QRData, CardStyle } from "./types";

interface QRPreviewCardProps {
  qrData: QRData;
  cardStyle: CardStyle;
}

const QRPreviewCard = forwardRef<HTMLDivElement, QRPreviewCardProps>(({ qrData, cardStyle }, ref) => {
  const hasAmount = !!qrData.amount;
  const hasName = !!qrData.name;
  const hasNote = !!qrData.note;
  const hasLabel = !!qrData.label;
  const hasExpiry = !!qrData.expiresAt;
  const isExpired = hasExpiry && new Date(qrData.expiresAt!) <= new Date();

  const cardClasses: Record<CardStyle, string> = {
    minimal: "bg-card rounded-xl shadow-card p-8",
    "bold-amount": "bg-card rounded-xl shadow-card p-8 border-2 border-primary/20",
    boxed: "bg-card rounded-2xl shadow-card-hover p-10 border border-border",
    centered: "bg-card rounded-xl shadow-card p-8",
  };

  const amountClasses: Record<CardStyle, string> = {
    minimal: "text-2xl font-extrabold text-amount mt-2",
    "bold-amount": "text-4xl font-black text-amount mt-3",
    boxed: "text-2xl font-extrabold text-amount mt-2 bg-accent/50 px-4 py-1 rounded-lg inline-block",
    centered: "text-3xl font-extrabold text-amount mt-2",
  };

  return (
    <div ref={ref} className={`${cardClasses[cardStyle]} flex flex-col items-center`}>
      {hasLabel && (
        <p className="text-base font-bold text-foreground mb-4">{qrData.label}</p>
      )}
      <div className="relative">
        <img
          src={qrData.qrDataUrl}
          alt="UPI QR Code"
          className="w-56 h-56 sm:w-64 sm:h-64"
        />
        {qrData.logoDataUrl && (
          <img
            src={qrData.logoDataUrl}
            alt="Logo"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-md bg-card p-1 shadow-sm object-contain"
          />
        )}
      </div>
      <div className="mt-5 text-center space-y-1">
        {hasName && <p className="text-lg font-bold text-foreground">{qrData.name}</p>}
        <p className="text-sm text-muted-foreground">{qrData.upiId}</p>
        {hasAmount && (
          <p className={amountClasses[cardStyle]}>
            ₹{Number(qrData.amount).toLocaleString("en-IN")}
          </p>
        )}
        {hasNote && <p className="text-xs text-muted-foreground mt-1">{qrData.note}</p>}
        {isExpired && (
          <p className="flex items-center justify-center gap-1 text-xs font-medium text-destructive mt-2">
            <AlertTriangle className="w-3.5 h-3.5" /> This QR has expired
          </p>
        )}
        {hasExpiry && !isExpired && (
          <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground mt-2">
            <Clock className="w-3 h-3" /> Expires: {new Date(qrData.expiresAt!).toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </div>
  );
});

QRPreviewCard.displayName = "QRPreviewCard";
export default QRPreviewCard;
