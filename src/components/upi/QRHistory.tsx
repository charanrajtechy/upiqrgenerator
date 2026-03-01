import { useState, useEffect, useCallback, useRef } from "react";
import { History, Trash2, Clock, Download, Share2 } from "lucide-react";
import type { QRHistoryItem } from "./types";
import { shareQR, downloadQR } from "./shareQR";
import QRPreviewCard from "./QRPreviewCard";
import { buildUpiLink } from "./buildUpiLink";

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
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const hiddenCardRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<QRHistoryItem | null>(null);

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

  const performAction = useCallback(async (item: QRHistoryItem, action: "download" | "share") => {
    setActiveItem(item);
    // Wait for render
    await new Promise((r) => setTimeout(r, 100));
    const el = hiddenCardRef.current;
    if (!el) return;
    try {
      if (action === "download") {
        await downloadQR(el, item.name, item.upiId);
      } else {
        const result = await shareQR(el, item.name, item.upiId, item.amount, item.note);
        if (result === "downloaded") {
          setShareMsg("QR downloaded. You can share it manually.");
          setTimeout(() => setShareMsg(null), 4000);
        }
      }
    } catch {
      // cancelled
    } finally {
      setActiveItem(null);
    }
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

      {shareMsg && (
        <p className="text-xs text-primary text-center">{shareMsg}</p>
      )}

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No QR codes generated yet.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-all"
            >
              <button
                type="button"
                onClick={() => onSelect(item)}
                className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer"
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
                </div>
              </button>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => performAction(item, "download")}
                  className="p-1.5 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => performAction(item, "share")}
                  className="p-1.5 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden card for rendering download/share images */}
      {activeItem && (
        <div className="fixed left-[-9999px] top-0">
          <QRPreviewCard
            ref={hiddenCardRef}
            qrData={{
              upiLink: buildUpiLink(activeItem.upiId, activeItem.name, activeItem.amount, activeItem.note),
              qrDataUrl: activeItem.qrDataUrl,
              name: activeItem.name,
              upiId: activeItem.upiId,
              amount: activeItem.amount,
              note: activeItem.note,
              label: activeItem.label,
            }}
            cardStyle={activeItem.cardStyle}
          />
        </div>
      )}
    </div>
  );
};

export default QRHistory;
