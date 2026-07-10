import { useEffect, useState } from "react";

interface LeafProps {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: string;
  type: string;
}

function FallingLeaves() {
  const [leaves, setLeaves] = useState<LeafProps[]>([]);

  useEffect(() => {
    // Generate 22 leaf items
    const generatedLeaves: LeafProps[] = Array.from({ length: 22 }).map((_, idx) => {
      const sizeNum = Math.floor(Math.random() * 16) + 10; // 10px to 25px
      const delayNum = Math.random() * 15; // 0s to 15s delay
      const durationNum = Math.random() * 15 + 12; // 12s to 27s duration
      const types = ["emerald", "mint", "forest", "white"];
      const type = types[Math.floor(Math.random() * types.length)];

      return {
        id: idx,
        left: `${Math.random() * 100}vw`,
        delay: `${delayNum}s`,
        duration: `${durationNum}s`,
        size: `${sizeNum}px`,
        type,
      };
    });

    setLeaves(generatedLeaves);
  }, []);

  return (
    <div className="falling-leaves-container">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className={`leaf ${leaf.type}`}
          style={{
            left: leaf.left,
            animationDelay: leaf.delay,
            animationDuration: leaf.duration,
            width: leaf.size,
            height: leaf.size,
          }}
        />
      ))}
    </div>
  );
}

export default FallingLeaves;
