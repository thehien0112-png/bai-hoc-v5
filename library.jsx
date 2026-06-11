const { useState: useS, useMemo: useM } = React;

function LibTopNav(){
  return (
    <div className="topnav">
      <div className="brand">Tool editor</div>
      <nav className="nav-links">
        <a href="Tạo bài giảng.html"><Icon name="sparkles" size={14} fill/>Tạo nội dung</a>
        <a href="#" className="nav-active"><Icon name="folder" size={14}/>Thư viện</a>
        <a href="#">Sự kiện</a>
        <a href="#">Cài đặt tài khoản</a>
      </nav>
      <div className="nav-spacer"></div>
      <div className="nav-user"><span className="avatar"><Icon name="reader" size={16}/></span>Vườn Tri Thức Việt <Icon name="chevDown" size={14}/></div>
    </div>
  );
}

function LibraryApp(){
  const [items, setItems] = useS(LIBRARY);
  const [open, setOpen] = useS(null);
  const [typeF, setTypeF] = useS('all');
  const [q, setQ] = useS('');
  const [grade, setGrade] = useS('all');
  const [subject, setSubject] = useS('all');
  const [assignLes, setAssignLes] = useS(null);
  const [toast, setToast] = useS(null);

  const filtered = items.filter(l =>
    (typeF==='all' || l.types[typeF]) &&
    (grade==='all' || l.grade===grade) &&
    (subject==='all' || l.subject===subject) &&
    (!q || l.title.toLowerCase().includes(q.toLowerCase()))
  );

  const tabCount = k => items.filter(l=> k==='all'?true:l.types[k]).length;

  const dup = les => {
    setItems(arr=>{
      const i=arr.findIndex(x=>x.id===les.id);
      const copy={...les, id:Date.now(), title:les.title+' (bản sao)', status:'draft', classes:[], created:'09/06/2026'};
      const n=[...arr]; n.splice(i+1,0,copy); return n;
    });
    setToast('Đã nhân bản bài học');
    setTimeout(()=>setToast(null),2200);
  };
  const del = les => {
    setItems(arr=>arr.filter(x=>x.id!==les.id));
    setToast('Đã xoá bài học');
    setTimeout(()=>setToast(null),2200);
  };

  return (
    <div className="app">
      <LibTopNav/>
      <div className="page">
        <div className="crumbs"><a href="#">App</a> / <a href="#">Vườn Tri Thức Việt</a> / Thư viện nội dung</div>
        <div className="lib-titlerow">
          <h1 className="page-title" style={{margin:0}}>Thư viện nội dung</h1>
          <a className="btn btn-ai btn-lg" href="Tạo bài giảng.html"><Icon name="sparkles" size={16} fill/>Tạo nội dung mới</a>
        </div>
        <p className="lib-sub">Tất cả bài học đã tạo — gồm nội dung tạo bằng AI và soạn tay. Mỗi bài gom đủ Bài đọc, Sách nói, Bài tập.</p>

        {/* filter tabs */}
        <div className="lib-tabs">
          {[['all','Tất cả'],['baidoc','Bài đọc'],['sachnoi','Sách nói'],['baitap','Bài tập']].map(([k,l])=>(
            <button key={k} className={'lib-tab'+(typeF===k?' on':'')} onClick={()=>setTypeF(k)}>
              {k!=='all' && <Icon name={TYPE_META[k].icon} size={14}/>}
              {l}<span className="cnt">{tabCount(k)}</span>
            </button>
          ))}
        </div>

        {/* search + filters */}
        <div className="lib-filters">
          <div className="field" style={{flex:1,minWidth:220}}>
            <input className="input" style={{width:'100%',minWidth:0}} placeholder="Tìm theo tên bài học…" value={q} onChange={e=>setQ(e.target.value)}/>
            <span className="srch"><Icon name="search" size={16}/></span>
          </div>
          <select className="pill-select" value={subject} onChange={e=>setSubject(e.target.value)}>
            <option value="all">Tất cả môn</option><option>Tiếng Việt</option><option>Toán</option>
          </select>
          <select className="pill-select" value={grade} onChange={e=>setGrade(e.target.value)}>
            <option value="all">Tất cả lớp</option><option>Lớp 1</option><option>Lớp 2</option><option>Lớp 3</option>
          </select>
          {(q||subject!=='all'||grade!=='all'||typeF!=='all') &&
            <button className="btn" onClick={()=>{setQ('');setSubject('all');setGrade('all');setTypeF('all');}}>Xoá lọc</button>}
        </div>

        <div className="lib-list">
          {filtered.map(les=>(
            <LibraryCard key={les.id} les={les} open={open===les.id}
              onToggle={()=>setOpen(o=>o===les.id?null:les.id)}
              onAssign={l=>setAssignLes(l)} onDup={dup} onDelete={del}/>
          ))}
          {filtered.length===0 && <div className="empty-note">Không tìm thấy bài học nào khớp bộ lọc.</div>}
        </div>
        <div className="lib-count">{filtered.length} bài học</div>
      </div>

      {assignLes && <AssignModal
        groupQ={lessonGroupQ(assignLes)}
        totalAssigned={assignLes.types.baitap||0}
        title={assignLes.title}
        onClose={()=>setAssignLes(null)}
        onDone={()=>setAssignLes(null)}/>}
      {toast && <div className="toast"><Icon name="check" size={16} stroke={3}/>{toast}</div>}
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<LibraryApp/>);
