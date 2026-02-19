import { useRef, useEffect, useState } from 'react';

export const Cursor = () => {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const rp = useRef({ x: -100, y: -100 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Pas de curseur personnalisé sur mobile

    const mm = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
      }
    };
    
    window.addEventListener("mousemove", mm as unknown as EventListener);
    
    let raf: number;
    const tick = () => {
      rp.current.x += (pos.current.x - rp.current.x) * .11;
      rp.current.y += (pos.current.y - rp.current.y) * .11;
      if (ring.current) {
        ring.current.style.transform = `translate(calc(${rp.current.x}px - 50%), calc(${rp.current.y}px - 50%))`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const addBig = (e: Event) => { 
      const target = e.target as Element;
      if (target?.closest?.("a,button,[data-h]")) {
        ring.current?.classList.add("big");
      }
    };
    
    const rmBig = (e: Event) => { 
      const target = e.target as Element;
      if (target?.closest?.("a,button,[data-h]")) {
        ring.current?.classList.remove("big");
      }
    };
    
    document.addEventListener("mouseenter", addBig, true);
    document.addEventListener("mouseleave", rmBig, true);
    
    return () => { 
      window.removeEventListener("mousemove", mm as unknown as EventListener); 
      cancelAnimationFrame(raf); 
      document.removeEventListener("mouseenter", addBig, true);
      document.removeEventListener("mouseleave", rmBig, true);
    };
  }, [isMobile]);

  if (isMobile) return null; // Rien sur mobile

  return (
    <>
      <div ref={ring} className="ring" />
      <div ref={dot} className="dot" />
    </>
  );
};