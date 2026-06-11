const { useMemo, useEffect } = React;

// ===== Type definitions =====
const RTYPES = [
  { id:'baidoc',  name:'Bài đọc',  dur:'10–30s', icon:'reader',     color:'#2563eb' },
  { id:'sachnoi', name:'Sách nói', dur:'2–3 phút',icon:'headphones', color:'#7c3aed' },
  { id:'video',   name:'Video', dur:'1–2 phút',  icon:'video',      color:'#ea580c' },
  { id:'baitap',  name:'Bài tập luyện tập', dur:'', icon:'puzzle',   color:'#16a34a' },
];

function TopNav(){
  return (
    <div className="topnav">
      <div className="brand">Tool editor</div>
      <nav className="nav-links">
        <a href="#"><Icon name="sparkles" size={14} fill/>Tạo nội dung</a>
        <a href="Thư viện.html"><Icon name="folder" size={14}/>Thư viện</a>
        <a href="#">Sự kiện</a>
        <a href="#">Cài đặt tài khoản</a>
      </nav>
      <div className="nav-spacer"></div>
      <div className="nav-user"><span className="avatar"><Icon name="reader" size={16}/></span>Vườn Tri Thức Việt <Icon name="chevDown" size={14}/></div>
    </div>
  );
}

// accordion item with optional status badge
function Sec({id, index, title, open, locked, status, summary, onHeader, children}){
  const gen = status==='generating', done = status==='done';
  return (
    <div className={'acc-item'+(open?' open':'')+(done?' done':'')+(gen?' gen':'')+(locked?' locked':'')}>
      <button className="acc-head" onClick={()=>!locked && onHeader(id)} disabled={locked}>
        <span className="acc-dot">{gen ? <span className="spin"/> : (done && !open ? <Icon name="check" size={16} stroke={3}/> : index)}</span>
        <div className="acc-head-main">
          <div className="acc-title">{title}</div>
          {!open && summary && <div className="acc-summary">{summary}</div>}
          {open && <div className="acc-summary alt">{summaryDesc[id]}</div>}
        </div>
        {!open && done && <span className="badge badge-done"><Icon name="check" size={12} stroke={3}/>Đã tạo</span>}
        {!open && gen && <span className="badge badge-gen"><span className="spin"/>Đang tạo…</span>}
        {!open && status==='cancelled' && <span className="badge badge-draft">Đã huỷ</span>}
        {!locked && <span className="acc-caret"><Icon name="chevDown" size={18}/></span>}
        {locked && <span className="acc-lock"><Icon name="lock" size={14}/></span>}
      </button>
      {open && <div className="acc-body">{children}</div>}
    </div>
  );
}
const summaryDesc = {
  setup:'Nội dung, mức độ và tuỳ chọn tạo bài',
  baidoc:'Bài đọc do AI tạo, có thể chỉnh sửa',
  sachnoi:'Bản thu âm thanh đọc bài',
  video:'Video bài giảng do AI tạo',
  baitap:'Câu hỏi luyện tập tự sinh',
};

