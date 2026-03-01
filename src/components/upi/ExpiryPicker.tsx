import { useState } from "react";

interface ExpiryPickerProps {
  expiresAt: string;
  onChange: (value: string) => void;
}

const ExpiryPicker = ({ expiresAt, onChange }: ExpiryPickerProps) => {
  const [enabled, setEnabled] = useState(!!expiresAt);

  const handleToggle = () => {
    if (enabled) {
      onChange("");
    }
    setEnabled(!enabled);
  };

  // Min datetime = now (rounded to minute)
  const now = new Date();
  now.setSeconds(0, 0);
  const minDateTime = now.toISOString().slice(0, 16);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Expiry <span className="text-muted-foreground font-normal ml-1">(optional)</span>
        </label>
        <button
          type="button"
          onClick={handleToggle}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            enabled ? "bg-primary" : "bg-input"
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-background shadow-sm transition-transform ${
              enabled ? "translate-x-[18px]" : "translate-x-[3px]"
            }`}
          />
        </button>
      </div>
      {enabled && (
        <input
          type="datetime-local"
          value={expiresAt}
          min={minDateTime}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all"
        />
      )}
      {enabled && !expiresAt && (
        <p className="text-xs text-muted-foreground">Set a date and time after which this QR should be considered expired.</p>
      )}
    </div>
  );
};

export default ExpiryPicker;
