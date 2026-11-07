// Maps the icon names used in src/data/portfolio.js to lucide components.
// (Brand icons live in BrandIcons.jsx — lucide 1.70 ships none.)
import {
  Brain,
  Boxes,
  Code2,
  Database,
  Globe,
  HeartPulse,
  Layers,
  Server,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  TrainFront,
  Wrench,
} from 'lucide-react'

export const ICONS = {
  Brain,
  Boxes,
  Code2,
  Database,
  Globe,
  HeartPulse,
  Layers,
  Server,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  TrainFront,
  Wrench,
}

export function DataIcon({ name, size = 20 }) {
  const Icon = ICONS[name]
  if (!Icon) return null
  return <Icon size={size} aria-hidden="true" />
}
