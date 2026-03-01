import { Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  type?: string;
  optional?: boolean;
  showCopy?: boolean;
  onChange: (value: string) => void;
}

const InputField = ({
  label,
  placeholder,
  value,
  error,
  type = "text",
  optional = false,
  showCopy = false,
  onChange,
}: InputFieldProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!value.trim()) {
      return;
    }
    try {
      await navigator.clipboard.writeText(value.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }, [value]);

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {optional && <span className="text-muted-foreground font-normal ml-1">(optional)</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary transition-all pr-10"
        />
        {showCopy && (
          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Copy UPI ID"
          >
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default InputField;
