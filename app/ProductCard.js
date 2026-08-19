export default function ProductCard({ product, view }) {
  const isList = view === "list";

  return (
    <article
      className={
        isList
          ? "flex gap-4 py-5 items-start"
          : "flex flex-col bg-white/50 border border-ink/10 hover:border-rose/50 transition-colors"
      }
    >
      <div
        className={
          isList
            ? "relative w-20 h-20 shrink-0 bg-dusty/40 overflow-hidden"
            : "relative aspect-[4/3] bg-dusty/40 overflow-hidden"
        }
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30 text-xs font-body text-center px-2">
            Nessuna immagine
          </div>
        )}
        {product.price && (
          <span className="price-tag absolute top-2 right-2 bg-ink text-blush text-xs px-2 py-1">
            €{product.price}
          </span>
        )}
      </div>

      <div className={isList ? "flex-1 min-w-0" : "p-4 flex flex-col flex-1"}>
        <h3 className="font-display text-lg leading-tight text-ink line-clamp-2">{product.title}</h3>
        {product.description && (
          <p className="mt-2 text-sm text-ink/60 font-body line-clamp-2">{product.description}</p>
        )}
        <a
          href={product.amazon_url}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="mt-4 inline-flex w-fit items-center gap-2 text-xs uppercase tracking-wider text-rose border-b border-rose pb-0.5 hover:gap-3 transition-all"
        >
          Vedi su Amazon →
        </a>
      </div>
    </article>
  );
}
