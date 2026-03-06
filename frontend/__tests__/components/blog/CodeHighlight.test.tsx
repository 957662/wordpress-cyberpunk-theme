/**
 * CodeHighlight Component Tests
 * 代码高亮组件测试
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CodeHighlight, InlineCode, CodeBlock } from '@/components/blog/CodeHighlight';

describe('CodeHighlight Component', () => {
  const mockCode = `
    function hello() {
      console.log('Hello, World!');
    }
  `;

  describe('CodeHighlight', () => {
    it('应该渲染代码高亮组件', () => {
      render(<CodeHighlight code={mockCode} language="typescript" />);
      expect(screen.getByText(/function hello/)).toBeInTheDocument();
    });

    it('应该显示语言标签', () => {
      render(<CodeHighlight code={mockCode} language="typescript" />);
      expect(screen.getByText('typescript')).toBeInTheDocument();
    });

    it('应该显示文件名', () => {
      render(
        <CodeHighlight
          code={mockCode}
          language="typescript"
          filename="utils.ts"
        />
      );
      expect(screen.getByText('utils.ts')).toBeInTheDocument();
    });

    it('应该支持复制代码功能', async () => {
      const mockWriteText = jest.fn();
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText
        }
      });

      render(<CodeHighlight code={mockCode} language="typescript" />);

      const copyButton = screen.getByTitle('复制代码');
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith(mockCode.trim());
      });
    });

    it('应该支持折叠功能', () => {
      render(<CodeHighlight code={mockCode} language="typescript" />);

      const collapseButton = screen.getByTitle('收起代码');
      fireEvent.click(collapseButton);

      expect(screen.getByTitle('展开代码')).toBeInTheDocument();
    });

    it('应该显示行号', () => {
      const { container } = render(
        <CodeHighlight
          code={mockCode}
          language="typescript"
          showLineNumbers={true}
        />
      );

      const lineNumbers = container.querySelectorAll('.react-syntax-highlighter-line-number');
      expect(lineNumbers.length).toBeGreaterThan(0);
    });
  });

  describe('InlineCode', () => {
    it('应该渲染行内代码', () => {
      render(<InlineCode>const x = 1;</InlineCode>);
      expect(screen.getByText('const x = 1;')).toBeInTheDocument();
    });

    it('应该应用正确的样式类', () => {
      const { container } = render(<InlineCode>code</InlineCode>);
      const codeElement = container.querySelector('code');
      expect(codeElement).toHaveClass('px-1.5', 'py-0.5');
    });
  });

  describe('CodeBlock', () => {
    it('应该渲染代码块', () => {
      render(<CodeBlock language="javascript">{mockCode}</CodeBlock>);
      expect(screen.getByText(/function hello/)).toBeInTheDocument();
    });

    it('应该默认使用 typescript 语言', () => {
      render(<CodeBlock>{mockCode}</CodeBlock>);
      expect(screen.getByText('typescript')).toBeInTheDocument();
    });
  });
});
