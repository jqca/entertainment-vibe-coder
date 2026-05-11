import React, { useState, useCallback, useEffect } from 'react';
import type { UseCase } from '../data/useCases';
import { Truck, TrendingUp, TrendingDown, Zap, ShieldCheck, Target, Play, RotateCcw } from 'lucide-react';
import VizCanvas, { getVizType } from './VizCanvas';

const parseToSeconds = (timeStr: string): number | null => {
  if (!timeStr) return null;
  if (/即時|リアルタイム/.test(timeStr)) return 0.05;
  if (/日次|翌朝/.test(timeStr)) return 86400;
  const weekMatch = timeStr.match(/([\d.]+)\s*週間/);
  if (weekMatch) return parseFloat(weekMatch[1]) * 7 * 86400;
  const monthMatch = timeStr.match(/([\d.]+)\s*[ヶヵ]月/);
  if (monthMatch) return parseFloat(monthMatch[1]) * 30 * 86400;
  const numMatch = timeStr.match(/([\d.]+)/);
  if (!numMatch) return null;
  const num = parseFloat(numMatch[1]);
  if (timeStr.includes('ms')) return num / 1000;
  if (timeStr.includes('秒')) return num;
  if (timeStr.includes('分')) return num * 60;
  if (timeStr.includes('時間')) return num * 3600;
  if (timeStr.includes('日')) return num * 86400;
  return num;
};

const fmtTime = (sec: number): string => {
  if (sec < 0.001) return `${(sec * 1_000_000).toFixed(0)}us`;
  if (sec < 1)     return `${(sec * 1000).toFixed(0)}ms`;
  if (sec < 60)    return `${sec < 10 ? sec.toFixed(2) : sec.toFixed(1)}秒`;
  if (sec < 3600)  return `${(sec / 60).toFixed(1)}分`;
  if (sec < 86400) return `${(sec / 3600).toFixed(1)}時間`;
  if (sec < 86400 * 30) return `${(sec / 86400).toFixed(1)}日`;
  return `${(sec / (86400 * 30)).toFixed(1)}ヶ月`;
};

interface Props {
  activeUseCase: UseCase;
}

