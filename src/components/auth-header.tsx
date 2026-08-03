import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function AuthHeader() {
  const pathname = useLocation().pathname;

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      <Link to="/login" className="font-sans text-sm font-semibold tracking-tight text-gray-900">
        Strauz
      </Link>
      <div className="flex items-center gap-3">
        {pathname === "/login" ? (
          <Link to="/signup">
            <Button variant="neutral" size="sm">Create account</Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button variant="neutral" size="sm">Sign in</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
