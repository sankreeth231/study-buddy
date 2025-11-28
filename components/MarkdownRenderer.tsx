import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// A simplified markdown parser for the specific needs of the chat
// In a real production app, we might use 'react-markdown' or 'remark'
// avoiding external deps here for the single-file constraint robustness
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  
  // Basic processing to handle newlines and bold text safely
  const processText = (text: string) => {
    // Split by code blocks first
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Code block
        const codeContent = part.slice(3, -3).replace(/^.*\n/, ''); // Remove first line (lang)
        return (
          <pre key={index} className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto my-2 text-sm font-mono">
            <code>{codeContent}</code>
          </pre>
        );
      }
      
      // Regular text processing (Bold, Italic, Newlines)
      // This is a very basic implementation. 
      const lines = part.split('\n');
      return (
        <span key={index}>
          {lines.map((line, i) => (
            <React.Fragment key={i}>
              <span dangerouslySetInnerHTML={{ 
                __html: line
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
                  .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
                  .replace(/`(.*?)`/g, '<code>$1</code>') // Inline Code
              }} />
              {i < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
      );
    });
  };

  return (
    <div className={`markdown-body ${className}`}>
      {processText(content)}
    </div>
  );
};

export default MarkdownRenderer;
