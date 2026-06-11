// ===== Tạo bài giảng V2 — đơn vị là "bài", mỗi bài sinh đủ Bài đọc/Sách nói/Video/Bài tập =====
const { useState, useMemo } = React;

const RTYPES = [
  { id:'baidoc',  name:'Bài đọc',  unit:'bài đọc',  icon:'reader',     color:'#2563eb' },
  { id:'sachnoi', name:'Sách nói', unit:'sách nói', icon:'headphones', color:'#7c3aed' },
  { id:'video',   name:'Video',    unit:'video',    icon:'video',      color:'#ea580c' },
  { id:'baitap',  name:'Bài luyện tập chung', unit:'bài tập', icon:'puzzle', color:'#16a34a' },
  { id:'baigiao', name:'Bài tập giao học sinh', unit:'bài giao', icon:'send', color:'#0284c7' },
];

// mỗi bài = 10 câu hỏi với tỉ lệ độ khó cố định
const BAI_DEFS = [
  { level:'Dễ',         name:'Bài dễ',         mix:{'Dễ':7,'Trung bình':2,'Khó':1} },
  { level:'Trung bình', name:'Bài trung bình', mix:{'Dễ':3,'Trung bình':5,'Khó':2} },
  { level:'Khó',        name:'Bài khó',        mix:{'Dễ':1,'Trung bình':4,'Khó':5} },
];
const BAI_BY_LEVEL = Object.fromEntries(BAI_DEFS.map(b=>[b.level,b]));
// bài tập chung cho cả lớp: 10 câu cố định 3 Dễ / 4 TB / 3 Khó
const CHUNG_MIX = {'Dễ':3,'Trung bình':4,'Khó':3};
const SUG_NHOM = {'Dễ':'Nhóm yếu','Trung bình':'Nhóm khá','Khó':'Nhóm giỏi'};
const mixStr = mix => `${mix['Dễ']} Dễ · ${mix['Trung bình']} TB · ${mix['Khó']} Khó`;

function TopNav(){
  return (
    <div className="topnav">
      <div className="brand">Tool editor</div>
      <nav className="nav-links">
        <a href="#"><Icon name="sparkles" size={14} fill/>Tạo nội dung</a>
        {!window.MOUNT_EXTERNAL && <a href="Thư viện.html"><Icon name="folder" size={14}/>Thư viện</a>}
        <a href="#">Sự kiện</a>
        <a href="#">Cài đặt tài khoản</a>
      </nav>
      <div className="nav-spacer"></div>
      <div className="nav-user"><span className="avatar"><Icon name="reader" size={16}/></span>Vườn Tri Thức Việt <Icon name="chevDown" size={14}/></div>
    </div>
  );
}

const summaryDesc = {
  setup:'Nội dung, mức độ và số lượng bài tập',
  baidoc:'Một bài đọc chung do AI tạo',
  sachnoi:'Một bản thu âm thanh chung',
  video:'Một video bài giảng chung',
  baitap:'10 câu hỏi dùng chung cho cả lớp',
  baigiao:'Bài theo mức độ, giao cho từng nhóm học sinh',
};

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

// danh sách các bài trong một loại nội dung
function BaiList({bais, color, unitLabel, sub, renderBody}){
  const [open, setOpen] = useState(0);
  return (
    <div className="bai-list">
      {bais.map((b,i)=>(
        <div className={'bai-item'+(open===i?' open':'')} key={i}>
          <button className="bai-head" onClick={()=>setOpen(open===i?-1:i)}>
            <span className="bai-idx" style={{background:color}}>{i+1}</span>
            <div className="bai-head-main">
              <span className="bai-name">{unitLabel} {i+1}</span>
              <span className="bai-sub">{sub(b)}</span>
            </div>
            <LvlBadge level={b.level}/>
            <span className="acc-caret"><Icon name="chevDown" size={17}/></span>
          </button>
          {open===i && <div className="bai-body">{renderBody(b,i)}</div>}
        </div>
      ))}
    </div>
  );
}

