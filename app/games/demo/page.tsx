"use client";

import GameCanvas from "./GameCanvas";

// import GameCanvas from "@/components/game/GameCanvas";

export default function GamePage() {
  return (
    // <div className="w-full min-h-[100dvh]  flex items-center justify-center overflow-hidden">
    <div className="w-full min-h-[100dvh]  flex items-center justify-center overflow-hidden">
      {/* <div className="w-full max-w-[1100px] aspect-[16/9]"> */}
      <div className="w-full max-w-[1100px]">
        <GameCanvas />
      </div>
    </div>
  );
}
