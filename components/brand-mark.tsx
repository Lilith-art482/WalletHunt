export function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="brand-mark"
      fill="none"
      height={size}
      viewBox="0 0 28 28"
      width={size}
    >
      <path
        d="M4 10V4h6M18 4h6v6M24 18v6h-6M10 24H4v-6"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.8"
      />
      <path
        d="M10.4 15.7 13 12l1.7 2.1 1.4-2.5 1.5 4.1"
        stroke="var(--gold)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45"
      />
      <circle cx="14" cy="18.5" r="1" fill="var(--gold)" />
    </svg>
  );
}
