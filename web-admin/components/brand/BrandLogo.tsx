import Image from "next/image";

export type BrandLogoVariant = "dark" | "light" | "icon";
export type BrandLogoSize = "sm" | "md" | "lg";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  showTagline?: boolean;
  className?: string;
  priority?: boolean;
};

const SIZE_MAP = {
  sm: {
    icon: { width: 28, height: 28 },
    wordmark: "text-base",
    tagline: "text-[0.55rem]",
  },
  md: {
    icon: { width: 36, height: 36 },
    wordmark: "text-xl",
    tagline: "text-[0.62rem]",
  },
  lg: {
    icon: { width: 48, height: 48 },
    wordmark: "text-2xl",
    tagline: "text-[0.7rem]",
  },
} as const;

/** Cache-busting v2 assets; slogan uses XML entity KAR&#x0130;YER in SVG. */
const SRC = {
  dark: "/brand/internai-logo-dark-v2.svg",
  light: "/brand/internai-logo-light-v2.svg",
  icon: "/brand/internai-icon.svg",
} as const;

const TAGLINE = "KARİYER PLATFORMU";

export function BrandLogo({
  variant = "dark",
  size = "md",
  showTagline = true,
  className = "",
  priority = false,
}: BrandLogoProps) {
  const dims = SIZE_MAP[size];

  if (variant === "icon") {
    return (
      <Image
        src={SRC.icon}
        alt="InternAI"
        width={dims.icon.width}
        height={dims.icon.height}
        priority={priority}
        className={`block shrink-0 ${className}`.trim()}
      />
    );
  }

  // Prefer composited HTML tagline so Turkish İ never depends on SVG text rasterization.
  if (showTagline) {
    const wordmarkClass =
      variant === "light" ? "text-[#0F172A]" : "text-[#F8FAFC]";
    const taglineClass =
      variant === "light" ? "text-[#7C3AED]" : "text-[#A78BFA]";

    return (
      <span
        className={`inline-flex items-center gap-2.5 ${className}`.trim()}
        aria-label={`InternAI ${TAGLINE}`}
      >
        <Image
          src={SRC.icon}
          alt=""
          width={dims.icon.width}
          height={dims.icon.height}
          priority={priority}
          className="block shrink-0"
          aria-hidden
        />
        <span className="flex min-w-0 flex-col leading-tight">
          <span
            className={`font-semibold tracking-tight ${dims.wordmark} ${wordmarkClass}`}
          >
            InternAI
          </span>
          <span
            className={`mt-0.5 font-semibold uppercase tracking-[0.22em] ${dims.tagline} ${taglineClass}`}
          >
            {TAGLINE}
          </span>
        </span>
      </span>
    );
  }

  const wordmarkClass =
    variant === "light" ? "text-[#0F172A]" : "text-[#F8FAFC]";

  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`.trim()}
      aria-label="InternAI"
    >
      <Image
        src={SRC.icon}
        alt=""
        width={dims.icon.width}
        height={dims.icon.height}
        priority={priority}
        className="block shrink-0"
        aria-hidden
      />
      <span
        className={`font-semibold tracking-tight ${dims.wordmark} ${wordmarkClass}`}
      >
        InternAI
      </span>
    </span>
  );
}
