//  Convert currency to its smallest unit for safe database storage
export function convertToCents(amount: number) {
  return Math.round(amount * 100);
}

// Convert the stored smallest unit back to currency format
export function convertToDollarUnit(amount: number) {
  return amount / 100;
}
