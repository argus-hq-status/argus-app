import AuthFooter from "./footer";
import AuthHeader from "./header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <AuthHeader />
      <div className="relative isolate flex w-full flex-1 flex-col items-center justify-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[318px] w-full max-w-[1140px] -translate-x-1/2 -translate-y-1/2">
          <div className="size-full bg-[radial-gradient(ellipse_at_center,_oklch(0.72_0.22_40_/_0.08)_0%,_transparent_70%)]" />
        </div>
        {children}
      </div>
      <AuthFooter />
    </div>
  );
}
