// videoServices.ts

// Default fallback map
const fallbackVideoServices: { [key: string]: string[] } = {
  BlueJeans: ['bluejeans.com'],
  DialPad: ['meetings.dialpad.com'],
  Discord: ['discord.gg'],
  'Free Conference': ['freeconference.com'],
  FreeConferenceCall: ['freeconferencecall.com'],
  'Google Meet': ['meet.google.com'],
  GoTo: ['goto.com', 'gotomeet.me', 'gotomeeting.com'],
  Jitsi: ['meet.jit.si'],
  'Microsoft Teams': ['teams.live.com', 'teams.microsoft.com'],
  Signal: ['signal.group'],
  Skype: ['skype.com'],
  'Virtual Reality': [
    'horizon.meta.com',
    'maps.secondlife.com',
    'slurl.com',
    'vrchat.com',
  ],
  WebEx: ['webex.com'],
  Zoho: ['zoho.com'],
  Zoom: ['zoom.us'],
};

// TODO: fetch map from central-query
// For now, simply return the fallback version.
function getVideoServiceMap(): Record<string, string[]> {
  // TODO: Replace this with actual fetch-once initialization logic
  return fallbackVideoServices;
}

// Determines the video provider name from a given meeting URL.
export function getServiceProviderNameFromUrl(url: string): string | null {
  if (!url) return null;

  let host: string;

  try {
    host = new URL(url).hostname;
  } catch {
    return null; // Invalid URL
  }

  const serviceMap = getVideoServiceMap();

  return (
    Object.entries(serviceMap).find(([, domains]) =>
      domains.some(domain => host.endsWith(domain))
    )?.[0] || null
  );
}
