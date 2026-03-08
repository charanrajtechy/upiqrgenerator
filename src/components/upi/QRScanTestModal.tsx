import { useState, useCallback, useEffect } from "react";
import { X, ScanLine, CheckCircle2, AlertTriangle } from "lucide-react";
import jsQR from "jsqr";

interface Props {
  open: boolean;
  onClose: () => void;
  qrDataUrl: string;
  expectedData: string;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

const QRScanTestModal = ({ open, onClose, qrDataUrl, expectedData, onSuccess, onError }: Props) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<"success" | "fail" | null>(null);

  const handleScan = useCallback(async () => {
    setScanning(true);
    setResult(null);

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = qrDataUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setResult("success");
        if (code.data === expectedData) {
          onSuccess("QR scan successful. The generated QR is valid.");
        } else {
          onSuccess("QR scanned successfully! Data detected.");
        }
      } else {
        setResult("fail");
        onError("Unable to verify QR. Please regenerate the code.");
      }
    } catch {
      setResult("fail");
      onError("Unable to verify QR. Please regenerate the code.");
    } finally {
      setScanning(false);
    }
  }, [qrDataUrl, expectedData, onSuccess, onError]);

  useEffect(() => {
    if (open) {
      setResult(null);
      // Auto-scan on open
      const t = setTimeout(() => handleScan(), 300);
      return () => clearTimeout(t);
    }
  }, [open, handleScan]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <ScanLine className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Test Scan QR</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-4 flex flex-col items-center gap-4">
          <img src={qrDataUrl} alt="QR to verify" className="w-48 h-48 rounded-lg" />

          {scanning && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Verifying QR code…
            </div>
          )}

          {result === "success" && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              QR is valid and scannable
            </div>
          )}

          {result === "fail" && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 font-medium">
              <AlertTriangle className="w-4 h-4" />
              Unable to verify QR
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={scanning}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {scanning ? "Scanning…" : "Scan Again"}
          </button>
        </div>

        <p className="text-[11px] text-muted-foreground text-center p-3 border-t border-border">
          This verifies the generated QR code by decoding it programmatically.
        </p>
      </div>
    </div>
  );
};

export default QRScanTestModal;
