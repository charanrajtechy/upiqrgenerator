import { useRef, useState, useCallback } from "react";
import QRCode from "qrcode";
import ThemeToggle from "@/components/upi/ThemeToggle";
import InputField from "@/components/upi/InputField";
import PresetAmounts from "@/components/upi/PresetAmounts";
import LogoUpload from "@/components/upi/LogoUpload";
import TemplateActions from "@/components/upi/TemplateActions";
import StyleSelector from "@/components/upi/StyleSelector";
import QRPreviewCard from "@/components/upi/QRPreviewCard";
import ExpiryPicker from "@/components/upi/ExpiryPicker";
import QRHistory, { addToHistory } from "@/components/upi/QRHistory";
import { buildUpiLink } from "@/components/upi/buildUpiLink";
import { shareQR, downloadQR } from "@/components/upi/shareQR";
import type { FormData, QRData, CardStyle, Template, QRHistoryItem } from "@/components/upi/types";

const UPI_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;

const UpiQrGenerator = () => {
  const [form, setForm] = useState<FormData>({ upiId: "", name: "", amount: "", note: "", label: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [cardStyle, setCardStyle] = useState<CardStyle>(() => {
    return (localStorage.getItem("qr_card_style") as CardStyle) || "minimal";
  });
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [shareMsg, setShareMsg] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    const upiId = form.upiId.trim();
    const amount = form.amount.trim();

    if (!upiId) e.upiId = "UPI ID is required";
    else if (!UPI_REGEX.test(upiId)) e.upiId = "Invalid UPI ID (e.g. name@bank)";

    if (amount && (isNaN(Number(amount)) || Number(amount) <= 0)) {
      e.amount = "Enter a valid positive amount";
    }

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
    const label = form.label.trim();

    const upiLink = buildUpiLink(upiId, name, amount, note);

    try {
      const qrDataUrl = await QRCode.toDataURL(upiLink, {
        width: 1024,
        margin: 2,
        color: { dark: "#1a1a2e", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
      const expiry = expiresAt ? new Date(expiresAt).toISOString() : undefined;
      const newQrData: QRData = { upiLink, qrDataUrl, name, upiId, amount, note, label, logoDataUrl: logoDataUrl || undefined, expiresAt: expiry };
      setQrData(newQrData);

      // Save to history
      addToHistory({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        qrDataUrl,
        upiId,
        name,
        amount,
        note,
        label,
        cardStyle,
        createdAt: new Date().toISOString(),
        expiresAt: expiry,
      });
    } catch {
      console.error("QR generation failed");
    } finally {
      setGenerating(false);
    }
  }, [form, logoDataUrl, expiresAt, cardStyle]);

  const handleShare = useCallback(async () => {
    if (!cardRef.current || !qrData) return;
    try {
      const result = await shareQR(cardRef.current, qrData.name, qrData.upiId, qrData.amount, qrData.note);
      if (result === "downloaded") {
        setShareMsg("QR downloaded. You can share it manually.");
        setTimeout(() => setShareMsg(""), 4000);
      }
    } catch {
      // user cancelled share
    }
  }, [qrData]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || !qrData) return;
    await downloadQR(cardRef.current, qrData.name, qrData.upiId);
  }, [qrData]);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleStyleChange = (style: CardStyle) => {
    setCardStyle(style);
    localStorage.setItem("qr_card_style", style);
  };

  const handleTemplateLoad = useCallback((t: Template) => {
    setForm((prev) => ({ ...prev, upiId: t.upiId, name: t.name }));
  }, []);

  const handleHistorySelect = useCallback((item: QRHistoryItem) => {
    setForm({ upiId: item.upiId, name: item.name, amount: item.amount, note: item.note, label: item.label });
    setCardStyle(item.cardStyle);
    setQrData({
      upiLink: buildUpiLink(item.upiId, item.name, item.amount, item.note),
      qrDataUrl: item.qrDataUrl,
      name: item.name,
      upiId: item.upiId,
      amount: item.amount,
      note: item.note,
      label: item.label,
      expiresAt: item.expiresAt,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8 sm:py-12">
      <ThemeToggle />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Open UPI QR Generator
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-md">
          Generate professional UPI QR codes for payments. No tracking, no storage — 100% private.
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md bg-card rounded-xl shadow-card p-6 sm:p-8 space-y-5">
        <InputField
          label="UPI ID"
          placeholder="yourname@paytm"
          value={form.upiId}
          error={errors.upiId}
          showCopy
          onChange={(v) => handleChange("upiId", v)}
        />

        <TemplateActions upiId={form.upiId} name={form.name} onLoad={handleTemplateLoad} />

        <InputField
          label="Owner Name"
          placeholder="Your full name"
          value={form.name}
          error={errors.name}
          optional
          onChange={(v) => handleChange("name", v)}
        />

        <div className="space-y-2">
          <InputField
            label="Amount (₹)"
            placeholder="500"
            type="number"
            value={form.amount}
            error={errors.amount}
            optional
            onChange={(v) => handleChange("amount", v)}
          />
          <PresetAmounts currentAmount={form.amount} onSelect={(v) => handleChange("amount", v)} />
        </div>

        <InputField
          label="Payment Note"
          placeholder="Advance for project work"
          value={form.note}
          error={errors.note}
          optional
          onChange={(v) => handleChange("note", v)}
        />

        <InputField
          label="Payment Title / Label"
          placeholder="Invoice #1234"
          value={form.label}
          optional
          onChange={(v) => handleChange("label", v)}
        />

        <LogoUpload logoDataUrl={logoDataUrl} onLogoChange={setLogoDataUrl} />

        <ExpiryPicker expiresAt={expiresAt} onChange={setExpiresAt} />

        <StyleSelector value={cardStyle} onChange={handleStyleChange} />

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
        >
          {generating ? "Generating…" : "Generate QR Code"}
        </button>
      </div>

      {/* QR History */}
      <div className="w-full max-w-md mt-4">
        <QRHistory onSelect={handleHistorySelect} />
      </div>

      {/* QR Preview */}
      {qrData && (
        <div className="mt-8 w-full max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <QRPreviewCard ref={cardRef} qrData={qrData} cardStyle={cardStyle} />

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Download QR
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm border border-border transition-all hover:bg-accent active:scale-[0.98]"
            >
              Share QR
            </button>
          </div>
          {shareMsg && (
            <p className="text-sm text-primary text-center">{shareMsg}</p>
          )}
        </div>
      )}

      {/* Footer */}
      <p className="mt-12 text-xs text-muted-foreground text-center">
        No data is collected or stored. Everything runs in your browser.
      </p>
    </div>
  );
};

export default UpiQrGenerator;
