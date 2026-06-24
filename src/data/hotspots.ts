import {
  Home, Factory, DoorOpen, DoorClosed, AppWindow,
  Trees, Droplets, Fence, Route, Warehouse,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Hotspot {
  id: string
  label: string
  /** position as a fraction (0..1) of the source image, so dots track the photo under object-cover */
  x: number
  y: number
  icon: LucideIcon
  before: string
  work: string[]
  cost: number
}

/* x/y are tuned to public/new.jpg (2752×1536). Re-tune here if the photo changes. */
export const HOTSPOTS: Hotspot[] = [
  { id: 'roof', label: 'Roof', x: 0.30, y: 0.27, icon: Home,
    before: 'Sagging deck with curled and missing shingles, moss and dark water stains soaking into the attic.',
    work: ['Full tear-off to the deck', 'Replaced rotted decking', 'GAF Timberline architectural shingles', 'New underlayment, drip edge & ridge vent'],
    cost: 14800 },
  { id: 'chimney', label: 'Chimney', x: 0.205, y: 0.085, icon: Factory,
    before: 'Cracked crown and spalling brick with no cap — water and animals straight into the flue.',
    work: ['Rebuilt the crown', 'Tuckpointed & repaired brick', 'New stainless-steel cap', 'Relined the flue'],
    cost: 4200 },
  { id: 'porch', label: 'Front Porch', x: 0.31, y: 0.56, icon: DoorOpen,
    before: 'Rotted decking and posts, sagging broken steps, paint peeling down to bare wood.',
    work: ['New joists & framing', 'Composite decking', 'Restored turned columns', 'Code-compliant railings & steps'],
    cost: 6500 },
  { id: 'door', label: 'Front Door', x: 0.42, y: 0.59, icon: DoorClosed,
    before: 'Warped hollow-core door with a broken lock and a rotted, drafty frame.',
    work: ['Insulated fiberglass entry door', 'Keyless smart lock', 'New weatherstripping', 'Repainted jamb & casing'],
    cost: 2400 },
  { id: 'windows', label: 'Windows', x: 0.52, y: 0.41, icon: AppWindow,
    before: 'Broken and boarded panes, rotted sashes and failed seals fogging the glass.',
    work: ['12× double-hung vinyl windows', 'Low-E glass with argon fill', 'New trim & shutters', 'Full reseal'],
    cost: 11200 },
  { id: 'lawn', label: 'Lawn & Landscaping', x: 0.16, y: 0.90, icon: Trees,
    before: 'Dead, overgrown weeds, bare dirt patches and scattered debris across the yard.',
    work: ['Regraded for drainage', 'Fresh sod & irrigation', 'Native beds & mulch', 'Two young maple trees'],
    cost: 5300 },
  { id: 'plumbing', label: 'Plumbing', x: 0.44, y: 0.135, icon: Droplets,
    before: 'Corroded galvanized supply, leaking drains and a failing water heater.',
    work: ['Full PEX repipe', 'New fixtures & shut-offs', 'Tankless water heater', 'Sewer scope + spot repair'],
    cost: 9700 },
  { id: 'fence', label: 'Fence', x: 0.115, y: 0.87, icon: Fence,
    before: 'Leaning sections, rotted pickets and broken rails along the property line.',
    work: ['New cedar privacy fence', 'Concrete-set posts', 'Stained & sealed', 'Full perimeter rebuild'],
    cost: 4600 },
  { id: 'gate', label: 'Gate', x: 0.47, y: 0.90, icon: DoorOpen,
    before: 'Broken hinges, dragging on the ground, with no working latch.',
    work: ['Rebuilt gate frame', 'Heavy-duty hinges', 'Self-closing latch', 'Matching hardware'],
    cost: 650 },
  { id: 'driveway', label: 'Driveway', x: 0.83, y: 0.86, icon: Route,
    before: 'Cracked, heaving asphalt with weeds in every seam and water pooling at the garage.',
    work: ['Demo of old asphalt', 'New poured concrete drive', 'Proper grading & drainage', 'Sealed finish'],
    cost: 8900 },
  { id: 'garage', label: 'Garage Door', x: 0.69, y: 0.61, icon: Warehouse,
    before: 'Dented panels, broken springs and a dead opener that no longer closed fully.',
    work: ['Insulated steel carriage door', 'Belt-drive smart opener', 'New springs & tracks', 'Weather seal'],
    cost: 3100 },
]

export const TOTAL_INVESTED = HOTSPOTS.reduce((s, h) => s + h.cost, 0)
