import { Download, ALargeSmall, ListChecks, ChevronDown, Trash2, Copy, FileText, Image as ImageIcon, ChevronUp, Grid, Presentation, FileStack } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { TypographyConfig, ThemeConfig, PreviewMode } from '../types';
import { APP_VERSION } from '../constants';

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
  onCopy: () => void;
  onPDF: () => void;
  onXiaohongshu: () => void;
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
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
  onClearContent,
  onCopy,
  onPDF,
  onXiaohongshu,
  previewMode,
  setPreviewMode
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window width changes
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      case 'loose': return '呼吸';
      default: return height;
    }
  };


  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isExportMenuOpen) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isExportMenuOpen]);

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-2 mr-auto">
        <img src="/logo.png" alt="OrcaInsta" className="w-8 h-8 object-contain" />
        <div className="hidden sm:flex items-baseline gap-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            OrcaInsta
          </h1>
          <span className="text-[10px] text-gray-400 font-mono">v{APP_VERSION}</span>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
        <button
          onClick={() => setPreviewMode('long')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${previewMode === 'long' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          title="长图模式"
        >
          <Presentation size={14} />
          <span className="hidden sm:inline">长图</span>
        </button>
        <button
          onClick={() => setPreviewMode('xh')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${previewMode === 'xh' ? 'bg-white shadow-sm text-red-500' : 'text-gray-500 hover:text-gray-700'}`}
          title="小红书分页模式"
        >
          <FileStack size={14} />
          <span className="hidden sm:inline">分页</span>
        </button>
      </div>

      {/* Format Controls - Show on Preview page for mobile, always show on desktop */}
      {activeMobileTab === 'preview' || windowWidth >= 768 ? (
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-100">
          <div className="relative group">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 pointer-events-none z-10"></div>
            <select
              value={currentThemeId}
              onChange={(e) => onThemeChange(e.target.value)}
              className="appearance-none pl-7 pr-8 py-1.5 text-xs font-medium text-gray-600 bg-transparent hover:bg-white hover:shadow-sm rounded-md transition-all border-none focus:ring-0 cursor-pointer outline-none w-20"
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
            <span className="capitalize">{getLineHeightLabel(typography.lineHeight)}</span>
          </button>
        </div>
      ) : null}

      {/* Clear Content Button - Show on Editor page for mobile, always show on desktop */}
      {activeMobileTab === 'editor' || windowWidth >= 768 ? (
        <button
          onClick={onClearContent}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors border border-red-200 ml-2"
          title="清空内容"
        >
          <Trash2 size={14} />
          <span>清空</span>
        </button>
      ) : null}

      {/* Export Dropdown Menu */}
      <div className="relative ml-2 z-50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExportMenuOpen(!isExportMenuOpen);
          }}
          className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm ${isExportMenuOpen ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
          title="导出选项"
        >
          <Download size={14} />
          <span>导出</span>
          {isExportMenuOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>

        {isExportMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-100 z-50">
            <div className="py-1">
              <button
                onClick={() => { onExport(); setIsExportMenuOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                title="保存长图"
              >
                <div className="bg-blue-50 p-1.5 rounded-md text-blue-600">
                  <ImageIcon size={16} />
                </div>
                <div>
                  <div className="font-medium">保存图片</div>
                  <div className="text-[10px] text-gray-400">下载 PNG 长图</div>
                </div>
              </button>

              <button
                onClick={() => { onXiaohongshu(); setIsExportMenuOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                title="适合小红书发布 (1080x1443)"
              >
                <div className="bg-red-50 p-1.5 rounded-md text-red-500">
                  <Grid size={16} />
                </div>
                <div>
                  <div className="font-medium">导出分页图片</div>
                  <div className="text-[10px] text-gray-400">打包下载 (3:4)</div>
                </div>
              </button>

              <button
                onClick={() => { onCopy(); setIsExportMenuOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
              >
                <div className="bg-purple-50 p-1.5 rounded-md text-purple-600">
                  <Copy size={16} />
                </div>
                <div>
                  <div className="font-medium">复制图片</div>
                  <div className="text-[10px] text-gray-400">复制到剪贴板</div>
                </div>
              </button>

              <button
                onClick={() => { onPDF(); setIsExportMenuOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors border-t border-gray-50"
              >
                <div className="bg-red-50 p-1.5 rounded-md text-red-600">
                  <FileText size={16} />
                </div>
                <div>
                  <div className="font-medium">导出 PDF</div>
                  <div className="text-[10px] text-gray-400">A4 打印格式</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
