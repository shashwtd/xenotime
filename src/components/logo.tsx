import { Clock } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className = "", size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: {
      container: "h-10 w-10 rounded-xl",
      icon: 20,
      title: "text-lg",
      subtitle: "text-[10px]",
      gap: "gap-2.5"
    },
    md: {
      container: "h-12 w-12 rounded-xl",
      icon: 24,
      title: "text-xl",
      subtitle: "text-[10px]",
      gap: "gap-3"
    },
    lg: {
      container: "h-14 w-14 rounded-2xl",
      icon: 32,
      title: "text-2xl",
      subtitle: "text-xs",
      gap: "gap-3.5"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center ${currentSize.gap} select-none ${className}`}>
      <div className={`flex items-center justify-center bg-linear-to-br from-[#e07122] via-[#e6a448] to-[#ff6a00] shadow-[0_8px_20px_-8px_rgba(15,10,6,0.3)] ${currentSize.container}`}>
        <Clock 
          size={currentSize.icon} 
          strokeWidth={2.2} 
          className="text-white opacity-80" 
        />
      </div>
      {showText && (
        <div>
          <p className={`font-semibold tracking-tight text-foreground ${currentSize.title}`}>
            xenotime
          </p>
          <p className={`font-semibold uppercase tracking-wide text-(--accent-soft) ${currentSize.subtitle}`}>
            study tracker
          </p>
        </div>
      )}
    </div>
  );
}
