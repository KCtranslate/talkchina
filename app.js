import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const samples = [
  {term:"yyds",pinyin:"yǒng yuǎn de shén",meaning:"영원한 신, 최고",category:"유행어",note:"永远的神의 병음 첫 글자를 딴 표현. 사람이나 작품을 극찬할 때 써요."},
  {term:"xswl",pinyin:"xiào sǐ wǒ le",meaning:"웃겨 죽겠어 ㅋㅋㅋ",category:"유행어",note:"笑死我了의 초성 줄임말. 재미있는 상황이나 농담에 반응할 때 사용해요."},
  {term:"绝绝子",pinyin:"jué jué zǐ",meaning:"완전 대박, 진짜 최고",category:"신조어",note:"아주 좋거나 인상적일 때 쓰는 유행 표현이에요. 문맥에 따라 반어적으로도 쓰여요."},
  {term:"无语",pinyin:"wú yǔ",meaning:"어이없네, 할 말이 없네",category:"일상 용어",note:"황당하거나 답답해서 말문이 막힐 때 써요."},
  {term:"破防了",pinyin:"pò fáng le",meaning:"마음이 무너졌어, 감정이 흔들렸어",category:"신조어",note:"감동이나 상처를 받아 마음이 크게 움직였을 때 사용해요."},
  {term:"emo",pinyin:"ēi mō",meaning:"우울해, 감성에 잠겼어",category:"신조어",note:"기분이 가라앉거나 센치해진 상태를 가볍게 표현해요."},
  {term:"哈哈哈",pinyin:"hā hā hā",meaning:"ㅋㅋㅋㅋ, 하하하",category:"일상 용어",note:"웃음을 표현해요."},
  {term:"笑死我了",pinyin:"xiào sǐ wǒ le",meaning:"아 진짜 웃겨 죽겠네",category:"일상 용어",note:"친구 사이에서 매우 웃긴 상황에 쓰는 과장된 표현이에요."},
  {term:"牛",pinyin:"niú",meaning:"대단하다, 쩐다",category:"일상 용어",note:"원뜻은 소지만 채팅에서는 능력이나 결과가 훌륭하다는 칭찬이에요."},
  {term:"绝了",pinyin:"jué le",meaning:"끝내준다, 대박이다",category:"일상 용어",note:"감탄이나 어이없음을 나타낼 수 있어요."},
  {term:"666",pinyin:"liù liù liù",meaning:"잘한다, 멋지다, 대단해",category:"유행어",note:"六의 발음이 溜(능숙하다)와 비슷해 생긴 인터넷 표현이에요."},
  {term:"安排",pinyin:"ān pái",meaning:"오케이, 그렇게 하자",category:"일상 용어",note:"원래는 안배·安排하다라는 뜻. 채팅에서는 '콜', '접수'처럼 쓰이기도 해요."},
  {term:"躺平",pinyin:"tǎng píng",meaning:"아무것도 안 하고 쉬기, 현상 유지",category:"신조어",note:"과도한 경쟁과 노력에서 벗어나 최소한만 하겠다는 태도예요."},
  {term:"内卷",pinyin:"nèi juǎn",meaning:"과도한 경쟁, 소모적인 경쟁",category:"신조어",note:"다 같이 지나치게 경쟁하지만 실질적인 이득은 크지 않은 상황을 말해요."},
  {term:"有一说一",pinyin:"yǒu yī shuō yī",meaning:"솔직히 말해서",category:"일상 용어",note:"자기 의견을 솔직하게 말하겠다는 뜻으로 문장 앞에 자주 붙여요."},
  {term:"懂的都懂",pinyin:"dǒng de dōu dǒng",meaning:"아는 사람은 다 알지",category:"유행어",note:"굳이 자세히 설명하지 않아도 아는 사람은 안다는 의미예요."},
  {term:"dbq",pinyin:"duì bu qǐ",meaning:"미안해",category:"유행어",note:"对不起의 병음 첫 글자를 딴 줄임말이에요."},
  {term:"awsl",pinyin:"ā wǒ sǐ le",meaning:"귀여워서 죽겠다, 너무 좋아",category:"유행어",note:"啊我死了의 초성. 귀엽거나 설레는 것을 봤을 때 과장해서 표현해요."},
  {term:"汉堡包",pinyin:"hàn bǎo bāo",meaning:"햄버거",category:"일상 용어",note:"일반적인 음식 이름이에요. 신조어가 아니라 기본 중국어 어휘예요."}
];

let category = "유행어";
let saved = [];
let userWords = [];
try { saved = JSON.parse(localStorage.getItem("talkchina-saved") || "[]"); } catch {}
try { userWords = JSON.parse(localStorage.getItem("talkchina-user-words") || "[]"); } catch {}
const allWords = () => [...userWords, ...samples];
let translator = null;
let modelPromise = null;
let lastResult = null;
let modelState = "idle";

