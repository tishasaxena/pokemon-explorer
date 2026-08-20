import { getTypeColor, getTypeIcon, shadeColor } from '../constants/typeColors'
import { capitalize } from '../utils/format'

interface TypeBadgeProps {
  type: string
  size?: 'sm' | 'md'
}

export function TypeBadge({ type, size = 'sm' }: TypeBadgeProps) {
  const color = getTypeColor(type)
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold text-white shadow-sm ring-1 ring-black/10 ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3.5 py-1.5 text-sm'
      }`}
      style={{
        background: `linear-gradient(135deg, ${shadeColor(color, 12)}, ${shadeColor(color, -12)})`,
      }}
    >
      <span aria-hidden="true">{getTypeIcon(type)}</span>
      {capitalize(type)}
    </span>
  )
}
