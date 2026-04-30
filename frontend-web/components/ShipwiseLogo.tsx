import Image from "next/image";
import { cn } from "@/lib/utils";

interface ShipwiseLogoProps {
  className?: string;
  compact?: boolean;
  /** When not compact, show the staff portal label under the mark */
  showStaffBadge?: boolean;
}

export function ShipwiseLogo({
  className,
  compact = false,
  showStaffBadge = true,
}: ShipwiseLogoProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        compact ? "items-start" : "items-start sm:items-center",
        className,
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full border border-cyan-400/30 bg-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.18)] ring-2 ring-cyan-500/15",
          compact ? "h-14 w-14" : "h-36 w-36 sm:h-44 sm:w-44",
        )}
      >
        <Image
          src="/brand/shipwise-logo.png"
          alt="ShipWise — Ship Smart, Manage Wise"
          fill
          priority
          sizes={compact ? "56px" : "(max-width:640px) 144px, 176px"}
          className="object-cover object-center scale-[1.12]"
        />
      </div>
      {!compact && showStaffBadge ? (
        <span className="inline-flex items-center rounded-md border border-cyan-400/35 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200">
          Staff portal
        </span>
      ) : null}
    </div>
  );
}
