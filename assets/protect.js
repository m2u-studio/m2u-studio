/* 콘텐츠 보호 — 우클릭 / 이미지 저장·복사 / 드래그 방지
   ※ 완벽한 차단은 불가능하지만(브라우저 특성), 일반적인 저장 경로는 모두 막습니다. */
(function(){
  function isFormField(el){
    return el && (el.closest('input, textarea, select, [contenteditable="true"]'));
  }

  // 1) 우클릭 메뉴 차단
  document.addEventListener('contextmenu', function(e){
    if(isFormField(e.target)) return;   // 입력칸은 붙여넣기 등을 위해 허용
    e.preventDefault();
  });

  // 2) 이미지 드래그로 빼내기 차단
  document.addEventListener('dragstart', function(e){
    if(e.target && (e.target.tagName==='IMG' || e.target.closest('.wcover, .m-cover, .home-tile, .pv'))){
      e.preventDefault();
    }
  });

  // 3) 텍스트 선택(복사) 차단 — 입력칸은 제외
  document.addEventListener('selectstart', function(e){
    if(isFormField(e.target)) return;
    e.preventDefault();
  });
  document.addEventListener('copy', function(e){
    if(isFormField(e.target)) return;
    e.preventDefault();
  });

  // 4) 개발자도구 / 소스보기 / 저장 단축키 차단
  document.addEventListener('keydown', function(e){
    var k=(e.key||'').toLowerCase();
    if(e.key==='F12'){ e.preventDefault(); return; }                       // 개발자도구
    if((e.ctrlKey||e.metaKey) && e.shiftKey && (k==='i'||k==='j'||k==='c')){ e.preventDefault(); return; }
    if((e.ctrlKey||e.metaKey) && (k==='u'||k==='s'||k==='p')){             // 소스보기 / 저장 / 인쇄
      e.preventDefault(); return;
    }
    if((e.ctrlKey||e.metaKey) && (k==='c'||k==='a') && !isFormField(e.target)){
      e.preventDefault();
    }
  });

  // 5) 모바일 길게 누르기(이미지 저장 메뉴) 차단
  document.addEventListener('touchstart', function(e){
    if(e.target && e.target.tagName==='IMG') e.preventDefault();
  }, {passive:false});
})();
