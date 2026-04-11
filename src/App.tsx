import { useState } from 'react';
import './index.css';
import { useCases } from './data/useCases';
import AIChat from './components/AIChat';
import CodeEditor from './components/CodeEditor';
import LivePreview from './components/LivePreview';

function App() {
  const [activeId, setActiveId] = useState<string>(useCases[0].id);
  const activeUseCase = useCases.find((uc) => uc.id === activeId) || useCases[0];

  const handleSelect = (id: string) => {
    setActiveId(id);
  };

  // Mega hits, virality, and intense emotional optimization trigger Viral Cyber Pink mode
  const isViralMode = activeUseCase.id.includes('prediction') || activeUseCase.id.includes('dopamine') || activeUseCase.id.includes('arbitrage') || activeUseCase.id.includes('hook') || activeUseCase.id.includes('story');

  return (
    <div className={`app-container ${isViralMode ? 'viral-mode' : ''}`}>
      <div className="pane left-pane">
        <h2 className="pane-title">Creator Console</h2>
        <AIChat useCases={useCases} activeId={activeId} onSelect={handleSelect} />
      </div>
      
      <div className="pane center-pane">
        <h2 className="pane-title">Media AI Core</h2>
        <CodeEditor code={activeUseCase.codeSnippet} />
      </div>

      <div className="pane right-pane">
        <h2 className="pane-title">Global Virality</h2>
        <LivePreview activeUseCase={activeUseCase} />
      </div>
    </div>
  );
}

export default App;
