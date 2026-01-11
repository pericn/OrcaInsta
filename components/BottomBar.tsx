import React from 'react';
import { PenLine, Eye, Download, Trash2 } from 'lucide-react';

interface BottomBarProps {
  activeTab: 'editor' | 'preview';
  onTabChange: (tab: 'editor' | 'preview') => void;
  onExport: () => void;
  onClearContent?: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({ activeTab, onTabChange, onExport, onClearContent }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 pb-safe z-50 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {/* Tab Switcher */}
      <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200">
        <button
          onClick={() => onTabChange('editor')}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
            ${activeTab === 'editor'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'}
          `}
        >
          <PenLine size={16} />
          <span>编辑</span>
        </button>
        <button
          onClick={() => onTabChange('preview')}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
            ${activeTab === 'preview'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'}
          `}
        >
          <Eye size={16} />
          <span>预览</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Clear Content Button */}
        {onClearContent && (
          <button
            onClick={onClearContent}
            className="flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 rounded-full shadow-lg active:scale-95 transition-transform"
            title="Clear Content"
          >
            <Trash2 size={18} />
          </button>
        )}

        {/* Export Action */}
        <button
          onClick={onExport}
          className="flex items-center justify-center w-10 h-10 bg-slate-900 text-white rounded-full shadow-lg active:scale-95 transition-transform"
          title="Export Image"
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  );
};
