/**
 * Removes citation markers like [cite_start] and [cite: 63]
 * Preserves the content inside if valid.
 * Syntax: [cite_start] content [cite:33]
 */
export const cleanCitations = (text: string): string => {
  return text
    // Remove [cite_start] and allow flexible spacing around it
    .replace(/\[cite_start\]\s*/g, '')
    // Remove [cite: number] and allow flexible spacing inside
    .replace(/\[cite:\s*\d+\]/g, '');
};

/**
 * Inserts a space between Chinese PUNCTUATION and bold markers.
 * Example: **比如：** -> **比如： **  (space after ： and before closing **)
 * 
 * TEMPORARILY DISABLED to isolate Markdown rendering issues.
 */
export const insertSpaceInMarkdown = (text: string): string => {
  // DISABLED: Return input unchanged to isolate Markdown issues
  return text;
};

/**
 * Generates a filename based on the content title and current date.
 * Format: Title_YYMMDD
 * If no title found, uses "OrcaInsta_YYMMDD"
 */
export const generateFileName = (content: string, extension: string): string => {
  // 1. Extract Title (First H1 # Title)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  let title = 'OrcaInsta';

  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim();
    // Sanitize title (remove illegal chars)
    title = title.replace(/[\\/:*?"<>|]/g, '-');
  }

  // 2. Format Date YYMMDD
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');
  const dd = now.getDate().toString().padStart(2, '0');
  const dateStr = `${yy}${mm}${dd}`;

  return `${title}_${dateStr}.${extension}`;
};