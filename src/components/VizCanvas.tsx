import React from 'react';

export type VizType =
  | 'recommendation' | 'ticket' | 'boxoffice' | 'music' | 'matchmaking'
  | 'acoustics' | 'vfx' | 'anime' | 'cdn' | 'ad'
  | 'esports' | 'themepark' | 'broadcast' | 'ip' | 'voice'
  | 'arvr' | 'churn' | 'moderation' | 'metaverse' | 'nft'
  | 'engagement';

const VIZ_MAP: Record<string, VizType> = {
  'content-recommendation': 'recommendation',
  'recommendation': 'recommendation',
  'ticket': 'ticket',
  'box-office': 'boxoffice',
  'boxoffice': 'boxoffice',
  'music-hit': 'music',
  'music': 'music',
  'game-matchmaking': 'matchmaking',
  'matchmaking': 'matchmaking',
  'venue-acoustics': 'acoustics',
  'acoustics': 'acoustics',
  'vfx': 'vfx',
  'anime': 'anime',
  'streaming-cdn': 'cdn',
  'cdn': 'cdn',
  'ad-insertion': 'ad',
  'ad': 'ad',
  'esports': 'esports',
  'theme-park': 'themepark',
  'themepark': 'themepark',
  'broadcast': 'broadcast',
  'ip-valuation': 'ip',
  'ip': 'ip',
  'voice': 'voice',
  'ar-vr': 'arvr',
  'arvr': 'arvr',
  'churn': 'churn',
  'moderation': 'moderation',
  'metaverse': 'metaverse',
  'nft': 'nft',
  'fan-engagement': 'engagement',
  'engagement': 'engagement',
};

export function getVizType(id: string): VizType {
  for (const key of Object.keys(VIZ_MAP)) {
    if (id.includes(key)) return VIZ_MAP[key];
  }
  return 'recommendation';
}

type VizProps = {
  running: boolean;
  optimized: boolean;
  progress: number;
  optLevel: number;
  selectedNode: string | null;
  onNodeClick: (id: string) => void;
};

const C1 = '#F59E0B';
const C2 = '#FCD34D';
const BG = '#0a1628';
const TX = '#f8f9fa';
const MU = '#8e9aaf';

/* ---- recommendation: user-content matrix ---- */
const RecommendationViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const users = [[60,50],[60,100],[60,150],[60,190]];
  const contents = [[280,40],[340,40],[280,100],[340,100],[280,160],[340,160]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">コンテンツ推薦マトリクス</text>
      {users.map(([x,y],i) => (
        <g key={`u${i}`} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          <circle cx={x} cy={y} r={10} fill={optimized?C1:MU} opacity={optimized?0.7:0.3}>
            {running && <animate attributeName="r" values="8;12;8" dur={`${1.5+i*0.2}s`} repeatCount="indefinite"/>}
          </circle>
          <text x={x} y={y+4} fill={TX} fontSize="7" textAnchor="middle">U{i+1}</text>
        </g>
      ))}
      {contents.map(([x,y],i) => (
        <rect key={`c${i}`} x={x-12} y={y-12} width="24" height="24" rx="4" fill={optimized?'#2dd4bf':C2} opacity={optimized?0.5:0.2}
          onClick={() => onNodeClick(`c${i}`)} style={{cursor:'pointer'}}>
          {running && <animate attributeName="opacity" values="0.15;0.5;0.15" dur={`${1.2+i*0.15}s`} repeatCount="indefinite"/>}
        </rect>
      ))}
      {optimized && users.map(([ux,uy],ui) =>
        contents.filter((_,ci) => (ui+ci)%3===0).map(([cx,cy],li) => (
          <line key={`l${ui}-${li}`} x1={ux+10} y1={uy} x2={cx-12} y2={cy} stroke={C1} strokeWidth="1" strokeDasharray="3 2" opacity="0.4"/>
        ))
      )}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized?'推薦精度 94.2%':'推薦分析待機'}</text>
    </g>
  );
};

