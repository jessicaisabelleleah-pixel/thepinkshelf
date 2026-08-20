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
      <header className="pt-14 pb-10 md:pt-20 md:pb-14 text-center">
        <p className="font-accent text-rose text-2xl mb-1">offerte carine ogni giorno ⋆</p>
        <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1] text-ink">
          The Pink Shelf 🎀
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-ink/70 font-body text-base md:text-lg">
          Il tuo scaffaletto di offerte Amazon scelte a mano, aggiornato in automatico dal canale Telegram.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-10">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 cerca tra le offerte..."
          className="w-full sm:max-w-sm px-5 py-3 rounded-full border-2 border-dusty bg-white/70 font-body text-sm placeholder:text-ink/40 focus:outline-none focus:border-rose transition-colors cozy-shadow"
        />
        <div className="flex gap-2 self-start sm:self-auto" role="group" aria-label="Cambia visualizzazione">
          <button
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            className={`px-5 py-2 rounded-full text-xs font-bold font-body transition-colors ${
              view === "grid" ? "bg-rose text-white" : "bg-white/70 text-ink/60 border-2 border-dusty"
            }`}
          >
            ⊞ Griglia
          </button>
          <button
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            className={`px-5 py-2 rounded-full text-xs font-bold font-body transition-colors ${
              view === "list" ? "bg-rose text-white" : "bg-white/70 text-ink/60 border-2 border-dusty"
            }`}
          >
            ☰ Elenco
          </button>
        </div>
      </div>

      {shelves.length === 0 && (
        <p className="text-ink/50 font-body py-20 text-center">
          Ancora nessuna offerta qui ⋆ Pubblica un prodotto con un link Amazon nel canale Telegram per vederlo comparire!
        </p>
      )}

      {shelves.map(([label, items]) => (
        <section key={label} className="mb-14">
          <div className="shelf-divider pt-4 mb-6 flex items-baseline justify-between">
            <h2 className="font-display font-bold text-lg md:text-xl text-ink">{label}</h2>
            <span className="font-accent text-base text-rose">{items.length} offerte</span>
          </div>

          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {items.map((product) => (
              <ProductCard key={product.id} product={product} view={view} />
            ))}
          </div>
        </section>
      ))}

      <footer className="mt-16 py-8 text-xs text-ink/50 font-body leading-relaxed text-center">
        <p>
          🎀 In qualità di Affiliato Amazon, ThePinkShelf riceve un guadagno dagli acquisti idonei effettuati
          tramite i link presenti su questo sito.
        </p>
      </footer>
    </div>
  );
}
