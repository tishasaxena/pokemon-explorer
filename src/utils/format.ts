export function formatId(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatName(name: string): string {
  return name
    .split('-')
    .map((part) => capitalize(part))
    .join(' ')
}

export function formatHeight(decimetres: number): string {
  return `${(decimetres / 10).toFixed(1)} m`
}

export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`
}
