// One catalog powers the landing-page selection and the comparison route.
// Product names follow the card artwork and the provided card-list reference.
export const creditCards = [
  ["BCA Singapore Airlines KrisFlyer Visa Signature", "krisflyer-visa-signature.png", "travel", "Populer"],
  ["BCA Singapore Airlines KrisFlyer Visa Infinite", "krisflyer-visa-infinite.png", "travel", ""],
  ["BCA tiket.com Mastercard", "tiket-mastercard.png", "travel", "Cashback Terbanyak"],
  ["BCA Everyday Card", "everyday-card.png", "reward", ""],
  ["BCA Card Platinum", "bca-card-platinum.png", "reward", "Populer"],
  ["BCA Blibli Mastercard", "blibli-mastercard.png", "lifestyle", ""],
  ["BCA Mastercard Black", "mastercard-black.png", "reward", "Limit Tertinggi"],
  ["BCA Visa Batman", "visa-batman.png", "lifestyle", ""],
  ["BCA Visa Black", "figma-card-9.png", "reward", "Populer"],
  ["BCA Singapore Airlines PPS Club", "figma-card-10.png", "lifestyle", ""],
  ["BCA Mastercard Globe", "figma-card-11.png", "reward", "Limit Tertinggi"],
  ["BCA Mastercard World", "figma-card-12.png", "lifestyle", ""],
  ["BCA JCB Black", "figma-card-13.png", "reward", "Populer"],
  ["BCA UnionPay", "figma-card-14.png", "lifestyle", ""],
  ["BCA American Express", "figma-card-15.png", "reward", "Limit Tertinggi"],
  ["BCA Kartu Kredit Indonesia", "figma-card-16.png", "lifestyle", ""],
].map(([name, image, category, badge], index) => ({ id: index + 1, name, image, category, badge }));

export function getComparedCards(value) {
  if (typeof value !== "string") return [];
  const ids = value.split(",").map((part) => Number(part));
  if (ids.length < 2 || ids.length > 3 || ids.some((id) => !Number.isInteger(id))) return [];
  if (new Set(ids).size !== ids.length) return [];
  const cards = ids.map((id) => creditCards.find((card) => card.id === id));
  return cards.every(Boolean) ? cards : [];
}
