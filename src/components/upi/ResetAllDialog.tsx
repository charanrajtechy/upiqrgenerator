import { AlertTriangle, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetAllDialog = ({ open, onClose, onConfirm }: Props) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 animate-scale-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h3 className="text-base font-bold text-foreground">Reset All Settings?</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p>This will reset all your settings and preferences in this app, including:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>QR customization styles</li>
            <li>Saved templates</li>
            <li>QR history stored in this browser</li>
            <li>Beta feature settings</li>
          </ul>
          <p className="text-xs font-medium text-destructive">This action cannot be undone.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-all"
          >
            Reset Everything
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetAllDialog;
