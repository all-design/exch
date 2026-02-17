'use client';

import { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Mail, Star, ArrowRightLeft, Menu, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Tipovi
interface Recenzija { ime: string; tekst: string; ocena: number; datum?: string; }
interface Usluga { naslov: string; opis: string; }
interface PitanjeOdgovor { pitanje: string; odgovor: string; }
interface Config {
  osnovno: { naziv: string; slogan: string; licenca: string; godinaOsnivanja: number; godina: number; };
  logo: { tip: 'slika' | 'tekst'; slikaUrl: string; tekst: string; sirina: number; visina: number; };
  kontakt: { telefon: string; email: string; adresa: string; grad: string; postanskiBroj: string; drzava: string; googleMapsUrl: string; geoSirina: number; geoDuzina: number; };
  radnoVreme: { ponPet: string; subota: string; nedelja: string; ponPetOtvoreno: string; ponPetZatvoreno: string; subotaOtvoreno: string; subotaZatvoreno: string; };
  kursevi: { apiUrl: string; marzaKupovni: number; marzaProdajni: number; valute: string[]; };
  seo: { title: string; description: string; keywords: string; author: string; robots: string; canonical: string; language: string; };
  openGraph: { title: string; description: string; image: string; siteName: string; locale: string; type: string; };
  twitter: { card: string; title: string; description: string; image: string; };
  geoSeo: { region: string; place: string; areaServed: string[]; };
  structuredData: { businessType: string; priceRange: string; currenciesAccepted: string[]; paymentAccepted: string; areaServed: string; };
  društveneMreže: { facebook: string; instagram: string; twitter: string; linkedin: string; };
  recenzije: Recenzija[]; usluge: Usluga[];
  goldWidget: { enabled: boolean; title: string; };
  aeo: { pitanjaOdgovori: PitanjeOdgovor[]; };
}

// Default config - MORA da se ažurira i ovde!
const defaultConfig: Config = {
  osnovno: { naziv: 'Menjačnica Panter', slogan: 'Promena na bolje', licenca: 'MEN-001-2024', godinaOsnivanja: 2008, godina: 2025 },
  logo: { tip: 'tekst', slikaUrl: '/logo.png', tekst: 'PANTER', sirina: 180, visina: 60 },
  kontakt: { telefon: '+381 11 234 4444', email: 'info@menjacnica-panter.rs', adresa: 'Knez Mihailova 25, Beograd', grad: 'Beograd', postanskiBroj: '11000', drzava: 'Srbija', googleMapsUrl: 'https://maps.google.com/?q=Knez+Mihailova+25+Beograd', geoSirina: 44.8203, geoDuzina: 20.4622 },
  radnoVreme: { ponPet: '08:00 - 20:00', subota: '09:00 - 15:00', nedelja: 'Zatvoreno', ponPetOtvoreno: '08:00', ponPetZatvoreno: '20:00', subotaOtvoreno: '09:00', subotaZatvoreno: '15:00' },
  kursevi: { apiUrl: 'https://api.exchangerate-api.com/v4/latest/EUR', marzaKupovni: 0.5, marzaProdajni: 0.5, valute: ['EUR', 'USD', 'CHF', 'GBP', 'HUF', 'BAM'] },
  seo: { title: 'Menjačnica Panter | Najbolji kurs u Beogradu', description: 'Menjačnica Panter - Najpovoljniji kurs evra, dolara i drugih valuta u Beogradu.', keywords: 'menjačnica, kursna lista, promena novca, Beograd', author: 'Menjačnica Panter', robots: 'index, follow', canonical: 'https://dev2.cfd/demo/', language: 'sr-RS' },
  openGraph: { title: 'Menjačnica Panter | Najbolji kurs u Beogradu', description: 'Najpovoljniji kurs evra, dolara i drugih valuta u Beogradu.', image: '/og-image.png', siteName: 'Menjačnica Panter', locale: 'sr_RS', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Menjačnica Panter | Najbolji kurs u Beogradu', description: 'Najpovoljniji kurs evra, dolara i drugih valuta u Beogradu.', image: '/og-image.png' },
  geoSeo: { region: 'RS', place: 'Beograd', areaServed: ['Beograd', 'Srbija'] },
  structuredData: { businessType: 'CurrencyExchangeService', priceRange: '$$', currenciesAccepted: ['EUR', 'USD', 'CHF', 'GBP', 'HUF', 'BAM', 'RSD'], paymentAccepted: 'Cash', areaServed: 'Beograd, Srbija' },
  društveneMreže: { facebook: '', instagram: '', twitter: '', linkedin: '' },
  recenzije: [], 
  usluge: [], 
  goldWidget: { enabled: true, title: 'Prati cenu zlata uživo' },
  aeo: { pitanjaOdgovori: [] }
};

interface RateData { currency: string; srednji: number; kupovni: number; prodajni: number; }

const getCurrencyColor = (currency: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    EUR: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    USD: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    CHF: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    GBP: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    HUF: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    BAM: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  };
  return colors[currency] || { bg: 'bg-[#2d9cdb]/20', text: 'text-[#2d9cdb]', border: 'border-[#2d9cdb]/30' };
};

export default function HomePage() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [rates, setRates] = useState<RateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [animatedText, setAnimatedText] = useState('');
  const [showContent, setShowContent] = useState(false);
  const [calcAmount, setCalcAmount] = useState<string>('100');
  const [calcFrom, setCalcFrom] = useState<string>('EUR');
  const [calcTo, setCalcTo] = useState<string>('RSD');
  const [calcResult, setCalcResult] = useState<string>('0');
  
  // Slider state za usluge
  const [currentSlide, setCurrentSlide] = useState(0);

  // Animacija teksta
  useEffect(() => {
    const fullText = config.osnovno.naziv;
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) { setAnimatedText(fullText.substring(0, index)); index++; }
      else { clearInterval(timer); setTimeout(() => setShowContent(true), 300); }
    }, 80);
    return () => clearInterval(timer);
  }, [config.osnovno.naziv]);

  // Učitaj konfiguraciju - BEZ KEŠIRANJA
  useEffect(() => {
    // Koristi basePath ako je definisan
    const basePath = process.env.NODE_ENV === 'production' ? '/demo' : '';
    fetch(`${basePath}/config.json`, { 
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Config loaded:', data.kursevi);
        setConfig(data);
        if (data.seo?.title) document.title = data.seo.title;
      })
      .catch(err => console.log('Config error, using default:', err));
  }, []);

  // Učitaj kurseve - serverless API (NBS) ili fallback
  useEffect(() => {
    const fetchRates = async () => {
      try {
        let data: any = null;
        
        // 1. Pokušaj mini-servis (lokalni dev)
        try {
          const serviceResponse = await fetch('/api/rates?XTransformPort=3002', {
            signal: AbortSignal.timeout(2000)
          });
          if (serviceResponse.ok) {
            data = await serviceResponse.json();
            console.log('Rates from mini-service:', data.source);
          }
        } catch {}
        
        // 2. Pokušaj Vercel serverless (produkcija)
        if (!data?.rates) {
          try {
            const vercelResponse = await fetch('/api/rates', {
              signal: AbortSignal.timeout(3000)
            });
            if (vercelResponse.ok) {
              data = await vercelResponse.json();
              console.log('Rates from serverless:', data.source);
            }
          } catch {}
        }
        
        // 3. Fallback na direktni API
        if (!data?.rates) {
          const response = await fetch('https://open.er-api.com/v6/latest/EUR');
          const apiData = await response.json();
          
          const rsdRate = apiData.rates.RSD;
          const rates: Record<string, number> = { EUR: rsdRate };
          
          for (const currency of config.kursevi.valute) {
            if (currency !== 'EUR' && apiData.rates[currency]) {
              rates[currency] = rsdRate / apiData.rates[currency];
            }
          }
          
          data = {
            rates,
            date: new Date().toISOString().split('T')[0],
            source: 'OpenExchangeRates'
          };
          console.log('Rates from direct API:', data.source);
        }
        
        // Izračunaj sa maržom
        const ratesData: RateData[] = config.kursevi.valute.map(currency => {
          const srednji = data.rates[currency] || 100;
          const marzaK = config.kursevi.marzaKupovni / 100;
          const marzaP = config.kursevi.marzaProdajni / 100;
          
          const kupovni = srednji * (1 - marzaK);
          const prodajni = srednji * (1 + marzaP);
          
          return { 
            currency, 
            srednji: Math.round(srednji * 10000) / 10000, 
            kupovni: Math.round(kupovni * 10000) / 10000, 
            prodajni: Math.round(prodajni * 10000) / 10000 
          };
        });
        
        setRates(ratesData);
      } catch (error) {
        console.error('Rate fetch error:', error);
        setRates([
          { currency: 'EUR', srednji: 117.5, kupovni: 117.5, prodajni: 117.5 },
          { currency: 'USD', srednji: 108.2, kupovni: 108.2, prodajni: 108.2 },
          { currency: 'CHF', srednji: 130.5, kupovni: 130.5, prodajni: 130.5 },
          { currency: 'GBP', srednji: 148.3, kupovni: 148.3, prodajni: 148.3 },
          { currency: 'HUF', srednji: 0.30, kupovni: 0.30, prodajni: 0.30 },
          { currency: 'BAM', srednji: 60.15, kupovni: 60.15, prodajni: 60.15 }
        ]);
      } finally { setLoading(false); }
    };
    fetchRates();
  }, [config.kursevi.valute, config.kursevi.marzaKupovni, config.kursevi.marzaProdajni]);

  // Kalkulator
  useEffect(() => {
    const amount = parseFloat(calcAmount) || 0;
    let result = 0;
    if (calcFrom === 'RSD') { const rate = rates.find(r => r.currency === calcTo); result = amount / (rate?.prodajni || 1); }
    else if (calcTo === 'RSD') { const rate = rates.find(r => r.currency === calcFrom); result = amount * (rate?.kupovni || 1); }
    else { const fromRate = rates.find(r => r.currency === calcFrom); const toRate = rates.find(r => r.currency === calcTo); result = (amount * (fromRate?.kupovni || 1)) / (toRate?.prodajni || 1); }
    setCalcResult(result.toFixed(2));
  }, [calcAmount, calcFrom, calcTo, rates]);

  // Gold Widget
  useEffect(() => {
    const createWidget = (containerId: string) => {
      const container = document.getElementById(containerId);
      if (!container || container.querySelector('iframe')) return;
      const iframe = document.createElement('iframe');
      iframe.src = 'https://zlato.ai/widget/v4?theme=dark&ref=menjacnica';
      iframe.style.cssText = 'border:0; width:100%; height:100%; min-height:360px;';
      iframe.loading = 'lazy';
      iframe.title = 'Zlato.ai - Cena zlata';
      container.appendChild(iframe);
    };
    setTimeout(() => {
      createWidget('zlato-widget-frame');
      createWidget('zlato-widget-frame-mobile');
    }, 100);
  }, [loading]);

  const isOpen = () => { const now = new Date(); const day = now.getDay(); const hour = now.getHours(); if (day === 0) return false; if (day === 6) return hour >= 9 && hour < 15; return hour >= 8 && hour < 20; };

  // Slider controls
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % Math.ceil(rates.length / 4));
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + Math.ceil(rates.length / 4)) % Math.ceil(rates.length / 4));

  const RatesTable = () => (
    <table className="w-full">
      <thead>
        <tr className="border-b border-white/10">
          <th className="py-3 px-3 text-left text-gray-500 font-medium">Valuta</th>
          <th className="py-3 px-3 text-right text-gray-500 font-medium">Kupovni</th>
          <th className="py-3 px-3 text-right text-gray-500 font-medium">Prodajni</th>
        </tr>
      </thead>
      <tbody>
        {rates.map((rate) => {
          const colors = getCurrencyColor(rate.currency);
          return (
            <tr key={rate.currency} className="border-b border-white/5 hover:bg-white/5 transition-all duration-300 group">
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <span className={`w-9 h-9 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center font-bold ${colors.text} transition-all duration-300 group-hover:scale-110`}>{rate.currency.substring(0, 2)}</span>
                  <span className={`font-bold ${colors.text}`}>{rate.currency}</span>
                </div>
              </td>
              <td className="py-3 px-3 text-right font-mono text-emerald-400 font-semibold">{rate.kupovni.toFixed(2)}</td>
              <td className="py-3 px-3 text-right font-mono text-rose-400 font-semibold">{rate.prodajni.toFixed(2)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  // Usluge iz config-a ili default
  const usluge = config.usluge.length > 0 ? config.usluge : [
    { naslov: 'Promena strane valute', opis: 'Kupovina i prodaja svih glavnih svetskih valuta po povoljnim kursevima.' },
    { naslov: 'Western Union', opis: 'Brz i siguran prenos novca širom sveta.' },
    { naslov: 'Plaćanje računa', opis: 'Uplate računa za komunalije, telefon i internet.' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <a href="#" className="flex items-center gap-3 group">
              {config.logo.tip === 'slika' ? (
                <img src={config.logo.slikaUrl} alt="Logo" className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <span className="text-2xl sm:text-3xl font-bold text-[#2d9cdb] transition-all duration-300 group-hover:text-[#5bb8e8]">{config.logo.tekst}</span>
              )}
            </a>
            <div className="hidden md:flex items-center gap-8">
              {['Kursevi', 'Kalkulator', 'Zlato', 'Kontakt'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="relative text-gray-400 hover:text-white transition-colors duration-300 group">{item}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2d9cdb] transition-all duration-300 group-hover:w-full"></span></a>
              ))}
            </div>
            <button className="md:hidden p-2 text-gray-400 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/5">
              {['Kursevi', 'Kalkulator', 'Zlato', 'Kontakt'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block py-3 text-gray-400 hover:text-white transition-all" onClick={() => setMobileMenuOpen(false)}>{item}</a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d9cdb]/5 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2d9cdb]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#15151f] border border-white/10 mb-6 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <span className={`w-2 h-2 rounded-full ${isOpen() ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}></span>
                <span className="text-sm text-gray-400">{isOpen() ? 'Otvoreno sada' : 'Zatvoreno'}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d9cdb] via-[#5bb8e8] to-[#2d9cdb] bg-300% animate-gradient">{animatedText}</span>
                <span className="animate-blink">|</span>
              </h1>
              <p className={`text-xl sm:text-2xl text-[#2d9cdb] mb-6 transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>{config.osnovno.slogan}</p>
              <p className={`text-gray-400 text-lg mb-8 max-w-xl mx-auto lg:mx-0 transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>Već {config.osnovno.godina - config.osnovno.godinaOsnivanja} godina nudimo najpovoljnije kurseve u {config.kontakt.grad}u. Licenca NBS: {config.osnovno.licenca}</p>
              <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <a href="#kalkulator" className="group relative px-8 py-4 bg-[#2d9cdb] rounded-lg font-semibold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#2d9cdb]/25"><span className="relative z-10">Kalkulator</span></a>
                <a href={config.kontakt.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="group px-8 py-4 border border-[#2d9cdb]/30 rounded-lg font-semibold transition-all duration-300 hover:border-[#2d9cdb] hover:bg-[#2d9cdb]/10"><MapPin className="inline mr-2 h-5 w-5" />Pronađi nas</a>
              </div>
            </div>
            <div className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-500 ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              {[
                { icon: Phone, label: 'Pozovite nas', value: config.kontakt.telefon, href: `tel:${config.kontakt.telefon}` },
                { icon: Clock, label: 'Radno vreme', value: config.radnoVreme.ponPet },
                { icon: MapPin, label: 'Adresa', value: config.kontakt.adresa },
                { icon: Star, label: 'Iskustvo', value: `Od ${config.osnovno.godinaOsnivanja}` }
              ].map((item, index) => (
                <div key={index} className="group bg-[#15151f] rounded-xl p-6 border border-white/5 hover:border-[#2d9cdb]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2d9cdb]/10 cursor-pointer">
                  <item.icon className="h-8 w-8 text-[#2d9cdb] mb-3 transition-transform duration-300 group-hover:scale-110" />
                  <p className="text-sm text-gray-500">{item.label}</p>
                  {item.href ? <a href={item.href} className="font-semibold hover:text-[#2d9cdb] transition-colors">{item.value}</a> : <p className="font-semibold">{item.value}</p>}
                </div>
              ))}
            </div>
          </div>
          <div className={`flex justify-center mt-12 transition-all duration-700 delay-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
            <a href="#kalkulator" className="text-gray-500 hover:text-[#2d9cdb] transition-colors animate-bounce"><ChevronDown size={32} /></a>
          </div>
        </div>
      </section>

      {/* CALCULATOR - FULL WIDTH */}
      <section id="kalkulator" className="py-16 sm:py-20 px-4 bg-[#0f0f15]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4"><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Kalkulator</span></h2>
            <p className="text-gray-500">Izračunajte koliko ćete dobiti</p>
          </div>
          
          <div className="w-full bg-[#15151f] rounded-2xl p-6 sm:p-8 border border-white/5">
            <div className="grid md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-500 mb-2">Iznos</label>
                <input type="number" value={calcAmount} onChange={(e) => setCalcAmount(e.target.value)} className="w-full px-4 py-4 bg-[#0a0a0f] border border-white/10 rounded-xl focus:border-[#2d9cdb] focus:outline-none text-2xl transition-all duration-300" placeholder="100" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">Od</label>
                <select value={calcFrom} onChange={(e) => setCalcFrom(e.target.value)} className="w-full px-4 py-4 bg-[#0a0a0f] border border-white/10 rounded-xl focus:border-[#2d9cdb] focus:outline-none transition-all text-lg">
                  <option value="RSD">RSD</option>
                  {rates.map(r => <option key={r.currency} value={r.currency}>{r.currency}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">U</label>
                <select value={calcTo} onChange={(e) => setCalcTo(e.target.value)} className="w-full px-4 py-4 bg-[#0a0a0f] border border-white/10 rounded-xl focus:border-[#2d9cdb] focus:outline-none transition-all text-lg">
                  <option value="EUR">EUR</option>
                  <option value="RSD">RSD</option>
                  {rates.filter(r => r.currency !== 'EUR').map(r => <option key={r.currency} value={r.currency}>{r.currency}</option>)}
                </select>
              </div>
              <div>
                <button onClick={() => { const temp = calcFrom; setCalcFrom(calcTo); setCalcTo(temp); }} className="w-full py-4 bg-[#2d9cdb]/20 hover:bg-[#2d9cdb]/30 rounded-xl transition-all duration-300 border border-[#2d9cdb]/30 hover:border-[#2d9cdb] flex items-center justify-center gap-2 text-[#2d9cdb]"><ArrowRightLeft className="h-5 w-5" />Zameni</button>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
              <span className="text-gray-400">Rezultat:</span>
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2d9cdb] to-[#5bb8e8]">{calcResult} {calcTo}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Kursevi + Zlato Widget */}
      <section id="kursevi" className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Mobile */}
          <div className="lg:hidden">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2"><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Kursna lista</span></h2>
              <p className="text-gray-500 text-sm">Marža: {config.kursevi.marzaKupovni}% / {config.kursevi.marzaProdajni}%</p>
            </div>
            {loading ? (
              <div className="flex justify-center py-8"><div className="w-10 h-10 border-2 border-[#2d9cdb] border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
              <div className="max-w-md mx-auto bg-[#15151f] rounded-2xl p-4 border border-white/5">
                <RatesTable />
              </div>
            )}
          </div>

          {/* Desktop - Side by Side - UJEDNAČENA VISINA */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-8">
            {/* Kursna lista */}
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold mb-2"><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Kursna lista</span></h2>
              <p className="text-gray-500 mb-6 text-sm">Marža: {config.kursevi.marzaKupovni}% / {config.kursevi.marzaProdajni}%</p>
              {loading ? (
                <div className="flex justify-center py-8 flex-1 bg-[#15151f] rounded-2xl border border-white/5"><div className="w-10 h-10 border-2 border-[#2d9cdb] border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                <div className="bg-[#15151f] rounded-2xl p-6 border border-white/5 flex-1 overflow-auto" style={{ maxHeight: '420px' }}>
                  <RatesTable />
                </div>
              )}
            </div>

            {/* Gold Widget */}
            {config.goldWidget.enabled && (
              <div id="zlato" className="flex flex-col">
                <h2 className="text-3xl font-bold mb-2"><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">{config.goldWidget.title}</span></h2>
                <p className="text-gray-500 mb-6 text-sm">Cena zlata u realnom vremenu</p>
                <div className="bg-[#15151f] rounded-2xl p-4 border border-white/5 flex-1 flex items-center justify-center" style={{ minHeight: '420px' }}>
                  <div id="zlato-widget-frame" className="w-full h-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gold Widget Mobile */}
      {config.goldWidget.enabled && (
        <section className="py-8 px-4 lg:hidden">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center"><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">{config.goldWidget.title}</span></h2>
            <div className="bg-[#15151f] rounded-2xl p-4 border border-white/5">
              <div id="zlato-widget-frame-mobile" style={{ width: '100%' }}></div>
            </div>
          </div>
        </section>
      )}

      {/* USLUGE - Slider sa swipe efektom */}
      <section className="py-16 sm:py-20 px-4 bg-[#0f0f15]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center"><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Naše usluge</span></h2>
          
          <div className="relative">
            {/* Slider Controls */}
            <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#15151f] border border-white/10 rounded-full flex items-center justify-center hover:border-[#2d9cdb]/50 transition-all hover:scale-110">
              <ChevronLeft className="h-6 w-6 text-[#2d9cdb]" />
            </button>
            <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#15151f] border border-white/10 rounded-full flex items-center justify-center hover:border-[#2d9cdb]/50 transition-all hover:scale-110">
              <ChevronRight className="h-6 w-6 text-[#2d9cdb]" />
            </button>

            {/* Cards Container */}
            <div className="overflow-hidden mx-14">
              <div 
                className="flex transition-transform duration-500 ease-out gap-6"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {usluge.map((usluga, index) => (
                  <div 
                    key={index} 
                    className="group min-w-full sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] bg-[#15151f] rounded-xl p-6 border border-white/5 hover:border-[#2d9cdb]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2d9cdb]/10 cursor-grab active:cursor-grabbing"
                  >
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-[#2d9cdb] transition-colors">{usluga.naslov}</h3>
                    <p className="text-gray-500">{usluga.opis}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {[...Array(Math.ceil(usluge.length / 3))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full transition-all ${currentSlide === i ? 'bg-[#2d9cdb] w-6' : 'bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      {config.recenzije.length > 0 && (
        <section className="py-16 sm:py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center"><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Šta kažu naši klijenti</span></h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.recenzije.map((recenzija, index) => (
                <div key={index} className="bg-[#15151f] rounded-xl p-6 border border-white/5 hover:border-[#2d9cdb]/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => (<Star key={i} className={`h-4 w-4 ${i < recenzija.ocena ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />))}</div>
                  <p className="text-gray-400 mb-4 italic">"{recenzija.tekst}"</p>
                  <p className="font-semibold text-[#2d9cdb]">{recenzija.ime}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="kontakt" className="py-16 sm:py-20 px-4 bg-[#0f0f15]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center"><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Kontakt</span></h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-[#15151f] rounded-2xl p-6 sm:p-8 border border-white/5">
              <h3 className="text-xl font-semibold mb-6">Informacije</h3>
              <div className="space-y-6">
                <a href={config.kontakt.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-[#2d9cdb]/10 flex items-center justify-center shrink-0 group-hover:bg-[#2d9cdb]/20 transition-colors"><MapPin className="h-6 w-6 text-[#2d9cdb]" /></div>
                  <div><p className="font-medium group-hover:text-[#2d9cdb] transition-colors">Adresa</p><p className="text-gray-500">{config.kontakt.adresa}, {config.kontakt.grad}</p></div>
                </a>
                <a href={`tel:${config.kontakt.telefon}`} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-[#2d9cdb]/10 flex items-center justify-center shrink-0 group-hover:bg-[#2d9cdb]/20 transition-colors"><Phone className="h-6 w-6 text-[#2d9cdb]" /></div>
                  <div><p className="font-medium group-hover:text-[#2d9cdb] transition-colors">Telefon</p><p className="text-gray-500">{config.kontakt.telefon}</p></div>
                </a>
                <a href={`mailto:${config.kontakt.email}`} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-[#2d9cdb]/10 flex items-center justify-center shrink-0 group-hover:bg-[#2d9cdb]/20 transition-colors"><Mail className="h-6 w-6 text-[#2d9cdb]" /></div>
                  <div><p className="font-medium group-hover:text-[#2d9cdb] transition-colors">Email</p><p className="text-gray-500">{config.kontakt.email}</p></div>
                </a>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#2d9cdb]/10 flex items-center justify-center shrink-0"><Clock className="h-6 w-6 text-[#2d9cdb]" /></div>
                  <div><p className="font-medium">Radno vreme</p><p className="text-gray-500">Pon-Pet: {config.radnoVreme.ponPet}</p><p className="text-gray-500">Subota: {config.radnoVreme.subota}</p><p className="text-gray-500">Nedelja: {config.radnoVreme.nedelja}</p></div>
                </div>
              </div>
            </div>
            <div className="bg-[#15151f] rounded-2xl overflow-hidden border border-white/5 min-h-[400px]">
              <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(config.kontakt.adresa)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} className="w-full h-full min-h-[400px]" style={{ border: 0 }} allowFullScreen loading="lazy" title="Mapa" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-[#0a0a0f] border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xl font-bold text-[#2d9cdb]">{config.logo.tip === 'tekst' ? config.logo.tekst : <img src={config.logo.slikaUrl} alt="Logo" className="h-8 w-auto" />}</span>
          <div className="text-center sm:text-right text-sm text-gray-500">
            <p>© {config.osnovno.godina} {config.osnovno.naziv}. Sva prava zadržana.</p>
            <p>Licenca NBS: {config.osnovno.licenca}</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        .animate-blink { animation: blink 1s infinite; }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient { animation: gradient 3s ease infinite; background-size: 200% 200%; }
      `}</style>
    </div>
  );
}
