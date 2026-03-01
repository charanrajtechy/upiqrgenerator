export function buildUpiLink(upiId: string, name: string, amount: string, note: string): string {
  const params = new URLSearchParams();
  params.set("pa", upiId);

  if (name) params.set("pn", name);
  if (amount) {
    params.set("am", amount);
    params.set("cu", "INR");
  }
  if (note) params.set("tn", note);

  return `upi://pay?${params.toString()}`;
}
