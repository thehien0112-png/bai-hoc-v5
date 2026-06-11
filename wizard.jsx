// ============ Lesson type definitions ============
const TYPES = [
  { id:'baidoc', name:'Bài đọc', icon:'reader', color:'#2563eb',
    sub:'Sinh nhanh, 10–30 giây', tag:'Nhanh', tagBg:'#e0edff', tagColor:'#1d63c9' },
  { id:'sachnoi', name:'Sách nói', icon:'headphones', color:'#7c3aed',
    sub:'Bất đồng bộ, 2–3 phút', tag:'Audio', tagBg:'#efe6ff', tagColor:'#6d28d9' },
  { id:'video', name:'Video', icon:'video', color:'#ea580c',
    sub:'Bất đồng bộ, 1–2 phút', tag:'Video', tagBg:'#ffe8d6', tagColor:'#c2410c' },
  { id:'baitap', name:'Bài tập', icon:'puzzle', color:'#16a34a',
    sub:'Câu hỏi trắc nghiệm, tự sinh', tag:'Q&A', tagBg:'#dcf5e4', tagColor:'#15803d' },
];

const defaultCfg = {
  baidoc:  { dodai:'Vừa', hinhanh:true },
  sachnoi: { giong:'Nữ miền Bắc', tocdo:'Vừa' },
  video:   { thoiluong:'1–2 phút', phongcach:'Hình minh hoạ' },
  baitap:  { mucdo:'Dễ', chon:3, sapxep:2, noi:2 },
};

// ============ Step 1 — Nguồn dữ liệu ============
function Step1({src, setSrc}){
  const pick = (key, label) => setSrc(s=>({...s,[key]:label}));
  return (
    <div>
      <div className="sec-title">Nguồn dữ liệu</div>
      <p className="sec-sub">Tải lên quyển sách giáo khoa và file phân phối chương trình. Hệ thống AI sẽ đọc file để liệt kê toàn bộ các tiết học.</p>
      <div className="upload-grid">
        <Dropzone label="Quyển sách (SGK)" hint="PDF / Word · tối đa 50MB"
          icon="book" file={src.book} onPick={()=>pick('book','Tiếng Việt 2 - Tập 1.pdf')}
          onClear={()=>pick('book',null)} tag="Nguồn nội dung"/>
        <Dropzone label="File phân phối chương trình" hint="Excel (.xlsx) · bắt buộc"
          icon="fileSpread" file={src.ppct} onPick={()=>pick('ppct','Phân phối chương trình Tiếng Việt lớp 2.xlsx')}
          onClear={()=>pick('ppct',null)} tag="Danh sách tiết" required/>
      </div>
      <div className="field-row">
        <div>
          <label className="lbl-sm">Lớp</label>
          <select className="ctrl" defaultValue="Lớp 2">
            <option>Lớp 1</option><option>Lớp 2</option><option>Lớp 3</option>
            <option>Lớp 4</option><option>Lớp 5</option>
          </select>
        </div>
        <div>
          <label className="lbl-sm">Môn học</label>
          <select className="ctrl" defaultValue="Tiếng Việt">
            <option>Tiếng Việt</option><option>Toán</option><option>Tự nhiên & Xã hội</option><option>Đạo đức</option>
          </select>
        </div>
      </div>
      {src.ppct && (
        <div className="hint-line" style={{color:'#15803d',background:'#eefaf1',borderColor:'#cdeed6'}}>
          <Icon name="check" size={16} stroke={3}/>
          Đã đọc file — tìm thấy <b style={{margin:'0 3px'}}>{WEEKS.length} tuần</b> và <b style={{margin:'0 3px'}}>{TOTAL_ENTRIES} bài học</b>. Bấm “Tiếp tục” để chọn tiết.
        </div>
      )}
    </div>
  );
}
function Dropzone({label, hint, icon, file, onPick, onClear, tag, required}){
  return (
    <div className={'dropzone'+(file?' filled':'')} onClick={()=>!file&&onPick()}>
      <div className="dz-icon"><Icon name={file?'check':icon} size={24} stroke={file?3:2}/></div>
      <div className="dz-title">{label}{required&&<span style={{color:'#dc2626'}}> *</span>}</div>
      {!file && <div className="dz-hint">{hint}</div>}
      {!file && <div className="dz-tag">{tag}</div>}
      {file && (
        <div className="file-pill" onClick={e=>e.stopPropagation()}>
          <Icon name="fileSpread" size={16}/>{file}
          <span className="x" onClick={onClear}><Icon name="x" size={14}/></span>
        </div>
      )}
    </div>
  );
}

