import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { search, type SearchEntry } from '@/lib/search'
import { getSearchIndex } from '@/lib/searchIndex'

/**
 * Site-wide search, mounted in the nav directly left of Book a Call.
 *
 * Desktop: a compact pill input with a results dropdown. Mobile (and the
 * tablet band where the link row leaves no room for an input): a search icon
 * that opens a full-width overlay holding the same input and list. Both are
 * one ARIA combobox: the input owns the listbox, arrow keys move
 * aria-activedescendant, Enter opens the active (or first) result, Escape
 * closes, and "/" anywhere on the page focuses the search.
 *
 * Results are static (see lib/searchIndex.ts) and link to the page, or to the
 * section anchor for the one-page layouts. App.tsx's hash scroller finishes
 * cross-page anchors once the target section mounts.
 */

const MOBILE_QUERY = '(max-width: 1100px)'

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable
}

function SearchIcon() {
  return (
    <svg className="search-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5 14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function SiteSearch() {
  const navigate = useNavigate()
  const location = useLocation()
  const baseId = useId()
  const listId = `${baseId}-listbox`
  const optionId = (i: number) => `${baseId}-option-${i}`

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false) // desktop dropdown
  const [overlay, setOverlay] = useState(false) // mobile overlay
  const [active, setActive] = useState(-1)

  const rootRef = useRef<HTMLDivElement>(null)
  const inlineInputRef = useRef<HTMLInputElement>(null)
  const overlayInputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const results = useMemo(() => (query.trim() ? search(getSearchIndex(), query) : []), [query])
  const hasQuery = query.trim().length > 0
  // The empty state is itself an option so Enter can open the booking link.
  const optionCount = hasQuery ? Math.max(results.length, 1) : 0
  const expanded = hasQuery && (overlay || open)

  const closeAll = useCallback(() => {
    setOpen(false)
    setActive(-1)
  }, [])

  const closeOverlay = useCallback(() => {
    setOverlay(false)
    setOpen(false)
    setActive(-1)
    triggerRef.current?.focus()
  }, [])

  // Results reset the highlight; the list scrolls to keep the active row visible.
  useEffect(() => setActive(-1), [results])
  useEffect(() => {
    if (active < 0) return
    const el = document.getElementById(optionId(active))
    el?.scrollIntoView({ block: 'nearest' })
  })

  // Overlay: focus its input on open, lock page scroll while it's up.
  useEffect(() => {
    if (!overlay) return
    overlayInputRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [overlay])

  // "/" focuses the search from anywhere that isn't already a text field.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return
      if (isTypingTarget(e.target)) return
      e.preventDefault()
      if (window.matchMedia(MOBILE_QUERY).matches) setOverlay(true)
      else {
        inlineInputRef.current?.focus()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Clicking anywhere outside retires the desktop dropdown.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) closeAll()
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open, closeAll])

  // Leaving the page always retires the overlay.
  useEffect(() => {
    setOverlay(false)
    setOpen(false)
    setActive(-1)
  }, [location.pathname])

  const go = (entry: SearchEntry) => {
    const [pathname, hash = ''] = entry.path.split('#')
    const samePlace = location.pathname === pathname && location.hash === (hash ? `#${hash}` : '')
    setOverlay(false)
    closeAll()
    setQuery('')
    if (samePlace) {
      // The router effect only runs on a change; scroll by hand.
      if (hash) document.getElementById(hash)?.scrollIntoView()
      else window.scrollTo(0, 0)
      return
    }
    navigate(entry.path)
  }

  const openBooking = () => {
    setOverlay(false)
    closeAll()
    navigate('/book')
  }

  const choose = (i: number) => {
    if (results.length === 0) openBooking()
    else go(results[i] ?? results[0])
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        if (!optionCount) return
        e.preventDefault()
        setOpen(true)
        setActive((a) => (a + 1) % optionCount)
        break
      case 'ArrowUp':
        if (!optionCount) return
        e.preventDefault()
        setOpen(true)
        setActive((a) => (a <= 0 ? optionCount - 1 : a - 1))
        break
      case 'Enter':
        if (!expanded && !hasQuery) return
        e.preventDefault()
        choose(active < 0 ? 0 : active)
        break
      case 'Escape':
        e.preventDefault()
        if (overlay) closeOverlay()
        else if (open) closeAll()
        else {
          setQuery('')
          e.currentTarget.blur()
        }
        break
      case 'Home':
        if (!expanded) return
        e.preventDefault()
        setActive(0)
        break
      case 'End':
        if (!expanded) return
        e.preventDefault()
        setActive(optionCount - 1)
        break
    }
  }

  // Plain clicks route through go() so same-page anchors still scroll;
  // modified clicks (new tab) keep the native link behavior.
  const onResultClick = (e: MouseEvent<HTMLAnchorElement>, entry: SearchEntry) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    go(entry)
  }

  const input = (ref: RefObject<HTMLInputElement>, mobile: boolean) => (
    <div className="search-field">
      <SearchIcon />
      <input
        ref={ref}
        className="search-input"
        type="text"
        role="combobox"
        placeholder="Search"
        aria-label="Search the site"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={expanded}
        aria-controls={listId}
        aria-activedescendant={expanded && active >= 0 ? optionId(active) : undefined}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        enterKeyHint="go"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => !mobile && setOpen(true)}
        onKeyDown={onKeyDown}
      />
    </div>
  )

  const list = (
    <ul
      ref={listRef}
      id={listId}
      className="search-list"
      role="listbox"
      aria-label="Search results"
    >
      {results.map((r, i) => (
        <li
          key={r.path + r.title}
          id={optionId(i)}
          role="option"
          aria-selected={active === i}
          className={`search-option${active === i ? ' search-option-active' : ''}`}
          onMouseEnter={() => setActive(i)}
        >
          <a href={r.path} tabIndex={-1} onClick={(e) => onResultClick(e, r)}>
            <span className="search-option-title">{r.title}</span>
            <span className="search-option-meta">
              {r.section}
              <span aria-hidden="true"> · </span>
              {r.page}
            </span>
          </a>
        </li>
      ))}
      {results.length === 0 && (
        <li
          id={optionId(0)}
          role="option"
          aria-selected={active === 0}
          className={`search-option search-empty${active === 0 ? ' search-option-active' : ''}`}
          onMouseEnter={() => setActive(0)}
        >
          <a
            href="/book"
            tabIndex={-1}
            onClick={() => {
              setOverlay(false)
              closeAll()
            }}
          >
            <span className="search-option-title">No results.</span>
            <span className="search-option-meta">Book a call and ask us directly.</span>
          </a>
        </li>
      )}
    </ul>
  )

  return (
    <div className="search" ref={rootRef}>
      {/* Desktop: inline input + dropdown */}
      <div className="search-inline">
        {input(inlineInputRef, false)}
        {expanded && !overlay && <div className="search-panel">{list}</div>}
      </div>

      {/* Mobile / tablet: icon that opens the overlay */}
      <button
        ref={triggerRef}
        type="button"
        className="search-trigger"
        aria-label="Search the site"
        aria-haspopup="dialog"
        aria-expanded={overlay}
        onClick={() => setOverlay(true)}
      >
        <SearchIcon />
      </button>

      {/* Portaled to <body>: the nav's backdrop-filter would otherwise make it
          the containing block for this fixed overlay and clip it to the bar. */}
      {overlay &&
        createPortal(
          <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search the site">
            <div className="search-overlay-bar">
              {input(overlayInputRef, true)}
              <button type="button" className="search-close" onClick={closeOverlay}>
                Close
              </button>
            </div>
            {hasQuery ? (
              <div className="search-panel">{list}</div>
            ) : (
              <p className="search-hint">Search services, industries, pricing, and FAQ.</p>
            )}
          </div>,
          document.body,
        )}
    </div>
  )
}
