const pptxgen = require("pptxgenjs");
const fs = require("fs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.author = "Stay Booked Marketing";
pres.company = "Stay Booked Marketing";
pres.title = "Client Kickoff Meeting — Role Breakdown";

/* ---------------- palette (from the Stay Booked brand) ---------------- */
const INK = "141414";       // rich black
const INKCARD = "201E1A";   // card on dark
const INKLINE = "35302A";   // hairline on dark
const CREAM = "F0EBE0";     // matte cream
const PAPER = "FBFAF6";     // card on light
const RULE = "C9C2B4";      // warm mid grey
const GOLD = "CFB48E";      // brand gold
const CHAR = "3A3A3A";      // soft charcoal
const MUTE = "6E6656";      // muted warm grey (on light)
const MUTED = "A8A093";     // muted warm grey (on dark)

// section accents
const MONEY = "C0532A";     // terracotta
const OPS = "0F5257";       // deep teal
const LEGAL = "8A6D1E";     // olive gold
const MONEY_GHOST = "38200F";
const OPS_GHOST = "0B272A";
const LEGAL_GHOST = "2E2510";

// chart hues — validated with dataviz/scripts/validate_palette.js
// PASS on all six checks in both light and dark modes
const C1 = "D2703C";        // terracotta (chart)
const C2 = "00A093";        // teal (chart)

const SERIF = "Cambria";
const SANS = "Calibri";

const LOGO_CREAM = "assets/logo_cream.png";
const LOGO_BLACK = "assets/logo_black.png";
const M = 0.75;             // left/right margin
const W = 13.333 - M * 2;   // 11.833 content width

/* ---------------- helpers ---------------- */
let pageNo = 0;

function dark() {
  const s = pres.addSlide();
  s.background = { color: INK };
  return s;
}
function light() {
  const s = pres.addSlide();
  s.background = { color: CREAM };
  return s;
}
function footer(s, isDark) {
  pageNo += 1;
  s.addText("STAY BOOKED MARKETING  ·  CLIENT KICKOFF", {
    x: M, y: 6.92, w: 6, h: 0.3, margin: 0,
    fontFace: SANS, fontSize: 8.5, charSpacing: 1.6,
    color: isDark ? "5C554A" : "9A9080", valign: "middle",
  });
  s.addText(String(pageNo).padStart(2, "0"), {
    x: 13.333 - M - 1, y: 6.92, w: 1, h: 0.3, margin: 0, align: "right",
    fontFace: SANS, fontSize: 8.5, charSpacing: 1.6,
    color: isDark ? "5C554A" : "9A9080", valign: "middle",
  });
  s.addImage({
    path: isDark ? LOGO_CREAM : LOGO_BLACK,
    x: 13.333 - M - 0.72, y: 0.42, w: 0.72, h: 0.229,
    transparency: isDark ? 55 : 78,
  });
}
function head(s, eyebrow, title, accent, isDark) {
  s.addText(eyebrow, {
    x: M, y: 0.62, w: 8.5, h: 0.28, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 10.5, bold: true, charSpacing: 2.6, color: accent,
  });
  s.addText(title, {
    x: M, y: 0.95, w: 11.0, h: 0.72, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 34, bold: true, color: isDark ? CREAM : INK,
  });
}
function card(s, o) {
  s.addShape(pres.ShapeType.roundRect, {
    x: o.x, y: o.y, w: o.w, h: o.h, rectRadius: o.r === undefined ? 0.09 : o.r,
    fill: { color: o.fill },
    line: o.line === null ? { type: "none" } : { color: o.line, width: 0.75 },
  });
}
function badge(s, o) {
  s.addText(o.n, {
    shape: pres.ShapeType.ellipse,
    x: o.x, y: o.y, w: o.d, h: o.d,
    fill: { color: o.fill },
    line: o.line ? { color: o.line, width: 1 } : { type: "none" },
    align: "center", valign: "middle", margin: 0,
    fontFace: SANS, fontSize: o.fs || 13, bold: true, color: o.color,
  });
}
function bullets(s, items, o) {
  s.addText(
    items.map((t, i) => ({
      text: t, options: { bullet: { code: "2013" }, breakLine: i !== items.length - 1 },
    })),
    {
      x: o.x, y: o.y, w: o.w, h: o.h, margin: 0, valign: "top",
      fontFace: SANS, fontSize: o.fs || 13.5, color: o.color || CHAR,
      lineSpacingMultiple: 1.12, paraSpaceAfter: o.gap === undefined ? 7 : o.gap,
    }
  );
}
// shared quiet-chart frame — a fresh object every call (pptxgenjs mutates options)
function chartBase(extra) {
  return Object.assign({
    chartArea: { fill: { color: PAPER }, border: { pt: 0, color: PAPER } },
    plotArea: { fill: { color: PAPER }, border: { pt: 0, color: PAPER } },
    catAxisLabelColor: MUTE, catAxisLabelFontFace: SANS, catAxisLabelFontSize: 11.5,
    valAxisLabelColor: MUTE, valAxisLabelFontFace: SANS, valAxisLabelFontSize: 11,
    catAxisLineShow: false, valAxisLineShow: false,
    catGridLine: { style: "none" },
    valGridLine: { style: "none" },
    dataLabelFontFace: SANS,
    legendFontFace: SANS, legendFontSize: 11.5, legendColor: CHAR,
    border: { pt: 0, color: PAPER },
    fill: PAPER,
  }, extra);
}

/* ==================================================================== */
/* 1 — TITLE                                                            */
/* ==================================================================== */
{
  const s = dark();
  s.addShape(pres.ShapeType.ellipse, {
    x: 8.55, y: 0.95, w: 5.6, h: 5.6,
    fill: { type: "none" }, line: { color: "3B342B", width: 1 },
  });
  s.addShape(pres.ShapeType.ellipse, {
    x: 9.95, y: 2.35, w: 2.8, h: 2.8,
    fill: { color: INKCARD }, line: { color: "463D31", width: 1 },
  });
  s.addShape(pres.ShapeType.ellipse, {
    x: 11.95, y: 5.62, w: 0.34, h: 0.34,
    fill: { color: GOLD }, line: { type: "none" },
  });
  s.addImage({ path: LOGO_CREAM, x: 10.5, y: 3.52, w: 1.7, h: 0.541 });
  s.addImage({ path: LOGO_CREAM, x: M, y: 0.62, w: 1.5, h: 0.478 });

  s.addText("CLIENT KICKOFF MEETING", {
    x: M, y: 2.42, w: 7.6, h: 0.3, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 11.5, bold: true, charSpacing: 3.4, color: GOLD,
  });
  s.addText("Role Breakdown", {
    x: M, y: 2.82, w: 7.8, h: 0.98, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 58, bold: true, color: CREAM,
  });
  s.addText("Who covers what, and in what order", {
    x: M, y: 3.82, w: 7.8, h: 0.5, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 23, italic: true, color: GOLD,
  });
  s.addText(
    "Three parts: the numbers, how we work together, and the paperwork that protects the practice.",
    { x: M, y: 4.45, w: 7.1, h: 0.6, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 14, color: MUTED, lineSpacingMultiple: 1.2 }
  );

  s.addText("PREPARED FOR", {
    x: M, y: 5.62, w: 3, h: 0.24, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 9, bold: true, charSpacing: 2.2, color: "6B6357",
  });
  s.addText("________________________", {
    x: M, y: 5.86, w: 3.6, h: 0.3, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 14, color: MUTED,
  });
  s.addText("DATE", {
    x: 4.7, y: 5.62, w: 3, h: 0.24, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 9, bold: true, charSpacing: 2.2, color: "6B6357",
  });
  s.addText("________________________", {
    x: 4.7, y: 5.86, w: 3.6, h: 0.3, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 14, color: MUTED,
  });

  s.addNotes(
    "Open warm and short. Frame the running order out loud: we start with the numbers and the guarantee, " +
    "then how we work together week to week, then the compliance paperwork. " +
    "Fill in the practice name and date before presenting."
  );
}

/* ==================================================================== */
/* 2 — AGENDA                                                           */
/* ==================================================================== */
{
  const s = light();
  head(s, "AGENDA", "Today's running order", GOLD, false);
  s.addText("Three parts, roughly 15 minutes each, questions welcome at any point.", {
    x: M, y: 1.72, w: 9.5, h: 0.32, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 13.5, color: MUTE,
  });

  const rows = [
    { n: "01", c: MONEY, t: "Money & Strategy",
      d: "Performance guarantee, ad spend, billing, and timeline",
      topics: "Guarantee  ·  Qualified leads  ·  Ramp-up  ·  Ad spend  ·  Troubleshooting" },
    { n: "02", c: OPS, t: "Relationship & Operations",
      d: "Reporting cadence, communication, and lead handling",
      topics: "Weekly reporting  ·  Points of contact  ·  Lead handoff  ·  Long-term fit" },
    { n: "03", c: LEGAL, t: "Compliance & Legal",
      d: "Insurance, HIPAA, BAA, and Terms of Service",
      topics: "Insurance & service area  ·  HIPAA & data handling  ·  Agreements" },
  ];

  let y = 2.22;
  rows.forEach((r) => {
    card(s, { x: M, y, w: W, h: 1.35, fill: PAPER, line: RULE });
    badge(s, { x: M + 0.36, y: y + 0.35, d: 0.65, n: r.n, fill: r.c, color: PAPER, fs: 14 });
    s.addText(r.t, {
      x: M + 1.2, y: y + 0.24, w: 6.2, h: 0.42, margin: 0, valign: "middle",
      fontFace: SERIF, fontSize: 21, bold: true, color: INK,
    });
    s.addText(r.d, {
      x: M + 1.2, y: y + 0.63, w: 7.1, h: 0.28, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 12.5, color: CHAR,
    });
    s.addText(r.topics, {
      x: M + 1.2, y: y + 0.9, w: 7.6, h: 0.26, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 10, charSpacing: 0.4, color: r.c,
    });
    s.addText("LED BY", {
      x: M + W - 3.05, y: y + 0.4, w: 2.5, h: 0.22, margin: 0, valign: "middle", align: "right",
      fontFace: SANS, fontSize: 8.5, bold: true, charSpacing: 2, color: "9A9080",
    });
    s.addText("______________", {
      x: M + W - 3.05, y: y + 0.63, w: 2.5, h: 0.3, margin: 0, valign: "middle", align: "right",
      fontFace: SANS, fontSize: 13, color: MUTE,
    });
    y += 1.52;
  });

  footer(s, false);
  s.addNotes(
    "Say the order out loud and why: money first because it is what they care about most, " +
    "operations second so they can picture the week-to-week, compliance last so it lands as reassurance " +
    "rather than a hurdle. Write the presenter names into the LED BY blanks before the meeting."
  );
}

/* ==================================================================== */
/* 3 — THE WHOLE AGREEMENT IN SIX NUMBERS  (KPI tiles)                  */
/* ==================================================================== */
{
  const s = light();
  head(s, "AT A GLANCE", "The whole agreement in six numbers", GOLD, false);
  s.addText("Everything in the next 45 minutes comes back to these. We will unpack each one in turn.", {
    x: M, y: 1.72, w: 10.4, h: 0.32, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 13.5, color: MUTE,
  });

  const kpis = [
    { v: "15", l: "Qualified leads guaranteed", d: "Across the first 90 days, in total", c: C1 },
    { v: "90", l: "Days to deliver them", d: "One window — no monthly checkpoint", c: C1 },
    { v: "5 min", l: "To first contact", d: "AI calls and texts every new lead", c: C2 },
    { v: "$1,500", l: "Monthly ad spend", d: "Paid by you, straight to the platform", c: C1 },
    { v: "$3,500", l: "Combined monthly total", d: "Ad spend plus the retainer", c: C1 },
    { v: "$0", l: "Startup fee", d: "Nothing to get started", c: C2 },
  ];
  const gap = 0.3;
  const cw = (W - gap * 2) / 3;
  const ch = 1.98;
  kpis.forEach((k, i) => {
    const x = M + (i % 3) * (cw + gap);
    const y = 2.3 + Math.floor(i / 3) * (ch + gap);
    card(s, { x, y, w: cw, h: ch, fill: INK, line: null });
    s.addText(k.v, {
      x: x + 0.34, y: y + 0.2, w: cw - 0.68, h: 0.78, margin: 0, valign: "middle",
      fontFace: SERIF, fontSize: 44, bold: true, color: k.c,
    });
    s.addText(k.l, {
      x: x + 0.34, y: y + 1.02, w: cw - 0.68, h: 0.34, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 14, bold: true, color: CREAM,
    });
    s.addText(k.d, {
      x: x + 0.34, y: y + 1.36, w: cw - 0.68, h: 0.42, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 11.5, color: MUTED, lineSpacingMultiple: 1.12,
    });
  });

  footer(s, false);
  s.addNotes(
    "Use this as a promise of what is coming — do not explain any single number in depth here, " +
    "just let them see the whole shape of the deal at once. If they interrupt with a question about one of them, " +
    "tell them which section covers it and keep moving."
  );
}

/* ==================================================================== */
/* DIVIDER helper                                                       */
/* ==================================================================== */
function divider(o) {
  const s = dark();
  // oversized medallion: the section numeral inside a ring, background-level
  s.addShape(pres.ShapeType.ellipse, {
    x: 9.15, y: 1.15, w: 3.7, h: 3.7,
    fill: { type: "none" }, line: { color: o.ghost, width: 1.5 },
  });
  s.addText(o.n, {
    x: 9.15, y: 1.15, w: 3.7, h: 3.7, margin: 0, align: "center", valign: "middle",
    fontFace: SERIF, fontSize: 128, bold: true, color: o.ghost,
  });

  s.addText(o.part, {
    x: M, y: 1.55, w: 7, h: 0.3, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 11, bold: true, charSpacing: 3.2, color: o.accentText,
  });
  badge(s, { x: M, y: 2.02, d: 0.78, n: o.n, fill: o.accent, color: CREAM, fs: 17 });
  s.addText(o.title, {
    x: M + 1.02, y: 2.02, w: 7.3, h: 0.78, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 34, bold: true, color: CREAM,
  });
  s.addText(o.sub, {
    x: M, y: 3.02, w: 8.4, h: 0.4, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 19, italic: true, color: o.accentText,
  });
  s.addText(o.lead, {
    x: M, y: 3.58, w: 7.8, h: 0.66, margin: 0, valign: "top",
    fontFace: SANS, fontSize: 13.5, color: MUTED, lineSpacingMultiple: 1.2,
  });

  const n = o.chips.length;
  const gap = 0.25;
  const cw = (W - gap * (n - 1)) / n;
  o.chips.forEach((c, i) => {
    const x = M + i * (cw + gap);
    card(s, { x, y: 5.05, w: cw, h: 0.95, fill: INKCARD, line: INKLINE });
    s.addText(String(i + 1).padStart(2, "0"), {
      x: x + 0.24, y: 5.2, w: 1, h: 0.22, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 9, bold: true, charSpacing: 1.6, color: o.accentText,
    });
    s.addText(c, {
      x: x + 0.24, y: 5.44, w: cw - 0.48, h: 0.44, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 12.5, bold: true, color: CREAM,
    });
  });

  footer(s, true);
  s.addNotes(o.notes);
  return s;
}

/* ==================================================================== */
/* 4 — DIVIDER: MONEY & STRATEGY  (was section 02, now first)           */
/* ==================================================================== */
divider({
  n: "01", part: "PART ONE OF THREE", accent: MONEY, accentText: "E08A5F", ghost: MONEY_GHOST,
  title: "Money & Strategy",
  sub: "Performance guarantee, ad spend, billing, and timeline",
  lead: "What the practice is committing, what Stay Booked is guaranteeing in return, and what the first six months realistically look like.",
  chips: ["Performance Guarantee", "Timeline & Ramp-Up", "Ad Spend & Billing", "Troubleshooting"],
  notes: "This is the section they are really here for, so lead with it while attention is highest. " +
         "Be direct about numbers and be honest about the ramp — credibility here buys patience later.",
});

/* ==================================================================== */
/* 5 — THE GUARANTEE                                                    */
/* ==================================================================== */
{
  const s = light();
  head(s, "PERFORMANCE GUARANTEE", "What we guarantee", MONEY, false);

  const stats = [
    { v: "15", l: "Qualified leads", d: "Guaranteed in total, not per month" },
    { v: "90", l: "Days to deliver", d: "One window, no monthly checkpoint" },
    { v: "0", l: "Ongoing quota", d: "No monthly guarantee after day 90" },
  ];
  const gap = 0.3;
  const cw = (W - gap * 2) / 3;
  stats.forEach((st, i) => {
    const x = M + i * (cw + gap);
    card(s, { x, y: 1.85, w: cw, h: 1.92, fill: PAPER, line: RULE });
    s.addText(st.v, {
      x: x + 0.3, y: 2.02, w: cw - 0.6, h: 0.86, margin: 0, valign: "middle",
      fontFace: SERIF, fontSize: 58, bold: true, color: MONEY,
    });
    s.addText(st.l, {
      x: x + 0.3, y: 2.92, w: cw - 0.6, h: 0.3, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 14, bold: true, color: INK,
    });
    s.addText(st.d, {
      x: x + 0.3, y: 3.2, w: cw - 0.6, h: 0.42, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 11.5, color: MUTE, lineSpacingMultiple: 1.1,
    });
  });

  card(s, { x: M, y: 4.05, w: 5.72, h: 2.35, fill: PAPER, line: RULE });
  badge(s, { x: M + 0.34, y: 4.36, d: 0.44, n: "!", fill: MONEY, color: PAPER, fs: 15 });
  s.addText("If we miss 15 by day 90", {
    x: M + 0.94, y: 4.36, w: 4.4, h: 0.44, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 19, bold: true, color: INK,
  });
  bullets(s, [
    "The retainer pauses until the fifteenth qualified lead is delivered.",
    "Ad spend already placed with Facebook or Google is not refundable — that money went to the platform, not to us.",
  ], { x: M + 0.34, y: 4.96, w: 5.04, h: 1.28, fs: 13 });

  card(s, { x: M + 6.11, y: 4.05, w: 5.72, h: 2.35, fill: INK, line: null });
  badge(s, { x: M + 6.45, y: 4.36, d: 0.44, n: "→", fill: "2E2A24", color: GOLD, fs: 14 });
  s.addText("After the first 90 days", {
    x: M + 7.05, y: 4.36, w: 4.4, h: 0.44, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 19, bold: true, color: CREAM,
  });
  bullets(s, [
    "Once the 15-lead threshold is met, the guarantee has been satisfied.",
    "There is no ongoing month-by-month guarantee after that — we keep the account on results, not on a quota.",
  ], { x: M + 6.45, y: 4.96, w: 5.04, h: 1.28, fs: 13, color: MUTED });

  footer(s, false);
  s.addNotes(
    "Walk through the structure precisely: 15 qualified leads guaranteed across the first 90 days only. " +
    "There is no month-by-month checkpoint — do not let them leave thinking it is 5 a month. " +
    "If 15 isn't hit by day 90, the retainer pauses until it is. Ad spend is not refundable. " +
    "After the first 90 days and once the 15-lead threshold is hit, there is no ongoing monthly guarantee."
  );
}

/* ==================================================================== */
/* 6 — WHAT COUNTS AS A QUALIFIED LEAD                                  */
/* ==================================================================== */
{
  const s = light();
  head(s, "DEFINITIONS", "What counts as a qualified lead", MONEY, false);

  card(s, { x: M, y: 1.85, w: 4.35, h: 4.55, fill: INK, line: null });
  s.addText("All five\nmust be true.", {
    x: M + 0.4, y: 2.18, w: 3.55, h: 1.3, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 33, bold: true, color: CREAM, lineSpacingMultiple: 0.95,
  });
  s.addText(
    "A form fill on its own is not a qualified lead. The count only moves when every one of these five is met — " +
    "that is the same standard we hold ourselves to when we report the number back to you.",
    { x: M + 0.4, y: 3.6, w: 3.55, h: 1.5, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 12.5, color: MUTED, lineSpacingMultiple: 1.22 }
  );
  s.addShape(pres.ShapeType.ellipse, {
    x: M + 0.4, y: 5.42, w: 0.3, h: 0.3, fill: { color: MONEY }, line: { type: "none" },
  });
  s.addText("Counted and reported weekly", {
    x: M + 0.84, y: 5.42, w: 3.2, h: 0.3, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 11.5, bold: true, color: GOLD,
  });

  const crit = [
    ["Inside the service area", "The practice can actually see them."],
    ["Matches accepted insurance, or private pay", "No leads we already know you cannot bill."],
    ["Full form completed with real contact info", "A working name and phone number, not junk."],
    ["Actively seeking care", "Looking for help now, not browsing."],
    ["Responded to at least one AI follow-up", "They replied to a call or a text — a real human on the other end."],
  ];
  let y = 1.85;
  const rh = 0.83;
  crit.forEach((c, i) => {
    badge(s, { x: M + 4.72, y: y + 0.11, d: 0.44, n: String(i + 1), fill: CREAM, line: MONEY, color: MONEY, fs: 13 });
    s.addText(c[0], {
      x: M + 5.34, y: y + 0.05, w: 6.5, h: 0.33, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 14.5, bold: true, color: INK,
    });
    s.addText(c[1], {
      x: M + 5.34, y: y + 0.36, w: 6.5, h: 0.3, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 12, color: MUTE,
    });
    if (i < crit.length - 1) {
      s.addShape(pres.ShapeType.line, {
        x: M + 4.72, y: y + rh - 0.055, w: 7.11, h: 0, line: { color: RULE, width: 0.75 },
      });
    }
    y += rh;
  });

  footer(s, false);
  s.addNotes(
    "Read all five out loud and pause. This is the single most common place expectations break down later. " +
    "In the service area, matches accepted insurance or private pay, full form completed with real contact info, " +
    "actively seeking care, and has responded to at least one AI follow-up call or text. " +
    "Invite them to push back now if any of the five sounds wrong for their practice."
  );
}

/* ==================================================================== */
/* 7 — PROTECTING THE GUARANTEE                                         */
/* ==================================================================== */
{
  const s = light();
  head(s, "SHARED RESPONSIBILITY", "What protects the guarantee", MONEY, false);
  s.addText("The guarantee assumes the campaign is allowed to run. Three things on the practice's side keep it intact.", {
    x: M, y: 1.72, w: 10.4, h: 0.32, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 13.5, color: MUTE,
  });

  const items = [
    { n: "01", t: "Fast approvals", d: "Ads, copy, and creative come to you for sign-off. Every day a batch sits waiting is a day the campaign is not learning." },
    { n: "02", t: "No pausing campaigns", d: "Pausing resets the platform's learning and throws away data we already paid for. Talk to us before switching anything off." },
    { n: "03", t: "Timely follow-up", d: "Our AI makes first contact, but your staff closes the loop. Leads that sit unworked stop being leads." },
  ];
  const gap = 0.3;
  const cw = (W - gap * 2) / 3;
  items.forEach((it, i) => {
    const x = M + i * (cw + gap);
    card(s, { x, y: 2.28, w: cw, h: 2.72, fill: PAPER, line: RULE });
    badge(s, { x: x + 0.32, y: 2.58, d: 0.56, n: it.n, fill: MONEY, color: PAPER, fs: 12.5 });
    s.addText(it.t, {
      x: x + 0.32, y: 3.26, w: cw - 0.64, h: 0.62, margin: 0, valign: "middle",
      fontFace: SERIF, fontSize: 18, bold: true, color: INK, lineSpacingMultiple: 0.98,
    });
    s.addText(it.d, {
      x: x + 0.32, y: 3.94, w: cw - 0.64, h: 0.94, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 12, color: CHAR, lineSpacingMultiple: 1.16,
    });
  });

  card(s, { x: M, y: 5.24, w: W, h: 1.16, fill: INK, line: null });
  s.addText("BE CLEAR ABOUT THIS", {
    x: M + 0.42, y: 5.46, w: 3, h: 0.24, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 9, bold: true, charSpacing: 2.2, color: "E08A5F",
  });
  s.addText("The guarantee covers lead delivery — not conversion into booked patients.", {
    x: M + 0.42, y: 5.72, w: 10.9, h: 0.42, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 21, bold: true, color: CREAM,
  });

  footer(s, false);
  s.addNotes(
    "Cover the client responsibilities that protect the guarantee: fast approvals, no pausing campaigns, timely follow-up. " +
    "Then say the last line plainly and do not soften it — the guarantee covers lead delivery, not conversion into booked patients. " +
    "Saying it now is what makes it survivable in month two."
  );
}

/* ==================================================================== */
/* 8 — TIMELINE & RAMP-UP  (chart)                                      */
/* ==================================================================== */
{
  const s = light();
  head(s, "TIMELINE & RAMP-UP", "What the first six months look like", MONEY, false);
  s.addText("Early months are testing and calibration. That is the process working, not the process failing.", {
    x: M, y: 1.72, w: 10.4, h: 0.32, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 13.5, color: MUTE,
  });

  card(s, { x: M, y: 2.24, w: 7.15, h: 3.34, fill: PAPER, line: RULE });
  s.addText("Relative lead volume by month", {
    x: M + 0.34, y: 2.42, w: 6.5, h: 0.3, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 13, bold: true, color: INK,
  });
  s.addChart(
    pres.ChartType.bar,
    [
      { name: "Testing & calibration", labels: ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"],
        values: [1.0, 1.5, 0, 0, 0, 0] },
      { name: "Scaling what works", labels: ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"],
        values: [0, 0, 2.6, 3.8, 4.9, 5.8] },
    ],
    chartBase({
      x: M + 0.22, y: 2.72, w: 6.72, h: 2.7,
      barDir: "col", barGrouping: "stacked", barGapWidthPct: 90,
      chartColors: [C1, C2],
      valAxisHidden: true,
      showValue: false,
      showLegend: true, legendPos: "b",
    })
  );

  card(s, { x: M + 7.54, y: 2.24, w: 4.29, h: 3.34, fill: INK, line: null });
  s.addText("READ IT LIKE THIS", {
    x: M + 7.88, y: 2.48, w: 3.6, h: 0.26, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 2.2, color: "E08A5F",
  });
  const phases = [
    ["Weeks 1–4", "Campaigns go live. Audiences, offers, and creatives run against each other."],
    ["Month 2", "AI analytics and pixel data show which combination works here."],
    ["Months 3–6", "We make more of what is winning. The bigger numbers show up here."],
  ];
  let py = 2.84;
  phases.forEach((p, i) => {
    s.addShape(pres.ShapeType.ellipse, {
      x: M + 7.88, y: py + 0.05, w: 0.26, h: 0.26,
      fill: { color: i === 2 ? C2 : C1 }, line: { type: "none" },
    });
    s.addText(p[0], {
      x: M + 8.3, y: py, w: 3.1, h: 0.3, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 13.5, bold: true, color: CREAM,
    });
    s.addText(p[1], {
      x: M + 8.3, y: py + 0.31, w: 3.15, h: 0.54, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 11.5, color: MUTED, lineSpacingMultiple: 1.14,
    });
    py += 0.9;
  });

  card(s, { x: M, y: 5.72, w: W, h: 0.68, fill: "F5EFE0", line: "D9C79A" });
  s.addText(
    "Illustrative shape only — not a forecast of your numbers. Don't be discouraged if month one or two look slow; that is the normal pattern, not a red flag.",
    { x: M + 0.42, y: 5.72, w: W - 0.84, h: 0.68, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 12.5, italic: true, color: "5C4712" }
  );

  footer(s, false);
  s.addNotes(
    "Say out loud that the chart is the shape, not a promise of specific numbers. " +
    "It is genuine trial and error at the start — it can take a few weeks or even a couple of months to find the winning " +
    "combination for that specific area. Once the right formula is found using AI analytics, pixel data, and testing, " +
    "we make more of what works and results usually take off. Months three through six is typically where the bigger numbers show up."
  );
}

/* ==================================================================== */
/* 9 — BUILT FOR THIS PRACTICE  (dark)                                  */
/* ==================================================================== */
{
  const s = dark();
  head(s, "OUR APPROACH", "Built for your practice, not recycled", "E08A5F", true);

  card(s, { x: M, y: 1.9, w: 5.72, h: 2.42, fill: INKCARD, line: INKLINE });
  s.addText("WHAT WE DON'T DO", {
    x: M + 0.4, y: 2.18, w: 4.9, h: 0.26, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 2.2, color: "7E7568",
  });
  s.addText("Reuse a past client's campaign", {
    x: M + 0.4, y: 2.46, w: 4.92, h: 0.74, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 21, bold: true, color: "8E8578", lineSpacingMultiple: 0.98,
  });
  s.addText(
    "Just because something worked for another practice does not mean it gets dropped into yours as-is. " +
    "A different city and a different patient mix make it a different problem.",
    { x: M + 0.4, y: 3.26, w: 4.92, h: 0.92, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 12, color: "8E8578", lineSpacingMultiple: 1.16 }
  );

  card(s, { x: M + 6.11, y: 1.9, w: 5.72, h: 2.42, fill: INKCARD, line: MONEY });
  s.addText("WHAT WE DO", {
    x: M + 6.51, y: 2.18, w: 4.9, h: 0.26, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 2.2, color: "E08A5F",
  });
  s.addText("Treat your account as its own project", {
    x: M + 6.51, y: 2.46, w: 4.92, h: 0.74, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 21, bold: true, color: CREAM, lineSpacingMultiple: 0.98,
  });
  s.addText(
    "Every campaign is built and tested specifically for your area and your audience, from the first ad forward, " +
    "so you get the best possible product for this practice.",
    { x: M + 6.51, y: 3.26, w: 4.92, h: 0.92, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 12, color: MUTED, lineSpacingMultiple: 1.16 }
  );

  s.addText("WHAT WE TEST WITH", {
    x: M, y: 4.62, w: 5, h: 0.26, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 2.2, color: "E08A5F",
  });
  const tools = [
    ["AI analytics", "Pattern-finding across every lead and every ad, faster than a human can eyeball it."],
    ["Pixel data", "Real behaviour from your own traffic, feeding the platforms better targeting signals."],
    ["Structured testing", "Deliberate head-to-head tests, so we know why something won."],
  ];
  const gap = 0.3;
  const cw = (W - gap * 2) / 3;
  tools.forEach((t, i) => {
    const x = M + i * (cw + gap);
    card(s, { x, y: 4.95, w: cw, h: 1.45, fill: INKCARD, line: INKLINE });
    s.addShape(pres.ShapeType.ellipse, {
      x: x + 0.32, y: 5.2, w: 0.32, h: 0.32, fill: { color: MONEY }, line: { type: "none" },
    });
    s.addText(t[0], {
      x: x + 0.76, y: 5.2, w: cw - 1.08, h: 0.32, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 14, bold: true, color: CREAM,
    });
    s.addText(t[1], {
      x: x + 0.32, y: 5.6, w: cw - 0.64, h: 0.68, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 11.5, color: MUTED, lineSpacingMultiple: 1.14,
    });
  });

  footer(s, true);
  s.addNotes(
    "Emphasize that campaigns are custom-built and tested per practice, not copy-pasted. " +
    "Just because something worked for a past client doesn't mean it gets reused as-is. " +
    "Every client's campaign is treated as its own project, built and tested specifically for their area and their audience."
  );
}

/* ==================================================================== */
/* 10 — WHAT IT COSTS  (chart)                                          */
/* ==================================================================== */
{
  const s = light();
  head(s, "AD SPEND & BILLING", "What it costs each month", MONEY, false);

  const stats = [
    { v: "$1,500", l: "Ad spend", d: "Paid by you, directly to the platform", accent: false },
    { v: "$3,500", l: "Combined monthly total", d: "Ad spend plus the retainer", accent: true },
    { v: "$0", l: "Startup fee", d: "No onboarding charge to begin", accent: false },
  ];
  const gap = 0.3;
  const cw = (W - gap * 2) / 3;
  stats.forEach((st, i) => {
    const x = M + i * (cw + gap);
    card(s, { x, y: 1.85, w: cw, h: 1.86, fill: st.accent ? INK : PAPER, line: st.accent ? null : RULE });
    s.addText(st.v, {
      x: x + 0.3, y: 2.0, w: cw - 0.6, h: 0.78, margin: 0, valign: "middle",
      fontFace: SERIF, fontSize: 44, bold: true, color: st.accent ? GOLD : MONEY,
    });
    s.addText(st.l, {
      x: x + 0.3, y: 2.8, w: cw - 0.6, h: 0.3, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 14, bold: true, color: st.accent ? CREAM : INK,
    });
    s.addText(st.d, {
      x: x + 0.3, y: 3.1, w: cw - 0.6, h: 0.44, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 11.5, color: st.accent ? MUTED : MUTE, lineSpacingMultiple: 1.1,
    });
  });

  card(s, { x: M, y: 3.98, w: W, h: 2.42, fill: PAPER, line: RULE });
  s.addText("Where the $3,500 goes each month", {
    x: M + 0.36, y: 4.2, w: 7, h: 0.3, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 13, bold: true, color: INK,
  });
  // proportional stacked bar, drawn to exact width so the $ labels never wrap
  {
    const bx = M + 0.4, bw = W - 0.8, bh = 0.86, by = 4.62, seam = 0.03;
    const w1 = (bw - seam) * (1500 / 3500);
    const w2 = (bw - seam) - w1;
    const segs = [
      { x: bx, w: w1, fill: C1, v: "$1,500", vc: "FFFFFF",
        cap: "43%  ·  Ad spend — the platform bills your card directly" },
      { x: bx + w1 + seam, w: w2, fill: INK, v: "$2,000", vc: GOLD,
        cap: "57%  ·  Retainer — invoiced by Stay Booked" },
    ];
    segs.forEach((g) => {
      s.addShape(pres.ShapeType.rect, {
        x: g.x, y: by, w: g.w, h: bh, fill: { color: g.fill }, line: { type: "none" },
      });
      s.addText(g.v, {
        x: g.x, y: by, w: g.w, h: bh, margin: 0, align: "center", valign: "middle",
        fontFace: SERIF, fontSize: 22, bold: true, color: g.vc,
      });
      s.addText(g.cap, {
        x: g.x, y: by + bh + 0.16, w: g.w, h: 0.34, margin: 0, align: "center", valign: "middle",
        fontFace: SANS, fontSize: 11.5, color: CHAR,
      });
    });
  }

  footer(s, false);
  s.addNotes(
    "Lead with $1,500 a month as the real ad spend baseline — that is the number to anchor on. $2,000+ is the ideal tier and worth " +
    "mentioning as where results accelerate. $1,000 exists only as a last-resort minimum if the client truly needs it; " +
    "do not raise it and do not dwell on anything below $1,500. " +
    "Point at the bar: the left block never touches Stay Booked — the client connects their own card to Facebook or Google and is " +
    "billed by the platform directly. Emphasize the no startup fee."
  );
}

/* ==================================================================== */
/* 11 — THE 90-DAY MATH  (chart)                                        */
/* ==================================================================== */
{
  const s = light();
  head(s, "THE 90-DAY MATH", "What the guarantee is worth", MONEY, false);
  s.addText("The guarantee puts a ceiling on what a qualified lead can cost you in the first 90 days.", {
    x: M, y: 1.72, w: 10.4, h: 0.32, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 13.5, color: MUTE,
  });

  card(s, { x: M, y: 2.24, w: 7.15, h: 4.16, fill: PAPER, line: RULE });
  s.addText("Cumulative investment across the guarantee window", {
    x: M + 0.34, y: 2.44, w: 6.5, h: 0.3, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 13, bold: true, color: INK,
  });
  s.addChart(
    pres.ChartType.bar,
    [{ name: "Cumulative investment", labels: ["After month 1", "After month 2", "After month 3"],
       values: [3500, 7000, 10500] }],
    chartBase({
      x: M + 0.22, y: 2.78, w: 6.72, h: 3.3,
      barDir: "col", barGapWidthPct: 130,
      chartColors: [C1],
      valAxisHidden: true,
      showValue: true, dataLabelPosition: "outEnd",
      dataLabelFormatCode: '"$"#,##0', dataLabelColor: CHAR,
      dataLabelFontSize: 13, dataLabelFontBold: true,
      showLegend: false,
    })
  );

  card(s, { x: M + 7.54, y: 2.24, w: 4.29, h: 2.36, fill: INK, line: null });
  s.addText("CEILING PER QUALIFIED LEAD", {
    x: M + 7.88, y: 2.5, w: 3.7, h: 0.26, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 2, color: "E08A5F",
  });
  s.addText("$700", {
    x: M + 7.88, y: 2.8, w: 3.7, h: 0.86, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 52, bold: true, color: GOLD,
  });
  s.addText("$10,500 over 90 days ÷ 15 guaranteed leads. Deliver more than 15 and the real number drops from there.", {
    x: M + 7.88, y: 3.7, w: 3.62, h: 0.72, margin: 0, valign: "top",
    fontFace: SANS, fontSize: 11.5, color: MUTED, lineSpacingMultiple: 1.16,
  });

  card(s, { x: M + 7.54, y: 4.78, w: 4.29, h: 1.62, fill: PAPER, line: RULE });
  s.addText("Confirm today", {
    x: M + 7.88, y: 4.98, w: 3.7, h: 0.32, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 18, bold: true, color: INK,
  });
  bullets(s, [
    "Billing start date",
    "How you want to be invoiced",
    "When campaigns go live",
  ], { x: M + 7.88, y: 5.36, w: 3.62, h: 0.86, fs: 12, gap: 3 });

  footer(s, false);
  s.addNotes(
    "This is the slide that makes the guarantee feel concrete. Three months at $3,500 is $10,500 all in, " +
    "and the guarantee is 15 qualified leads, so $700 is the most a guaranteed lead can cost — and only if we deliver exactly 15. " +
    "Be careful not to promise a cost per booked patient; this is cost per qualified lead as defined earlier. " +
    "Close the slide by locking the billing start date, the invoicing method, and the go-live timeline."
  );
}

/* ==================================================================== */
/* 12 — TROUBLESHOOTING                                                 */
/* ==================================================================== */
{
  const s = light();
  head(s, "TROUBLESHOOTING", "If leads underperform", MONEY, false);
  s.addText("There is an active process behind this, and it starts immediately. Nobody is waiting and hoping.", {
    x: M, y: 1.72, w: 10, h: 0.32, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 13.5, color: MUTE,
  });

  const moves = [
    { n: "01", t: "Adjust targeting", d: "Tighten or widen the radius, shift age and interest sets, and re-weight toward the segments actually converting." },
    { n: "02", t: "Swap creative", d: "New images, new hooks, new angles. Creative fatigue is the most common reason a campaign goes quiet." },
    { n: "03", t: "Test new offers", d: "Change what the ad actually asks for — a consult, a callback, an availability check — until one clears." },
  ];
  const gap = 0.3;
  const cw = (W - gap * 2) / 3;
  moves.forEach((m, i) => {
    const x = M + i * (cw + gap);
    card(s, { x, y: 2.3, w: cw, h: 2.6, fill: PAPER, line: RULE });
    badge(s, { x: x + 0.32, y: 2.62, d: 0.56, n: m.n, fill: MONEY, color: PAPER, fs: 12.5 });
    s.addText(m.t, {
      x: x + 0.32, y: 3.34, w: cw - 0.64, h: 0.38, margin: 0, valign: "middle",
      fontFace: SERIF, fontSize: 20, bold: true, color: INK,
    });
    s.addText(m.d, {
      x: x + 0.32, y: 3.78, w: cw - 0.64, h: 1.0, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 12.5, color: CHAR, lineSpacingMultiple: 1.18,
    });
  });

  card(s, { x: M, y: 5.18, w: W, h: 1.22, fill: INK, line: null });
  s.addText("You will hear about it from us first — underperformance shows up in the weekly meeting, with the fix already proposed.", {
    x: M + 0.42, y: 5.18, w: W - 0.84, h: 1.22, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 18, italic: true, color: GOLD,
  });

  footer(s, false);
  s.addNotes(
    "Explain the plan if leads underperform: adjust targeting, swap creative, test new offers. " +
    "The point of this slide is reassurance — there is an active process, not just waiting and hoping. " +
    "Tie it forward to the weekly meeting, which is the next section."
  );
}

/* ==================================================================== */
/* 13 — DIVIDER: RELATIONSHIP & OPERATIONS  (was 03, now second)        */
/* ==================================================================== */
divider({
  n: "02", part: "PART TWO OF THREE", accent: OPS, accentText: "5FA8A0", ghost: OPS_GHOST,
  title: "Relationship & Operations",
  sub: "Reporting cadence, communication, and lead handling",
  lead: "How the two teams actually work together week to week — who talks to whom, how fast leads move, and what happens after a lead lands.",
  chips: ["Reporting & Communication", "Lead Handling", "Relationship Building"],
  notes: "Shift tone here — the first section was numbers, this one is the working relationship. " +
         "Ask more than you tell: much of this section is questions for the practice about their intake process.",
});

/* ==================================================================== */
/* 14 — REPORTING & COMMUNICATION                                       */
/* ==================================================================== */
{
  const s = light();
  head(s, "REPORTING & COMMUNICATION", "How we stay in sync", OPS, false);

  card(s, { x: M, y: 1.9, w: 6.4, h: 4.5, fill: INK, line: null });
  badge(s, { x: M + 0.42, y: 2.22, d: 0.56, n: "01", fill: OPS, color: CREAM, fs: 12.5 });
  s.addText("A weekly meeting", {
    x: M + 1.14, y: 2.22, w: 4.9, h: 0.56, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 26, bold: true, color: CREAM,
  });
  s.addText("Stay Booked presents live analytics — screen shared, real numbers, not a recap of last month's news.", {
    x: M + 0.42, y: 2.94, w: 5.56, h: 0.62, margin: 0, valign: "top",
    fontFace: SANS, fontSize: 13, color: MUTED, lineSpacingMultiple: 1.18,
  });
  const agenda = [
    ["What's working", "The ads, audiences, and offers producing qualified leads right now."],
    ["What isn't", "Named plainly, with the numbers behind it."],
    ["What's being adjusted", "The specific changes going in this week, and why."],
  ];
  let ay = 3.7;
  agenda.forEach((a) => {
    s.addShape(pres.ShapeType.ellipse, {
      x: M + 0.42, y: ay + 0.09, w: 0.28, h: 0.28, fill: { color: C2 }, line: { type: "none" },
    });
    s.addText(a[0], {
      x: M + 0.88, y: ay, w: 5.1, h: 0.32, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 14, bold: true, color: CREAM,
    });
    s.addText(a[1], {
      x: M + 0.88, y: ay + 0.32, w: 5.1, h: 0.44, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 12, color: MUTED, lineSpacingMultiple: 1.14,
    });
    ay += 0.86;
  });

  card(s, { x: M + 6.79, y: 1.9, w: 5.04, h: 2.14, fill: PAPER, line: RULE });
  badge(s, { x: M + 7.13, y: 2.2, d: 0.5, n: "02", fill: OPS, color: PAPER, fs: 12 });
  s.addText("Between meetings", {
    x: M + 7.77, y: 2.2, w: 3.7, h: 0.5, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 20, bold: true, color: INK,
  });
  s.addText(
    "Your choice of channel — text is what we recommend, and it gets answered fastest.",
    { x: M + 7.13, y: 2.8, w: 4.36, h: 0.6, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 12.5, color: CHAR, lineSpacingMultiple: 1.18 }
  );
  s.addText("Confirm today:  text, email, or phone?", {
    x: M + 7.13, y: 3.52, w: 4.36, h: 0.3, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 12, bold: true, color: OPS,
  });

  card(s, { x: M + 6.79, y: 4.26, w: 5.04, h: 2.14, fill: PAPER, line: RULE });
  badge(s, { x: M + 7.13, y: 4.56, d: 0.5, n: "03", fill: OPS, color: PAPER, fs: 12 });
  s.addText("One point of contact", {
    x: M + 7.77, y: 4.56, w: 3.7, h: 0.5, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 20, bold: true, color: INK,
  });
  s.addText("Jordan Vo and Jordan Niles are your contacts on the Stay Booked side.", {
    x: M + 7.13, y: 5.18, w: 4.36, h: 0.5, margin: 0, valign: "top",
    fontFace: SANS, fontSize: 12.5, color: CHAR, lineSpacingMultiple: 1.18,
  });
  s.addText("Confirm today:  who is ours on your side?", {
    x: M + 7.13, y: 5.78, w: 4.36, h: 0.3, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 12, bold: true, color: OPS,
  });

  footer(s, false);
  s.addNotes(
    "Propose the weekly meeting and get a day and time on the calendar before leaving this slide. " +
    "Confirm the communication channel for questions between meetings — client's choice, but recommend text as the default. " +
    "Assign a single point of contact on both sides: Jordan Vo and Jordan Niles are the points of contact on our end. " +
    "Get a name from them."
  );
}

/* ==================================================================== */
/* 15 — LEAD HANDLING  (dark)                                           */
/* ==================================================================== */
{
  const s = dark();
  head(s, "LEAD HANDLING", "The moment a lead comes in", "5FA8A0", true);

  const flow = [
    { k: "STEP 1", t: "Lead submits the form", d: "Name and phone number, with permission on record." },
    { k: "WITHIN 5 MINUTES", t: "AI calls and texts", d: "Automatic first contact while intent is still hot.", hot: true },
    { k: "STEP 3", t: "Your staff takes over", d: "A human picks up the relationship and books the patient." },
  ];
  const gap = 0.32;
  const cw = (W - gap * 2) / 3;
  flow.forEach((f, i) => {
    const x = M + i * (cw + gap);
    card(s, { x, y: 1.9, w: cw, h: 2.42, fill: INKCARD, line: f.hot ? OPS : INKLINE });
    s.addText(f.k, {
      x: x + 0.32, y: 2.14, w: cw - 0.64, h: 0.26, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 2, color: f.hot ? "5FA8A0" : "7E7568",
    });
    s.addText(f.t, {
      x: x + 0.32, y: 2.46, w: cw - 0.64, h: 0.8, margin: 0, valign: "middle",
      fontFace: SERIF, fontSize: 23, bold: true, color: CREAM, lineSpacingMultiple: 0.98,
    });
    s.addText(f.d, {
      x: x + 0.32, y: 3.32, w: cw - 0.64, h: 0.72, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 12.5, color: MUTED, lineSpacingMultiple: 1.18,
    });
    if (i < 2) {
      s.addText("→", {
        x: x + cw + 0.02, y: 2.95, w: gap - 0.04, h: 0.36, margin: 0, align: "center", valign: "middle",
        fontFace: SANS, fontSize: 17, bold: true, color: "5C554A",
      });
    }
  });

  s.addText("THREE THINGS WE NEED FROM YOU TODAY", {
    x: M, y: 4.6, w: 6, h: 0.26, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 2.2, color: "5FA8A0",
  });
  const qs = [
    "What does your booking and intake process look like today?",
    "How fast can your staff realistically follow up on a new lead?",
    "How do you want leads delivered — to staff, a shared inbox, or your booking system?",
  ];
  const qw = (W - gap * 2) / 3;
  qs.forEach((q, i) => {
    const x = M + i * (qw + gap);
    card(s, { x, y: 4.93, w: qw, h: 1.47, fill: INKCARD, line: INKLINE });
    badge(s, { x: x + 0.3, y: 5.12, d: 0.4, n: "?", fill: OPS, color: CREAM, fs: 12.5 });
    s.addText(q, {
      x: x + 0.3, y: 5.6, w: qw - 0.6, h: 0.72, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 12, bold: true, color: CREAM, lineSpacingMultiple: 1.14,
    });
  });

  footer(s, true);
  s.addNotes(
    "Explain the handoff: leads get an automatic AI call and text follow-up within 5 minutes of coming in, " +
    "then the client's staff picks up the relationship from there. " +
    "Then stop talking and ask the three questions — their current booking or intake process, how fast staff can follow up, " +
    "and how they want leads delivered. Write the answers down; they change how we configure delivery."
  );
}

/* ==================================================================== */
/* 16 — RELATIONSHIP BUILDING                                           */
/* ==================================================================== */
{
  const s = light();
  head(s, "RELATIONSHIP BUILDING", "Two things we'd like to ask", OPS, false);

  card(s, { x: M, y: 2.0, w: 5.72, h: 3.1, fill: PAPER, line: RULE });
  badge(s, { x: M + 0.42, y: 2.36, d: 0.6, n: "01", fill: OPS, color: PAPER, fs: 13 });
  s.addText("Would you share results publicly?", {
    x: M + 0.42, y: 3.14, w: 4.9, h: 0.76, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 24, bold: true, color: INK, lineSpacingMultiple: 0.98,
  });
  s.addText(
    "No commitment today — we would just like to know whether a testimonial or a written case study is on the table " +
    "once the numbers are worth talking about.",
    { x: M + 0.42, y: 4.0, w: 4.92, h: 0.92, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 13, color: CHAR, lineSpacingMultiple: 1.2 }
  );

  card(s, { x: M + 6.11, y: 2.0, w: 5.72, h: 3.1, fill: INK, line: null });
  badge(s, { x: M + 6.53, y: 2.36, d: 0.6, n: "02", fill: OPS, color: CREAM, fs: 13 });
  s.addText("What went wrong last time?", {
    x: M + 6.53, y: 3.14, w: 4.9, h: 0.76, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 24, bold: true, color: CREAM, lineSpacingMultiple: 0.98,
  });
  s.addText(
    "If you have worked with another agency before, tell us what frustrated you. " +
    "We would rather hear it now than repeat someone else's mistake on your account.",
    { x: M + 6.53, y: 4.0, w: 4.92, h: 0.92, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 13, color: MUTED, lineSpacingMultiple: 1.2 }
  );

  card(s, { x: M, y: 5.34, w: W, h: 1.06, fill: "E4EEEC", line: "9CC2BD" });
  s.addText("We would rather be the last marketing agency you hire than the next one.", {
    x: M + 0.42, y: 5.34, w: W - 0.84, h: 1.06, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 19, italic: true, color: "0C4045",
  });

  footer(s, false);
  s.addNotes(
    "Gauge interest in a testimonial or case study once results come in — ask, don't push. " +
    "Then ask about past bad experiences with other agencies so those mistakes aren't repeated. " +
    "This second question usually produces the most useful information in the whole meeting. Let them talk."
  );
}

/* ==================================================================== */
/* 17 — DIVIDER: COMPLIANCE & LEGAL  (was 01, now last)                 */
/* ==================================================================== */
divider({
  n: "03", part: "PART THREE OF THREE", accent: LEGAL, accentText: "C9A94E", ghost: LEGAL_GHOST,
  title: "Compliance & Legal",
  sub: "Insurance, HIPAA, BAA, and Terms of Service",
  lead: "The guardrails. This is a psychiatric practice, so the standard is higher than the legal minimum — here is exactly how patient information is handled.",
  chips: ["Insurance & Eligibility", "HIPAA & Data Handling", "Agreements"],
  notes: "Deliberately last. By now they trust the numbers and the process, so this section lands as reassurance " +
         "rather than a hurdle. Slow down and be precise — this is a psychiatric practice and the bar is higher.",
});

/* ==================================================================== */
/* 18 — INSURANCE & ELIGIBILITY                                         */
/* ==================================================================== */
{
  const s = light();
  head(s, "INSURANCE & ELIGIBILITY", "Before we target anyone", LEGAL, false);
  s.addText("These two answers decide who the ads reach — and they define what counts toward the guarantee.", {
    x: M, y: 1.72, w: 10.4, h: 0.32, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 13.5, color: MUTE,
  });

  const inputs = [
    { n: "01", t: "Accepted insurance", d: "Which carriers and plans the practice bills, and whether private pay is welcome." },
    { n: "02", t: "Service area", d: "The geography you can genuinely serve — in person, by telehealth, or both." },
  ];
  inputs.forEach((it, i) => {
    const y = 2.3 + i * 1.6;
    card(s, { x: M, y, w: 5.15, h: 1.45, fill: PAPER, line: RULE });
    badge(s, { x: M + 0.32, y: y + 0.3, d: 0.5, n: it.n, fill: LEGAL, color: PAPER, fs: 12 });
    s.addText(it.t, {
      x: M + 0.96, y: y + 0.3, w: 3.9, h: 0.5, margin: 0, valign: "middle",
      fontFace: SERIF, fontSize: 20, bold: true, color: INK,
    });
    s.addText(it.d, {
      x: M + 0.32, y: y + 0.9, w: 4.51, h: 0.5, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 12.5, color: CHAR, lineSpacingMultiple: 1.15,
    });
  });

  s.addText("→", {
    x: M + 5.3, y: 3.5, w: 0.7, h: 0.5, margin: 0, align: "center", valign: "middle",
    fontFace: SANS, fontSize: 26, bold: true, color: RULE,
  });

  card(s, { x: M + 6.1, y: 2.3, w: 5.73, h: 2.94, fill: INK, line: null });
  s.addText("FEEDS DIRECTLY INTO", {
    x: M + 6.5, y: 2.58, w: 4.9, h: 0.26, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 2.2, color: "C9A94E",
  });
  s.addText("What counts as a qualifying lead", {
    x: M + 6.5, y: 2.9, w: 4.93, h: 0.86, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 26, bold: true, color: CREAM, lineSpacingMultiple: 0.98,
  });
  s.addText(
    "If someone is outside the service area, or carries insurance the practice does not accept and will not pay privately, " +
    "they do not count toward the 15 — and we do not send them to your staff. Getting these two answers exactly right " +
    "is what keeps the lead count honest.",
    { x: M + 6.5, y: 3.86, w: 4.93, h: 1.2, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 12.5, color: MUTED, lineSpacingMultiple: 1.2 }
  );

  card(s, { x: M, y: 5.42, w: W, h: 0.98, fill: PAPER, line: RULE });
  s.addText("Action today:  confirm the carrier list and the exact service-area boundary in writing before campaigns are built.", {
    x: M + 0.42, y: 5.42, w: W - 0.84, h: 0.98, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 13.5, bold: true, color: INK,
  });

  footer(s, false);
  s.addNotes(
    "Walk through what insurance the practice accepts and their service area. " +
    "Then explain how both feed into what counts as a qualifying lead — link it back to the five criteria from part one. " +
    "Get the carrier list and the service-area boundary confirmed in writing; do not build campaigns off a verbal answer."
  );
}

/* ==================================================================== */
/* 19 — HIPAA & DATA HANDLING                                           */
/* ==================================================================== */
{
  const s = light();
  head(s, "HIPAA & DATA HANDLING", "How patient data is protected", LEGAL, false);

  card(s, { x: M, y: 1.85, w: 5.72, h: 4.55, fill: PAPER, line: RULE });
  s.addText("ON THE LEAD FORM", {
    x: M + 0.4, y: 2.12, w: 4.9, h: 0.26, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 2.2, color: LEGAL,
  });
  s.addText("Only what is needed to make contact", {
    x: M + 0.4, y: 2.44, w: 4.92, h: 0.72, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 22, bold: true, color: INK, lineSpacingMultiple: 0.98,
  });

  const yes = [
    ["Name and phone number", "The minimum needed to follow up."],
    ["A link to the Privacy Policy", "On every single form, always visible."],
    ["A permission checkbox", "Explicit consent for calls and texts, including AI contact."],
  ];
  let hy = 3.3;
  yes.forEach((v) => {
    s.addShape(pres.ShapeType.ellipse, {
      x: M + 0.4, y: hy + 0.05, w: 0.3, h: 0.3, fill: { color: OPS }, line: { type: "none" },
    });
    s.addText("✓", {
      x: M + 0.4, y: hy + 0.05, w: 0.3, h: 0.3, margin: 0, align: "center", valign: "middle",
      fontFace: SANS, fontSize: 11, bold: true, color: PAPER,
    });
    s.addText(v[0], {
      x: M + 0.86, y: hy, w: 4.4, h: 0.32, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 13.5, bold: true, color: INK,
    });
    s.addText(v[1], {
      x: M + 0.86, y: hy + 0.32, w: 4.4, h: 0.44, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 11.5, color: MUTE, lineSpacingMultiple: 1.14,
    });
    hy += 0.82;
  });

  card(s, { x: M + 0.4, y: 5.78, w: 4.92, h: 0.42, fill: "F5E7E0", line: "E2BFAE", r: 0.06 });
  s.addText("Never asked: symptoms, diagnoses, or treatments.", {
    x: M + 0.4, y: 5.78, w: 4.92, h: 0.42, margin: 0, align: "center", valign: "middle",
    fontFace: SANS, fontSize: 12, bold: true, color: "8C3A18",
  });

  card(s, { x: M + 6.11, y: 1.85, w: 5.72, h: 4.55, fill: INK, line: null });
  s.addText("END TO END", {
    x: M + 6.51, y: 2.12, w: 4.9, h: 0.26, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 2.2, color: "C9A94E",
  });
  s.addText("Where the data goes", {
    x: M + 6.51, y: 2.44, w: 4.92, h: 0.72, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 22, bold: true, color: CREAM, lineSpacingMultiple: 0.98,
  });

  const how = [
    ["Nothing goes into the ad platforms", "No patient lists and no health information are ever uploaded into Facebook or Google ads. Not for targeting, not for lookalikes, not ever."],
    ["Consent records are permanent", "Every signed permission record is kept and never deleted, so there is always proof of what was agreed."],
    ["Opt-out is immediate and final", "If someone opts out, contact stops immediately and permanently — no re-adds, no follow-up campaigns."],
  ];
  let ky = 3.3;
  how.forEach((v, i) => {
    badge(s, { x: M + 6.51, y: ky + 0.02, d: 0.36, n: String(i + 1), fill: "2E2A24", color: "C9A94E", fs: 11 });
    s.addText(v[0], {
      x: M + 7.0, y: ky, w: 4.4, h: 0.3, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 13.5, bold: true, color: CREAM,
    });
    s.addText(v[1], {
      x: M + 7.0, y: ky + 0.31, w: 4.43, h: 0.66, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 11.5, color: MUTED, lineSpacingMultiple: 1.14,
    });
    ky += 1.05;
  });

  footer(s, false);
  s.addNotes(
    "Cover what can and cannot be asked on lead forms: forms only collect what's needed, like name and phone number. " +
    "No questions about symptoms, sicknesses, or treatments. Every form includes a link to the Privacy Policy and a permission " +
    "checkbox for calls or texts, including AI contact. " +
    "Then explain how patient data is handled end to end: no patient lists or health info are ever uploaded into Facebook or Google ads. " +
    "Signed permission records are kept and never deleted, and if someone opts out, contact stops immediately and permanently. " +
    "Reconfirm HIPAA handling expectations out loud, since this is a psychiatric practice — say the words and let them respond."
  );
}

/* ==================================================================== */
/* 20 — AGREEMENTS                                                      */
/* ==================================================================== */
{
  const s = light();
  head(s, "AGREEMENTS", "Two signatures before anything runs", LEGAL, false);

  card(s, { x: M, y: 1.9, w: 7.4, h: 3.28, fill: INK, line: null });
  badge(s, { x: M + 0.44, y: 2.24, d: 0.6, n: "1", fill: LEGAL, color: CREAM, fs: 15 });
  s.addText("Business Associate Agreement", {
    x: M + 1.16, y: 2.2, w: 5.9, h: 0.68, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 24, bold: true, color: CREAM, lineSpacingMultiple: 0.98,
  });
  const baa = [
    ["No work begins until it is signed", "Not a single lead is touched before the BAA is executed. This is a hard gate, not a formality we chase later."],
    ["Our vendors are covered too", "Stay Booked keeps signed BAAs with every tool that touches patient information, GoHighLevel included."],
  ];
  let by = 3.1;
  baa.forEach((b) => {
    s.addShape(pres.ShapeType.ellipse, {
      x: M + 0.44, y: by + 0.06, w: 0.28, h: 0.28, fill: { color: LEGAL }, line: { type: "none" },
    });
    s.addText(b[0], {
      x: M + 0.9, y: by, w: 6.1, h: 0.32, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 14, bold: true, color: CREAM,
    });
    s.addText(b[1], {
      x: M + 0.9, y: by + 0.33, w: 6.12, h: 0.62, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 12.5, color: MUTED, lineSpacingMultiple: 1.16,
    });
    by += 1.02;
  });

  card(s, { x: M + 7.79, y: 1.9, w: 4.04, h: 3.28, fill: PAPER, line: RULE });
  badge(s, { x: M + 8.13, y: 2.24, d: 0.6, n: "2", fill: INK, color: GOLD, fs: 15 });
  s.addText("Terms of Service", {
    x: M + 8.13, y: 3.0, w: 3.4, h: 0.5, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 24, bold: true, color: INK,
  });
  s.addText(
    "Confirm today that you have read and signed the Terms of Service. If anything in it is unclear, " +
    "we would rather work through it in this meeting than after the first invoice.",
    { x: M + 8.13, y: 3.6, w: 3.42, h: 1.24, margin: 0, valign: "top",
      fontFace: SANS, fontSize: 12.5, color: CHAR, lineSpacingMultiple: 1.2 }
  );

  card(s, { x: M, y: 5.42, w: W, h: 0.98, fill: "F5EFE0", line: "D9C79A" });
  s.addText("Until both are signed, no campaigns are built, no ads are run, and no leads are worked.", {
    x: M + 0.42, y: 5.42, w: W - 0.84, h: 0.98, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 19, bold: true, color: "5C4712",
  });

  footer(s, false);
  s.addNotes(
    "Walk through the Business Associate Agreement and what it covers. Be clear: no work begins on any leads until the BAA is signed. " +
    "Stay Booked also keeps its own signed BAAs with every tool that touches patient info, like GoHighLevel. " +
    "Then confirm the client has reviewed and signed the Terms of Service. Handle any questions here rather than after billing starts."
  );
}

/* ==================================================================== */
/* 21 — NEXT STEPS                                                      */
/* ==================================================================== */
{
  const s = dark();
  s.addShape(pres.ShapeType.ellipse, {
    x: 9.6, y: -1.3, w: 5.4, h: 5.4,
    fill: { type: "none" }, line: { color: "302A23", width: 1 },
  });
  s.addText("BEFORE WE GO", {
    x: M, y: 0.62, w: 8.5, h: 0.28, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 10.5, bold: true, charSpacing: 2.6, color: GOLD,
  });
  s.addText("What happens next", {
    x: M, y: 0.95, w: 10.2, h: 0.72, margin: 0, valign: "middle",
    fontFace: SERIF, fontSize: 34, bold: true, color: CREAM,
  });

  const steps = [
    ["Sign the BAA and the Terms of Service", "Nothing starts before these two land.", LEGAL],
    ["Confirm insurance and service area", "In writing, so targeting is built off the real boundary.", LEGAL],
    ["Connect your card to Facebook or Google", "The platform bills you directly, separately from the retainer.", MONEY],
    ["Confirm billing start date and invoicing", "So the first invoice holds no surprises.", MONEY],
    ["Name your single point of contact", "One person your side; Jordan Vo and Jordan Niles on ours.", OPS],
    ["Book the standing weekly meeting", "Same day, same time, live analytics every week.", OPS],
  ];
  const gap = 0.3;
  const cw = (W - gap) / 2;
  steps.forEach((st, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = M + col * (cw + gap);
    const y = 1.92 + row * 1.24;
    card(s, { x, y, w: cw, h: 1.06, fill: INKCARD, line: INKLINE });
    s.addShape(pres.ShapeType.roundRect, {
      x: x + 0.3, y: y + 0.34, w: 0.34, h: 0.34, rectRadius: 0.06,
      fill: { color: INK }, line: { color: st[2], width: 1.25 },
    });
    s.addText(st[0], {
      x: x + 0.82, y: y + 0.2, w: cw - 1.12, h: 0.34, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 13.5, bold: true, color: CREAM,
    });
    s.addText(st[1], {
      x: x + 0.82, y: y + 0.54, w: cw - 1.12, h: 0.34, margin: 0, valign: "middle",
      fontFace: SANS, fontSize: 11.5, color: MUTED,
    });
  });

  card(s, { x: M, y: 5.64, w: W, h: 0.86, fill: "1A1712", line: "3E3527" });
  s.addImage({ path: LOGO_CREAM, x: M + 0.42, y: 5.9, w: 1.0, h: 0.318 });
  s.addText("Jordan Vo  ·  Jordan Niles      Your points of contact at Stay Booked Marketing", {
    x: M + 1.75, y: 5.64, w: 9.6, h: 0.86, margin: 0, valign: "middle",
    fontFace: SANS, fontSize: 13, color: GOLD,
  });

  footer(s, true);
  s.addNotes(
    "Close by reading the six action items out loud and assigning an owner and a date to each one before anyone leaves the call. " +
    "Thank them, and confirm the weekly meeting slot is actually on both calendars before hanging up."
  );
}

/* ---------------- write ---------------- */
pres.writeFile({ fileName: "StayBooked_Client_Kickoff.pptx" }).then((f) => {
  console.log("wrote", f, fs.statSync(f).size, "bytes");
});
