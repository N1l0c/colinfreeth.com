// src/pages/autobach.tsx
import React from "react";

export default function AutoBachPage() {
  return (
    <main className="w-full h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">AutoBach</h1>
      <iframe
        src="/AutoBach/index.html"
        className="w-full h-full border-0"
        title="AutoBach Visual Sequencer"
      />
    </main>
  );
}
