// src/App.tsx
import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { useLorenzAttractor } from "./audio/useLorenzAttractor";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [started, setStarted] = useState(false);

  const { attractors, update } = useLorenzAttractor(3); // Three attractors for CMY

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["cyan", "magenta", "yellow"];

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      update(); // mutate attractors in place

      attractors.forEach((a, i) => {
        const x = ((a.x + 30) / 60) * canvas.width;
        const y = (a.z / 50) * canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = colors[i];
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    if (started) {
      setTimeout(() => {
        draw();
      }, 100);
    }
  }, [started]);

  return (
    <>
      {!started && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white z-20">
          <h1 className="text-3xl font-bold mb-4">Lorenz Synth</h1>
          <button
            onClick={async () => {
              await Tone.start();
              setStarted(true);
            }}
            className="bg-white text-black font-medium px-6 py-3 rounded hover:bg-gray-200 transition"
          >
            Tap to Start Audio
          </button>
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full block" />
    </>
  );
}
