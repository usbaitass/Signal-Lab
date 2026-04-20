import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  className?: string;
  children: ReactNode;
};

export function Card({ className, children }: CardProps) {
  return (
    <section className={cn("rounded-xl border bg-white p-6 shadow-sm", className)}>
      {children}
    </section>
  );
}
