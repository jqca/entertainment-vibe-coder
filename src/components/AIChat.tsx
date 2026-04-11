import React from 'react';
import { FastForward, Loader2 } from 'lucide-react';
import type { UseCase } from '../data/useCases';

interface Props {
  useCases: UseCase[];
  activeId: string;
  onSelect: (id: string) => void;
  prompt: string;
  onGenerate: () => void;
  isGenerating: boolean;
}

const AIChat: React.FC<Props> = ({ useCases, activeId, onSelect, prompt, onGenerate, isGenerating }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeId && !isGenerating) {
      onGenerate();
    }
  };

  return (
    <>
      <div className="usecase-list">
        {useCases.map((uc) => {
          const isLongevity = uc.id.includes('vqe') || uc.id.includes('qaoa') || uc.id.includes('walk') || uc.id.includes('epigenetic');
          const actClass = isLongevity ? 'longevity-item' : 'vital-item';

          return (
            <div
              key={uc.id}
              className={`usecase-item ${activeId === uc.id ? 'active' : ''} ${actClass}`}
              onClick={() => onSelect(uc.id)}
            >
              <h3>{uc.title}</h3>
              <p>{uc.description}</p>
            </div>
          );
        })}
      </div>
      <div className="prompt-area">
        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            readOnly
            placeholder="ユースケースを選択してください..."
          />
          <button
            type="submit"
            className="btn-send"
            disabled={!activeId || isGenerating}
            style={{ opacity: !activeId || isGenerating ? 0.4 : 1 }}
          >
            {isGenerating ? <Loader2 size={20} className="anim-spin" /> : <FastForward size={20} />}
          </button>
        </form>
      </div>
    </>
  );
};

export default AIChat;
