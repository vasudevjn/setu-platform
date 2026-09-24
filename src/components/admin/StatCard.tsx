import { Card } from '../ui/Card'

export function StatCard({ value, label, hint }: { value: number; label: string; hint?: string }) {
  return (
    <Card className="p-4">
      <p className="text-[2rem] font-bold leading-none text-teal">{value}</p>
      <p className="mt-2 font-semibold">{label}</p>
      {hint && <p className="text-detail text-muted">{hint}</p>}
    </Card>
  )
}
