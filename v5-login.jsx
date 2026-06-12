// ============ V5 — Login (ported, scoped under .v5-login) ============
const V5_ROLES = [
  { id:'gd',  name:'Giám đốc / Hiệu trưởng', sub:'Quản trị toàn hệ thống, báo cáo tổng quan', icon:'briefcase', color:'#1d4ed8' },
  { id:'gv',  name:'Quản lý / Giáo viên',    sub:'Soạn bài, tạo nội dung, giao bài tập',      icon:'reader',    color:'#16a34a' },
  { id:'ph',  name:'Phụ huynh',              sub:'Theo dõi việc học của con',                 icon:'users',     color:'#0891b2' },
  { id:'hs',  name:'Nhân viên / Học sinh',   sub:'Làm bài, học tập, tra cứu',                 icon:'graduate',  color:'#7c3aed' },
];

function V5RolePicker({onPick}){
  return (
    <div className="card">
      <div className="welcome">
        <h1>Chào mừng bạn trở lại</h1>
        <p>Vui lòng chọn tư cách đăng nhập</p>
      </div>
      <div className="roles">
        {V5_ROLES.map(r=>(
          <button className="role" key={r.id} style={{['--rc']:r.color}} onClick={()=>onPick(r)}>
            <span className="r-ic"><Icon name={r.icon} size={23}/></span>
            <span className="r-main">
              <span className="r-name">{r.name}</span>
              <span className="r-sub">{r.sub}</span>
            </span>
            <span className="r-arrow"><Icon name="chevRight" size={20}/></span>
          </button>
        ))}
      </div>
    </div>
  );
}

function V5LoginForm({role, onBack, onLogin}){
  const { useState } = React;
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState('co.lan@vuontrithucviet.edu.vn');
  const [pw, setPw] = useState('123456');
  return (
    <div className="card">
      <div className="form-head">
        <button className="back-btn" onClick={onBack} aria-label="Quay lại"><Icon name="back" size={18}/></button>
        <div className="form-role">
          <span className="fr-ic" style={{background:role.color}}><Icon name={role.icon} size={20}/></span>
          <div>
            <div className="fr-name">{role.name}</div>
            <div className="fr-sub">Đăng nhập với tư cách này</div>
          </div>
        </div>
      </div>

      <form onSubmit={e=>{e.preventDefault();onLogin(role);}}>
        <div className="lg-field">
          <label>Email / Tên đăng nhập</label>
          <div className="inp">
            <Icon name="mail" size={18} className="lead"/>
            <input type="text" value={email} onChange={e=>setEmail(e.target.value)} placeholder="quantri@vhg.com" autoFocus/>
          </div>
        </div>
        <div className="lg-field">
          <label>Mật khẩu</label>
          <div className="inp">
            <Icon name="lock" size={18} className="lead"/>
            <input type={show?'text':'password'} value={pw} onChange={e=>setPw(e.target.value)} placeholder="Nhập mật khẩu"/>
            <button type="button" className="toggle-eye" onClick={()=>setShow(s=>!s)} aria-label="Hiện mật khẩu">
              <Icon name={show?'eye':'eyeOff'} size={18}/>
            </button>
          </div>
        </div>

        <div className="row-between">
          <label className="remember" onClick={()=>setRemember(r=>!r)}>
            <span className={'cbox'+(remember?' on':'')}>{remember && <Icon name="check" size={12} stroke={3}/>}</span>
            Lưu mật khẩu
          </label>
          <a href="#" className="forgot" onClick={e=>e.preventDefault()}>Quên mật khẩu?</a>
        </div>

        <button type="submit" className="submit" style={{['--rc']:role.color}}>
          <Icon name="login" size={18}/>Đăng nhập
        </button>
      </form>

      <div className="alt-role">
        Không phải bạn? <button onClick={onBack}>Chọn tư cách khác</button>
      </div>
    </div>
  );
}

function V5Login({onLogin}){
  const { useState } = React;
  const [role, setRole] = useState(null);
  return (
    <div className="v5-login">
      {role ? <V5LoginForm role={role} onBack={()=>setRole(null)} onLogin={onLogin}/>
            : <V5RolePicker onPick={setRole}/>}
    </div>
  );
}

Object.assign(window, { V5_ROLES, V5Login });
