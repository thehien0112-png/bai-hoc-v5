// ===== Bài tập luyện tập (questions) =====
const QUESTIONS = [
  { id:1, kind:'chon', level:'Dễ', text:'Bạn nhỏ trong bài đọc cảm thấy thế nào khi đến trường?',
    options:[{t:'Sợ hãi, lo lắng'},{t:'Mình đã lớn bổng lên',correct:true},{t:'Buồn bã, nhớ nhà'},{t:'Mệt mỏi, chán nản'}], inc:true },
  { id:2, kind:'chon', level:'Dễ', text:'Ai đã gọi bạn nhỏ dậy vào buổi sáng tựu trường?',
    options:[{t:'Bố'},{t:'Mẹ',correct:true},{t:'Bà'},{t:'Anh trai'}], inc:true },
  { id:3, kind:'sapxep', level:'Trung bình', text:'Sắp xếp các sự việc theo đúng trình tự trong bài đọc "Tôi là học sinh lớp 2".',
    seq:['Sáng sớm, mẹ gọi, bạn nhỏ vùng dậy và chuẩn bị xong mọi thứ rất nhanh.',
         'Bạn nhỏ chào mẹ rồi chạy ào vào cùng các bạn đang ríu rít trong sân trường.',
         'Bạn nhỏ thấy các em lớp 1 rụt rè níu tay bố mẹ và cảm thấy mình lớn bổng lên.'], inc:true },
  { id:4, kind:'sapxep', level:'Trung bình', text:'Sắp xếp các từ sau thành câu hoàn chỉnh.',
    seq:['Ánh nắng','tràn ngập','sân trường.'], inc:true },
  { id:5, kind:'noi', level:'Khó', text:'Nối từ ngữ ở cột A với nghĩa phù hợp ở cột B.',
    pairs:[['ríu rít','nói chuyện vui vẻ, liền nhau'],['rụt rè','e dè, chưa mạnh dạn'],['vùng dậy','bật dậy thật nhanh']], inc:true },
  { id:6, kind:'chon', level:'Khó', text:'Theo em, vì sao bạn nhỏ lại cảm thấy "mình đã lớn bổng lên"?',
    options:[{t:'Vì bạn cao hơn năm ngoái'},{t:'Vì bạn thấy mình trưởng thành hơn các em lớp 1',correct:true},{t:'Vì bạn được mặc áo mới'},{t:'Vì bạn đến trường sớm'}], inc:false },
];
const KIND_LABEL = { chon:'Chọn', sapxep:'Sắp xếp', noi:'Nối' };
const LEVEL_STYLE = {
  'Dễ':         { bg:'#e8f7ee', color:'#15803d' },
  'Trung bình': { bg:'#fdf3e0', color:'#b45309' },
  'Khó':        { bg:'#fde8e6', color:'#c2410c' },
};
function LvlBadge({level}){
  const s = LEVEL_STYLE[level] || LEVEL_STYLE['Dễ'];
  return <span className="lvl-badge" style={{background:s.bg, color:s.color}}>{level}</span>;
}

// nhóm học sinh để giao bài
const GROUPS = [
  { id:'yeu',  name:'Nhóm yếu',  sug:'Dễ',         color:'#15803d', bg:'#e8f7ee' },
  { id:'kha',  name:'Nhóm khá',  sug:'Trung bình', color:'#b45309', bg:'#fdf3e0' },
  { id:'gioi', name:'Nhóm giỏi', sug:'Khó',        color:'#c2410c', bg:'#fde8e6' },
  { id:'lop',  name:'Cả lớp',    sug:null,         color:'#1d63c9', bg:'#e6efff' },
];
const GROUP_BY_ID = Object.fromEntries(GROUPS.map(g=>[g.id,g]));
const SUG_GROUP = { 'Dễ':'yeu', 'Trung bình':'kha', 'Khó':'gioi' };

