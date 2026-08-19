// Riconosce i domini Amazon più comuni, inclusi i link brevi amzn.to / amzn.eu
const AMAZON_HOST_REGEX = /(amazon\.[a-z.]{2,7}|amzn\.to|amzn\.eu)/i;

// Emoji tipiche usate nei canali offerte, da togliere dal titolo
const EMOJI_REGEX = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu;

export function extractLinks(text, entities) {
  const links = [];
  if (!text) return links;

  if (entities && entities.length > 0) {
    for (const e of entities) {
      if (e.type === "text_link" && e.url) {
        links.push(e.url);
      } else if (e.type === "url") {
        links.push(text.slice(e.offset, e.offset + e.length));
      }
    }
  }

  // Rete di sicurezza: scansione diretta del testo nel caso Telegram
  // non mandi le entities (capita con alcuni client/bot terzi)
  const regexMatches = text.match(/https?:\/\/[^\s]+/g) || [];
  links.push(...regexMatches);

  return [...new Set(links)];
}

export function findAmazonLink(links) {
  return links.find((link) => AMAZON_HOST_REGEX.test(link)) || null;
}

export function extractPrice(text) {
  if (!text) return null;
  const match = text.match(/(\d{1,4}(?:[.,]\d{2})?)\s?€|€\s?(\d{1,4}(?:[.,]\d{2})?)/);
  if (!match) return null;
  const value = match[1] || match[2];
  return value ? value.replace(",", ".") : null;
}

export function extractTitle(text) {
  if (!text) return "Offerta ThePinkShelf";
  const firstLine = text.split("\n").find((line) => line.trim().length > 0);
  if (!firstLine) return "Offerta ThePinkShelf";
  const cleaned = firstLine.replace(EMOJI_REGEX, "").trim();
  return cleaned.slice(0, 140) || "Offerta ThePinkShelf";
}

export function cleanDescription(text, amazonUrl) {
  if (!text) return "";
  let cleaned = text;
  if (amazonUrl) cleaned = cleaned.split(amazonUrl).join("");

  return cleaned
    .replace(EMOJI_REGEX, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 500);
}
