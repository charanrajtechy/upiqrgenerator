import { useState, useEffect, useCallback } from "react";
import { History, Trash2, Clock, AlertTriangle } from "lucide-react";
import type { QRHistoryItem } from "./types";

const STORAGE_KEY = "qr_history";
const MAX_ITEMS = 20;

export function getHistory(): QRHistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addToHistory(item: QRHistoryItem) {
  const list = getHistory().filter((h) => h.id !== item.id);
  list.unshift(item);
  if (list.length > MAX_ITEMS) list.length = MAX_ITEMS;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function isExpired(item: QRHistoryItem): boolean {
  if (!item.expiresAt) return false;
  return new Date(item.expiresAt) <= new Date();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface QRHistoryProps {
  onSelect: (item: QRHistoryItem) => void;
}

const QRHistory = ({ onSelect }: QRHistoryProps) => {
  const [items, setItems] = useState<QRHistoryItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setItems(getHistory());
  }, [open]);

  const handleClear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setItems([]);
  }, []);

  const handleDelete = useCallback((id: string) => {
    const updated = getHistory().filter((h) => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setItems(updated);
  }, []);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <History className="w-3.5 h-3.5" /> QR History ({getHistory().length})
      </button>
    );
  }

  return (
    <div className="w-full bg-card rounded-xl shadow-card p-4 space-y-3 border border-border">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <History className="w-4 h-4" /> Recent QR Codes
        </h3>
        <div className="flex gap-2">
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-destructive hover:underline"
            >
              Clear All
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Close
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No QR codes generated yet.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {items.map((item) => {
            const expired = isExpired(item);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (expired) return;
                  onSelect(item);
                }}
                disabled={expired}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                  expired
                    ? "border-destructive/30 bg-destructive/5 opacity-60 cursor-not-allowed"
                    : "border-border hover:bg-accent/50 cursor-pointer"
                }`}
              >
                <img
                  src={item.qrDataUrl}
                  alt="QR"
                  className="w-10 h-10 rounded-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.name || item.upiId}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{item.upiId}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.amount && (
                      <span className="text-xs font-semibold text-amount">
                        ₹{Number(item.amount).toLocaleString("en-IN")}
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" /> {formatDate(item.createdAt)}
                    </span>
                  </div>
                  {expired && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-destructive font-medium mt-0.5">
                      <AlertTriangle className="w-2.5 h-2.5" /> Expired
                    </span>
                  )}
                  {item.expiresAt && !expired && (
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      Expires: {formatDate(item.expiresAt)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  aria-label="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QRHistory;