// loading states
function Skeleton({kind}){
  return (
    <div>
      <div className="skel-note"><span className="spin"/>{kind==='baidoc'?'Đang soạn bài đọc…':'Đang tạo câu hỏi…'}</div>
      <div className="skel" style={{marginTop:14}}>
        <i className="sh-title"></i><i></i><i className="w90"></i><i className="w70"></i><i></i><i className="w60"></i>
      </div>
    </div>
  );
}
function AudioGenerating({pct, voice, onCancel}){
  const eta = Math.max(1, Math.ceil((100-pct)/100*14));
  return (
    <div>
      <p className="sec-sub">Sách nói cần thời gian tổng hợp giọng đọc nên thường lâu hơn các phần khác. Bạn cứ xem và chỉnh những phần đã xong — khối này sẽ tự cập nhật khi hoàn tất.</p>
      <div className="audio-gen">
        <div className="ag-top">
          <div className="ag-ring"><div className="ag-spin"></div></div>
          <div className="ag-meta">
            <div className="ag-title">Đang tạo sách nói…</div>
            <div className="ag-sub">Giọng {voice} · còn khoảng {eta} giây</div>
          </div>
          <div className="ag-pct">{pct}%</div>
        </div>
        <div className="ag-bar"><i style={{width:pct+'%'}}></i></div>
        <div className="ag-note"><Icon name="info" size={15}/>Bạn không cần chờ ở đây — khi xong sẽ có thông báo và trình phát hiện ra ngay tại khối này.</div>
        <div className="ag-actions">
          <button className="btn" onClick={onCancel}><Icon name="x" size={14}/>Huỷ tạo</button>
        </div>
      </div>
    </div>
  );
}
function AudioCancelled({onRetry}){
  return (
    <div>
      <p className="sec-sub">Đã huỷ tạo sách nói. Các phần khác không bị ảnh hưởng — bạn có thể tạo lại bất cứ lúc nào.</p>
      <button className="btn btn-primary" onClick={onRetry}><Icon name="refresh" size={15}/>Tạo lại sách nói</button>
    </div>
  );
}

