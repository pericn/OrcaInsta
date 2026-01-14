// React hook for dynamic viewport height management
import { useState, useEffect } from 'react';
import { viewportService, ViewportState } from '../services/viewportService';

export const useViewport = () => {
  const [state, setState] = useState<ViewportState>(viewportService.getState());

  useEffect(() => {
    const unsubscribe = viewportService.subscribe(setState);
    return unsubscribe;
  }, []);

  return state;
};

// Deprecated: Backwards compatibility if needed, but we should switch to useViewport
export const useViewportHeight = () => {
  const state = useViewport();
  return state.height;
};