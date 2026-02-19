// src/hooks/useScrollTo.ts
export const useScrollTo = () => {
  return (id: string) => {
    if (id === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 72; // hauteur nav fixe
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };
};