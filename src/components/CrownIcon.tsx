export default function CrownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 8.5 6 11l3.2-5L12 11l2.8-5L18 11l4-2.5-2 9.5H4L2 8.5Z" />
      <rect x="4" y="19" width="16" height="2" rx="1" />
    </svg>
  );
}
