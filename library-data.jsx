const { useState, useMemo } = React;

// ===== Dữ liệu thư viện (gom theo từng bài học) =====
const TYPE_META = {
  baidoc:  { name:'Bài đọc',  icon:'reader',     color:'#2563eb', bg:'#e0edff' },
  sachnoi: { name:'Sách nói', icon:'headphones', color:'#7c3aed', bg:'#efe6ff' },
  baitap:  { name:'Bài tập',  icon:'puzzle',     color:'#16a34a', bg:'#dcf5e4' },
};
const LIBRARY = [
  { id:1, title:'Tôi là học sinh lớp 2', subject:'Tiếng Việt', grade:'Lớp 2', week:'Tuần 1', source:'ai', created:'08/06/2026',
    types:{baidoc:1,sachnoi:1,baitap:6}, levels:['Dễ','Trung bình','Khó'], status:'assigned', classes:['2A','2B'] },
  { id:2, title:'Ngày hôm qua đâu rồi?', subject:'Tiếng Việt', grade:'Lớp 2', week:'Tuần 2', source:'ai', created:'07/06/2026',
    types:{baidoc:1,sachnoi:1,baitap:4}, levels:['Dễ','Trung bình'], status:'saved', classes:[] },
  { id:3, title:'Niềm vui của Bi và Bống', subject:'Tiếng Việt', grade:'Lớp 2', week:'Tuần 3', source:'manual', created:'05/06/2026',
    types:{baidoc:1,baitap:5}, levels:['Dễ','Trung bình','Khó'], status:'saved', classes:[] },
  { id:4, title:'Làm việc thật là vui', subject:'Tiếng Việt', grade:'Lớp 2', week:'Tuần 4', source:'ai', created:'04/06/2026',
    types:{baidoc:1,sachnoi:1}, levels:[], status:'draft', classes:[] },
  { id:5, title:'Phép cộng có nhớ trong phạm vi 20', subject:'Toán', grade:'Lớp 2', week:'Tuần 5', source:'manual', created:'02/06/2026',
    types:{baitap:8}, levels:['Dễ','Trung bình','Khó'], status:'assigned', classes:['2A'] },
  { id:6, title:'Cây xấu hổ', subject:'Tiếng Việt', grade:'Lớp 2', week:'Tuần 6', source:'ai', created:'01/06/2026',
    types:{baidoc:1,sachnoi:1,baitap:5}, levels:['Dễ','Trung bình'], status:'draft', classes:[] },
];

const STATUS_META = {
  assigned: { label:'Đã giao', cls:'badge-done', icon:'send' },
  saved:    { label:'Đã lưu',  cls:'badge-saved', icon:'save' },
  draft:    { label:'Nháp',    cls:'badge-draft', icon:'edit' },
};

function levelsToObj(arr){
  return {
    'Dễ':         { on:arr.includes('Dễ'),         n:2 },
    'Trung bình': { on:arr.includes('Trung bình'), n:2 },
    'Khó':        { on:arr.includes('Khó'),        n:1 },
  };
}
function lessonGroupQ(les){
  const N = les.types.baitap||0;
  const gq = {yeu:0,kha:0,gioi:0,lop:0};
  const map = {'Dễ':'yeu','Trung bình':'kha','Khó':'gioi'};
  const lv = les.levels.length?les.levels:[];
  if(N && lv.length){ const per=Math.round(N/lv.length); lv.forEach(l=>gq[map[l]]=per); }
  return gq;
}

function LibraryCard({les, open, onToggle, onAssign, onDup, onDelete}){
  const [tab, setTab] = useState(Object.keys(les.types)[0]);
  const st = STATUS_META[les.status];
  const typeKeys = Object.keys(les.types);
  return (
    <div className={'lib-card'+(open?' open':'')}>
      <button className="lib-head" onClick={onToggle}>
        <span className="lib-thumb"><Icon name="book" size={20}/></span>
        <div className="lib-main">
          <div className="lib-title">{les.title}
            {les.source==='ai'
              ? <span className="src-chip src-ai"><Icon name="sparkles" size={11} fill/>AI</span>
              : <span className="src-chip src-man">Soạn tay</span>}
          </div>
          <div className="lib-meta">{les.subject} · {les.grade} · {les.week} · Tạo {les.created}</div>
        </div>
        <div className="lib-types">
          {typeKeys.map(k=>{
            const m=TYPE_META[k];
            return <span className="lt-chip" key={k} style={{background:m.bg,color:m.color}}>
              <Icon name={m.icon} size={12}/>{m.name}{k==='baitap'?` ${les.types[k]}`:''}</span>;
          })}
        </div>
        <span className={'badge '+st.cls}><Icon name={st.icon} size={12}/>{st.label}{les.status==='assigned'?` · ${les.classes.length} lớp`:''}</span>
        <span className="acc-caret"><Icon name="chevDown" size={18}/></span>
      </button>
      {open && (
        <div className="lib-body">
          <div className="lib-subtabs">
            {typeKeys.map(k=>{
              const m=TYPE_META[k];
              return <button key={k} className={'lst'+(tab===k?' on':'')} onClick={()=>setTab(k)}>
                <Icon name={m.icon} size={14}/>{m.name}{k==='baitap'?` (${les.types[k]})`:''}</button>;
            })}
          </div>
          <div className="lib-content">
            {tab==='baidoc' && <ReadingBody/>}
            {tab==='sachnoi' && <AudioBody/>}
            {tab==='baitap' && <ExerciseBody levels={levelsToObj(les.levels)}/>}
          </div>
          <div className="lib-actions">
            <div style={{display:'flex',gap:8}}>
              <a className="btn" href={'Tạo bài giảng.html'}><Icon name="edit" size={15}/>Sửa nội dung</a>
              <button className="btn" onClick={()=>onDup(les)}><Icon name="layers" size={15}/>Nhân bản</button>
              <button className="btn btn-del" onClick={()=>onDelete(les)}><Icon name="trash" size={15}/>Xoá</button>
            </div>
            <button className="btn btn-primary btn-lg" onClick={()=>onAssign(les)}><Icon name="send" size={16}/>Giao bài cho học sinh</button>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { TYPE_META, LIBRARY, STATUS_META, levelsToObj, lessonGroupQ, LibraryCard });