// ===== Bài tập cho 1 bài: 10 câu theo mix =====
function buildBaiQuestions(mix){
  const out=[]; let uid=0;
  ['Dễ','Trung bình','Khó'].forEach(lv=>{
    const pool = QUESTIONS.filter(q=>q.level===lv);
    for(let i=0;i<(mix[lv]||0);i++){ out.push({...pool[i%pool.length], uid:`${lv}-${uid++}`}); }
  });
  return out;
}
const KIND_LABEL = { chon:'Chọn', sapxep:'Sắp xếp', noi:'Nối' };

// ngân hàng biến thể để "Tạo lại bằng AI" cho từng câu hỏi
const REGEN_BANK = {
  chon:[
    {text:'Khi đến trường trong ngày tựu trường, bạn nhỏ có cảm xúc gì?',
      options:[{t:'Lo lắng, sợ sệt'},{t:'Tự hào vì mình đã lớn',correct:true},{t:'Chán nản, mệt mỏi'},{t:'Buồn ngủ'}]},
    {text:'Câu nào nói đúng nhất về tâm trạng của bạn nhỏ?',
      options:[{t:'Bạn thấy mình nhỏ bé'},{t:'Bạn thấy mình đã lớn hơn',correct:true},{t:'Bạn thấy lạ lẫm'},{t:'Bạn thấy chán'}]},
    {text:'Vì sao bạn nhỏ muốn đến trường thật sớm?',
      options:[{t:'Vì háo hức, mong được đi học',correct:true},{t:'Vì sợ đi muộn bị phạt'},{t:'Vì mẹ bắt buộc'},{t:'Vì trời nắng đẹp'}]},
  ],
  sapxep:[
    {seq:['Mẹ gọi, bạn nhỏ vùng dậy và chuẩn bị thật nhanh.','Bạn nhỏ chào mẹ rồi chạy vào sân trường.','Bạn nhỏ gặp các bạn đang ríu rít trò chuyện.']},
    {seq:['Buổi sáng tựu trường bắt đầu.','Bạn nhỏ đến trường thật sớm.','Bạn nhỏ thấy mình đã lớn hơn các em lớp 1.']},
  ],
  noi:[
    {pairs:[['tựu trường','ngày đầu đến lớp'],['ríu rít','nói chuyện vui vẻ, liền nhau'],['tự hào','hãnh diện về bản thân']]},
    {pairs:[['rụt rè','e dè, chưa mạnh dạn'],['vùng dậy','bật dậy thật nhanh'],['ào vào','chạy vào thật nhanh']]},
  ],
};

