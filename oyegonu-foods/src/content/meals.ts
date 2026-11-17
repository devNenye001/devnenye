export type MealKind = 'rice' | 'dodo' | 'yam' | 'beans' | 'bread'

export interface Meal {
  kind: MealKind
  name: string
  local?: string
  line: string
  /** Optional real photograph. When provided it replaces the illustrated plate. */
  photo?: string
}

/** Serving suggestions — classic Nigerian pairings for a red stew. */
export const meals: Meal[] = [
  {
    kind: 'rice',
    name: 'White Rice',
    local: 'Rice & stew',
    line: 'The Sunday classic. Spoon it over hot rice and Sunday comes early.',
  },
  {
    kind: 'dodo',
    name: 'Fried Plantain',
    local: 'Dodo',
    line: 'Sweet, caramel-edged plantain meets a spicy red stew. A pairing nobody argues about.',
  },
  {
    kind: 'yam',
    name: 'Boiled Yam',
    local: 'Isu',
    line: 'Soft, floury yam dragged through a pool of stew. Breakfast, lunch or dinner.',
  },
  {
    kind: 'beans',
    name: 'Beans',
    local: 'Ewa',
    line: 'Stir it through a pot of beans for a richer, redder, more spicy plate.',
  },
  {
    kind: 'bread',
    name: 'Bread',
    local: 'Agege-style',
    line: 'Tear, dip, repeat. The fastest proper meal there is.',
  },
]
