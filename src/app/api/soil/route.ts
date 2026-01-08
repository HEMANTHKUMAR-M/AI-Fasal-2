import { NextResponse } from 'next/server';

async function fetchWithRetries(url: string, attempts = 3, delayMs = 500) {
  let lastErr: any = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      // If server error, remember and retry
      if (!res.ok && res.status >= 500 && res.status < 600) {
        lastErr = new Error(`Server error ${res.status}`);
      } else {
        return res;
      }
    } catch (e) {
      lastErr = e;
    }
    await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, i)));
  }
  throw lastErr ?? new Error('Failed to fetch');
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lat = url.searchParams.get('lat');
    const lng = url.searchParams.get('lng');
    if (!lat || !lng) {
      return NextResponse.json({ error: 'Missing lat or lng query parameters' }, { status: 400 });
    }
    // Providers to try (order matters). Can override with NEXT_PUBLIC_SOIL_PROVIDERS as comma-separated list.
    const defaultProviders = ['https://rest.isric.org', 'https://soilgrids.org'];
    const envList = process.env.NEXT_PUBLIC_SOIL_PROVIDERS;
    const providers = envList && envList.trim().length > 0 ? envList.split(',').map(s => s.trim()) : defaultProviders;

    const path = `/soilgrids/v2.0/properties/query?lon=${encodeURIComponent(lng)}&lat=${encodeURIComponent(lat)}&properties=phh2o,nitrogen,soc,clay,silt,sand,cec,bulkdensity,ocdstock,potassium_extractable,phosphorus_extractable&depth=0-5cm`;

    const errors: Array<{ provider: string; message: string; status?: number }> = [];
    for (const base of providers) {
      const target = `${base.replace(/\/$/, '')}${path}`;
      try {
        const res = await fetchWithRetries(target, 3, 400);
        // If provider returned non-2xx (e.g., 404), collect and try next
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          errors.push({ provider: target, message: text || `HTTP ${res.status}`, status: res.status });
          continue;
        }

        // Read body and forward with caching header
        const bodyText = await res.text();
        const headers: Record<string, string> = { 'Content-Type': res.headers.get('content-type') || 'application/json', 'Cache-Control': 'public, max-age=60' };
        return new Response(bodyText, { status: res.status, headers });
      } catch (e: any) {
        errors.push({ provider: target, message: e?.message ?? String(e) });
        // try next provider
      }
    }

    console.error('All soil providers failed:', JSON.stringify(errors));
    return NextResponse.json({ error: 'Soil data service is temporarily unavailable.', details: errors }, { status: 502 });
  } catch (err: any) {
    console.error('Error in /api/soil:', err?.message ?? String(err));
    return NextResponse.json({ error: 'Soil data service is temporarily unavailable.' }, { status: 502 });
  }
}