function HistoryModal({onClose}){
  const items=[
    {t:'Sách nói', tag:'Âm thanh', date:'08/06/2026 14:44', icon:'headphones', color:'#7c3aed'},
    {t:'Bài đọc', tag:'Văn bản (4.29 KB)', date:'08/06/2026 14:42', icon:'reader', color:'#2563eb'},
    {t:'Sách nói', tag:'Âm thanh', date:'05/06/2026 11:59', icon:'headphones', color:'#7c3aed'},
    {t:'Bài đọc', tag:'Văn bản (3.31 KB)', date:'05/06/2026 11:57', icon:'reader', color:'#2563eb'},
  ];
  return (
    <div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="hist-modal">
        <div className="hist-head"><h3>Lịch sử bài giảng</h3>
          <button className="wz-close" onClick={onClose}><Icon name="x" size={18}/></button></div>
        <div className="hist-body">
          <div className="hint-line" style={{margin:'0 0 4px',color:'#1d63c9',background:'#eef5ff',borderColor:'#d3e3fb'}}>
            <Icon name="info" size={16}/>Các bản vừa tạo giờ hiển thị ngay trên trang. Mục này chỉ lưu các bản nháp cũ.
          </div>
          {items.map((it,i)=>(
            <div className="hist-item" key={i}>
              <span className="hi-ic" style={{background:it.color}}><Icon name={it.icon} size={18}/></span>
              <div className="hi-main">
                <div className="hi-title">{it.t}<span className="badge badge-draft">Nháp</span></div>
                <div className="hi-date">{it.date} · {it.tag}</div>
              </div>
              <a href="#" className="hist-view" onClick={e=>e.preventDefault()}>Xem →</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function App(){
  const [types, setTypes] = useState(new Set(['baidoc','sachnoi','video','baitap']));
  const [content, setContent] = useState('Bài đọc "Tôi là học sinh lớp 2" — kể về cảm xúc của bạn nhỏ trong ngày tựu trường đầu tiên của lớp 2.');
  const [cfg, setCfg] = useState({ grade:'Lớp 2', subject:'Tiếng Việt', voice:'Nova (Nữ trẻ)', vstyle:'Hoạt hình minh hoạ' });
  const [levels, setLevels] = useState({
    'Dễ':         { on:true,  n:3 },
    'Trung bình': { on:true,  n:2 },
    'Khó':        { on:false, n:2 },
  });
  const [phase, setPhase] = useState('setup');     // setup | ready
  const [open, setOpen] = useState('setup');
  const [status, setStatus] = useState({});        // per-type: generating | done | cancelled
  const [audioPct, setAudioPct] = useState(0);
  const [videoPct, setVideoPct] = useState(0);
  const [showHist, setShowHist] = useState(false);
  const [toast, setToast] = useState(null);
  const [files, setFiles] = useState([]);
  const audioTimer = React.useRef(null);
  const videoTimer = React.useRef(null);
  const addFiles = list => setFiles(f=>[...f, ...[...list].map(x=>({name:x.name, isImg:(x.type||'').startsWith('image/')}))]);

  const toggleType = id => setTypes(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
  const toggleOpen = id => setOpen(o => o===id ? null : id);   // bấm lại (mũi tên) để đóng
  const sel = id => types.has(id);
  const orderedResults = RTYPES.filter(t=>sel(t.id));

  const LEVEL_KEYS = ['Dễ','Trung bình','Khó'];
  const toggleLevel = k => setLevels(L=>({...L, [k]:{...L[k], on:!L[k].on, n:L[k].n||1}}));
  const setLevelN = (k,v) => setLevels(L=>({...L, [k]:{...L[k], n:v}}));
  const activeLevels = LEVEL_KEYS.filter(k=>levels[k].on);
  const totalQ = activeLevels.reduce((a,k)=>a+levels[k].n,0);

  const runAudio = ()=>{
    setStatus(s=>({...s, sachnoi:'generating'})); setAudioPct(0);
    clearInterval(audioTimer.current);
    audioTimer.current = setInterval(()=>{
      setAudioPct(p=>{
        const np = Math.min(100, p + Math.round(3+Math.random()*7));
        if(np>=100){
          clearInterval(audioTimer.current);
          setStatus(s=>({...s, sachnoi:'done'}));
          setToast('🔊 Sách nói đã tạo xong'); setTimeout(()=>setToast(null),2800);
        }
        return np;
      });
    }, 520);
  };
  const runVideo = ()=>{
    setStatus(s=>({...s, video:'generating'})); setVideoPct(0);
    clearInterval(videoTimer.current);
    videoTimer.current = setInterval(()=>{
      setVideoPct(p=>{
        const np = Math.min(100, p + Math.round(2+Math.random()*5));
        if(np>=100){
          clearInterval(videoTimer.current);
          setStatus(s=>({...s, video:'done'}));
          setToast('🎬 Video bài giảng đã tạo xong'); setTimeout(()=>setToast(null),2800);
        }
        return np;
      });
    }, 560);
  };
  const generate = ()=>{
    const init={}; orderedResults.forEach(t=>init[t.id]='generating');
    setStatus(init); setPhase('ready');
    setOpen(orderedResults[0]?.id || 'setup');
    if(types.has('baidoc')) setTimeout(()=>setStatus(s=>({...s, baidoc:'done'})), 1500);
    if(types.has('baitap')) setTimeout(()=>setStatus(s=>({...s, baitap:'done'})), 2300);
    if(types.has('sachnoi')) runAudio();
    if(types.has('video')) runVideo();
  };
  const cancelAudio = ()=>{ clearInterval(audioTimer.current); setStatus(s=>({...s, sachnoi:'cancelled'})); };
  const cancelVideo = ()=>{ clearInterval(videoTimer.current); setStatus(s=>({...s, video:'cancelled'})); };
  const saveAll = ()=>{ setToast('Đã lưu tất cả bài giảng'); setTimeout(()=>setToast(null),2400); };

  // header summaries
  const lvlSummary = activeLevels.map(k=>`${k} ${levels[k].n}`).join(' · ');
  const setupSummary = `${cfg.subject} · ${cfg.grade}${sel('baitap')&&activeLevels.length?` · ${lvlSummary}`:''}`;
  const resSummary = {
    baidoc:`Đã tạo · ~${LESSON.words} từ`,
    sachnoi:`Đã tạo · ${LESSON.duration} · giọng ${cfg.voice.split(' (')[0]}`,
    video:`Đã tạo · 1:48 · ${cfg.vstyle}`,
    baitap:`${totalQ} câu hỏi · ${activeLevels.length>1?activeLevels.length+' mức độ':'mức '+(activeLevels[0]||'—')}`,
  };
  const audioBusy = status.sachnoi==='generating';
  const videoBusy = status.video==='generating';

  return (
    <div className="app">
      <TopNav/>
      <div className="page">
        <div className="flow-head">
          <a href="#" className="flow-back" onClick={e=>e.preventDefault()}><Icon name="back" size={16}/>Quay lại</a>
          <div className="flow-spacer"></div>
          <a className="btn btn-primary" href="Thư viện.html"><Icon name="folder" size={16}/>Thư viện</a>
        </div>
        <h1 className="page-title" style={{marginBottom:18}}>Tạo nội dung bằng AI</h1>

        {/* type toggles */}
        <div className="type-row">
          {RTYPES.map(t=>(
            <div className={'type-toggle'+(sel(t.id)?' on':'')} key={t.id} onClick={()=>phase==='setup'&&toggleType(t.id)}
                 style={phase!=='setup'?{cursor:'default',opacity:sel(t.id)?1:.45}:{}}>
              <Check on={sel(t.id)}/>
              <span className="tt-ic" style={{background:t.color}}><Icon name={t.icon} size={17}/></span>
              <span className="tt-name">{t.name}{t.dur && <span className="tt-dur"> ({t.dur})</span>}</span>
            </div>
          ))}
        </div>

        {/* accordion */}
        <div className="acc">
          <Sec id="setup" index={1} title="Nguồn & thiết lập" open={open==='setup'}
               status={phase==='ready'?'done':null} summary={setupSummary} onHeader={toggleOpen}>
            <p className="sec-sub">Nhập nội dung bài học (hoặc tải file), chọn mức độ và tuỳ chọn cho từng loại.</p>
            <div className="setup-grid">
              <div className="full">
                <label className="lbl-sm">Nội dung / chủ đề bài học</label>
                <textarea className="ta" value={content} onChange={e=>setContent(e.target.value)} placeholder="Nhập nội dung bài đọc, đoạn văn, hoặc chủ đề…"/>
              </div>
              <div><label className="lbl-sm">Lớp</label>
                <select className="ctrl" value={cfg.grade} onChange={e=>setCfg({...cfg,grade:e.target.value})}>
                  <option>Lớp 1</option><option>Lớp 2</option><option>Lớp 3</option><option>Lớp 4</option><option>Lớp 5</option></select></div>
              <div><label className="lbl-sm">Môn</label>
                <select className="ctrl" value={cfg.subject} onChange={e=>setCfg({...cfg,subject:e.target.value})}>
                  <option>Tiếng Việt</option><option>Toán</option><option>Tự nhiên & Xã hội</option></select></div>
              <div><label className="lbl-sm" style={{opacity:sel('sachnoi')?1:.4}}>Giọng nói</label>
                <select className="ctrl" disabled={!sel('sachnoi')} value={cfg.voice} onChange={e=>setCfg({...cfg,voice:e.target.value})} style={{opacity:sel('sachnoi')?1:.5}}>
                  <option>Nova (Nữ trẻ)</option><option>Mai (Nữ miền Bắc)</option><option>Minh (Nam miền Bắc)</option></select></div>
            </div>

            <div className="upload-mini">
              <span className="or">Hoặc tải file:</span>
              <label className="btn"><Icon name="upload2" size={15}/>Chọn file (Ảnh, PDF, Word, Excel)
                <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" style={{display:'none'}}
                  onChange={e=>{addFiles(e.target.files); e.target.value='';}}/>
              </label>
              <span className="muted" style={{fontSize:13}}>Ảnh, PDF, Word, Excel · tối đa 15MB</span>
            </div>
            {files.length>0 && (
              <div className="file-pills">
                {files.map((f,i)=>(
                  <span className="file-pill" key={i}>
                    <Icon name={f.isImg?'image':'fileSpread'} size={15}/>{f.name}
                    <span className="x" onClick={()=>setFiles(fs=>fs.filter((_,j)=>j!==i))}><Icon name="x" size={13}/></span>
                  </span>
                ))}
              </div>
            )}

            {sel('baitap') && (
              <div className="qty-box">
                <div className="opt-label">Mức độ & số lượng câu hỏi</div>
                <p className="lvl-help">Chọn một hoặc nhiều mức độ và số câu muốn AI tạo ở mỗi mức.</p>
                <div className="lvl-rows">
                  {LEVEL_KEYS.map(k=>(
                    <div className={'lvl-row'+(levels[k].on?' on':'')} key={k}>
                      <div className="lr-pick" onClick={()=>toggleLevel(k)}>
                        <Check on={levels[k].on}/><LvlBadge level={k}/>
                      </div>
                      <div className="lr-qty" style={{opacity:levels[k].on?1:.35,pointerEvents:levels[k].on?'auto':'none'}}>
                        <span className="muted">Số câu</span>
                        <NumStepper value={levels[k].n} min={1} onChange={v=>setLevelN(k,v)}/>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="lvl-total">Tổng: <b>{totalQ}</b> câu hỏi
                  {activeLevels.length>0 && <> · {activeLevels.length} mức độ</>}</div>
              </div>
            )}

            <div className="acc-actions">
              <span className="foot-info">Sẽ tạo <b>{orderedResults.length}</b> loại nội dung{sel('baitap')&&<> · <b>{totalQ}</b> câu hỏi</>}</span>
              <button className="btn btn-ai btn-lg" disabled={types.size===0 || (sel('baitap')&&activeLevels.length===0)} onClick={generate}>
                <Icon name={phase==='ready'?'refresh':'sparkles'} size={16} fill={phase!=='ready'}/>
                {phase==='ready'?'Tạo lại nội dung':'Tạo nội dung'}
              </button>
            </div>
          </Sec>

          {phase==='ready' && orderedResults.map((t,i)=>{
            const st = status[t.id] || 'generating';
            const pct = t.id==='sachnoi'?audioPct : t.id==='video'?videoPct : null;
            const sum = st==='done' ? resSummary[t.id]
              : st==='cancelled' ? 'Đã huỷ — chưa tạo'
              : (pct!=null ? `Đang tạo · ${pct}%` : 'Đang tạo…');
            const body = ()=>{
              if(st==='done'){
                if(t.id==='baidoc') return <ReadingBody/>;
                if(t.id==='sachnoi') return <AudioBody/>;
                if(t.id==='video') return <VideoBody style={cfg.vstyle}/>;
                return <ExerciseBody levels={levels}/>;
              }
              if(st==='cancelled'){
                if(t.id==='video') return <VideoCancelled onRetry={runVideo}/>;
                if(t.id==='sachnoi') return <AudioCancelled onRetry={runAudio}/>;
                return <AudioCancelled onRetry={()=>setStatus(s=>({...s,[t.id]:'done'}))}/>;
              }
              if(t.id==='sachnoi') return <AudioGenerating pct={audioPct} voice={cfg.voice} onCancel={cancelAudio}/>;
              if(t.id==='video') return <VideoGenerating pct={videoPct} vstyle={cfg.vstyle} onCancel={cancelVideo}/>;
              return <Skeleton kind={t.id}/>;
            };
            return (
              <Sec key={t.id} id={t.id} index={i+2} title={t.name} open={open===t.id}
                   status={st} summary={sum} onHeader={toggleOpen}>
                {body()}
              </Sec>
            );
          })}
        </div>

        {phase==='ready' && (
          <div className="save-bar">
            <span className="save-info">
              {(audioBusy||videoBusy)
                ? <>Đang tạo {audioBusy&&videoBusy?'sách nói & video':audioBusy?'sách nói':'video'}… — các phần khác đã sẵn sàng để lưu</>
                : <>Đã tạo <b>{orderedResults.length}</b> loại bài giảng cho bài <b>“{LESSON.title}”</b></>}
            </span>
            <div style={{display:'flex',gap:10}}>
              <a className="btn" href="Thư viện.html"><Icon name="folder" size={15}/>Thư viện</a>
              <button className="btn btn-primary btn-lg" onClick={saveAll}>
                <Icon name="save" size={16}/>{(audioBusy||videoBusy)?'Lưu phần đã xong':'Lưu tất cả'}
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && <div className="toast"><Icon name="check" size={16} stroke={3}/>{toast}</div>}
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