/* ---- ticket: seat pricing heatmap ---- */
const TicketViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const rows = 6;
  const cols = 8;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">チケット動的価格マップ</text>
      {Array.from({length:rows}).map((_,r) =>
        Array.from({length:cols}).map((_,c) => {
          const x = 60+c*36;
          const y = 35+r*26;
          const price = optimized ? (rows-r)*0.15+Math.random()*0.1 : 0.5;
          const col = optimized ? `hsl(${40-price*30},90%,${45+price*15}%)` : MU;
          return (
            <rect key={`${r}-${c}`} x={x} y={y} width="30" height="20" rx="3" fill={col} opacity={optimized?0.6:0.15}
              onClick={() => onNodeClick(`${r}-${c}`)} style={{cursor:'pointer'}}>
              {running && <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${1.5+(r+c)*0.05}s`} repeatCount="indefinite"/>}
            </rect>
          );
        })
      )}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized?'収益 +32.5%':'価格最適化待機'}</text>
    </g>
  );
};

/* ---- boxoffice: bar chart ---- */
const BoxOfficeViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const movies = [{label:'A',h:65},{label:'B',h:35},{label:'C',h:80},{label:'D',h:50}];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">興行収入予測</text>
      {movies.map((m,i) => {
        const x = 60+i*80;
        const h = optimized ? m.h*1.15 : m.h;
        const y = 180-h;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
            <rect x={x} y={y} width="50" height={h} rx="4" fill={optimized?C1:MU} opacity={optimized?0.6:0.25}>
              {running && <animate attributeName="height" values={`${h*0.5};${h};${h*0.5}`} dur="2s" repeatCount="indefinite"/>}
            </rect>
            <text x={x+25} y="196" fill={MU} fontSize="7" textAnchor="middle">{m.label}</text>
          </g>
        );
      })}
      <text x="200" y="210" fill={MU} fontSize="7" textAnchor="middle">{optimized?'予測精度 91.4%':'データ分析待機'}</text>
    </g>
  );
};

/* ---- music: waveform ---- */
const MusicViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const pts = Array.from({length:20},(_, i) => {
    const x = 30+i*18;
    const y = optimized ? 110+Math.sin(i*0.8)*40 : 110+Math.sin(i*0.3)*15;
    return `${x},${y}`;
  });
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">音楽ヒット予測</text>
      <polyline points={pts.join(' ')} fill="none" stroke={optimized?C1:MU} strokeWidth={optimized?2:1} opacity={optimized?0.8:0.4}>
        {running && <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>}
      </polyline>
      {optimized && <polyline points={pts.map((p,i) => {const[x]=p.split(',');return `${x},${110+Math.cos(i*0.6)*25}`;}).join(' ')} fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5"/>}
      <circle cx="30" cy="110" r="4" fill={C1} onClick={() => onNodeClick('0')} style={{cursor:'pointer'}}/>
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">{optimized?'ヒット確率 87.6%':'音響解析待機'}</text>
    </g>
  );
};

/* ---- matchmaking: player network ---- */
const MatchmakingViz: React.FC<VizProps> = ({ running, optimized, selectedNode, onNodeClick }) => {
  const nodes = [[80,60],[160,45],[260,65],[340,55],[100,140],[200,130],[300,145],[160,190],[260,180]];
  const edges: [number,number][] = [[0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[4,7],[5,7],[5,8],[6,8]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">マッチメイキング最適化</text>
      {edges.map(([a,b],i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={optimized?'#2dd4bf':MU} strokeWidth={optimized?1.2:0.6} opacity={optimized?0.5:0.2}>
          {running && <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${1.5+i*0.1}s`} repeatCount="indefinite"/>}
        </line>
      ))}
      {nodes.map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={selectedNode===String(i)?7:4} fill={selectedNode===String(i)?'#eab308':(optimized?C1:MU)} opacity={optimized?0.7:0.3}
          onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          {running && <animate attributeName="r" values="3;5;3" dur={`${1+i*0.1}s`} repeatCount="indefinite"/>}
        </circle>
      ))}
      <text x="200" y="208" fill={MU} fontSize="8" textAnchor="middle">{optimized?'満足度 91.8%':'マッチング待機'}</text>
    </g>
  );
};

