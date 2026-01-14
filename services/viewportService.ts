// Viewport height management for mobile devices
// Handles dynamic height changes when keyboard appears/disappears

class ViewportService {
  private static instance: ViewportService;
  private currentHeight: number = window.innerHeight;
  private listeners: ((height: number) => void)[] = [];

  private constructor() {
    this.init();
  }

  static getInstance(): ViewportService {
    if (!ViewportService.instance) {
      ViewportService.instance = new ViewportService();
    }
    return ViewportService.instance;
  }

  private init() {
    let debounceTimer: number;

    // Debounced update function to prevent excessive updates
    const debouncedUpdate = (height: number) => {
      clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        if (height !== this.currentHeight) {
          this.currentHeight = height;
          this.notifyListeners(height);
        }
      }, 100); // 100ms debounce
    };

    // Enhanced height update with multiple measurement attempts
    const updateHeight = () => {
      // Try multiple measurements for stability
      setTimeout(() => {
        let height = window.visualViewport ? window.visualViewport.height : window.innerHeight;

        // Additional measurement after a short delay for keyboard transitions
        setTimeout(() => {
          const secondHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
          // Use the larger height (keyboard hidden state)
          height = Math.max(height, secondHeight);
          debouncedUpdate(height);
        }, 150);
      }, 50);
    };

    // Use visualViewport API if available (better for mobile)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateHeight);
      window.visualViewport.addEventListener('scroll', updateHeight);

      // Initial height
      this.currentHeight = window.visualViewport.height;
    } else {
      // Fallback to window resize for older browsers
      window.addEventListener('resize', updateHeight);
      this.currentHeight = window.innerHeight;
    }

    // Add orientation change listener (important for mobile)
    window.addEventListener('orientationchange', () => {
      // Delay update after orientation change
      setTimeout(updateHeight, 200);
    });

    // Add keyboard event listeners for better keyboard handling
    const handleFocus = () => setTimeout(updateHeight, 300); // Delay for keyboard animation
    const handleBlur = () => setTimeout(updateHeight, 500);  // Longer delay for keyboard hide

    // Listen for input focus/blur events
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    // Listen for window focus events (app switching)
    window.addEventListener('focus', updateHeight);
    window.addEventListener('blur', updateHeight);
  }

  private notifyListeners(height: number) {
    this.listeners.forEach(listener => listener(height));
  }

  getHeight(): number {
    return this.currentHeight;
  }

  subscribe(listener: (height: number) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Get CSS custom property value for dynamic height
  getCSSHeight(): string {
    return `${this.currentHeight}px`;
  }
}

export const viewportService = ViewportService.getInstance();
