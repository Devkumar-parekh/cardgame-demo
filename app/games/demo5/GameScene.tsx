"use client";
import { Container, FillGradient, Graphics, Matrix, Text } from "pixi.js";
import { extend, useApplication } from "@pixi/react";
import PlayerSeat from "./PlayerSeat";
import River from "./River";
import { useEffect, useRef } from "react";

let soundManager: any = null;
let isLoaded = false;

export const loadSounds = async () => {
  if (isLoaded) return;

  const { sound, filters } = await import("@pixi/sound");

  const stereo = new filters.StereoFilter(); // -1 = left, 1 = right
  const eq = new filters.EqualizerFilter(
    -40,
    -40,
    -39,
    -40,
    -25,
    -2,
    1,
    40,
    -27,
    -40,
  );

  // new PIXI.sound.filters.TelephoneFilter()
  soundManager = sound;

  soundManager.add("card", {
    url: "/audio/soundreality-sound-of-mouse-click-4-478760.mp3",

    volume: 0.05,
  });

  soundManager.add("bgm", {
    // url: "/audio/toucanmusic-casino-royale-442621.mp3",
    url: "/audio/musical.mp3",
    volume: 0.03,
    loop: true,
  });

  soundManager.filters = [stereo, eq];

  isLoaded = true;
};

export const playSFX = (name: string) => {
  soundManager?.play(name);
};

extend({ Container, Graphics, Text });

type Props = {
  width: number;
  height: number;
};

export default function GameScene({ width, height }: Props) {
  // // const BASE_WIDTH = 1200;
  // const BASE_WIDTH = 1500;
  // const BASE_HEIGHT = 850;
  const BASE_WIDTH = 1280;
  const BASE_HEIGHT = 590;
  // const BASE_HEIGHT = 850;

  const scale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);

  const rivercontainer = useRef<any>(null);

  const gradient = new FillGradient({
    type: "radial",

    colorStops: [
      // { offset: 0, color: "purple" },
      { offset: 0, color: "#6b0487" },
      { offset: 0.9, color: "#3f2148" },

      // { offset: 1, color: "purple" },
    ],
  });

  const maskRef = useRef<any>(null);

  const tablemask = useRef<any>(null);
  useEffect(() => {
    const init = async () => {
      await loadSounds();
      playSFX("bgm");
    };

    window.addEventListener("pointerdown", init, { once: true });

    return () => {
      window.removeEventListener("pointerdown", init);
      // stopBGM();
      soundManager?.stop("bgm");
    };
  }, []);

  const handleCardClick = () => {
    playSFX("card");
  };

  return (
    // <pixiContainer x={width / 2} y={height / 2} scale={scale}>
    <>
      <pixiContainer
        eventMode="static"
        onPointerDown={handleCardClick}
        x={width / 2}
        y={height / 2}
        scale={scale}
      >
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
            x={-BASE_WIDTH * 0.5}
            y={BASE_HEIGHT / 2}
            draw={(g) => {
              g.clear();
              g.rect(0, -BASE_HEIGHT, BASE_WIDTH, BASE_HEIGHT).fill(gradient);
            }}
          />

          <PlayerSeat x={-500} y={-200} />

          <PlayerSeat x={-500} y={200} />
          <pixiContainer x={-400} y={100}>
            <pixiGraphics
              draw={(graphics) => {
                graphics
                  .roundShape(
                    [
                      { x: 0, y: 0, radius: 300 },
                      { x: 1500, y: 0, radius: 30 },
                      { x: 1500, y: 200, radius: 30 },
                      { x: 150, y: 200, radius: 30 },
                    ],
                    10,
                  )
                  .fill({ color: "#25132b", alpha: 0.5 })
                  .stroke({ width: 15, color: "black" });
              }}
            />
            {Array(13)
              .fill(null)
              .map((_, i) => {
                return (
                  <pixiGraphics
                    key={i}
                    draw={(graphics) => {
                      graphics
                        .roundRect(i * 65 + 125, 50, 60, 80, 5)
                        .fill(`#ffffff55`)
                        .stroke({ width: 2, color: "black" });
                    }}
                  />
                );
              })}
          </pixiContainer>

          <PlayerSeat x={500} y={-200} />

          <PlayerSeat x={500} y={0} />

          <pixiContainer ref={rivercontainer} x={-400} y={-275}>
            <pixiGraphics
              draw={(graphics) => {
                graphics
                  .poly([
                    { x: 0, y: 0 },
                    { x: 175, y: 0 },
                    { x: 225, y: 350 },
                    // { x: 200, y: 150 },
                    { x: 50, y: 350 },
                  ])
                  .fill({ color: "#25132b55" });
              }}
            />
          </pixiContainer>
          <pixiContainer ref={rivercontainer} x={-215} y={-275}>
            <pixiGraphics
              draw={(graphics) => {
                graphics
                  .poly([
                    { x: 0, y: 0 },
                    { x: 175, y: 0 },
                    { x: 225, y: 350 },
                    // { x: 200, y: 150 },
                    { x: 50, y: 350 },
                  ])
                  .fill({ color: "#25132b55" });
              }}
            />
          </pixiContainer>
          <pixiContainer ref={rivercontainer} x={-30} y={-275}>
            <pixiGraphics
              draw={(graphics) => {
                graphics
                  .poly([
                    { x: 0, y: 0 },
                    { x: 175, y: 0 },
                    { x: 225, y: 350 },
                    // { x: 200, y: 150 },
                    { x: 50, y: 350 },
                  ])
                  .fill({ color: "#25132b55" });
              }}
            />
          </pixiContainer>
          <pixiContainer ref={rivercontainer} x={155} y={-275}>
            <pixiGraphics
              draw={(graphics) => {
                graphics
                  .poly([
                    { x: 0, y: 0 },
                    { x: 175, y: 0 },
                    { x: 225, y: 350 },
                    // { x: 200, y: 150 },
                    { x: 50, y: 350 },
                  ])
                  .fill({ color: "#25132b55" });
              }}
            />
          </pixiContainer>
        </pixiContainer>
      </pixiContainer>
    </>
  );
}
