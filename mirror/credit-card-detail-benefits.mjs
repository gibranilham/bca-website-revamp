import { renderCreditCardBenefits } from "./credit-card-benefits.mjs";

const benefits = [
  {
    key: "lounge",
    image: "detail-benefit-lounge-photo.png",
    mobileImage: "detail-benefit-mobile-lounge.png",
    title: "Premium Airport Lounge",
    description: "Akses Premium Airport Lounge, Berlaku 1x per tahun untuk pemegang kartu",
  },
  {
    key: "bali",
    image: "detail-benefit-bali-photo.png",
    mobileImage: "detail-benefit-mobile-bali.png",
    title: "Special Privileges Beautiful Bali",
    description: "Penawaran menarik untuk Hotel, Resort, Luxury Villa, Dining, & Lainnya",
  },
  {
    key: "starbucks",
    image: "detail-benefit-starbucks-photo.png",
    mobileImage: "detail-benefit-mobile-starbucks.png",
    title: "Starbuck Special Airport Treats",
    description: "Nikmati complimentary food/beverage sebanyak 12x per tahun di outlet Starbucks bandara keberangkatan seluruh Indonesia",
  },
];

export function renderCreditCardDetailBenefits() {
  return renderCreditCardBenefits({
    id: "detail-benefits",
    headingId: "cc-detail-benefits-title",
    items: benefits,
    eyebrow: "Keuntungan",
    heading: "Setiap Manfaat, Dirancang <br />untuk Anda",
    className: "cc-detail-benefits",
    staticMobile: true,
  });
}
