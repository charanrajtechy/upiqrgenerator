const PRESETS = [500, 1000, 2000, 5000];

interface PresetAmountsProps {
  onSelect: (amount: string) => void;
  currentAmount: string;
}

const PresetAmounts = ({ onSelect, currentAmount }: PresetAmountsProps) => (
  <div className="flex gap-2 flex-wrap">
    {PRESETS.map((amt) => (
      <button
        key={amt}
        type="button"
        onClick={() => onSelect(String(amt))}
        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
          currentAmount === String(amt)
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-secondary text-secondary-foreground border-border hover:bg-accent"
        }`}
      >
        ₹{amt.toLocaleString("en-IN")}
      </button>
    ))}
  </div>
);

export default PresetAmounts;
