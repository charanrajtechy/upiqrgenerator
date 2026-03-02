import { useRef, useState, useCallback, useEffect } from "react";
import QRCode from "qrcode";
import { Copy, Check, RotateCcw } from "lucide-react";
import ThemeToggle from "@/components/upi/ThemeToggle";
import InputField from "@/components/upi/InputField";
import PresetAmounts from "@/components/upi/PresetAmounts";
import LogoUpload from "@/components/upi/LogoUpload";
import TemplateActions from "@/components/upi/TemplateActions";
import StyleSelector from "@/components/upi/StyleSelector";
import QRPreviewCard from "@/components/upi/QRPreviewCard";
import QRSizeSelector from "@/components/upi/QRSizeSelector";
import QRHistory, { addToHistory } from "@/components/upi/QRHistory";
import FeatureRequestModal from "@/components/upi/FeatureRequestModal";
import { buildUpiLink } from "@/components/upi/buildUpiLink";
import { shareQR, downloadQR } from "@/components/upi/shareQR";
import type { FormData, QRData, CardStyle, QRSize, QR_SIZE_MAP, Template, QRHistoryItem } from "@/components/upi/types";
import { Skeleton } from "@/components/ui/skeleton";

const UPI_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
const SIZE_MAP: Record<QRSize, number> = { small: 512, medium: 1024, large: 2048 };

function formatAmount(val: string): string {
  const num = Number(val);
  if (!val || isNaN(num)) return "";
  return `₹${num.toLocaleString("en-IN")}`;
}

