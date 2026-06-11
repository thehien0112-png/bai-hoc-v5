// ===== V4: Danh sách bài học (hub) + Tạo nội dung (CreateContent) + Danh sách câu hỏi =====
const { useState, useMemo } = React;

function V4Nav(){
  return (
    <div className="topnav">
      <div className="brand">Tool editor</div>
      <nav className="nav-links">
        <a href="#">Quản lý <Icon name="chevDown" size={14}/></a>
        <a href="#">Mã kích hoạt</a><a href="#">Sự kiện</a>
        <a href="#">Cài đặt tài khoản</a>
        <a href="#">PCNL/NDCD <Icon name="chevDown" size={14}/></a>
      </nav>
      <div className="nav-spacer"></div>
      <div className="nav-user"><span className="avatar"><Icon name="reader" size={16}/></span>Vườn Tri Thức Việt <Icon name="chevDown" size={14}/></div>
    </div>
  );
}

// ---- seed lessons (Toán lớp 1 · Tuần 1) ----
const SEED_LESSONS = [
  { id:1, name:'Bài 1- Các số 0, 1, 2, 3, 4, 5', q:12, baidoc:true,  video:true,  tukhoa:false, sachnoi:true  },
  { id:2, name:'Bài 2- Các số 0, 1, 2, 3, 4, 5', q:10, baidoc:false, video:false, tukhoa:false, sachnoi:false },
  { id:3, name:'Bài 3', q:5, baidoc:false, video:false, tukhoa:false, sachnoi:false },
  { id:4, name:'Bài 4', q:5, baidoc:false, video:false, tukhoa:false, sachnoi:false },
  { id:5, name:'Bài 5', q:5, baidoc:false, video:false, tukhoa:false, sachnoi:false },
];

// ---- question pools (Toán · số 0–5) ----
const THUMB_C = ['#5b8def','#a06bf0','#e9a23b','#46b0e8','#5ec07a','#ee7d6b','#7c83f0','#48c2b6'];
const QPOOL = {
  'Dễ':['Em đếm và chọn số đúng (0–5)','Nối số với số lượng chấm tròn','Chọn số 0','Đếm số bông hoa trong hình',
        'Chọn hình có 2 con cá','Nối số 1, 2, 3 với đồ vật','Số nào đứng sau số 2?','Đếm số ngón tay','Chọn số bé nhất','Tô màu 3 ô vuông'],
  'Trung bình':['So sánh hai nhóm đồ vật','Chọn dấu < > = phù hợp','Sắp xếp 0–5 từ bé đến lớn','Số liền trước của 4 là số nào?',
        'Đếm và viết số tương ứng','Nối phép đếm với kết quả','Tìm số còn thiếu trong dãy','Chọn nhóm nhiều hơn','Điền số vào ô trống','Bài toán đếm có lời'],
  'Khó':['Điền dãy số 0–5 còn thiếu nhiều ô','Bài toán đố: thêm/bớt trong 5','So sánh ba nhóm đồ vật','Tìm quy luật của dãy số',
        'Ghép số với phép tính đơn giản','Sắp xếp các số giảm dần 5–0','Đếm nhanh số vật bị che','Tìm số lớn nhất trong nhóm','Giải bài toán bằng hình ảnh','Tạo dãy số theo điều kiện'],
};
const BAI_MIX = { 'Dễ':{'Dễ':7,'Trung bình':2,'Khó':1}, 'Trung bình':{'Dễ':3,'Trung bình':5,'Khó':2}, 'Khó':{'Dễ':1,'Trung bình':4,'Khó':5} };
const CHUNG_MIX = {'Dễ':3,'Trung bình':4,'Khó':3};
function buildQ(mix){
  const out=[]; let i=0;
  ['Dễ','Trung bình','Khó'].forEach(lv=>{ for(let k=0;k<(mix[lv]||0);k++){ out.push({ text:QPOOL[lv][k%QPOOL[lv].length], level:lv, thumb:THUMB_C[i%THUMB_C.length] }); i++; } });
  return out;
}
const LV_BANNER = { 'Dễ':'yeu', 'Trung bình':'kha', 'Khó':'gioi' };
const LV_GROUP  = { 'Dễ':'Nhóm yếu', 'Trung bình':'Nhóm khá', 'Khó':'Nhóm giỏi' };
// các bài tập đã giao — từng bài theo mức độ (giáo viên có thể tạo nhiều bài mỗi mức)
const ASSIGNED_BAI = [
  { id:'de1',  label:'Bài dễ 1',         level:'Dễ' },
  { id:'de2',  label:'Bài dễ 2',         level:'Dễ' },
  { id:'tb1',  label:'Bài trung bình 1', level:'Trung bình' },
  { id:'kho1', label:'Bài khó 1',        level:'Khó' },
];
function optById(id){
  if(id==='chung') return { id:'chung', label:'Bài luyện tập chung (cả lớp)', level:null, q:buildQ(CHUNG_MIX) };
  const b = ASSIGNED_BAI.find(x=>x.id===id) || ASSIGNED_BAI[0];
  return { ...b, q:buildQ(BAI_MIX[b.level]) };
}

