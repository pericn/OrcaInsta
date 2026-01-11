// React hook for dynamic viewport height management
import { useState, useEffect } from 'react';
import { viewportService } from '../services/viewportService';

export const useViewportHeight = () => {
  const [height, setHeight] = useState(viewportService.getHeight());

  useEffect(() => {
    const unsubscribe = viewportService.subscribe(setHeight);
    return unsubscribe;
  }, []);

  return height;
};
