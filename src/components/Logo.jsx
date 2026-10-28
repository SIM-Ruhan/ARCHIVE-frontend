import Link from "next/link";

// ARCHIVE mark: an "A" whose crossbar is a drawer slot — a nod to filing cabinets / archives.
export function LogoMark({ size = 36, inverted = false, className = "" }) {
  const bg = inverted ? "#FFFFFF" : "#000000";
  const fg = inverted ? "#000000" : "#FFFFFF";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="ARCHIVE"
      className={className}
    >
      <rect width="64" height="64" rx="17" fill={bg} />
      <path
        d="M17.5 47 L32 15.5 L46.5 47"
        fill="none"
        stroke={fg}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="23.5" y="35" width="17" height="6.5" rx="3.25" fill="#3B5BFF" />
    </svg>
  );
}

export default function Logo({ size = 36, inverted = false, href = "/", className = "" }) {
  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} inverted={inverted} />
      <span
        className={`font-display text-[1.35rem] font-extrabold leading-none tracking-[0.14em] ${
          inverted ? "text-white" : "text-black"
        }`}
      >
        ARCHIVE
      </span>
    </span>
  );
  return href ? (
    <Link href={href} aria-label="ARCHIVE home" className="inline-flex">
      {content}
    </Link>
  ) : (
    content
  );
}
