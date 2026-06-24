/* Ashwood Revival — hotspot dataset
 * Coordinates are % of the hero image (x from left, y from top), tuned to the
 * placeholder SVG. When you swap in the Nano Banana renders, re-tune x/y.
 * Costs are illustrative USD for the demo narrative.
 */
(function () {
  // Small inline SVG icons (Lucide-style, 24x24, currentColor stroke)
  var I = {
    roof:    '<path d="M3 12 12 4l9 8"/><path d="M5 11v8h14v-8"/>',
    chimney: '<path d="M4 21V8l8-4 8 4v13"/><path d="M15 4V2h3v4"/>',
    porch:   '<path d="M3 20h18"/><path d="M5 20v-6h14v6"/><path d="M4 14 12 8l8 6"/>',
    door:    '<rect x="6" y="3" width="12" height="18" rx="1"/><path d="M14 12h.5"/>',
    window:  '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M12 4v16M4 12h16"/>',
    lawn:    '<path d="M4 20c2-4 4-6 4-10M10 20c1-5 1-8 1-11M16 20c0-4 1-7 3-10M20 20H2"/>',
    plumbing:'<path d="M7 3v6a4 4 0 0 0 4 4h2a4 4 0 0 1 4 4v4"/><circle cx="7" cy="3" r="0"/><path d="M5 3h4M15 19h4"/>',
    fence:   '<path d="M3 21V8l3-3 3 3v13M15 21V8l3-3 3 3v13M3 12h18M3 16h18"/>',
    gate:    '<path d="M3 21V6h18v15"/><path d="M3 10l18 6M21 10 3 16M12 6v15"/>',
    driveway:'<path d="M7 21 9 3h6l2 18"/><path d="M11 8h2M10.5 13h3"/>',
    garage:  '<path d="M3 21V8l9-4 9 4v13"/><path d="M6 21v-7h12v7"/><path d="M6 17h12"/>'
  };

  window.AW_HOTSPOTS = [
    { id: 'roof', label: 'Roof', x: 50, y: 39, icon: I.roof,
      before: 'Sagging deck with curled and missing shingles, moss growth, and water-stained sheathing letting rain into the attic.',
      work: ['Full tear-off down to the deck', 'Replaced rotted decking sections', 'GAF Timberline architectural shingles', 'New underlayment, drip edge & ridge vent'],
      cost: 14800 },

    { id: 'chimney', label: 'Chimney', x: 39, y: 32, icon: I.chimney,
      before: 'Cracked crown, spalling brick and no cap — water and animals getting straight into the flue.',
      work: ['Rebuilt the chimney crown', 'Tuckpointed & repaired brick', 'New stainless steel cap', 'Relined the flue'],
      cost: 4200 },

    { id: 'porch', label: 'Front Porch', x: 49, y: 71, icon: I.porch,
      before: 'Rotted decking and posts, sagging broken steps, and paint peeling down to bare wood.',
      work: ['New joists & framing', 'Composite decking boards', 'Turned columns restored', 'Code-compliant railings & steps'],
      cost: 6500 },

    { id: 'door', label: 'Front Door', x: 49, y: 62, icon: I.door,
      before: 'Warped hollow-core door with a broken lock and a rotted, drafty frame.',
      work: ['Insulated fiberglass entry door', 'Keyless smart lock', 'New weatherstripping', 'Repainted jamb & casing'],
      cost: 2400 },

    { id: 'windows', label: 'Windows', x: 60, y: 50, icon: I.window,
      before: 'Broken and boarded panes, rotted sashes, and failed seals fogging the glass.',
      work: ['12× double-hung vinyl windows', 'Low-E glass with argon fill', 'New interior & exterior trim', 'Fresh shutters'],
      cost: 11200 },

    { id: 'lawn', label: 'Lawn & Landscaping', x: 16, y: 78, icon: I.lawn,
      before: 'Dead, overgrown weeds, bare dirt patches and scattered debris across the yard.',
      work: ['Regraded for drainage', 'Fresh sod & irrigation', 'Native planting beds & mulch', 'Two young maple trees'],
      cost: 5300 },

    { id: 'plumbing', label: 'Plumbing', x: 35, y: 67, icon: I.plumbing,
      before: 'Corroded galvanized supply lines, leaking drains and a failing water heater.',
      work: ['Full PEX repipe', 'New fixtures & shut-offs', 'Tankless water heater', 'Sewer scope + spot repair'],
      cost: 9700 },

    { id: 'fence', label: 'Fence', x: 11, y: 80, icon: I.fence,
      before: 'Leaning sections, rotted pickets and broken rails along the property line.',
      work: ['New cedar privacy fence', 'Concrete-set posts', 'Stained & sealed', 'Full perimeter rebuild'],
      cost: 4600 },

    { id: 'gate', label: 'Gate', x: 49, y: 80, icon: I.gate,
      before: 'Broken hinges, dragging on the ground, with no working latch.',
      work: ['Rebuilt gate frame', 'Heavy-duty hinges', 'Self-closing latch', 'Matching hardware'],
      cost: 650 },

    { id: 'driveway', label: 'Driveway', x: 76, y: 89, icon: I.driveway,
      before: 'Cracked, heaving asphalt with weeds in every seam and water pooling at the garage.',
      work: ['Demo of old asphalt', 'New poured concrete drive', 'Proper grading & drainage', 'Sealed finish'],
      cost: 8900 },

    { id: 'garage', label: 'Garage Door', x: 74, y: 64, icon: I.garage,
      before: 'Dented panels, broken springs and a dead opener that no longer closed fully.',
      work: ['Insulated steel carriage door', 'Belt-drive smart opener', 'New springs & tracks', 'Weather seal'],
      cost: 3100 }
  ];
})();