/* ---- acoustics: speaker & sound zones ---- */
const AcousticsViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const speakers = [[100,180],[160,180],[240,180],[300,180]];
  const zones = [1,2,3,4];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">ライブ音響最適化</text>
      {zones.map(i => (
        <ellipse key={i} cx="200" cy="180" rx={i*40} ry={i*20} fill="none" stroke={optimized?C1:MU}
          strokeWidth={optimized?1.5:0.8} opacity={optimized?0.4-i*0.06:0.15}>
          {running && <animate attributeName="ry" values={`${i*18};${i*22};${i*18}`} dur={`${2+i*0.3}s`} repeatCount="indefinite"/>}
        </ellipse>
      ))}
      {speakers.map(([x,y],i) => (
        <rect key={i} x={x-6} y={y-6} width="12" height="12" rx="2" fill={optimized?'#2dd4bf':C2} opacity={optimized?0.7:0.3}
          onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          {running && <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${1+i*0.2}s`} repeatCount="indefinite"/>}
        </rect>
      ))}
      <text x="200" y="210" fill={MU} fontSize="7" textAnchor="middle">{optimized?'カバレッジ 97.3%':'音場計算待機'}</text>
    </g>
  );
};

/* ---- vfx: render farm grid ---- */
const VfxViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const grid = 4;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">VFXレンダーファーム</text>
      {Array.from({length:grid}).flatMap((_,r) =>
        Array.from({length:grid}).map((_,c) => {
          const idx = r*grid+c;
          const x = 70+c*70;
          const y = 40+r*40;
          const col = optimized ? (idx%5===0?'#ff4444':'#2dd4bf') : MU;
          return (
            <rect key={idx} x={x} y={y} width="55" height="30" rx="4" fill={col} opacity={optimized?0.35:0.1}
              stroke={optimized?col:'none'} strokeWidth="0.8" onClick={() => onNodeClick(String(idx))} style={{cursor:'pointer'}}>
              {running && <animate attributeName="opacity" values="0.08;0.35;0.08" dur={`${1.5+idx*0.04}s`} repeatCount="indefinite"/>}
            </rect>
          );
        })
      )}
      <text x="200" y="210" fill={MU} fontSize="8" textAnchor="middle">{optimized?'GPU稼働率 94.7%':'ノード待機'}</text>
    </g>
  );
};

/* ---- anime: production pipeline ---- */
const AnimeViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const stages = [{label:'脚本',x:40,w:50},{label:'コンテ',x:100,w:60},{label:'作画',x:170,w:80},{label:'彩色',x:260,w:45},{label:'撮影',x:315,w:45}];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">アニメ制作パイプライン</text>
      {stages.map((s,i) => {
        const y = 70;
        const h = 80;
        const w = optimized ? s.w*0.78 : s.w;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
            <rect x={s.x} y={y} width={w} height={h} rx="5" fill={optimized?C1:MU} opacity={optimized?0.5:0.2}>
              {running && <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${1.5+i*0.3}s`} repeatCount="indefinite"/>}
            </rect>
            <text x={s.x+w/2} y={y+h/2+4} fill={TX} fontSize="7" textAnchor="middle">{s.label}</text>
          </g>
        );
      })}
      {optimized && stages.slice(0,-1).map((s,i) => (
        <line key={`a${i}`} x1={s.x+(optimized?s.w*0.78:s.w)} y1={110} x2={stages[i+1].x} y2={110} stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5"/>
      ))}
      <text x="200" y="195" fill={MU} fontSize="8" textAnchor="middle">{optimized?'工期 -22.4%':'工程計算待機'}</text>
    </g>
  );
};