function QCard({q, n, onDelete}){
  const [cur, setCur] = React.useState(q);
  const [mode, setMode] = React.useState('view');   // view | edit
  const [regen, setRegen] = React.useState(false);
  const [flash, setFlash] = React.useState(false);
  const [draft, setDraft] = React.useState(null);
  const variantRef = React.useRef(0);

  const doRegen = ()=>{
    setRegen(true);
    setTimeout(()=>{
      const bank = REGEN_BANK[cur.kind] || [];
      variantRef.current = (variantRef.current+1) % (bank.length||1);
      const v = bank[variantRef.current] || {};
      setCur(c=>({...c, ...v}));
      setRegen(false); setFlash(true); setTimeout(()=>setFlash(false),1400);
    }, 950);
  };
  const startEdit = ()=>{ setDraft(JSON.parse(JSON.stringify(cur))); setMode('edit'); };
  const saveEdit = ()=>{ setCur(draft); setMode('view'); setFlash(true); setTimeout(()=>setFlash(false),1200); };

  return (
    <div className={'q-card inc'+(flash?' just-regen':'')+(regen?' regenning':'')}>
      <div className="q-head">
        <span className="q-num">{n}</span>
        <span className="q-kind">{KIND_LABEL[cur.kind]}</span>
        {mode==='view'
          ? <div className="q-text">{cur.text}</div>
          : <textarea className="q-edit-field" rows={2} value={draft.text}
              onChange={e=>setDraft({...draft, text:e.target.value})}/>}
        <LvlBadge level={cur.level}/>
        {mode==='view' && (
          <div className="q-acts">
            <button className="q-mini edit" onClick={startEdit}><Icon name="edit" size={13}/>Sửa</button>
            <button className="q-mini regen" onClick={doRegen} disabled={regen}><Icon name="sparkles" size={13} fill/>Tạo lại</button>
            {onDelete && <button className="q-mini del" onClick={onDelete}><Icon name="trash" size={13}/></button>}
          </div>
        )}
      </div>

      {/* ---- view ---- */}
      {mode==='view' && cur.kind==='chon' && (
        <div className="q-opts">
          {cur.options.map((o,i)=>(
            <div className={'q-opt'+(o.correct?' correct':'')} key={i}>
              <span className="oi">{String.fromCharCode(65+i)}</span>{o.t}
              {o.correct && <span className="ans-mark"><Icon name="check" size={13} stroke={3}/>Đáp án</span>}
            </div>
          ))}
        </div>
      )}
      {mode==='view' && cur.kind==='sapxep' && (
        <div className="q-seq">{cur.seq.map((s,i)=><div className="si" key={i}><span className="ord">{i+1}</span>{s}</div>)}</div>
      )}
      {mode==='view' && cur.kind==='noi' && (
        <div className="q-match">{cur.pairs.map((p,i)=>(
          <React.Fragment key={i}><div className="mcell">{p[0]}</div><div className="mline"><Icon name="link2" size={16}/></div><div className="mcell">{p[1]}</div></React.Fragment>
        ))}</div>
      )}

      {/* ---- edit ---- */}
      {mode==='edit' && draft.kind==='chon' && (
        <div className="q-opts">
          <div className="edit-hint">Sửa nội dung đáp án, bấm vào ô tròn để chọn đáp án đúng.</div>
          {draft.options.map((o,i)=>(
            <div className={'q-opt-edit'+(o.correct?' correct':'')} key={i}>
              <button className={'oi pick'+(o.correct?' on':'')} title="Đặt làm đáp án đúng"
                onClick={()=>setDraft({...draft, options:draft.options.map((x,j)=>({...x,correct:j===i}))})}>
                {o.correct ? <Icon name="check" size={12} stroke={3}/> : String.fromCharCode(65+i)}
              </button>
              <input className="opt-input" value={o.t}
                onChange={e=>setDraft({...draft, options:draft.options.map((x,j)=>j===i?{...x,t:e.target.value}:x)})}/>
            </div>
          ))}
        </div>
      )}
      {mode==='edit' && draft.kind==='sapxep' && (
        <div className="q-seq">
          <div className="edit-hint">Sửa nội dung từng bước. Thứ tự hiện tại là đáp án đúng.</div>
          {draft.seq.map((s,i)=>(
            <div className="si-edit" key={i}><span className="ord">{i+1}</span>
              <input className="opt-input" value={s}
                onChange={e=>setDraft({...draft, seq:draft.seq.map((x,j)=>j===i?e.target.value:x)})}/>
            </div>
          ))}
        </div>
      )}
      {mode==='edit' && draft.kind==='noi' && (
        <div className="q-match-edit">
          <div className="edit-hint">Sửa cặp từ ở cột A và nghĩa tương ứng ở cột B.</div>
          {draft.pairs.map((p,i)=>(
            <div className="pair-edit" key={i}>
              <input className="opt-input" value={p[0]}
                onChange={e=>setDraft({...draft, pairs:draft.pairs.map((x,j)=>j===i?[e.target.value,x[1]]:x)})}/>
              <Icon name="link2" size={15}/>
              <input className="opt-input" value={p[1]}
                onChange={e=>setDraft({...draft, pairs:draft.pairs.map((x,j)=>j===i?[x[0],e.target.value]:x)})}/>
            </div>
          ))}
        </div>
      )}
      {mode==='edit' && (
        <div className="q-edit-actions">
          <button className="btn btn-ghost" onClick={()=>setMode('view')}>Huỷ</button>
          <button className="btn btn-primary" onClick={saveEdit}><Icon name="check" size={14} stroke={3}/>Lưu câu hỏi</button>
        </div>
      )}

      {regen && <div className="q-regen-overlay"><span className="spin"/>Đang tạo lại câu hỏi…</div>}
    </div>
  );
}

