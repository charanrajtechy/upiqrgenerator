import type { CardStyle } from "./types";

interface StyleSelectorProps {
  value: CardStyle;
  onChange: (style: CardStyle) => void;
}

const STYLES: { value: CardStyle; label: string }[] = [
  { value: "minimal", label: "Minimal" },
  { value: "bold-amount", label: "Bold Amount" },
  { value: "boxed", label: "Boxed Card" },
  { value: "centered", label: "Centered" },
];

const StyleSelector = ({ value, onChange }: StyleSelectorProps) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-1.5">
      Card Style <span className="text-muted-foreground font-normal ml-1">(optional)</span>
    </label>
    <div className="flex gap-2 flex-wrap">
      {STYLES.map((s) => (
        <button
          key={s.value}
          type="button"
          onClick={() => onChange(s.value)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            value === s.value
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-secondary text-secondary-foreground border-border hover:bg-accent"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  </div>
);

export default StyleSelector;
