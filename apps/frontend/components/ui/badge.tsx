import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "green" | "yellow" | "red" | "neutral";
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        variant === "green" && "border-emerald-300 bg-emerald-50 text-emerald-700",
        variant === "yellow" && "border-amber-300 bg-amber-50 text-amber-700",
        variant === "red" && "border-rose-300 bg-rose-50 text-rose-700",
        variant === "neutral" && "border-slate-300 bg-slate-50 text-slate-700",
        className,
      )}
      {...props}
    />
  );
}
