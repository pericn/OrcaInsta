import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Toolbar from './components/Toolbar';
import PreviewCard from './components/PreviewCard';
import { BottomBar } from './components/BottomBar';
import { DEFAULT_MARKDOWN, THEMES } from './constants';
import { insertSpaceInMarkdown } from './services/textUtils';
import { StorageService } from './services/storageService';
import { TypographyConfig } from './types';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [themeIndex, setThemeIndex] = useState<number>(0);
  const [typography, setTypography] = useState<TypographyConfig>({
    fontSize: 'base',
    lineHeight: 'loose'
  });

  // Mobile Layout State
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview'>('editor');

  // Ref for the DOM element we want to capture
  const previewRef = useRef<HTMLDivElement>(null);

  const currentTheme = THEMES[themeIndex];

  // Load saved data on component mount
  useEffect(() => {
    const savedData = StorageService.loadData();
    if (savedData) {
      setMarkdown(savedData.markdown);

      // Restore theme if saved
      if (savedData.themeId) {
        const savedThemeIndex = THEMES.findIndex(t => t.id === savedData.themeId);
        if (savedThemeIndex !== -1) {
          setThemeIndex(savedThemeIndex);
        }
      }

      // Restore typography if saved
      if (savedData.typography) {
        setTypography({
          fontSize: savedData.typography.fontSize || 'base',
          lineHeight: savedData.typography.lineHeight || 'loose'
        });
      }
    }
  }, []);

  // Auto-save content changes
  useEffect(() => {
    StorageService.autoSave({
      markdown,
      themeId: currentTheme.id,
      typography: {
        ...typography,
        fontFamily: 'sans' // Default for now
      }
    });
  }, [markdown, currentTheme.id, typography]);

  // Clear content handler
  const handleClearContent = useCallback(() => {
    if (window.confirm('确定要清除所有内容吗？此操作无法撤销。')) {
      setMarkdown('');
      StorageService.saveMarkdown(''); // Immediately save empty content
    }
  }, []);

  // Standard change handler - no auto-formatting while typing to avoid cursor jumping
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  // Auto-format when the user finishes editing (on blur)
  const handleBlur = () => {
    setMarkdown((prev) => insertSpaceInMarkdown(prev));
  };

  const handleExport = useCallback(async () => {
    if (previewRef.current === null) {
      return;
    }
    
    // Ensure text is formatted before export
    setMarkdown((prev) => insertSpaceInMarkdown(prev));
    // Small delay to allow React to render the formatted text before capturing
    await new Promise(resolve => setTimeout(resolve, 50));

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
        // Ignore resources that fail to load (e.g. blocked images) so export still finishes
        // @ts-expect-error - skipOnError exists in library but missing in types
        skipOnError: true,
        // Filter out iframes/scripts but ALLOW stylesheets to ensure background styles are captured
        filter: (node) => {
          // Ensure we are dealing with an Element node
          if (node.nodeType !== 1) {
            return true; 
          }
          const el = node as HTMLElement;
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
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Toolbar
        onExport={handleExport}
        onThemeChange={handleThemeChange}
        currentThemeId={currentTheme.id}
        themes={THEMES}
        typography={typography}
        setTypography={setTypography}
        activeMobileTab={activeMobileTab}
        onTabChange={setActiveMobileTab}
        onClearContent={handleClearContent}
      />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative pb-20 md:pb-0">
        {/* Editor Pane */}
        <div className={`
          w-full md:w-1/2 h-full flex flex-col border-b md:border-b-0 md:border-r border-gray-200 bg-white z-10
          ${activeMobileTab === 'editor' ? 'flex' : 'hidden md:flex'}
        `}>
          <textarea
            className="w-full h-full p-6 resize-none focus:outline-none font-mono text-sm leading-6 text-gray-700 bg-transparent"
            value={markdown}
            onChange={handleTextChange}
            onBlur={handleBlur}
            placeholder="Type your markdown here..."
            spellCheck={false}
          />
        </div>

        {/* Preview Pane - Improved Layout for Long Images */}
        <div className={`
          w-full md:w-1/2 h-full bg-gray-100 overflow-y-auto overflow-x-hidden relative flex flex-col items-center
          ${activeMobileTab === 'preview' ? 'flex' : 'hidden md:flex'}
        `}>
            <div className="my-auto w-full flex justify-center">
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

      {/* Mobile Bottom Bar */}
      <BottomBar
        activeTab={activeMobileTab}
        onTabChange={setActiveMobileTab}
        onExport={handleExport}
        onClearContent={handleClearContent}
      />
    </div>
  );
};

export default App;
