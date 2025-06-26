import { describe, it, expect } from 'vitest'
import { getServiceProviderNameFromUrl } from './videoServices'

describe('getServiceProviderNameFromUrl', () => {
  it('returns correct provider for known domains', () => {
    const zoom = getServiceProviderNameFromUrl('https://zoom.us/j/123456')
    expect(zoom.isOk()).toBe(true)
    expect(zoom.value).toBe('Zoom')

    const meet = getServiceProviderNameFromUrl('https://meet.google.com/abc-defg-hij')
    expect(meet.isOk()).toBe(true)
    expect(meet.value).toBe('Google Meet')

    const teams = getServiceProviderNameFromUrl('https://teams.microsoft.com/l/meetup-join/abc')
    expect(teams.isOk()).toBe(true)
    expect(teams.value).toBe('Microsoft Teams')

    const bluejeans = getServiceProviderNameFromUrl('https://bluejeans.com/123')
    expect(bluejeans.isOk()).toBe(true)
    expect(bluejeans.value).toBe('BlueJeans')

    const discord = getServiceProviderNameFromUrl('https://discord.gg/xyz')
    expect(discord.isOk()).toBe(true)
    expect(discord.value).toBe('Discord')

    const vr = getServiceProviderNameFromUrl('https://maps.secondlife.com/some-room')
    expect(vr.isOk()).toBe(true)
    expect(vr.value).toBe('Virtual Reality')
  })

  it('returns Err for unknown domain', () => {
    const result = getServiceProviderNameFromUrl('https://example.com/meeting')
    expect(result.isErr()).toBe(true)
  })

  it('returns Err for invalid URLs', () => {
    expect(getServiceProviderNameFromUrl('not-a-valid-url').isErr()).toBe(true)
    expect(getServiceProviderNameFromUrl('').isErr()).toBe(true)
    expect(getServiceProviderNameFromUrl(null as unknown as string).isErr()).toBe(true)
    expect(getServiceProviderNameFromUrl(undefined as unknown as string).isErr()).toBe(true)
  })

  it('handles subdomains correctly (should match root domain)', () => {
    const zoomSub = getServiceProviderNameFromUrl('https://subdomain.zoom.us/j/987')
    expect(zoomSub.isOk()).toBe(true)
    expect(zoomSub.value).toBe('Zoom')

    const meetSub = getServiceProviderNameFromUrl('https://video.meet.google.com/xyz')
    expect(meetSub.isOk()).toBe(true)
    expect(meetSub.value).toBe('Google Meet')
  })

  it('returns Err for base domains when service requires subdomains', () => {
    expect(getServiceProviderNameFromUrl('https://microsoft.com/l/meetup-join/abc').isErr()).toBe(true)
    expect(getServiceProviderNameFromUrl('https://google.com/abc-defg-hij').isErr()).toBe(true)
  })
})
