import type { QRSize } from "./types";

interface QRSizeSelectorProps {
  value: QRSize;
  onChange: (size: QRSize) => void;
}

const OPTIONS: { value: QRSize; label: string }[] = [
  { value: "small", label: "Small (512px)" },
  { value: "medium", label: "Medium (1024px)" },
  { value: "large", label: "Large – Print (2048px)" },
];

const QRSizeSelector = ({ value, onChange }: QRSizeSelectorProps) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-1.5">
      QR Size <span className="text-muted-foreground font-normal ml-1">(optional)</span>
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as QRSize)}
      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

export default QRSizeSelector;