// ============ Step 2 — Chọn tiết ============
function Step2({selected, setSelected, openWeeks, setOpenWeeks}){
  const [q, setQ] = React.useState('');
  const [wk, setWk] = React.useState('all');

  const allKeys = React.useMemo(()=>WEEKS.flatMap((w,wi)=>w.entries.map((_,ei)=>wi+'-'+ei)),[]);
  const visibleWeeks = WEEKS.map((w,wi)=>({w,wi}))
    .filter(({wi})=> wk==='all' || String(WEEKS[wi].tuan)===wk)
    .map(({w,wi})=>({
      w, wi,
      entries: w.entries.map((e,ei)=>({e,ei,key:wi+'-'+ei}))
        .filter(({e})=> !q || e.name.toLowerCase().includes(q.toLowerCase()) || (e.bai||'').toLowerCase().includes(q.toLowerCase()))
    })).filter(g=>g.entries.length>0);

  const selCount = selected.size;
  const toggle = key => setSelected(s=>{const n=new Set(s); n.has(key)?n.delete(key):n.add(key); return n;});
  const toggleWeek = (wi, keys) => setSelected(s=>{
    const n=new Set(s); const allOn=keys.every(k=>n.has(k));
    keys.forEach(k=> allOn?n.delete(k):n.add(k)); return n;
  });
  const allOn = selected.size===allKeys.length;
  const someOn = selected.size>0 && !allOn;
  const toggleAll = ()=> setSelected(allOn? new Set() : new Set(allKeys));

  return (
    <div>
      <div className="sec-title">Chọn tiết học để tạo bài giảng</div>
      <p className="sec-sub">Toàn bộ tiết được lấy từ file phân phối chương trình. Mặc định đã chọn tất cả — bạn có thể bỏ chọn những tiết không cần.</p>

      <div className="s2-bar">
        <button className="btn btn-ghost" style={{border:'1.5px solid var(--line-2)',height:42}} onClick={toggleAll}>
          <Check on={allOn} indet={someOn}/>{allOn?'Bỏ chọn tất cả':'Chọn tất cả'}
        </button>
        <input className="s2-search" placeholder="Tìm theo tên bài, dạng bài…" value={q} onChange={e=>setQ(e.target.value)}/>
        <select className="pill-select" value={wk} onChange={e=>setWk(e.target.value)}>
          <option value="all">Tất cả các tuần</option>
          {WEEKS.map(w=> <option key={w.tuan} value={String(w.tuan)}>Tuần {w.tuan}</option>)}
        </select>
        <div className="sel-summary">Đã chọn <span className="count-chip">{selCount}/{allKeys.length}</span> bài</div>
      </div>

      <div className="lessons">
        {visibleWeeks.map(({w,wi,entries})=>{
          const keys = entries.map(x=>x.key);
          const onCnt = keys.filter(k=>selected.has(k)).length;
          const open = openWeeks.has(wi);
          return (
            <div className="wk" key={wi}>
              <div className={'wk-head'+(open?' open':'')} onClick={()=>setOpenWeeks(s=>{const n=new Set(s);n.has(wi)?n.delete(wi):n.add(wi);return n;})}>
                <span className="caret"><Icon name="chevRight" size={16}/></span>
                <span onClick={e=>{e.stopPropagation();toggleWeek(wi,keys);}}>
                  <Check on={onCnt===keys.length} indet={onCnt>0&&onCnt<keys.length}/>
                </span>
                <div>
                  <div className="wk-name">Tuần {w.tuan}</div>
                  <div className="wk-theme">{w.theme}</div>
                </div>
                <div className="wk-meta">
                  <span className="wk-badge">{onCnt}/{keys.length} bài</span>
                </div>
              </div>
              {open && entries.map(({e,key})=>(
                <div className={'lesson-row'+(selected.has(key)?' sel':'')} key={key} onClick={()=>toggle(key)}>
                  <Check on={selected.has(key)}/>
                  <span className="l-tiet">Tiết {e.tiet.length>1? e.tiet[0]+'–'+e.tiet[e.tiet.length-1] : e.tiet[0]}</span>
                  <div className="l-main">
                    <div className="l-name">{e.name}</div>
                    <div className="l-bai">{e.bai}</div>
                    {e.note && <div className="l-note">{e.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
        {visibleWeeks.length===0 && <div className="empty-note">Không tìm thấy tiết nào khớp.</div>}
      </div>
    </div>
  );
}

// ============ Step 3 — Loại bài giảng ============
function Step3({types, setTypes, cfg, setCfg}){
  const toggle = id => setTypes(s=>{const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n;});
  const upd = (id,patch)=> setCfg(c=>({...c,[id]:{...c[id],...patch}}));
  return (
    <div>
      <div className="sec-title">Chọn loại bài giảng <span style={{fontWeight:500,color:'var(--muted)',fontSize:13.5}}>(có thể chọn nhiều)</span></div>
      <p className="sec-sub">Mỗi tiết đã chọn sẽ được AI tạo ra theo từng loại bên dưới.</p>
      <div className="type-grid">
        {TYPES.map(t=>{
          const on = types.has(t.id);
          return (
            <div className={'type-card'+(on?' on':'')} key={t.id} onClick={()=>toggle(t.id)}>
              <div className="tc-head">
                <Check on={on} size={20}/>
                <div className="tc-ic" style={{background:t.color}}><Icon name={t.icon} size={22}/></div>
                <div className="tc-meta">
                  <div className="tc-name">{t.name}
                    <span className="tc-tag" style={{background:t.tagBg,color:t.tagColor}}>{t.tag}</span></div>
                  <div className="tc-sub">{t.sub}</div>
                </div>
              </div>
              {on && <div className="tc-body" onClick={e=>e.stopPropagation()}>{renderCfg(t.id,cfg[t.id],upd)}</div>}
            </div>
          );
        })}
      </div>
      {types.size===0 && <div className="hint-line"><Icon name="warn" size={16}/>Hãy chọn ít nhất một loại bài giảng để tiếp tục.</div>}
    </div>
  );
}
function Seg({value,options,onChange}){
  return <div className="seg">{options.map(o=><button key={o} className={value===o?'on':''} onClick={()=>onChange(o)}>{o}</button>)}</div>;
}
function renderCfg(id,c,upd){
  if(id==='baidoc') return (
    <div className="opt-row">
      <div className="opt-col"><div className="opt-label">Độ dài bài đọc</div><Seg value={c.dodai} options={['Ngắn','Vừa','Dài']} onChange={v=>upd('baidoc',{dodai:v})}/></div>
      <div className="opt-col"><div className="opt-label">Hình minh hoạ</div>
        <div className="toggle-row" onClick={()=>upd('baidoc',{hinhanh:!c.hinhanh})}><Toggle on={c.hinhanh}/> {c.hinhanh?'Có chèn hình':'Không chèn'}</div></div>
    </div>
  );
  if(id==='sachnoi') return (
    <div className="opt-row">
      <div className="opt-col"><div className="opt-label">Giọng đọc</div><Seg value={c.giong} options={['Nữ miền Bắc','Nam miền Bắc','Nữ miền Nam']} onChange={v=>upd('sachnoi',{giong:v})}/></div>
      <div className="opt-col"><div className="opt-label">Tốc độ</div><Seg value={c.tocdo} options={['Chậm','Vừa','Nhanh']} onChange={v=>upd('sachnoi',{tocdo:v})}/></div>
    </div>
  );
  if(id==='video') return (
    <div className="opt-row">
      <div className="opt-col"><div className="opt-label">Thời lượng</div><Seg value={c.thoiluong} options={['1–2 phút','3–5 phút']} onChange={v=>upd('video',{thoiluong:v})}/></div>
      <div className="opt-col"><div className="opt-label">Phong cách</div><Seg value={c.phongcach} options={['Hình minh hoạ','Hoạt hình']} onChange={v=>upd('video',{phongcach:v})}/></div>
    </div>
  );
  if(id==='baitap') return (
    <div>
      <div className="opt-label">Mức độ</div>
      <Seg value={c.mucdo} options={['Dễ','Trung bình','Khó']} onChange={v=>upd('baitap',{mucdo:v})}/>
      <div className="opt-label" style={{marginTop:14}}>Số lượng câu hỏi theo loại</div>
      <div className="qty-grid">
        <div className="qty"><label>Chọn</label><NumStepper value={c.chon} onChange={v=>upd('baitap',{chon:v})}/></div>
        <div className="qty"><label>Sắp xếp</label><NumStepper value={c.sapxep} onChange={v=>upd('baitap',{sapxep:v})}/></div>
        <div className="qty"><label>Nối</label><NumStepper value={c.noi} onChange={v=>upd('baitap',{noi:v})}/></div>
      </div>
      <div className="formula">Tổng: {c.chon+c.sapxep+c.noi} câu hỏi / tiết</div>
    </div>
  );
}

// ============ Step 4 — Xác nhận & tạo ============
function Step4({selCount, types, cfg, phase, progress, genList}){
  const chosen = TYPES.filter(t=>types.has(t.id));
  if(phase==='done') return (
    <div className="done-hero">
      <div className="ring"><Icon name="check" size={40} stroke={3}/></div>
      <h3>Đã tạo xong {selCount*chosen.length} bài giảng!</h3>
      <p>Các bài giảng đã được thêm vào danh sách tuần. Bạn có thể xem lại và chỉnh sửa bất cứ lúc nào.</p>
    </div>
  );
  if(phase==='gen') return (
    <div className="gen-wrap">
      <div style={{fontWeight:700,marginBottom:6}}>Đang tạo bài giảng bằng AI…</div>
      <div className="bar"><i style={{width:progress+'%'}}/></div>
      {genList.map((g,i)=>(
        <div className="gen-item" key={i}>
          <div className="gi-ic" style={{background:g.color+'22',color:g.color}}><Icon name={g.icon} size={16}/></div>
          <div className="gi-name">{g.label}</div>
          {g.status==='done' ? <span className="gi-status" style={{color:'var(--ok)'}}><Icon name="check" size={16} stroke={3}/></span>
            : g.status==='run' ? <span className="spin"/> 
            : <span className="gi-status muted">Chờ…</span>}
        </div>
      ))}
    </div>
  );
  // review
  const total = selCount*chosen.length;
  return (
    <div>
      <div className="sec-title">Xác nhận & tạo bài giảng</div>
      <p className="sec-sub">Kiểm tra lại trước khi AI bắt đầu tạo.</p>
      <div className="review-grid">
        <div className="panel">
          <h4><Icon name="layers" size={16}/> Tóm tắt</h4>
          <div className="kv"><span className="k">Môn / Lớp</span><span className="v">Tiếng Việt · Lớp 2</span></div>
          <div className="kv"><span className="k">Số tiết đã chọn</span><span className="v">{selCount} tiết</span></div>
          <div className="kv"><span className="k">Loại bài giảng</span><span className="v">{chosen.length} loại</span></div>
          <div className="kv"><span className="k">Nguồn</span><span className="v">SGK + File PPCT</span></div>
          <div style={{marginTop:14}}>
            <div className="opt-label">Các loại được chọn</div>
            <div className="type-chips">
              {chosen.map(t=><span className="type-chip" key={t.id} style={{background:t.color}}><Icon name={t.icon} size={14}/>{t.name}</span>)}
            </div>
          </div>
        </div>
        <div>
          <div className="summary-big">
            <div className="num">{total}</div>
            <div className="cap">bài giảng sẽ được tạo</div>
            <div className="formula">{selCount} tiết × {chosen.length} loại</div>
          </div>
          {types.has('baitap') && (
            <div className="panel" style={{marginTop:16}}>
              <h4><Icon name="puzzle" size={16}/> Bài tập</h4>
              <div className="kv"><span className="k">Mức độ</span><span className="v">{cfg.baitap.mucdo}</span></div>
              <div className="kv"><span className="k">Câu hỏi / tiết</span><span className="v">{cfg.baitap.chon+cfg.baitap.sapxep+cfg.baitap.noi} câu</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TYPES, defaultCfg, Step1, Step2, Step3, Step4 });
