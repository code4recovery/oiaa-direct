/**
 * Builds a tel: link from a phone number as the meeting contact typed it,
 * for example "+16468769923,,773878425#" or "1-701-802-5103,,4993276#".
 *
 * Keeps what the phone dials: the digits, a leading +, pauses (,) and the
 * * and # of access codes. Drops spaces, dashes, brackets, dots and labels
 * such as "(US)". A # is written as %23, because in a link a bare # starts
 * the fragment and everything after it would be lost.
 *
 * No link when the number before the first pause or code is longer than 15
 * digits, the longest valid phone number. That happens when a code was typed
 * after a space instead of a comma ("3126266799 591101330 ##"): joined up, it
 * would dial a wrong number. The number is still shown as text.
 */
export function telHref(phone: string | undefined): string | undefined {
  if (!phone) return undefined
  const trimmed = phone.trim()
  const dialed = trimmed.replace(/[^\d,*#]/g, "")
  if (!/\d/.test(dialed)) return undefined
  if (dialed.split(/[,*#]/)[0].length > 15) return undefined
  const plus = trimmed.startsWith("+") ? "+" : ""
  return `tel:${plus}${dialed.replace(/#/g, "%23")}`
}
