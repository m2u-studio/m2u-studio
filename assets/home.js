// HOME — two big horizontal rows of album covers drifting in opposite directions
(function(){
  var host=document.getElementById('homeBg');
  if(!host||!window.TRACKS) return;

  function tile(t){
    var d=document.createElement('div'); d.className='home-tile';
    if(t.cover){ var im=new Image(); im.src=t.cover; im.alt=''; d.appendChild(im); }
    else d.innerHTML='<div class="g" style="--c1:'+t.c1+';--c2:'+t.c2+'"></div><div class="m">'+(t.mono||'M')+'</div>';
    return d;
  }

  function makeRow(offset, reverse, dur){
    var row=document.createElement('div'); row.className='home-row';
    var items=[];
    for(var i=0;i<8;i++){ items.push(TRACKS[(offset+i)%TRACKS.length]); }
    var set=items.concat(items); // duplicate for seamless loop
    set.forEach(function(t){ row.appendChild(tile(t)); });
    row.animate(
      [{transform:'translateX(0)'},{transform:'translateX(-50%)'}],
      {duration:dur*1000, iterations:Infinity, direction:reverse?'reverse':'normal', easing:'linear'}
    );
    return row;
  }

  host.appendChild(makeRow(0,  false, 60)); // top row → drifts left
  host.appendChild(makeRow(4,  true,  74)); // bottom row → drifts right

  // hotkey: press C → contact
  addEventListener('keydown',function(e){
    if((e.key==='c'||e.key==='C') && !/input|textarea/i.test((document.activeElement||{}).tagName||'')){
      location.href='contact.html';
    }
  });
})();
