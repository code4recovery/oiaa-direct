import { describe, it, expect } from 'vitest'
import { telHref } from './phone'

// Values below are real conference_phone values from OIAA's data.
describe('telHref', () => {
  it('keeps pauses and access codes, and writes # as %23', () => {
    expect(telHref('+16468769923,,773878425#')).toBe('tel:+16468769923,,773878425%23')
    expect(telHref('1-701-802-5103,,4993276#')).toBe('tel:17018025103,,4993276%23')
    expect(telHref('+17806660144,,85721200594#,,,,*115494#')).toBe(
      'tel:+17806660144,,85721200594%23,,,,*115494%23',
    )
  })

  it('drops spaces, dashes, brackets, dots and labels', () => {
    expect(telHref('(646) 876-9923')).toBe('tel:6468769923')
    expect(telHref(' 1 646 876 9923')).toBe('tel:16468769923')
    expect(telHref('1.646.876.9923')).toBe('tel:16468769923')
    expect(telHref('+16699009128, 983025118# (US)')).toBe('tel:+16699009128,983025118%23')
  })

  it('keeps a leading +', () => {
    expect(telHref('+44-20-7946-0958')).toBe('tel:+442079460958')
    expect(telHref(' +1 646 876 9923')).toBe('tel:+16468769923')
  })

  it('returns undefined when there is no number', () => {
    expect(telHref(undefined)).toBeUndefined()
    expect(telHref('')).toBeUndefined()
    expect(telHref('   ')).toBeUndefined()
    expect(telHref('see notes')).toBeUndefined()
  })

  it('gives no link when a code was typed after a space instead of a comma', () => {
    expect(telHref('3126266799 591101330 ##')).toBeUndefined()
    expect(telHref('1-646-558-8656  141 302 523#')).toBeUndefined()
  })
})
