// Animate .page-title letters (up/down wave, staggered)
(function(){
  document.querySelectorAll(".page-title").forEach(function(el){
    var txt=(el.textContent||"").trim();
    el.textContent="";
    txt.split("").forEach(function(c,i){
      var s=document.createElement("span");
      s.className="ch"; s.textContent=c;
      s.style.animationDelay=(i*0.07)+"s";
      el.appendChild(s);
    });
  });
})();
