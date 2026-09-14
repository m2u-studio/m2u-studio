// ===== M2U i18n — UI 라벨(고정) + data.js(SITE) 콘텐츠 병합 =====
window.I18N = {
  ko:{ pt_all:"전체 보기", home_contact:"Contact", foot_contact:"연락하기", about_tl_title:"타임라인", about_pt_title:"함께한 곳",
    works_ph:"곡 제목으로 검색…", c_company:"회사명", c_name:"이름", c_email:"이메일", c_tel:"연락처", c_comment:"내용",
    c_company_ph:"회사명 (선택)", c_name_ph:"이름", c_email_ph:"you@example.com", c_tel_ph:"연락처 (선택)", c_comment_ph:"문의 내용을 적어주세요.",
    c_submit:"보내기", u_unit:"곡", u_none:"검색 결과가 없어요. 다른 곡 제목을 입력해 보세요.",
    u_need:"이름 · 이메일 · 내용은 채워 주세요.", u_open:"메일 앱이 열립니다. 내용 확인 후 전송해 주세요." },
  en:{ pt_all:"Show all", home_contact:"Contact", foot_contact:"Contact Us", about_tl_title:"Timeline", about_pt_title:"Worked with",
    works_ph:"Search by track title…", c_company:"Company Name", c_name:"Name", c_email:"E-mail", c_tel:"Tel", c_comment:"Comment",
    c_company_ph:"Company (optional)", c_name_ph:"Your name", c_email_ph:"you@example.com", c_tel_ph:"Phone (optional)", c_comment_ph:"Tell me about your project.",
    c_submit:"Submit", u_unit:"TRACKS", u_none:"No results. Try another track title.",
    u_need:"Please fill in name, e-mail and comment.", u_open:"Your mail app will open — review and send." },
  ja:{ pt_all:"すべて表示", home_contact:"お問い合わせ", foot_contact:"お問い合わせ", about_tl_title:"タイムライン", about_pt_title:"協業した企業",
    works_ph:"曲名で検索…", c_company:"会社名", c_name:"お名前", c_email:"メール", c_tel:"電話", c_comment:"内容",
    c_company_ph:"会社名（任意）", c_name_ph:"お名前", c_email_ph:"you@example.com", c_tel_ph:"電話（任意）", c_comment_ph:"ご相談内容をご記入ください。",
    c_submit:"送信", u_unit:"曲", u_none:"該当する曲がありません。別の曲名でお試しください。",
    u_need:"お名前・メール・内容をご入力ください。", u_open:"メールアプリが開きます。内容を確認して送信してください。" },
  zh:{ pt_all:"显示全部", home_contact:"联系", foot_contact:"联系我们", about_tl_title:"时间线", about_pt_title:"合作伙伴",
    works_ph:"按曲名搜索…", c_company:"公司名称", c_name:"姓名", c_email:"邮箱", c_tel:"电话", c_comment:"内容",
    c_company_ph:"公司名称（选填）", c_name_ph:"您的姓名", c_email_ph:"you@example.com", c_tel_ph:"电话（选填）", c_comment_ph:"请填写您的咨询内容。",
    c_submit:"提交", u_unit:"首", u_none:"没有结果，请尝试其他曲名。",
    u_need:"请填写姓名、邮箱和内容。", u_open:"邮件应用将打开，请确认后发送。" }
};

// merge editable content strings from data.js (SITE.text)
(function(){
  var L=["ko","en","ja","zh"];
  if(window.SITE&&SITE.text){
    L.forEach(function(l){
      ["home_sub","foot_slogan","about_tagline"].forEach(function(k){
        if(SITE.text[k]&&SITE.text[k][l]!=null) I18N[l][k]=SITE.text[k][l];
      });
    });
  }
})();

(function(){
  function get(){ try{ return localStorage.getItem("m2u_lang"); }catch(e){ return null; } }
  function saveL(l){ try{ localStorage.setItem("m2u_lang", l); }catch(e){} }
  // 저장된 선택이 없으면 브라우저 언어로 자동 선택 (한/일/중 아니면 영어)
  function detect(){
    var list=(navigator.languages&&navigator.languages.length)?navigator.languages:[navigator.language||"en"];
    for(var i=0;i<list.length;i++){
      var l=String(list[i]||"").toLowerCase();
      if(l.indexOf("ko")===0) return "ko";
      if(l.indexOf("ja")===0) return "ja";
      if(l.indexOf("zh")===0) return "zh";
      if(l.indexOf("en")===0) return "en";
    }
    return "en";
  }
  window.M2U_LANG = get() || detect();
  function apply(l){
    var d=I18N[l]; if(!d) return;
    window.M2U_LANG=l; document.documentElement.lang=l; saveL(l);
    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var v=d[el.getAttribute("data-i18n")]; if(v!=null) el.textContent=v;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function(el){
      var v=d[el.getAttribute("data-i18n-ph")]; if(v!=null) el.setAttribute("placeholder", v);
    });
    document.querySelectorAll(".langs button").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-lang")===l); });
    document.dispatchEvent(new CustomEvent("langchange",{detail:{lang:l}}));
  }
  window.M2U_setLang=apply;
  document.addEventListener("click",function(e){
    var b=e.target.closest(".langs button"); if(b) apply(b.getAttribute("data-lang"));
  });
  apply(window.M2U_LANG);
})();
