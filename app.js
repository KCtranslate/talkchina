import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const samples = [
 {term:"yyds",pinyin:"yǒng yuǎn de shén",meaning:"영원한 신, 최고",category:"줄임말",note:"永远的神의 병음 첫 글자를 딴 표현. 사람이나 작품을 극찬할 때 써요.",detail:"좋아하는 가수·음식·작품을 강하게 칭찬할 때 쓰는 인터넷 표현이에요."},
 {term:"xswl",pinyin:"xiào sǐ wǒ le",meaning:"웃겨 죽겠어 ㅋㅋㅋ",category:"줄임말",note:"笑死我了의 초성 줄임말. 재미있는 상황이나 농담에 반응할 때 사용해요."},
 {term:"绝绝子",pinyin:"jué jué zǐ",meaning:"완전 대박, 진짜 최고",category:"신조어",note:"무언가가 아주 좋거나 인상적일 때 강조하는 인터넷 유행 표현이에요. 문맥에 따라 반어적으로 쓰이기도 해요."},
 {term:"无语",pinyin:"wú yǔ",meaning:"어이없네, 할 말이 없네",category:"감정·반응",note:"황당하거나 답답해서 말문이 막힐 때 써요. 말투에 따라 장난스럽기도 해요."},
 {term:"破防了",pinyin:"pò fáng le",meaning:"마음이 무너졌어, 감정이 흔들렸어",category:"신조어",note:"심리적 방어가 무너졌다는 뜻. 감동이나 상처를 받아 마음이 크게 움직일 때 사용해요."},
 {term:"emo",pinyin:"ēi mō",meaning:"우울해, 감성에 잠겼어",category:"신조어",note:"기분이 가라앉거나 센치해진 상태를 가볍게 표현하는 인터넷 용어예요."},
 {term:"哈哈哈",pinyin:"hā hā hā",meaning:"ㅋㅋㅋㅋ, 하하하",category:"일상 회화",note:"웃음을 표현해요. 글자 수가 길수록 웃음이 크거나 반응이 풍부하게 느껴질 수 있어요."},
 {term:"笑死我了",pinyin:"xiào sǐ wǒ le",meaning:"아 진짜 웃겨 죽겠네",category:"일상 회화",note:"친구 사이에서 매우 웃긴 상황에 자연스럽게 쓰는 과장된 표현이에요."},
 {term:"牛",pinyin:"niú",meaning:"대단하다, 쩐다",category:"일상 회화",note:"소라는 원뜻 외에 사람의 능력이나 결과가 훌륭하다는 칭찬으로 사용해요."},
 {term:"绝了",pinyin:"jué le",meaning:"끝내준다, 대박이다",category:"감정·반응",note:"좋거나 놀라운 상황 모두에 쓸 수 있어요. 말투에 따라 감탄이나 어이없음이 돼요."},
 {term:"666",pinyin:"liù liù liù",meaning:"잘한다, 멋지다, 대단해",category:"줄임말",note:"六의 발음이 溜(능숙하다)와 비슷해 생긴 인터넷 표현이에요."},
 {term:"安排",pinyin:"ān pái",meaning:"오케이, 그렇게 하자",category:"일상 회화",note:"원래는 안배·安排하다라는 뜻. 채팅에서는 '콜', '접수'처럼 쓰이기도 해요."},
 {term:"躺平",pinyin:"tǎng píng",meaning:"아무것도 안 하고 쉬기, 현상 유지",category:"신조어",note:"경쟁과 과도한 노력에서 벗어나 최소한만 하겠다는 태도를 가리켜요."},
 {term:"内卷",pinyin:"nèi juǎn",meaning:"과도한 경쟁, 소모적인 경쟁",category:"신조어",note:"다 같이 지나치게 경쟁하지만 실질적인 이득은 크지 않은 상황을 말해요."},
 {term:"有一说一",pinyin:"yǒu yī shuō yī",meaning:"솔직히 말해서, 있는 그대로 말하면",category:"일상 회화",note:"자기 의견을 솔직하게 말하겠다는 말로 문장 앞에 자주 붙여요."},
 {term:"懂的都懂",pinyin:"dǒng de dōu dǒng",meaning:"아는 사람은 다 알지",category:"줄임말",note:"굳이 자세히 설명하지 않아도 아는 사람은 안다는 의미예요."},
 {term:"dbq",pinyin:"duì bu qǐ",meaning:"미안해",category:"줄임말",note:"对不起의 병음 첫 글자를 딴 줄임말이에요."},
 {term:"awsl",pinyin:"ā wǒ sǐ le",meaning:"귀여워서 죽겠다, 너무 좋아",category:"줄임말",note:"啊我死了의 초성. 귀엽거나 설레는 것을 봤을 때 과장해서 표현해요."},
 {term:"绝绝子",pinyin:"jué jué zǐ",meaning:"진짜 최고, 대박",category:"신조어",note:"강한 감탄을 나타내는 유행어예요. 상황에 따라 비꼬는 말일 수도 있어요."}
];
let category="전체", saved=JSON.parse(localStorage.getItem("talkchina-saved")||"[]"), translator=null, modelState="idle", modelPromise=null, lastResult=null;
function toast(m){const e=$("#toast");e.textContent=m;e.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>e.classList.remove("show"),2400)}
function esc(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderSaved(){$("#saved-count").textContent=saved.length;$("#saved-total").textContent=`${saved.length}개 저장`;const b=$("#saved-list");if(!saved.length){b.innerHTML='<div class="saved-empty">♡<br><strong>아직 저장한 표현이 없어요.</strong><br>번역 결과나 신조어 사전에서 마음에 드는 표현을 저장해 보세요.</div>';return}b.innerHTML=saved.map((x,i)=>`<div class="saved-item"><div><strong>${esc(x.term)}</strong><p>${esc(x.meaning)}${x.pinyin?" · "+esc(x.pinyin):""}</p></div><button class="small-action" data-remove="${i}">삭제</button></div>`).join("");$$("[data-remove]").forEach(b=>b.onclick=()=>{saved.splice(+b.dataset.remove,1);persist();renderSaved();toast("단어장에서 삭제했어요.")})}
function persist(){localStorage.setItem("talkchina-saved",JSON.stringify(saved))}
function saveWord(x){if(saved.some(y=>y.term===x.term)){toast("이미 저장된 표현이에요.");return}saved.unshift(x);persist();renderSaved();toast("나의 단어장에 저장했어요.")}
function renderDictionary(q=""){q=q.trim().toLowerCase();let list=samples.filter(x=>(category==="전체"||x.category===category)&&(!q||[x.term,x.pinyin,x.meaning,x.note].join(" ").toLowerCase().includes(q)));$("#dictionary-grid").innerHTML=list.length?list.map(x=>`<article class="word-card"><div class="word-top"><strong>${esc(x.term)}</strong><span class="word-tag">${esc(x.category)}</span></div><div class="pinyin">${esc(x.pinyin)}</div><div class="meaning">${esc(x.meaning)}</div><div class="word-note">${esc(x.note)}</div><div class="word-card-foot"><button class="small-action" data-save="${esc(x.term)}">♡ 저장</button></div></article>`).join(""):'<div class="saved-empty" style="grid-column:1/-1">검색 결과가 없어요. 다른 단어로 검색해 보세요.</div>';$$("[data-save]").forEach(b=>b.onclick=()=>{let x=samples.find(x=>x.term===b.dataset.save);if(x)saveWord(x)})}
function switchTab(n){$$(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===n));$$(".panel").forEach(p=>p.classList.toggle("active",p.id===`${n}-panel`));if(n==="saved")renderSaved();if(n==="dictionary")renderDictionary($("#dictionary-search").value)}
$$(".tab").forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
$("#source-text").addEventListener("input",e=>$("#char-count").textContent=`${e.target.value.length.toLocaleString()} / 1,200`);
$("#clear-input").onclick=()=>{$("#source-text").value="";$("#char-count").textContent="0 / 1,200";$("#source-text").focus()};
$("#sample-input").onclick=()=>{$("#source-text").value="笑死我了，你真的绝绝子！";$("#char-count").textContent=`${$("#source-text").value.length} / 1,200`};
function setStatus(t,good=true){$("#ai-status").textContent=t;$(".status-dot").style.background=good?"#22c55e":"#f59e0b"}
function localDictionaryAnalysis(text){
 const found=samples.filter(x=>text.toLowerCase().includes(x.term.toLowerCase())|| (x.term==="xswl"&&text.toLowerCase().includes("xswl")) || (x.term==="yyds"&&text.toLowerCase().includes("yyds")));
 if(!found.length)return null;
 const translation=found.map(x=>`${x.term}: ${x.meaning}`).join(" · ");
 return {translation,nuance:found.map(x=>x.note).join(" "),context:"자체 신조어 사전에서 일치하는 표현을 찾았어요. 문장 전체의 맥락에 따라 의미가 달라질 수 있어요.",expressions:found.slice(0,5).map(x=>({chinese:x.term,pinyin:x.pinyin,meaning:x.meaning})),replies:[],source:"dictionary"};
}
async function loadModel(){
 if(translator)return translator;if(modelPromise)return modelPromise;
 modelState="loading";setStatus("번역 모델 불러오는 중",false);
 $("#result-card").innerHTML='<div class="loading"><span class="spinner"></span><span>브라우저 AI 번역 모델을 준비하고 있어요.<br>처음에는 모델 다운로드로 시간이 걸릴 수 있어요.</span></div>';
 modelPromise=(async()=>{try{
   env.allowLocalModels=false;env.allowRemoteModels=true;
   translator=await pipeline("translation","Xenova/opus-mt-zh-ko",{progress_callback:p=>{if(p.status==="progress"&&p.total){let pct=Math.round(p.loaded/p.total*100);setStatus(`모델 다운로드 ${pct}%`,false)}}});
   modelState="ready";setStatus("브라우저 AI 사용 가능");return translator;
 }catch(e){modelState="failed";setStatus("사전 번역 모드",false);throw new Error("이 브라우저에서 AI 모델을 불러오지 못했어요. 사전 검색은 계속 사용할 수 있습니다. "+(e.message||""));}})();
 try{return await modelPromise}finally{modelPromise=null}
}
function markup(r){let ex=(r.expressions||[]).map(x=>`<div class="expression"><div><strong>${esc(x.chinese)}</strong><p>${esc(x.pinyin||"")}</p></div><span>${esc(x.meaning)}</span></div>`).join("");let rp=(r.replies||[]).map(x=>`<div class="reply-item"><div><span>${esc(x.chinese)}</span><small>${esc(x.pinyin||"")} · ${esc(x.meaning||"")}</small></div><button class="small-action" data-copy="${esc(x.chinese)}">복사</button></div>`).join("");return `<div class="result-content"><div class="result-label">✦ ${r.source==="dictionary"?"사전 기반 표현 해석":"브라우저 AI 번역 결과"}</div><h3>${esc(r.translation)}</h3><div class="result-block"><h4>🔎 표현과 뉘앙스</h4><p>${esc(r.nuance||"")}</p>${ex}</div><div class="result-block"><h4>🗣️ 대화 상황</h4><p>${esc(r.context||"")}</p></div>${rp?`<div class="result-block"><h4>✍️ 답장 아이디어</h4>${rp}</div>`:""}<div class="result-actions"><button id="copy-translation">번역 복사</button><button id="save-translation">♡ 표현 저장</button></div><p class="privacy-note">결과는 참고용이며, AI 번역은 문맥·말투를 완벽하게 판별하지 못할 수 있어요.</p></div>`}
async function translate(){let text=$("#source-text").value.trim();if(!text){toast("중국어 메시지를 먼저 입력해 주세요.");return}let btn=$("#translate-button");btn.disabled=true;
 try{
  const dictionary=localDictionaryAnalysis(text);
  if(dictionary){lastResult=dictionary;$("#result-card").innerHTML=markup(dictionary);wireResult(text);return}
  const model=await loadModel();
  const out=await model(text,{});
  const translated=Array.isArray(out)?out.map(x=>x.translation_text||"").join("\n"):"";
  if(!translated)throw new Error("모델에서 번역 결과를 받지 못했어요.");
  lastResult={translation:translated,nuance:"브라우저에서 실행한 중국어→한국어 번역 모델의 결과예요. 신조어·은어는 문맥에 따라 정확하지 않을 수 있어요.",context:"자체 사전에서 일치하는 신조어를 찾지 못해 AI 번역 모델로 처리했어요. 표현의 정확한 용례는 원어민에게 확인하는 것이 좋아요.",expressions:[],replies:[],source:"browser-ai"};
  $("#result-card").innerHTML=markup(lastResult);wireResult(text);
 }catch(e){let dict=localDictionaryAnalysis(text);if(dict){lastResult=dict;$("#result-card").innerHTML=markup(dict);wireResult(text)}else{$("#result-card").innerHTML=`<div class="error-box"><strong>AI 번역을 실행하지 못했어요.</strong><br>${esc(e.message)}<br><br>아래 신조어 사전에서 표현을 검색하거나, 최신 브라우저와 안정적인 인터넷 연결을 확인해 주세요.</div>`}}
 finally{btn.disabled=false}
}
function wireResult(original){$("#copy-translation").onclick=()=>copyText(lastResult.translation);$("#save-translation").onclick=()=>saveWord({term:original,meaning:lastResult.translation,pinyin:"",category:"번역 저장"});$$("[data-copy]").forEach(b=>b.onclick=()=>copyText(b.dataset.copy))}
async function copyText(t){try{await navigator.clipboard.writeText(t);toast("복사했어요!")}catch{toast("복사는 HTTPS 환경에서 사용할 수 있어요.")}}
$("#translate-button").onclick=translate;
$("#ask-dictionary").onclick=()=>{let q=$("#dictionary-search").value.trim();if(!q){toast("먼저 궁금한 표현을 입력해 주세요.");return}switchTab("translate");$("#source-text").value=q;$("#char-count").textContent=`${q.length} / 1,200`;translate()};
$("#dictionary-search-button").onclick=()=>renderDictionary($("#dictionary-search").value);$("#dictionary-search").onkeydown=e=>{if(e.key==="Enter")renderDictionary(e.target.value)};
$$(".category").forEach(b=>b.onclick=()=>{category=b.dataset.category;$$(".category").forEach(x=>x.classList.toggle("active",x===b));renderDictionary($("#dictionary-search").value)});
renderDictionary();renderSaved();
setStatus("브라우저 AI 대기 중");
