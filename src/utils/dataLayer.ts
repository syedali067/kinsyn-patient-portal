// Deterministic event_id for Google Ads deduplication.
// Must match the server-side RudderStack transformation
// which computes sha256("EventName:email[:part1:part2...]").
async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function pushDataLayerEvent(
  event: string,
  email: string,
  ...parts: (string | number)[]
): Promise<void> {
  const dl = ((window as unknown as { dataLayer: Record<string, unknown>[] }).dataLayer ??= []);
  const seed = [event, email, ...parts].join(':');
  const eid = await sha256(seed);
  dl.push({ event, email, event_id: eid, eid });
}
