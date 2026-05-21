import React, { useState, useRef, useContext, createContext } from "react";

const MouseCtx = createContext<boolean>(false);

function Layer({
  children,
  z,
  className,
}: {
  children: React.ReactNode;
  z: number;
  className?: string;
}) {
  const entered = useContext(MouseCtx);
  return (
    <div
      className={`transition-transform duration-200 ease-linear ${className ?? ""}`}
      style={{
        transform: entered ? `translateZ(${z}px)` : "translateZ(0px)",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

export default function HeroCard({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / 18;
    const y = (e.clientY - r.top - r.height / 2) / 18;
    ref.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const onLeave = () => {
    setEntered(false);
    if (ref.current) ref.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <MouseCtx.Provider value={entered}>
      <div style={{ perspective: "1000px" }} className={className}>
        <div
          ref={ref}
          style={{ transformStyle: "preserve-3d" }}
          className="relative aspect-[4/4.3] max-[960px]:aspect-[4/2.6] transition-transform duration-200 ease-linear"
          onMouseMove={onMove}
          onMouseEnter={() => setEntered(true)}
          onMouseLeave={onLeave}
        >
          {/* imagen — layer medio */}
          <Layer z={35} className="absolute inset-0 rounded-[20px] overflow-hidden">
            <img
              src="/hero.webp"
              alt="Mati Sanabria"
              className="w-full h-full object-cover object-top select-none"
              draggable={false}
              loading="eager"
              decoding="async"
            />
          </Layer>

          {/* texto — layer frontal */}
          <Layer
            z={80}
            className="absolute left-7 right-7 bottom-7 font-serif italic text-[clamp(56px,9vw,96px)] leading-[0.9] tracking-[-0.04em] text-ink text-balance pointer-events-none"
          >
            Mati
            <br />
            <span className="text-[color-mix(in_oklab,var(--color-ink)_25%,transparent)]">
              Sanabria
            </span>
          </Layer>
        </div>
      </div>
    </MouseCtx.Provider>
  );
}
