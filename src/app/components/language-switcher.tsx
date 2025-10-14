'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { translateText } from '@/lib/translate';
import PageLoader from './layout/PageLoader';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'ur', label: 'Urdu' },
  { code: 'ar', label: 'Arabic' },
  { code: 'es', label: 'Spanish' },
];

// 🧠 Words or phrases you NEVER want translated
const BRAND_WORDS = ['Scan Sehati', 'Scan Sehati', 'Scan Sehati'];

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [loading, setLoading] = useState(true);

  // ✅ Restore saved language
  useEffect(() => {
    const savedLang = localStorage.getItem('lang') || 'en';
    setCurrentLang(savedLang);

    const init = async () => {
      if (savedLang !== 'en') {
        await translateWholePage(savedLang);
      }
      setLoading(false);
    };

    init();
  }, []);

  // 🔥 Core translation logic
  const translateWholePage = async (langCode: string) => {
    setLoading(true);

    try {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      let node;
      while ((node = walker.nextNode())) {
        const text = node.textContent?.trim();
        if (text && text.length > 1 && !/^\s*$/.test(text)) {
          // ⛔ Skip brand names
          const isBrand = BRAND_WORDS.some((b) =>
            text.toLowerCase().includes(b.toLowerCase())
          );
          if (!isBrand) textNodes.push(node as Text);
        }
      }

      for (const node of textNodes.slice(0, 100)) {
        const original = node.textContent!;
        const translated = await translateText(original, langCode);
        node.textContent = translated;
      }
    } catch (err) {
      console.error('Translation failed:', err);
      alert('Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 🧭 Handle language switching
  const handleLanguageChange = async (langCode: string) => {
    if (langCode === currentLang) {
      alert('Please select a different language.');
      return;
    }

    setCurrentLang(langCode);
    localStorage.setItem('lang', langCode);

    if (langCode === 'en') {
      // ✅ Restore English version directly (don’t translate)
      setLoading(true);
      location.reload();
      return;
    }

    await translateWholePage(langCode);
  };

  return (
    <>
      {/* ✅ Loader overlay (shows during initial load & translation) */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm flex-col">
          <PageLoader />
          <div className="animate-pulse">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-green-400 rounded-full animate-[ping_1.5s_ease-in-out_infinite]" />
          <div className="absolute w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full opacity-75 animate-[heartBeat_1.5s_ease-in-out_infinite]" />
        </div>
        <div className="mt-4 text-white text-center">
          Translating...
        It may take a while for the first time...
          <br />
        Please don’t close or refresh the page!
          </div>
        </div>
      )}

      {/* 🌐 Language Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size="icon" disabled={loading} aria-label="Change Language" >
            <Languages className="h-5 w-5 " />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {LANGS.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={lang.code === currentLang ? 'font-bold bg-white/10' : ''}
            >
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
