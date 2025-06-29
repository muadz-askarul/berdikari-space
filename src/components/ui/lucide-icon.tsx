import { Icons } from '@/types/types'

export default function LucideIcon({
  name,
  ...props
}: {
  name: keyof typeof Icons
}) {
  const IconComponent = Icons[name]

  if (!IconComponent) return <span>Unknown icon: {name}</span>

  return (<IconComponent {...props} />) as any
}
