// Floating format button that appears when plain text is detected
import React, { useState, useEffect } from 'react';
import { Sparkles, Undo2, Loader2 } from 'lucide-react';
import { TextDetectionService } from '../services/textDetectionService';
import { DeepSeekService } from '../services/deepseekService';

interface FormatButtonProps {
  text: string;
  onFormat: (formattedText: string) => void;
  onError: (error: string) => void;
  className?: string;
}

export const FormatButton: React.FC<FormatButtonProps> = ({
  text,
  onFormat,
  onError,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormatted, setIsFormatted] = useState(false);
  const [originalText, setOriginalText] = useState('');

  // Check if button should be visible whenever text changes
  useEffect(() => {
    const shouldShow = TextDetectionService.shouldShowFormatButton(text);
    setIsVisible(shouldShow);

    // Reset formatted state when text changes significantly
    if (!shouldShow) {
      setIsFormatted(false);
      setOriginalText('');
    }
  }, [text]);

  const handleFormat = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // Store original text for undo functionality
      setOriginalText(text);

      // Call DeepSeek API to format text
      const formattedText = await DeepSeekService.formatToMarkdown(text);

      // Update the text in parent component
      onFormat(formattedText);

      // Mark as formatted
      setIsFormatted(true);

    } catch (error) {
      console.error('Formatting error:', error);
      const errorMessage = error instanceof Error ? error.message : '格式化失败，请重试';
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = () => {
    if (originalText) {
      onFormat(originalText);
      setIsFormatted(false);
      setOriginalText('');
    }
  };

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 ${className}`}>
      <button
        onClick={isFormatted ? handleUndo : handleFormat}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-200
          hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
          ${isFormatted
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          }
        `}
        title={isFormatted ? '撤销格式化' : '智能格式化'}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isFormatted ? (
          <Undo2 className="w-4 h-4" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isLoading
            ? '格式化中...'
            : isFormatted
              ? '撤销格式化'
              : '智能格式化'
          }
        </span>
      </button>
    </div>
  );
};
