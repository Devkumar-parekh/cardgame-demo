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
      { offset: 1, color: "gold" },
    ],
  });
  const topbargradient = new FillGradient({
    type: "linear",
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    colorStops: [
      { offset: 0, color: "rgb(29, 43, 57)" },
      { offset: 1, color: "#123" },
    ],
  });

  const maskRef = useRef<any>(null);

  const tablemask = useRef<any>(null);
  return (
    // <pixiContainer x={width / 2} y={height / 2} scale={scale}>
    <>
      <pixiContainer x={width / 2} y={height / 2} scale={scale}>
        <pixiGraphics
          ref={tablemask}
          draw={(g) => {
            g.clear();
            g.rect(-BASE_WIDTH / 2, -BASE_HEIGHT / 2, BASE_WIDTH, BASE_HEIGHT);
            g.fill("#123").stroke({ width: 2, fill: gradient });
          }}
        />
        <pixiContainer mask={tablemask.current}>
          {/* Table Background (centered world) */}
          <pixiGraphics
            ref={maskRef}
            x={-BASE_WIDTH * 0.4}
            y={BASE_HEIGHT / 2 - 175}
            draw={(g) => {
              g.clear();
              g.roundRect(
                0,
                -BASE_HEIGHT * 0.8,
                BASE_WIDTH * 0.8,
                BASE_HEIGHT * 0.8,
                355,
              )
                .fill("#123")
                .stroke({ width: 2, fill: gradient });
            }}
          />

          {/* Top */}
          <PlayerSeat x={-580} y={-280} />

          {/* Bottom */}
          <PlayerSeat x={-580} y={0} />

          {/* Left */}
          <PlayerSeat x={580} y={-280} />

          {/* Right */}
          <PlayerSeat x={580} y={0} />

          <pixiContainer ref={rivercontainer}>
            <pixiGraphics
              ref={maskRef}
              x={-BASE_WIDTH * 0.4}
              y={BASE_HEIGHT / 2 - 175}
              draw={(g) => {
                g.clear();
                g.roundRect(
                  0,
                  -BASE_HEIGHT * 0.8,
                  BASE_WIDTH * 0.8,
                  BASE_HEIGHT * 0.8,
                  355,
                ).fill("#123");
              }}
            />

            <pixiContainer
              mask={maskRef.current}
              x={-rivercontainer.current?.width / 2}
              // x={0}
              y={-rivercontainer.current?.height / 2}
            >
              <River
                x={0}
                y={-50}
                cardtype={"CLUBS"}
                fill={"#00ff00"}
                riverArr={[{}, {}, {}, {}, {}]} // Example riverArr with 5 cards
              />
              <River
                x={230 * 1}
                y={-50}
                cardtype={"SPADES"}
                fill={"#0000ff"}
                riverArr={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]} // Example riverArr with 5 cards
              />
              <River
                x={230 * 2}
                y={-50}
                cardtype={"HEARTS"}
                fill={"#ff0000"}
                riverArr={[{}, {}, {}]}
              />
              <River
                x={230 * 3}
                y={-50}
                cardtype={"DIAMONDS"}
                fill={"#930093"}
                riverArr={[{}, {}, {}, {}, {}, {}]}
              />
            </pixiContainer>
          </pixiContainer>
          <pixiContainer>
            <pixiGraphics
              draw={(g) => {
                g.rect(-BASE_WIDTH / 2, -BASE_HEIGHT / 2 - 2, BASE_WIDTH, 60);
                g.fill(topbargradient).stroke({
                  width: 3,
                  color: "rgb(7, 15, 23)",
                });
              }}
            />

            <pixiGraphics
              draw={(g) => {
                g.rect(-BASE_WIDTH / 2, -BASE_HEIGHT / 2 - 2, 60, 60);
                g.fill(topbargradient).stroke({
                  width: 3,
                  color: "rgb(7, 15, 23)",
                });
              }}
            />

            <pixiGraphics
              draw={(g) => {
                g.rect(BASE_WIDTH / 2 - 60, -BASE_HEIGHT / 2 - 2, 60, 60);
                g.fill(topbargradient).stroke({
                  width: 3,
                  color: "rgb(7, 15, 23)",
                });
              }}
            />

            <pixiGraphics
              draw={(g) => {
                g.rect(-130, -BASE_HEIGHT / 2 - 2, 260, 70);
                g.fill(topbargradient).stroke({
                  width: 3,
                  color: "rgb(7, 15, 23)",
                });
              }}
            />
          </pixiContainer>

          <pixiContainer x={-BASE_WIDTH * 0.4} y={265}>
            <pixiGraphics
              draw={(g) => {
                g.roundRect(0, 0, BASE_WIDTH * 0.8, BASE_HEIGHT * 0.18, 100);
                g.fill(topbargradient);
              }}
            />
            {Array(13)
              .fill(1)
              .map((_, i) => {
                // {[1, 2, 3, 4, 5, 6, 7].map((_, i) => {
                return (
                  <pixiGraphics
                    key={i}
                    draw={(g) => {
                      // let x = 20;

                      g.roundRect(i * 70 + 100, 30, 60, 70, 5)
                        .fill("white")
                        .stroke({ width: 1, color: "black" });
                    }}
                  />
                );
              })}
          </pixiContainer>
        </pixiContainer>
      </pixiContainer>
    </>
  );
}
