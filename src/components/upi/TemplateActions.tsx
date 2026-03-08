import { Save, FolderOpen, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

interface Template {
  upiId: string;
  name: string;
  logoDataUrl?: string;
}

interface TemplateActionsProps {
  upiId: string;
  name: string;
  logoDataUrl?: string | null;
  onLoad: (template: Template) => void;
}

const TemplateActions = ({ upiId, name, logoDataUrl, onLoad }: TemplateActionsProps) => {
  const [message, setMessage] = useState("");

  const showMsg = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2500);
  };

  const handleSave = useCallback(() => {
    if (!upiId.trim()) {
      showMsg("Enter UPI ID first");
      return;
    }
    const template: Template = { upiId: upiId.trim(), name: name.trim() };
    if (logoDataUrl) template.logoDataUrl = logoDataUrl;
    localStorage.setItem("upi_template", JSON.stringify(template));
    showMsg("Template saved!");
  }, [upiId, name, logoDataUrl]);

  const handleLoad = useCallback(() => {
    const raw = localStorage.getItem("upi_template");
    if (!raw) {
      showMsg("No template saved yet");
      return;
    }
    try {
      const t: Template = JSON.parse(raw);
      onLoad(t);
      showMsg("Template loaded!");
    } catch {
      showMsg("Invalid template data");
    }
  }, [onLoad]);

  return (
    <div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-secondary text-secondary-foreground hover:bg-accent transition-all"
        >
          <Save className="w-3.5 h-3.5" /> Save Template
        </button>
        <button
          type="button"
          onClick={handleLoad}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-secondary text-secondary-foreground hover:bg-accent transition-all"
        >
          <FolderOpen className="w-3.5 h-3.5" /> Load Template
        </button>
      </div>
      {message && <p className="text-xs text-primary mt-1.5">{message}</p>}
    </div>
  );
};

export default TemplateActions;
