/** The calculator's lead relay — a Base44 backend function, not /api/lead.
 *  The site deploys from a public repo, so the GHL webhook URL lives in the
 *  relay, never in this bundle. The relay validates, forwards to GHL, and
 *  backs the lead up to the LeadCapture entity. */
export const LEAD_ENDPOINT =
  'https://ai-jakey-27b6a498.base44.app/functions/sbmCaptureLead'
