import { Icons } from '@/types/types'

export default function LucideIcon({ name, ...props }: { name: string }) {
  const IconComponent = Icons?.[name as keyof typeof Icons]

  if (!IconComponent) return <span>Unknown icon: {name}</span>

  return (<IconComponent {...props} />) as any
}
