import { cn } from "~/lib/utils";

export function Avatar({
  src,
  alt,
  initials,
  size = "md",
  className,
}: {
  src?: string;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-12 text-base",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "select-none font-medium uppercase",
        src ? "" : "bg-primary/20 text-primary",
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={alt ?? ""} className="size-full object-cover" />
      ) : (
        <span>{initials ?? "U"}</span>
      )}
    </div>
  );
}