function ExerciseBaiBody({bai}){
  const [salt, setSalt] = React.useState(0);
  const [qs, setQs] = React.useState(()=>buildBaiQuestions(bai.mix));
  const [regenAll, setRegenAll] = React.useState(false);

  const doRegenAll = ()=>{
    setRegenAll(true);
    setTimeout(()=>{
      setSalt(s=>s+1);
      setQs(buildBaiQuestions(bai.mix));
      setRegenAll(false);
    }, 1300);
  };
  const delQ = uid => setQs(list=>list.filter(q=>q.uid!==uid));

  return (
    <div>
      <div className="bai-toolbar">
        <div className="bai-mixline">
          <span className="muted">{qs.length} câu hỏi:</span>
          <span className="mix-chip" style={{background:'#e8f7ee',color:'#15803d'}}>{bai.mix['Dễ']} Dễ</span>
          <span className="mix-chip" style={{background:'#fdf3e0',color:'#b45309'}}>{bai.mix['Trung bình']} TB</span>
          <span className="mix-chip" style={{background:'#fde8e6',color:'#c2410c'}}>{bai.mix['Khó']} Khó</span>
        </div>
        <button className="btn btn-regenall" onClick={doRegenAll} disabled={regenAll}>
          {regenAll ? <><span className="spin"/>Đang tạo lại…</> : <><Icon name="sparkles" size={14} fill/>Tạo lại cả bài</>}
        </button>
      </div>
      <p className="regen-hint"><Icon name="info" size={14}/>Chưa ưng câu nào? Bấm <b>Tạo lại</b> để AI sinh lại riêng câu đó, hoặc <b>Sửa</b> để chỉnh tay.</p>
      <div className={'q-list'+(regenAll?' dimmed':'')} style={{marginTop:6}}>
        {qs.map((q,i)=><QCard key={q.uid+'-'+salt} q={q} n={i+1} onDelete={()=>delQ(q.uid)}/>)}
      </div>
    </div>
  );
}

