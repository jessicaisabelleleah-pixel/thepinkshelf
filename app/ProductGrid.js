"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

function formatShelfLabel(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

  if (isSameDay(date, today)) return "Oggi";
  if (isSameDay(date, yesterday)) return "Ieri";
  return date.toLocaleDateString("it-IT", { day: "numeric", month: "long" });
}

export default function ProductGrid({ products }) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("grid");

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(
      (p) => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    );
  }, [products, query]);

  const shelves = useMemo(() => {
    const groups = new Map();
    for (const product of filtered) {
      const label = formatShelfLabel(product.posted_at);
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(product);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8">
      <header className="pt-14 pb-10 md:pt-20 md:pb-14">
        <p className="shelf-label text-rose text-sm tracking-[0.25em] uppercase mb-3">
          Offerte selezionate ogni giorno
        </p>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.95] text-ink">
          The Pink Shelf
        </h1>
        <p className="mt-4 max-w-xl text-ink/70 font-body text-base md:text-lg">
          Uno scaffale digitale con le offerte Amazon scelte a mano sul canale Telegram, aggiornato in automatico.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca tra le offerte..."
          className="w-full sm:max-w-sm px-4 py-3 border border-ink/20 bg-white/60 font-body text-sm placeholder:text-ink/40 focus:outline-none focus:border-rose transition-colors"
        />
        <div className="flex gap-2 self-start sm:self-auto" role="group" aria-label="Cambia visualizzazione">
          <button
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-body border transition-colors ${
              view === "grid" ? "bg-ink text-blush border-ink" : "border-ink/20 text-ink/60"
            }`}
          >
            Griglia
          </button>
          <button
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-body border transition-colors ${
              view === "list" ? "bg-ink text-blush border-ink" : "border-ink/20 text-ink/60"
            }`}
          >
            Elenco
          </button>
        </div>
      </div>

      {shelves.length === 0 && (
        <p className="text-ink/50 font-body py-20 text-center">
          Ancora nessuna offerta qui. Pubblica un prodotto con un link Amazon nel canale Telegram per vederlo comparire.
        </p>
      )}

      {shelves.map(([label, items]) => (
        <section key={label} className="mb-14">
          <div className="shelf-divider pt-3 mb-6 flex items-baseline justify-between">
            <h2 className="shelf-label text-lg md:text-xl text-ink">{label}</h2>
            <span className="price-tag text-xs text-ink/40">{items.length} offerte</span>
          </div>

          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col divide-y divide-ink/10"
            }
          >
            {items.map((product) => (
              <ProductCard key={product.id} product={product} view={view} />
            ))}
          </div>
        </section>
      ))}

      <footer className="border-t border-ink/10 mt-16 py-8 text-xs text-ink/50 font-body leading-relaxed">
        <p>
          In qualità di Affiliato Amazon, ThePinkShelf riceve un guadagno dagli acquisti idonei effettuati
          tramite i link presenti su questo sito.
        </p>
      </footer>
    </div>
  );
}
