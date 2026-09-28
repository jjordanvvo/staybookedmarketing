import type { ReactNode } from 'react'

/**
 * FlowSegment — the site's two-act flow.
 *
 * Per Kolby's Sept 28, 2026 direction, the pinned stage figure is gone
 * entirely; each segment is now a normal full-width content flow.
 */
export default function FlowSegment({
  children,
}: {
  variant?: 'A' | 'B'
  children: ReactNode
}) {
  return <div className="flow">{children}</div>
}
