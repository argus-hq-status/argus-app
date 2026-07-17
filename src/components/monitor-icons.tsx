export function MonitorLight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={className}
      fill="currentColor"
    >
      <rect width="256" height="256" fill="none" />
      <rect x="32" y="48" width="192" height="144" rx="16" stroke="currentColor" strokeWidth="16" fill="none" />
      <line x1="160" y1="224" x2="96" y2="224" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
      <line x1="128" y1="192" x2="128" y2="224" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
      <circle cx="128" cy="120" r="8" fill="currentColor" />
    </svg>
  );
}

export function CheckCircleLight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={className}
      fill="currentColor"
    >
      <rect width="256" height="256" fill="none" />
      <circle cx="128" cy="128" r="96" stroke="currentColor" strokeWidth="16" fill="none" />
      <polyline
        points="88 128 112 152 168 104"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
