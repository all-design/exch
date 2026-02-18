'use client';

import { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Mail, Star, ArrowRightLeft, Menu, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Tipovi
interface Recenzija { ime: string; tekst: string; ocena: number; datum?: string; }
interface Usluga { naslov: string; opis: string; }
interface PitanjeOdgovor { pitanje: string; odgovor: string; }
interface Config {
  osnovno: { naziv: string; slogan: string; licenca: string; godinaOsnivanja: number; godina: number; };
  tema?: 'light' | 'dark';
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

// Default config
const defaultConfig: Config = {
  osnovno: { naziv: 'Menjačnica Panter', slogan: 'Promena na bolje', licenca: 'MEN-001-2024', godinaOsnivanja: 2008, godina: 2025 },
  tema: 'dark',
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

// Minimalistički dizajn sistem - NightFolio style
const getThemeStyles = (theme: 'light' | 'dark' = 'dark') => {
  const isLight = theme === 'light';
  return {
    // Pozadine - light je toplija sivkasta, dark je čisto crna
    bg: isLight ? 'bg-stone-50' : 'bg-[#0a0a0f]',
    bgSecondary: isLight ? 'bg-stone-100/80' : 'bg-[#0f0f15]',
    bgCard: isLight ? 'bg-white' : 'bg-[#15151f]',
    bgCardAlt: isLight ? 'bg-stone-50' : 'bg-[#1a1a24]',
    
    // Tekst
    text: isLight ? 'text-stone-900' : 'text-white',
    textMuted: isLight ? 'text-stone-500' : 'text-stone-400',
    textSecondary: isLight ? 'text-stone-600' : 'text-stone-500',
    
    // Borderi i shadow
    border: isLight ? 'border-stone-200/60' : 'border-white/5',
    borderHover: isLight ? 'hover:border-stone-300' : 'hover:border-white/10',
    shadow: isLight ? 'shadow-sm shadow-stone-200/50' : 'shadow-none',
    shadowHover: isLight ? 'hover:shadow-md hover:shadow-stone-300/30' : 'hover:shadow-lg hover:shadow-[#2d9cdb]/10',
    
    // Navigacija
    navBg: isLight ? 'bg-white/90' : 'bg-[#0a0a0f]/90',
    navBorder: isLight ? 'border-stone-200/50' : 'border-white/5',
    
    // Tabela
    tableBorder: isLight ? 'border-stone-200/60' : 'border-white/10',
    tableRowHover: isLight ? 'hover:bg-stone-50' : 'hover:bg-white/5',
    tableHeader: isLight ? 'bg-stone-50' : 'bg-transparent',
    
    // Input
    inputBg: isLight ? 'bg-white' : 'bg-[#0a0a0f]',
    inputBorder: isLight ? 'border-stone-300' : 'border-white/10',
    inputFocus: isLight ? 'focus:border-[#2d9cdb] focus:ring-[#2d9cdb]/20' : 'focus:border-[#2d9cdb] focus:ring-[#2d9cdb]/10',
    
    // Gradient tekst
    gradientFrom: isLight ? 'from-stone-900' : 'from-white',
    gradientTo: isLight ? 'to-stone-500' : 'to-stone-400',
    
    // Button secondary
    btnSecondary: isLight ? 'border-stone-300 hover:border-[#2d9cdb] hover:bg-[#2d9cdb]/5' : 'border-white/10 hover:border-[#2d9cdb]/30 hover:bg-[#2d9cdb]/10',
    
    // Accent color - isti za obe teme
    accent: '#2d9cdb',
    accentLight: isLight ? 'bg-[#2d9cdb]/10' : 'bg-[#2d9cdb]/20',
  };
};

const getCurrencyColor = (currency: string, theme: 'light' | 'dark' = 'dark') => {
  const isLight = theme === 'light';
  const colors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    EUR: { 
      bg: isLight ? 'bg-blue-50' : 'bg-blue-500/10', 
      text: isLight ? 'text-blue-600' : 'text-blue-400', 
      border: isLight ? 'border-blue-200' : 'border-blue-500/20',
      dot: 'bg-blue-500'
    },
    USD: { 
      bg: isLight ? 'bg-emerald-50' : 'bg-emerald-500/10', 
      text: isLight ? 'text-emerald-600' : 'text-emerald-400', 
      border: isLight ? 'border-emerald-200' : 'border-emerald-500/20',
      dot: 'bg-emerald-500'
    },
    CHF: { 
      bg: isLight ? 'bg-rose-50' : 'bg-rose-500/10', 
      text: isLight ? 'text-rose-600' : 'text-rose-400', 
      border: isLight ? 'border-rose-200' : 'border-rose-500/20',
      dot: 'bg-rose-500'
    },
    GBP: { 
      bg: isLight ? 'bg-violet-50' : 'bg-violet-500/10', 
      text: isLight ? 'text-violet-600' : 'text-violet-400', 
      border: isLight ? 'border-violet-200' : 'border-violet-500/20',
      dot: 'bg-violet-500'
    },
    HUF: { 
      bg: isLight ? 'bg-amber-50' : 'bg-amber-500/10', 
      text: isLight ? 'text-amber-600' : 'text-amber-400', 
      border: isLight ? 'border-amber-200' : 'border-amber-500/20',
      dot: 'bg-amber-500'
    },
    BAM: { 
      bg: isLight ? 'bg-cyan-50' : 'bg-cyan-500/10', 
      text: isLight ? 'text-cyan-600' : 'text-cyan-400', 
      border: isLight ? 'border-cyan-200' : 'border-cyan-500/20',
      dot: 'bg-cyan-500'
    },
  };
  return colors[currency] || { bg: 'bg-[#2d9cdb]/10', text: 'text-[#2d9cdb]', border: 'border-[#2d9cdb]/20', dot: 'bg-[#2d9cdb]' };
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
  const [rateDate, setRateDate] = useState<string>('');
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

  // Učitaj konfiguraciju
  useEffect(() => {
    fetch('/config.json', { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        if (data.seo?.title) document.title = data.seo.title;
      })
      .catch(() => console.log('Config error, using default'));
  }, []);

  // Učitaj kurseve
  useEffect(() => {
    const fetchRates = async () => {
      try {
        let data: any = null;
        
        try {
          const vercelResponse = await fetch('/api/rates', { signal: AbortSignal.timeout(5000) });
          if (vercelResponse.ok) { data = await vercelResponse.json(); }
        } catch {}
        
        if (!data?.rates) {
          try {
            const serviceResponse = await fetch('/api/rates?XTransformPort=3002', { signal: AbortSignal.timeout(2000) });
            if (serviceResponse.ok) { data = await serviceResponse.json(); }
          } catch {}
        }
        
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
          data = { rates, kupovni: rates, prodajni: rates, date: new Date().toISOString().split('T')[0], source: 'OpenExchangeRates' };
        }
        
        const marzaK = config.kursevi.marzaKupovni / 100;
        const marzaP = config.kursevi.marzaProdajni / 100;
        
        const ratesData: RateData[] = config.kursevi.valute.map(currency => {
          const srednji = data.rates[currency] || 100;
          const kupovniBase = data.kupovni?.[currency] || srednji;
          const prodajniBase = data.prodajni?.[currency] || srednji;
          return { 
            currency, 
            srednji: Math.round(srednji * 10000) / 10000, 
            kupovni: Math.round(kupovniBase * (1 - marzaK) * 10000) / 10000, 
            prodajni: Math.round(prodajniBase * (1 + marzaP) * 10000) / 10000 
          };
        });
        setRates(ratesData);
        
        // Sačuvaj datum iz NBS odgovora
        if (data.date) {
          setRateDate(data.date);
        }
      } catch (error) {
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
      iframe.src = `https://zlato.ai/widget/v4?theme=dark&ref=menjacnica`;
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
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % Math.ceil(rates.length / 4));
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + Math.ceil(rates.length / 4)) % Math.ceil(rates.length / 4));

  const theme = config.tema || 'dark';
  const styles = getThemeStyles(theme);
  const isLight = theme === 'light';

  const RatesTable = () => (
    <table className="w-full">
      <thead>
        <tr className={`border-b ${styles.tableBorder}`}>
          <th className={`py-3 px-3 text-left ${styles.textSecondary} font-medium text-sm uppercase tracking-wide`}>Valuta</th>
          <th className={`py-3 px-3 text-right ${styles.textSecondary} font-medium text-sm uppercase tracking-wide`}>Kupovni</th>
          <th className={`py-3 px-3 text-right ${styles.textSecondary} font-medium text-sm uppercase tracking-wide`}>Prodajni</th>
        </tr>
      </thead>
      <tbody>
        {rates.map((rate) => {
          const colors = getCurrencyColor(rate.currency, theme);
          return (
            <tr key={rate.currency} className={`border-b ${styles.tableBorder} ${styles.tableRowHover} transition-all duration-300 group`}>
              <td className="py-4 px-3">
                <div className="flex items-center gap-3">
                  <div className={`relative w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center font-bold ${colors.text} transition-all duration-300 group-hover:scale-105`}>
                    {rate.currency.substring(0, 2)}
                    <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${colors.dot} ${isOpen() ? 'animate-pulse' : ''}`}></span>
                  </div>
                  <div>
                    <span className={`font-semibold ${styles.text}`}>{rate.currency}</span>
                    <p className={`text-xs ${styles.textMuted}`}>-{rate.currency === 'EUR' ? 'Evro' : rate.currency === 'USD' ? 'Dolar' : rate.currency === 'CHF' ? 'Franak' : rate.currency === 'GBP' ? 'Funta' : rate.currency}</p>
                  </div>
                </div>
              </td>
              <td className={`py-4 px-3 text-right font-mono ${isLight ? 'text-emerald-600' : 'text-emerald-400'} font-semibold text-lg`}>{rate.kupovni.toFixed(2)}</td>
              <td className={`py-4 px-3 text-right font-mono ${isLight ? 'text-rose-600' : 'text-rose-400'} font-semibold text-lg`}>{rate.prodajni.toFixed(2)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const usluge = config.usluge.length > 0 ? config.usluge : [
    { naslov: 'Promena strane valute', opis: 'Kupovina i prodaja svih glavnih svetskih valuta po povoljnim kursevima.' },
    { naslov: 'Western Union', opis: 'Brz i siguran prenos novca širom sveta.' },
    { naslov: 'Plaćanje računa', opis: 'Uplate računa za komunalije, telefon i internet.' }
  ];

  return (
    <div className={`min-h-screen ${styles.bg} ${styles.text} overflow-x-hidden`}>
      {/* Navigation - Minimalistička */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${styles.navBg} backdrop-blur-xl border-b ${styles.navBorder}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <a href="#" className="flex items-center gap-3 group">
              {config.logo.tip === 'slika' ? (
                <img src={config.logo.slikaUrl} alt="Logo" className="h-20 sm:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <span className="text-2xl sm:text-3xl font-bold text-[#2d9cdb] transition-all duration-300 group-hover:text-[#5bb8e8] tracking-tight">{config.logo.tekst}</span>
              )}
            </a>
            <div className="hidden md:flex items-center gap-10">
              {['Kursevi', 'Kalkulator', 'Zlato', 'Kontakt'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className={`relative ${styles.textMuted} hover:text-[#2d9cdb] transition-colors duration-300 text-sm font-medium tracking-wide group`}>
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#2d9cdb] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            <button className={`md:hidden p-2 ${styles.textMuted} hover:text-[#2d9cdb] transition-colors`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className={`md:hidden py-4 border-t ${styles.border}`}>
              {['Kursevi', 'Kalkulator', 'Zlato', 'Kontakt'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className={`block py-3 ${styles.textMuted} hover:text-[#2d9cdb] transition-all`} onClick={() => setMobileMenuOpen(false)}>{item}</a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Minimalistički */}
      <section className="pt-28 sm:pt-40 pb-16 sm:pb-24 px-4 relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d9cdb]/[0.03] via-transparent to-transparent"></div>
        {!isLight && <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2d9cdb]/5 rounded-full blur-3xl"></div>}
        {!isLight && <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>}
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="text-center lg:text-left">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${styles.bgCard} border ${styles.border} ${styles.shadow} mb-8 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <span className={`w-2 h-2 rounded-full ${isOpen() ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                <span className={`text-sm font-medium ${styles.textMuted}`}>{isOpen() ? 'Otvoreno sada' : 'Zatvoreno'}</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d9cdb] via-[#5bb8e8] to-[#2d9cdb] bg-300% animate-gradient">{animatedText}</span>
                <span className="animate-blink text-[#2d9cdb]">|</span>
              </h1>
              
              <p className={`text-xl sm:text-2xl text-[#2d9cdb] mb-4 font-medium transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>{config.osnovno.slogan}</p>
              
              <p className={`${styles.textMuted} text-lg mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                Već {config.osnovno.godina - config.osnovno.godinaOsnivanja} godina nudimo najpovoljnije kurseve u {config.kontakt.grad}u. Licenca NBS: {config.osnovno.licenca}
              </p>
              
              <div className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <a href="#kalkulator" className="group relative px-8 py-4 bg-[#2d9cdb] rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#2d9cdb]/25 text-white">
                  <span className="relative z-10 flex items-center justify-center gap-2">Kalkulator <ArrowRightLeft className="w-4 h-4" /></span>
                </a>
                <a href={config.kontakt.googleMapsUrl} target="_blank" rel="noopener noreferrer" className={`group px-8 py-4 border rounded-xl font-semibold transition-all duration-300 ${styles.btnSecondary} flex items-center justify-center gap-2`}>
                  <MapPin className="h-5 w-5" /> Pronađi nas
                </a>
              </div>
            </div>
            
            <div className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-500 ${showContent ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              {[
                { icon: Phone, label: 'Pozovite nas', value: config.kontakt.telefon, href: `tel:${config.kontakt.telefon}` },
                { icon: Clock, label: 'Radno vreme', value: config.radnoVreme.ponPet },
                { icon: MapPin, label: 'Adresa', value: config.kontakt.adresa },
                { icon: Star, label: 'Iskustvo', value: `Od ${config.osnovno.godinaOsnivanja}` }
              ].map((item, index) => (
                <div key={index} className={`group ${styles.bgCard} rounded-2xl p-6 border ${styles.border} ${styles.shadow} ${styles.shadowHover} transition-all duration-300 hover:-translate-y-1 cursor-pointer`}>
                  <item.icon className="h-6 w-6 text-[#2d9cdb] mb-4 transition-transform duration-300 group-hover:scale-110" />
                  <p className={`text-sm ${styles.textSecondary} mb-1`}>{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className={`font-semibold hover:text-[#2d9cdb] transition-colors ${styles.text} text-sm leading-tight`}>{item.value}</a>
                  ) : (
                    <p className={`font-semibold text-sm leading-tight`}>{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className={`flex justify-center mt-16 transition-all duration-700 delay-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
            <a href="#kalkulator" className={`${styles.textSecondary} hover:text-[#2d9cdb] transition-colors animate-bounce`}>
              <ChevronDown size={32} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>

      {/* KALKULATOR - Full Width */}
      <section id="kalkulator" className={`py-20 sm:py-28 px-4 ${styles.bgSecondary}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${styles.gradientFrom} ${styles.gradientTo}`}>Kalkulator</span>
            </h2>
            <p className={`${styles.textSecondary} text-lg`}>Izračunajte koliko ćete dobiti</p>
          </div>
          
          <div className={`w-full ${styles.bgCard} rounded-2xl p-6 sm:p-8 border ${styles.border} ${styles.shadow}`}>
            <div className="grid md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium ${styles.textSecondary} mb-2`}>Iznos</label>
                <input 
                  type="number" 
                  value={calcAmount} 
                  onChange={(e) => setCalcAmount(e.target.value)} 
                  className={`w-full px-5 py-4 ${styles.inputBg} border ${styles.inputBorder} rounded-xl focus:outline-none ${styles.inputFocus} text-2xl font-medium transition-all duration-300 ${styles.text}`} 
                  placeholder="100" 
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${styles.textSecondary} mb-2`}>Od</label>
                <select value={calcFrom} onChange={(e) => setCalcFrom(e.target.value)} className={`w-full px-4 py-4 ${styles.inputBg} border ${styles.inputBorder} rounded-xl focus:outline-none ${styles.inputFocus} transition-all text-lg font-medium ${styles.text}`}>
                  <option value="RSD">RSD</option>
                  {rates.map(r => <option key={r.currency} value={r.currency}>{r.currency}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${styles.textSecondary} mb-2`}>U</label>
                <select value={calcTo} onChange={(e) => setCalcTo(e.target.value)} className={`w-full px-4 py-4 ${styles.inputBg} border ${styles.inputBorder} rounded-xl focus:outline-none ${styles.inputFocus} transition-all text-lg font-medium ${styles.text}`}>
                  <option value="EUR">EUR</option>
                  <option value="RSD">RSD</option>
                  {rates.filter(r => r.currency !== 'EUR').map(r => <option key={r.currency} value={r.currency}>{r.currency}</option>)}
                </select>
              </div>
              <div>
                <button 
                  onClick={() => { const temp = calcFrom; setCalcFrom(calcTo); setCalcTo(temp); }} 
                  className="w-full py-4 bg-[#2d9cdb]/10 hover:bg-[#2d9cdb]/20 rounded-xl transition-all duration-300 border border-[#2d9cdb]/20 hover:border-[#2d9cdb]/40 flex items-center justify-center gap-2 text-[#2d9cdb] font-medium"
                >
                  <ArrowRightLeft className="h-5 w-5" /> Zameni
                </button>
              </div>
            </div>
            <div className={`mt-8 pt-6 border-t ${styles.border} flex flex-col sm:flex-row justify-between items-center gap-4`}>
              <span className={`${styles.textMuted} font-medium`}>Rezultat:</span>
              <span className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2d9cdb] to-[#5bb8e8]">{calcResult} {calcTo}</span>
            </div>
          </div>
        </div>
      </section>

      {/* KURSNA LISTA + ZLATO */}
      <section id="kursevi" className="py-20 sm:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Mobile */}
          <div className="lg:hidden">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 tracking-tight">
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${styles.gradientFrom} ${styles.gradientTo}`}>Kursna lista</span>
              </h2>
              <p className={`${styles.textSecondary} text-sm font-medium`}>Za današnji dan: {rateDate ? new Date(rateDate).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '...'}</p>
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-2 border-[#2d9cdb] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className={`max-w-md mx-auto ${styles.bgCard} rounded-2xl p-4 border ${styles.border} ${styles.shadow}`}>
                <RatesTable />
              </div>
            )}
          </div>

          {/* Desktop */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-10">
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold mb-3 tracking-tight">
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${styles.gradientFrom} ${styles.gradientTo}`}>Kursna lista</span>
              </h2>
              <p className={`${styles.textSecondary} mb-8 text-sm font-medium`}>Za današnji dan: {rateDate ? new Date(rateDate).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '...'}</p>
              {loading ? (
                <div className={`flex justify-center py-12 flex-1 ${styles.bgCard} rounded-2xl border ${styles.border}`}><div className="w-10 h-10 border-2 border-[#2d9cdb] border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                <div className={`${styles.bgCard} rounded-2xl p-6 border ${styles.border} ${styles.shadow} flex-1 overflow-auto`} style={{ maxHeight: '440px' }}>
                  <RatesTable />
                </div>
              )}
            </div>

            {config.goldWidget.enabled && (
              <div id="zlato" className="flex flex-col">
                <h2 className="text-3xl font-bold mb-3 tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">{config.goldWidget.title}</span>
                </h2>
                <p className={`${styles.textSecondary} mb-8 text-sm font-medium`}>Cena zlata u realnom vremenu</p>
                <div className={`${styles.bgCard} rounded-2xl p-4 border ${styles.border} ${styles.shadow} flex-1 flex items-center justify-center`} style={{ minHeight: '440px' }}>
                  <div id="zlato-widget-frame" className="w-full h-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Gold Widget Mobile */}
      {config.goldWidget.enabled && (
        <section className="py-12 px-4 lg:hidden">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-500">{config.goldWidget.title}</span>
            </h2>
            <div className={`${styles.bgCard} rounded-2xl p-4 border ${styles.border} ${styles.shadow}`}>
              <div id="zlato-widget-frame-mobile" style={{ width: '100%' }}></div>
            </div>
          </div>
        </section>
      )}

      {/* USLUGE */}
      <section className={`py-20 sm:py-28 px-4 ${styles.bgSecondary}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${styles.gradientFrom} ${styles.gradientTo}`}>Naše usluge</span>
          </h2>
          
          <div className="relative">
            <button onClick={prevSlide} className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 ${styles.bgCard} border ${styles.border} rounded-full flex items-center justify-center ${styles.shadowHover} transition-all hover:scale-110`}>
              <ChevronLeft className="h-5 w-5 text-[#2d9cdb]" />
            </button>
            <button onClick={nextSlide} className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 ${styles.bgCard} border ${styles.border} rounded-full flex items-center justify-center ${styles.shadowHover} transition-all hover:scale-110`}>
              <ChevronRight className="h-5 w-5 text-[#2d9cdb]" />
            </button>

            <div className="overflow-hidden mx-14">
              <div className="flex transition-transform duration-500 ease-out gap-6" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {usluge.map((usluga, index) => (
                  <div key={index} className={`group min-w-full sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] ${styles.bgCard} rounded-2xl p-8 border ${styles.border} ${styles.shadow} ${styles.shadowHover} transition-all duration-300 hover:-translate-y-1 cursor-pointer`}>
                    <h3 className={`text-xl font-semibold mb-4 ${styles.text} group-hover:text-[#2d9cdb] transition-colors`}>{usluga.naslov}</h3>
                    <p className={`${styles.textMuted} leading-relaxed`}>{usluga.opis}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {[...Array(Math.ceil(usluge.length / 3))].map((_, i) => (
                <button key={i} onClick={() => setCurrentSlide(i)} className={`w-2 h-2 rounded-full transition-all ${currentSlide === i ? 'bg-[#2d9cdb] w-6' : `${isLight ? 'bg-stone-300' : 'bg-white/20'} hover:${isLight ? 'bg-stone-400' : 'bg-white/40'}`}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RECENZIJE */}
      {config.recenzije.length > 0 && (
        <section className="py-20 sm:py-28 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${styles.gradientFrom} ${styles.gradientTo}`}>Šta kažu naši klijenti</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.recenzije.map((recenzija, index) => (
                <div key={index} className={`${styles.bgCard} rounded-2xl p-8 border ${styles.border} ${styles.shadow} ${styles.shadowHover} transition-all duration-300 hover:-translate-y-1`}>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (<Star key={i} className={`h-4 w-4 ${i < recenzija.ocena ? 'text-amber-400 fill-amber-400' : isLight ? 'text-stone-300' : 'text-stone-700'}`} />))}
                  </div>
                  <p className={`${styles.textMuted} mb-6 italic leading-relaxed`}>"{recenzija.tekst}"</p>
                  <p className="font-semibold text-[#2d9cdb]">{recenzija.ime}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* KONTAKT */}
      <section id="kontakt" className={`py-20 sm:py-28 px-4 ${styles.bgSecondary}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${styles.gradientFrom} ${styles.gradientTo}`}>Kontakt</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className={`${styles.bgCard} rounded-2xl p-8 border ${styles.border} ${styles.shadow}`}>
              <h3 className="text-xl font-semibold mb-8">Informacije</h3>
              <div className="space-y-6">
                <a href={config.kontakt.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                  <div className={`w-12 h-12 rounded-xl ${styles.accentLight} flex items-center justify-center shrink-0 group-hover:bg-[#2d9cdb]/20 transition-colors`}>
                    <MapPin className="h-5 w-5 text-[#2d9cdb]" />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-[#2d9cdb] transition-colors">Adresa</p>
                    <p className={`${styles.textMuted} text-sm`}>{config.kontakt.adresa}, {config.kontakt.grad}</p>
                  </div>
                </a>
                <a href={`tel:${config.kontakt.telefon}`} className="flex items-start gap-4 group">
                  <div className={`w-12 h-12 rounded-xl ${styles.accentLight} flex items-center justify-center shrink-0 group-hover:bg-[#2d9cdb]/20 transition-colors`}>
                    <Phone className="h-5 w-5 text-[#2d9cdb]" />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-[#2d9cdb] transition-colors">Telefon</p>
                    <p className={`${styles.textMuted} text-sm`}>{config.kontakt.telefon}</p>
                  </div>
                </a>
                <a href={`mailto:${config.kontakt.email}`} className="flex items-start gap-4 group">
                  <div className={`w-12 h-12 rounded-xl ${styles.accentLight} flex items-center justify-center shrink-0 group-hover:bg-[#2d9cdb]/20 transition-colors`}>
                    <Mail className="h-5 w-5 text-[#2d9cdb]" />
                  </div>
                  <div>
                    <p className="font-medium group-hover:text-[#2d9cdb] transition-colors">Email</p>
                    <p className={`${styles.textMuted} text-sm`}>{config.kontakt.email}</p>
                  </div>
                </a>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${styles.accentLight} flex items-center justify-center shrink-0`}>
                    <Clock className="h-5 w-5 text-[#2d9cdb]" />
                  </div>
                  <div>
                    <p className="font-medium">Radno vreme</p>
                    <p className={`${styles.textMuted} text-sm`}>Pon-Pet: {config.radnoVreme.ponPet}</p>
                    <p className={`${styles.textMuted} text-sm`}>Subota: {config.radnoVreme.subota}</p>
                    <p className={`${styles.textMuted} text-sm`}>Nedelja: {config.radnoVreme.nedelja}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.bgCard} rounded-2xl overflow-hidden border ${styles.border} ${styles.shadow} min-h-[420px]`}>
              <iframe src={`https://maps.google.com/maps?q=${encodeURIComponent(config.kontakt.adresa)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} className="w-full h-full min-h-[420px]" style={{ border: 0 }} allowFullScreen loading="lazy" title="Mapa" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-10 px-4 ${styles.bg} border-t ${styles.border}`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <span className="text-2xl font-bold text-[#2d9cdb] tracking-tight">{config.logo.tip === 'tekst' ? config.logo.tekst : <img src={config.logo.slikaUrl} alt="Logo" className="h-16 w-auto" />}</span>
          <div className="text-center sm:text-right">
            <p className={`${styles.textMuted} text-sm`}>© {config.osnovno.godina} {config.osnovno.naziv}. Sva prava zadržana.</p>
            <p className={`${styles.textMuted} text-xs mt-1`}>Licenca NBS: {config.osnovno.licenca}</p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        .animate-blink { animation: blink 1s infinite; }
        @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient { animation: gradient 3s ease infinite; background-size: 200% 200%; }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${isLight ? '#d6d3d1' : 'rgba(255,255,255,0.1)'}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${isLight ? '#a8a29e' : 'rgba(255,255,255,0.2)'}; }
        
        /* Selection */
        ::selection { background: #2d9cdb; color: white; }
      `}</style>
    </div>
  );
}
