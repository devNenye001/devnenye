export interface Testimonial {
  quote: string
  name: string
  location?: string
  pairing?: string
}

/**
 * Verified customer reviews only.
 *
 * This list is intentionally empty: no real reviews were supplied, and we don't invent them.
 * While it's empty the Reviews section invites customers to share their own.
 * Add entries like:
 *   { quote: '…', name: 'First name L.', location: 'Lagos', pairing: 'White rice' }
 */
export const testimonials: Testimonial[] = []
