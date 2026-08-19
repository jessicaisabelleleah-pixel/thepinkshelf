import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  extractLinks,
  findAmazonLink,
  extractPrice,
  extractTitle,
  cleanDescription,
} from "../../../lib/parseTelegramMessage";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

// Usa la service role key: solo questo endpoint può scrivere sulla tabella prodotti
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  return NextResponse.json({ ok: true, status: "Webhook ThePinkShelf attivo" });
}

export async function POST(request) {
  // Verifica che la richiesta arrivi davvero da Telegram
  const secret = request.headers.get("x-telegram-bot-api-secret-token");
  if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "non autorizzato" }, { status: 401 });
  }

  const update = await request.json();
  const post = update.channel_post || update.edited_channel_post;

  // Ignora tutto ciò che non è un post del canale (es. messaggi privati al bot)
  if (!post) {
    return NextResponse.json({ ok: true });
  }

  const text = post.caption || post.text || "";
  const entities = post.caption_entities || post.entities || [];
  const links = extractLinks(text, entities);
  const amazonUrl = findAmazonLink(links);

  // Se il post non contiene un link Amazon, non è un'offerta da pubblicare
  if (!amazonUrl) {
    return NextResponse.json({ ok: true, skipped: "nessun link Amazon trovato" });
  }

  let imageUrl = null;
  if (post.photo && post.photo.length > 0) {
    const bestPhoto = post.photo[post.photo.length - 1];
    imageUrl = await downloadAndStoreImage(bestPhoto.file_id, post.message_id);
  }

  const title = extractTitle(text);
  const description = cleanDescription(text, amazonUrl);
  const price = extractPrice(text);

  const { error } = await supabase.from("products").upsert(
    {
      telegram_message_id: post.message_id,
      title,
      description,
      amazon_url: amazonUrl,
      image_url: imageUrl,
      price,
      posted_at: new Date(post.date * 1000).toISOString(),
    },
    { onConflict: "telegram_message_id" }
  );

  if (error) {
    console.error("Errore salvataggio prodotto:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

async function downloadAndStoreImage(fileId, messageId) {
  try {
    const fileInfoRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
    );
    const fileInfo = await fileInfoRes.json();
    const filePath = fileInfo?.result?.file_path;
    if (!filePath) return null;

    const fileRes = await fetch(`https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`);
    const fileBuffer = await fileRes.arrayBuffer();

    const fileName = `${messageId}-${Date.now()}.jpg`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, Buffer.from(fileBuffer), {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error("Errore upload immagine su Supabase:", error);
      return null;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return data.publicUrl;
  } catch (err) {
    console.error("Errore durante il download dell'immagine da Telegram:", err);
    return null;
  }
}
