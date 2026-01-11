import React from 'react';
import { Download, ALargeSmall, ListChecks, ChevronDown, Trash2 } from 'lucide-react';
import { TypographyConfig, ThemeConfig } from '../types';

interface ToolbarProps {
  onExport: () => void;
  onThemeChange: (themeId: string) => void;
  currentThemeId: string;
  themes: ThemeConfig[];
  typography: TypographyConfig;
  setTypography: (config: TypographyConfig) => void;
  activeMobileTab: 'editor' | 'preview';
  onTabChange: (tab: 'editor' | 'preview') => void;
  onClearContent: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onExport,
  onThemeChange,
  currentThemeId,
  themes,
  typography,
  setTypography,
  activeMobileTab,
  onTabChange,
  onClearContent
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

  const getFontSizeLabel = (size: string) => {
    switch (size) {
      case 'sm': return '小号';
      case 'base': return '中号';
      case 'lg': return '大号';
      case 'xl': return '超大';
      default: return size;
    }
  };

  const getLineHeightLabel = (height: string) => {
    switch (height) {
      case 'tight': return '紧凑';
      case 'normal': return '适中';
      case 'relaxed': return '松散';
      case 'loose': return '空间';
      default: return height;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-2 mr-auto">
        <img src="/logo.png" alt="OrcaInsta" className="w-8 h-8 object-contain" />
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
          OrcaInsta
        </h1>
      </div>

      {/* Format Controls - Show on Preview page for mobile, always show on desktop */}
      {activeMobileTab === 'preview' || window.innerWidth >= 768 ? (
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
          <div className="relative group">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 pointer-events-none z-10"></div>
            <select
              value={currentThemeId}
              onChange={(e) => onThemeChange(e.target.value)}
              className="appearance-none pl-7 pr-8 py-1.5 text-xs font-medium text-gray-600 bg-transparent hover:bg-white hover:shadow-sm rounded-md transition-all border-none focus:ring-0 cursor-pointer outline-none w-32"
              title="选择主题"
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
            title="切换字号"
          >
            <ALargeSmall size={14} />
            <span className="uppercase">{getFontSizeLabel(typography.fontSize)}</span>
          </button>

          <button
            onClick={cycleLineHeight}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
            title="切换行高"
          >
            <ListChecks size={14} />
            <span className="capitalize hidden sm:inline">{getLineHeightLabel(typography.lineHeight)}</span>
          </button>
        </div>
      ) : null}

      {/* Clear Content Button - Show on Editor page for mobile, always show on desktop */}
      {activeMobileTab === 'editor' || window.innerWidth >= 768 ? (
        <button
          onClick={onClearContent}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border border-red-200 ml-2"
          title="清空内容"
        >
          <Trash2 size={14} />
          <span>清空</span>
        </button>
      ) : null}

      {/* Export Button - Hidden on Mobile (moved to BottomBar) */}
      <button
        onClick={onExport}
        className="hidden md:flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm ml-2"
        title="导出图片"
      >
        <Download size={14} />
        <span>导出</span>
      </button>
    </div>
  );
};

export default Toolbar;
