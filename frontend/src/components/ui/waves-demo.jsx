import React from "react";
import { Waves } from "./waves-background";

function WavesDemo() {
  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-green-50/80 to-blue-100/80 rounded-lg overflow-hidden border shadow-lg">
      <div className="absolute inset-0">
        <Waves
          lineColor="rgba(34, 197, 94, 0.4)"
          backgroundColor="transparent"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>

      <div className="relative z-10 p-8 h-full flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Interactive Waves
        </h3>
        <p className="text-gray-600 mb-4">
          Move your mouse to interact with the waves
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• Perlin noise-based wave generation</p>
          <p>• Mouse interaction with physics</p>
          <p>• Customizable parameters</p>
          <p>• Smooth animations using requestAnimationFrame</p>
        </div>
      </div>
    </div>
  );
}

export { WavesDemo };
