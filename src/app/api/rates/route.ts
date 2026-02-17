import { NextRequest, NextResponse } from 'next/server';

interface CachedData {
  rates: Record<string, number>;
  date: string;
  fetchedAt: string;
  source: string;
}

let cachedData: CachedData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

async function fetchNBSDirect(): Promise<CachedData | null> {
  try {
    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}.`;
    
    const nbsUrl = `https://webappcenter.nbs.rs/ExchangeRateWebApp/ExchangeRate/IndexByDate?isSearchExecuted=true&Date=${dateStr}&ExchangeRateListTypeID=1`;
    
    const response = await fetch(nbsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'sr-RS,sr;q=0.9,en;q=0.8',
      }
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    const rates: Record<string, number> = {};
    
    // Parse: <tr><td>EUR</td><td>978</td><td>EMU</td><td>1</td><td>117,0294</td></tr>
    const rowRegex = /<tr>\s*<td>([A-Z]{3})<\/td>\s*<td>\d+<\/td>\s*<td>[^<]*<\/td>\s*<td>(\d+)<\/td>\s*<td>([\d,]+)<\/td>/gi;
    
    let match;
    while ((match = rowRegex.exec(html)) !== null) {
      const currency = match[1];
      const unit = parseInt(match[2]) || 1;
      const rate = parseFloat(match[3].replace(',', '.'));
      
      if (currency && !isNaN(rate)) {
        rates[currency] = rate / unit;
      }
    }
    
    if (Object.keys(rates).length > 0) {
      return {
        rates,
        date: today.toISOString().split('T')[0],
        fetchedAt: new Date().toISOString(),
        source: 'NBS Official'
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchOpenExchange(): Promise<CachedData | null> {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/EUR');
    if (!response.ok) return null;
    
    const data = await response.json();
    if (!data.rates?.RSD) return null;
    
    const rsdRate = data.rates.RSD;
    const rates: Record<string, number> = { EUR: rsdRate };
    
    for (const [c, r] of Object.entries(data.rates)) {
      if (['USD', 'CHF', 'GBP', 'HUF', 'BAM'].includes(c)) {
        rates[c] = rsdRate / (r as number);
      }
    }
    
    return {
      rates,
      date: new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      source: 'OpenExchangeRates'
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const now = Date.now();
  
  // Return cached if valid
  if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
    return NextResponse.json(cachedData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store'
      }
    });
  }
  
  // Try NBS first
  let data = await fetchNBSDirect();
  
  // Fallback
  if (!data || Object.keys(data.rates).length < 3) {
    data = await fetchOpenExchange();
  }
  
  // Final fallback
  if (!data) {
    data = {
      rates: { EUR: 117.5, USD: 108.2, CHF: 130.5, GBP: 148.3, HUF: 0.30, BAM: 60.15 },
      date: new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      source: 'Fallback'
    };
  }
  
  cachedData = data;
  lastFetchTime = now;
  
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store'
    }
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
