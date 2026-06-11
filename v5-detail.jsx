// ============ V5 — Detail panel (Dòng 3: trường chi tiết) ============
const { useState: v5useState, useMemo: v5useMemo } = React;

// ---- menu item registry (shared with workspace) ----
const V5_ROW1 = [
  { id:'baidoc',  name:'Bài đọc',  sub:'Văn bản đọc hiểu', icon:'reader',     color:'#2563eb', mcbg:'#f4f8ff', tag:'Học liệu' },
  { id:'sachnoi', name:'Sách nói', sub:'Audio thuyết minh', icon:'headphones', color:'#7c3aed', mcbg:'#f9f5ff', tag:'Học liệu' },
  { id:'video',   name:'Video',    sub:'Video bài giảng',   icon:'video',      color:'#ea580c', mcbg:'#fff7f1', tag:'Học liệu' },
];
const V5_ROW2 = [
  { id:'bt-chung',   name:'Bài tập chung', sub:'Cả lớp cùng một đề',     icon:'puzzle',    color:'#16a34a', mcbg:'#f3fbf6', tag:'Luyện tập' },
  { id:'bt-rieng',   name:'Bài tập riêng', sub:'Cá nhân hoá theo nhóm',  icon:'userCheck', color:'#0d9488', mcbg:'#f0fbf9', tag:'Phân hoá' },
  { id:'bthi-chung', name:'Bài thi chung', sub:'Đề kiểm tra toàn lớp',   icon:'fileSpread',color:'#dc2626', mcbg:'#fef4f3', tag:'Kiểm tra' },
  { id:'bthi-rieng', name:'Bài thi riêng', sub:'Nhiều mã đề / cá nhân',  icon:'target',    color:'#b45309', mcbg:'#fdf8ee', tag:'Kiểm tra' },
];
const V5_ALL = [...V5_ROW1, ...V5_ROW2];
const v5meta = id => V5_ALL.find(x=>x.id===id);

// ---- small controls ----
function V5Seg({value, options, onChange, color}){
  return (
    <div className="seg">
      {options.map(o=>(
        <button key={o} className={value===o?'on':''} onClick={()=>onChange(o)}
          style={value===o&&color?{color}:undefined}>{o}</button>
      ))}
    </div>
  );
}
function V5ToggleRow({on, onToggle, onText, offText}){
  return (
    <div className="toggle-row" onClick={onToggle}>
      <Toggle on={on}/> {on?onText:offText}
    </div>
  );
}
function CfgField({label, hint, icon, children, full}){
  return (
    <div className={'cfg-field'+(full?' full':'')} style={full?{gridColumn:'1/-1'}:undefined}>
      <div className="cf-label">{icon && <Icon name={icon} size={15}/>}{label}</div>
      {children}
      {hint && <div className="cf-hint">{hint}</div>}
    </div>
  );
}

// ---- scope row (shared header for every item) ----
function ScopeRow({lesson, setLesson, lessonOptions, scopeLabel}){
  return (
    <div className="scope-row">
      <CfgField label="Khối / Lớp">
        <select className="ctrl" defaultValue="Lớp 2">
          <option>Lớp 1</option><option>Lớp 2</option><option>Lớp 3</option>
          <option>Lớp 4</option><option>Lớp 5</option>
        </select>
      </CfgField>
      <CfgField label="Môn học">
        <select className="ctrl" defaultValue="Tiếng Việt">
          <option>Tiếng Việt</option><option>Toán</option><option>Tự nhiên & Xã hội</option><option>Đạo đức</option>
        </select>
      </CfgField>
      <CfgField label={scopeLabel||'Phạm vi nội dung'} full>
        <select className="ctrl" value={lesson} onChange={e=>setLesson(e.target.value)}>
          {lessonOptions.map((o,i)=><option key={i} value={o}>{o}</option>)}
        </select>
      </CfgField>
    </div>
  );
}

