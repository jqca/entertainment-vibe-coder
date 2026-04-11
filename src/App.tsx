import { useState } from 'react';
import { Clapperboard, Code2, Activity } from 'lucide-react';
import './index.css';
import { useCases } from './data/useCases';
import type { UseCase } from './data/useCases';
import AIChat from './components/AIChat';
import CodeEditor from './components/CodeEditor';
import LivePreview from './components/LivePreview';

type AppState = 'idle' | 'selected' | 'generating' | 'complete';

function App() {
  const [activeUseCase, setActiveUseCase] = useState<UseCase | null>(null);
  const [appState, setAppState] = useState<AppState>('idle');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleSelect = (id: string) => {
    const uc = useCases.find((u) => u.id === id) || null;
    setActiveUseCase(uc);
    setAppState('selected');
    // Reset code when selecting a new usecase
    setGeneratedCode('');
  };

  const handleGenerate = () => {
    if (!activeUseCase) return;
    setAppState('generating');
    setGeneratedCode(activeUseCase.codeSnippet);
  };

  const handleCodeComplete = () => {
    setAppState('complete');
  };

  const isLongevity = activeUseCase
    ? activeUseCase.id.includes('vqe') || activeUseCase.id.includes('qaoa') || activeUseCase.id.includes('walk') || activeUseCase.id.includes('epigenetic')
    : false;

  return (
    <div className={`app-container${isLongevity ? ' longevity-focus' : ''}`}>
      {/* Left Pane: Entertainment DX */}
      <div className="pane glass-panel" style={{ flex: '0 0 340px' }}>
        <div className="pane-header">
          <Clapperboard size={18} color="var(--quantum-green)" />
          <span>Entertainment DX</span>
        </div>
        <div className="pane-content" style={{ display: 'flex', flexDirection: 'column' }}>
          <AIChat
            useCases={useCases}
            activeId={activeUseCase?.id || ''}
            onSelect={handleSelect}
            prompt={activeUseCase?.prompt || ''}
            onGenerate={handleGenerate}
            isGenerating={appState === 'generating'}
          />
        </div>
      </div>

      {/* Center Pane: Creative Engine */}
      <div className="pane glass-panel" style={{ flex: '1' }}>
        <div className="pane-header">
          <Code2 size={18} color="var(--quantum-blue)" />
          <span>Creative Engine</span>
        </div>
        <div className="pane-content" style={{ display: 'flex', flexDirection: 'column' }}>
          <CodeEditor
            code={generatedCode}
            isGenerating={appState === 'generating'}
            onComplete={handleCodeComplete}
          />
        </div>
      </div>

      {/* Right Pane: Live Stage */}
      <div className="pane glass-panel" style={{ flex: '1' }}>
        <div className="pane-header">
          <Activity size={18} color="var(--text-main)" />
          <span>Live Stage</span>
        </div>
        <div className="pane-content" style={{ display: 'flex', flexDirection: 'column' }}>
          <LivePreview
            activeUseCase={activeUseCase}
            appState={appState}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
