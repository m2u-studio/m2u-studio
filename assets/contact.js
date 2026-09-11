// CONTACT — builds an email draft from the form (no server needed)
(function(){
  var form=document.getElementById('cform'); if(!form) return;
  var TO=(window.SITE&&SITE.email)||'m2ustation@gmail.com'; // 받는 주소 (data.js 의 email)
  function dict(){ return (window.I18N&&window.I18N[window.M2U_LANG])||{u_need:"Please fill in name, e-mail and comment.",u_open:"Your mail app will open."}; }
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var company=form.company.value.trim(), name=form.name.value.trim(), email=form.email.value.trim(),
        tel=form.tel.value.trim(), comment=form.comment.value.trim();
    if(!name||!email||!comment){ msg(dict().u_need,false); return; }
    var subject='[M2U] '+(company||name);
    var body='COMPANY : '+company+'\nNAME    : '+name+'\nE-MAIL  : '+email+'\nTEL     : '+tel+'\n\n'+comment+'\n';
    window.location.href='mailto:'+TO+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    msg(dict().u_open,true);
  });
  function msg(text,ok){ var el=document.getElementById('formMsg'); el.textContent=text; el.style.color=ok?'#7698D6':'#e0754f'; }
})();
