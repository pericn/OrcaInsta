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
    // Use visualViewport API if available (better for mobile)
    if (window.visualViewport) {
      const updateHeight = () => {
        const height = window.visualViewport!.height;
        if (height !== this.currentHeight) {
          this.currentHeight = height;
          this.notifyListeners(height);
        }
      };

      window.visualViewport.addEventListener('resize', updateHeight);
      window.visualViewport.addEventListener('scroll', updateHeight);

      // Initial height
      this.currentHeight = window.visualViewport.height;
    } else {
      // Fallback to window resize for older browsers
      const updateHeight = () => {
        const height = window.innerHeight;
        if (height !== this.currentHeight) {
          this.currentHeight = height;
          this.notifyListeners(height);
        }
      };

      window.addEventListener('resize', updateHeight);
      this.currentHeight = window.innerHeight;
    }
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