const LivePreview: React.FC<Props> = ({ activeUseCase }) => {
  const [optimizationLevel, setOptimizationLevel] = useState(50);
  const [dataSize, setDataSize] = useState(5000);
  const [isRunning, setIsRunning] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [useQuantum, setUseQuantum] = useState(true);
  const [progress, setProgress] = useState(0);

  const isActionMode = activeUseCase.id.includes('esports') || activeUseCase.id.includes('matchmaking') || activeUseCase.id.includes('moderation') || activeUseCase.id.includes('churn');

  useEffect(() => {
    setIsOptimized(false);
    setIsRunning(false);
    setSelectedNode(null);
    setProgress(0);
    setOptimizationLevel(50);
    setDataSize(5000);
  }, [activeUseCase.id]);

  const statusClass = isActionMode || isOptimized ? 'action-mode' : '';

  const getTrendIcon = (trend: string, active: boolean) => {
    const color = active ? "#eab308" : "#2dd4bf";
    if (trend === 'up') return <TrendingUp size={20} color={color} />;
    if (trend === 'down') return <TrendingDown size={20} color={color} />;
    return <Truck size={20} color={color} />;
  };

  const handleRunSimulation = useCallback(() => {
    setIsRunning(true);
    setIsOptimized(false);
    setProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsRunning(false);
          setIsOptimized(true);
          setProgress(0);
        }, 300);
      }
      setProgress(Math.min(p, 100));
    }, 120);
  }, []);

  const handleReset = useCallback(() => {
    setIsOptimized(false);
    setIsRunning(false);
    setProgress(0);
    setOptimizationLevel(50);
    setDataSize(5000);
    setSelectedNode(null);
    setUseQuantum(true);
  }, []);

  const getAdjustedValue = (value: string, trend: 'up' | 'down' | 'neutral') => {
    if (!isOptimized) return value;
    const match = value.match(/([\d.]+)/);
    if (!match) return value;
    const num = parseFloat(match[1]);
    const qBoost = useQuantum ? 1.15 : 1.0;
    const factor = (optimizationLevel / 100) * qBoost;
    const adjusted = trend === 'down'
      ? num * (1 - factor * 0.25)
      : num * (1 + factor * 0.3);
    const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0;
    return value.replace(match[1], adjusted.toFixed(decimals));
  };

  const vizLabels: Record<string, { idle: string; running: string; done: string }> = {
    recommendation: { idle: '推薦モデル待機',           running: 'パーソナライズ最適化中',     done: '推薦最適化完了' },
    ticket:         { idle: '価格モデル待機',           running: '動的価格最適化中',           done: '価格最適化完了' },
    boxoffice:      { idle: '予測モデル待機',           running: '興行予測実行中',             done: '興行予測完了' },
    music:          { idle: '音響分析待機',             running: 'ヒット予測実行中',           done: 'ヒット予測完了' },
    matchmaking:    { idle: 'マッチング待機',           running: 'マッチメイキング最適化中',   done: 'マッチング完了' },
    acoustics:      { idle: '音場モデル待機',           running: '音響最適化実行中',           done: '音響最適化完了' },
    vfx:            { idle: 'ノード待機',               running: 'レンダリング最適化中',       done: 'レンダ最適化完了' },
    anime:          { idle: '工程表待機',               running: '制作工程最適化中',           done: '工程最適化完了' },
    cdn:            { idle: '配信網待機',               running: 'CDN最適化実行中',            done: 'CDN最適化完了' },
    ad:             { idle: '挿入点分析待機',           running: '広告最適化実行中',           done: '広告最適化完了' },
    esports:        { idle: '戦略分析待機',             running: '戦略最適化実行中',           done: '戦略最適化完了' },
    themepark:      { idle: '来場予測待機',             running: '動線最適化実行中',           done: '動線最適化完了' },
    broadcast:      { idle: '編成データ待機',           running: '編成最適化実行中',           done: '編成最適化完了' },
    ip:             { idle: 'IP評価待機',               running: 'IP価値分析実行中',           done: 'IP評価完了' },
    voice:          { idle: '音声モデル待機',           running: '音声合成最適化中',           done: '音声最適化完了' },
    arvr:           { idle: 'VRモデル待機',             running: 'VR体験最適化中',             done: 'VR最適化完了' },
    churn:          { idle: 'リスク分析待機',           running: '解約予測実行中',             done: '解約予測完了' },
    moderation:     { idle: 'スキャン待機',             running: 'コンテンツスキャン中',       done: 'スキャン完了' },
    metaverse:      { idle: '空間設計待機',             running: 'メタバース最適化中',         done: '空間最適化完了' },
    nft:            { idle: '市場分析待機',             running: 'NFT分析実行中',              done: 'NFT分析完了' },
    engagement:     { idle: 'セグメント待機',           running: 'エンゲージメント最適化中',   done: 'エンゲージメント完了' },
  };

  const getVizLabel = () => {
    const type = getVizType(activeUseCase.id);
    const labels = vizLabels[type] || vizLabels.recommendation;
    if (isRunning) return `${labels.running} ${Math.round(progress)}%`;
    if (isOptimized) return `${labels.done} (${useQuantum ? '量子' : '古典'})`;
    return labels.idle;
  };

  return (
    <div className="preview-container">
      <div className={`visualization-box ${statusClass} ${isRunning ? 'viz-running' : ''}`}>
        <VizCanvas
          vizType={getVizType(activeUseCase.id)}
          running={isRunning}
          optimized={isOptimized}
          progress={progress}
          optLevel={optimizationLevel}
          selectedNode={selectedNode}
          onNodeClick={(id) => setSelectedNode(selectedNode === id ? null : id)}
        />

        {isRunning && (
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className={`viz-overlay ${statusClass}`}>{getVizLabel()}</div>
      </div>

      <div className="control-panel">
        <div className="control-sliders">
          <div className="control-group">
            <label className="control-label">
              最適化レベル
              <span className="control-value">{optimizationLevel}%</span>
            </label>
            <input
              type="range" min="10" max="100" value={optimizationLevel}
              onChange={(e) => { setOptimizationLevel(Number(e.target.value)); setIsOptimized(false); }}
              className="control-slider"
              disabled={isRunning}
            />
          </div>
          <div className="control-group">
            <label className="control-label">
              データ件数
              <span className="control-value">{dataSize.toLocaleString()}件</span>
            </label>
            <input
              type="range" min="1000" max="10000" step="500" value={dataSize}
              onChange={(e) => { setDataSize(Number(e.target.value)); setIsOptimized(false); }}
              className="control-slider"
              disabled={isRunning}
            />
          </div>
        </div>

        <div className="control-actions">
          <div className="toggle-group">
            <button
              className={`toggle-btn ${useQuantum ? 'active' : ''}`}
              onClick={() => { setUseQuantum(true); setIsOptimized(false); }}
              disabled={isRunning}
            >
              量子
            </button>
            <button
              className={`toggle-btn ${!useQuantum ? 'active' : ''}`}
              onClick={() => { setUseQuantum(false); setIsOptimized(false); }}
              disabled={isRunning}
            >
              古典
            </button>
          </div>

          <button
            className={`run-btn ${isRunning ? 'running' : ''}`}
            onClick={handleRunSimulation}
            disabled={isRunning}
          >
            <Play size={13} />
            {isRunning ? '実行中...' : 'シミュレーション実行'}
          </button>

          <button className="reset-btn" onClick={handleReset} disabled={isRunning}>
            <RotateCcw size={13} />
            リセット
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        {activeUseCase.metrics.map((m, idx) => (
          <div key={idx} className={`metric-card ${statusClass} ${isOptimized ? 'metric-optimized' : ''}`}>
            <div>
              <div className="metric-label">{m.label}</div>
              <div className={`metric-value ${isOptimized ? 'metric-value-updated' : ''}`}>
                {getAdjustedValue(m.value, m.trend)}
              </div>
              {isOptimized && <div className="metric-badge">最適化済</div>}
            </div>
            <div>{getTrendIcon(m.trend, !!(isActionMode || isOptimized))}</div>
          </div>
        ))}
      </div>

      <div className="insights-panel">
        <div className={`insight-card impact-card ${statusClass}`}>
          <div className="card-header">
            <Target size={16} className="insight-icon" />
            <span>経営インパクト (Business Impact)</span>
          </div>
          <div className="card-body impact-text">{activeUseCase.businessImpact}</div>
        </div>

        <div className={`insight-card qvc-card ${statusClass}`}>
          <div className="card-header">
            <Zap size={16} className="insight-icon" />
            <span>量子 vs 古典 - 規模別比較</span>
          </div>
          <div className="card-body">
            {(() => {
              const cSec = parseToSeconds(activeUseCase.quantumVsClassical.classicalTime);
              const qSec = parseToSeconds(activeUseCase.quantumVsClassical.quantumTime);
              const scales = [
                {
                  label: '小規模',
                  sublabel: '~1,000件',
                  cMult: 0.04,
                  qMult: 0.18,
                  classicalComment: '古典計算でも許容範囲内',
                  quantumComment: '量子優位性は限定的・コスト対効果を要検討',
                  verdict: '古典で対応可能',
                  verdictClass: 'verdict-neutral',
                },
                {
                  label: '中規模',
                  sublabel: '1,000~10,000件',
                  cMult: 1.0,
                  qMult: 1.0,
                  classicalComment: '処理時間が長くなり業務効率への影響が顕在化',
                  quantumComment: '量子優位性が明確に現れ始める規模',
                  verdict: '量子優位性が顕在化',
                  verdictClass: 'verdict-quantum',
                },
                {
                  label: '大規模',
                  sublabel: '10,000件超',
                  cMult: 16.0,
                  qMult: 3.5,
                  classicalComment: '実用的な時間内での処理はほぼ不可能',
                  quantumComment: '量子処理が事実上の必須要件',
                  verdict: '量子処理が必須',
                  verdictClass: 'verdict-critical',
                },
              ];
              return (
                <div className="qvc-scales">
                  {scales.map((s) => {
                    const cTime = cSec != null ? fmtTime(cSec * s.cMult) : activeUseCase.quantumVsClassical.classicalTime;
                    const qTime = qSec != null ? fmtTime(qSec * s.qMult) : activeUseCase.quantumVsClassical.quantumTime;
                    const ratio = (cSec != null && qSec != null && qSec * s.qMult > 0)
                      ? Math.round((cSec * s.cMult) / (qSec * s.qMult))
                      : null;
                    return (
                      <div key={s.label} className="qvc-scale-block">
                        <div className="qvc-scale-header">
                          <span className="qvc-scale-label">{s.label}</span>
                          <span className="qvc-scale-sublabel">{s.sublabel}</span>
                          <span className={`qvc-verdict ${s.verdictClass}`}>{s.verdict}</span>
                        </div>
                        <div className="qvc-scale-rows">
                          <div className="qvc-scale-row">
                            <span className="qvc-scale-type classical-type">古典</span>
                            <span className="qvc-time classical-time">{cTime}</span>
                            <span className="qvc-scale-comment">{s.classicalComment}</span>
                          </div>
                          <div className="qvc-scale-row">
                            <span className="qvc-scale-type quantum-type">量子</span>
                            <span className="qvc-time quantum-time">{qTime}</span>
                            <span className="qvc-scale-comment">{s.quantumComment}</span>
                          </div>
                          {ratio != null && ratio > 1 && (
                            <div className="qvc-speedup">
                              量子が <strong>{ratio.toLocaleString()}倍</strong> 高速
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="advantage-text" style={{ marginTop: '8px' }}>
                    {activeUseCase.quantumVsClassical.advantage}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className={`insight-card verify-card ${statusClass}`}>
          <div className="card-header">
            <ShieldCheck size={16} className="insight-icon" />
            <span>検証・信頼性サマリー (Safety & Compliance)</span>
          </div>
          <div className="card-body verify-text">{activeUseCase.verificationSummary}</div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
