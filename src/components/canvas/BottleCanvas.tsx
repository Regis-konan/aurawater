import { useRef, useEffect } from 'react';

interface BottleCanvasProps {
  color?: string;
  size?: number;
  mouseX?: number;
  mouseY?: number;
}

export const BottleCanvas = ({ 
  color = "#1257F5", 
  size = 1, 
  mouseX = 0, 
  mouseY = 0 
}: BottleCanvasProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const t = useRef(0);
  const DPR = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

  const W = Math.round(130 * size);
  const H = Math.round(310 * size);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.scale(DPR, DPR);

    const cx = W / 2;

    const hex2rgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };
    
    const [cr, cg, cb] = hex2rgb(color);
    const rgba = (a: number) => `rgba(${cr},${cg},${cb},${a})`;

    let raf: number;
    
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t.current += .015;

      const capY = 8, capH = 22, capW = 36;
      const neckY = capY + capH, neckH = 24, neckTopW = 32, neckBotW = 58;
      const bodyY = neckY + neckH, bodyH = H - bodyY - 28, bodyW = 74, bodyX = cx - bodyW / 2;
      const bodyR = 16;
      const shadowY = H - 14;

      const sg = ctx.createRadialGradient(cx, shadowY, 2, cx, shadowY, bodyW * .7);
      sg.addColorStop(0, "rgba(18,87,245,.18)");
      sg.addColorStop(1, "rgba(18,87,245,0)");
      ctx.beginPath(); 
      ctx.ellipse(cx, shadowY, bodyW * .75, 9, 0, 0, Math.PI * 2);
      ctx.fillStyle = sg; 
      ctx.fill();

      const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y); 
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r); 
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h); 
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r); 
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      };

      const bg = ctx.createLinearGradient(bodyX, 0, bodyX + bodyW, 0);
      bg.addColorStop(0, rgba(.88));
      bg.addColorStop(.15, rgba(.42));
      bg.addColorStop(.45, rgba(.14));
      bg.addColorStop(.72, rgba(.18));
      bg.addColorStop(1, rgba(.72));
      roundRect(bodyX, bodyY, bodyW, bodyH, bodyR);
      ctx.fillStyle = bg; 
      ctx.fill();

      ctx.save();
      roundRect(bodyX, bodyY, bodyW, bodyH, bodyR);
      ctx.clip();

      const waterTop = bodyY + bodyH * .42;
      const waveH = 7;
      const wg = ctx.createLinearGradient(0, waterTop, 0, bodyY + bodyH);
      wg.addColorStop(0, rgba(.32));
      wg.addColorStop(.5, rgba(.18));
      wg.addColorStop(1, rgba(.08));

      ctx.beginPath();
      ctx.moveTo(bodyX, waterTop + waveH);
      const segs = 6;
      for (let i = 0; i <= segs; i++) {
        const px = bodyX + (i / segs) * bodyW;
        const py = waterTop + Math.sin((i / segs) * Math.PI * 2 + t.current * 1.4) * waveH * .6;
        ctx.lineTo(px, py);
      }
      ctx.lineTo(bodyX + bodyW, bodyY + bodyH);
      ctx.lineTo(bodyX, bodyY + bodyH);
      ctx.closePath();
      ctx.fillStyle = wg; 
      ctx.fill();

      ctx.beginPath();
      for (let i = 0; i <= segs; i++) {
        const px = bodyX + (i / segs) * bodyW;
        const py = waterTop + Math.sin((i / segs) * Math.PI * 2 + t.current * 1.4) * waveH * .6;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.strokeStyle = rgba(.5); 
      ctx.lineWidth = 1.5; 
      ctx.stroke();

      [[bodyX + 12, waterTop + 20], [cx, waterTop + 40], [bodyX + bodyW - 14, waterTop + 28]].forEach(([bx, by], i) => {
        const br = 2.5 + Math.sin(t.current * 1.2 + i) * 1;
        ctx.beginPath(); 
        ctx.arc(bx, by + Math.sin(t.current * .8 + i) * 6, br, 0, Math.PI * 2);
        ctx.fillStyle = rgba(.3); 
        ctx.fill();
      });
      ctx.restore();

      const eg = ctx.createLinearGradient(bodyX, 0, bodyX + bodyW, 0);
      eg.addColorStop(0, "rgba(255,255,255,0)");
      eg.addColorStop(.06, "rgba(255,255,255,.04)");
      eg.addColorStop(.94, "rgba(255,255,255,.04)");
      eg.addColorStop(1, "rgba(255,255,255,0)");
      roundRect(bodyX, bodyY, bodyW, bodyH, bodyR);
      ctx.fillStyle = eg; 
      ctx.fill();

      const hg = ctx.createLinearGradient(bodyX, bodyY, bodyX + 16, bodyY);
      hg.addColorStop(0, "rgba(255,255,255,.55)");
      hg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.save();
      roundRect(bodyX, bodyY, bodyW, bodyH, bodyR);
      ctx.clip();
      ctx.fillStyle = hg;
      ctx.fillRect(bodyX, bodyY + 20, 20, bodyH - 40);
      ctx.restore();

      const rg = ctx.createLinearGradient(bodyX + bodyW - 16, 0, bodyX + bodyW, 0);
      rg.addColorStop(0, "rgba(0,0,0,0)");
      rg.addColorStop(1, "rgba(0,0,0,.08)");
      ctx.save();
      roundRect(bodyX, bodyY, bodyW, bodyH, bodyR);
      ctx.clip();
      ctx.fillStyle = rg; 
      ctx.fillRect(bodyX, bodyY, bodyW, bodyH);
      ctx.restore();

      const lx = bodyX + 8, ly = bodyY + bodyH * .22, lw = bodyW - 16, lh = bodyH * .3;
      ctx.save();
      roundRect(bodyX, bodyY, bodyW, bodyH, bodyR);
      ctx.clip();
      ctx.fillStyle = "rgba(255,255,255,.09)";
      ctx.fillRect(lx, ly, lw, lh);
      ctx.font = `italic 400 ${Math.round(18 * size)}px 'Playfair Display',Georgia,serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255,255,255,.95)";
      ctx.fillText("AURA", cx, ly + lh * .46);
      ctx.fillStyle = rgba(.35);
      ctx.fillRect(cx - 14, ly + lh * .58, 28, 1);
      ctx.font = `400 ${Math.round(5.5 * size)}px 'Plus Jakarta Sans',sans-serif`;
      ctx.fillStyle = rgba(.65);
      ctx.fillText("PURE ALPINE", cx, ly + lh * .76);
      ctx.restore();

      roundRect(bodyX, bodyY, bodyW, bodyH, bodyR);
      ctx.strokeStyle = rgba(.35); 
      ctx.lineWidth = 1; 
      ctx.stroke();

      ctx.beginPath();
      const nTopX = cx - neckTopW / 2, nBotX = cx - neckBotW / 2;
      ctx.moveTo(nTopX, neckY);
      ctx.lineTo(nBotX, neckY + neckH);
      ctx.lineTo(nBotX + neckBotW, neckY + neckH);
      ctx.lineTo(nTopX + neckTopW, neckY);
      ctx.closePath();
      const ng2 = ctx.createLinearGradient(nTopX, 0, nTopX + neckTopW, 0);
      ng2.addColorStop(0, rgba(.8));
      ng2.addColorStop(.3, rgba(.3));
      ng2.addColorStop(.7, rgba(.2));
      ng2.addColorStop(1, rgba(.65));
      ctx.fillStyle = ng2; 
      ctx.fill();
      ctx.strokeStyle = rgba(.3); 
      ctx.lineWidth = .8; 
      ctx.stroke();

      const capX = cx - capW / 2;
      ctx.save();
      roundRect(capX, capY, capW, capH, 7);
      ctx.clip();
      const cg2 = ctx.createLinearGradient(capX, capY, capX + capW, capY + capH);
      cg2.addColorStop(0, rgba(.95));
      cg2.addColorStop(.4, rgba(.75));
      cg2.addColorStop(1, rgba(.55));
      ctx.fillStyle = cg2; 
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.25)";
      ctx.fillRect(capX, capY, capW, capH * .38);
      ctx.restore();
      roundRect(capX, capY, capW, capH, 7);
      ctx.strokeStyle = rgba(.45); 
      ctx.lineWidth = .8; 
      ctx.stroke();

      ctx.beginPath(); 
      ctx.rect(capX + 2, capY + capH - 5, capW - 4, 5);
      ctx.fillStyle = rgba(.55); 
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };
    
    draw();
    return () => cancelAnimationFrame(raf);
  }, [W, H, color, DPR, size]);

  return (
    <canvas
      ref={ref}
      style={{
        width: W,
        height: H,
        transform: `perspective(900px) rotateY(${mouseX * 20}deg) rotateX(${-mouseY * 12}deg)`,
        transition: "transform .08s linear",
        animation: "float 7s ease-in-out infinite",
        filter: "drop-shadow(0 20px 40px rgba(18,87,245,.25))",
      }}
    />
  );
};