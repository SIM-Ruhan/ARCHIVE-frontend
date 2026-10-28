import Link from "next/link";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaRedditAlien,
  FaXTwitter,
  FaTiktok,
  FaSteam,
  FaGamepad,
  FaStore,
  FaPhone,
  FaArrowRight,
} from "react-icons/fa6";
import { FcCurrencyExchange } from "react-icons/fc";
import { SiGmail, SiEpicgames } from "react-icons/si";

// Decorative "index cards" that drift behind the headline — the archive wall.
const CARDS = [
  { icon: FaFacebookF, name: "Facebook", tag: "Account", color: "#1877F2" },
  { icon: FaLinkedinIn, name: "LinkedIn", tag: "Premium", color: "#0A66C2" },
  { icon: FaRedditAlien, name: "Reddit", tag: "Karma account", color: "#FF4500" },
  { icon: FaXTwitter, name: "X / Twitter", tag: "Verified badge", color: "#000000" },
  { icon: FaTiktok, name: "TikTok", tag: "Followers", color: "#000000" },
  { icon: SiGmail, name: "Gmail", tag: "Old account", color: "#EA4335" },
  { icon: FaSteam, name: "Steam", tag: "Launcher account", color: "#1B2838" },
  { icon: SiEpicgames, name: "Epic Games", tag: "Launcher account", color: "#2A2A2A" },
  { icon: FaGamepad, name: "Game account", tag: "High level", color: "#3B5BFF" },
  { icon: FaStore, name: "Marketplace", tag: "Seller account", color: "#0F9D58" },
  { icon: FaPhone, name: "Google Voice", tag: "Number", color: "#188038" },
];

function Column({ offset, reverse, className = "" }) {
  const list = [...CARDS.slice(offset), ...CARDS.slice(0, offset)];
  const doubled = [...list, ...list]; // doubled so the -50% loop is seamless
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div className={`flex flex-col gap-4 ${reverse ? "animate-drift-down" : "animate-drift-up"}`}>
        {doubled.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 shadow-sm"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ background: c.color }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold">{c.name}</span>
                <span className="block text-xs text-neutral-500">{c.tag}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const HeroBanner = () => {
  return (
    <section className="relative isolate overflow-hidden border-b border-neutral-200 bg-paper">
      {/* Moving background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-[28rem] w-[28rem] animate-glow rounded-full bg-accent/15 blur-3xl" />
        <div
          className="absolute -right-24 bottom-0 h-[26rem] w-[26rem] animate-glow rounded-full bg-neutral-400/20 blur-3xl"
          style={{ animationDelay: "-7s" }}
        />
        <div className="absolute inset-0 grid grid-cols-2 gap-4 px-4 opacity-70 sm:grid-cols-3 lg:grid-cols-5 lg:px-10">
          <Column offset={0} />
          <Column offset={3} reverse />
          <Column offset={6} className="hidden sm:block" />
          <Column offset={9} reverse className="hidden lg:block" />
          <Column offset={4} className="hidden lg:block" />
        </div>
        {/* fade the cards out behind the copy */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-paper)_38%,transparent_78%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
      </div>

      <div className="mx-auto flex min-h-[34rem] max-w-4xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:min-h-[40rem]">
      <div className="flex items-center gap-1 rounded-full border border-neutral-300 bg-white/80 px-4 py-1.5 text-sm font-medium text-neutral-700 backdrop-blur">
         <span><FcCurrencyExchange /></span><span>Pay by card or crypto. Sellers list in minutes.</span> 
       </div>

        <h1 className="mt-7 text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
          Give your unused accounts a second life.
        </h1>

        <p className="mt-6 max-w-2xl text-sm lg:text-lg leading-relaxed text-neutral-600">
          ARCHIVE is where sellers list social media, gaming and marketplace accounts they no longer use and buyers find them in one place.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/browse"
            className="group inline-flex items-center gap-3 rounded-full bg-black px-8 py-4 font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-neutral-800"
          >
            Browse accounts
            <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/dashboard/seller/add-listing"
            className="inline-flex items-center rounded-full border-2 border-black bg-white/80 px-8 py-[0.9rem] font-semibold text-black backdrop-blur transition-colors hover:bg-black hover:text-white"
          >
            Sell an account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
