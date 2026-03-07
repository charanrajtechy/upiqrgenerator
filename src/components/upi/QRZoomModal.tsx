import { X } from "lucide-react";
import type { QRData } from "./types";

interface Props {
  open: boolean;
  onClose: () => void;
  qrData: QRData;
}

const QRZoomModal = ({ open, onClose, qrData }: Props) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative w-full max-w-md animate-scale-in">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-white rounded-2xl p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={qrData.qrDataUrl}
              alt="UPI QR Code"
              className="w-72 h-72 sm:w-80 sm:h-80"
            />
            {qrData.logoDataUrl && (
              <img
                src={qrData.logoDataUrl}
                alt="Logo"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-white p-1 shadow-sm object-contain"
              />
            )}
          </div>

          <div className="text-center space-y-1">
            {qrData.label && <p className="text-base font-bold text-gray-900">{qrData.label}</p>}
            {qrData.name && <p className="text-lg font-bold text-gray-900">{qrData.name}</p>}
            <p className="text-sm text-gray-500">{qrData.upiId}</p>
            {qrData.amount && (
              <p className="text-3xl font-black text-blue-600 mt-1">
                ₹{Number(qrData.amount).toLocaleString("en-IN")}
              </p>
            )}
            {qrData.note && <p className="text-xs text-gray-500 mt-1">{qrData.note}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRZoomModal;
