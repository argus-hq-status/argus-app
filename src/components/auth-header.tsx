import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function AuthHeader() {
  const pathname = useLocation().pathname;

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <Link to="/login" className="flex items-center gap-2.5">
        <img src="/images/logo.svg" alt="ArgusHQ" className="size-8" />
        <span className="text-sm font-semibold text-gray-900">ArgusHQ</span>
      </Link>
      <div className="flex items-center gap-3">
        {pathname === "/login" ? (
          <Link to="/signup">
            <Button variant="secondary" size="sm">Create account</Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button variant="secondary" size="sm">Sign in</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
