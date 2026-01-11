import { ThemeConfig } from './types';

export const DEFAULT_MARKDOWN = `# 🌊 OrcaInsta 使用指南

欢迎使用 **OrcaInsta**。这是一款专为**社交媒体长图**设计的 Markdown 编辑器。它不仅支持标准语法，还针对手机阅读体验进行了深度优化。

---

## 1. 基础排版 (Lists & Format)
文字是信息的载体。我们支持丰富的文本样式：

*   **强调文本**：支持 **加粗 (Bold)**、*斜体 (Italic)* 以及 ~~删除线~~。
*   **智能间距**：汉字与 English 单词、\`Code\`、**数字 123** 之间会自动增加微弱间距。
*   **列表支持**：
    1.  有序列表项 First item
    2.  有序列表项 Second item
    3.  列表也可以嵌套：
        *   无序子列表 A
        *   无序子列表 B

## 2. 链接与多媒体 (Links & Media)
支持插入超链接和图片，丰富文章内容。

点击访问 [OrcaInsta 项目](https://github.com) (示例链接) 或者查看下图：

![示例图片](https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)
*(图片说明：Mountain view, Unsplash)*

## 3. 代码与引用 (Code & Quotes)
对于技术类文章，代码块必不可少。

### 行内代码
在文本中嵌入 \`const variable = "value"\` 非常自然。

### 代码块
\`\`\`typescript
interface OrcaConfig {
  theme: 'Light' | 'Dark';
  export: 'Retina PNG';
}

function init() {
  console.log("Hello, OrcaInsta!");
}
\`\`\`

### 引用块样式
> 💡 **一级引用**：适合用于强调要点、摘录或提示信息。引用块会自动适配当前主题色。
>
> > **二级嵌套引用**：
> > 适合用于对话记录或层级更深的解释说明。

## 4. 表格样式 (Tables)
支持优美的表格渲染，适合展示参数或对比数据：

| 功能 | 类型 | 状态 |
| :--- | :--- | :--- |
| **Theme** | 5 种预设主题 | ✅ |
| **Typography** | 字号 (SM-XL) | ✅ |
| **Export** | 导出高清图 | ✅ |

## 5. 标题层级演示 (Headers)
精心设计的标题层级，让长文章结构清晰：

### H3 三级标题
正文默认采用宽松的行高（Loose），确保在手机屏幕上长时间阅读不累。

#### H4 四级标题
*列表项的间距也经过了压缩处理*，使得信息密度更加合理。

##### H5 五级标题
适合作为注释或细分领域的标题。

## 6. 隐藏特性
写作时的引用标记 [cite_start]这里的内容在生成图片时会被自动隐藏，只保留在编辑框中[cite: 88] 会在最终图片中自动消失，保持画面整洁。

---
*Made with OrcaInsta - 让文字更美*`;

export const THEMES: ThemeConfig[] = [
  {
    id: 'simple-light',
    name: '昼',
    background: 'bg-white',
    textColor: 'text-slate-800',
    accentColor: 'text-blue-600',
    cardBg: 'bg-white',
    cardBorder: 'border-transparent',
    quoteBg: 'bg-gray-50',
  },
  {
    id: 'simple-dark',
    name: '夜',
    background: 'bg-slate-900',
    textColor: 'text-slate-100',
    accentColor: 'text-sky-400',
    cardBg: 'bg-slate-900',
    cardBorder: 'border-slate-700',
    quoteBg: 'bg-slate-800',
  },
  {
    id: 'paper',
    name: '笺',
    background: 'bg-[#f8f4e9]',
    textColor: 'text-stone-800',
    accentColor: 'text-orange-700',
    cardBg: 'bg-[#fdfbf7]',
    cardBorder: 'border-stone-200',
    quoteBg: 'bg-[#f3eee3]',
  },
  {
    id: 'forest',
    name: '林',
    background: 'bg-emerald-900',
    textColor: 'text-emerald-50',
    accentColor: 'text-emerald-300',
    cardBg: 'bg-emerald-950/50 backdrop-blur-md',
    cardBorder: 'border-emerald-800',
    quoteBg: 'bg-emerald-900/40',
  },
  {
    id: 'gradient-purple',
    name: '霞',
    background: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
    textColor: 'text-white',
    accentColor: 'text-yellow-200',
    cardBg: 'bg-black/20 backdrop-blur-md',
    cardBorder: 'border-white/10',
    quoteBg: 'bg-white/10',
  }
];

export const FONT_SIZE_MAP = {
  sm: 'prose-sm',
  base: '', // Use default prose size (1rem) implicitly
  lg: 'prose-lg',
  xl: 'prose-xl',
};

export const LINE_HEIGHT_MAP = {
  tight: 'leading-tight',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
};
