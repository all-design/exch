/**
 * NBS Exchange Rates Service
 * Scrapes official exchange rates from National Bank of Serbia
 * Runs on port 3002
 */

const PORT = 3002;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};

interface CachedData {
  rates: Record<string, number>;
  date: string;
  fetchedAt: string;
  source: string;
}

let cachedData: CachedData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

async function fetchNBSDirect(): Promise<CachedData | null> {
  try {
    // Format today's date for NBS URL
    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}.`;
    
    const nbsUrl = `https://webappcenter.nbs.rs/ExchangeRateWebApp/ExchangeRate/IndexByDate?isSearchExecuted=true&Date=${dateStr}&ExchangeRateListTypeID=1`;
    
    console.log('Fetching NBS:', nbsUrl);
    
    const response = await fetch(nbsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'sr-RS,sr;q=0.9,en;q=0.8',
      }
    });
    
    if (!response.ok) {
      console.log('NBS response not OK:', response.status);
      return null;
    }
    
    const html = await response.text();
    console.log('NBS HTML length:', html.length);
    
    // Parse table rows - format: <tr><td>EUR</td><td>978</td><td>EMU</td><td>1</td><td>117,0294</td></tr>
    const rates: Record<string, number> = {};
    const rowRegex = /<tr>\s*<td>([A-Z]{3})<\/td>\s*<td>\d+<\/td>\s*<td>[^<]*<\/td>\s*<td>(\d+)<\/td>\s*<td>([\d,]+)<\/td>/gi;
    
    let match;
    while ((match = rowRegex.exec(html)) !== null) {
      const currency = match[1];
      const unit = parseInt(match[2]) || 1;
      const rateStr = match[3].replace(',', '.');
      const rate = parseFloat(rateStr);
      
      if (currency && !isNaN(rate)) {
        // Rate is for 'unit' amount, normalize to 1
        rates[currency] = rate / unit;
        console.log(`Parsed ${currency}: ${rates[currency]} (raw: ${rate}, unit: ${unit})`);
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
  } catch (error) {
    console.error('NBS fetch error:', error);
    return null;
  }
}

async function fetchOpenExchangeRates(): Promise<CachedData | null> {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/EUR');
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    if (!data.rates || !data.rates.RSD) return null;
    
    const rsdRate = data.rates.RSD;
    const rates: Record<string, number> = { EUR: rsdRate };
    
    for (const [currency, rate] of Object.entries(data.rates)) {
      if (['USD', 'CHF', 'GBP', 'HUF', 'BAM'].includes(currency)) {
        rates[currency] = rsdRate / (rate as number);
      }
    }
    
    return {
      rates,
      date: new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      source: 'OpenExchangeRates'
    };
  } catch (error) {
    console.error('OpenExchange error:', error);
    return null;
  }
}

async function fetchRates(): Promise<CachedData> {
  const now = Date.now();
  
  // Return cached if valid
  if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
    console.log('Returning cached rates');
    return cachedData;
  }
  
  console.log('Fetching fresh rates...');
  
  // Try NBS first
  let data = await fetchNBSDirect();
  
  // Fallback to OpenExchange
  if (!data || Object.keys(data.rates).length < 3) {
    console.log('NBS failed, using OpenExchange');
    data = await fetchOpenExchangeRates();
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
  
  console.log('Rates:', Object.entries(data.rates).map(([k,v]) => `${k}:${v.toFixed(4)}`).join(', '));
  
  return data;
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'nbs-rates', port: PORT }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    if (url.pathname === '/api/rates') {
      const data = await fetchRates();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
    
    return new Response(JSON.stringify({
      service: 'NBS Exchange Rates',
      endpoints: {
        '/api/rates': 'Get all exchange rates (NBS official)',
        '/health': 'Health check'
      }
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  },
});

console.log(`🚀 NBS Rates Service running on port ${PORT}`);
console.log(`📊 Scrapes official NBS rates from webappcenter.nbs.rs`);
