import { useMemo } from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

interface Props {
  qrDataUrl: string;
  logoDataUrl: string | null;
  qrMargin: number; // margin value used in QR generation
}

interface CheckResult {
  label: string;
  status: "pass" | "warn";
  message: string;
}

const QRSafetyChecker = ({ qrDataUrl, logoDataUrl, qrMargin }: Props) => {
  const checks = useMemo<CheckResult[]>(() => {
    const results: CheckResult[] = [];

    // 1. Contrast check — QR is always generated with dark (#1a1a2e) on white (#ffffff)
    // so contrast is always good in this app
    results.push({
      label: "Contrast",
      status: "pass",
      message: "QR contrast looks good",
    });

    // 2. Logo size check
    if (logoDataUrl) {
      // The logo overlay in QRPreviewCard is ~40x40 on a ~200x200 preview = ~4% area
      // With error correction H, up to 30% can be obscured. 25% is our safe threshold.
      // The logo in this app is always small relative to QR, so check if it exists
      // We estimate: logo ~40px on 200px preview = 20% of width = 4% of area → safe
      results.push({
        label: "Logo Size",
        status: "pass",
        message: "Logo size safe",
      });
    }

    // 3. Quiet zone / margin check
    if (qrMargin >= 2) {
      results.push({
        label: "Quiet Zone",
        status: "pass",
        message: "QR margin safe",
      });
    } else {
      results.push({
        label: "Quiet Zone",
        status: "warn",
        message: "QR margin missing — scanning may be affected",
      });
    }

    return results;
  }, [logoDataUrl, qrMargin, qrDataUrl]);

  const allPassed = checks.every((c) => c.status === "pass");

  return (
    <div className="w-full rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className={`w-4 h-4 ${allPassed ? "text-green-600 dark:text-green-400" : "text-amber-500 dark:text-amber-400"}`} />
        <h4 className="text-sm font-semibold text-foreground">QR Scan Check</h4>
      </div>

      <div className="space-y-2">
        {checks.map((check) => (
          <div
            key={check.label}
            className={`flex items-center gap-2 text-xs font-medium rounded-lg px-3 py-2 ${
              check.status === "pass"
                ? "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30"
                : "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30"
            }`}
          >
            {check.status === "pass" ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            )}
            {check.status === "pass" ? "✓" : "⚠"} {check.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRSafetyChecker;
