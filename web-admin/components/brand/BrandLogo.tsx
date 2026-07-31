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
    full: { width: 140, height: 32 },
    fullWithTagline: { width: 168, height: 38 },
  },
  md: {
    icon: { width: 36, height: 36 },
    full: { width: 176, height: 40 },
    fullWithTagline: { width: 208, height: 46 },
  },
  lg: {
    icon: { width: 48, height: 48 },
    full: { width: 220, height: 50 },
    fullWithTagline: { width: 260, height: 58 },
  },
} as const;

const SRC: Record<BrandLogoVariant, string> = {
  dark: "/brand/internai-logo-dark.svg",
  light: "/brand/internai-logo-light.svg",
  icon: "/brand/internai-icon.svg",
};

export function BrandLogo({
  variant = "dark",
  size = "md",
  showTagline = true,
  className = "",
  priority = false,
}: BrandLogoProps) {
  if (variant === "icon") {
    const dims = SIZE_MAP[size].icon;
    return (
      <Image
        src={SRC.icon}
        alt="InternAI"
        width={dims.width}
        height={dims.height}
        priority={priority}
        className={`block shrink-0 ${className}`.trim()}
      />
    );
  }

  if (!showTagline) {
    const iconDims = SIZE_MAP[size].icon;
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
          width={iconDims.width}
          height={iconDims.height}
          priority={priority}
          className="block shrink-0"
          aria-hidden
        />
        <span
          className={`text-[1.05em] font-semibold tracking-tight ${wordmarkClass}`}
          style={{
            fontSize:
              size === "sm" ? "1rem" : size === "lg" ? "1.5rem" : "1.2rem",
          }}
        >
          InternAI
        </span>
      </span>
    );
  }

  const dims = SIZE_MAP[size].fullWithTagline;

  return (
    <Image
      src={SRC[variant]}
      alt="InternAI — Kariyer Platformu"
      width={dims.width}
      height={dims.height}
      priority={priority}
      className={`block h-auto max-w-full shrink-0 ${className}`.trim()}
    />
  );
}
