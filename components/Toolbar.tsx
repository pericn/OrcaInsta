import React from 'react';
import { Download, Wand2, RefreshCw, Type, AlignJustify, CaseUpper, ChevronDown } from 'lucide-react';
import { TypographyConfig, ThemeConfig } from '../types';

interface ToolbarProps {
  onAutoSpace: () => void;
  onAIPolish: () => void;
  onExport: () => void;
  isProcessing: boolean;
  onThemeChange: (themeId: string) => void;
  currentThemeId: string;
  themes: ThemeConfig[];
  typography: TypographyConfig;
  setTypography: (config: TypographyConfig) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onAutoSpace, 
  onAIPolish, 
  onExport, 
  isProcessing,
  onThemeChange,
  currentThemeId,
  themes,
  typography,
  setTypography
}) => {
  
  const cycleFontSize = () => {
    const sizes: TypographyConfig['fontSize'][] = ['sm', 'base', 'lg', 'xl'];
    const currentIdx = sizes.indexOf(typography.fontSize);
    setTypography({
      ...typography,
      fontSize: sizes[(currentIdx + 1) % sizes.length]
    });
  };

  const cycleLineHeight = () => {
    const heights: TypographyConfig['lineHeight'][] = ['tight', 'normal', 'relaxed', 'loose'];
    const currentIdx = heights.indexOf(typography.lineHeight);
    setTypography({
      ...typography,
      lineHeight: heights[(currentIdx + 1) % heights.length]
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-1 mr-auto">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent px-1 hidden sm:block">
          OrcaInsta
        </h1>
      </div>

      <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
        <div className="relative group">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 pointer-events-none z-10"></div>
          <select
            value={currentThemeId}
            onChange={(e) => onThemeChange(e.target.value)}
            className="appearance-none pl-7 pr-8 py-1.5 text-xs font-medium text-gray-600 bg-transparent hover:bg-white hover:shadow-sm rounded-md transition-all border-none focus:ring-0 cursor-pointer outline-none w-32"
            title="Switch Theme"
          >
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none group-hover:text-gray-600" />
        </div>

        <div className="w-px h-4 bg-gray-300 mx-1"></div>

        <button
          onClick={cycleFontSize}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
          title="Toggle Font Size"
        >
          <CaseUpper size={14} />
          <span className="uppercase">{typography.fontSize}</span>
        </button>

        <button
          onClick={cycleLineHeight}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
          title="Toggle Line Height"
        >
          <AlignJustify size={14} />
          <span className="capitalize hidden sm:inline">{typography.lineHeight}</span>
        </button>
      </div>

      <div className="h-6 w-px bg-gray-200 mx-1"></div>

      <button
        onClick={onAutoSpace}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        title="Fix Chinese Spacing"
      >
        <Type size={14} />
        <span className="hidden sm:inline">Space Fix</span>
      </button>

      <button
        onClick={onAIPolish}
        disabled={isProcessing}
        className={`
          flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
          ${isProcessing 
            ? 'bg-purple-100 text-purple-400 cursor-not-allowed' 
            : 'bg-purple-50 text-purple-600 hover:bg-purple-100'}
        `}
        title="Smart polish using Gemini AI"
      >
        {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
        <span className="hidden sm:inline">AI Polish</span>
      </button>

      <button
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm ml-2"
      >
        <Download size={14} />
        <span>Export</span>
      </button>
    </div>
  );
};

export default Toolbar;