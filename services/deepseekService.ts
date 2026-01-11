// DeepSeek API service for text formatting
interface DeepSeekConfig {
  apiKey: string;
  baseURL: string;
  model: string;
}

interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class DeepSeekService {
  private static readonly CONFIG: DeepSeekConfig = {
    apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
    baseURL: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat'
  };

  private static readonly FORMATTING_PROMPT = `{你是一个资深文字排版师，擅长使用 markdown 文案排版。理解下面的文字内容，并增加 markdown 标记，增加其可读性。# 原则：1. （！非常重要）**确保**不可更改原文本的任何内容，仅增加标记符号。 2. 中文**不可以**使用斜体标记。 3. 直接回复我符号标记后的内容，不需要和我交互。# 内容： }{text}`;

  static async formatToMarkdown(text: string): Promise<string> {
    try {
      // Check if API key is available
      if (!this.CONFIG.apiKey || this.CONFIG.apiKey === '') {
        throw new Error('API key 未配置，请联系开发者');
      }

      const prompt = this.FORMATTING_PROMPT.replace('{text}', text);

      const messages: DeepSeekMessage[] = [
        {
          role: 'user',
          content: prompt
        }
      ];

      console.log('Calling DeepSeek API...');
      const response = await this.callAPI(messages);
      console.log('DeepSeek API response received');

      // Extract the formatted text from the response
      const formattedText = this.parseResponse(response);

      return formattedText;
    } catch (error) {
      console.error('DeepSeek API error:', error);

      // Provide more specific error messages
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('网络连接失败，请检查网络或稍后重试');
      }
      if (error instanceof Error && error.message.includes('API key 未配置')) {
        throw error;
      }
      if (error instanceof Error && error.message.includes('API request failed')) {
        throw new Error('API 请求失败，请稍后重试');
      }

      throw new Error('格式化失败，请稍后重试');
    }
  }

  private static async callAPI(messages: DeepSeekMessage[]): Promise<DeepSeekResponse> {
    const url = `${this.CONFIG.baseURL}/chat/completions`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: this.CONFIG.model,
        messages: messages,
        temperature: 0.1, // Low temperature for consistent formatting
        max_tokens: 4000,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const data: DeepSeekResponse = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error('API returned no choices');
    }

    return data;
  }

  private static parseResponse(response: DeepSeekResponse): string {
    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('API response missing content');
    }

    // Clean up the response (remove any extra explanations)
    return content.trim();
  }

  // Validate that the original content is preserved in the formatted version
  private static validateContentPreservation(original: string, formatted: string): boolean {
    // Remove markdown syntax to compare plain text content
    const cleanOriginal = this.removeMarkdownSyntax(original);
    const cleanFormatted = this.removeMarkdownSyntax(formatted);

    // Allow for minor whitespace differences but ensure core content is the same
    const normalizedOriginal = cleanOriginal.replace(/\s+/g, ' ').trim();
    const normalizedFormatted = cleanFormatted.replace(/\s+/g, ' ').trim();

    return normalizedOriginal === normalizedFormatted;
  }

  // Remove markdown syntax to get plain text for comparison
  private static removeMarkdownSyntax(text: string): string {
    return text
      // Remove headers
      .replace(/^#{1,6}\s*/gm, '')
      // Remove bold/italic
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Remove code blocks and inline code
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      // Remove links
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove list markers
      .replace(/^[\s]*[-\*\+]\s*/gm, '')
      .replace(/^[\s]*\d+\.\s*/gm, '')
      // Remove blockquotes
      .replace(/^>\s*/gm, '')
      // Remove strikethrough
      .replace(/~~([^~]+)~~/g, '$1')
      // Remove table syntax (simplified)
      .replace(/\|/g, ' ')
      .trim();
  }

  // Test API connectivity
  static async testConnection(): Promise<boolean> {
    try {
      const testMessages: DeepSeekMessage[] = [
        { role: 'user', content: 'Hello' }
      ];

      await this.callAPI(testMessages);
      return true;
    } catch (error) {
      console.error('DeepSeek API connection test failed:', error);
      return false;
    }
  }
}