// ================= Screen A: Danh sách bài học =================
function LessonList({lessons, onCreate, onOpen, onEdit}){
  const [sel, setSel] = useState(new Set());
  const allOn = lessons.length>0 && sel.size===lessons.length;
  const Cell = ({on, icon, type, onCreateClick, showCreate, onEdit})=>(
    <div className="cell-actions">
      {on
        ? <button className="cellbtn done" onClick={()=>onEdit(type)}><Icon name="edit" size={14}/>Sửa</button>
        : <button className="cellbtn add"><Icon name="plus" size={15}/><Icon name={icon} size={14}/></button>}
      {showCreate && <button className="cellbtn tao" onClick={onCreateClick}>Tạo</button>}
    </div>
  );
  return (
    <div className="page">
      <div className="crumbs">
        <a href="#">App</a><span className="sep">/</span><a href="#">Con Sáng Tạo PCNL V2</a><span className="sep">/</span>
        <a href="#">Toán lớp 1</a><span className="sep">/</span><a href="#">Tuần 1: Các số 0, 1, 2, 3, 4, 5</a>
      </div>
      <h1 className="page-title">Danh sách bài học</h1>

      <div className="toolbar">
        <button className="btn"><Icon name="back" size={16}/>Quay lại</button>
        <button className="btn btn-primary"><Icon name="plus" size={16}/>Thêm mới</button>
        <button className="btn btn-primary"><Icon name="upload2" size={16}/>Upload câu hỏi</button>
        <button className="btn btn-primary"><Icon name="refresh" size={16}/>Reset thứ tự</button>
        <button className="btn btn-ghost"><Icon name="download" size={16}/>Tải xuống</button>
        <button className="btn-icon round" style={{borderColor:'#dfe3e8'}}><Icon name="folder" size={15}/></button>
      </div>

      <div className="filters">
        <div className="field">
          <select className="select" defaultValue="t1"><option value="t1">Tuần 1: Các số 0, 1, 2, 3, 4, 5</option><option>Tuần 2</option></select>
          <span className="chev"><Icon name="chevDown" size={16}/></span>
        </div>
        <div className="field"><input className="input" placeholder="Tìm kiếm"/><span className="srch"><Icon name="search" size={16}/></span></div>
        <button className="btn">Xóa lọc</button>
      </div>

      <div className="lesson-tbl-wrap">
      <table className="tbl lesson-tbl">
        <thead><tr>
          <th style={{width:34}}><span onClick={()=>setSel(allOn?new Set():new Set(lessons.map(l=>l.id)))}><Check on={allOn}/></span></th>
          <th style={{width:48}}>STT</th>
          <th>Tên bài</th>
          <th style={{width:160}}>Bài đọc</th>
          <th style={{width:120}}>Video</th>
          <th style={{width:130}}>Từ khóa video</th>
          <th style={{width:120}}>Sách nói</th>
          <th style={{width:90}}></th>
        </tr></thead>
        <tbody>
          {lessons.map((l,i)=>(
            <tr key={l.id}>
              <td><span onClick={()=>setSel(s=>{const n=new Set(s);n.has(l.id)?n.delete(l.id):n.add(l.id);return n;})}><Check on={sel.has(l.id)}/></span></td>
              <td className="muted">{i+1}</td>
              <td>
                <button className="lesson-name" onClick={()=>onOpen(l)}>
                  {l.name} <span className="lesson-q">({l.q})</span>
                </button>
              </td>
              <td><Cell on={l.baidoc} icon="list" type="baidoc" onCreateClick={()=>onCreate(l)} onEdit={t=>onEdit(l,t)} showCreate/></td>
              <td><Cell on={l.video} icon="video" type="video" onEdit={t=>onEdit(l,t)}/></td>
              <td><div className="cell-actions"><button className="cellbtn kw"><Icon name="video" size={14}/>Từ khóa</button></div></td>
              <td><div className="cell-actions"><button className={'cellbtn '+(l.sachnoi?'sndone':'snoff')} onClick={()=>l.sachnoi&&onEdit(l,'sachnoi')}>Sách nói</button></div></td>
              <td><div className="row-act"><button className="btn-icon" style={{color:'var(--blue-600)'}}><Icon name="eye" size={18}/></button>
                <button className="btn-icon round" style={{borderColor:'#e0e3e8',background:'#eef0f3'}}><Icon name="dots" size={15}/></button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <div className="pager"><span className="page-arrow"><Icon name="chevLeft" size={18}/></span>
        <span className="page-num">1</span><span className="page-arrow"><Icon name="chevRight" size={18}/></span>
        <span className="muted" style={{marginLeft:8,fontSize:13}}>20/trang</span></div>
    </div>
  );
}

// ================= Screen C: Danh sách câu hỏi luyện tập =================
function QuestionsScreen({lesson, onBack}){
  const [optId, setOptId] = useState('chung');
  const [q, setQ] = useState('');
  const opt = optById(optId);
  const rows = opt.q.filter(r=>!q || r.text.toLowerCase().includes(q.toLowerCase()));
  const bannerCls = optId==='chung' ? 'chung' : LV_BANNER[opt.level];
  return (
    <div className="page">
      <div className="crumbs">
        <a href="#">App</a><span className="sep">/</span><a href="#">Con Sáng Tạo PCNL V2</a><span className="sep">/</span>
        <a href="#">Toán lớp 1</a><span className="sep">/</span><a href="#">Tuần 1: Các số 0, 1, 2, 3, 4, 5</a><span className="sep">/</span>
        <a href="#" onClick={e=>{e.preventDefault();onBack();}}>{lesson.name}</a>
      </div>
      <h1 className="page-title">Danh sách câu hỏi luyện tập</h1>

      <div className="toolbar">
        <button className="btn" onClick={onBack}><Icon name="back" size={16}/>Quay lại</button>
        <button className="btn btn-primary"><Icon name="plus" size={16}/>Thêm mới</button>
        <button className="btn btn-primary"><Icon name="upload2" size={16}/>Upload câu hỏi</button>
        <button className="btn btn-ghost"><Icon name="fileSpread" size={16}/>Import Excel</button>
        <button className="btn btn-primary"><Icon name="refresh" size={16}/>Reset thứ tự</button>
        <button className="btn-icon round" style={{borderColor:'#dfe3e8'}}><Icon name="download" size={15}/></button>
      </div>

      <div className="filters">
        <div className="field">
          <select className="select" value={lesson.id} disabled><option value={lesson.id}>{lesson.name}</option></select>
          <span className="chev"><Icon name="chevDown" size={16}/></span>
        </div>
        <div className="field"><input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm kiếm"/><span className="srch"><Icon name="search" size={16}/></span></div>
        <button className="btn" onClick={()=>setQ('')}>Xóa lọc</button>

        <div className="dropdown-pick">
          <span className="dp-label"><Icon name="layers" size={15}/>Bộ câu hỏi</span>
          <div className="field">
            <select className="select dp-select" value={optId} onChange={e=>setOptId(e.target.value)}>
              <optgroup label="Luyện tập chung">
                <option value="chung">Bài luyện tập chung (cả lớp) · 10 câu</option>
              </optgroup>
              <optgroup label="Bài tập đã giao cho học sinh">
                {ASSIGNED_BAI.map(b=><option key={b.id} value={b.id}>{b.label} ({b.level}) · 10 câu</option>)}
              </optgroup>
            </select>
            <span className="chev"><Icon name="chevDown" size={16}/></span>
          </div>
        </div>
      </div>

      <div className={'set-banner '+bannerCls}>
        <Icon name={optId==='chung'?'users':'send'} size={16}/>
        <b>{opt.label}</b>
        {optId!=='chung' && <span className="banner-giao"><Icon name="chevRight" size={13}/>giao cho <b>{LV_GROUP[opt.level]}</b></span>}
        <span className="muted">— đang hiển thị {rows.length} câu hỏi</span>
      </div>

      <table className="tbl q-tbl">
        <thead><tr>
          <th style={{width:34}}><Check on={false}/></th>
          <th style={{width:48}}>STT</th>
          <th>Nội dung câu hỏi</th>
          <th style={{width:110}}>Mức độ</th>
          <th style={{width:150}}>Mẫu / chọn mẫu</th>
          <th style={{width:170}}></th>
        </tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td><Check on={false}/></td>
              <td className="muted">{i+1}</td>
              <td className="qrow-text">{r.text}</td>
              <td><LvlBadge level={r.level}/></td>
              <td><span className="qthumb" style={{background:`linear-gradient(135deg,${r.thumb},${r.thumb}bb)`}}><Icon name="puzzle" size={16}/></span></td>
              <td><div className="qrow-act">
                <button className="btn-icon" style={{color:'var(--blue-600)'}}><Icon name="eye" size={17}/></button>
                <button className="linkbtn">Sửa</button>
                <button className="linkbtn del">Xóa</button>
                <button className="btn-icon" style={{color:'var(--blue-600)'}}><Icon name="message" size={16}/></button>
              </div></td>
            </tr>
          ))}
          {rows.length===0 && <tr><td colSpan={6} className="empty-note">Không có câu hỏi nào khớp.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

// ================= Screen D: Xem / sửa nội dung đã tạo =================
const CONTENT_META = {
  baidoc:  { title:'Bài đọc',          icon:'reader',     color:'#2563eb' },
  video:   { title:'Video bài giảng',   icon:'video',      color:'#ea580c' },
  sachnoi: { title:'Sách nói',          icon:'headphones', color:'#7c3aed' },
};
function ContentScreen({lesson, type, onBack}){
  const m = CONTENT_META[type];
  return (
    <div className="page">
      <div className="crumbs">
        <a href="#">App</a><span className="sep">/</span><a href="#">Con Sáng Tạo PCNL V2</a><span className="sep">/</span>
        <a href="#">Toán lớp 1</a><span className="sep">/</span><a href="#">Tuần 1: Các số 0, 1, 2, 3, 4, 5</a><span className="sep">/</span>
        <a href="#" onClick={e=>{e.preventDefault();onBack();}}>{lesson.name}</a><span className="sep">/</span><span>{m.title}</span>
      </div>
      <div className="flow-head">
        <button className="flow-back" onClick={onBack}><Icon name="back" size={16}/>Quay lại danh sách</button>
      </div>
      <h1 className="page-title" style={{display:'flex',alignItems:'center',gap:12}}>
        <span className="content-ic" style={{background:m.color}}><Icon name={m.icon} size={20}/></span>
        {m.title}
      </h1>
      <p className="lesson-sub" style={{marginTop:-8}}>{lesson.name} · Toán lớp 1 · nội dung do AI tạo</p>
      <div className="content-card">
        {type==='baidoc'  && <ReadingBody/>}
        {type==='video'   && <VideoBody style="Hoạt hình minh hoạ"/>}
        {type==='sachnoi' && <AudioBody/>}
      </div>
    </div>
  );
}

// ================= Root =================
function V4App(){
  const [screen, setScreen] = useState('list');   // list | create | questions
  const [lessons, setLessons] = useState(SEED_LESSONS);
  const [active, setActive] = useState(null);
  const [ctype, setCtype] = useState(null);
  const [toast, setToast] = useState(null);

  const goCreate = lesson => { setActive(lesson); setScreen('create'); };
  const goQuestions = lesson => { setActive(lesson); setScreen('questions'); };
  const goContent = (lesson, type) => { setActive(lesson); setCtype(type); setScreen('content'); };
  const onSaved = () => {
    if(active) setLessons(ls=>ls.map(l=>l.id===active.id ? {...l, baidoc:true, video:true, tukhoa:true, sachnoi:true} : l));
    setScreen('list');
    setToast('Đã lưu nội dung vào bài “'+(active?active.name:'')+'”');
    setTimeout(()=>setToast(null),2800);
  };

  if(screen==='create')
    return <CreateContent embedded lessonName={active?.name} onBack={()=>setScreen('list')} onSaved={onSaved}/>;

  return (
    <div className="app">
      <V4Nav/>
      {screen==='list' && <LessonList lessons={lessons} onCreate={goCreate} onOpen={goQuestions} onEdit={goContent}/>}
      {screen==='questions' && <QuestionsScreen lesson={active} onBack={()=>setScreen('list')}/>}
      {screen==='content' && <ContentScreen lesson={active} type={ctype} onBack={()=>setScreen('list')}/>}
      {toast && <div className="toast"><Icon name="check" size={16} stroke={3}/>{toast}</div>}
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<V4App/>);
