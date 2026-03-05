import { toPng } from "html-to-image";

export async function generateCardImage(cardEl: HTMLElement): Promise<Blob> {
  const dataUrl = await toPng(cardEl, { backgroundColor: "#ffffff", pixelRatio: 3 });
  const res = await fetch(dataUrl);
  return res.blob();
}

export async function shareQR(
  cardEl: HTMLElement,
  name: string,
  upiId: string,
  amount: string,
  note: string
): Promise<"shared" | "downloaded"> {
  const blob = await generateCardImage(cardEl);
  const file = new File([blob], `upi-qr-${(name || upiId).replace(/\s+/g, "-")}.png`, { type: "image/png" });

  const namePart = name || upiId;
  const amountPart = amount ? ` for ₹${Number(amount).toLocaleString("en-IN")}` : "";
  const notePart = note ? ` for ${note}` : "";

  const text = `Scan the attached QR code using any UPI app (Google Pay, PhonePe, Paytm, etc.) to complete your payment to ${namePart} ( UPI ID: ${upiId} )${amountPart}${notePart}.\n\nWant to create a similar fixed-amount UPI QR? Generate instantly at https://upiqrgenerator.lovable.app\n\nOpen UPI QR Generator is a privacy-friendly web application that allows you to generate professional UPI QR codes without logging in or storing any data.`;

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file], text });
    return "shared";
  }

  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
  return "downloaded";
}

export async function downloadQR(cardEl: HTMLElement, name: string, upiId: string): Promise<"downloaded"> {
  const blob = await generateCardImage(cardEl);
  const fileName = `upi-qr-${(name || upiId).replace(/\s+/g, "-")}.png`;

  // Always do anchor download — direct save to device
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
  return "downloaded";
}
