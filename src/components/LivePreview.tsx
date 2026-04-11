import React, { useState, useEffect } from 'react';
import type { UseCase } from '../data/useCases';
import { HeartPulse, Play, CheckCircle2, ChevronDown, ChevronUp, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  activeUseCase: UseCase | null;
  appState: 'idle' | 'selected' | 'generating' | 'complete';
}

type OptState = 'ready' | 'optimizing' | 'done';

const LivePreview: React.FC<Props> = ({ activeUseCase, appState }) => {
  const [optState, setOptState] = useState<OptState>('ready');
  const [validationOpen, setValidationOpen] = useState(false);

  useEffect(() => {
    setOptState('ready');
    setValidationOpen(false);
  }, [activeUseCase?.id, appState]);

  const handleOptimize = () => {
    if (optState !== 'ready') return;
    setOptState('optimizing');
    setTimeout(() => setOptState('done'), 3000);
  };

  const isLongevity = activeUseCase
    ? activeUseCase.id.includes('vqe') || activeUseCase.id.includes('qaoa') || activeUseCase.id.includes('walk') || activeUseCase.id.includes('epigenetic')
    : false;
  const accent = isLongevity ? 'var(--quantum-pink)' : 'var(--quantum-green)';
  const accentGlow = isLongevity ? 'rgba(244,114,182,0.3)' : 'rgba(0,255,157,0.3)';

  // --- Idle / Selected ---
  if (!activeUseCase || appState === 'idle' || appState === 'selected') {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
          <HeartPulse size={48} opacity={0.3} style={{ margin: '0 auto 16px', display: 'block' }} />
          <div style={{ fontSize: '0.85rem' }}>
            {appState === 'selected' ? '待機中: プロンプトを実行してアプリを生成してください' : '待機中: 左側のパネルからユースケースを選択してください'}
          </div>
        </div>
      </div>
    );
  }

  // --- Generating ---
  if (appState === 'generating') {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '150px', height: '150px' }}>
          <div style={{ position: 'absolute', inset: 0, border: '2px dashed var(--quantum-blue)', borderRadius: '50%', animation: 'lp-spin 8s linear infinite' }} />
          <div style={{ position: 'absolute', inset: '35px', border: `2px solid ${accent}`, borderRadius: '50%', animation: 'lp-spin 2s linear infinite reverse', boxShadow: `0 0 20px ${accentGlow}` }} />
        </div>
        <style>{lpStyles}</style>
      </div>
    );
  }

  // --- Complete: Interactive App ---
  const bi = activeUseCase.businessImpact;
  const qc = activeUseCase.quantumComparison;
  const val = activeUseCase.validation;
  const db = activeUseCase.dashboard;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'lp-fadeIn 0.5s ease-out' }}>
      {/* Title Bar */}
      <div style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
        <HeartPulse size={14} color={accent} />
        <span style={{ fontWeight: 600 }}>ライブプレビュー</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: optState === 'done' ? accentGlow : 'rgba(255,255,255,0.05)', color: optState === 'done' ? '#000' : 'var(--text-muted)', fontWeight: 600 }}>
          {optState === 'done' ? 'LIVE' : 'STANDBY'}
        </span>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* ===== DASHBOARD: Before/After ===== */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)' }}>{activeUseCase.title}</span>
          </div>

          {/* Table Header */}
          <div style={{ display: 'flex', padding: '6px 8px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            <div style={{ flex: 2 }}>指標</div>
            <div style={{ flex: 1, textAlign: 'right' }}>処理前</div>
            <div style={{ flex: 0, width: '24px' }}></div>
            <div style={{ flex: 1, textAlign: 'right', color: optState === 'done' ? accent : 'var(--text-muted)' }}>
              {optState === 'done' ? '最適化後' : '処理後'}
            </div>
          </div>

          {/* Table Rows */}
          {db.map((row, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              background: row.highlight && optState === 'done' ? 'rgba(0,255,157,0.05)' : 'transparent',
              borderLeft: row.highlight && optState === 'done' ? `3px solid ${accent}` : '3px solid transparent',
              transition: 'all 0.5s ease',
            }}>
              <div style={{ flex: 2, fontSize: '0.7rem', color: 'var(--text-muted)' }}>{row.label}</div>
              <div style={{
                flex: 1, textAlign: 'right', fontSize: '0.75rem', fontWeight: 500,
                color: optState === 'done' ? 'rgba(255,255,255,0.4)' : 'var(--text-main)',
                textDecoration: optState === 'done' ? 'line-through' : 'none',
                transition: 'all 0.5s ease',
              }}>
                {row.before}
              </div>
              <div style={{ flex: 0, width: '24px', display: 'flex', justifyContent: 'center' }}>
                {optState === 'done' && <ArrowRight size={12} color={accent} />}
              </div>
              <div style={{
                flex: 1, textAlign: 'right', fontSize: '0.75rem', fontWeight: 700,
                color: optState === 'done' ? (row.highlight ? accent : 'var(--quantum-blue)') : 'rgba(255,255,255,0.15)',
                textShadow: optState === 'done' && row.highlight ? `0 0 10px ${accentGlow}` : 'none',
                transition: 'all 0.5s ease',
              }}>
                {optState === 'done' ? row.after : '--'}
              </div>
            </div>
          ))}
        </div>

        {/* Optimize Button */}
        {optState === 'ready' && (
          <button onClick={handleOptimize} style={{
            background: 'linear-gradient(135deg, var(--quantum-green), var(--quantum-blue))',
            color: '#000', border: 'none', padding: '14px', borderRadius: '8px',
            fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,255,157,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <Play size={18} fill="#000" /> 量子最適化を実行
          </button>
        )}

        {/* Optimizing Progress */}
        {optState === 'optimizing' && (
          <div style={{ ...sectionStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '20px' }}>
            <div style={{ position: 'relative', width: '60px', height: '60px' }}>
              <div style={{ position: 'absolute', inset: 0, border: '2px dashed var(--quantum-blue)', borderRadius: '50%', animation: 'lp-spin 4s linear infinite' }} />
              <div style={{ position: 'absolute', inset: '15px', border: `2px solid ${accent}`, borderRadius: '50%', animation: 'lp-spin 1.5s linear infinite reverse', boxShadow: `0 0 12px ${accentGlow}` }} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--quantum-blue)' }}>量子アニーリング実行中...</div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--quantum-green), var(--quantum-blue))', borderRadius: '2px', animation: 'lp-progress 3s linear forwards' }} />
            </div>
          </div>
        )}

        {/* === After optimization: sections appear === */}
        {optState === 'done' && (
          <>
            {/* Completion Banner */}
            <div style={{ ...sectionStyle, display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
              <div style={{ width: '36px', height: '36px', background: `radial-gradient(circle, ${accentGlow}, transparent 70%)`, border: `2px solid ${accent}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 15px ${accentGlow}`, flexShrink: 0 }}>
                <CheckCircle2 size={18} color={accent} />
              </div>
              <div>
                <div className="text-gradient" style={{ fontSize: '0.95rem', fontWeight: 700 }}>最適化完了 (Vibe 100%)</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px' }}>QUBO求解成功 — 最適パラメータ適用済み</div>
              </div>
            </div>

            {/* BUSINESS IMPACT */}
            <div style={sectionStyle}>
              <SectionHeader barColor="#f59e0b" label="BUSINESS IMPACT" title="経営インパクト" />
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                {bi.items.map((item, i) => (
                  <div key={i} style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', borderLeft: i === 0 ? `3px solid ${accent}` : '3px solid transparent' }}>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginBottom: '3px' }}>{item.label}</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: i === 0 ? accent : i === 1 ? 'var(--quantum-blue)' : '#f59e0b' }}>{item.value}</div>
                    <div style={{ fontSize: '0.5rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.detail}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '8px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '6px', fontSize: '0.6rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <span style={{ color: '#f59e0b' }}>💡</span> {bi.summary}
              </div>
            </div>

            {/* QUANTUM vs CLASSICAL */}
            <div style={sectionStyle}>
              <SectionHeader barColor="var(--quantum-blue)" label="QUANTUM vs CLASSICAL" title="量子 vs 古典計算機" />
              <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginBottom: '8px' }}>アルゴリズム: {qc.algorithm}</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.55rem', marginBottom: '10px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: '5px 6px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>問題規模</th>
                    <th style={{ padding: '5px 6px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 500 }}>古典計算機</th>
                    <th style={{ padding: '5px 6px', textAlign: 'left', color: 'var(--quantum-blue)', fontWeight: 600 }}>量子シミュレーター</th>
                    <th style={{ padding: '5px 6px', textAlign: 'left', color: accent, fontWeight: 600 }}>量子実機</th>
                  </tr>
                </thead>
                <tbody>
                  {qc.rows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '5px 6px', color: 'var(--text-muted)' }}>{row.scale}</td>
                      <td style={{ padding: '5px 6px', color: 'var(--text-main)' }}>{row.classical}</td>
                      <td style={{ padding: '5px 6px', color: 'var(--quantum-blue)' }}>{row.quantum_sim}</td>
                      <td style={{ padding: '5px 6px', color: i === 2 ? accent : 'var(--text-muted)', fontWeight: i === 2 ? 600 : 400 }}>{row.quantum_real}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '8px', background: 'rgba(0,225,255,0.06)', border: '1px solid rgba(0,225,255,0.15)', borderRadius: '6px', fontSize: '0.55rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <div style={{ color: 'var(--quantum-blue)', fontWeight: 600, marginBottom: '3px' }}>⚡ 量子コンピュータが必要となる条件</div>
                <div>閾値: {qc.threshold}</div>
                <div>必要量子ビット数: {qc.qubits}</div>
                <div style={{ marginTop: '3px' }}>💡 {qc.note}</div>
              </div>
            </div>

            {/* VALIDATION */}
            <div style={sectionStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }} onClick={() => setValidationOpen(!validationOpen)}>
                <div style={{ width: '3px', borderRadius: '2px', background: accent, alignSelf: 'stretch', minHeight: '16px' }} />
                <ShieldCheck size={12} color={accent} />
                <span style={{ fontSize: '0.55rem', letterSpacing: '1.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>VALIDATION</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>検証・信頼性サマリー</span>
                <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {validationOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {validationOpen ? '閉じる' : '展開'}
                </span>
              </div>
              {validationOpen && (
                <div style={{ marginTop: '10px', paddingLeft: '12px', borderLeft: `2px solid ${accent}33`, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {val.items.map((item, i) => (
                    <div key={i} style={{ fontSize: '0.6rem', color: 'var(--text-muted)', lineHeight: 1.6, display: 'flex', gap: '5px' }}>
                      <span style={{ color: accent, flexShrink: 0 }}>✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '5px 14px', borderTop: '1px solid var(--border-color)', fontSize: '0.5rem', color: 'var(--text-muted)', textAlign: 'center', flexShrink: 0 }}>
        ※ デモ用簡易サンプル実装 | 公開アルゴリズムの教育デモ | <span style={{ color: accent }}>利用規約</span> | &copy; 2026 JQCA
      </div>

      <style>{lpStyles}</style>
    </div>
  );
};

// --- Sub-components ---
const SectionHeader: React.FC<{ barColor: string; label: string; title: string }> = ({ barColor, label, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
    <div style={{ width: '3px', borderRadius: '2px', background: barColor, alignSelf: 'stretch', minHeight: '16px' }} />
    <span style={{ fontSize: '0.55rem', letterSpacing: '1.5px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{label}</span>
    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: barColor }}>{title}</span>
  </div>
);

const sectionStyle: React.CSSProperties = {
  padding: '12px', background: 'rgba(10,14,23,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
};

const lpStyles = `
  @keyframes lp-spin { to { transform: rotate(360deg); } }
  @keyframes lp-fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes lp-progress { from { width: 0%; } to { width: 100%; } }
`;

export default LivePreview;
