// Lucide-style icon set (stroke). Usage: <Icon name="sparkles" size={18}/>
const ICONS = {
  sparkles:'M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5 10.1 7.6z M19 14l.9 2.2 2.1.8-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.8z',
  plus:'M12 5v14 M5 12h14',
  trash:'M3 6h18 M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2 M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6 M10 11v6 M14 11v6',
  upload2:'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 9l5-5 5 5 M12 4v12',
  search:'M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.3-4.3',
  chevDown:'M6 9l6 6 6-6',
  chevRight:'M9 6l6 6-6 6',
  chevLeft:'M15 6l-6 6 6 6',
  check:'M20 6L9 17l-5-5',
  x:'M18 6L6 18 M6 6l12 12',
  eye:'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z M12 15a3 3 0 100-6 3 3 0 000 6z',
  dots:'M12 6a1 1 0 100-2 1 1 0 000 2z M12 13a1 1 0 100-2 1 1 0 000 2z M12 20a1 1 0 100-2 1 1 0 000 2z',
  book:'M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z',
  fileSpread:'M4 3h11l5 5v13a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z M14 3v6h6 M8 13h8 M8 17h8 M8 9h3',
  headphones:'M3 14v-2a9 9 0 0118 0v2 M21 16a2 2 0 01-2 2h-1v-6h1a2 2 0 012 2zM3 16a2 2 0 002 2h1v-6H5a2 2 0 00-2 2z',
  video:'M23 7l-7 5 7 5V7z M14 5H3a2 2 0 00-2 2v10a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2z',
  reader:'M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z',
  puzzle:'M19.4 13a2 2 0 002 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2 1.6 1.6 0 00-3.2 0 2 2 0 01-2 2H6a2 2 0 01-2-2v-3a2 2 0 002-2 1.6 1.6 0 000-3.2 2 2 0 01-2-2V5a2 2 0 012-2h3a2 2 0 012 2 1.6 1.6 0 003.2 0 2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2 1.6 1.6 0 000 3.2z',
  history:'M3 3v5h5 M3.05 13A9 9 0 106 5.3L3 8 M12 7v5l4 2',
  back:'M19 12H5 M12 19l-7-7 7-7',
  info:'M12 22a10 10 0 100-20 10 10 0 000 20z M12 16v-4 M12 8h.01',
  warn:'M10.3 3.9 1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z M12 9v4 M12 17h.01',
  folder:'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  mic:'M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z M19 10v1a7 7 0 01-14 0v-1 M12 18v4 M8 22h8',
  layers:'M12 2l9 5-9 5-9-5 9-5z M3 12l9 5 9-5 M3 17l9 5 9-5',
  filter:'M22 3H2l8 9.5V19l4 2v-8.5z',
  wand:'M15 4V2 M15 16v-2 M8 9h2 M20 9h2 M17.8 11.8L19 13 M15 9h0 M17.8 6.2L19 5 M3 21l9-9 M12.2 6.2L11 5',
  edit:'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4z',
  lock:'M5 11h14a0 0 0 010 0v9a0 0 0 010 0H5a0 0 0 010 0v-9a0 0 0 010 0z M8 11V7a4 4 0 018 0v4',
  play:'M6 4l13 8-13 8V4z',
  pause:'M7 4h3v16H7z M14 4h3v16h-3z',
  save:'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8 M7 3v5h7',
  refresh:'M23 4v6h-6 M1 20v-6h6 M3.5 9a9 9 0 0114.9-3.4L23 10 M1 14l4.6 4.4A9 9 0 0020.5 15',
  clock:'M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2',
  volume:'M11 5L6 9H2v6h4l5 4V5z M19.1 4.9a10 10 0 010 14.2 M15.5 8.5a5 5 0 010 7',
  list:'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
  link2:'M9 17H7A5 5 0 017 7h2 M15 7h2a5 5 0 010 10h-2 M8 12h8',
  download:'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  image:'M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3 M21 15l-5-5L5 21',
  users:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
  userCheck:'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2 M11 7a4 4 0 11-8 0 4 4 0 018 0 M16 11l2 2 4-4',
  target:'M12 22a10 10 0 100-20 10 10 0 000 20z M12 18a6 6 0 100-12 6 6 0 000 12z M12 14a2 2 0 100-4 2 2 0 000 4',
  send:'M22 2L11 13 M22 2l-7 20-4-9-9-4z',
  message:'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  mail:'M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z M22 7l-10 6L2 7',
  eyeOff:'M9.9 5.1A10.4 10.4 0 0112 5c6.5 0 10 7 10 7a16 16 0 01-3.6 4.4 M6.6 6.6A16 16 0 002 12s3.5 7 10 7a10 10 0 005.4-1.6 M1 1l22 22 M9.5 9.5a3 3 0 004.2 4.2',
  login:'M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4 M10 17l5-5-5-5 M15 12H3',
  briefcase:'M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16 M2 13h20',
  graduate:'M22 10L12 5 2 10l10 5 10-5z M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5 M22 10v6',
  calendar:'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z',
  clock2:'M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2',
  heart:'M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 000-7.8z',
  chart:'M3 3v18h18 M8 17v-5 M13 17V8 M18 17v-9',
  clipboard:'M9 4h6a1 1 0 011 1v1H8V5a1 1 0 011-1z M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 13l2 2 4-4',
  logout:'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
};
function Icon({name, size=20, stroke=2, fill=false, style, ...rest}){
  const d = ICONS[name] || '';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill?'currentColor':'none'}
      stroke={fill?'none':'currentColor'} strokeWidth={stroke} strokeLinecap="round"
      strokeLinejoin="round" style={{display:'block',...style}} {...rest}>
      {d.split(' M').map((seg,i)=>(<path key={i} d={(i?'M':'')+seg}/>))}
    </svg>
  );
}

function Check({on, indet, size=18}){
  return (
    <span className={'checkbox'+(on?' checked':'')+(indet?' indet':'')}>
      {on && <Icon name="check" size={size-5} stroke={3}/>}
      {!on && indet && <span style={{width:9,height:2,background:'#fff',borderRadius:2}}/>}
    </span>
  );
}

function Toggle({on}){ return <span className={'toggle'+(on?' on':'')}/>; }

function NumStepper({value, onChange, min=0, max=20}){
  return (
    <div className="stepper-num">
      <button type="button" onClick={()=>onChange(Math.max(min,value-1))}>−</button>
      <input value={value} onChange={e=>{const v=parseInt(e.target.value.replace(/\D/g,''))||0;onChange(Math.min(max,Math.max(min,v)));}}/>
      <button type="button" onClick={()=>onChange(Math.min(max,value+1))}>+</button>
    </div>
  );
}

Object.assign(window, { Icon, Check, Toggle, NumStepper });
