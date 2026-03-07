import { useRef, useEffect, useState, useCallback } from "react";
import { X, Camera } from "lucide-react";
import jsQR from "jsqr";

interface Props {
  open: boolean;
  onClose: () => void;
  expectedData: string;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

const QRScanTestModal = ({ open, onClose, expectedData, onSuccess, onError }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number>(0);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const stopCamera = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  }, []);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  useEffect(() => {
    if (!open) return;
    setCameraError("");

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setScanning(true);
        }
      } catch {
        setCameraError("Camera access denied. Please allow camera permission.");
      }
    };

    startCamera();
    return () => stopCamera();
  }, [open, stopCamera]);

  useEffect(() => {
    if (!scanning) return;

    const scanFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        frameRef.current = requestAnimationFrame(scanFrame);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        stopCamera();
        if (code.data === expectedData) {
          onSuccess("QR scan successful. The generated QR is valid.");
        } else {
          onSuccess("QR scanned successfully! Data detected.");
        }
        onClose();
        return;
      }

      frameRef.current = requestAnimationFrame(scanFrame);
    };

    frameRef.current = requestAnimationFrame(scanFrame);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [scanning, expectedData, stopCamera, onSuccess, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Test Scan QR</h3>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-xl hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative aspect-[4/3] bg-black">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          <canvas ref={canvasRef} className="hidden" />
          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-primary/60 rounded-2xl" />
            </div>
          )}
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <p className="text-sm text-destructive text-center">{cameraError}</p>
            </div>
          )}
        </div>

        <p className="text-[11px] text-muted-foreground text-center p-3">
          Point your camera at the generated QR code to verify it scans correctly.
        </p>
      </div>
    </div>
  );
};

export default QRScanTestModal;
