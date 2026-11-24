import { formatPrice } from './format'

// A repair's price as users read it: "Free" for a price of 0, otherwise "EUR 35".
export function priceInWords(price: number): string {
  return price === 0 ? 'Free' : formatPrice(price)
}
