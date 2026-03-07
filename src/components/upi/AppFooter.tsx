import { useState } from "react";
import { Github, Instagram, Facebook, Linkedin, Youtube, ExternalLink, Info } from "lucide-react";
import AboutModal from "./AboutModal";

const SOCIAL_LINKS = [
  { href: "https://github.com/charanrajtechy/upiqrgenerator", icon: Github, label: "GitHub" },
  { href: "https://www.instagram.com/charanrajtechy", icon: Instagram, label: "Instagram" },
  { href: "https://www.facebook.com/charanrajtechy", icon: Facebook, label: "Facebook" },
  { href: "https://www.linkedin.com/in/charanrajtechy", icon: Linkedin, label: "LinkedIn" },
  { href: "https://youtube.com/@clpstudiobycharanraj", icon: Youtube, label: "YouTube" },
  { href: "https://x.com/CharanRajTechy", icon: ExternalLink, label: "X (Twitter)" },
  { href: "https://t.me/CLPStudio", icon: ExternalLink, label: "Telegram" },
  { href: "https://www.threads.com/@charan_raj_panthula", icon: ExternalLink, label: "Threads" },
  { href: "https://www.snapchat.com/add/charanrajtechy", icon: ExternalLink, label: "Snapchat" },
  { href: "https://aratt.ai/@clpstudio", icon: ExternalLink, label: "Arattai" },
];

const AppFooter = () => {
  const [aboutOpen, setAboutOpen] = useState(false);
  const betaEnabled = typeof window !== "undefined" && localStorage.getItem("beta_features") === "true";
  const version = betaEnabled ? "v3.9.0.5 (Beta)" : "v2.5.8";

  return (
    <>
      <footer className="w-full max-w-md mx-auto mt-12 pb-8 space-y-6">
        <div className="border-t border-border pt-6 text-center space-y-2">
          <h3 className="text-sm font-bold text-foreground">Open UPI QR Generator</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Privacy-first UPI QR generator that runs entirely in your browser.<br />
            No login. No tracking. No server storage.
          </p>
        </div>

        <div className="text-center space-y-3">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Connect with the Developer</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.label}
                className="p-2 rounded-xl border border-border hover:bg-muted hover:border-muted-foreground/30 transition-all text-muted-foreground hover:text-foreground"
              >
                <link.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setAboutOpen(true)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
            About This Tool
          </button>
        </div>

        <div className="text-center space-y-1">
          <p className="text-[11px] text-muted-foreground">
            Built by Charan Raj – CLP Studio
          </p>
          <p className="text-[10px] text-muted-foreground/60">
            Version {version}
          </p>
        </div>
      </footer>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
};

export default AppFooter;
