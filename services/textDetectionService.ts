// Text detection service for identifying plain text that can be formatted
export class TextDetectionService {
  // Check if text contains Markdown syntax
  private static hasMarkdownSyntax(text: string): boolean {
    const markdownPatterns = [
      /^#{1,6}\s/m,           // Headers (# ## ###)
      /\*\*.*?\*\*/,          // Bold (**text**)
      /\*.*?\*/,              // Italic (*text*)
      /_.*?_/,                // Italic (_text_)
      /`{1,3}.*?`{1,3}/,      // Inline code or code blocks
      /\[.*?\]\(.*?\)/,       // Links [text](url)
      /^[\s]*[-\*\+]\s/m,     // Unordered lists (- * +)
      /^[\s]*\d+\.\s/m,       // Ordered lists (1. 2. 3.)
      /^>\s/m,                 // Blockquotes (>)
      /\|.*\|.*\|/,           // Tables
      /^```[\s\S]*?^```/m,    // Code blocks
      /~~.*?~~/,              // Strikethrough
      /\[\^[^\]]*\]/,         // Footnotes
    ];

    return markdownPatterns.some(pattern => pattern.test(text));
  }

  // Check if text should show the format button
  static shouldShowFormatButton(text: string): boolean {
    // Must be long enough (>50 characters)
    if (text.length <= 50) {
      return false;
    }

    // Must not contain markdown syntax
    if (this.hasMarkdownSyntax(text)) {
      return false;
    }

    // Additional heuristics for meaningful content
    const lines = text.split('\n').filter(line => line.trim().length > 0);

    // Must have at least 2 lines or be a long single line
    if (lines.length < 2 && text.length < 100) {
      return false;
    }

    // Check for conversational patterns (optional enhancement)
    const hasConversationalPatterns = this.hasConversationalPatterns(text);

    return true; // For now, just check basic criteria
  }

  // Optional: detect conversational patterns (AI chat, Q&A, etc.)
  private static hasConversationalPatterns(text: string): boolean {
    const patterns = [
      // Chinese conversational markers
      /(?:我|你|请|谢谢|好的|是的|不是|为什么|怎么|如何)/gi,
      /(?:问|答|解释|总结|请教|请问)/gi,

      // English conversational markers
      /\b(?:I asked|you said|please|answer|explain|summarize)\b/gi,
      /\b(?:how to|what is|can you|tell me|why)\b/gi,

      // Question marks
      /[？?]/,

      // Code/function patterns
      /\b(?:function|class|const|let|var|import|export)\b/g,
      /```[\s\S]*?```/g,
    ];

    const score = patterns.reduce((acc, pattern) => {
      return acc + (pattern.test(text) ? 1 : 0);
    }, 0);

    return score >= 1; // At least one conversational indicator
  }

  // Check if content is likely already well-formatted
  static isAlreadyFormatted(text: string): boolean {
    return this.hasMarkdownSyntax(text);
  }

  // Get content statistics for debugging
  static getContentStats(text: string) {
    return {
      length: text.length,
      lines: text.split('\n').length,
      hasMarkdown: this.hasMarkdownSyntax(text),
      shouldShowButton: this.shouldShowFormatButton(text),
      hasConversationalPatterns: this.hasConversationalPatterns(text)
    };
  }
}
