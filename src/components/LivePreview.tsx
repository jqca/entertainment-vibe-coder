import React, { useEffect, useState } from 'react';
import type { UseCase } from '../data/useCases';
import { Radio, Flame, TrendingUp, TrendingDown, Music } from 'lucide-react';
interface Props {
  activeUseCase: UseCase;
}

const LivePreview: React.FC<Props> = ({ activeUseCase }) => {
  const [triggerPulse, setTriggerPulse] = useState(false);
  const isViralMode = activeUseCase.id.includes('prediction') || activeUseCase.id.includes('dopamine') || activeUseCase.id.includes('arbitrage') || activeUseCase.id.includes('hook') || activeUseCase.id.includes('story');
  
  let statusClass = isViralMode ? 'viral-mode' : '';

  useEffect(() => {
    setTriggerPulse(false);
    const timer = setTimeout(() => setTriggerPulse(true), 100);
    return () => clearTimeout(timer);
  }, [activeUseCase.id]);

  const getTrendIcon = (trend: string) => {
    const color = isViralMode ? "#ec4899" : "#06b6d4";
    if (trend === 'up') return <TrendingUp size={28} color={color} strokeWidth={3} />;
    if (trend === 'down') return <TrendingDown size={28} color={color} strokeWidth={3} />;
    return <Music size={28} color={color} strokeWidth={3} />;
  };

  return (
    <div className="preview-container">
      <div className={`visualization-box ${statusClass}`}>
        
        {/* Generative Audience Nodes */}
        <div className="audience-node n1"></div>
        <div className="audience-node n2"></div>
        <div className="audience-node n3"></div>
        <div className="audience-node n4"></div>
        <div className="audience-node n5"></div>
        <div className="audience-node n6"></div>
        <div className="audience-node n7"></div>
        <div className="audience-node n8"></div>
        
        {/* Core Media Node */}
        <div className="core-node"></div>
        
        {/* Emotional Sine Waves */}
        <div className="sine-wave w1"></div>
        <div className="sine-wave w2"></div>
        <div className="sine-wave w3"></div>
        
        {/* Viral Shockwave */}
        {triggerPulse && <div className="shockwave"></div>}
        
        <div className={`viz-overlay ${statusClass}`}>
            {isViralMode ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Flame size={18} /> VIRAL EVENT DETECTED</span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Radio size={18} /> BROADCAST NOMINAL</span>
            )}
        </div>
      </div>
      
      <div className="metrics-grid">
        {activeUseCase.metrics.map((m, idx) => (
          <div key={idx} className={`metric-card ${statusClass}`}>
            <div>
              <div className="metric-label">{m.label}</div>
              <div className="metric-value">{m.value}</div>
            </div>
            <div>
               {getTrendIcon(m.trend)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivePreview;