function HistoryModal({onClose}){
  return (
    <div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="hist-modal">
        <div className="hist-head"><h3>Lịch sử bài giảng</h3>
          <button className="wz-close" onClick={onClose}><Icon name="x" size={18}/></button></div>
        <div className="hist-body">
          <div className="hint-line" style={{margin:'0 0 4px',color:'#1d63c9',background:'#eef5ff',borderColor:'#d3e3fb'}}>
            <Icon name="info" size={16}/>Các bản vừa tạo giờ hiển thị ngay trên trang. Mục này chỉ lưu các bản nháp cũ.
          </div>
          {[{t:'Sách nói',date:'08/06/2026 14:44',icon:'headphones',color:'#7c3aed'},
            {t:'Bài đọc',date:'08/06/2026 14:42',icon:'reader',color:'#2563eb'}].map((it,i)=>(
            <div className="hist-item" key={i}>
              <span className="hi-ic" style={{background:it.color}}><Icon name={it.icon} size={18}/></span>
              <div className="hi-main"><div className="hi-title">{it.t}<span className="badge badge-draft">Nháp</span></div>
                <div className="hi-date">{it.date}</div></div>
              <a href="#" className="hist-view" onClick={e=>e.preventDefault()}>Xem →</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function GenericGenerating({label, pct, sub, onCancel, accent}){
  const eta = Math.max(1, Math.ceil((100-pct)/100*16));
  return (
    <div>
      <p className="sec-sub">{label} cần thời gian tạo nên thường lâu hơn. Bạn cứ xem và chỉnh những phần đã xong — khối này tự cập nhật khi hoàn tất.</p>
      <div className="audio-gen" style={accent?{borderColor:accent.bd,background:accent.bg}:null}>
        <div className="ag-top">
          <div className="ag-ring"><div className="ag-spin" style={accent?{borderTopColor:accent.c,borderColor:accent.ring}:null}></div></div>
          <div className="ag-meta"><div className="ag-title" style={accent?{color:accent.c}:null}>Đang tạo {label.toLowerCase()}…</div>
            <div className="ag-sub">{sub} · còn khoảng {eta} giây</div></div>
          <div className="ag-pct" style={accent?{color:accent.c}:null}>{pct}%</div>
        </div>
        <div className="ag-bar"><i style={{width:pct+'%', ...(accent?{background:accent.c}:{})}}></i></div>
        <div className="ag-actions"><button className="btn" onClick={onCancel}><Icon name="x" size={14}/>Huỷ tạo</button></div>
      </div>
    </div>
  );
}

function App({onBack, onSaved, embedded, lessonName}){
  const [types, setTypes] = useState(new Set(['baidoc','sachnoi','video','baitap','baigiao']));
  const [content, setContent] = useState('Bài đọc "Tôi là học sinh lớp 2" — kể về cảm xúc của bạn nhỏ trong ngày tựu trường đầu tiên của lớp 2.');
  const [cfg, setCfg] = useState({ grade:'Lớp 2', subject:'Tiếng Việt', voice:'Nova (Nữ trẻ)', vstyle:'Hoạt hình minh hoạ' });
  const [counts, setCounts] = useState({ 'Dễ':2, 'Trung bình':1, 'Khó':1 });
  const [phase, setPhase] = useState('setup');
  const [open, setOpen] = useState('setup');
  const [status, setStatus] = useState({});
  const [audioPct, setAudioPct] = useState(0);
  const [videoPct, setVideoPct] = useState(0);
  const [showHist, setShowHist] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [toast, setToast] = useState(null);
  const [files, setFiles] = useState([]);
  const audioTimer = React.useRef(null);
  const videoTimer = React.useRef(null);
  const addFiles = list => setFiles(f=>[...f, ...[...list].map(x=>({name:x.name, isImg:(x.type||'').startsWith('image/')}))]);

  const toggleType = id => setTypes(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});
  const toggleOpen = id => setOpen(o => o===id ? null : id);
  const sel = id => types.has(id);
  const orderedResults = RTYPES.filter(t=>sel(t.id));

  const setCount = (lv,v) => setCounts(c=>({...c,[lv]:v}));
  const totalBai = BAI_DEFS.reduce((a,d)=>a+(counts[d.level]||0),0);
  const totalCau = totalBai*10;
  // tổng phân bổ độ khó câu hỏi
  const totalMix = useMemo(()=>{
    const m={'Dễ':0,'Trung bình':0,'Khó':0};
    BAI_DEFS.forEach(d=>{ const n=counts[d.level]||0; ['Dễ','Trung bình','Khó'].forEach(l=>m[l]+=n*d.mix[l]); });
    return m;
  },[counts]);

  // danh sách bài (theo thứ tự Dễ→TB→Khó)
  const bais = useMemo(()=>{
    const arr=[];
    BAI_DEFS.forEach(d=>{ for(let i=0;i<(counts[d.level]||0);i++) arr.push({level:d.level, mix:d.mix}); });
    return arr;
  },[counts]);

  const runProgress = (key, setter, timer, doneMsg, speed)=>{
    setStatus(s=>({...s,[key]:'generating'})); setter(0);
    clearInterval(timer.current);
    timer.current = setInterval(()=>{
      setter(p=>{ const np=Math.min(100,p+Math.round(3+Math.random()*7));
        if(np>=100){ clearInterval(timer.current); setStatus(s=>({...s,[key]:'done'})); setToast(doneMsg); setTimeout(()=>setToast(null),2600);} return np; });
    }, speed);
  };
  const runAudio = ()=>runProgress('sachnoi', setAudioPct, audioTimer, '🔊 Đã tạo xong sách nói', 520);
  const runVideo = ()=>runProgress('video', setVideoPct, videoTimer, '🎬 Đã tạo xong video', 560);
  const generate = ()=>{
    const init={}; orderedResults.forEach(t=>init[t.id]='generating');
    setStatus(init); setPhase('ready'); setOpen(orderedResults[0]?.id||'setup');
    if(types.has('baidoc')) setTimeout(()=>setStatus(s=>({...s,baidoc:'done'})),1500);
    if(types.has('baitap')) setTimeout(()=>setStatus(s=>({...s,baitap:'done'})),2300);
    if(types.has('baigiao')) setTimeout(()=>setStatus(s=>({...s,baigiao:'done'})),2600);
    if(types.has('sachnoi')) runAudio();
    if(types.has('video')) runVideo();
  };
  const cancel = (key,timer)=>{ clearInterval(timer.current); setStatus(s=>({...s,[key]:'cancelled'})); };
  const saveAll = ()=>{ setToast('Đã lưu tất cả bài giảng'); setTimeout(()=>setToast(null),2400); if(onSaved) onSaved({types:[...types], totalBai, totalCau, voice:cfg.voice, vstyle:cfg.vstyle}); };

  const setupSummary = `${cfg.subject} · ${cfg.grade} · ${totalBai} bài`;
  const resSummary = {
    baidoc:`1 bài đọc chung`,
    sachnoi:`1 sách nói · giọng ${cfg.voice.split(' (')[0]}`,
    video:`1 video · ${cfg.vstyle}`,
    baitap:`10 câu chung cho cả lớp · 3 Dễ · 4 TB · 3 Khó`,
    baigiao:`${totalBai} bài giao theo 3 nhóm học sinh`,
  };
  const audioBusy = status.sachnoi==='generating';
  const videoBusy = status.video==='generating';

  // giao bài: bài dễ→nhóm yếu, TB→khá, khó→giỏi
  const assignGroupBai = { yeu:(counts['Dễ']||0), kha:(counts['Trung bình']||0), gioi:(counts['Khó']||0) };
  const assignGroupQ = { yeu:(counts['Dễ']||0)*10, kha:(counts['Trung bình']||0)*10, gioi:(counts['Khó']||0)*10 };
  const assignGroupMix = {
    yeu:  scaleMix(BAI_BY_LEVEL['Dễ'].mix, counts['Dễ']||0),
    kha:  scaleMix(BAI_BY_LEVEL['Trung bình'].mix, counts['Trung bình']||0),
    gioi: scaleMix(BAI_BY_LEVEL['Khó'].mix, counts['Khó']||0),
  };

  return (
    <div className="app">
      <TopNav/>
      <div className="page">
        <div className="flow-head">
          {onBack
            ? <button className="flow-back" onClick={onBack}><Icon name="back" size={16}/>Quay lại</button>
            : <a href="Tạo bài giảng.html" className="flow-back"><Icon name="back" size={16}/>Quay lại</a>}
          <div className="flow-spacer"></div>
          {!embedded && <a className="btn btn-primary" href="Thư viện.html"><Icon name="folder" size={16}/>Thư viện</a>}
        </div>
        <h1 className="page-title" style={{marginBottom:18}}>Tạo nội dung bằng AI{lessonName ? <span className="create-lesson"> — {lessonName}</span> : <span className="v2-tag">V3</span>}</h1>

        <div className="type-row">
          {RTYPES.map(t=>(
            <div className={'type-toggle'+(sel(t.id)?' on':'')} key={t.id} onClick={()=>phase==='setup'&&toggleType(t.id)}
                 style={phase!=='setup'?{cursor:'default',opacity:sel(t.id)?1:.45}:{}}>
              <Check on={sel(t.id)}/>
              <span className="tt-ic" style={{background:t.color}}><Icon name={t.icon} size={17}/></span>
              <span className="tt-name">{t.name}</span>
            </div>
          ))}
        </div>

        <div className="acc">
          <Sec id="setup" index={1} title="Nguồn & thiết lập" open={open==='setup'}
               status={phase==='ready'?'done':null} summary={setupSummary} onHeader={toggleOpen}>
            <p className="sec-sub">Nhập nội dung bài học (hoặc tải file), chọn số lượng bài tập theo mức độ. Bài đọc, Sách nói và Video dùng <b>một bản chung</b> cho cả bài học; mỗi bài tập gồm 10 câu.</p>
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
                  <span className="file-pill" key={i}><Icon name={f.isImg?'image':'fileSpread'} size={15}/>{f.name}
                    <span className="x" onClick={()=>setFiles(fs=>fs.filter((_,j)=>j!==i))}><Icon name="x" size={13}/></span></span>
                ))}
              </div>
            )}

            <div className="qty-box">
              <div className="opt-label">Mức độ & số lượng bài</div>
              <p className="lvl-help">Chọn số <b>bài tập</b> muốn tạo ở mỗi mức độ. Mỗi bài tập gồm <b>10 câu hỏi</b> với tỉ lệ độ khó cố định. Bài đọc / Sách nói / Video chỉ tạo một bản chung.</p>
              <div className="lvl-rows">
                {BAI_DEFS.map(d=>(
                  <div className={'lvl-row'+((counts[d.level]||0)>0?' on':'')} key={d.level}>
                    <div className="lr-pick bai" style={{cursor:'default'}}>
                      <LvlBadge level={d.level}/>
                      <span className="bai-rowname">{d.name}</span>
                      <span className="bai-mixtag">{mixStr(d.mix)}</span>
                    </div>
                    <div className="lr-qty">
                      <span className="muted">Số bài</span>
                      <NumStepper value={counts[d.level]||0} min={0} onChange={v=>setCount(d.level,v)}/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lvl-total">Tổng: <b>{totalBai}</b> bài · <b>{totalCau}</b> câu hỏi
                <span className="bai-breakdown"> ({totalMix['Dễ']} Dễ · {totalMix['Trung bình']} TB · {totalMix['Khó']} Khó)</span></div>
            </div>

            <div className="acc-actions">
              <span className="foot-info">Sẽ tạo <b>{totalBai}</b> bài tập + {[sel('baidoc')&&'Bài đọc',sel('sachnoi')&&'Sách nói',sel('video')&&'Video'].filter(Boolean).join(' · ')||'nội dung'} chung</span>
              <button className="btn btn-ai btn-lg" disabled={types.size===0 || totalBai===0} onClick={generate}>
                <Icon name={phase==='ready'?'refresh':'sparkles'} size={16} fill={phase!=='ready'}/>
                {phase==='ready'?'Tạo lại nội dung':`Tạo ${totalBai} bài`}
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
              if(st==='generating'){
                if(t.id==='sachnoi') return <GenericGenerating label="Sách nói" pct={audioPct} sub={`1 bản chung · giọng ${cfg.voice}`} onCancel={()=>cancel('sachnoi',audioTimer)} accent={{c:'#7c3aed',bd:'#e2d5f5',bg:'linear-gradient(180deg,#fcfaff,#f6f0fe)',ring:'#e9ddf8'}}/>;
                if(t.id==='video') return <GenericGenerating label="Video" pct={videoPct} sub={`1 video chung · ${cfg.vstyle}`} onCancel={()=>cancel('video',videoTimer)} accent={{c:'#ea580c',bd:'#fad9bf',bg:'linear-gradient(180deg,#fffaf5,#fff1e6)',ring:'#fbd9bd'}}/>;
                return <div className="skel-note"><span className="spin"/>Đang tạo {t.unit}…</div>;
              }
              if(st==='cancelled'){
                const retry = t.id==='sachnoi'?runAudio : t.id==='video'?runVideo : ()=>setStatus(s=>({...s,[t.id]:'done'}));
                return <div><p className="sec-sub">Đã huỷ tạo {t.unit}. Các phần khác không bị ảnh hưởng.</p>
                  <button className="btn btn-primary" onClick={retry}><Icon name="refresh" size={15}/>Tạo lại {t.unit}</button></div>;
              }
              // done — Bài đọc/Sách nói/Video: một bản chung
              if(t.id==='baidoc') return <ReadingBody/>;
              if(t.id==='sachnoi') return <AudioBody/>;
              if(t.id==='video') return <VideoBody style={cfg.vstyle}/>;
              // Bài tập luyện tập chung — 1 bộ 10 câu (3 Dễ · 4 TB · 3 Khó) cho cả lớp
              if(t.id==='baitap') return (
                <div>
                  <p className="sec-sub">Một bộ <b>10 câu hỏi</b> (3 Dễ · 4 TB · 3 Khó) dùng chung cho <b>cả lớp</b>. Bạn có thể sửa hoặc tạo lại từng câu / cả bài bằng AI.</p>
                  <ExerciseBaiBody bai={{level:'Chung', mix:CHUNG_MIX}}/>
                </div>
              );
              // Bài tập giao học sinh — bài theo mức độ, phân về từng nhóm
              const giaoMap = [
                {grp:'Nhóm yếu',  level:'Dễ',         baiName:'Bài dễ',         n:counts['Dễ']||0},
                {grp:'Nhóm khá',  level:'Trung bình', baiName:'Bài trung bình', n:counts['Trung bình']||0},
                {grp:'Nhóm giỏi', level:'Khó',        baiName:'Bài khó',        n:counts['Khó']||0},
              ];
              return (
                <div>
                  <p className="sec-sub">Các bài tập tạo theo mức độ, giao cho từng nhóm học sinh phù hợp. Mỗi bài 10 câu, có thể sửa / tạo lại bằng AI trước khi giao.</p>
                  <div className="map-note">
                    <Icon name="info" size={15}/>
                    <span>Tự động giao theo mức độ của bài:</span>
                    <span className="map-pair"><LvlBadge level="Dễ"/><Icon name="chevRight" size={13}/><b>Nhóm yếu</b></span>
                    <span className="map-pair"><LvlBadge level="Trung bình"/><Icon name="chevRight" size={13}/><b>Nhóm khá</b></span>
                    <span className="map-pair"><LvlBadge level="Khó"/><Icon name="chevRight" size={13}/><b>Nhóm giỏi</b></span>
                  </div>
                  <div className="giao-grid">
                    {giaoMap.map(g=>{
                      const s = LEVEL_STYLE[g.level];
                      return (
                        <div className="giao-card" key={g.grp} style={{borderColor:s.bg}}>
                          <div className="gc-grp"><span className="gc-grp-ic" style={{background:s.bg,color:s.color}}><Icon name="users" size={16}/></span>{g.grp}</div>
                          <div className="gc-arrow"><Icon name="chevDown" size={16}/></div>
                          <div className="gc-bai" style={{background:s.bg,color:s.color}}><LvlBadge level={g.level}/>{g.baiName}</div>
                          <div className="gc-stat"><b>{g.n}</b> bài · <b>{g.n*10}</b> câu</div>
                        </div>
                      );
                    })}
                  </div>
                  <BaiList bais={bais} color={t.color} unitLabel="Bài"
                    sub={b=>`10 câu · ${mixStr(b.mix)} · giao ${SUG_NHOM[b.level]}`} renderBody={b=> <ExerciseBaiBody bai={b}/>}/>
                  <div className="acc-actions">
                    <span className="foot-info"><b>{totalBai}</b> bài giao cho <b>3</b> nhóm học sinh</span>
                    <button className="btn btn-assign" onClick={()=>setShowAssign(true)}><Icon name="send" size={15}/>Giao bài cho học sinh</button>
                  </div>
                </div>
              );
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
                : <>Đã tạo nội dung cho <b>“{LESSON.title}”</b> · <b>{totalBai}</b> bài tập</>}
            </span>
            <div style={{display:'flex',gap:10}}>
              {!embedded && <a className="btn" href="Thư viện.html"><Icon name="folder" size={15}/>Thư viện</a>}
              <button className="btn btn-primary btn-lg" onClick={saveAll}>
                <Icon name="save" size={16}/>{(audioBusy||videoBusy)?'Lưu phần đã xong':'Lưu tất cả'}
              </button>
            </div>
          </div>
        )}
      </div>

      {showAssign && <AssignModal groupQ={assignGroupQ} groupMix={assignGroupMix} groupBai={assignGroupBai}
        totalAssigned={totalCau} onClose={()=>setShowAssign(false)} onDone={()=>setShowAssign(false)}/>}
      {showHist && <HistoryModal onClose={()=>setShowHist(false)}/>}
      {toast && <div className="toast"><Icon name="check" size={16} stroke={3}/>{toast}</div>}
    </div>
  );
}
function scaleMix(mix,n){ return {'Dễ':mix['Dễ']*n,'Trung bình':mix['Trung bình']*n,'Khó':mix['Khó']*n}; }

Object.assign(window, { CreateContent: App });
if(!window.MOUNT_EXTERNAL){
  ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
}
