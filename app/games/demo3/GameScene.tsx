import { Container, FillGradient, Graphics, Text } from "pixi.js";
import { extend, useApplication } from "@pixi/react";
import PlayerSeat from "./PlayerSeat";
import River from "./River";
import { useRef } from "react";

extend({ Container, Graphics, Text });

type Props = {
  width: number;
  height: number;
};

export default function GameScene({ width, height }: Props) {
  // const BASE_WIDTH = 1200;
  const BASE_WIDTH = 1500;
  const BASE_HEIGHT = 850;
  // const BASE_HEIGHT = 850;

  const scale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);

  const rivercontainer = useRef<any>(null);

  const gradient = new FillGradient({
    type: "linear",
    colorStops: [
      { offset: 0, color: "gold" },
      { offset: 0.4, color: 0xffffff },
      // { offset: 0.5, color: 0xffffff },
      { offset: 1, color: "gold" },
    ],
  });

  const maskRef = useRef<any>(null);
  return (
    // <pixiContainer x={width / 2} y={height / 2} scale={scale}>
    <pixiContainer x={width / 2} y={height / 2} scale={scale}>
      {/* Table Background (centered world) */}
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.ellipse(
            // -BASE_WIDTH / 2,
            0,
            // -BASE_HEIGHT / 2,
            // 0,
            -(BASE_HEIGHT * 1) / 4,
            BASE_WIDTH / 2,
            (BASE_HEIGHT * 4) / 7,
          );
          // g.roundRect(
          //   -BASE_WIDTH / 2,
          //   -BASE_HEIGHT / 2,
          //   BASE_WIDTH,
          //   BASE_HEIGHT,
          //   60,
          // );
          g.fill("#123").stroke({ width: 2, fill: gradient });
          // g.fill(0x1b5e20);
        }}
      />

      {/* Top */}
      <PlayerSeat x={-580} y={-280} />

      {/* Bottom */}
      <PlayerSeat x={-580} y={280} />

      {/* Left */}
      <PlayerSeat x={580} y={-280} />

      {/* Right */}
      <PlayerSeat x={580} y={280} />
      {/* <pixiContainer
        ref={rivercontainer}
        x={-rivercontainer.current?.width / 2}
        // x={0}
        y={-rivercontainer.current?.height / 2}
      >
        <River x={0} y={0} cardtype={"CLUBS"} fill={"#00ff00"} />
        <River x={220 * 1} y={0} cardtype={"SPADES"} fill={"#0000ff"} />
        <River x={220 * 2} y={0} cardtype={"HEARTS"} fill={"#ff0000"} />
        <River x={220 * 3} y={0} cardtype={"DIAMONDS"} fill={"#930093"} />
      </pixiContainer> */}

      <pixiContainer ref={rivercontainer}>
        <pixiGraphics
          ref={maskRef}
          draw={(g) => {
            g.clear();
            g.ellipse(
              0,
              -(BASE_HEIGHT * 1) / 4,
              BASE_WIDTH / 2,
              (BASE_HEIGHT * 4) / 7,
            );
            g.fill("#123"); //.stroke({ width: 2, fill: gradient });
          }}
        />

        <pixiContainer
          mask={maskRef.current}
          x={-rivercontainer.current?.width / 2}
          // x={0}
          y={-rivercontainer.current?.height / 2}
        >
          <River x={0} y={0} cardtype={"CLUBS"} fill={"#00ff00"} />
          <River x={220 * 1} y={0} cardtype={"SPADES"} fill={"#0000ff"} />
          <River x={220 * 2} y={0} cardtype={"HEARTS"} fill={"#ff0000"} />
          <River x={220 * 3} y={0} cardtype={"DIAMONDS"} fill={"#930093"} />
        </pixiContainer>
      </pixiContainer>
    </pixiContainer>
  );
}
