import { FormEvent, useMemo, useState } from "react";

type FormData = {
  upiId: string;
  name: string;
  amount: string;
  note: string;
};

const validate = (data: FormData) => {
  return {
    upiId: data.upiId.trim() ? undefined : "UPI ID is required",
    name: undefined,
    amount: undefined,
    note: undefined,
  };
};

const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    upiId: "",
    name: "",
    amount: "",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validate(formData), [formData]);

  const upiLink = useMemo(() => {
    const upiId = formData.upiId.trim();
    if (!upiId) return "";

    const params = new URLSearchParams({ pa: upiId });
    if (formData.name.trim()) params.set("pn", formData.name.trim());
    if (formData.amount.trim()) {
      params.set("am", formData.amount.trim());
      params.set("cu", "INR");
    }
    if (formData.note.trim()) params.set("tn", formData.note.trim());

    return `upi://pay?${params.toString()}`;
  }, [formData]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (errors.upiId) return;
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-lg rounded-xl border bg-card p-6 shadow-md">
        <h1 className="mb-1 text-2xl font-bold">Open UPI QR Generator</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Only UPI ID is mandatory. All other blanks are optional.
        </p>

        <form className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm font-medium">
            UPI ID <span className="text-destructive">*</span>
            <input
              required
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
              value={formData.upiId}
              onChange={(event) =>
                setFormData((current) => ({ ...current, upiId: event.target.value }))
              }
              placeholder="name@bank"
            />
          </label>
          {submitted && errors.upiId ? (
            <p className="text-sm text-destructive">{errors.upiId}</p>
          ) : null}

          <label className="block text-sm font-medium">
            Name (optional)
            <input
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
              value={formData.name}
              onChange={(event) =>
                setFormData((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Receiver name"
            />
          </label>

          <label className="block text-sm font-medium">
            Amount (optional)
            <input
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
              value={formData.amount}
              onChange={(event) =>
                setFormData((current) => ({ ...current, amount: event.target.value }))
              }
              placeholder="100"
            />
          </label>

          <label className="block text-sm font-medium">
            Note (optional)
            <input
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
              value={formData.note}
              onChange={(event) =>
                setFormData((current) => ({ ...current, note: event.target.value }))
              }
              placeholder="Invoice #102"
            />
          </label>

          <button className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground" type="submit">
            Generate Link
          </button>
        </form>

        {upiLink ? (
          <div className="mt-6 rounded-md bg-muted p-3 text-sm break-all">
            <span className="font-semibold">UPI Link:</span> {upiLink}
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Index;
