import { useRef, useState, useCallback } from "react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";

const UPI_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;

interface FormData {
  upiId: string;
  name: string;
  amount: string;
  note: string;
}

interface QRData {
  upiLink: string;
  qrDataUrl: string;
  name: string;
  upiId: string;
  amount: string;
  note: string;
}

const UpiQrGenerator = () => {
  const [form, setForm] = useState<FormData>({
    upiId: "",
    name: "",
    amount: "",
    note: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    const upiId = form.upiId.trim();
    const name = form.name.trim();
    const amount = form.amount.trim();
    const note = form.note.trim();

    if (!upiId) e.upiId = "UPI ID is required";
    else if (!UPI_REGEX.test(upiId)) e.upiId = "Invalid UPI ID (e.g. name@bank)";

    if (!name) e.name = "Name is required";
    else if (name.length > 100) e.name = "Name too long";

    if (!amount) e.amount = "Amount is required";
    else if (isNaN(Number(amount)) || Number(amount) <= 0) e.amount = "Enter a valid positive amount";

    if (!note) e.note = "Payment note is required";
    else if (note.length > 200) e.note = "Note too long";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerate = useCallback(async () => {
    if (!validate()) return;
    setGenerating(true);

    const upiId = form.upiId.trim();
    const name = form.name.trim();
    const amount = form.amount.trim();
    const note = form.note.trim();

    const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${encodeURIComponent(amount)}&cu=INR&tn=${encodeURIComponent(note)}`;

    try {
      const qrDataUrl = await QRCode.toDataURL(upiLink, {
        width: 280,
        margin: 2,
        color: { dark: "#1a1a2e", light: "#ffffff" },
        errorCorrectionLevel: "M",
      });
      setQrData({ upiLink, qrDataUrl, name, upiId, amount, note });
    } catch {
      console.error("QR generation failed");
    } finally {
      setGenerating(false);
    }
  }, [form]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 3,
      });
      const link = document.createElement("a");
      link.download = `upi-qr-${qrData?.name?.replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      console.error("Download failed");
    }
  }, [qrData]);

  const handleTestPayment = () => {
    if (qrData?.upiLink) window.open(qrData.upiLink, "_self");
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Open UPI QR Generator
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-md">
          Generate professional UPI QR codes for fixed payments. No tracking, no storage — 100% private.
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md bg-card rounded-xl shadow-card p-6 sm:p-8 space-y-5">
        <InputField
          label="UPI ID"
          placeholder="yourname@paytm"
          value={form.upiId}
          error={errors.upiId}
          onChange={(v) => handleChange("upiId", v)}
        />
        <InputField
          label="Name"
          placeholder="Your full name"
          value={form.name}
          error={errors.name}
          onChange={(v) => handleChange("name", v)}
        />
        <InputField
          label="Amount (₹)"
          placeholder="500"
          type="number"
          value={form.amount}
          error={errors.amount}
          onChange={(v) => handleChange("amount", v)}
        />
        <InputField
          label="Payment Note"
          placeholder="Advance for project work"
          value={form.note}
          error={errors.note}
          onChange={(v) => handleChange("note", v)}
        />

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
        >
          {generating ? "Generating…" : "Generate QR Code"}
        </button>
      </div>

      {/* QR Preview */}
      {qrData && (
        <div className="mt-8 w-full max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Downloadable card */}
          <div
            ref={cardRef}
            className="bg-card rounded-xl shadow-card p-8 flex flex-col items-center"
          >
            <img
              src={qrData.qrDataUrl}
              alt="UPI QR Code"
              className="w-56 h-56 sm:w-64 sm:h-64"
            />
            <div className="mt-5 text-center space-y-1">
              <p className="text-lg font-bold text-foreground">{qrData.name}</p>
              <p className="text-sm text-muted-foreground">{qrData.upiId}</p>
              <p className="text-2xl font-extrabold text-amount mt-2">
                ₹{Number(qrData.amount).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{qrData.note}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Download QR
            </button>
            <button
              onClick={handleTestPayment}
              className="flex-1 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm border border-border transition-all hover:bg-accent active:scale-[0.98]"
            >
              Test Payment
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="mt-12 text-xs text-muted-foreground text-center">
        No data is collected or stored. Everything runs in your browser.
      </p>
    </div>
  );
};

/* Reusable input field */
const InputField = ({
  label,
  placeholder,
  value,
  error,
  type = "text",
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  type?: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-1.5">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all"
    />
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </div>
);

export default UpiQrGenerator;
