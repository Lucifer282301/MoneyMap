//  Convert currency to its smallest unit for safe database storage
export function convertToCents(amount: number) {
  return Math.round(amount * 100);
}

// Convert the stored smallest unit back to currency format
export function convertToDollarUnit(amount: number) {
  return amount / 100;
}

// Format a numeric amount into a localized USD currency string
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