function ExerciseBody({levels}){
  const active = Object.keys(levels).filter(k=>levels[k].on);
  const items = QUESTIONS.filter(q=>active.includes(q.level));

  const [tab, setTab] = React.useState('all');
  const [lvlF, setLvlF] = React.useState('all');
  const [inc, setInc] = React.useState(new Set(items.filter(q=>q.inc).map(q=>q.id)));
  const [showAssign, setShowAssign] = React.useState(false);

  const LV = ['Dễ','Trung bình','Khó'];
  const avail = {}; LV.forEach(l=>avail[l]=items.filter(q=>q.level===l).length);
  const CORE    = { yeu:'Dễ',          kha:'Trung bình', gioi:'Khó' };
  const STRETCH = { yeu:'Trung bình',  kha:'Khó',        gioi:null  };
  const makeDefault = ()=>({
    yeu:  {'Dễ':avail['Dễ'],           'Trung bình':Math.min(1,avail['Trung bình']), 'Khó':0},
    kha:  {'Dễ':0, 'Trung bình':avail['Trung bình'], 'Khó':Math.min(1,avail['Khó'])},
    gioi: {'Dễ':0, 'Trung bình':Math.min(1,avail['Trung bình']),  'Khó':avail['Khó']},
  });
  const [recipe, setRecipe] = React.useState(makeDefault);
  const [openG, setOpenG] = React.useState({});
  const G3 = GROUPS.filter(g=>g.id!=='lop');

  const setRq = (gid,lv,v)=> setRecipe(r=>({...r,[gid]:{...r[gid],[lv]:v}}));
  const basketFor = gid => { const r=recipe[gid]||{}; const out=[]; LV.forEach(l=>{ out.push(...items.filter(q=>q.level===l).slice(0,r[l]||0)); }); return out; };
  const totalFor = gid => LV.reduce((a,l)=>a+(recipe[gid]?.[l]||0),0);
  const grandTotal = G3.reduce((a,g)=>a+totalFor(g.id),0);
  const anyAssigned = grandTotal>0;
  const groupQ = Object.fromEntries(G3.map(g=>[g.id, totalFor(g.id)]));
  const groupMix = Object.fromEntries(G3.map(g=>[g.id, recipe[g.id]]));

  const byLvl = items.filter(q => lvlF==='all' || q.level===lvlF);
  const counts = { all:byLvl.length, chon:0, sapxep:0, noi:0 };
  byLvl.forEach(q=>counts[q.kind]++);
  const list = byLvl.filter(q=>tab==='all'||q.kind===tab);

  const toggleInc = id => setInc(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});

  // phân bổ mức độ
  const dist = ['Dễ','Trung bình','Khó'].map(l=>({l, n:items.filter(q=>q.level===l).length})).filter(d=>d.n>0);

  return (
    <div>
      <p className="sec-sub">AI đã tạo <b>{items.length} câu hỏi</b> ở {active.length} mức độ. Tích <b>“Đưa vào bài tập”</b> để dùng chung, và đặt <b>“công thức đề”</b> để giao theo nhóm học sinh.</p>

      <div className="lvl-dist">
        <span className="ld-label">Phân bổ mức độ:</span>
        {dist.map(d=>(<span className="ld-item" key={d.l}><LvlBadge level={d.l}/><b>{d.n}</b> câu</span>))}
      </div>

      {/* Giao bài theo nhóm — nâng dần độ khó */}
      <div className="basket-wrap">
        <div className="ab-head">
          <div className="ab-title"><Icon name="users" size={16}/>Giao bài theo nhóm — nâng dần độ khó</div>
          <button className="btn ab-auto" onClick={()=>setRecipe(makeDefault())}><Icon name="target" size={14}/>Đề xuất lại</button>
        </div>
        <p className="basket-help">Mỗi nhóm nhận <b>chủ yếu câu đúng trình độ</b> và <b>thêm vài câu khó hơn một bậc</b> để thử thách. Bạn có thể chỉnh số câu mỗi mức cho từng nhóm.</p>
        <div className="basket-grid">
          {G3.map(g=>{
            const total=totalFor(g.id); const picked=basketFor(g.id);
            return (
              <div className="basket-card" key={g.id} style={{borderTopColor:g.color}}>
                <div className="bc-head">
                  <span className="ac-dot" style={{background:g.color}}></span>
                  <span className="bc-name">{g.name}</span>
                  <span className="bc-focus" style={{color:g.color,background:g.bg}}>Trình độ {CORE[g.id]}</span>
                </div>
                <div className="bc-rows">
                  {LV.filter(l=>avail[l]>0).map(l=>{
                    const isCore=CORE[g.id]===l, isStretch=STRETCH[g.id]===l;
                    return (
                      <div className={'bc-row'+(isCore?' core':'')} key={l}>
                        <LvlBadge level={l}/>
                        {isCore && <span className="bc-tag">trọng tâm</span>}
                        {isStretch && <span className="bc-tag stretch">thử thách</span>}
                        <div className="bc-step"><NumStepper value={recipe[g.id][l]||0} min={0} max={avail[l]} onChange={v=>setRq(g.id,l,v)}/></div>
                      </div>
                    );
                  })}
                </div>
                <div className="bc-foot">
                  <span className="bc-total">Tổng <b>{total}</b> câu</span>
                  {total>0 && <button className="bc-see" onClick={()=>setOpenG(o=>({...o,[g.id]:!o[g.id]}))}>{openG[g.id]?'Ẩn':'Xem'} câu</button>}
                </div>
                {openG[g.id] && (
                  <div className="bc-list">
                    {picked.map(q=><div className="bc-q" key={q.id}><LvlBadge level={q.level}/><span>{q.text}</span></div>)}
                    {picked.length===0 && <div className="muted" style={{fontSize:12.5,padding:'6px 2px'}}>Chưa chọn câu nào.</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="q-tabs">
        {[['all','Tất cả'],['chon','Chọn'],['sapxep','Sắp xếp'],['noi','Nối']].map(([k,l])=>(
          <button key={k} className={'q-tab'+(tab===k?' on':'')} onClick={()=>setTab(k)}>
            {l}<span className="cnt">{counts[k]}</span>
          </button>
        ))}
        {active.length>1 && (
          <div className="lvl-filter">
            <span className="lvl-flabel">Lọc mức:</span>
            {[['all','Tất cả'], ...active.map(l=>[l, l==='Trung bình'?'TB':l])].map(([k,l])=>(
              <button key={k} className={'lvl-pill'+(lvlF===k?' on':'')} onClick={()=>setLvlF(k)}>{l}</button>
            ))}
          </div>
        )}
      </div>

      <div className="q-list">
        {list.map(q=>(
            <div className={'q-card'+(inc.has(q.id)?' inc':'')} key={q.id}>
              <div className="q-head">
                <span className="q-num">{KIND_LABEL[q.kind]}</span>
                <div className="q-text">{q.text}</div>
                <LvlBadge level={q.level}/>
                <div className="q-acts">
                  <button className="q-mini edit"><Icon name="edit" size={13}/>Sửa</button>
                  <button className="q-mini del"><Icon name="trash" size={13}/>Xóa</button>
                </div>
              </div>
              {q.kind==='chon' && (
                <div className="q-opts">
                  {q.options.map((o,i)=>(
                    <div className={'q-opt'+(o.correct?' correct':'')} key={i}>
                      <span className="oi">{String.fromCharCode(65+i)}</span>{o.t}
                      {o.correct && <span className="ans-mark"><Icon name="check" size={13} stroke={3}/>Đáp án</span>}
                    </div>
                  ))}
                </div>
              )}
              {q.kind==='sapxep' && (
                <div className="q-seq">
                  {q.seq.map((s,i)=>(
                    <div className="si" key={i}><span className="dr"><Icon name="list" size={15}/></span><span className="ord">{i+1}</span>{s}</div>
                  ))}
                </div>
              )}
              {q.kind==='noi' && (
                <div className="q-match">
                  {q.pairs.map((p,i)=>(
                    <React.Fragment key={i}>
                      <div className="mcell">{p[0]}</div>
                      <div className="mline"><Icon name="link2" size={16}/></div>
                      <div className="mcell">{p[1]}</div>
                    </React.Fragment>
                  ))}
                </div>
              )}
              <div className="q-foot">
                <div className="qf-inc" onClick={()=>toggleInc(q.id)}>
                  <Check on={inc.has(q.id)}/>Đưa vào bài tập luyện tập
                </div>
              </div>
            </div>
        ))}
        {list.length===0 && <div className="empty-note">Không có câu hỏi nào ở mức đã lọc.</div>}
      </div>

      <div className="acc-actions">
        <button className="btn"><Icon name="refresh" size={15}/>Tạo thêm câu hỏi</button>
        <div style={{display:'flex',gap:10}}>
          {anyAssigned && <button className="btn btn-assign" onClick={()=>setShowAssign(true)}><Icon name="send" size={15}/>Giao bài cho học sinh</button>}
          <button className="btn btn-primary"><Icon name="save" size={15}/>Lưu {inc.size} câu vào bài tập</button>
        </div>
      </div>

      {showAssign && <AssignModal
        groupQ={groupQ}
        groupMix={groupMix}
        totalAssigned={grandTotal}
        onClose={()=>setShowAssign(false)}
        onDone={()=>setShowAssign(false)}/>}
    </div>
  );
}

Object.assign(window, { QUESTIONS, ExerciseBody, LvlBadge, LEVEL_STYLE, GROUPS, GROUP_BY_ID, SUG_GROUP });
