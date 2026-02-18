/**
 * SearchBox — Header smart search with typeahead & keyboard navigation
 *
 * Behaviour:
 *  - On focus / open (q < 3):  fetch /api/search/top        → show "Çok Arananlar"
 *  - On keystroke   (q >= 3):  fetch /api/search/suggest?q= → show suggestions
 *  - Debounce 250 ms, AbortController per request
 *  - Max 3 results shown
 *  - Keyboard: ↑ ↓ navigate, Enter → product page, Esc → close
 *  - Click-outside closes
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, TrendingUp } from 'lucide-react';

interface Suggestion {
  slug: string;
  title: string;
  price: number;
  currency: string;
  primaryImageUrl: string | null;
}

const MAX_RESULTS = 3;
const DEBOUNCE_MS = 250;

export const SearchBox: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isTopResults, setIsTopResults] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Fetch helpers ───────────────────────────────────────────────────────
  const fetchTop = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    try {
      const res = await fetch('/api/search/top', { signal: abortRef.current.signal });
      const data = await res.json();
      setResults((data.data ?? data).slice(0, MAX_RESULTS));
      setIsTopResults(true);
    } catch (e: any) {
      if (e.name !== 'AbortError') setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSuggest = useCallback(async (q: string) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    try {
      const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(q)}&limit=${MAX_RESULTS}`, {
        signal: abortRef.current.signal,
      });
      const data = await res.json();
      setResults((data.data ?? data).slice(0, MAX_RESULTS));
      setIsTopResults(false);
    } catch (e: any) {
      if (e.name !== 'AbortError') setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Input change with debounce ──────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (val.length === 0) {
      debounceRef.current = setTimeout(() => fetchTop(), DEBOUNCE_MS);
    } else if (val.length >= 3) {
      debounceRef.current = setTimeout(() => fetchSuggest(val), DEBOUNCE_MS);
    } else {
      // 1-2 chars: clear results but stay open
      setResults([]);
      setLoading(false);
    }
  };

  // ─── Focus: open + load top ───────────────────────────────────────────────
  const handleFocus = () => {
    setOpen(true);
    if (query.length < 3) fetchTop();
  };

  // ─── Keyboard navigation ─────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        navigate(`/product/${results[activeIndex].slug}`);
        close();
      } else if (query.trim()) {
        navigate(`/collection?q=${encodeURIComponent(query.trim())}`);
        close();
      }
    } else if (e.key === 'Escape') {
      close();
    }
  };

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const clear = () => {
    setQuery('');
    setResults([]);
    setActiveIndex(-1);
    inputRef.current?.focus();
    fetchTop();
  };

  // ─── Click outside ───────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ─── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const showDropdown = open && (loading || results.length > 0 || (query.length >= 3 && !loading));

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* ── Input row ─────────────────────────────────────────────────────── */}
      <div
        className={`flex items-center h-11 bg-white border rounded-full transition-shadow overflow-hidden
          ${open ? 'border-[var(--primary-coral)] ring-2 ring-[var(--primary-coral)]/20 shadow-md' : 'border-gray-200 shadow-sm hover:shadow-md'}`}
      >
        {/* Search icon */}
        <span className="flex-shrink-0 flex items-center justify-center w-11 h-11 text-gray-400">
          {loading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Search className="w-4 h-4" />
          }
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          type="search"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder="Ürün, koleksiyon ara..."
          aria-label="Ürün ara"
          aria-expanded={open}
          aria-autocomplete="list"
          className="flex-1 min-w-0 h-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400
            focus:outline-none leading-none py-0 border-none outline-none [appearance:textfield]
            [&::-webkit-search-decoration]:hidden [&::-webkit-search-cancel-button]:hidden"
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); clear(); }}
            className="flex-shrink-0 flex items-center justify-center w-8 h-8 mr-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Temizle"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Submit button */}
        <button
          type="button"
          onClick={() => {
            if (query.trim()) {
              navigate(`/collection?q=${encodeURIComponent(query.trim())}`);
              close();
            }
          }}
          className="flex-shrink-0 flex items-center justify-center w-9 h-9 mr-1 bg-[var(--brand-black)] text-white rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Ara"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Dropdown panel ───────────────────────────────────────────────── */}
      {showDropdown && (
        <div
          className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          role="listbox"
        >
          {/* Label */}
          <div className="flex items-center gap-1.5 px-4 pt-3 pb-2">
            <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {isTopResults ? 'Çok Arananlar' : 'Öneriler'}
            </span>
          </div>

          {/* Loading */}
          {loading && results.length === 0 && (
            <div className="flex items-center justify-center py-6 text-gray-400 text-sm gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Aranıyor...
            </div>
          )}

          {/* No results */}
          {!loading && query.length >= 3 && results.length === 0 && (
            <div className="text-center py-6 text-sm text-gray-400">
              "<span className="font-medium text-gray-600">{query}</span>" için sonuç bulunamadı.
            </div>
          )}

          {/* Results */}
          {results.map((item, idx) => (
            <button
              key={item.slug}
              role="option"
              aria-selected={idx === activeIndex}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseDown={(e) => {
                e.preventDefault();
                navigate(`/product/${item.slug}`);
                close();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                ${idx === activeIndex ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
            >
              {/* Image */}
              <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                {item.primaryImageUrl ? (
                  <img
                    src={item.primaryImageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                <p className="text-sm font-bold text-[var(--primary-coral)] mt-0.5">
                  {item.price.toLocaleString('tr-TR')}
                  {item.currency === 'TRY' ? '₺' : item.currency}
                </p>
              </div>

              {/* Arrow */}
              <span className="flex-shrink-0 text-gray-300 text-xs">→</span>
            </button>
          ))}

          {/* Footer hint */}
          {!loading && results.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-50 text-xs text-gray-400 text-center">
              Enter ile seç · ↑↓ gezin · Esc kapat
            </div>
          )}
        </div>
      )}
    </div>
  );
};
