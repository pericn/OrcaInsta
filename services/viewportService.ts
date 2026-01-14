// Viewport height management for mobile devices
// Handles dynamic height changes when keyboard appears/disappears

export interface ViewportState {
  height: number;
  width: number;
  offsetTop: number;
  offsetLeft: number;
}

class ViewportService {
  private static instance: ViewportService;
  private currentState: ViewportState = {
    height: window.visualViewport ? window.visualViewport.height : window.innerHeight,
    width: window.visualViewport ? window.visualViewport.width : window.innerWidth,
    offsetTop: window.visualViewport ? window.visualViewport.offsetTop : 0,
    offsetLeft: window.visualViewport ? window.visualViewport.offsetLeft : 0,
  };
  private listeners: ((state: ViewportState) => void)[] = [];

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
    const updateState = () => {
      if (window.visualViewport) {
        this.currentState = {
          height: window.visualViewport.height,
          width: window.visualViewport.width,
          offsetTop: window.visualViewport.offsetTop,
          offsetLeft: window.visualViewport.offsetLeft,
        };
      } else {
        this.currentState = {
          height: window.innerHeight,
          width: window.innerWidth,
          offsetTop: 0,
          offsetLeft: 0,
        };
      }
      this.notifyListeners();
    };

    // Use visualViewport API
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateState);
      window.visualViewport.addEventListener('scroll', updateState);
    }
    
    window.addEventListener('resize', updateState);
    window.addEventListener('scroll', updateState); // Window scroll also matters
    
    // Initial check
    updateState();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentState));
  }

  getState(): ViewportState {
    return this.currentState;
  }

  subscribe(listener: (state: ViewportState) => void): () => void {
    this.listeners.push(listener);
    listener(this.currentState);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export const viewportService = ViewportService.getInstance();
