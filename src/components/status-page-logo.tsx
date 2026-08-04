import { Avatar } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

type StatusPageLogoProps = {
  name: string;
  src?: string | null;
  className?: string;
};

export function StatusPageLogo({ name, src, className }: StatusPageLogoProps) {
  const initials = name.trim().slice(0, 2).toUpperCase() || "S";

  return (
    <Avatar
      src={src ?? undefined}
      alt={name}
      initials={initials}
      className={cn(
        "bg-linear-to-br from-sky-500 via-cyan-500 to-emerald-400 text-white ring-1 ring-inset ring-white/15",
        className,
      )}
    />
  );
}
