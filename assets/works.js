// WORKs — grid, title-only search, popup modal with a Spotify-style player
(function(){
  var grid=document.getElementById('wgrid');
  var countEl=document.getElementById('rcount');
  var search=document.getElementById('search');
  if(!grid||!window.TRACKS) return;

  function dict(){ return (window.I18N&&window.I18N[window.M2U_LANG])||{u_unit:"TRACKS",u_none:"No results."}; }
  // 한자·가나(일본어/중국어) 포함 여부 → 원래 폰트 사용
  var CJK=/[\u3000-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff65-\uff9f]/;
  function ck(str){ return CJK.test(str||'')?' cjk':''; }
  function coverInner(t){
    if(t.cover) return '<img src="'+t.cover+'" alt="">';
    return '<div class="g" style="--c1:'+t.c1+';--c2:'+t.c2+'"></div><div class="m">'+(t.mono||'M')+'</div>';
  }
  function setCount(n){
    var d=dict(), l=window.M2U_LANG;
    if(countEl) countEl.textContent = n + (l==='en'?' ':'') + d.u_unit;
  }
  function render(list){
    grid.innerHTML='';
    if(!list.length){ grid.innerHTML='<p class="no-results">'+dict().u_none+'</p>'; }
    list.forEach(function(t){
      var idx=TRACKS.indexOf(t);
      var card=document.createElement('div'); card.className='wcard';
      card.innerHTML='<div class="wcover">'+coverInner(t)+'<div class="play"><span>&#9654;</span></div></div>'+
        '<div class="wmeta"><div class="wtitle'+ck(t.title)+'">'+t.title+'</div>'+
        '<div class="wartist'+ck(t.artist)+'">'+t.artist+'</div></div>';
      card.addEventListener('click',function(){ openModal(idx); });
      grid.appendChild(card);
    });
    setCount(list.length);
  }
  function current(){
    var q=(search&&search.value||'').trim().toLowerCase();
    var list=TRACKS;
    var pf=window.M2U_PARTNER||'';                     // 선택된 파트너사
    if(pf) list=list.filter(function(t){
      return Array.isArray(t.partners) && t.partners.indexOf(pf)>-1;
    });
    if(q) list=list.filter(function(t){ return t.title.toLowerCase().indexOf(q)>-1; });
    return list;
  }
  function filter(){ render(current()); }
  if(search) search.addEventListener('input',filter);
  document.addEventListener('langchange',function(){ render(current()); });
  document.addEventListener('partnerfilter',function(){ render(current()); });
  render(TRACKS);

  /* ---------- modal + player ---------- */
  var modal=document.getElementById('modal');
  var audio=new Audio();
  var isPlaying=false;
  function fmt(s){ if(!s||isNaN(s))return '0:00'; var m=Math.floor(s/60),x=Math.floor(s%60); return m+':'+(x<10?'0':'')+x; }

  function openModal(i){
    var t=TRACKS[i];
    modal.querySelector('.m-cover').innerHTML = t.cover
      ? '<img src="'+t.cover+'" alt="">'
      : '<div class="g" style="background:linear-gradient(140deg,'+t.c1+','+t.c2+')"></div><div class="m">'+(t.mono||'M')+'</div>';
    var mt=modal.querySelector('.m-title'), ma=modal.querySelector('.m-artist'),
        pt=modal.querySelector('.player .pt'), pa=modal.querySelector('.player .pa');
    mt.textContent=t.title; ma.textContent=t.artist; pt.textContent=t.title; pa.textContent=t.artist;
    var isT=!!ck(t.title), isA=!!ck(t.artist);
    mt.classList.toggle('cjk',isT); pt.classList.toggle('cjk',isT);
    ma.classList.toggle('cjk',isA); pa.classList.toggle('cjk',isA);
    var hint=modal.querySelector('.phint'), btn=modal.querySelector('.pbtn');
    resetPlayer();
    if(t.audio){ audio.src=t.audio; hint.style.display='none'; btn.disabled=false; btn.style.opacity=1; }
    else{ audio.removeAttribute('src'); hint.style.display='block'; btn.disabled=true; btn.style.opacity=.45; }
    modal.classList.add('open'); document.body.style.overflow='hidden';
    // 음원이 연결된 곡은 팝업이 열리면 바로 재생
    if(t.audio){
      audio.play().then(function(){ setPlaying(true); })
        .catch(function(){ setPlaying(false); }); // 브라우저가 자동재생을 막으면 정지 상태 유지
    }
  }
  function closeModal(){ modal.classList.remove('open'); document.body.style.overflow=''; audio.pause(); setPlaying(false); }
  function resetPlayer(){ audio.pause(); audio.currentTime=0; setPlaying(false);
    modal.querySelector('.fill').style.width='0%'; modal.querySelector('.cur').textContent='0:00'; modal.querySelector('.dur').textContent='0:00'; }
  function setPlaying(p){ isPlaying=p; modal.querySelector('.player').classList.toggle('playing',p);
    modal.querySelector('.pbtn').innerHTML = p?'&#10073;&#10073;':'&#9654;'; }

  document.addEventListener('click',function(e){
    if(e.target.closest('.modal-close')||e.target.classList.contains('modal-bg')) closeModal();
  });
  addEventListener('keydown',function(e){ if(e.key==='Escape'&&modal.classList.contains('open')) closeModal(); });
  modal.querySelector('.pbtn').addEventListener('click',function(){
    if(!audio.src) return;
    if(isPlaying){ audio.pause(); setPlaying(false); }
    else{ audio.play().then(function(){setPlaying(true);}).catch(function(){}); }
  });
  audio.addEventListener('timeupdate',function(){
    var pct=audio.duration?(audio.currentTime/audio.duration*100):0;
    modal.querySelector('.fill').style.width=pct+'%'; modal.querySelector('.cur').textContent=fmt(audio.currentTime);
  });
  audio.addEventListener('loadedmetadata',function(){ modal.querySelector('.dur').textContent=fmt(audio.duration); });
  audio.addEventListener('ended',function(){ setPlaying(false); modal.querySelector('.fill').style.width='0%'; });
  modal.querySelector('.bar').addEventListener('click',function(e){
    if(!audio.duration) return; var r=this.getBoundingClientRect();
    audio.currentTime=((e.clientX-r.left)/r.width)*audio.duration;
  });
})();
