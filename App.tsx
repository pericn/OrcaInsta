import React, { useState, useRef, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import Toolbar from './components/Toolbar';
import PreviewCard from './components/PreviewCard';
import { BottomBar } from './components/BottomBar';
import { FormatButton } from './components/FormatButton';
import { DEFAULT_MARKDOWN, THEMES } from './constants';
import { insertSpaceInMarkdown } from './services/textUtils';
import { StorageService } from './services/storageService';
import { TypographyConfig } from './types';
import { useViewport } from './hooks/useViewportHeight';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [themeIndex, setThemeIndex] = useState<number>(0);
  const [typography, setTypography] = useState<TypographyConfig>({
    fontSize: 'base',
    lineHeight: 'loose'
  });

  // Mobile Layout State
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isFocused, setIsFocused] = useState(false);

  // Dynamic viewport height for mobile keyboard handling
  const viewportState = useViewport();

  // Ref for the DOM element we want to capture
  const previewRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Formatting state
  const [formatError, setFormatError] = useState<string>('');

  const currentTheme = THEMES[themeIndex];

  // Helper to scroll cursor to view
  const scrollToCursor = useCallback(() => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const { selectionStart, value } = textarea;
    
    // Estimate line number (simple split)
    const lines = value.substring(0, selectionStart).split('\n');
    const lineNumber = lines.length;
    
    // Estimate line height (leading-6 is 24px)
    const lineHeight = 24; 
    const cursorY = lineNumber * lineHeight;
    
    // Target position: We want cursor to be roughly in the top 1/3 of the VISIBLE area
    // visible area is viewportHeight - ToolbarHeight (~56px)
    // But textarea scrolls internally.
    // So we just want to set scrollTop such that cursorY is at roughly 100px from top of textarea
    
    const targetScrollTop = Math.max(0, cursorY - 100);
    
    // Smooth scroll if supported, or instant
    textarea.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });
  }, []);

  // Monitor viewport height changes to re-adjust scroll if keyboard fully expands
  useEffect(() => {
    if (isFocused) {
      // Small delay to let layout settle
      const timer = setTimeout(scrollToCursor, 300);
      return () => clearTimeout(timer);
    }
  }, [viewportState.height, isFocused, scrollToCursor]);

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

  // Format text handler
  const handleFormatText = useCallback((formattedText: string) => {
    setMarkdown(formattedText);
    setFormatError(''); // Clear any previous errors
  }, []);

  // Format error handler
  const handleFormatError = useCallback((error: string) => {
    setFormatError(error);
    // Show error to user (you could also use a toast notification)
    alert(`格式化失败: ${error}`);
  }, []);

  // Standard change handler - no auto-formatting while typing to avoid cursor jumping
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  // Auto-format when the user finishes editing (on blur)
  const handleBlur = () => {
    setIsFocused(false);
    setMarkdown((prev) => insertSpaceInMarkdown(prev));
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Trigger scroll after keyboard likely opened
    setTimeout(scrollToCursor, 100);
    setTimeout(scrollToCursor, 400); // Retry after animation
  };

  const handleExport = useCallback(async () => {
    if (previewRef.current === null) {
      return;
    }

    // Ensure text is formatted before export
    setMarkdown((prev) => insertSpaceInMarkdown(prev));
    // Small delay to allow React to render the formatted text before capturing
    await new Promise(resolve => setTimeout(resolve, 50));

    // Get content div (The colored container)
    const contentDiv = previewRef.current.querySelector('.relative.flex.flex-col') as HTMLElement;
    
    if (!contentDiv) {
      console.error('Content div not found');
      return;
    }

    // Store original inline styles to restore later
    const originalBoxShadow = contentDiv.style.boxShadow;
    const originalMargin = contentDiv.style.margin;
    const originalBorder = contentDiv.style.border;

    try {
      // 1. SURGICAL DOM MANIPULATION
      // Remove shadow to prevent transparent bleed
      contentDiv.style.boxShadow = 'none';
      contentDiv.style.margin = '0';
      
      // Add a subtle physical border to define edges since shadow is gone
      const isLight = currentTheme.id.includes('light') || currentTheme.id.includes('paper');
      contentDiv.style.border = isLight ? '1px solid #e2e8f0' : '1px solid #334155'; // slate-200 or slate-700

      // 2. Calculate Scale for 1080px width
      const { offsetWidth, offsetHeight } = contentDiv;
      const targetWidth = 1080;
      const scale = targetWidth / offsetWidth;

      // 3. Export
      const dataUrl = await toPng(contentDiv, {
        cacheBust: true,
        width: targetWidth,
        height: offsetHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${offsetWidth}px`,
          height: `${offsetHeight}px`,
        },
        pixelRatio: 1, 
        // Remove backgroundColor override to let original theme colors (gradients/patterns) show
        skipFonts: true,
        // @ts-expect-error - skipOnError exists in library
        skipOnError: true,
        filter: (node) => {
          if (node.nodeType !== 1) return true;
          const el = node as HTMLElement;
          return !(el.tagName === 'IFRAME' || el.tagName === 'SCRIPT');
        }
      });

      // 4. Download
      const link = document.createElement('a');
      link.download = `orca-insta-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert('Failed to generate image. Please try again.');
    } finally {
      // 5. RESTORE DOM (Crucial!)
      if (contentDiv) {
        contentDiv.style.boxShadow = originalBoxShadow;
        contentDiv.style.margin = originalMargin;
        contentDiv.style.border = originalBorder;
      }
    }
  }, [previewRef, currentTheme.id]);

  const handleThemeChange = (themeId: string) => {
    const idx = THEMES.findIndex(t => t.id === themeId);
    if (idx !== -1) {
      setThemeIndex(idx);
    }
  };

  return (
    <div
      className="flex flex-col bg-gray-50 overflow-hidden fixed w-full"
      style={{ 
        height: `${viewportState.height}px`,
        top: `${viewportState.offsetTop}px`,
        left: `${viewportState.offsetLeft}px`
      }}
    >
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

      <div
        className="flex-1 flex flex-col md:flex-row overflow-hidden relative bg-white"
      >
        {/* Editor Pane */}
        <div className={`
          w-full md:w-1/2 h-full flex flex-col border-b md:border-b-0 md:border-r border-gray-200 bg-white z-10 relative
          ${activeMobileTab === 'editor' ? 'flex' : 'hidden md:flex'}
        `}>
          <textarea
            ref={textareaRef}
            className="w-full h-full p-6 resize-none focus:outline-none font-mono text-sm leading-6 text-gray-700 bg-transparent"
            value={markdown}
            onChange={handleTextChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder="Type your markdown here..."
            spellCheck={false}
          />

          {/* Floating Format Button */}
          <FormatButton
            text={markdown}
            onFormat={handleFormatText}
            onError={handleFormatError}
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
      <div className={isFocused ? 'hidden' : 'block'}>
        <BottomBar
          activeTab={activeMobileTab}
          onTabChange={setActiveMobileTab}
          onExport={handleExport}
          onClearContent={handleClearContent}
        />
      </div>
    </div>
  );
};

export default App;
