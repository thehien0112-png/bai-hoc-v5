// ============ V5 — Workspace (sidebar + menu rows) + Root ============
const { useState: wsState } = React;

const V5_NAV = [
  { id:'taonoidung', name:'Tạo nội dung', sub:'Soạn bài & câu hỏi',  icon:'wand' },
  { id:'giaobai',    name:'Giao bài',     sub:'Phân công cho lớp',   icon:'send' },
  { id:'review',     name:'Review',       sub:'Duyệt nội dung AI',   icon:'clipboard' },
  { id:'baocao',     name:'Xem báo cáo',  sub:'Kết quả & tiến độ',   icon:'chart' },
];

// ---------- Menu card ----------
function MenuCard({item, on, onClick}){
  return (
    <button className={'menu-card'+(on?' on':'')} onClick={onClick}
      style={{['--mc']:item.color, ['--mcbg']:item.mcbg, ['--mcs']:item.color+'33'}}>
      <span className="mc-check">{on && <Icon name="check" size={13} stroke={3}/>}</span>
      <span className="mc-ic"><Icon name={item.icon} size={24}/></span>
      <span>
        <span className="mc-name">{item.name}</span>
        <span className="mc-sub">{item.sub}</span>
      </span>
    </button>
  );
}

// ---------- Section: Tạo nội dung ----------
function CreateSection(){
  const [selected, setSelected] = wsState(new Set(['baidoc']));
  const [openId, setOpenId] = wsState('baidoc');
  const toggle = id => setSelected(s=>{
    const n = new Set(s);
    if(n.has(id)){ n.delete(id); if(openId===id) setOpenId([...n][n.size-1]||null); }
    else { n.add(id); setOpenId(id); }
    return n;
  });
  const remove = id => setSelected(s=>{ const n=new Set(s); n.delete(id); if(openId===id) setOpenId([...n][n.size-1]||null); return n; });
  const chosen = V5_ALL.filter(it=>selected.has(it.id));
  const n = chosen.length;
  return (
    <>
      <div className="v5-head">
        <div className="v5-crumb"><span>Vườn Tri Thức Việt</span><Icon name="chevRight" size={13}/><span>Tiếng Việt · Lớp 2</span><Icon name="chevRight" size={13}/><span style={{color:'var(--ink-soft)',fontWeight:600}}>Tạo nội dung</span></div>
        <h1 className="v5-title"><span className="t-ic" style={{background:'linear-gradient(135deg,#3b82f6,#6d5cf6)'}}><Icon name="wand" size={22}/></span>Tạo nội dung</h1>
        <p className="v5-subtitle">Chọn <b>nhiều loại</b> học liệu và bài tập cùng lúc, thiết lập chi tiết cho từng loại, rồi để AI tạo tất cả trong một lần.</p>
      </div>

      {/* Dòng 1 — Học liệu */}
      <div className="menu-block">
        <div className="menu-rowlabel">
          <span className="num">1</span>
          <span className="rl-name">Học liệu</span>
          <span className="rl-hint">Nội dung học cho học sinh</span>
          <span className="rl-line"></span>
        </div>
        <div className="menu-row r1">
          {V5_ROW1.map(it=><MenuCard key={it.id} item={it} on={selected.has(it.id)} onClick={()=>toggle(it.id)}/>)}
        </div>
      </div>

      {/* Dòng 2 — Bài tập & Kiểm tra */}
      <div className="menu-block">
        <div className="menu-rowlabel">
          <span className="num">2</span>
          <span className="rl-name">Bài tập &amp; Kiểm tra</span>
          <span className="rl-hint">Luyện tập và đánh giá</span>
          <span className="rl-line"></span>
        </div>
        <div className="menu-row r2">
          {V5_ROW2.map(it=><MenuCard key={it.id} item={it} on={selected.has(it.id)} onClick={()=>toggle(it.id)}/>)}
        </div>
      </div>

      {/* Dòng 3 — Thiết lập chi tiết */}
      <div className="menu-block" style={{marginBottom:0}}>
        <div className="menu-rowlabel">
          <span className="num">3</span>
          <span className="rl-name">Thiết lập chi tiết</span>
          <span className="rl-hint">{n ? `${n} loại đã chọn — tuỳ chỉnh từng loại` : 'Chọn ít nhất một mục ở trên để bắt đầu'}</span>
          <span className="rl-line"></span>
        </div>
        {n ? (
          <>
            <div className="cfg-stack">
              {chosen.map(it=>(
                <V5ConfigCard key={it.id} item={it} open={openId===it.id}
                  onToggle={()=>setOpenId(o=>o===it.id?null:it.id)} onRemove={()=>remove(it.id)}/>
              ))}
            </div>
            <div className="create-bar">
              <div className="cb-left">
                <div className="cb-total"><b>{n}</b> loại nội dung sẽ được tạo cùng lúc</div>
                <div className="cb-chips">
                  {chosen.map(it=>(
                    <span className="cb-chip" key={it.id} style={{['--cc']:it.color}}>
                      <span className="cc-dot"></span>{it.name}
                      <span className="cc-x" role="button" onClick={()=>remove(it.id)}><Icon name="x" size={12}/></span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="cb-actions">
                <button className="btn"><Icon name="save" size={15}/>Lưu nháp</button>
                <button className="btn btn-ai btn-lg"><Icon name="sparkles" size={16} fill/>Tạo {n} nội dung cùng lúc</button>
              </div>
            </div>
          </>
        ) : (
          <div className="detail-empty">
            <div className="de-ic"><Icon name="layers" size={26}/></div>
            <div className="de-title">Chưa chọn loại nội dung nào</div>
            <div className="de-sub">Bấm các thẻ ở Dòng 1 và Dòng 2 — có thể chọn nhiều loại để tạo cùng một lúc.</div>
          </div>
        )}
      </div>
    </>
  );
}

// ---------- Section: Giao bài ----------
function AssignSection(){
  const items = [
    {n:'Bài tập chung — Tôi là học sinh lớp 2', meta:'8 câu · Trung bình · vừa tạo', icon:'puzzle', color:'#16a34a', st:'Sẵn sàng giao'},
    {n:'Bài đọc — Ngày hôm qua đâu rồi?', meta:'Văn bản đọc hiểu · có hình', icon:'reader', color:'#2563eb', st:'Sẵn sàng giao'},
    {n:'Bài tập riêng — phân hoá 3 nhóm', meta:'22 câu · cá nhân hoá', icon:'userCheck', color:'#0d9488', st:'Sẵn sàng giao'},
    {n:'Sách nói — Niềm vui của Bi và Bống', meta:'Audio 2:40 · Nữ miền Bắc', icon:'headphones', color:'#7c3aed', st:'Sẵn sàng giao'},
  ];
  return (
    <>
      <div className="v5-head">
        <div className="v5-crumb"><span>Tiếng Việt · Lớp 2</span><Icon name="chevRight" size={13}/><span style={{color:'var(--ink-soft)',fontWeight:600}}>Giao bài</span></div>
        <h1 className="v5-title"><span className="t-ic" style={{background:'#2563eb'}}><Icon name="send" size={22}/></span>Giao bài</h1>
        <p className="v5-subtitle">Chọn nội dung đã tạo và giao cho lớp, nhóm hoặc từng học sinh kèm hạn nộp.</p>
      </div>
      <h3 className="sec-block-title">Nội dung sẵn sàng giao</h3>
      <div className="list-card">
        {items.map((it,i)=>(
          <div className="list-row" key={i}>
            <span className="lr-ic" style={{background:it.color}}><Icon name={it.icon} size={19}/></span>
            <div className="lr-main"><div className="lr-name">{it.n}</div><div className="lr-meta">{it.meta}</div></div>
            <div className="lr-act">
              <span className="badge badge-saved">{it.st}</span>
              <select className="ctrl" style={{height:38,minWidth:130,padding:'0 30px 0 12px'}}><option>Lớp 2A</option><option>Lớp 2B</option><option>Nhóm khá</option></select>
              <button className="btn btn-primary"><Icon name="send" size={15}/>Giao</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ---------- Section: Review ----------
function ReviewSection(){
  const items = [
    {n:'Bài đọc — Em có xinh không?', meta:'AI tạo · 2 phút trước', icon:'reader', color:'#2563eb', badge:'Chờ duyệt', bc:'badge-draft'},
    {n:'Bài tập chung — Làm việc thật là vui', meta:'8 câu · AI tạo · 6 phút trước', icon:'puzzle', color:'#16a34a', badge:'Chờ duyệt', bc:'badge-draft'},
    {n:'Video — Niềm vui của Bi và Bống', meta:'1:48 · AI tạo · hôm nay', icon:'video', color:'#ea580c', badge:'Đã duyệt', bc:'badge-done'},
    {n:'Bài thi chung — Giữa học kì 1', meta:'22 câu · AI tạo · hôm qua', icon:'fileSpread', color:'#dc2626', badge:'Cần sửa', bc:'badge-wait'},
  ];
  return (
    <>
      <div className="v5-head">
        <div className="v5-crumb"><span>Tiếng Việt · Lớp 2</span><Icon name="chevRight" size={13}/><span style={{color:'var(--ink-soft)',fontWeight:600}}>Review</span></div>
        <h1 className="v5-title"><span className="t-ic" style={{background:'#7c3aed'}}><Icon name="clipboard" size={22}/></span>Review</h1>
        <p className="v5-subtitle">Duyệt nội dung do AI tạo trước khi đưa vào thư viện hoặc giao cho học sinh.</p>
      </div>
      <h3 className="sec-block-title">Hàng đợi duyệt</h3>
      <div className="list-card">
        {items.map((it,i)=>(
          <div className="list-row" key={i}>
            <span className="lr-ic" style={{background:it.color}}><Icon name={it.icon} size={19}/></span>
            <div className="lr-main"><div className="lr-name">{it.n}</div><div className="lr-meta">{it.meta}</div></div>
            <div className="lr-act">
              <span className={'badge '+it.bc}>{it.badge}</span>
              <button className="btn"><Icon name="eye" size={15}/>Xem</button>
              <button className="btn btn-primary"><Icon name="check" size={15} stroke={3}/>Duyệt</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ---------- Section: Xem báo cáo ----------
function ReportSection(){
  const stats = [
    {num:'128', label:'Nội dung đã tạo', icon:'layers', color:'#2563eb'},
    {num:'42', label:'Bài đã giao tuần này', icon:'send', color:'#16a34a'},
    {num:'86%', label:'Tỉ lệ hoàn thành', icon:'check', color:'#0d9488'},
    {num:'7,4', label:'Điểm trung bình lớp', icon:'target', color:'#b45309'},
  ];
  const cls = [
    {name:'Lớp 2A', done:92, color:'#16a34a'},
    {name:'Lớp 2B', done:81, color:'#2563eb'},
    {name:'Lớp 2C', done:74, color:'#b45309'},
    {name:'Lớp 2D', done:88, color:'#7c3aed'},
  ];
  return (
    <>
      <div className="v5-head">
        <div className="v5-crumb"><span>Tiếng Việt · Lớp 2</span><Icon name="chevRight" size={13}/><span style={{color:'var(--ink-soft)',fontWeight:600}}>Xem báo cáo</span></div>
        <h1 className="v5-title"><span className="t-ic" style={{background:'#0d9488'}}><Icon name="chart" size={22}/></span>Xem báo cáo</h1>
        <p className="v5-subtitle">Tổng quan tiến độ học tập, mức độ hoàn thành và kết quả theo lớp.</p>
      </div>
      <div className="sec-cards">
        {stats.map((s,i)=>(
          <div className="stat-card" key={i}>
            <span className="sc-ic" style={{background:s.color}}><Icon name={s.icon} size={19}/></span>
            <div className="sc-num">{s.num}</div>
            <div className="sc-label">{s.label}</div>
          </div>
        ))}
      </div>
      <h3 className="sec-block-title">Mức độ hoàn thành theo lớp</h3>
      <div className="list-card">
        {cls.map((c,i)=>(
          <div className="list-row" key={i}>
            <span className="lr-ic" style={{background:c.color}}><Icon name="graduate" size={18}/></span>
            <div className="lr-main"><div className="lr-name">{c.name}</div><div className="lr-meta">{c.done}% học sinh đã hoàn thành bài giao</div></div>
            <div className="lr-act" style={{gap:14}}>
              <div className="bar-mini"><i style={{width:c.done+'%',background:c.color}}/></div>
              <span style={{fontWeight:800,fontSize:15,color:c.color,minWidth:46,textAlign:'right'}}>{c.done}%</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ---------- Workspace shell ----------
function V5Workspace({role, onLogout}){
  const [section, setSection] = wsState('taonoidung');
  const initials = (role && role.id==='gv') ? 'GV' : (role ? role.name.trim().slice(0,1).toUpperCase() : 'GV');
  return (
    <div className="v5-app">
      <div className="v5-top">
        <div className="v5-logo">
          <span className="badge"><Icon name="wand" size={20}/></span>
          <span className="name">Tool Editor</span>
        </div>
        <div className="spacer"></div>
        <div className="v5-school"><Icon name="briefcase" size={16}/>Vườn Tri Thức Việt</div>
        <div className="v5-user">
          <span className="ava" style={{background:(role&&role.color)||'#16a34a'}}>{initials}</span>
          {role ? role.name.replace('Quản lý / ','') : 'Giáo viên'}
          <Icon name="chevDown" size={14}/>
        </div>
        <button className="v5-logout" onClick={onLogout} title="Đăng xuất"><Icon name="logout" size={18}/></button>
      </div>

      <div className="v5-body">
        <aside className="v5-side">
          <div className="side-label">Bảng điều khiển</div>
          <nav className="v5-nav">
            {V5_NAV.map(n=>(
              <button key={n.id} className={'v5-nav-item'+(section===n.id?' on':'')} onClick={()=>setSection(n.id)}>
                <span className="ni-ic"><Icon name={n.icon} size={19}/></span>
                <span className="ni-main">
                  <span className="ni-name">{n.name}</span>
                  <span className="ni-sub">{n.sub}</span>
                </span>
              </button>
            ))}
          </nav>
          <div className="side-foot">
            <div className="tip">
              <span className="ti-ic"><Icon name="sparkles" size={16} fill/></span>
              <span className="ti-txt"><b>Mẹo:</b> Tạo học liệu trước, sau đó dùng lại nội dung khi tạo bài tập và bài thi.</span>
            </div>
          </div>
        </aside>

        <main className="v5-content">
          <div className="wrap">
            {section==='taonoidung' && <CreateSection/>}
            {section==='giaobai'    && <AssignSection/>}
            {section==='review'     && <ReviewSection/>}
            {section==='baocao'     && <ReportSection/>}
          </div>
        </main>
      </div>
    </div>
  );
}

// ---------- Root ----------
function V5Root(){
  const [user, setUser] = wsState(null); // null => login screen
  if(!user){
    return (
      <div className="v5-app">
        <div className="v5-top">
          <div className="v5-logo">
            <span className="badge"><Icon name="wand" size={20}/></span>
            <span className="name">Tool Editor</span>
          </div>
        </div>
        <V5Login onLogin={role=>setUser(role)}/>
        <div style={{textAlign:'center',color:'#9aa3af',fontSize:12.5,padding:18}}>© 2026 Tool Editor · Vườn Tri Thức Việt</div>
      </div>
    );
  }
  return <V5Workspace role={user} onLogout={()=>setUser(null)}/>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<V5Root/>);