const UpiQrGenerator = () => {
  const [form, setForm] = useState<FormData>({ upiId: "", name: "", amount: "", note: "", label: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [cardStyle, setCardStyle] = useState<CardStyle>(() => (localStorage.getItem("qr_card_style") as CardStyle) || "minimal");
  const [qrSize, setQrSize] = useState<QRSize>("medium");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [shareMsg, setShareMsg] = useState("");
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [showCredit, setShowCredit] = useState(false);
  const [detailsCopied, setDetailsCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Skeleton loading simulation
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  }, []);

  const isUpiValid = UPI_REGEX.test(form.upiId.trim());

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    const upiId = form.upiId.trim();
    const amount = form.amount.trim();
    if (!upiId) e.upiId = "UPI ID is required";
    else if (!UPI_REGEX.test(upiId)) e.upiId = "Invalid UPI ID (e.g. name@bank)";
    if (amount && (isNaN(Number(amount)) || Number(amount) <= 0)) e.amount = "Enter a valid positive amount";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const generateQR = useCallback(async () => {
    if (!validate()) return;
    setGenerating(true);
    const upiId = form.upiId.trim();
    const name = form.name.trim();
    const amount = form.amount.trim();
    const note = form.note.trim();
    const label = form.label.trim();
    const upiLink = buildUpiLink(upiId, name, amount, note);
    try {
      const qrDataUrl = await QRCode.toDataURL(upiLink, {
        width: SIZE_MAP[qrSize],
        margin: 2,
        color: { dark: "#1a1a2e", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
      const newQrData: QRData = { upiLink, qrDataUrl, name, upiId, amount, note, label, logoDataUrl: logoDataUrl || undefined };
      setQrData(newQrData);
      addToHistory({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        qrDataUrl, upiId, name, amount, note, label, cardStyle,
        createdAt: new Date().toISOString(),
      });
    } catch { console.error("QR generation failed"); }
    finally { setGenerating(false); }
  }, [form, logoDataUrl, cardStyle, qrSize]);

  // Auto-generate with debounce
  useEffect(() => {
    if (!autoGenerate) return;
    if (!form.upiId.trim() || !UPI_REGEX.test(form.upiId.trim())) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { generateQR(); }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [autoGenerate, form, generateQR]);

  const handleShare = useCallback(async () => {
    if (!cardRef.current || !qrData) return;
    try {
      const result = await shareQR(cardRef.current, qrData.name, qrData.upiId, qrData.amount, qrData.note);
      if (result === "downloaded") { setShareMsg("QR downloaded. You can share it manually."); setTimeout(() => setShareMsg(""), 4000); }
    } catch {}
  }, [qrData]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || !qrData) return;
    await downloadQR(cardRef.current, qrData.name, qrData.upiId);
  }, [qrData]);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleStyleChange = (style: CardStyle) => { setCardStyle(style); localStorage.setItem("qr_card_style", style); };

  const handleTemplateLoad = useCallback((t: Template) => {
    setForm((prev) => ({ ...prev, upiId: t.upiId, name: t.name }));
  }, []);

  const handleHistorySelect = useCallback((item: QRHistoryItem) => {
    setForm({ upiId: item.upiId, name: item.name, amount: item.amount, note: item.note, label: item.label });
    setCardStyle(item.cardStyle);
    setQrData({
      upiLink: buildUpiLink(item.upiId, item.name, item.amount, item.note),
      qrDataUrl: item.qrDataUrl, name: item.name, upiId: item.upiId,
      amount: item.amount, note: item.note, label: item.label,
    });
  }, []);

  const handleReset = useCallback(() => {
    setForm({ upiId: "", name: "", amount: "", note: "", label: "" });
    setLogoDataUrl(null);
    setCardStyle("minimal");
    setQrData(null);
    setErrors({});
    setShowCredit(false);
  }, []);

  const handleCopyDetails = useCallback(async () => {
    if (!qrData) return;
    const lines: string[] = [];
    if (qrData.name) lines.push(`Payee: ${qrData.name}`);
    lines.push(`UPI ID: ${qrData.upiId}`);
    if (qrData.amount) lines.push(`Amount: ₹${Number(qrData.amount).toLocaleString("en-IN")}`);
    if (qrData.note) lines.push(`Note: ${qrData.note}`);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setDetailsCopied(true);
      setTimeout(() => setDetailsCopied(false), 2000);
    } catch {}
  }, [qrData]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="text-center mb-8 space-y-3 w-full max-w-md">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <FeatureRequestModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8 sm:py-12">
      <ThemeToggle />

      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Open UPI QR Generator</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-md">
          Generate professional UPI QR codes for payments. No tracking, no storage — 100% private.
        </p>
      </div>

      <div className="w-full max-w-md bg-card rounded-xl shadow-card p-6 sm:p-8 space-y-5">
        <InputField
          label="UPI ID"
          placeholder="yourname@paytm"
          value={form.upiId}
          error={errors.upiId}
          showCopy
          showValidation
          isValid={isUpiValid}
          onChange={(v) => handleChange("upiId", v)}
        />

        <TemplateActions upiId={form.upiId} name={form.name} onLoad={handleTemplateLoad} />

        <InputField label="Payee Name" placeholder="Your full name" value={form.name} error={errors.name} optional onChange={(v) => handleChange("name", v)} />

        <div className="space-y-2">
          <InputField label="Amount (₹)" placeholder="500" type="number" value={form.amount} error={errors.amount} optional onChange={(v) => handleChange("amount", v)} />
          {form.amount && !isNaN(Number(form.amount)) && Number(form.amount) > 0 && (
            <p className="text-xs text-muted-foreground ml-1">{formatAmount(form.amount)}</p>
          )}
          <PresetAmounts currentAmount={form.amount} onSelect={(v) => handleChange("amount", v)} />
        </div>

        <InputField label="Payment Note" placeholder="Advance for project work" value={form.note} error={errors.note} optional onChange={(v) => handleChange("note", v)} />
        <InputField label="Payment Title / Label" placeholder="Invoice #1234" value={form.label} optional onChange={(v) => handleChange("label", v)} />

        <LogoUpload logoDataUrl={logoDataUrl} onLogoChange={setLogoDataUrl} />
        <StyleSelector value={cardStyle} onChange={handleStyleChange} />
        <QRSizeSelector value={qrSize} onChange={setQrSize} />

        {/* Auto Generate Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Auto Generate QR</label>
          <button
            type="button"
            onClick={() => setAutoGenerate((p) => !p)}
            className={`relative w-11 h-6 rounded-full transition-colors ${autoGenerate ? "bg-primary" : "bg-muted"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${autoGenerate ? "translate-x-5" : ""}`} />
          </button>
        </div>

        {/* App Credit Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Include App Credit on QR</label>
          <button
            type="button"
            onClick={() => setShowCredit((p) => !p)}
            className={`relative w-11 h-6 rounded-full transition-colors ${showCredit ? "bg-primary" : "bg-muted"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${showCredit ? "translate-x-5" : ""}`} />
          </button>
        </div>

        {!autoGenerate && (
          <button
            onClick={generateQR}
            disabled={generating}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            {generating ? "Generating…" : "Generate QR Code"}
          </button>
        )}

        <button
          type="button"
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Reset All Fields
        </button>
      </div>

      <div className="w-full max-w-md mt-4">
        <QRHistory onSelect={handleHistorySelect} />
      </div>

      {qrData && (
        <div className="mt-8 w-full max-w-md space-y-4 animate-fade-in">
          <QRPreviewCard ref={cardRef} qrData={qrData} cardStyle={cardStyle} showCredit={showCredit} />

          <div className="flex gap-3">
            <button onClick={handleDownload} className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]">Download QR</button>
            <button onClick={handleShare} className="flex-1 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm border border-border transition-all hover:bg-accent active:scale-[0.98]">Share QR</button>
          </div>

          <button
            type="button"
            onClick={handleCopyDetails}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            {detailsCopied ? <><Check className="w-4 h-4 text-primary" /> Payment details copied</> : <><Copy className="w-4 h-4" /> Copy Payment Details</>}
          </button>

          {shareMsg && <p className="text-sm text-primary text-center">{shareMsg}</p>}
        </div>
      )}

      <p className="mt-12 text-xs text-muted-foreground text-center">
        No data is collected or stored. Everything runs in your browser.
      </p>

      <FeatureRequestModal />
    </div>
  );
};

export default UpiQrGenerator;
