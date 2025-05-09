
// Simple confetti effect for milestone achievements
// This is a wrapper around canvas-confetti if available
// It fails gracefully if the library is not available

export interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: {
    x?: number;
    y?: number;
  };
  colors?: string[];
  angle?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  shapes?: ('square' | 'circle')[];
  scalar?: number;
  zIndex?: number;
  disableForReducedMotion?: boolean;
}

// We're creating a wrapper that will try to use canvas-confetti if available,
// but won't break the app if it's not
export const confetti = (options: ConfettiOptions = {}): Promise<void> => {
  try {
    // Try to dynamically import canvas-confetti
    return import('canvas-confetti').then(confettiModule => {
      const confetti = confettiModule.default || confettiModule;
      
      // Default options for a nice effect
      const defaultOptions: ConfettiOptions = {
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [
          '#26ccff', '#a25afd', '#ff5e7e',
          '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'
        ],
        disableForReducedMotion: true
      };
      
      // Merge default options with provided options
      const mergedOptions = { ...defaultOptions, ...options };
      
      // Run confetti with merged options
      return new Promise<void>((resolve) => {
        confetti(mergedOptions);
        setTimeout(resolve, 2000); // Resolve after animation is likely done
      });
    }).catch(error => {
      console.warn('Confetti effect unavailable:', error);
      return Promise.resolve(); // Resolve anyway to not break the app
    });
  } catch (error) {
    console.warn('Failed to load confetti module:', error);
    return Promise.resolve(); // Resolve anyway to not break the app
  }
};