function toast(message) {
  const el = $("#toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.__talkchinaToastTimer);
  window.__talkchinaToastTimer = setTimeout(() => el.classList.remove("show"), 2500);
}
function esc(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));
}
function setStatus(message, good = true) {
  const label = $("#ai-status");
  const dot = $(".status-dot");
  if (label) label.textContent = message;
  if (dot) dot.style.background = good ? "#22c55e" : "#f59e0b";
}
function persist() {
  localStorage.setItem("talkchina-saved", JSON.stringify(saved));
}
function persistUserWords() {
  localStorage.setItem("talkchina-user-words", JSON.stringify(userWords));
}
function saveWord(item) {
  if (saved.some(x => x.term === item.term)) {
    toast("이미 저장된 표현이에요.");
    return;
  }
  saved.unshift(item);
  persist();
  renderSaved();
  toast("나의 단어장에 저장했어요.");
}
function renderSaved() {
  $("#saved-count").textContent = saved.length;
  $("#saved-total").textContent = `${saved.length}개 저장`;
  const box = $("#saved-list");
  if (!saved.length) {
    box.innerHTML = '<div class="saved-empty">♡<br><strong>아직 저장한 표현이 없어요.</strong><br>사전에서 표현을 저장하거나 직접 추가해 보세요.</div>';
    return;
  }
  box.innerHTML = saved.map((item, i) => `
    <div class="saved-item">
      <div class="saved-word-main"><strong>${esc(item.term)}</strong><p>${esc(item.meaning)}${item.pinyin ? " · " + esc(item.pinyin) : ""}</p>${item.note ? `<small>${esc(item.note)}</small>` : ""}</div>
      <div class="saved-word-actions">${item.userAdded ? `<button class="small-action" data-edit-word="${esc(item.term)}">수정</button>` : ""}<button class="small-action" data-remove="${i}">삭제</button></div>
    </div>`).join("");
  $$('[data-remove]').forEach(button => button.onclick = () => {
    const removed = saved.splice(Number(button.dataset.remove), 1)[0];
    if (removed?.userAdded) {
      userWords = userWords.filter(x => x.term !== removed.term);
      persistUserWords();
      renderDictionary($("#dictionary-search").value);
    }
    persist();
    renderSaved();
    toast("개인 단어장에서 삭제했어요.");
  });
  $$('[data-edit-word]').forEach(button => button.onclick = () => {
    const item = userWords.find(x => x.term === button.dataset.editWord);
    if (!item) return;
    $("#new-term").value = item.term;
    $("#new-pinyin").value = item.pinyin || "";
    $("#new-meaning").value = item.meaning;
    $("#new-category").value = item.category || "신조어";
    $("#new-note").value = item.note || "";
    switchTab("dictionary");
    $("#new-term").focus();
    toast("표현을 수정한 뒤 같은 버튼을 눌러 저장해 주세요.");
    $("#add-word-form").dataset.editing = item.term;
    $(".add-word-button").textContent = "수정 내용 저장";
  });
}
function renderDictionary(query = "") {
  const q = query.trim().toLowerCase();
  const list = allWords().filter(item =>
    item.category === category &&
    (!q || [item.term, item.pinyin, item.meaning, item.note].join(" ").toLowerCase().includes(q))
  );
  $("#dictionary-grid").innerHTML = list.length ? list.map(item => `
    <article class="word-card">
      <div class="word-top"><strong>${esc(item.term)}</strong><span class="word-tag">${esc(item.category)}</span></div>
      <div class="pinyin">${esc(item.pinyin || "병음 미입력")}</div>
      <div class="meaning">${esc(item.meaning)}</div>
      <div class="word-note">${esc(item.note || "")}</div>
      <div class="word-card-foot"><button class="small-action" data-save="${esc(item.term)}">♡ 저장</button></div>
    </article>`).join("") :
    '<div class="saved-empty" style="grid-column:1/-1">검색 결과가 없어요. 다른 단어로 검색해 보세요.</div>';
  $$('[data-save]').forEach(button => button.onclick = () => {
    const item = allWords().find(x => x.term === button.dataset.save);
    if (item) saveWord(item);
  });
}
function addOrUpdateWord(event) {
  event.preventDefault();
  const term = $("#new-term").value.trim();
  const pinyin = $("#new-pinyin").value.trim();
  const meaning = $("#new-meaning").value.trim();
  const selectedCategory = $("#new-category").value;
  const note = $("#new-note").value.trim();
  if (!term || !meaning) return toast("중국어 표현과 한국어 뜻을 입력해 주세요.");
  const form = $("#add-word-form");
  const editing = form.dataset.editing;
  const duplicate = allWords().some(x => x.term === term && x.term !== editing);
  if (duplicate) return toast("이미 사전에 있는 표현이에요.");
  const item = {term, pinyin, meaning, category:selectedCategory, note, userAdded:true};
  if (editing) {
    userWords = userWords.filter(x => x.term !== editing);
    saved = saved.map(x => x.userAdded && x.term === editing ? item : x);
    toast("개인 표현을 수정했어요.");
  } else {
    userWords.unshift(item);
    saved.unshift(item);
    toast("개인 단어장에 표현을 추가했어요.");
  }
  persistUserWords();
  persist();
  form.reset();
  delete form.dataset.editing;
  $(".add-word-button").textContent = "＋ 개인 단어장에 추가";
  $("#new-category").value = "신조어";
  category = selectedCategory;
  $$(".category").forEach(button => button.classList.toggle("active", button.dataset.category === category));
  renderDictionary($("#dictionary-search").value);
  renderSaved();
}

