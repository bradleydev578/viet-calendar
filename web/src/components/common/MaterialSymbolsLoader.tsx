"use client";

import { useEffect, useState } from "react";

export function MaterialSymbolsLoader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if already loaded
    const existingLink = document.querySelector(
      'link[href*="Material+Symbols+Outlined"]'
    );
    if (existingLink) {
      setLoaded(true);
      return;
    }

    // Create and load the stylesheet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
    link.onload = () => setLoaded(true);
    document.head.appendChild(link);

    return () => {
      // Cleanup not needed - keep the stylesheet loaded
    };
  }, []);

  return null;
}
