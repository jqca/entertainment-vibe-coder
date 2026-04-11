import { useEffect, useState, useRef } from 'react';

interface Props {
  code: string;
  isGenerating: boolean;
  onComplete: () => void;
}

export default function CodeEditor({ code, isGenerating, onComplete }: Props) {
  const [displayCode, setDisplayCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Typing effect - only starts when isGenerating becomes true
  useEffect(() => {
    if (!code || !isGenerating) {
      if (!code) setDisplayCode('');
      return;
    }

    let i = 0;
    setDisplayCode('');
    setIsTyping(true);
    // Target ~60 seconds total, calculate per-character delay
    const targetDurationMs = 30000;
    const delayPerChar = Math.max(1, Math.floor(targetDurationMs / code.length));
    // Type multiple chars per tick if delay would be < 1ms
    const charsPerTick = delayPerChar < 5 ? Math.ceil(5 / delayPerChar) : 1;
    const tickInterval = Math.max(5, delayPerChar);
    const interval = setInterval(() => {
      const chunk = code.slice(i, i + charsPerTick);
      setDisplayCode(prev => prev + chunk);
      i += charsPerTick;
      if (i >= code.length) {
        setDisplayCode(code); // ensure full code is displayed
        clearInterval(interval);
        setIsTyping(false);
        onComplete();
      }
    }, tickInterval);

    return () => clearInterval(interval);
  }, [code, isGenerating]);

  // Auto-scroll to bottom as code is typed
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayCode]);

  // Basic syntax highlighting
  const highlightLine = (line: string): string => {
    let html = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    html = html.replace(/\b(import|from|def|return|if|else|elif|for|in|while|class|print|with|as|try|except|raise|yield|lambda|not|and|or|True|False|None)\b/g, '<span class="keyword">$1</span>');
    html = html.replace(/([a-zA-Z_]\w*)\(/g, '<span class="function">$1</span>(');
    html = html.replace(/(["'].*?["'])/g, '<span class="string">$1</span>');
    html = html.replace(/(#.*)/g, '<span class="comment">$1</span>');
    html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');
    return html;
  };

  return (
    <div ref={containerRef} style={{
      height: '100%',
      fontFamily: 'var(--font-mono)',
      padding: '16px',
      fontSize: '0.8rem',
      lineHeight: '1.7',
      background: '#0d1117',
      overflow: 'auto',
      position: 'relative'
    }}>
      {displayCode.length === 0 ? (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'var(--quantum-blue)'
        }}>
          {isGenerating ? (
            <>
              <div style={{ fontSize: '2rem', marginBottom: '8px', animation: 'pulse-glow 2s infinite' }}>⚡</div>
              <span style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>Quantum Realm でコード生成中...</span>
            </>
          ) : (
            <>
              <div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.4 }}>{'</>'}</div>
              <span style={{ fontSize: '0.85rem', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                ユースケースを選択してプロンプトを実行してください
              </span>
            </>
          )}
        </div>
      ) : (
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', filter: 'blur(2.5px)', opacity: 0.75, userSelect: 'none', pointerEvents: 'none' }}>
          <code>
            {displayCode.split('\n').map((line, idx) => (
              <div key={idx} style={{ display: 'flex' }}>
                <span style={{
                  minWidth: '36px',
                  textAlign: 'right',
                  paddingRight: '12px',
                  color: 'rgba(255, 255, 255, 0.2)',
                  userSelect: 'none',
                  flexShrink: 0,
                }}>
                  {idx + 1}
                </span>
                <span dangerouslySetInnerHTML={{ __html: highlightLine(line) || ' ' }} />
              </div>
            ))}
            {isTyping && (
              <span style={{
                display: 'inline-block',
                width: '8px',
                height: '16px',
                background: 'var(--quantum-green)',
                animation: 'cursor-blink 1s step-end infinite',
                verticalAlign: 'text-bottom',
                marginLeft: '2px',
              }} />
            )}
          </code>
        </pre>
      )}
      <style>{`
        @keyframes cursor-blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
