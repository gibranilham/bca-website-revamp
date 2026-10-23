// One catalog powers the landing-page selection and the comparison route.
// Names 9–16 follow the current Figma text until their product labels are verified.
export const creditCards = [
  ["BCA Singapore Airlines KrisFlyer Visa Signature", "krisflyer-visa-signature.png", "travel", "Populer"],
  ["BCA Singapore Airlines KrisFlyer Visa Invinite", "krisflyer-visa-infinite.png", "travel", ""],
  ["BCA tiket.com Mastercard", "tiket-mastercard.png", "travel", "Cashback Terbanyak"],
  ["BCA Everyday Card", "everyday-card.png", "reward", ""],
  ["BCA Card Platinum", "bca-card-platinum.png", "reward", "Populer"],
  ["BCA Blibli Mastercard", "blibli-mastercard.png", "lifestyle", ""],
  ["BCA Mastercard Black", "mastercard-black.png", "reward", "Limit Tertinggi"],
  ["BCA Visa Batman", "visa-batman.png", "lifestyle", ""],
  ["BCA Card Platinum", "figma-card-9.png", "reward", "Populer"],
  ["BCA Blibli Mastercard", "figma-card-10.png", "lifestyle", ""],
  ["BCA Mastercard Black", "figma-card-11.png", "reward", "Limit Tertinggi"],
  ["BCA Visa Batman", "figma-card-12.png", "lifestyle", ""],
  ["BCA Card Platinum", "figma-card-13.png", "reward", "Populer"],
  ["BCA Blibli Mastercard", "figma-card-14.png", "lifestyle", ""],
  ["BCA Mastercard Black", "figma-card-15.png", "reward", "Limit Tertinggi"],
  ["BCA Visa Batman", "figma-card-16.png", "lifestyle", ""],
].map(([name, image, category, badge], index) => ({ id: index + 1, name, image, category, badge }));

export function getComparedCards(value) {
  if (typeof value !== "string") return [];
  const ids = value.split(",").map((part) => Number(part));
  if (ids.length < 2 || ids.length > 3 || ids.some((id) => !Number.isInteger(id))) return [];
  if (new Set(ids).size !== ids.length) return [];
  const cards = ids.map((id) => creditCards.find((card) => card.id === id));
  return cards.every(Boolean) ? cards : [];
}
