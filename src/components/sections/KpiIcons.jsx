const common = {
  className: 'h-7 w-7 shrink-0 text-accent-cyan',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function KpiIcon({ name }) {
  switch (name) {
    case 'layers':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.84z" />
          <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.89a2 2 0 0 0 1.65 0l8.58-3.89A1 1 0 0 0 22 12" />
          <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.89a2 2 0 0 0 1.65 0l8.58-3.89A1 1 0 0 0 22 17" />
        </svg>
      )
    case 'bolt':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    case 'award':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      )
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      )
    case 'book':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
  }
}
