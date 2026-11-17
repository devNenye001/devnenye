import { brand } from '../config/brand'

export type FormKind = 'order' | 'review'
export type SubmitResult = 'sent' | 'whatsapp' | 'redirect' | 'saved'

const whatsappLink = (text: string) =>
  `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(text)}`

/**
 * Delivers a form to whichever channel is configured in config/brand.ts.
 * With nothing configured the submission is kept in this browser so nothing is lost
 * during development, and a console warning flags the missing setup.
 */
export async function submitForm(
  kind: FormKind,
  data: Record<string, string>,
  summary: string,
): Promise<SubmitResult> {
  if (kind === 'order' && brand.orderUrl) {
    window.open(brand.orderUrl, '_blank', 'noopener')
    return 'redirect'
  }
  if (kind === 'order' && brand.whatsappNumber) {
    window.open(whatsappLink(summary), '_blank', 'noopener')
    return 'whatsapp'
  }
  if (brand.formEndpoint) {
    const res = await fetch(brand.formEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ kind, ...data }),
    })
    if (!res.ok) throw new Error(`Form endpoint responded ${res.status}`)
    return 'sent'
  }

  console.warn(
    `[Oyegonu] No ${kind} channel configured — set whatsappNumber, orderUrl or formEndpoint in src/config/brand.ts.`,
  )
  try {
    const key = `oyegonu:${kind}s`
    const list = JSON.parse(localStorage.getItem(key) ?? '[]') as unknown[]
    list.push({ ...data, at: new Date().toISOString() })
    localStorage.setItem(key, JSON.stringify(list))
  } catch {
    /* storage unavailable — nothing else to do */
  }
  return 'saved'
}

export const isOrderChannelConfigured = () =>
  Boolean(brand.orderUrl || brand.whatsappNumber || brand.formEndpoint)
