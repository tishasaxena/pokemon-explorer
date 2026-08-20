interface PokeballIconProps {
  size?: number
  className?: string
}

export function PokeballIcon({ size = 28, className = '' }: PokeballIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pokeball-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="100%" stopColor="#e63946" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill="url(#pokeball-red)" stroke="#1f1f1f" strokeWidth="2" />
      <path d="M3 24a21 21 0 0 1 42 0z" fill="url(#pokeball-red)" />
      <path d="M3 24h42" stroke="#1f1f1f" strokeWidth="2.5" />
      <path d="M3 24a21 21 0 0 0 42 0" fill="white" stroke="#1f1f1f" strokeWidth="2" />
      <circle cx="24" cy="24" r="7.5" fill="white" stroke="#1f1f1f" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="3.5" fill="#f1f1f1" stroke="#1f1f1f" strokeWidth="1.5" />
    </svg>
  )
}
