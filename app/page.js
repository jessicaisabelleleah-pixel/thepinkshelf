import { createClient } from "@supabase/supabase-js";
import ProductGrid from "./ProductGrid";

// Rigenera la pagina ogni 30 secondi: le nuove offerte pubblicate su
// Telegram compaiono sul sito senza bisogno di un deploy manuale
export const revalidate = 30;

async function getProducts() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("posted_at", { ascending: false });

  if (error) {
    console.error("Errore nel caricamento prodotti:", error);
    return [];
  }
  return data;
}

export default async function Home() {
  const products = await getProducts();
  return (
    <main>
      <ProductGrid products={products} />
    </main>
  );
}
