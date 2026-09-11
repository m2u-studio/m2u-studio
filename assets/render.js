// Apply editable links/email from SITE (data.js) to every page
(function(){
  if(!window.SITE) return;
  if(SITE.links){
    document.querySelectorAll('[data-net]').forEach(function(a){
      var u=SITE.links[a.getAttribute('data-net')]; if(u) a.href=u;
    });
  }
})();
