// 타임라인 & 파트너 렌더링 (data.js 기반, 언어 연동)
(function(){
  var tl=document.getElementById('timeline');
  var pg=document.getElementById('pgrid');
  if((!tl&&!pg)||!window.SITE) return;

  function esc(s){ return (s==null?'':String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function render(){
    var l=window.M2U_LANG||'ko';
    if(tl){
      tl.innerHTML='';
      (SITE.timeline||[]).forEach(function(e){
        var year=esc(e.year).replace(/[~–-]/g,'<br>~'); // 기간 표기는 두 줄로
        var t=esc((e.t&&e.t[l])||''); var d=esc((e.d&&e.d[l])||'');
        var row=document.createElement('div'); row.className='tl-row';
        row.innerHTML='<div class="tl-year">'+year+'</div><div class="tl-body"><h3>'+t+'</h3><p>'+d+'</p></div>';
        tl.appendChild(row);
      });
    }
    if(pg){
      pg.innerHTML='';
      (SITE.partners||[]).forEach(function(p){
        var card=document.createElement('div'); card.className='pcard';
        card.setAttribute('data-partner', p.name||'');
        if(p.logo) card.innerHTML='<img src="'+esc(p.logo)+'" alt="'+esc(p.name)+'">';
        else card.innerHTML='<span class="pname">'+esc(p.name)+'</span>';
        pg.appendChild(card);
      });
      // 필터 상태 복원 (곡 목록이 있는 페이지에서만 동작)
      if(window.M2U_PARTNER) syncCards(window.M2U_PARTNER);
    }
  }

  function syncCards(name){
    if(!pg) return;
    var on=!!name;
    pg.classList.toggle('filtering', on);
    pg.querySelectorAll('.pcard').forEach(function(c){
      c.classList.toggle('on', on && c.getAttribute('data-partner')===name);
    });
    var clear=document.getElementById('pclear');
    if(clear) clear.hidden=!on;
  }
  window.M2U_syncPartnerCards=syncCards;

  // 클릭 → 곡 목록 필터 (works.js 가 이 이벤트를 받음)
  if(pg){
    pg.addEventListener('click',function(e){
      var card=e.target.closest('.pcard'); if(!card) return;
      var name=card.getAttribute('data-partner');
      var next = (window.M2U_PARTNER===name) ? '' : name;   // 같은 곳 다시 누르면 해제
      window.M2U_PARTNER=next;
      syncCards(next);
      document.dispatchEvent(new CustomEvent('partnerfilter',{detail:{partner:next}}));
    });
    var clear=document.getElementById('pclear');
    if(clear) clear.addEventListener('click',function(){
      window.M2U_PARTNER='';
      syncCards('');
      document.dispatchEvent(new CustomEvent('partnerfilter',{detail:{partner:''}}));
    });
  }

  document.addEventListener('langchange', render);
  render();
})();