function switchTab(name) {
  $$(".tab").forEach(button => button.classList.toggle("active", button.dataset.tab === name));
  $$(".panel").forEach(panel => panel.classList.toggle("active", panel.id === `${name}-panel`));
  if (name === "saved") renderSaved();
  if (name === "dictionary") renderDictionary($("#dictionary-search").value);
}

function findExpressions(text) {
  const lower = text.toLowerCase();
  return allWords().filter(item => lower.includes(item.term.toLowerCase()));
}
function dictionaryFallback(text) {
  // 작은 기본 어휘표는 모델 로딩 실패 시에도 단어 수준의 참고 결과를 제공해요.
  const basic = [
    ["汉堡包", "햄버거"], ["汉堡", "햄버거"], ["你好", "안녕하세요"],
    ["谢谢", "고마워요"], ["再见", "안녕히 가세요"], ["我", "나/저"],
    ["你", "너/당신"], ["今天", "오늘"], ["喜欢", "좋아하다"],
    ["吃", "먹다"], ["喝", "마시다"], ["朋友", "친구"]
  ];
  const hits = basic.filter(([word]) => text.includes(word));
  if (!hits.length) return null;
  return hits.map(([word, meaning]) => `${word} → ${meaning}`).join("\n");
}
async function loadModel() {
  if (translator) return translator;
  if (modelPromise) return modelPromise;

  modelState = "loading";
  setStatus("번역 모델 준비 중", false);
  $("#result-card").innerHTML = `
    <div class="loading"><span class="spinner"></span>
      <span>무료 다국어 번역 모델을 준비하고 있어요.<br>첫 실행에는 약 900MB 안팎의 파일을 내려받을 수 있어요.</span>
    </div>`;

  modelPromise = (async () => {
    try {
      env.allowLocalModels = false;
      env.allowRemoteModels = true;
      translator = await pipeline(
        "translation",
        "Xenova/nllb-200-distilled-600M",
        {
          progress_callback: progress => {
            if (progress.status === "progress" && progress.total) {
              const percent = Math.round(progress.loaded / progress.total * 100);
              setStatus(`번역 모델 다운로드 ${percent}%`, false);
            } else if (progress.status === "downloading") {
              setStatus("번역 모델 다운로드 중", false);
            }
          }
        }
      );
      modelState = "ready";
      setStatus("기본 번역 사용 가능");
      return translator;
    } catch (error) {
      modelState = "failed";
      setStatus("기본 어휘 + 신조어 사전 모드", false);
      throw error;
    }
  })();

  try {
    return await modelPromise;
  } finally {
    modelPromise = null;
  }
}

