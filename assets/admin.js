// ===== M2U Admin — 사이트 전체 콘텐츠 편집기 =====
(function(){
  var LS='m2u_admin_draft';
  function clone(o){ return JSON.parse(JSON.stringify(o)); }
  var BASE = window.SITE ? clone(window.SITE) : {email:'',links:{},text:{},timeline:[],partners:[],tracks:[]};

  var model;
  try{ var d=localStorage.getItem(LS); model = d?JSON.parse(d):clone(BASE); }catch(e){ model=clone(BASE); }
  function normalize(m){
    m.email=m.email||''; m.links=m.links||{};
    m.text=m.text||{};
    ['home_sub','foot_slogan','about_tagline'].forEach(function(k){ m.text[k]=m.text[k]||{ko:'',en:'',ja:'',zh:''}; });
    m.timeline=m.timeline||[]; m.partners=m.partners||[]; m.tracks=m.tracks||[];
    return m;
  }
  normalize(model);
  model.tracks.forEach(function(t){ if(!Array.isArray(t.partners)) t.partners=[]; });
  var sel={};                 // 체크된 곡 인덱스

  var LANGS=[['ko','한'],['en','EN'],['ja','日'],['zh','中']];
  var statusEl;
  function save(){ try{ localStorage.setItem(LS, JSON.stringify(model)); mark('저장됨 ✓'); }catch(e){ mark('저장 실패(용량?)'); } }
  function mark(t){ if(statusEl) statusEl.textContent=t; }

  function el(tag,attrs,kids){ var e=document.createElement(tag); attrs=attrs||{};
    for(var k in attrs){ if(k==='class')e.className=attrs[k]; else e.setAttribute(k,attrs[k]); }
    (kids||[]).forEach(function(c){ e.appendChild(typeof c==='string'?document.createTextNode(c):c); }); return e; }
  function input(val,on,ph,type){ var i=el('input',{type:type||'text'}); i.value=(val==null?'':val); if(ph)i.placeholder=ph;
    i.addEventListener('input',function(){ on(i.value); }); return i; }
  function textarea(val,on,ph){ var t=el('textarea'); t.value=(val==null?'':val); if(ph)t.placeholder=ph;
    t.addEventListener('input',function(){ on(t.value); }); return t; }
  function btn(label,cls,on){ var b=el('button',{class:cls||''},[label]); b.type='button'; b.addEventListener('click',on); return b; }
  function field(label,node){ return el('div',{class:'fld'},[el('label',{},[label]),node]); }
  function move(arr,i,dir){ var j=i+dir; if(j<0||j>=arr.length)return; var tmp=arr[i];arr[i]=arr[j];arr[j]=tmp; save(); }

  var panels={};
  function show(name){ for(var k in panels) panels[k].style.display=(k===name?'block':'none');
    document.querySelectorAll('.atab').forEach(function(t){ t.classList.toggle('on',t.getAttribute('data-t')===name); }); }

  function renderGeneral(){ var p=panels.general; p.innerHTML='';
    p.appendChild(el('h3',{class:'ph'},['일반 · 연락처 / 소셜 링크']));
    p.appendChild(field('E-mail (문의 폼 수신 주소)', input(model.email,function(v){model.email=v;save();},'you@example.com')));
    [['youtube','YouTube'],['spotify','Spotify'],['x','X'],['instagram','Instagram'],['facebook','Facebook']].forEach(function(n){
      p.appendChild(field(n[1], input(model.links[n[0]],function(v){model.links[n[0]]=v;save();},'https://…')));
    });
  }
  function renderText(){ var p=panels.text; p.innerHTML='';
    p.appendChild(el('h3',{class:'ph'},['문구 · 언어별 (한 / EN / 日 / 中)']));
    [['home_sub','홈 서브타이틀',false],['foot_slogan','푸터 슬로건 (엔터로 줄바꿈)',true],['about_tagline','ABOUT 소개문',true]].forEach(function(fd){
      var c=el('div',{class:'card'}); c.appendChild(el('h4',{},[fd[1]]));
      LANGS.forEach(function(L){
        var node;
        if(fd[2]){
          node = textarea(model.text[fd[0]][L[0]],function(v){model.text[fd[0]][L[0]]=v;save();});
          node.className = (fd[0]==='foot_slogan') ? 'ta-slogan' : 'ta-long';
        } else {
          node = input(model.text[fd[0]][L[0]],function(v){model.text[fd[0]][L[0]]=v;save();});
        }
        c.appendChild(field(L[1], node));
      });
      p.appendChild(c);
    });
  }
  function renderTimeline(){ var p=panels.timeline; p.innerHTML='';
    p.appendChild(el('h3',{class:'ph'},['약력 · 타임라인']));
    model.timeline.forEach(function(e,i){
      e.t=e.t||{}; e.d=e.d||{};
      var c=el('div',{class:'card'});
      var head=el('div',{class:'crow'});
      head.appendChild(el('span',{class:'idx'},['#'+(i+1)]));
      head.appendChild(input(e.year,function(v){e.year=v;save();},'연도 (예: 2014 또는 2015–19)'));
      head.appendChild(btn('↑','mini',function(){move(model.timeline,i,-1);renderTimeline();}));
      head.appendChild(btn('↓','mini',function(){move(model.timeline,i,1);renderTimeline();}));
      head.appendChild(btn('삭제','mini del',function(){model.timeline.splice(i,1);save();renderTimeline();}));
      c.appendChild(head);
      LANGS.forEach(function(L){
        var b=el('div',{class:'lblock'});
        b.appendChild(el('span',{class:'ll'},[L[1]]));
        b.appendChild(input((e.t[L[0]]||''),function(v){e.t[L[0]]=v;save();},'제목'));
        b.appendChild(textarea((e.d[L[0]]||''),function(v){e.d[L[0]]=v;save();},'설명'));
        c.appendChild(b);
      });
      p.appendChild(c);
    });
    p.appendChild(btn('+ 약력 항목 추가','add',function(){ model.timeline.push({year:'',t:{ko:'',en:'',ja:'',zh:''},d:{ko:'',en:'',ja:'',zh:''}}); save(); renderTimeline(); }));
  }
  function renderPartners(){ var p=panels.partners; p.innerHTML='';
    p.appendChild(el('h3',{class:'ph'},['파트너 · 회사 목록']));
    model.partners.forEach(function(pt,i){
      var c=el('div',{class:'crow'});
      c.appendChild(el('span',{class:'idx'},['#'+(i+1)]));
      c.appendChild(input(pt.name,function(v){pt.name=v;save();},'회사명'));
      c.appendChild(input(pt.logo,function(v){pt.logo=v;save();},'로고 경로(선택): assets/logos/x.svg'));
      c.appendChild(btn('↑','mini',function(){move(model.partners,i,-1);renderPartners();}));
      c.appendChild(btn('↓','mini',function(){move(model.partners,i,1);renderPartners();}));
      c.appendChild(btn('삭제','mini del',function(){model.partners.splice(i,1);save();renderPartners();}));
      p.appendChild(c);
    });
    p.appendChild(btn('+ 회사 추가','add',function(){ model.partners.push({name:'',logo:''}); save(); renderPartners(); }));
  }
  /* ---------- 파일 저장: 사이트 폴더에 자동 복사 ---------- */
  var DIR=null; // 사용자가 연결한 사이트 폴더 핸들
  function canPick(){ return typeof window.showDirectoryPicker==='function'; }
  function connectFolder(){
    if(!canPick()){ mark('이 브라우저는 폴더 연결 미지원 — 파일은 다운로드로 저장돼요'); return; }
    window.showDirectoryPicker({mode:'readwrite'}).then(function(h){
      DIR=h; mark('사이트 폴더 연결됨 ✓'); renderTracks();
    }).catch(function(){});
  }
  function safeName(n){ return n.replace(/[\/\\?%*:|"'<>#]/g,'').replace(/\s+/g,'_'); }
  function baseName(n){ return n.replace(/\.[^.]+$/,''); }
  function kindOf(file){
    if(/^image\//.test(file.type)||/\.(png|jpe?g|webp|gif|avif)$/i.test(file.name)) return 'covers';
    if(/^audio\//.test(file.type)||/\.(mp3|m4a|ogg|wav|flac)$/i.test(file.name)) return 'audio';
    return null;
  }
  // 파일을 assets/covers 또는 assets/audio 에 넣고 경로 문자열을 돌려줌
  function storeFile(file, kind){
    var name=safeName(file.name), path='assets/'+kind+'/'+name;
    if(DIR){
      return DIR.getDirectoryHandle('assets',{create:true})
        .then(function(a){ return a.getDirectoryHandle(kind,{create:true}); })
        .then(function(d){ return d.getFileHandle(name,{create:true}); })
        .then(function(fh){ return fh.createWritable(); })
        .then(function(w){ return Promise.resolve(w.write(file)).then(function(){ return w.close(); }); })
        .then(function(){ mark('저장됨: '+path); return path; });
    }
    var url=URL.createObjectURL(file), a=el('a',{});
    a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); },4000);
    mark('내려받음 — '+kind+' 폴더에 넣어주세요');
    return Promise.resolve(path);
  }
  function dropzone(label, accept, onFiles){
    var z=el('div',{class:'dz'});
    z.appendChild(el('span',{class:'dz-t'},[label]));
    var fi=el('input',{type:'file'}); fi.accept=accept; fi.multiple=true; fi.style.display='none';
    fi.addEventListener('change',function(){ onFiles(Array.prototype.slice.call(fi.files)); fi.value=''; });
    z.appendChild(fi);
    z.addEventListener('click',function(e){ if(e.target!==fi) fi.click(); });
    ['dragenter','dragover'].forEach(function(ev){ z.addEventListener(ev,function(e){ e.preventDefault(); e.stopPropagation(); z.classList.add('over'); }); });
    ['dragleave','dragend'].forEach(function(ev){ z.addEventListener(ev,function(e){ e.preventDefault(); z.classList.remove('over'); }); });
    z.addEventListener('drop',function(e){
      e.preventDefault(); e.stopPropagation(); z.classList.remove('over');
      onFiles(Array.prototype.slice.call((e.dataTransfer&&e.dataTransfer.files)||[]));
    });
    return z;
  }

  function renderTracks(){ var p=panels.tracks; p.innerHTML='';
    p.appendChild(el('h3',{class:'ph'},['곡 목록 · WORKS + HOME 배경 공용']));

    // 일괄 적용 바
    var keys=Object.keys(sel).filter(function(k){ return sel[k]; });
    var bulk=el('div',{class:'bulk'+(keys.length?' act':'')});
    var cnt=el('span',{class:'bulk-n'},[keys.length? (keys.length+'곡 선택됨') : '곡을 선택하면 일괄 적용할 수 있어요']);
    bulk.appendChild(cnt);
    var pick=el('select',{class:'bulk-sel'});
    pick.appendChild(el('option',{value:''},['회사 이름 선택…']));
    (model.partners||[]).forEach(function(p){
      if(!p.name) return;
      pick.appendChild(el('option',{value:p.name},[p.name]));
    });
    bulk.appendChild(pick);
    function chosen(){ return Object.keys(sel).filter(function(k){return sel[k];}).map(Number).sort(function(a,b){return a-b;}); }
    bulk.appendChild(btn('회사 적용','mini',function(){
      var name=pick.value, idx=chosen();
      if(!name){ mark('회사를 먼저 고르세요'); return; }
      if(!idx.length){ mark('곡을 먼저 선택하세요'); return; }
      idx.forEach(function(i){
        var t=model.tracks[i]; if(!Array.isArray(t.partners)) t.partners=[];
        if(t.partners.indexOf(name)<0) t.partners.push(name);
      });
      save(); renderTracks();
    }));
    bulk.appendChild(btn('회사 해제','mini',function(){
      var name=pick.value, idx=chosen();
      if(!name){ mark('회사를 먼저 고르세요'); return; }
      idx.forEach(function(i){
        var t=model.tracks[i]; if(!Array.isArray(t.partners)) return;
        t.partners=t.partners.filter(function(x){ return x!==name; });
      });
      save(); renderTracks();
    }));
    bulk.appendChild(btn('맨 위로','mini',function(){
      var idx=chosen(); if(!idx.length) return;
      var picked=idx.map(function(i){ return model.tracks[i]; });
      var rest=model.tracks.filter(function(_,i){ return idx.indexOf(i)<0; });
      model.tracks=picked.concat(rest);
      sel={}; picked.forEach(function(_,i){ sel[i]=true; });
      save(); renderTracks();
    }));
    bulk.appendChild(btn('맨 아래로','mini',function(){
      var idx=chosen(); if(!idx.length) return;
      var picked=idx.map(function(i){ return model.tracks[i]; });
      var rest=model.tracks.filter(function(_,i){ return idx.indexOf(i)<0; });
      model.tracks=rest.concat(picked);
      sel={}; picked.forEach(function(_,i){ sel[rest.length+i]=true; });
      save(); renderTracks();
    }));
    bulk.appendChild(btn('삭제','mini del',function(){
      var idx=chosen(); if(!idx.length) return;
      if(!confirm(idx.length+'곡을 삭제할까요?')) return;
      model.tracks=model.tracks.filter(function(_,i){ return idx.indexOf(i)<0; });
      sel={}; save(); renderTracks();
    }));
    bulk.appendChild(btn(keys.length?'선택 해제':'전체 선택','mini',function(){
      if(keys.length){ sel={}; }
      else { model.tracks.forEach(function(_,i){ sel[i]=true; }); }
      renderTracks();
    }));
    p.appendChild(bulk);

    // 사이트 폴더 연결 줄
    var bar=el('div',{class:'crow fbar'});
    bar.appendChild(btn(DIR?('사이트 폴더 연결됨: '+DIR.name):'사이트 폴더 연결하기','ghost',connectFolder));
    bar.appendChild(el('span',{class:'fbar-note'},[
      DIR ? '끌어놓은 파일이 assets/covers · assets/audio 에 바로 복사돼요.'
          : '먼저 연결하면 파일이 자동 복사돼요. 연결 안 하면 다운로드로 저장됩니다.'
    ]));
    p.appendChild(bar);

    // 새 곡 추가 (최상단)
    var addCard=el('div',{class:'card add-card'});
    addCard.appendChild(el('h4',{},['새 곡 추가']));
    addCard.appendChild(dropzone('이미지 + MP3를 여기에 끌어놓으세요 (이미지 파일명이 곡 제목이 됩니다)','image/*,audio/*',function(files){
      var img=null, aud=null;
      files.forEach(function(f){ var k=kindOf(f); if(k==='covers'&&!img) img=f; if(k==='audio'&&!aud) aud=f; });
      if(!img&&!aud){ mark('이미지나 mp3 파일이 아니에요'); return; }
      var t={title:baseName((img||aud).name), artist:'M2U', mono:'M', c1:'#7698D6', c2:'#182540', cover:'', audio:''};
      var jobs=[];
      if(img) jobs.push(storeFile(img,'covers').then(function(pth){ t.cover=pth; }));
      if(aud) jobs.push(storeFile(aud,'audio').then(function(pth){ t.audio=pth; }));
      Promise.all(jobs).then(function(){ model.tracks.unshift(t); save(); renderTracks(); });
    }));
    addCard.appendChild(btn('+ 빈 곡 추가','add',function(){
      model.tracks.unshift({title:'',artist:'M2U',mono:'M',c1:'#7698D6',c2:'#182540',cover:'',audio:''}); save(); renderTracks();
    }));
    p.appendChild(addCard);

    model.tracks.forEach(function(t,i){
      var c=el('div',{class:'card trk'+(sel[i]?' picked':'')});
      // 맨 왼쪽: 선택 체크박스
      var cbw=el('div',{class:'trk-cbw'});
      var cb=el('input',{type:'checkbox',class:'trk-cb'});
      cb.checked=!!sel[i];
      cb.addEventListener('change',function(){ sel[i]=cb.checked; renderTracks(); });
      cbw.appendChild(cb);
      c.appendChild(cbw);
      // 좌측: 커버 미리보기 (정사각형)
      var pv=el('div',{class:'pv'});
      if(t.cover){
        var im=el('img',{src:t.cover,alt:''});
        im.addEventListener('error',function(){ pv.classList.add('pv-err'); pv.innerHTML='<span>이미지를 찾을 수 없음</span>'; });
        pv.appendChild(im);
      } else {
        pv.classList.add('pv-empty');
        pv.appendChild(el('span',{},['커버 없음']));
      }
      c.appendChild(pv);
      var body=el('div',{class:'trk-body'});
      var r1=el('div',{class:'crow'});
      r1.appendChild(el('span',{class:'idx'},['#'+(i+1)]));
      r1.appendChild(input(t.title,function(v){t.title=v;save();},'곡 제목'));
      r1.appendChild(input(t.artist,function(v){t.artist=v;save();},'아티스트 (예: M2U feat. Guriri)'));
      r1.appendChild(btn('↑','mini',function(){move(model.tracks,i,-1);renderTracks();}));
      r1.appendChild(btn('↓','mini',function(){move(model.tracks,i,1);renderTracks();}));
      r1.appendChild(btn('삭제','mini del',function(){model.tracks.splice(i,1);save();renderTracks();}));
      body.appendChild(r1);

      // 끌어놓기 칸 (커버 / mp3)
      var rz=el('div',{class:'crow'});
      var zc=el('div',{class:'dz-wrap'});
      zc.appendChild(dropzone(t.cover?('커버 교체 — '+t.cover.split('/').pop()):'커버 이미지 끌어놓기','image/*',function(files){
        var img=null; files.forEach(function(f){ if(kindOf(f)==='covers'&&!img) img=f; });
        if(!img){ mark('이미지 파일이 아니에요'); return; }
        storeFile(img,'covers').then(function(pth){ t.cover=pth; save(); renderTracks(); });
      }));
      var za=el('div',{class:'dz-wrap'});
      za.appendChild(dropzone(t.audio?('MP3 교체 — '+t.audio.split('/').pop()):'MP3 끌어놓기','audio/*',function(files){
        var aud=null; files.forEach(function(f){ if(kindOf(f)==='audio'&&!aud) aud=f; });
        if(!aud){ mark('오디오 파일이 아니에요'); return; }
        storeFile(aud,'audio').then(function(pth){ t.audio=pth; save(); renderTracks(); });
      }));
      rz.appendChild(zc); rz.appendChild(za);
      body.appendChild(rz);

      var r2=el('div',{class:'crow'});
      r2.appendChild(field('커버 이미지 경로', input(t.cover,function(v){t.cover=v;save();},'assets/covers/x.jpg (비우면 색 타일)')));
      r2.appendChild(field('MP3 경로', input(t.audio,function(v){t.audio=v;save();},'assets/audio/x.mp3 (비우면 재생 대기)')));
      body.appendChild(r2);
      var r3=el('div',{class:'crow'});
      r3.appendChild(field('자동커버 글자', input(t.mono,function(v){t.mono=v;save();},'M')));
      r3.appendChild(field('색 1', input(t.c1||'#7698D6',function(v){t.c1=v;save();},'#7698D6','color')));
      r3.appendChild(field('색 2', input(t.c2||'#182540',function(v){t.c2=v;save();},'#182540','color')));
      body.appendChild(r3);
      var tags=el('div',{class:'ptags'});
      tags.appendChild(el('span',{class:'ptags-l'},['소속 회사']));
      if(!t.partners || !t.partners.length){ tags.appendChild(el('span',{class:'ptag-none'},['없음'])); }
      else t.partners.forEach(function(nm,pi){
        var tag=el('span',{class:'ptag'},[nm]);
        tag.appendChild(btn('×','ptag-x',function(){ t.partners.splice(pi,1); save(); renderTracks(); }));
        tags.appendChild(tag);
      });
      body.appendChild(tags);
      c.appendChild(body);
      p.appendChild(c);
    });
  }
  function renderAll(){ renderGeneral();renderText();renderTimeline();renderPartners();renderTracks(); }

  function serialize(){
    var header="/* ============================================================\n"+
               "   M2U — SITE DATA  (admin.html 에서 편집 → 이 파일로 교체)\n"+
               "   ============================================================ */\n";
    var body="window.SITE = "+JSON.stringify(model,null,2)+";\nwindow.TRACKS = window.SITE.tracks;\n";
    var prev="try{\n  if(/[?&]preview=1/.test(location.search)){\n    var _d=localStorage.getItem('m2u_admin_draft');\n"+
             "    if(_d){ window.SITE=JSON.parse(_d); window.TRACKS=window.SITE.tracks; }\n  }\n}catch(e){}\n";
    return header+body+prev;
  }
  function download(){ var blob=new Blob([serialize()],{type:'text/javascript'}); var url=URL.createObjectURL(blob);
    var a=el('a',{}); a.href=url; a.download='data.js'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); mark('data.js 내려받음 ✓'); }
  function copy(){ if(navigator.clipboard) navigator.clipboard.writeText(serialize()).then(function(){mark('클립보드 복사됨 ✓');},function(){mark('복사 실패');});
    else mark('이 브라우저는 복사 미지원'); }
  function reset(){ if(!confirm('편집 중인 내용을 버리고 현재 data.js 상태로 되돌릴까요?'))return;
    try{ localStorage.removeItem(LS); }catch(e){} model=normalize(clone(BASE)); renderAll(); mark('초기화됨'); }

  window.addEventListener('DOMContentLoaded', function(){
    var app=document.getElementById('app');
    statusEl=el('span',{class:'status'},['불러옴']);
    app.appendChild(el('div',{class:'topbar'},[
      el('div',{class:'brand'},[ el('img',{src:'assets/logos/m2u-logo-white.png',alt:'M2U'}), el('span',{},['Admin']) ]),
      el('div',{class:'actions'},[ statusEl,
        btn('미리보기','ghost',function(){ save(); window.open('index.html?preview=1','_blank'); }),
        btn('되돌리기','ghost',reset),
        btn('클립보드 복사','ghost',copy),
        btn('data.js 내보내기','primary',download)
      ])
    ]));
    var tabs=el('div',{class:'atabs'});
    [['general','일반'],['text','문구'],['timeline','약력'],['partners','파트너'],['tracks','곡 목록']].forEach(function(t){
      var b=el('button',{class:'atab','data-t':t[0]},[t[1]]); b.type='button'; b.addEventListener('click',function(){show(t[0]);}); tabs.appendChild(b);
    });
    app.appendChild(tabs);
    var host=el('div',{});
    ['general','text','timeline','partners','tracks'].forEach(function(n){ panels[n]=el('div',{class:'panel'}); host.appendChild(panels[n]); });
    app.appendChild(host);
    app.appendChild(el('p',{class:'help'},['편집 내용은 이 브라우저에 자동 저장돼요. 완료되면 ‘data.js 내보내기’로 받은 파일을 사이트의 assets/data.js 에 덮어쓰면 실제로 반영됩니다. ‘미리보기’는 적용 전 모습을 새 탭에서 보여줘요(호스팅 환경에서 가장 정확).']));

    renderAll(); show('general');
  });
})();