// ---- per-item config body (banner + fields + summary) ----
function v5ItemConfig(picked, c, set, m){
  let body, footInfo, ctaText, banner;

  if(picked==='baidoc'){
    banner = <div className="cfg-banner blue"><Icon name="info" size={16}/><span>AI sinh <b>văn bản đọc hiểu</b> bám theo chủ đề tiết học, kèm câu hỏi gợi ý. Thời gian tạo ~10–30 giây.</span></div>;
    body = (
      <>
        <div className="cfg-grid">
          <CfgField label="Độ dài bài đọc" icon="list"><V5Seg value={c.dodai} options={['Ngắn','Vừa','Dài']} onChange={v=>set({dodai:v})} color={m.color}/></CfgField>
          <CfgField label="Hình minh hoạ" icon="image"><V5ToggleRow on={c.hinhanh} onToggle={()=>set({hinhanh:!c.hinhanh})} onText="Có chèn hình" offText="Không chèn"/></CfgField>
        </div>
        <div className="cfg-sub">Nguồn nội dung</div>
        <div className="src-mini">
          <span className="sm-ic"><Icon name="book" size={20}/></span>
          <div className="sm-main"><div className="sm-title">Tiếng Việt 2 — Tập 1.pdf</div><div className="sm-hint">SGK đã liên kết · AI bám sát ngữ liệu gốc</div></div>
          <button className="btn"><Icon name="upload2" size={15}/>Đổi nguồn</button>
        </div>
      </>
    );
    footInfo = <>Sẽ tạo <b>1 bài đọc</b> cho tiết đã chọn</>;
    ctaText = 'Tạo bài đọc bằng AI';
  }

  else if(picked==='sachnoi'){
    banner = <div className="cfg-banner purple"><Icon name="info" size={16}/><span>Chuyển bài đọc thành <b>audio thuyết minh</b> với giọng đọc tự nhiên. Xử lý bất đồng bộ 2–3 phút.</span></div>;
    body = (
      <>
        <div className="cfg-grid">
          <CfgField label="Giọng đọc" icon="mic"><V5Seg value={c.giong} options={['Nữ miền Bắc','Nam miền Bắc','Nữ miền Nam']} onChange={v=>set({giong:v})} color={m.color}/></CfgField>
          <CfgField label="Tốc độ đọc" icon="clock"><V5Seg value={c.tocdo} options={['Chậm','Vừa','Nhanh']} onChange={v=>set({tocdo:v})} color={m.color}/></CfgField>
          <CfgField label="Nhạc nền nhẹ" icon="volume"><V5ToggleRow on={c.nhac} onToggle={()=>set({nhac:!c.nhac})} onText="Có nhạc nền" offText="Không nhạc nền"/></CfgField>
          <CfgField label="Nội dung" icon="reader" hint="Dùng lại bài đọc đã tạo của cùng tiết học">
            <select className="ctrl"><option>Từ bài đọc đã có</option><option>Nhập văn bản mới</option></select>
          </CfgField>
        </div>
      </>
    );
    footInfo = <>Sẽ tạo <b>1 sách nói</b> · giọng {c.giong}</>;
    ctaText = 'Tạo sách nói bằng AI';
  }

  else if(picked==='video'){
    banner = <div className="cfg-banner red" style={{background:'#fff4ec',borderColor:'#fcd9bf',color:'#c2410c'}}><Icon name="info" size={16}/><span>AI dựng <b>video bài giảng</b> từ nội dung tiết học, kèm hình minh hoạ và lời thuyết minh.</span></div>;
    body = (
      <div className="cfg-grid">
        <CfgField label="Thời lượng" icon="clock"><V5Seg value={c.thoiluong} options={['1–2 phút','3–5 phút']} onChange={v=>set({thoiluong:v})} color={m.color}/></CfgField>
        <CfgField label="Phong cách" icon="image"><V5Seg value={c.phongcach} options={['Hình minh hoạ','Hoạt hình']} onChange={v=>set({phongcach:v})} color={m.color}/></CfgField>
        <CfgField label="Phụ đề" icon="message"><V5ToggleRow on={c.phude} onToggle={()=>set({phude:!c.phude})} onText="Hiện phụ đề" offText="Không phụ đề"/></CfgField>
        <CfgField label="Giọng thuyết minh" icon="mic">
          <select className="ctrl"><option>Nữ miền Bắc</option><option>Nam miền Bắc</option><option>Nữ miền Nam</option></select>
        </CfgField>
      </div>
    );
    footInfo = <>Sẽ tạo <b>1 video</b> · {c.thoiluong}</>;
    ctaText = 'Tạo video bằng AI';
  }

  else if(picked==='bt-chung'){
    const tong = c.chon+c.sapxep+c.noi;
    banner = <div className="cfg-banner green"><Icon name="users" size={16}/><span><b>Một đề chung</b> cho cả lớp — mọi học sinh nhận cùng bộ câu hỏi và mức độ.</span></div>;
    body = (
      <>
        <div className="cfg-grid one">
          <CfgField label="Mức độ chung" icon="target"><V5Seg value={c.mucdo} options={['Dễ','Trung bình','Khó']} onChange={v=>set({mucdo:v})} color={m.color}/></CfgField>
        </div>
        <div className="cfg-sub">Số câu hỏi theo dạng</div>
        <div className="cfg-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
          <CfgField label="Chọn đáp án"><NumStepper value={c.chon} onChange={v=>set({chon:v})}/></CfgField>
          <CfgField label="Sắp xếp"><NumStepper value={c.sapxep} onChange={v=>set({sapxep:v})}/></CfgField>
          <CfgField label="Nối"><NumStepper value={c.noi} onChange={v=>set({noi:v})}/></CfgField>
        </div>
        <div className="cfg-grid one" style={{marginTop:18}}>
          <CfgField label="Thời gian làm bài" icon="clock">
            <div className="num-inline"><NumStepper value={c.tg} onChange={v=>set({tg:v})} min={5} max={120}/> phút</div>
          </CfgField>
        </div>
      </>
    );
    footInfo = <>Tổng <b>{tong} câu hỏi</b> · {c.tg} phút · {c.mucdo}</>;
    ctaText = 'Tạo bài tập chung';
  }

  else if(picked==='bt-rieng'){
    banner = <div className="cfg-banner" style={{background:'#effbf9',borderColor:'#c4ebe5',color:'#0d7a6f'}}><Icon name="userCheck" size={16}/><span><b>Đề phân hoá</b> theo nhóm năng lực — mỗi nhóm nhận số câu và mức độ riêng phù hợp.</span></div>;
    const groups = [
      {key:'yeu', name:'Nhóm cần hỗ trợ', dot:'#b45309', tag:'Củng cố', tagBg:'#fdf3e0', tagC:'#b45309', q:6, lvl:'Dễ'},
      {key:'kha', name:'Nhóm khá',        dot:'#2563eb', tag:'Vận dụng', tagBg:'#eef5ff', tagC:'#1d4ed8', q:8, lvl:'Trung bình'},
      {key:'gioi',name:'Nhóm giỏi',       dot:'#15803d', tag:'Nâng cao', tagBg:'#e9f8ef', tagC:'#15803d', q:8, lvl:'Khó'},
    ];
    body = (
      <>
        <div className="cfg-sub">Phân bổ theo nhóm năng lực</div>
        <div className="grp-rows">
          {groups.map(g=>(
            <div className="grp-row" key={g.key}>
              <div className="gr-name"><span className="gr-dot" style={{background:g.dot}}/>{g.name}
                <span className="gr-tag" style={{background:g.tagBg,color:g.tagC}}>{g.tag}</span></div>
              <div className="gr-ctrl">
                <V5Seg value={g.lvl} options={['Dễ','Trung bình','Khó']} onChange={()=>{}} color={m.color}/>
                <div className="num-inline"><NumStepper value={g.q} onChange={()=>{}} min={1} max={20}/> câu</div>
              </div>
            </div>
          ))}
        </div>
        <div className="cfg-grid one" style={{marginTop:18}}>
          <CfgField label="Cá nhân hoá theo sở thích" icon="heart" hint="Lồng tên & chủ đề học sinh yêu thích vào ngữ cảnh câu hỏi">
            <V5ToggleRow on={c.sothich} onToggle={()=>set({sothich:!c.sothich})} onText="Bật cá nhân hoá" offText="Tắt"/>
          </CfgField>
        </div>
      </>
    );
    footInfo = <><b>3 nhóm</b> · 22 câu · phân hoá theo năng lực</>;
    ctaText = 'Tạo bài tập riêng';
  }

  else if(picked==='bthi-chung'){
    banner = <div className="cfg-banner red"><Icon name="fileSpread" size={16}/><span><b>Đề kiểm tra chung</b> toàn lớp theo phạm vi nhiều bài / cả chương, có cấu trúc và thang điểm.</span></div>;
    body = (
      <>
        <div className="cfg-sub">Cấu trúc đề</div>
        <div className="cfg-grid">
          <CfgField label="Câu trắc nghiệm" icon="list"><NumStepper value={c.tn} onChange={v=>set({tn:v})} min={0} max={50}/></CfgField>
          <CfgField label="Câu tự luận" icon="edit"><NumStepper value={c.tl} onChange={v=>set({tl:v})} min={0} max={10}/></CfgField>
          <CfgField label="Thời gian thi" icon="clock"><div className="num-inline"><NumStepper value={c.tgthi} onChange={v=>set({tgthi:v})} min={15} max={120}/> phút</div></CfgField>
          <CfgField label="Thang điểm" icon="target"><V5Seg value={c.thang} options={['Thang 10','Thang 100']} onChange={v=>set({thang:v})} color={m.color}/></CfgField>
          <CfgField label="Trộn thứ tự câu" icon="refresh" full><V5ToggleRow on={c.tron} onToggle={()=>set({tron:!c.tron})} onText="Trộn câu & đáp án" offText="Giữ nguyên thứ tự"/></CfgField>
        </div>
      </>
    );
    footInfo = <>Đề <b>{c.tn+c.tl} câu</b> · {c.tgthi} phút · {c.thang}</>;
    ctaText = 'Tạo đề thi chung';
  }

  else if(picked==='bthi-rieng'){
    banner = <div className="cfg-banner" style={{background:'#fdf6ea',borderColor:'#f3e0bd',color:'#b45309'}}><Icon name="target" size={16}/><span><b>Nhiều mã đề</b> tương đương, phân hoá theo nhóm và chống gian lận — phù hợp thi trên thiết bị.</span></div>;
    body = (
      <div className="cfg-grid">
        <CfgField label="Số mã đề" icon="layers"><NumStepper value={c.soma} onChange={v=>set({soma:v})} min={2} max={12}/></CfgField>
        <CfgField label="Thời gian thi" icon="clock"><div className="num-inline"><NumStepper value={c.tgthi} onChange={v=>set({tgthi:v})} min={15} max={120}/> phút</div></CfgField>
        <CfgField label="Phân hoá theo nhóm" icon="userCheck" hint="Mỗi nhóm năng lực một độ khó riêng">
          <V5ToggleRow on={c.phanhoa} onToggle={()=>set({phanhoa:!c.phanhoa})} onText="Bật phân hoá" offText="Đề đồng nhất"/>
        </CfgField>
        <CfgField label="Chống gian lận" icon="refresh" hint="Đảo thứ tự câu & đáp án giữa các mã đề">
          <V5ToggleRow on={c.daoap} onToggle={()=>set({daoap:!c.daoap})} onText="Bật đảo đề" offText="Tắt"/>
        </CfgField>
      </div>
    );
    footInfo = <><b>{c.soma} mã đề</b> · {c.tgthi} phút {c.phanhoa?'· phân hoá':''}</>;
    ctaText = 'Tạo bài thi riêng';
  }

  return { banner, body, footInfo, ctaText };
}

