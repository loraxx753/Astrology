import { useEffect } from 'react';

/**
 * Custom hook to set a dynamic page background using CSS variables
 * @param background - CSS background value (gradient, color, etc.)
 */
export const usePageBackground = (background: string) => {
  useEffect(() => {
    document.documentElement.style.setProperty('--page-background', background);
    
    return () => {
      // Reset to transparent when component unmounts
      document.documentElement.style.setProperty('--page-background', 'transparent');
    };
  }, [background]);
};

// Predefined background gradients for common themes
export const pageBackgrounds = {
  astrology: 'linear-gradient(to bottom right, #312e81, #581c87, #be185d)', // Purple gradient
  zodiac: 'linear-gradient(to bottom right, #eef2ff, #f3e8ff, #fdf2f8)', // Light gradient
  cosmic: 'linear-gradient(to bottom right, #0f172a, #1e1b4b, #581c87)', // Dark cosmic
  fire: 'linear-gradient(to bottom right, #dc2626, #ea580c, #f59e0b)', // Fire gradient
  earth: 'linear-gradient(to bottom right, #059669, #16a34a, #65a30d)', // Earth gradient  
  air: 'linear-gradient(to bottom right, #06b6d4, #0891b2, #0e7490)', // Air gradient
  water: 'linear-gradient(to bottom right, #2563eb, #1d4ed8, #1e3a8a)', // Water gradient
  default: 'transparent'
} as const;