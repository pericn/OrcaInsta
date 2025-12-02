import React, { forwardRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ThemeConfig, TypographyConfig } from '../types';
import { FONT_SIZE_MAP, LINE_HEIGHT_MAP } from '../constants';
import { cleanCitations } from '../services/textUtils';

interface PreviewCardProps {
  content: string;
  theme: ThemeConfig;
  typography: TypographyConfig;
  scale: number;
}

const PreviewCard = forwardRef<HTMLDivElement, PreviewCardProps>(
  ({ content, theme, typography, scale }, ref) => {
    
    // Clean content for display (removes [cite] tags)
    const displayContent = useMemo(() => cleanCitations(content), [content]);

    // Explicit mapping for inline styles to guarantee font-size application fallback
    const fontSizeStyle = {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem'
    };

    const style = {
      transform: `scale(${scale})`,
      transformOrigin: 'top center',
      fontSize: fontSizeStyle[typography.fontSize], 
    };

    const proseSize = FONT_SIZE_MAP[typography.fontSize];
    const lineHeight = LINE_HEIGHT_MAP[typography.lineHeight];

    // Helper to get border color class from text color class (heuristic)
    const borderAccent = theme.accentColor.replace('text-', 'border-');

    return (
      <div 
        className="w-full flex justify-center items-start overflow-visible"
      >
        <div
          ref={ref}
          className={`
            relative flex-shrink-0 transition-all duration-300 ease-in-out
            w-[375px] sm:w-[450px]
            ${theme.background}
            shadow-2xl
          `}
          style={style}
        >
           {/* Inner Card content */}
          <div className={`
             m-5 p-6 md:p-8 min-h-[600px]
             ${theme.cardBg} ${theme.cardBorder} border
             ${theme.textColor}
             shadow-sm
          `}>
             <div className={`prose ${proseSize} max-w-none break-words ${lineHeight} marker:text-current`}>
               <style>{`
                 /* Global Color Inheritance for Prose */
                 .prose { color: inherit; }
                 .prose strong { color: inherit; font-weight: 700; opacity: 0.95; }
                 .prose a { color: inherit; text-decoration: none; border-bottom: 1px dashed currentColor; opacity: 0.8; }
                 .prose code { color: inherit; }
                 
                 /* Headers H1 - H6 */
                 .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
                    color: inherit;
                    line-height: 1.3;
                    font-style: normal; /* Headers shouldn't be italic by default */
                 }
                 
                 .prose h1 { 
                    font-weight: 800; 
                    margin-top: 1em;
                    margin-bottom: 0.8em;
                    padding-bottom: 0.3em;
                    border-bottom: 2px solid currentColor;
                    opacity: 0.95;
                 }
                 .prose h2 { 
                    font-weight: 700; 
                    margin-top: 1.6em; 
                    margin-bottom: 0.6em;
                    padding-left: 0.5em;
                    border-left: 4px solid currentColor;
                    opacity: 0.9; 
                 }
                 .prose h3 {
                    font-weight: 700;
                    font-size: 1.4em;
                    margin-top: 1.8em;
                    margin-bottom: 0.8em;
                    opacity: 0.9;
                 }
                 .prose h4 {
                    font-weight: 600;
                    font-size: 1.25em;
                    margin-top: 1.6em;
                    margin-bottom: 0.6em;
                    opacity: 0.85;
                 }
                 .prose h5 {
                    font-weight: 600;
                    font-size: 1.05em;
                    margin-top: 1.4em;
                    margin-bottom: 0.4em;
                    opacity: 0.8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                 }
                 .prose h6 {
                    font-weight: 500;
                    font-size: 0.95em;
                    margin-top: 1.2em;
                    opacity: 0.7;
                 }

                 /* Code Blocks */
                 .prose code { 
                    background: rgba(125,125,125,0.1); 
                    padding: 0.2em 0.4em; 
                    border-radius: 6px; 
                    font-size: 0.85em; 
                    font-weight: 500;
                    font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
                 }
                 /* Remove default backticks from inline code */
                 .prose :where(code)::before {
                    content: none !important;
                 }
                 .prose :where(code)::after {
                    content: none !important;
                 }

                 .prose pre {
                    background: rgba(0,0,0,0.05);
                    color: inherit;
                    border-radius: 12px;
                    padding: 1rem;
                 }
                 .prose pre code {
                    background: transparent;
                    padding: 0;
                 }

                 /* Lists - Compact spacing */
                 .prose ul > li, .prose ol > li {
                    margin-top: 0.25em;
                    margin-bottom: 0.25em;
                 }
                 .prose ul > li::marker { color: currentColor; opacity: 0.6; }
                 .prose ol > li::marker { color: currentColor; opacity: 0.6; font-weight: 600; }

                 /* Blockquotes */
                 .prose blockquote {
                    font-style: normal; /* Avoid default italic for entire quote */
                 }
                 /* Remove default quotes added by tailwind typography */
                 .prose blockquote p:first-of-type::before {
                    content: none;
                 }
                 .prose blockquote p:last-of-type::after {
                    content: none;
                 }
                 
                 /* Nested Blockquotes Overrides */
                 /* We force these styles to override the component's inline classes for nested items */
                 .prose blockquote blockquote {
                    margin-top: 0.8rem !important;
                    margin-bottom: 0.8rem !important;
                    background-color: rgba(125, 125, 125, 0.1) !important; /* Code-block like background */
                    border-left-width: 0 !important; /* No border for nested */
                    padding: 0.8rem 1rem !important;
                    border-radius: 0.75rem !important;
                    opacity: 0.9;
                 }

                 /* Tables - Enhanced Styling */
                 .prose table {
                    width: 100%;
                    margin-top: 2em;
                    margin-bottom: 2em;
                    border-collapse: collapse;
                    font-size: 0.9em;
                    color: inherit; 
                 }
                 .prose thead {
                    border-bottom-width: 2px;
                    border-bottom-color: currentColor; 
                 }
                 .prose thead th {
                    text-align: left;
                    padding: 0.75rem 0.5rem;
                    font-weight: 700;
                    opacity: 0.9;
                    vertical-align: bottom;
                    color: inherit;
                 }
                 .prose tbody tr {
                    border-bottom-width: 1px;
                    border-bottom-color: currentColor;
                 }
                 .prose tbody tr {
                    border-bottom: 1px solid rgba(127, 127, 127, 0.2);
                 }
                 .prose tbody td {
                    padding: 0.75rem 0.5rem;
                    vertical-align: top;
                    opacity: 0.9;
                    color: inherit;
                 }
                 .prose tbody tr:last-child {
                    border-bottom: 0;
                 }
               `}</style>
               
               <ReactMarkdown 
                 remarkPlugins={[remarkGfm]}
                 components={{
                    // Apply Accent Colors
                    strong: ({node, ...props}) => <strong className={`${theme.accentColor}`} {...props} />,
                    a: ({node, ...props}) => <a className={`${theme.accentColor}`} {...props} />,
                    h1: ({node, ...props}) => <h1 className={`${theme.accentColor} border-opacity-20`} {...props} />,
                    h2: ({node, ...props}) => <h2 className={`${theme.accentColor} border-opacity-40`} {...props} />,
                    // Custom Theme-Aware Blockquote
                    blockquote: ({node, ...props}) => (
                      <blockquote 
                        className={`
                          ${theme.quoteBg}
                          ${borderAccent} 
                          border-l-4 px-4 py-3 my-4 rounded-xl
                          text-inherit
                        `} 
                        {...props} 
                      />
                    ),
                 }}
               >
                 {displayContent}
               </ReactMarkdown>
             </div>
             
             {/* Footer Branding */}
             <div className="mt-16 pt-6 border-t border-current border-opacity-20 flex justify-between items-center text-[10px] tracking-wider uppercase opacity-50 font-semibold">
                <span className="flex items-center gap-1">
                  Generated by OrcaInsta
                </span>
                <span>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}</span>
             </div>
          </div>
        </div>
      </div>
    );
  }
);

PreviewCard.displayName = 'PreviewCard';

export default PreviewCard;