function markup(result) {
  const expressions = (result.expressions || []).map(item => `
    <div class="expression">
      <div><strong>${esc(item.chinese)}</strong><p>${esc(item.pinyin || "")}</p></div>
      <span>${esc(item.meaning)}</span>
    </div>`).join("");
  const notes = result.notes?.length ? `
    <div class="result-block"><h4>📚 신조어·표현 설명</h4>
      ${result.notes.map(item => `<p><strong>${esc(item.term)}</strong> — ${esc(item.meaning)}<br>${esc(item.note)}</p>`).join("")}
    </div>` : "";
  return `
    <div class="result-content">
      <div class="result-label">✦ ${result.source === "browser-ai" ? "브라우저 기본 번역 결과" : "기본 어휘 참고 결과"}</div>
      <h3>${esc(result.translation).replace(/\n/g, "<br>")}</h3>
      ${notes}
      ${expressions ? `<div class="result-block"><h4>🔎 문장에 포함된 표현</h4>${expressions}</div>` : ""}
      <div class="result-block"><h4>💡 번역 안내</h4><p>${esc(result.context || "")}</p></div>
      <div class="result-actions">
        <button id="copy-translation">번역 복사</button>
        <button id="save-translation">♡ 표현 저장</button>
      </div>
      <p class="privacy-note">번역 모델은 브라우저에서 실행돼요. 입력 문장을 별도 번역 API로 보내지 않습니다.</p>
    </div>`;
}
async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    toast("복사했어요!");
  } catch {
    toast("복사는 HTTPS 환경에서 사용할 수 있어요.");
  }
}
function wireResult(original) {
  $("#copy-translation").onclick = () => copyText(lastResult.translation);
  $("#save-translation").onclick = () => saveWord({
    term: original,
    meaning: lastResult.translation,
    pinyin: "",
    category: "일상 용어"
  });
}
async function translate() {
  const text = $("#source-text").value.trim();
  if (!text) {
    toast("중국어 메시지를 먼저 입력해 주세요.");
    return;
  }

  const button = $("#translate-button");
  button.disabled = true;
  const expressions = findExpressions(text);
  const notes = expressions.map(item => ({
    term: item.term, meaning: item.meaning, note: item.note
  }));

  try {
    const model = await loadModel();
    // NLLB-200의 중국어 간체/한국어 언어 코드
    const output = await model(text, {
      src_lang: "zho_Hans",
      tgt_lang: "kor_Hang"
    });
    const translated = Array.isArray(output)
      ? output.map(item => item.translation_text || "").join("\n")
      : "";
    if (!translated.trim()) throw new Error("번역 결과가 비어 있어요.");

    lastResult = {
      translation: translated.trim(),
      notes,
      expressions: expressions.map(item => ({
        chinese: item.term, pinyin: item.pinyin, meaning: item.meaning
      })),
      context: notes.length
        ? "일반 문장은 기본 번역 모델로 번역하고, 사전에 등록된 신조어는 아래에 별도로 설명했어요. 신조어의 실제 뉘앙스는 대화 상황에 따라 달라질 수 있어요."
        : "중국어 문장을 한국어로 번역했어요. 고유명사나 구어체는 문맥에 따라 번역이 달라질 수 있어요.",
      source: "browser-ai"
    };
    $("#result-card").innerHTML = markup(lastResult);
    wireResult(text);
  } catch (error) {
    const fallback = dictionaryFallback(text);
    const explanation = notes.length
      ? notes.map(item => `${item.term}: ${item.meaning} — ${item.note}`).join("\n")
      : "";
    const combined = [fallback, explanation].filter(Boolean).join("\n\n");
    $("#result-card").innerHTML = `
      <div class="error-box">
        <strong>브라우저 번역 모델을 불러오지 못했어요.</strong><br>
        ${combined ? `<p style="white-space:pre-line">${esc(combined)}</p>` : ""}
        <p>이 문장은 전체 자동 번역을 완료하지 못했어요. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.</p>
        <small>${esc(error?.message || "모델 로딩 오류")}</small>
      </div>`;
    setStatus("번역 모델 연결 확인 필요", false);
  } finally {
    button.disabled = false;
  }
}

$$(".tab").forEach(button => button.onclick = () => switchTab(button.dataset.tab));
$("#source-text").addEventListener("input", event => {
  $("#char-count").textContent = `${event.target.value.length.toLocaleString()} / 1,200`;
});
$("#clear-input").onclick = () => {
  $("#source-text").value = "";
  $("#char-count").textContent = "0 / 1,200";
  $("#source-text").focus();
};
$("#sample-input").onclick = () => {
  $("#source-text").value = "笑死我了，你真的绝绝子！";
  $("#char-count").textContent = `${$("#source-text").value.length} / 1,200`;
};
$("#translate-button").onclick = translate;
$("#ask-dictionary").onclick = () => {
  const query = $("#dictionary-search").value.trim();
  if (!query) {
    toast("먼저 궁금한 표현을 입력해 주세요.");
    return;
  }
  switchTab("translate");
  $("#source-text").value = query;
  $("#char-count").textContent = `${query.length} / 1,200`;
  translate();
};
$("#dictionary-search-button").onclick = () => renderDictionary($("#dictionary-search").value);
$("#dictionary-search").onkeydown = event => {
  if (event.key === "Enter") renderDictionary(event.target.value);
};
$("#add-word-form").addEventListener("submit", addOrUpdateWord);
$$(".category").forEach(button => button.onclick = () => {
  category = button.dataset.category;
  $$(".category").forEach(item => item.classList.toggle("active", item === button));
  renderDictionary($("#dictionary-search").value);
});

renderDictionary();
renderSaved();
setStatus("무료 기본 번역 모델 대기 중", false);