/* ---- cdn: global edge network ---- */
const CdnViz: React.FC<VizProps> = ({ running, optimized, selectedNode, onNodeClick }) => {
  const servers = [[80,60],[200,50],[320,70],[100,140],[220,150],[340,130]];
  const links: [number,number][] = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">CDNエッジ配信網</text>
      {links.map(([a,b],i) => (
        <line key={i} x1={servers[a][0]} y1={servers[a][1]} x2={servers[b][0]} y2={servers[b][1]}
          stroke={optimized?'#2dd4bf':MU} strokeWidth={optimized?1.2:0.5} opacity={optimized?0.4:0.15}>
          {running && <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite"/>}
        </line>
      ))}
      {servers.map(([x,y],i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          <circle cx={x} cy={y} r={selectedNode===String(i)?8:5} fill={selectedNode===String(i)?'#eab308':(optimized?C1:C2)} opacity="0.8">
            {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${1+i*0.15}s`} repeatCount="indefinite"/>}
          </circle>
          {optimized && <text x={x} y={y-10} fill={C1} fontSize="6" textAnchor="middle">{`E${i+1}`}</text>}
        </g>
      ))}
      <text x="200" y="195" fill={MU} fontSize="8" textAnchor="middle">{optimized?'遅延 -45.2%':'配信網待機'}</text>
    </g>
  );
};

/* ---- ad: timeline slots ---- */
const AdViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const timeline = Array.from({length:10},(_, i) => ({x:30+i*35,y:110}));
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">広告挿入最適化</text>
      <line x1="30" y1="110" x2="370" y2="110" stroke={MU} strokeWidth="1" opacity="0.3"/>
      {timeline.map((t,i) => {
        const isAd = optimized && (i===2||i===5||i===8);
        const col = isAd ? C1 : (optimized?'#2dd4bf':MU);
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
            <rect x={t.x-12} y={t.y-20} width="24" height="40" rx="3" fill={col} opacity={optimized?0.5:0.15}>
              {running && <animate attributeName="opacity" values="0.1;0.5;0.1" dur={`${1.5+i*0.15}s`} repeatCount="indefinite"/>}
            </rect>
            {isAd && <text x={t.x} y={t.y+4} fill={TX} fontSize="7" textAnchor="middle">AD</text>}
          </g>
        );
      })}
      <text x="200" y="190" fill={MU} fontSize="8" textAnchor="middle">{optimized?'収益 +35.2%':'挿入点分析待機'}</text>
    </g>
  );
};

/* ---- esports: team comp ---- */
const EsportsViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const team = [[120,80],[200,60],[280,80],[160,140],[240,140]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">eスポーツ戦略分析</text>
      {team.map(([x,y],i) => {
        const roles = ['TANK','MAGE','ADC','SUP','JG'];
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
            <circle cx={x} cy={y} r={optimized?15:10} fill={optimized?C1:MU} opacity={optimized?0.4:0.15}>
              {running && <animate attributeName="r" values="8;16;8" dur={`${1.5+i*0.2}s`} repeatCount="indefinite"/>}
            </circle>
            <text x={x} y={y+4} fill={TX} fontSize="7" textAnchor="middle">{roles[i]}</text>
          </g>
        );
      })}
      {optimized && [[0,1],[1,2],[0,3],[2,4],[3,4]].map(([a,b],i) => (
        <line key={i} x1={team[a][0]} y1={team[a][1]} x2={team[b][0]} y2={team[b][1]}
          stroke="#2dd4bf" strokeWidth="1" strokeDasharray="3 2" opacity="0.4"/>
      ))}
      <text x="200" y="195" fill={MU} fontSize="8" textAnchor="middle">{optimized?'勝率 64.8%':'戦略分析待機'}</text>
    </g>
  );
};

/* ---- themepark: attraction map ---- */
const ThemeParkViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const attractions = [[80,60],[200,50],[320,70],[120,130],[260,140],[180,180]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">テーマパーク動線最適化</text>
      <rect x="50" y="30" width="310" height="170" rx="8" fill="none" stroke={MU} strokeWidth="0.8" strokeDasharray="4 3" opacity="0.2"/>
      {attractions.map(([x,y],i) => {
        const col = optimized ? (i%2===0?'#2dd4bf':C1) : MU;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
            <circle cx={x} cy={y} r={optimized?18:12} fill={col} opacity={optimized?0.25:0.1}>
              {running && <animate attributeName="r" values="10;18;10" dur={`${1.5+i*0.2}s`} repeatCount="indefinite"/>}
            </circle>
            {optimized && <text x={x} y={y+4} fill={TX} fontSize="7" textAnchor="middle">A{i+1}</text>}
          </g>
        );
      })}
      <text x="200" y="210" fill={MU} fontSize="7" textAnchor="middle">{optimized?'待ち時間 -35.8%':'来場予測待機'}</text>
    </g>
  );
};

/* ---- broadcast: schedule grid ---- */
const BroadcastViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const shows = [{label:'NEWS',x:40,w:80},{label:'ドラマ',x:100,w:100},{label:'バラエティ',x:160,w:70},{label:'アニメ',x:200,w:60},{label:'スポーツ',x:250,w:90}];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">放送スケジュール最適化</text>
      {shows.map((s,i) => {
        const y = 40+i*32;
        const w = optimized ? s.w*0.85 : s.w;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
            <text x="30" y={y+14} fill={MU} fontSize="7" textAnchor="end">{s.label}</text>
            <rect x={s.x} y={y} width={w} height="20" rx="3" fill={optimized?'#2dd4bf':C1} opacity={optimized?0.6:0.3}>
              {running && <animate attributeName="width" values={`${w*0.5};${w};${w*0.5}`} dur="2s" repeatCount="indefinite"/>}
            </rect>
          </g>
        );
      })}
      <text x="200" y="210" fill={MU} fontSize="7" textAnchor="middle">{optimized?'視聴率 +2.8pt':'編成計算待機'}</text>
    </g>
  );
};

/* ---- ip: portfolio radar ---- */
const IpViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const axes = 5;
  const center = [200,110];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">IP価値評価</text>
      {Array.from({length:axes}).map((_,i) => {
        const angle = (Math.PI*2/axes)*i - Math.PI/2;
        const x2 = center[0]+Math.cos(angle)*70;
        const y2 = center[1]+Math.sin(angle)*70;
        return <line key={i} x1={center[0]} y1={center[1]} x2={x2} y2={y2} stroke={MU} strokeWidth="0.5" opacity="0.3"/>;
      })}
      {[30,50,70].map(r => (
        <polygon key={r} points={Array.from({length:axes}).map((_,i) => {
          const angle = (Math.PI*2/axes)*i - Math.PI/2;
          return `${center[0]+Math.cos(angle)*r},${center[1]+Math.sin(angle)*r}`;
        }).join(' ')} fill="none" stroke={MU} strokeWidth="0.5" opacity="0.2"/>
      ))}
      <polygon points={Array.from({length:axes}).map((_,i) => {
        const angle = (Math.PI*2/axes)*i - Math.PI/2;
        const r = optimized ? 40+Math.random()*25 : 25+Math.random()*10;
        return `${center[0]+Math.cos(angle)*r},${center[1]+Math.sin(angle)*r}`;
      }).join(' ')} fill={optimized?C1:MU} opacity={optimized?0.3:0.1} stroke={optimized?C1:MU} strokeWidth="1.5"
        onClick={() => onNodeClick('0')} style={{cursor:'pointer'}}>
        {running && <animate attributeName="opacity" values="0.1;0.3;0.1" dur="2s" repeatCount="indefinite"/>}
      </polygon>
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized?'収益予測 89.3%':'IP評価待機'}</text>
    </g>
  );
};

/* ---- voice: spectrogram ---- */
const VoiceViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const bars = 20;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">音声合成スペクトログラム</text>
      {Array.from({length:bars}).map((_,i) => {
        const x = 30+i*18;
        const h = optimized ? 30+Math.sin(i*0.7)*40 : 20+Math.random()*15;
        const y = 170-h;
        return (
          <rect key={i} x={x} y={y} width="12" height={h} rx="2" fill={optimized?C1:MU} opacity={optimized?0.6:0.2}
            onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
            {running && <animate attributeName="height" values={`${h*0.5};${h};${h*0.5}`} dur={`${1+i*0.1}s`} repeatCount="indefinite"/>}
          </rect>
        );
      })}
      <text x="200" y="200" fill={MU} fontSize="8" textAnchor="middle">{optimized?'自然性 4.6/5.0':'音声分析待機'}</text>
    </g>
  );
};

/* ---- arvr: immersion gauge ---- */
const ArVrViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const layers = [[160,110,80],[160,110,55],[160,110,30]];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">AR/VR体験最適化</text>
      {layers.map(([cx,cy,r],i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={optimized?C1:MU}
          strokeWidth={optimized?2:1} opacity={optimized?0.5-i*0.1:0.2}
          onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          {running && <animate attributeName="r" values={`${r-5};${r+5};${r-5}`} dur={`${2+i*0.3}s`} repeatCount="indefinite"/>}
        </circle>
      ))}
      <circle cx="160" cy="110" r="8" fill={C1} opacity="0.7">
        {running && <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite"/>}
      </circle>
      <rect x="260" y="60" width="90" height="100" rx="5" fill="none" stroke={optimized?'#2dd4bf':MU} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3"/>
      {optimized && <text x="305" y="115" fill="#2dd4bf" fontSize="7" textAnchor="middle">FPS 99.2%</text>}
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">{optimized?'酔い -68.5%':'VR待機'}</text>
    </g>
  );
};

/* ---- churn: risk funnel ---- */
const ChurnViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const levels = [{w:280,label:'全ユーザー'},{w:220,label:'アクティブ'},{w:160,label:'リスク'},{w:80,label:'解約'}];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">サブスク解約予測</text>
      {levels.map((l,i) => {
        const y = 40+i*38;
        const x = 200-l.w/2;
        const col = optimized ? (i<2?'#2dd4bf':(i===2?C1:'#ff4444')) : MU;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
            <rect x={x} y={y} width={l.w} height="28" rx="4" fill={col} opacity={optimized?0.3:0.12}>
              {running && <animate attributeName="opacity" values="0.08;0.3;0.08" dur={`${1.5+i*0.3}s`} repeatCount="indefinite"/>}
            </rect>
            <text x="200" y={y+18} fill={TX} fontSize="7" textAnchor="middle">{l.label}</text>
          </g>
        );
      })}
      <text x="200" y="210" fill={MU} fontSize="8" textAnchor="middle">{optimized?'解約率 -28.4%':'リスク分析待機'}</text>
    </g>
  );
};

/* ---- moderation: content grid ---- */
const ModerationViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const grid = 5;
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">コンテンツモデレーション</text>
      {Array.from({length:grid}).flatMap((_,r) =>
        Array.from({length:grid}).map((_,c) => {
          const idx = r*grid+c;
          const x = 60+c*60;
          const y = 35+r*34;
          const safe = optimized ? idx%7!==3 : true;
          const col = safe ? '#2dd4bf' : '#ff4444';
          return (
            <rect key={idx} x={x} y={y} width="50" height="28" rx="4" fill={optimized?col:MU} opacity={optimized?0.35:0.1}
              stroke={optimized?col:'none'} strokeWidth="0.8" onClick={() => onNodeClick(String(idx))} style={{cursor:'pointer'}}>
              {running && <animate attributeName="opacity" values="0.08;0.35;0.08" dur={`${1.5+idx*0.04}s`} repeatCount="indefinite"/>}
            </rect>
          );
        })
      )}
      <text x="200" y="210" fill={MU} fontSize="8" textAnchor="middle">{optimized?'検出精度 96.8%':'スキャン待機'}</text>
    </g>
  );
};

/* ---- metaverse: zone layout ---- */
const MetaverseViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const zones = [{x:80,y:50,w:80,h:60,label:'ステージ'},{x:200,y:40,w:70,h:50,label:'展示'},{x:300,y:55,w:60,h:55,label:'ラウンジ'},{x:120,y:130,w:90,h:50,label:'ゲーム'},{x:250,y:125,w:80,h:55,label:'VIP'}];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">メタバース空間設計</text>
      {zones.map((z,i) => {
        const col = optimized ? (i%2===0?'#2dd4bf':C1) : MU;
        return (
          <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx="5" fill={col} opacity={optimized?0.3:0.1} stroke={col} strokeWidth="1">
              {running && <animate attributeName="opacity" values="0.08;0.3;0.08" dur={`${1.5+i*0.4}s`} repeatCount="indefinite"/>}
            </rect>
            <text x={z.x+z.w/2} y={z.y+z.h/2+4} fill={TX} fontSize="7" textAnchor="middle">{z.label}</text>
          </g>
        );
      })}
      <text x="200" y="205" fill={MU} fontSize="8" textAnchor="middle">{optimized?'滞在時間 +52%':'空間設計待機'}</text>
    </g>
  );
};

/* ---- nft: price chart ---- */
const NftViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const pts = Array.from({length:14},(_,i) => {
    const x = 40+i*24;
    const base = optimized ? 140-i*3-Math.sin(i*0.6)*30 : 120-i*1.5;
    return `${x},${base}`;
  });
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">NFTマーケット分析</text>
      <line x1="40" y1="180" x2="370" y2="180" stroke={MU} strokeWidth="0.5"/>
      <line x1="40" y1="30" x2="40" y2="180" stroke={MU} strokeWidth="0.5"/>
      <polyline points={pts.join(' ')} fill="none" stroke={C1} strokeWidth={optimized?2:1.2} opacity={optimized?0.9:0.5}>
        {running && <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.5s" repeatCount="indefinite"/>}
      </polyline>
      {optimized && <polyline points={pts.map((p,i) => {const[x]=p.split(',');return `${x},${100+Math.cos(i*0.4)*15}`;}).join(' ')} fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6"/>}
      <circle cx="40" cy={120} r="3" fill={C1} onClick={() => onNodeClick('0')} style={{cursor:'pointer'}}/>
      <text x="200" y="198" fill={MU} fontSize="7" textAnchor="middle">{optimized?'ROI +45.8%':'市場分析待機'}</text>
    </g>
  );
};

/* ---- engagement: segment rings ---- */
const EngagementViz: React.FC<VizProps> = ({ running, optimized, onNodeClick }) => {
  const segs = [{label:'コア',r:25,col:'#2dd4bf'},{label:'アクティブ',r:45,col:C1},{label:'カジュアル',r:65,col:C2},{label:'休眠',r:85,col:'#ff4444'}];
  return (
    <g>
      <text x="200" y="18" fill={TX} fontSize="10" textAnchor="middle">ファンエンゲージメント</text>
      {segs.map((s,i) => (
        <g key={i} onClick={() => onNodeClick(String(i))} style={{cursor:'pointer'}}>
          <circle cx="200" cy="115" r={s.r} fill="none" stroke={optimized?s.col:MU}
            strokeWidth={optimized?2:1} opacity={optimized?0.5:0.2}>
            {running && <animate attributeName="r" values={`${s.r-3};${s.r+3};${s.r-3}`} dur={`${2+i*0.3}s`} repeatCount="indefinite"/>}
          </circle>
          {optimized && <text x={200+s.r+5} y={115} fill={s.col} fontSize="6">{s.label}</text>}
        </g>
      ))}
      <circle cx="200" cy="115" r="6" fill={C1} opacity="0.8"/>
      <text x="200" y="210" fill={MU} fontSize="7" textAnchor="middle">{optimized?'LTV +38.2%':'セグメント待機'}</text>
    </g>
  );
};

/* ---- registry & main component ---- */
const VIZ_COMPONENTS: Record<VizType, React.FC<VizProps>> = {
  recommendation: RecommendationViz, ticket: TicketViz, boxoffice: BoxOfficeViz,
  music: MusicViz, matchmaking: MatchmakingViz, acoustics: AcousticsViz,
  vfx: VfxViz, anime: AnimeViz, cdn: CdnViz, ad: AdViz,
  esports: EsportsViz, themepark: ThemeParkViz, broadcast: BroadcastViz,
  ip: IpViz, voice: VoiceViz, arvr: ArVrViz, churn: ChurnViz,
  moderation: ModerationViz, metaverse: MetaverseViz, nft: NftViz,
  engagement: EngagementViz,
};

export default function VizCanvas({
  vizType, running, optimized, progress, optLevel, selectedNode, onNodeClick,
}: VizProps & { vizType: VizType }) {
  const Comp = VIZ_COMPONENTS[vizType];
  return (
    <svg viewBox="0 0 400 220" width="100%" style={{ display: 'block' }}>
      <rect width="400" height="220" fill={BG} rx="8" />
      <Comp running={running} optimized={optimized} progress={progress}
        optLevel={optLevel} selectedNode={selectedNode} onNodeClick={onNodeClick} />
      {running && (
        <g>
          <rect x="10" y="212" width="380" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
          <rect x="10" y="212" width={380 * (progress / 100)} height="4" rx="2" fill={C1} opacity="0.7" />
        </g>
      )}
    </svg>
  );
}
