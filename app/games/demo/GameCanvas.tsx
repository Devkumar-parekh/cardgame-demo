"use client";

import { Application } from "@pixi/react";
import { useRef, useEffect, useState } from "react";
import GameScene from "./GameScene";

export default function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    setSize({
      width: window.visualViewport?.width || window.innerWidth,
      height: window.visualViewport?.height || window.innerHeight,
    });
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;

      setSize({
        width,
        height: height || 300,
      });
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      {size.width > 0 && size.height > 0 && (
        <Application
          width={size.width}
          height={size.height}
          backgroundAlpha={0}
          antialias
          autoDensity
          resolution={window.devicePixelRatio || 1}
        >
          <GameScene width={size.width} height={size.height} />
        </Application>
      )}
    </div>
  );
}
