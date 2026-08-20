export default function ProductCard({ product, view }) {
  const isList = view === "list";

  return (
    <article
      className={
        isList
          ? "flex gap-4 p-3 items-start bg-white/70 rounded-3xl border-2 border-dusty cozy-shadow transition-all hover:-translate-y-0.5"
          : "flex flex-col bg-white/70 rounded-3xl border-2 border-dusty cozy-shadow transition-all hover:-translate-y-1 overflow-hidden"
      }
    >
      <div
        className={
          isList
            ? "relative w-20 h-20 shrink-0 bg-dusty/50 overflow-hidden rounded-2xl"
            : "relative aspect-[4/3] bg-dusty/50 overflow-hidden"
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
            ✦ nessuna foto
          </div>
        )}
        {product.price && (
          <span className="price-tag absolute top-2 right-2 bg-rose text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm rotate-3">
            €{product.price}
          </span>
        )}
      </div>

      <div className={isList ? "flex-1 min-w-0 pr-2" : "p-4 flex flex-col flex-1"}>
        <h3 className="font-display font-bold text-lg leading-tight text-ink line-clamp-2">{product.title}</h3>
        {product.description && (
          <p className="mt-2 text-sm text-ink/60 font-body line-clamp-2">{product.description}</p>
        )}
        <a
          href={product.amazon_url}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="mt-4 inline-flex w-fit items-center gap-1 text-xs font-bold text-white bg-rose px-4 py-2 rounded-full hover:bg-rose/90 transition-colors"
        >
          Vedi su Amazon ⋆
        </a>
      </div>
    </article>
  );
}
