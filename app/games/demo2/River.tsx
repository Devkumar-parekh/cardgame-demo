// import { Container, Graphics, Text } from "@pixi/react";
import { useApplication } from "@pixi/react";
import { FillGradient, TextStyle } from "pixi.js";
import { useEffect, useRef, useState } from "react";

type Props = {
  x: number;
  y: number;
  cardtype: string;
  fill: string;
};

export default function River({ x, y, cardtype, fill }: Props) {
  // import { TextStyle, FillGradient } from "pixi.js";

  const riverRef = useRef<any>(null);
  const textgradient = new FillGradient({
    type: "linear",
    colorStops: [
      // { offset: 0, color: 0xff0000 },
      // { offset: 0, color: fill },

      { offset: 0.1, color: 0xffffff },
      // { offset: 0.4, color: fill },
      { offset: 0.3, color: 0xffffff },
      // { offset: 1, color: 0xffff00 },
      { offset: 1, color: fill },
    ],
  });
  const bordergradient = new FillGradient({
    type: "linear",
    colorStops: [
      // { offset: 0, color: 0xff0000 },
      { offset: 0, color: fill },

      { offset: 0.1, color: 0xffffff },
      // { offset: 0.4, color: fill },
      { offset: 0.5, color: 0xffffff },
      // { offset: 1, color: 0xffff00 },
      { offset: 1, color: fill },
    ],
  });

  const bggradient = new FillGradient({
    type: "linear",
    colorStops: [
      // { offset: 0, color: 0xff0000 },
      { offset: 0.1, color: 0x000000 },
      // { offset: 1, color: 0xffff00 },
      { offset: 0.4, color: fill + "cc" },
      { offset: 0.8, color: 0x000000 },
      { offset: 1, color: 0x000000 },
    ],
  });

  const radialBg = new FillGradient({
    type: "radial",

    center: { x: 0.5, y: 0.5 },
    innerRadius: 0.85,
    outerCenter: { x: 0.5, y: 0.85 },
    outerRadius: 0.5,
    colorStops: [
      // { offset: 0, color: 0xff0000 },
      // { offset: 0.1, color: 0x000000 },
      // { offset: 1, color: 0xffff00 },
      { offset: 0, color: fill },
      // { offset: 0.8, color: 0x000000 },
      { offset: 1, color: 0x000000 },
    ],
  });

  const style = new TextStyle({
    fontFamily: "Arial",
    fontSize: 30,
    fontWeight: "bold",

    fill: textgradient,

    stroke: {
      color: 0x000000,
      width: 4,
    },

    dropShadow: {
      color: 0x000000,
      blur: 4,
      distance: 3,
    },
  });
  return (
    <pixiContainer ref={riverRef} x={x} y={y}>
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.rect(0, 0, 200, 830);
          // g.fill(bggradient).stroke({ width: 3, fill: bordergradient });
          g.fill(radialBg).stroke({ width: 3, fill: bordergradient });
          // g.fill(0xffff66).stroke({ width: 3, color: "blue" });
        }}
      />

      <pixiText
        text={cardtype}
        x={riverRef.current?.width / 2}
        y={20}
        anchor={0.5}
        style={
          style
          // new TextStyle({
          //   fill: fill,
          //   fontSize: 14,
          // })
        }
      />
    </pixiContainer>
  );
}
