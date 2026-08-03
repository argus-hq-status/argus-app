export default function AuthFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>&copy; {new Date().getFullYear()} Strauz</span>
        <div className="flex items-center gap-4">
          <a href="https://argushq.com" className="transition hover:text-gray-600">Website</a>
          <a href="https://argushq.com/privacy" className="transition hover:text-gray-600">Privacy</a>
          <a href="https://argushq.com/terms" className="transition hover:text-gray-600">Terms</a>
        </div>
      </div>
    </footer>
  );
}
