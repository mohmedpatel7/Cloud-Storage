"use client";

import React, { useEffect, useState } from "react";

const Loader = () => {
  const [heights, setHeights] = useState([38, 41, 44]);
  const maxHeights = [38, 41, 44];
  const minHeight = 5;

  useEffect(() => {
    let currentIndex = 0;

    const interval = setInterval(() => {
      setHeights((prev) => {
        const newHeights = [...prev];
        newHeights[currentIndex] =
          prev[currentIndex] === minHeight
            ? maxHeights[currentIndex]
            : minHeight;
        currentIndex = (currentIndex + 1) % 3;
        return newHeights;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex space-x-2">
        {heights.map((height, index) => (
          <div
            key={index}
            className="bg-blue-400 w-[5px] rounded transition-all duration-300"
            style={{ height }}
          />
        ))}
      </div>
    </div>
  );
};

export default Loader;
