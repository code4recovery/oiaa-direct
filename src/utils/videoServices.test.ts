import { describe, it, expect } from 'vitest';
import { getServiceProviderNameFromUrl } from './videoServices';

describe('getServiceProviderNameFromUrl', () => {
  it('returns correct provider for known domains', () => {
    expect(getServiceProviderNameFromUrl('https://zoom.us/j/123456')).toBe('Zoom');
    expect(getServiceProviderNameFromUrl('https://meet.google.com/abc-defg-hij')).toBe('Google Meet');
    expect(getServiceProviderNameFromUrl('https://teams.microsoft.com/l/meetup-join/abc')).toBe('Microsoft Teams');
    expect(getServiceProviderNameFromUrl('https://bluejeans.com/123')).toBe('BlueJeans');
    expect(getServiceProviderNameFromUrl('https://discord.gg/xyz')).toBe('Discord');
    expect(getServiceProviderNameFromUrl('https://maps.secondlife.com/some-room')).toBe('Virtual Reality');
  });

  it('returns null for unknown domain', () => {
    expect(getServiceProviderNameFromUrl('https://example.com/meeting')).toBeNull();
  });

  it('returns null for invalid URLs', () => {
    expect(getServiceProviderNameFromUrl('not-a-valid-url')).toBeNull();
    expect(getServiceProviderNameFromUrl('')).toBeNull();
    expect(getServiceProviderNameFromUrl(null as unknown as string)).toBeNull();
    expect(getServiceProviderNameFromUrl(undefined as unknown as string)).toBeNull();
  });

  it('handles subdomains correctly (should match root domain)', () => {
    expect(getServiceProviderNameFromUrl('https://subdomain.zoom.us/j/987')).toBe('Zoom');
    expect(getServiceProviderNameFromUrl('https://video.meet.google.com/xyz')).toBe('Google Meet');
  });
  
  it('returns null for base domains when service requies subdomains', () => {
    expect(getServiceProviderNameFromUrl('https://microsoft.com/l/meetup-join/abc')).toBeNull();
    expect(getServiceProviderNameFromUrl('https://google.com/abc-defg-hij')).toBeNull();
  });
});