// ---- collapsible config card (one per selected item) ----
function V5ConfigCard({item, open, onToggle, onRemove}){
  const m = item;
  const lessonOpts = v5useMemo(()=>{
    const out=[];
    (window.PPCT||[]).forEach(w=>{
      w.entries.forEach(e=>{
        if(/^Đọc/.test(e.name)) out.push(`Tuần ${w.tuan} · ${e.name.replace(/^Đọc:\s*/,'')}`);
      });
    });
    return out.slice(0,16);
  },[]);
  const chapterOpts = ['Cả chương 1 · Em lớn lên từng ngày (Tuần 1–4)','Giữa học kì 1 · Tuần 1–8','Cuối học kì 1 · Tuần 1–16'];

  const [lesson, setLesson] = v5useState(lessonOpts[0]||'Tuần 1 · Tôi là học sinh lớp 2');
  const [chapter, setChapter] = v5useState(chapterOpts[0]);
  const [c, setC] = v5useState({
    dodai:'Vừa', hinhanh:true,
    giong:'Nữ miền Bắc', tocdo:'Vừa', nhac:false,
    thoiluong:'1–2 phút', phongcach:'Hình minh hoạ', phude:true,
    mucdo:'Trung bình', chon:4, sapxep:2, noi:2, tg:15,
    sothich:true,
    tn:20, tl:2, tgthi:45, thang:'Thang 10', tron:true,
    soma:4, phanhoa:true, daoap:true
  });
  const set = patch => setC(p=>({...p, ...patch}));

  const { banner, body, footInfo } = v5ItemConfig(item.id, c, set, m);
  const isExam = item.id.startsWith('bthi');
  const scopeLabel = isExam ? 'Phạm vi kiểm tra' : 'Phạm vi nội dung';
  const opts = isExam ? chapterOpts : lessonOpts;
  const lessVal = isExam ? chapter : lesson;
  const lessSet = isExam ? setChapter : setLesson;

  return (
    <div className={'cfgcard'+(open?' open':'')}>
      <div className="cfgcard-head" onClick={onToggle}>
        <span className="dh-ic" style={{background:m.color}}><Icon name={m.icon} size={20}/></span>
        <div className="dh-main">
          <div className="dh-name">{m.name}</div>
          <div className="dh-sub">{footInfo}</div>
        </div>
        <span className="dh-tag" style={{background:m.mcbg,color:m.color}}>{m.tag}</span>
        <span className="cfgcard-caret"><Icon name="chevDown" size={18}/></span>
        <span className="cfgcard-remove" role="button" title="Bỏ chọn"
          onClick={e=>{e.stopPropagation();onRemove();}}><Icon name="x" size={16}/></span>
      </div>
      {open && (
        <div className="cfgcard-body">
          {banner}
          <ScopeRow lesson={lessVal} setLesson={lessSet} lessonOptions={opts} scopeLabel={scopeLabel}/>
          {body}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { V5_ROW1, V5_ROW2, V5_ALL, v5meta, v5ItemConfig, V5ConfigCard });
