/* 페이지 타이틀 모션
   1) 오프닝: 글자가 아래에서 위로 랜덤한 속도로 올라옴 (그대로 유지)
   2) 이후: 2~3글자 묶음이 위(또는 아래)로 빠지면서 반대쪽에서 같은 글자가 들어옴 — 롤 방식 */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 롤 위치: 0% = 첫 글자, -33.333% = 가운데(기본), -66.666% = 마지막
  var HOME = -33.3333, UP = -66.6666, DOWN = 0, EMPTY = 33.3333;

  document.querySelectorAll('.page-title').forEach(function(el){
    var txt=(el.textContent||'').trim();
    if(!txt) return;
    el.textContent='';

    var rolls=[];
    txt.split('').forEach(function(ch){
      var c = (ch===' ' ? '\u00A0' : ch);
      var wrap=document.createElement('span'); wrap.className='ch-w';
      var roll=document.createElement('span'); roll.className='ch';
      for(var i=0;i<3;i++){                       // 같은 글자 3장을 세로로 쌓음
        var face=document.createElement('i'); face.textContent=c; roll.appendChild(face);
      }
      wrap.appendChild(roll); el.appendChild(wrap);
      if(ch!==' ') rolls.push(roll);
    });
    if(reduce || !rolls.length){
      rolls.forEach(function(r){ r.style.transform='translateY('+HOME+'%)'; r.style.opacity='1'; });
      return;
    }

    /* 1) 오프닝 — 아래에서 스윽 올라오기 (속도 제각각) */
    var maxEnd=0;
    rolls.forEach(function(r,i){
      var dur   = 620 + Math.random()*760;
      var delay = i*45 + Math.random()*200;
      r.style.transform='translateY('+EMPTY+'%)';
      r.style.opacity='0';
      setTimeout(function(){
        r.style.transition='transform '+dur+'ms cubic-bezier(.16,1,.3,1), opacity '+Math.round(dur*0.55)+'ms ease-out';
        r.style.transform='translateY('+DOWN+'%)';
        r.style.opacity='1';
        setTimeout(function(){                    // 글자 모양이 같아 티 안 나게 기본 위치로 정렬
          r.style.transition='none';
          r.style.transform='translateY('+HOME+'%)';
          void r.offsetWidth;
        }, dur+30);
      }, delay+40);
      maxEnd=Math.max(maxEnd, delay+dur);
    });

    /* 2) 랜덤 묶음 롤 */
    var busy={};
    function roll(){
      var n=rolls.length;
      var size=Math.min(n, 2+Math.floor(Math.random()*2));       // 2~3글자
      var start=Math.floor(Math.random()*Math.max(1,n-size+1));  // 위치 랜덤
      var up=Math.random()<0.5;                                  // 방향 랜덤
      var to=up?UP:DOWN;
      var dur=620+Math.random()*420;

      for(var k=0;k<size;k++){
        var idx=start+k;
        if(idx>=n || busy[idx]) continue;
        (function(r,key,step){
          busy[key]=true;
          setTimeout(function(){
            r.style.transition='transform '+dur+'ms cubic-bezier(.3,.9,.25,1)';
            r.style.transform='translateY('+to+'%)';
            setTimeout(function(){                  // 같은 글자라 순간 복귀해도 보이지 않음
              r.style.transition='none';
              r.style.transform='translateY('+HOME+'%)';
              void r.offsetWidth;
              busy[key]=false;
            }, dur+30);
          }, step*240);                             // 글자 사이 간격도 넉넉하게
        })(rolls[idx], idx, k);
      }
      setTimeout(roll, 3300 + Math.random()*5700);  // 다음 묶음까지 여유있게
    }
    setTimeout(roll, maxEnd+1500);
  });
})();
