import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type FloatingPreviewCardProps = {
  title: string;
  className?: string;
  rotate?: number;
  children: React.ReactNode;
};

const FloatingPreviewCard = ({
  title,
  className,
  rotate = 0,
  children,
}: FloatingPreviewCardProps) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 18;
      const y = (event.clientY / innerHeight - 0.5) * 18;

      setOffset({
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
      });
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div
      className={cn(
        "absolute hidden w-64 rounded-3xl border border-white/50 bg-background/75 p-4 text-left shadow-[0_24px_80px_-32px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-transform duration-300 ease-out motion-safe:animate-in motion-safe:fade-in lg:block dark:border-white/10 dark:bg-slate-950/70",
        className
      )}
      style={{
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${rotate}deg)`,
      }}
    >
      {/* Decorative preview cards framing the auth surface */}
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
};

export default FloatingPreviewCard;
