import React, { useState, useEffect, RefObject } from 'react';
import { Sparkles, Scissors, Shrink, RotateCcw, Loader2, Undo2, Check, X, Info } from 'lucide-react';
import { TextDetectionService } from '../services/textDetectionService';
import { DeepSeekService } from '../services/deepseekService';
import { insertSpaceInMarkdown } from '../services/textUtils';
import { PreviewMode } from '../types';

interface EditorToolbarProps {
  markdown: string;
  onMarkdownChange: (text: string) => void;
  onFormatError: (error: string) => void;
  previewMode: PreviewMode;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  textareaRef: RefObject<HTMLTextAreaElement>;
}

type OverlayType = 'page-break' | 'compress' | 'clear' | null;

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  markdown,
  onMarkdownChange,
  onFormatError,
  previewMode,
  showToast,
  textareaRef
}) => {
  const [isFormatVisible, setIsFormatVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormatted, setIsFormatted] = useState(false);
  const [originalText, setOriginalText] = useState('');
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>(null);
  const [countdown, setCountdown] = useState(10);

  // Check if format button should be visible
  useEffect(() => {
    const shouldShow = TextDetectionService.shouldShowFormatButton(markdown);
    setIsFormatVisible(shouldShow);

    if (!shouldShow && !isLoading) {
      setIsFormatted(false);
      setOriginalText('');
    }
  }, [markdown, isLoading]);

  // Handle auto-close timer for tips
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeOverlay && activeOverlay !== 'clear') {
      setCountdown(10);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setActiveOverlay(null);
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeOverlay]);

  const handleFormat = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      setOriginalText(markdown);
      const aiFormattedText = await DeepSeekService.formatToMarkdown(markdown);
      const finalFormattedText = insertSpaceInMarkdown(aiFormattedText);
      onMarkdownChange(finalFormattedText);
      setIsFormatted(true);
      showToast('智能格式化已完成', 'success');
    } catch (error) {
      console.error('Formatting error:', error);
      const errorMessage = error instanceof Error ? error.message : '格式化失败，请重试';
      onFormatError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndoFormat = () => {
    if (originalText) {
      onMarkdownChange(originalText);
      setIsFormatted(false);
      setOriginalText('');
      showToast('已撤销格式化', 'info');
    }
  };

  const insertMarker = async (marker: string, label: string, type: OverlayType) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    // Insert marker at cursor position
    const newValue = value.substring(0, start) + marker + value.substring(end);
    
    // Update state
    onMarkdownChange(newValue);

    // Show Tip
    setActiveOverlay(type);
  };

  const handleClearRequest = () => {
    setActiveOverlay('clear');
  };

  const confirmClear = () => {
    const newMarkdown = markdown.replace(/>>--->>|<<---<</g, '');
    if (newMarkdown !== markdown) {
      onMarkdownChange(newMarkdown);
      showToast('已清空所有分页/压缩标记', 'info');
    } else {
      showToast('没有发现可清除的标记', 'info');
    }
    setActiveOverlay(null);
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
      
      {/* Overlay Tip / Confirmation */}
      {activeOverlay && (
        <div className="mb-2 px-4 py-3 bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[320px] text-center">
          {activeOverlay === 'page-break' && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-bold text-indigo-600">&gt;&gt;---&gt;&gt;</span> 会强制换页。
                <br/>在此处之后的内容将出现在新的一页中。
              </p>
              <button 
                onClick={closeOverlay}
                className="self-center mt-1 px-6 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-2"
              >
                <span>OK</span>
                <span className="opacity-60 text-[10px] tabular-nums font-mono">{countdown}s</span>
              </button>
            </div>
          )}
          
          {activeOverlay === 'compress' && (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-bold text-indigo-600">&lt;&lt;---&lt;&lt;</span> 会检测上一个分页符，
                <br/>并将两者之间的所有内容强制缩放到一页。
              </p>
              <button 
                onClick={closeOverlay}
                className="self-center mt-1 px-6 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-2"
              >
                <span>OK</span>
                <span className="opacity-60 text-[10px] tabular-nums font-mono">{countdown}s</span>
              </button>
            </div>
          )}

          {activeOverlay === 'clear' && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-gray-800">
                确定要清除所有的分页与压缩标记吗？
              </p>
              <div className="flex items-center justify-center gap-3">
                <button 
                  onClick={closeOverlay}
                  className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-full transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={confirmClear}
                  className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-full transition-colors"
                >
                  确认清除
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        
        {/* Smart Format Section */}
        {isFormatVisible && (
          <>
            <button
              onClick={isFormatted ? handleUndoFormat : handleFormat}
              disabled={isLoading}
              className={`
                flex items-center gap-2 h-9 px-4 rounded-xl transition-all active:scale-95 disabled:opacity-50
                ${isFormatted 
                  ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }
              `}
              title={isFormatted ? '撤销格式化' : '智能格式化'}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isFormatted ? (
                <Undo2 size={16} />
              ) : (
                <Sparkles size={16} />
              )}
              <span className="text-xs font-bold tracking-tight">
                {isLoading ? '处理中' : isFormatted ? '撤销' : '智能格式化'}
              </span>
            </button>
            
            <div className="w-px h-4 bg-gray-200 mx-1" />
          </>
        )}

        {/* Pagination Markers */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => insertMarker('>>--->>', '分页符', 'page-break')}
            className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all active:scale-90 ${activeOverlay === 'page-break' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
            title="插入分页符 (>>--->>)"
          >
            <Scissors size={18} />
          </button>
          
          <button
            onClick={() => insertMarker('<<---<<', '压缩符', 'compress')}
            className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all active:scale-90 ${activeOverlay === 'compress' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'}`}
            title="插入压缩符 (<<---<<)"
          >
            <Shrink size={18} />
          </button>

          <button
            onClick={handleClearRequest}
            className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all active:scale-90 ${activeOverlay === 'clear' ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
            title="清空标记"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
