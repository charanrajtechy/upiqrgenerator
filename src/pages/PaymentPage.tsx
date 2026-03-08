import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import QRCode from "qrcode";
import { Share2, Copy, Download, Check, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentInfo {
  upiId: string;
  name: string;
  amount: string;
  note: string;
  upiLink: string;
}

function decodePaymentData(encoded: string, isPathParam: boolean): PaymentInfo | null {
  try {
    // URL-safe base64 decode
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    const decoded = atob(base64);
    
    // Path param contains only query params, legacy ?data= contains full URI
    const queryStr = isPathParam ? decoded : (decoded.startsWith("upi://pay") ? decoded.split("?")[1] : null);
    if (!queryStr) return null;
    
    const params = new URLSearchParams(queryStr);
    const upiLink = isPathParam ? `upi://pay?${decoded}` : decoded;
    return {
      upiId: params.get("pa") || "",
      name: decodeURIComponent(params.get("pn") || ""),
      amount: params.get("am") || "",
      note: decodeURIComponent(params.get("tn") || ""),
      upiLink,
    };
  } catch {
    return null;
  }
}

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const { data: pathData } = useParams<{ data: string }>();
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const qrRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Support both /p/:data (path) and /pay?data= (legacy query)
    const encoded = pathData || searchParams.get("data");
    if (!encoded) { setError(true); return; }
    const isPathParam = !!pathData;
    const info = decodePaymentData(encoded, isPathParam);
    if (!info || !info.upiId) { setError(true); return; }
    setPayment(info);

    QRCode.toDataURL(info.upiLink, {
      width: 1024,
      margin: 2,
      color: { dark: "#1a1a2e", light: "#ffffff" },
      errorCorrectionLevel: "H",
    }).then(setQrDataUrl).catch(() => setError(true));
  }, [searchParams, pathData]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Link copied!", duration: 2000 });
    } catch {
      toast({ title: "Failed to copy link", variant: "destructive", duration: 2000 });
    }
  }, [toast]);

  const handleShare = useCallback(async () => {
    if (!navigator.share) {
      handleCopyLink();
      return;
    }
    try {
      await navigator.share({
        title: payment?.name ? `Pay ${payment.name}` : "UPI Payment",
        text: payment?.amount ? `Pay ₹${Number(payment.amount).toLocaleString("en-IN")}` : "Scan to pay via UPI",
        url: window.location.href,
      });
    } catch { /* user cancelled */ }
  }, [payment, handleCopyLink]);

  const handleDownloadQR = useCallback(() => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `payment-qr-${payment?.upiId || "code"}.png`;
    a.click();
    toast({ title: "QR downloaded!", duration: 2000 });
  }, [qrDataUrl, payment, toast]);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Payment Link</h1>
        <p className="text-sm text-gray-500 mb-6">This payment link is invalid or has been corrupted.</p>
        <a href="/" className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-4 h-4" /> Go to QR Generator
        </a>
      </div>
    );
  }

  if (!payment || !qrDataUrl) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          {payment.name && (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {payment.name}
            </h1>
          )}
          {payment.amount && (
            <p className="text-4xl sm:text-5xl font-black text-blue-600">
              ₹{Number(payment.amount).toLocaleString("en-IN")}
            </p>
          )}
          {payment.note && (
            <p className="text-sm text-gray-500 mt-1">{payment.note}</p>
          )}
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 flex flex-col items-center shadow-sm">
          <img
            ref={qrRef}
            src={qrDataUrl}
            alt="UPI Payment QR Code"
            className="w-64 h-64 sm:w-72 sm:h-72"
          />
          <div className="mt-4 text-center space-y-1">
            <p className="text-sm font-semibold text-gray-700">{payment.upiId}</p>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-center text-xs text-gray-400">
          Scan the QR using any UPI app<br />
          (Google Pay, PhonePe, Paytm)
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 active:scale-[0.98] transition-all"
          >
            {copied ? <><Check className="w-4 h-4 text-green-600" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Link</>}
          </button>
        </div>

        <button
          onClick={handleDownloadQR}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          <Download className="w-4 h-4" /> Download QR
        </button>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-100">
          <a href="/" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors">
            Generated with Open UPI QR Generator
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
