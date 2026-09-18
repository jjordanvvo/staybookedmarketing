# Client Kickoff Deck

`StayBooked_Client_Kickoff.pptx` — the client kickoff meeting deck, generated from
`Client_Kickoff_Role_Breakdown.docx`.

21 slides, 16:9. Every slide carries speaker notes with the talking points (including the
internal-only guidance that should not be read aloud).

## Running order

The three sections are deliberately **not** in the order of the source document. The deck
opens with money because that is what the client is most focused on, covers operations
while they are engaged, and closes with compliance so the paperwork lands as reassurance
rather than as a hurdle.

| Deck part | Source doc section |
|---|---|
| 01 — Money & Strategy | was section 02 |
| 02 — Relationship & Operations | was section 03 |
| 03 — Compliance & Legal | was section 01 |

## Before presenting

- Slide 1: fill in the practice name and the date.
- Slide 2: write presenter names into the three `LED BY` blanks.

## Regenerating

```bash
npm install pptxgenjs      # only if the require fails
node build-kickoff-deck.js # writes StayBooked_Client_Kickoff.pptx alongside this file
```

Run it from this directory — the logo paths are relative to it.

## Design notes

Colors come from the website's Tailwind palette (matte cream `#F0EBE0`, rich black
`#141414`, brand gold `#CFB48E`), with a per-section accent: terracotta for money, teal for
operations, olive gold for compliance. The `sbm.` wordmark was extracted from
`staybooked-website/SBM Logo.png` into transparent cream and black variants under `assets/`.

The two native charts use `#D2703C` / `#00A093`, a pair validated for contrast and
color-vision-deficiency separation against both the light and dark slide surfaces.

Fonts are Cambria (headings) and Calibri (body) — both ship with Office, so the deck renders
the same on any machine.

## A note on the numbers

Every figure traces back to the source document. Two are derived rather than quoted, and
both are labeled as such on the slide:

- **$700 ceiling per qualified lead** — $3,500/month × 3 months ÷ 15 guaranteed leads.
- **The ramp chart** is an illustrative shape, not a forecast. The slide says so, because
  the source document only describes the *pattern* (slow months 1–2, bigger numbers in
  months 3–6), not any specific volumes.

The `$1,000` last-resort ad spend minimum appears **only in the speaker notes**, never on a
slide, per the source document's guidance not to dwell on anything below $1,500.
