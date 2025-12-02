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
 * Inserts a space between Chinese characters/punctuation and Markdown markers.
 * Optimized for mobile reading and visual breathing room.
 * 
 * Logic:
 * - Uses parity check for **bold** to distinguish opening vs closing tags.
 * - Opening tag: Ensure space BEFORE if needed.
 * - Closing tag: Ensure space AFTER if needed.
 * - Fixes: "【**Test，**Test】" -> "【**Test，** Test】"
 */
export const insertSpaceInMarkdown = (text: string): string => {
  let processed = text;

  // 1. Handle Inline Code `code`
  // Simple heuristic: Add space around backticks if they touch non-space characters
  processed = processed.replace(/([^\s`])(`)/g, '$1 $2'); // Char before `
  processed = processed.replace(/(`)([^\s`])/g, '$1 $2'); // ` before Char

  // 2. Handle **Bold** Markers with State
  const parts = processed.split('**');
  if (parts.length > 1) {
    for (let i = 0; i < parts.length; i++) {
      // Avoid processing the very last segment as it has no following **
      if (i === parts.length - 1) break;

      const isOpening = (i % 2 === 0);
      
      if (isOpening) {
        // We are at the end of parts[i], about to enter ** (Opening).
        // If parts[i] ends with CJK/Punct/Non-space, add space BEFORE the **.
        if (parts[i].length > 0) {
          const lastChar = parts[i].slice(-1);
          if (/[^\s]/.test(lastChar)) {
            parts[i] = parts[i] + ' ';
          }
        }
      } else {
        // We are at the end of parts[i] (which is INSIDE bold), about to exit ** (Closing).
        // We need to check the START of parts[i+1].
        // If parts[i+1] starts with CJK/Punct/Non-space, add space AFTER the **.
        if (parts[i+1].length > 0) {
           const firstChar = parts[i+1].slice(0, 1);
           // User request: In continuous Punctuation + Marker sequence, add space AFTER the marker.
           // Example: "，**" -> Add space after ** -> "，** Next"
           if (/[^\s]/.test(firstChar)) {
             parts[i+1] = ' ' + parts[i+1];
           }
        }
      }
    }
    processed = parts.join('**');
  }

  // 3. General CJK <-> English spacing
  processed = processed.replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, '$1 $2');
  processed = processed.replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, '$1 $2');

  return processed;
};