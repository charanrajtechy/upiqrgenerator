import { ImagePlus, X } from "lucide-react";
import { useCallback, useRef } from "react";

interface LogoUploadProps {
  logoDataUrl: string | null;
  onLogoChange: (dataUrl: string | null) => void;
}

const LogoUpload = ({ logoDataUrl, onLogoChange }: LogoUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => onLogoChange(reader.result as string);
      reader.readAsDataURL(file);
    },
    [onLogoChange]
  );

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        Logo on QR <span className="text-muted-foreground font-normal ml-1">(optional)</span>
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background text-sm text-muted-foreground hover:bg-muted transition-all"
        >
          <ImagePlus className="w-4 h-4" />
          {logoDataUrl ? "Change" : "Upload"}
        </button>
        {logoDataUrl && (
          <>
            <img src={logoDataUrl} alt="Logo" className="w-8 h-8 rounded object-cover border border-border" />
            <button
              type="button"
              onClick={() => onLogoChange(null)}
              className="p-1 rounded hover:bg-muted text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
};

export default LogoUpload;
