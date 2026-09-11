// nav: solid-on-scroll, full-screen mobile menu, active link
(function(){
  var nav=document.querySelector('.nav');
  if(nav){
    addEventListener('scroll',function(){nav.classList.toggle('solid',scrollY>30);},{passive:true});
    var t=nav.querySelector('.nav-toggle'), links=nav.querySelector('.links');
    function setOpen(open){
      links.classList.toggle('show',open);
      if(t) t.innerHTML = open ? '&#10005;' : '&#9776;';
      document.body.style.overflow = open ? 'hidden' : '';
    }
    if(t&&links){
      t.addEventListener('click',function(){ setOpen(!links.classList.contains('show')); });
      links.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){ setOpen(false); }); });
    }
  }
  var page=(location.pathname.split('/').pop()||'index.html');
  document.querySelectorAll('.nav .links a').forEach(function(a){
    var href=a.getAttribute('href');
    if(href===page || (page===''&&href==='index.html')) a.classList.add('active');
  });
})();
