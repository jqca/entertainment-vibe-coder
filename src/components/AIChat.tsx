import React from 'react';
import { Play } from 'lucide-react';
import type { UseCase } from '../data/useCases';

interface Props {
  useCases: UseCase[];
  activeId: string;
  onSelect: (id: string) => void;
}

const AIChat: React.FC<Props> = ({ useCases, activeId, onSelect }) => {
  const activeUseCase = useCases.find((uc) => uc.id === activeId);

  return (
    <>
      <div className="usecase-list">
        {useCases.map((uc) => {
          const isViral = uc.id.includes('prediction') || uc.id.includes('dopamine') || uc.id.includes('arbitrage') || uc.id.includes('hook') || uc.id.includes('story');
          let actClass = isViral ? 'viral-item' : '';

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
        <form onSubmit={(e) => e.preventDefault()}>
          <textarea
            value={activeUseCase?.prompt || ''}
            readOnly
          />
          <button type="submit" className="btn-send">
            <Play size={22} fill="currentColor" />
          </button>
        </form>
      </div>
    </>
  );
};

export default AIChat;
