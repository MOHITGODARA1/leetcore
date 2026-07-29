import {
  
  ArrowUpRight,
  Globe,
} from "lucide-react";
import {
  FaInstagram,
  FaLinkedin,
  FaGithub,
  FaYoutube,
  FaDiscord,
  FaTwitter,
  
} from "react-icons/fa";
import Upperdashnavbar from "../components/common/dashuppernavbar";

// TODO: replace with your real profile links
const socials = [
  {
    name: "Instagram",
    handle: "@leetcore",
    icon: FaInstagram,
    accent: "#e1306c",
    href: "https://instagram.com/leetcore",
  },
  {
    name: "LinkedIn",
    handle: "Leetcore",
    icon: FaLinkedin,
    accent: "#0a66c2",
    href: "https://linkedin.com/company/leetcore",
  },
  {
    name: "YouTube",
    handle: "@leetcore",
    icon: FaYoutube,
    accent: "#ff0033",
    href: "https://youtube.com/@leetcore",
  },
  {
    name: "X (Twitter)",
    handle: "@leetcore",
    icon: FaTwitter,
    accent: "#8ecae6",
    href: "https://x.com/leetcore",
  },
  {
    name: "GitHub",
    handle: "leetcore",
    icon: FaGithub,
    accent: "#94d2bd",
    href: "https://github.com/leetcore",
  },
  {
    name: "Telegram",
    handle: "Leetcore Community",
    icon: FaDiscord,
    accent: "#a78bfa",
    href: "https://t.me/leetcore",
  },
];

function DigitalFootprint() {
  return (
    <>
      <Upperdashnavbar />

      <div className="min-h-screen bg-[#070709] text-white p-6 sm:p-8">
        <div className="max-w-5xl mx-auto py-4">
          {/* Header */}
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-[0.15em] text-white/40 mb-3">
              STAY CONNECTED
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Our Digital Footprint
            </h1>
            <p className="text-sm text-white/50 max-w-xl leading-relaxed">
              Follow Leetcore across the web for updates, tips, and behind
              the scenes of what we're building next.
            </p>
          </div>

          {/* Social grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-200 hover:bg-white/[0.06] hover:border-white/20"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${s.accent}1A`,
                        border: `1px solid ${s.accent}33`,
                      }}
                    >
                      <Icon
                        className="h-5 w-5"
                        strokeWidth={1.9}
                        style={{ color: s.accent }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {s.name}
                      </p>
                      <p className="text-xs text-white/40 truncate">
                        {s.handle}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-white/30 shrink-0 transition-all duration-200 group-hover:text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              );
            })}
          </div>

          {/* Website / footer card */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.06] border border-white/10">
                <Globe className="h-4.5 w-4.5 text-white/70" strokeWidth={1.9} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  leetcore.com
                </p>
                <p className="text-xs text-white/40">Our official website</p>
              </div>
            </div>
            <a
              href="https://leetcore.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 transition-colors"
            >
              Visit Website
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default DigitalFootprint;