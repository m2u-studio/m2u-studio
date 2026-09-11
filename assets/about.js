// ABOUT — render timeline & partners from SITE (data.js), language-aware
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
        if(p.logo) card.innerHTML='<img src="'+esc(p.logo)+'" alt="'+esc(p.name)+'">';
        else card.innerHTML='<span class="pname">'+esc(p.name)+'</span>';
        pg.appendChild(card);
      });
    }
  }
  document.addEventListener('langchange', render);
  render();
})();
