// import { Container, Graphics, Text } from "@pixi/react";
import { FillGradient, TextStyle } from "pixi.js";
import { useEffect, useRef, useState } from "react";

type Props = {
  x: number;
  y: number;
};

export default function PlayerSeat({ x, y }: Props) {
  const cardcontainerref = useRef<any>(null);

  const gradient = new FillGradient({
    type: "linear",
    colorStops: [
      { offset: 0, color: "gold" },
      { offset: 0.4, color: 0xffffff },
      // { offset: 0.5, color: 0xffffff },
      { offset: 1, color: "gold" },
    ],
  });

  return (
    <pixiContainer x={x} y={y} anchor={0.5}>
      {/* Avatar Circle */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.circle(0, 0, 80);
          g.fill("rgb(67, 12, 20)").stroke({ width: 4, fill: gradient });
        }}
      />

      {/* Player Name */}
      <pixiText
        text="Player"
        y={45}
        anchor={0.5}
        style={
          new TextStyle({
            fill: "white",
            fontSize: 14,
          })
        }
      />

      {/* Cards */}
      <pixiGraphics
        ref={cardcontainerref}
        x={cardcontainerref.current ? -cardcontainerref.current.width / 2 : -20}
        y={70}
        draw={(g) => {
          g.clear();
          g.roundRect(0, 0, 35, 50, 5);
          g.roundRect(40 * 1, 0, 35, 50, 5);
          g.roundRect(40 * 2, 0, 35, 50, 5);
          g.roundRect(40 * 3, 0, 35, 50, 5);
          g.fill(0xffffff);
        }}
      />
    </pixiContainer>
  );
}
