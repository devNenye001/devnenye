import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface CaseStudyState {
  slug: string | null;
  open: (slug: string) => void;
  close: () => void;
}

const Ctx = createContext<CaseStudyState>({ slug: null, open: () => {}, close: () => {} });

export function CaseStudyProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);
  const open = useCallback((s: string) => setSlug(s), []);
  const close = useCallback(() => setSlug(null), []);
  const value = useMemo(() => ({ slug, open, close }), [slug, open, close]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCaseStudy = () => useContext(Ctx);
