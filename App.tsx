import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import Toolbar from './components/Toolbar';
import PreviewCard from './components/PreviewCard';
import { DEFAULT_MARKDOWN, THEMES } from './constants';
import { insertSpaceInMarkdown } from './services/textUtils';
import { polishMarkdown } from './services/geminiService';
import { TypographyConfig } from './types';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [themeIndex, setThemeIndex] = useState<number>(0);
  const [typography, setTypography] = useState<TypographyConfig>({
    fontSize: 'base',
    lineHeight: 'loose'
  });
  
  // Ref for the DOM element we want to capture
  const previewRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEMES[themeIndex];

  const handleAutoSpace = useCallback(() => {
    const newText = insertSpaceInMarkdown(markdown);
    setMarkdown(newText);
  }, [markdown]);

  const handleAIPolish = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const polished = await polishMarkdown(markdown);
      setMarkdown(polished);
    } catch (error) {
      alert("AI Processing failed. Please check your API Key configuration.");
    } finally {
      setIsProcessing(false);
    }
  }, [markdown, isProcessing]);

  const handleExport = useCallback(async () => {
    if (previewRef.current === null) {
      return;
    }

    try {
      // 1. Temporarily remove transform scale to capture at full resolution
      const originalTransform = previewRef.current.style.transform;
      previewRef.current.style.transform = 'scale(1)';

      const dataUrl = await toPng(previewRef.current, { 
        cacheBust: true, 
        pixelRatio: 2, // Retina quality
        backgroundColor: 'transparent',
        // CRITICAL: Skip embedding fonts to avoid "Cannot access rules" (CORS) errors with Google Fonts
        skipFonts: true,
        // Filter out external stylesheets/iframes to further prevent CORS errors
        filter: (node) => {
          // Ensure we are dealing with an Element node
          if (node.nodeType !== 1) {
            return true; 
          }
          const el = node as HTMLElement;
          if (el.tagName === 'LINK' && (el as HTMLLinkElement).rel === 'stylesheet') {
            return false;
          }
          if (el.tagName === 'IFRAME' || el.tagName === 'SCRIPT') {
             return false;
          }
          return true;
        }
      });

      // 2. Restore transform
      previewRef.current.style.transform = originalTransform;

      // 3. Download
      const link = document.createElement('a');
      link.download = `orca-insta-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to generate image. Please try again.');
    }
  }, [previewRef]);

  const handleThemeChange = (themeId: string) => {
    const idx = THEMES.findIndex(t => t.id === themeId);
    if (idx !== -1) {
      setThemeIndex(idx);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Toolbar 
        onAutoSpace={handleAutoSpace}
        onAIPolish={handleAIPolish}
        onExport={handleExport}
        isProcessing={isProcessing}
        onThemeChange={handleThemeChange}
        currentThemeId={currentTheme.id}
        themes={THEMES}
        typography={typography}
        setTypography={setTypography}
      />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Editor Pane */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-gray-200 bg-white z-10">
          <textarea
            className="w-full h-full p-6 resize-none focus:outline-none font-mono text-sm leading-6 text-gray-700 bg-transparent"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Type your markdown here..."
            spellCheck={false}
          />
        </div>

        {/* Preview Pane - Improved Layout for Long Images */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full bg-gray-100 overflow-y-auto overflow-x-hidden relative flex flex-col items-center">
            <div className="my-auto py-12 w-full flex justify-center">
              <PreviewCard 
                ref={previewRef} 
                content={markdown} 
                theme={currentTheme}
                typography={typography}
                scale={1} // Base scale
              />
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;