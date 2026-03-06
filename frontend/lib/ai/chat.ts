/**
 * AI Chat utilities for the AI Assistant
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ChatContext {
  conversationHistory: ChatMessage[];
  userPreferences?: Record<string, any>;
  sessionData?: Record<string, any>;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  actions?: ChatAction[];
}

export interface ChatAction {
  label: string;
  action: string;
  params?: Record<string, any>;
}

/**
 * Generate AI response based on context
 */
export async function generateResponse(
  message: string,
  context: ChatContext
): Promise<ChatResponse> {
  // Analyze the message intent
  const intent = analyzeIntent(message);

  // Generate response based on intent
  switch (intent.type) {
    case 'greeting':
      return handleGreeting(intent);
    case 'question':
      return handleQuestion(message, context);
    case 'request':
      return handleRequest(intent, context);
    case 'feedback':
      return handleFeedback(message);
    default:
      return handleGeneric(message);
  }
}

/**
 * Analyze message intent
 */
function analyzeIntent(message: string): { type: string; confidence: number; entities?: string[] } {
  const lower = message.toLowerCase();

  // Greeting patterns
  if (lower.match(/^(你好|hi|hello|嗨|您好)/)) {
    return { type: 'greeting', confidence: 0.9 };
  }

  // Question patterns
  if (lower.includes('?') || lower.includes('吗') || lower.includes('什么') || lower.includes('怎么') || lower.includes('如何')) {
    return { type: 'question', confidence: 0.8 };
  }

  // Request patterns
  if (lower.includes('帮我') || lower.includes('请') || lower.includes('想要') || lower.includes('需要')) {
    return { type: 'request', confidence: 0.7 };
  }

  // Feedback patterns
  if (lower.includes('不错') || lower.includes('很好') || lower.includes('谢谢') || lower.includes('感谢')) {
    return { type: 'feedback', confidence: 0.8 };
  }

  return { type: 'general', confidence: 0.5 };
}

/**
 * Handle greeting messages
 */
function handleGreeting(intent: any): ChatResponse {
  const greetings = [
    '你好！很高兴为你服务。有什么我可以帮助你的吗？',
    '嗨！我是AI助手，随时准备为你提供帮助。',
    '你好！今天有什么可以帮到你的？'
  ];

  return {
    message: greetings[Math.floor(Math.random() * greetings.length)],
    suggestions: [
      '如何使用博客功能？',
      '怎么写文章？',
      '有哪些功能？'
    ]
  };
}

/**
 * Handle questions
 */
function handleQuestion(message: string, context: ChatContext): ChatResponse {
  // Check if it's a FAQ question
  const faqs = {
    '博客': '博客功能让你可以发布和管理文章，支持Markdown编辑、代码高亮等功能。',
    '文章': '你可以创建、编辑、删除文章，并设置分类和标签。',
    '评论': '文章支持评论功能，读者可以发表评论和互动。',
    '搜索': '使用搜索功能可以快速找到你感兴趣的文章和内容。',
    '个人资料': '在个人资料页面可以管理你的信息和偏好设置。'
  };

  for (const [keyword, answer] of Object.entries(faqs)) {
    if (message.includes(keyword)) {
      return {
        message: answer,
        suggestions: [
          `了解更多关于${keyword}`,
          '返回首页'
        ]
      };
    }
  }

  // Generic question response
  return {
    message: `关于"${message}"，这是一个很好的问题！让我为你查找相关信息...`,
    suggestions: [
      '查看帮助文档',
      '联系客服'
    ]
  };
}

/**
 * Handle requests
 */
function handleRequest(intent: any, context: ChatContext): ChatResponse {
  return {
    message: '我来帮你处理这个请求。请稍等...',
    actions: [
      { label: '创建新文章', action: 'create_post' },
      { label: '查看文章列表', action: 'list_posts' },
      { label: '管理设置', action: 'open_settings' }
    ]
  };
}

/**
 * Handle feedback
 */
function handleFeedback(message: string): ChatResponse {
  const responses = [
    '谢谢你的反馈！很高兴能帮到你。',
    '不客气！如果还有其他问题，随时告诉我。',
    '感谢！你的反馈对我们很重要。'
  ];

  return {
    message: responses[Math.floor(Math.random() * responses.length)],
    suggestions: [
      '继续提问',
      '结束对话'
    ]
  };
}

/**
 * Handle generic messages
 */
function handleGeneric(message: string): ChatResponse {
  return {
    message: `我收到了你的消息："${message}"。让我想想怎么最好地帮助你...`,
    suggestions: [
      '查看帮助',
      '浏览功能'
    ]
  };
}

/**
 * Generate chat suggestions
 */
export function generateSuggestions(context: ChatContext): string[] {
  const suggestions = [
    '如何发布文章？',
    '怎么编辑个人资料？',
    '如何搜索内容？',
    '有哪些功能？',
    '联系支持'
  ];

  return suggestions.slice(0, 3);
}

/**
 * Format chat history for display
 */
export function formatChatHistory(messages: ChatMessage[]): string {
  return messages
    .map(msg => {
      const role = msg.role === 'user' ? '你' : 'AI助手';
      const time = msg.timestamp.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return `[${time}] ${role}: ${msg.content}`;
    })
    .join('\n\n');
}

/**
 * Export chat conversation
 */
export function exportChat(messages: ChatMessage[], format: 'json' | 'txt' | 'markdown'): string {
  switch (format) {
    case 'json':
      return JSON.stringify(messages, null, 2);

    case 'txt':
      return formatChatHistory(messages);

    case 'markdown':
      return messages
        .map(msg => {
          const role = msg.role === 'user' ? '👤 **用户**' : '🤖 **AI助手**';
          return `### ${role}\n\n${msg.content}\n`;
        })
        .join('\n---\n\n');

    default:
      return formatChatHistory(messages);
  }
}

/**
 * Clear chat history
 */
export function clearChatHistory(): ChatMessage[] {
  return [{
    id: 'welcome',
    role: 'assistant',
    content: '你好！我是AI助手，有什么可以帮助你的吗？',
    timestamp: new Date()
  }];
}

/**
 * Search chat history
 */
export function searchChatHistory(messages: ChatMessage[], query: string): ChatMessage[] {
  const lowerQuery = query.toLowerCase();

  return messages.filter(msg =>
    msg.content.toLowerCase().includes(lowerQuery) ||
    msg.metadata?.keywords?.some((keyword: string) => keyword.toLowerCase().includes(lowerQuery))
  );
}
