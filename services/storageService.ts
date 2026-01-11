// Local storage service for OrcaInsta with future extensibility
import { TypographyConfig } from '../types';

interface TypographySettings extends TypographyConfig {
  fontFamily?: 'sans' | 'serif' | 'mono';
  customCSS?: string;
}

interface StoredData {
  version: string;
  timestamp: number;
  markdown: string;
  themeId: string;
  typography: TypographySettings;
  // Future extensions
  fontScheme?: string;
  aiSettings?: {
    autoFormat: boolean;
    customPrompts: string[];
  };
  importHistory?: Array<{
    id: string;
    source: 'text-selection' | 'ai-chat-response' | 'markdown-codeblock';
    content: string;
    timestamp: number;
    url?: string;
  }>;
  metadata?: {
    wordCount: number;
    lastEdited: number;
    exportCount: number;
  };
}

const STORAGE_KEY = 'orca-insta-data';
const CURRENT_VERSION = '1.1.0';

// Safe localStorage wrapper
const safeLocalStorage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

// Create default data structure
function createDefaultData(): StoredData {
  return {
    version: CURRENT_VERSION,
    timestamp: Date.now(),
    markdown: '',
    themeId: 'simple-light',
    typography: {
      fontSize: 'base',
      lineHeight: 'loose',
      fontFamily: 'sans'
    }
  };
}

// Data migration functions
function migrateFromV1_0_0(oldData: any): StoredData {
  return {
    version: CURRENT_VERSION,
    timestamp: oldData.timestamp || Date.now(),
    markdown: oldData.markdown || '',
    themeId: oldData.themeId || 'simple-light',
    typography: {
      fontSize: oldData.typography?.fontSize || 'base',
      lineHeight: oldData.typography?.lineHeight || 'loose',
      fontFamily: 'sans'
    }
  };
}

function migrateData(oldData: any): StoredData {
  const version = oldData.version || '1.0.0';

  switch (version) {
    case '1.0.0':
      return migrateFromV1_0_0(oldData);
    case CURRENT_VERSION:
      return oldData;
    default:
      console.warn(`Unknown data version: ${version}, resetting to defaults`);
      return createDefaultData();
  }
}

// Storage service class
export class StorageService {
  private static debounceTimer: NodeJS.Timeout | null = null;
  private static readonly SAVE_DELAY = 500; // ms

  static loadData(): StoredData | null {
    try {
      const stored = safeLocalStorage.get(STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      return migrateData(parsed);
    } catch (error) {
      console.warn('Failed to load stored data:', error);
      return null;
    }
  }

  static saveData(data: Partial<StoredData>): boolean {
    try {
      const currentData = this.loadData() || createDefaultData();
      const updatedData: StoredData = {
        ...currentData,
        ...data,
        timestamp: Date.now()
      };

      const serialized = JSON.stringify(updatedData);
      return safeLocalStorage.set(STORAGE_KEY, serialized);
    } catch (error) {
      console.warn('Failed to save data:', error);
      return false;
    }
  }

  // Debounced auto-save
  static autoSave(data: Partial<StoredData>): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.saveData(data);
    }, this.SAVE_DELAY);
  }

  static clearData(): boolean {
    return safeLocalStorage.remove(STORAGE_KEY);
  }

  // Utility methods for specific data types
  static saveMarkdown(markdown: string): boolean {
    return this.saveData({ markdown });
  }

  static saveTheme(themeId: string): boolean {
    return this.saveData({ themeId });
  }

  static saveTypography(typography: TypographySettings): boolean {
    return this.saveData({ typography });
  }

  // Future extension methods
  static addImportHistory(importData: StoredData['importHistory'][0]): boolean {
    const currentData = this.loadData();
    if (!currentData) return false;

    const importHistory = currentData.importHistory || [];
    importHistory.unshift({
      id: `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...importData
    });

    // Keep only last 50 imports
    if (importHistory.length > 50) {
      importHistory.splice(50);
    }

    return this.saveData({ importHistory });
  }

  static getImportHistory(): StoredData['importHistory'] {
    const data = this.loadData();
    return data?.importHistory || [];
  }
}
