import { useState, useCallback, useEffect, useRef } from "react";
import { Lightbulb, X } from "lucide-react";

const FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSclHkLlYRnvustg2lk8rO_v7zQ-Z9LPqqAfxArfYghEEi4Qwg/formResponse";

const FeatureRequestModal = () => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", suggestion: "" });
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEsc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleEsc); };
  }, [open]);

  const handleChange = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setError("");
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!emailRegex.test(form.email.trim())) { setError("Valid email is required"); return; }
    if (!form.suggestion.trim()) { setError("Suggestion is required"); return; }

    setSubmitting(true);
    const formData = new URLSearchParams();
    formData.append("entry.1410207777", form.name.trim());
    formData.append("entry.376769805", form.email.trim());
    formData.append("entry.2095369161", form.phone.trim());
    formData.append("entry.401042353", form.suggestion.trim());

    // Use hidden iframe to avoid redirect
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.onload = () => {
        setSubmitting(false);
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", suggestion: "" });
        setTimeout(() => { setSuccess(false); setOpen(false); }, 2500);
      };
    }

    // Create hidden form and submit to iframe
    const hiddenForm = document.createElement("form");
    hiddenForm.method = "POST";
    hiddenForm.action = FORM_ACTION;
    hiddenForm.target = "feature-iframe";
    hiddenForm.style.display = "none";
    for (const [key, value] of formData.entries()) {
      const input = document.createElement("input");
      input.name = key;
      input.value = value;
      hiddenForm.appendChild(input);
    }
    document.body.appendChild(hiddenForm);
    hiddenForm.submit();
    document.body.removeChild(hiddenForm);

    // Fallback timeout
    setTimeout(() => {
      if (submitting) {
        setSubmitting(false);
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", suggestion: "" });
        setTimeout(() => { setSuccess(false); setOpen(false); }, 2500);
      }
    }, 3000);
  }, [form, submitting]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[100] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform animate-fade-in"
        aria-label="Request a Feature"
        title="Request a Feature"
      >
        <Lightbulb className="w-6 h-6" />
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Request a Feature</h2>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>

            {success ? (
              <p className="text-sm text-primary text-center py-4">Thank you! Your suggestion has been submitted.</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Your Name *</label>
                  <input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Suggestion *</label>
                  <textarea value={form.suggestion} onChange={(e) => handleChange("suggestion", e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all resize-none" placeholder="Describe the feature you'd like..." />
                </div>
                {error && <p className="text-xs text-destructive">{error}</p>}
                <button type="submit" disabled={submitting} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50">
                  {submitting ? "Submitting…" : "Submit Suggestion"}
                </button>
                <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                  Your feedback is submitted securely through Google Forms. No data is stored on this website. Your response will be reviewed and permanently deleted after processing.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      <iframe ref={iframeRef} name="feature-iframe" className="hidden" title="Form submission" />
    </>
  );
};

export default FeatureRequestModal;
