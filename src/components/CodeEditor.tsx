import React from 'react';

interface Props {
  code: string;
}

const CodeEditor: React.FC<Props> = ({ code }) => {
  const renderHighlighted = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      let html = line;
      html = html.replace(/\b(import|from|def|return|if|else|for|in|while|class)\b/g, '<span class="keyword">$1</span>');
      html = html.replace(/([a-zA-Z_]\w*)\(/g, '<span class="function">$1</span>(');
      html = html.replace(/(["'].*?["'])/g, '<span class="string">$1</span>');
      html = html.replace(/(#.*)/g, '<span class="comment">$1</span>');
      
      return (
        <div key={i} dangerouslySetInnerHTML={{ __html: html || ' ' }} />
      );
    });
  };

  return (
    <div className="code-area">
      {renderHighlighted(code)}
    </div>
  );
};

export default CodeEditor;
