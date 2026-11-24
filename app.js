import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const samples = [
  {term:"yyds",pinyin:"yǒng yuǎn de shén",meaning:"영원한 신, 최고",category:"유행어",note:"永远的神의 병음 첫 글자를 딴 표현. 사람이나 작품을 극찬할 때 써요."},
  {term:"xswl",pinyin:"xiào sǐ wǒ le",meaning:"웃겨 죽겠어 ㅋㅋㅋ",category:"유행어",note:"笑死我了의 초성 줄임말. 재미있는 상황이나 농담에 반응할 때 사용해요."},
  {term:"绝绝子",pinyin:"jué jué zǐ",meaning:"완전 대박, 진짜 최고",category:"신조어",note:"아주 좋거나 인상적일 때 쓰는 유행 표현이에요. 문맥에 따라 반어적으로도 쓰여요."},
  {term:"无语",pinyin:"wú yǔ",meaning:"어이없네, 할 말이 없네",category:"일상용어",note:"황당하거나 답답해서 말문이 막힐 때 써요."},
  {term:"破防了",pinyin:"pò fáng le",meaning:"마음이 무너졌어, 감정이 흔들렸어",category:"신조어",note:"감동이나 상처를 받아 마음이 크게 움직였을 때 사용해요."},
  {term:"emo",pinyin:"ēi mō",meaning:"우울해, 감성에 잠겼어",category:"신조어",note:"기분이 가라앉거나 센치해진 상태를 가볍게 표현해요."},
  {term:"哈哈哈",pinyin:"hā hā hā",meaning:"ㅋㅋㅋㅋ, 하하하",category:"일상용어",note:"웃음을 표현해요."},
  {term:"笑死我了",pinyin:"xiào sǐ wǒ le",meaning:"아 진짜 웃겨 죽겠네",category:"일상용어",note:"친구 사이에서 매우 웃긴 상황에 쓰는 과장된 표현이에요."},
  {term:"牛",pinyin:"niú",meaning:"대단하다, 쩐다",category:"일상용어",note:"원뜻은 소지만 채팅에서는 능력이나 결과가 훌륭하다는 칭찬이에요."},
  {term:"绝了",pinyin:"jué le",meaning:"끝내준다, 대박이다",category:"일상용어",note:"감탄이나 어이없음을 나타낼 수 있어요."},
  {term:"666",pinyin:"liù liù liù",meaning:"잘한다, 멋지다, 대단해",category:"유행어",note:"六의 발음이 溜(능숙하다)와 비슷해 생긴 인터넷 표현이에요."},
  {term:"安排",pinyin:"ān pái",meaning:"오케이, 그렇게 하자",category:"일상용어",note:"원래는 안배·安排하다라는 뜻. 채팅에서는 '콜', '접수'처럼 쓰이기도 해요."},
  {term:"躺平",pinyin:"tǎng píng",meaning:"아무것도 안 하고 쉬기, 현상 유지",category:"신조어",note:"과도한 경쟁과 노력에서 벗어나 최소한만 하겠다는 태도예요."},
  {term:"内卷",pinyin:"nèi juǎn",meaning:"과도한 경쟁, 소모적인 경쟁",category:"신조어",note:"다 같이 지나치게 경쟁하지만 실질적인 이득은 크지 않은 상황을 말해요."},
  {term:"有一说一",pinyin:"yǒu yī shuō yī",meaning:"솔직히 말해서",category:"일상용어",note:"자기 의견을 솔직하게 말하겠다는 뜻으로 문장 앞에 자주 붙여요."},
  {term:"懂的都懂",pinyin:"dǒng de dōu dǒng",meaning:"아는 사람은 다 알지",category:"유행어",note:"굳이 자세히 설명하지 않아도 아는 사람은 안다는 의미예요."},
  {term:"dbq",pinyin:"duì bu qǐ",meaning:"미안해",category:"유행어",note:"对不起의 병음 첫 글자를 딴 줄임말이에요."},
  {term:"awsl",pinyin:"ā wǒ sǐ le",meaning:"귀여워서 죽겠다, 너무 좋아",category:"유행어",note:"啊我死了의 초성. 귀엽거나 설레는 것을 봤을 때 과장해서 표현해요."},
  {term:"汉堡包",pinyin:"hàn bǎo bāo",meaning:"햄버거",category:"일상용어",note:"일반적인 음식 이름이에요. 신조어가 아니라 기본 중국어 어휘예요."}
];

const EXTRA_SAMPLES = [
{term:"在吗",pinyin:"zài ma",meaning:"있어? / 지금 시간 돼?",category:"일상 회화",note:"상대가 온라인인지, 대화 가능한지 가볍게 물을 때 써요."},
{term:"干嘛呢",pinyin:"gàn má ne",meaning:"뭐 해?",category:"일상 회화",note:"친구에게 지금 무엇을 하는지 자연스럽게 물어요."},
{term:"在干嘛",pinyin:"zài gàn má",meaning:"뭐 하고 있어?",category:"일상 회화",note:"干嘛呢와 비슷한 편한 구어체예요."},
{term:"吃了吗",pinyin:"chī le ma",meaning:"밥 먹었어?",category:"일상 회화",note:"식사 여부를 묻는 말이자 친근한 안부 인사로도 써요."},
{term:"到家了吗",pinyin:"dào jiā le ma",meaning:"집에 도착했어?",category:"일상 회화",note:"상대가 안전하게 귀가했는지 확인할 때 써요."},
{term:"我到了",pinyin:"wǒ dào le",meaning:"나 도착했어",category:"일상 회화",note:"약속 장소에 도착했음을 알리는 표현이에요."},
{term:"马上到",pinyin:"mǎ shàng dào",meaning:"곧 도착해",category:"일상 회화",note:"이동 중이며 곧 도착한다고 말해요."},
{term:"等我一下",pinyin:"děng wǒ yí xià",meaning:"잠깐만 기다려 줘",category:"일상 회화",note:"상대에게 잠시 기다려 달라고 할 때 써요."},
{term:"稍等",pinyin:"shāo děng",meaning:"잠시만",category:"일상 회화",note:"짧고 자연스럽게 기다려 달라고 할 때 써요."},
{term:"改天约",pinyin:"gǎi tiān yuē",meaning:"다음에 날짜 잡아서 만나자",category:"일상 회화",note:"오늘은 어렵지만 다음에 만나자는 뜻이에요."},
{term:"有空吗",pinyin:"yǒu kòng ma",meaning:"시간 있어?",category:"일상 회화",note:"통화·만남·부탁 전에 상대의 시간을 물어요."},
{term:"回头聊",pinyin:"huí tóu liáo",meaning:"나중에 얘기하자",category:"일상 회화",note:"대화를 잠시 마무리할 때 써요."},
{term:"先这样",pinyin:"xiān zhèyàng",meaning:"일단 이만하자 / 우선 이렇게 하자",category:"일상 회화",note:"대화나 일을 일단 마무리하는 표현이에요."},
{term:"我先撤了",pinyin:"wǒ xiān chè le",meaning:"나 먼저 갈게 / 먼저 빠질게",category:"일상 회화",note:"친구 사이에서 먼저 자리를 뜨거나 채팅을 나갈 때 써요."},
{term:"你忙你的",pinyin:"nǐ máng nǐ de",meaning:"너 하던 일 해 / 네 일 봐",category:"일상 회화",note:"상대가 바쁠 때 부담 갖지 말라는 뜻으로 써요."},
{term:"没事",pinyin:"méi shì",meaning:"괜찮아 / 별일 아니야",category:"일상 회화",note:"사과에 대한 답이나 걱정하지 말라는 말로 두루 써요."},
{term:"没关系",pinyin:"méi guān xi",meaning:"괜찮아 / 신경 쓰지 마",category:"일상 회화",note:"사과를 받아주거나 문제가 없다고 할 때 써요."},
{term:"辛苦了",pinyin:"xīn kǔ le",meaning:"고생했어 / 수고했어",category:"일상 회화",note:"상대의 수고를 인정하고 고마움을 전해요."},
{term:"麻烦你了",pinyin:"má fan nǐ le",meaning:"번거롭게 해서 미안해 / 부탁할게",category:"일상 회화",note:"부탁을 하거나 상대가 수고해 줄 때 예의 있게 써요."},
{term:"收到",pinyin:"shōu dào",meaning:"확인했어 / 받았어",category:"일상 회화",note:"메시지나 파일을 확인했다는 짧은 답장이에요."},
{term:"知道了",pinyin:"zhī dào le",meaning:"알겠어",category:"일상 회화",note:"상대의 말을 이해했다는 뜻이에요. 말투에 따라 퉁명스럽게 들릴 수도 있어요."},
{term:"好呀",pinyin:"hǎo ya",meaning:"좋아 / 그래",category:"일상 회화",note:"친근하고 부드럽게 동의할 때 써요."},
{term:"可以啊",pinyin:"kě yǐ a",meaning:"좋지 / 가능하지",category:"일상 회화",note:"제안이나 부탁을 흔쾌히 받아들일 때 써요."},
{term:"行吧",pinyin:"xíng ba",meaning:"그래, 알겠어",category:"일상 회화",note:"동의하거나 마지못해 받아들이는 느낌일 수 있어요."},
{term:"随便",pinyin:"suí biàn",meaning:"아무거나 / 마음대로",category:"일상 회화",note:"선택에 신경 쓰지 않는다는 뜻이지만 말투에 따라 무심하게 들려요."},
{term:"真的假的",pinyin:"zhēn de jiǎ de",meaning:"진짜야?",category:"일상 회화",note:"놀라거나 믿기 어려울 때 쓰는 반응이에요."},
{term:"不会吧",pinyin:"bú huì ba",meaning:"설마 / 말도 안 돼",category:"일상 회화",note:"놀람이나 의심을 나타내요."},
{term:"怎么啦",pinyin:"zěn me la",meaning:"왜 그래? / 무슨 일이야?",category:"일상 회화",note:"상대의 상태나 상황을 부드럽게 물어요."},
{term:"没事吧",pinyin:"méi shì ba",meaning:"괜찮아?",category:"일상 회화",note:"상대에게 문제가 없는지 걱정하며 물어요."},
{term:"别急",pinyin:"bié jí",meaning:"서두르지 마 / 진정해",category:"일상 회화",note:"상대에게 급하게 생각하지 말라고 안심시켜요."},
{term:"我懂你",pinyin:"wǒ dǒng nǐ",meaning:"네 마음 알아",category:"일상 회화",note:"상대의 감정이나 상황에 공감할 때 써요."},
{term:"我也是",pinyin:"wǒ yě shì",meaning:"나도 그래",category:"일상 회화",note:"상대의 말에 공감하거나 같은 상황임을 말해요."},
{term:"看情况",pinyin:"kàn qíng kuàng",meaning:"상황 봐서",category:"일상 회화",note:"아직 확답하기 어려울 때 자연스럽게 써요."},
{term:"再说吧",pinyin:"zài shuō ba",meaning:"나중에 얘기하자 / 그때 가서 보자",category:"일상 회화",note:"결정을 미루거나 확답을 피할 때 써요."},
{term:"我请你",pinyin:"wǒ qǐng nǐ",meaning:"내가 살게 / 내가 대접할게",category:"일상 회화",note:"식사나 음료 등을 자신이 사겠다고 할 때 써요."},
{term:"下次见",pinyin:"xià cì jiàn",meaning:"다음에 보자",category:"일상 회화",note:"헤어질 때 쓰는 자연스러운 인사예요."},
{term:"晚安啦",pinyin:"wǎn ān la",meaning:"잘 자",category:"일상 회화",note:"친근하고 부드러운 밤 인사예요."},
{term:"笑不活了",pinyin:"xiào bù huó le",meaning:"웃겨서 못 살겠어 ㅋㅋㅋ",category:"감정·반응",note:"笑死我了와 비슷한 과장된 웃음 표현이에요."},
{term:"我真的会谢",pinyin:"wǒ zhēn de huì xiè",meaning:"아 진짜 어이없네 / 진짜 고맙다(반어 가능)",category:"감정·반응",note:"짜증·황당함을 과장해 표현해요. 문맥과 말투에 따라 진짜 감사일 수도 있어요."},
{term:"救命",pinyin:"jiù mìng",meaning:"살려 줘 / 아 진짜",category:"감정·반응",note:"놀람·당황·웃김·귀여움 등 강한 감정을 과장해 표현해요."},
{term:"我哭死",pinyin:"wǒ kū sǐ",meaning:"나 울어 ㅠㅠ / 너무 감동이야",category:"감정·반응",note:"감동·슬픔·귀여움 등으로 감정이 벅찰 때 과장해서 써요."},
{term:"好家伙",pinyin:"hǎo jiā huo",meaning:"와, 대박 / 어라, 이건 또 뭐야",category:"감정·반응",note:"놀람이나 어이없음을 나타내며 뒤에 상황에 대한 평가가 이어질 수 있어요."},
{term:"离谱",pinyin:"lí pǔ",meaning:"말도 안 돼 / 너무 황당해",category:"감정·반응",note:"상황이 상식이나 예상에서 크게 벗어났을 때 써요."},
{term:"服了",pinyin:"fú le",meaning:"졌다, 인정 / 아 진짜 어이없네",category:"감정·반응",note:"감탄·인정·짜증 모두 가능해 문맥이 중요해요."},
{term:"有点东西",pinyin:"yǒu diǎn dōng xi",meaning:"좀 하는데? / 실력 있네",category:"감정·반응",note:"상대의 실력이나 결과가 생각보다 좋을 때 칭찬해요."},
{term:"还得是你",pinyin:"hái děi shì nǐ",meaning:"역시 너야",category:"감정·반응",note:"상대의 능력이나 행동을 칭찬할 때 써요."},
{term:"安排上了",pinyin:"ān pái shàng le",meaning:"준비 완료 / 진행하기로 했어",category:"감정·반응",note:"약속·구매·계획 등을 실제로 진행하기로 했다는 말이에요."},
{term:"懂了懂了",pinyin:"dǒng le dǒng le",meaning:"알았어 알았어",category:"감정·반응",note:"이해했다는 뜻이며 반복으로 친근함이나 재촉받는 느낌을 나타낼 수 있어요."},
{term:"无所谓",pinyin:"wú suǒ wèi",meaning:"상관없어 / 아무래도 좋아",category:"감정·반응",note:"선택에 개의치 않는다는 뜻이에요. 말투에 따라 무관심하게 들릴 수 있어요."},
{term:"真的假的啊",pinyin:"zhēn de jiǎ de a",meaning:"진짜라고?",category:"감정·반응",note:"真的假的보다 놀람을 더 드러내는 구어체예요."},
{term:"太离谱了",pinyin:"tài lí pǔ le",meaning:"너무 황당해",category:"감정·반응",note:"상황이나 행동이 지나치게 이상할 때 써요."},
{term:"笑死",pinyin:"xiào sǐ",meaning:"웃겨 죽겠네",category:"감정·반응",note:"笑死我了의 짧은 채팅형 표현이에요."},
{term:"哈哈哈哈哈",pinyin:"hā hā hā hā hā",meaning:"ㅋㅋㅋㅋㅋㅋ",category:"감정·반응",note:"웃음을 길게 표현해요. 반복 글자 수와 말투에 따라 느낌이 달라져요."},
{term:"啊这",pinyin:"a zhè",meaning:"어… 이건… / 음…",category:"감정·반응",note:"당황하거나 할 말을 잃었을 때 쓰는 짧은 반응이에요."},
{term:"绷不住",pinyin:"běng bú zhù",meaning:"못 참겠어 / 웃음·감정을 참을 수 없어",category:"감정·반응",note:"웃음이나 감정이 터질 것 같은 상황에 써요."},
{term:"敬自己一杯",pinyin:"jìng zì jǐ yì bēi",meaning:"나 자신에게 건배 / 고생한 나를 격려하자",category:"신조어",note:"2025년 연간 인터넷 유행어 목록에 오른 표현이에요. 자신을 위로하거나 응원할 때 써요."},
{term:"助我破鼎",pinyin:"zhù wǒ pò dǐng",meaning:"내가 한계를 깨도록 도와줘",category:"신조어",note:"2025년 연간 유행어 목록에 오른 밈 표현이에요. 원래 유행 맥락을 모르면 의미가 불투명할 수 있어요."},
{term:"如何呢又能怎",pinyin:"rú hé ne yòu néng zěn",meaning:"그래서 어쩌라고? 그게 뭐 어때서?",category:"신조어",note:"타인의 평가에 흔들리지 않겠다는 태도를 드러내는 밈 문구예요."},
{term:"××基础××不基础",pinyin:"jī chǔ bù jī chǔ",meaning:"기본이라더니 전혀 기본이 아닌 수준",category:"신조어",note:"예상보다 높은 수준이나 난도를 과장하는 패턴형 유행어예요."},
{term:"千百次练习只为这一刻",pinyin:"qiān bǎi cì liàn xí zhǐ wèi zhè yí kè",meaning:"수없이 연습한 건 바로 이 순간을 위해서",category:"신조어",note:"오랜 준비 끝에 중요한 순간을 맞는 상황에 쓰는 문구예요."},
{term:"村咖",pinyin:"cūn kā",meaning:"시골·마을의 개성 있는 카페",category:"신조어",note:"도시 외곽이나 마을의 로컬 감성을 즐기는 카페를 가리켜요."},
{term:"来财",pinyin:"lái cái",meaning:"돈 들어와라 / 재물운 들어와라",category:"신조어",note:"돈과 행운을 바라는 장난스럽고 긍정적인 표현이에요."},
{term:"浪浪山小妖怪",pinyin:"làng làng shān xiǎo yāo guài",meaning:"평범한 작은 존재들의 고군분투를 빗댄 표현",category:"신조어",note:"작품 제목에서 비롯된 표현으로 평범한 사람의 고단한 삶을 비유할 수 있어요."},
{term:"赛博对账",pinyin:"sài bó duì zhàng",meaning:"온라인에서 서로의 지출·월급·생활비를 비교하기",category:"신조어",note:"온라인 이용자들이 생활비·가격·소득 등을 공유하고 비교하는 현상을 말해요."},
{term:"预制朋友圈",pinyin:"yù zhì péng yǒu quān",meaning:"미리 연출해 둔 듯한 SNS 게시물",category:"신조어",note:"预制×× 패턴의 응용 표현이에요. 모든 문맥에서 고정된 유행어인 것은 아니에요."},
{term:"谷子",pinyin:"gǔ zi",meaning:"애니·게임·아이돌 관련 굿즈",category:"신조어",note:"영어 goods의 음역에서 온 팬덤·굿즈 업계 표현이에요."},
{term:"爱你老己",pinyin:"ài nǐ lǎo jǐ",meaning:"나 자신아 사랑해 / 내 자신을 아껴 주자",category:"신조어",note:"自己를 老己로 바꾼 장난스러운 표현으로 자기 위로·셀프 케어에 써요."},
{term:"手搓",pinyin:"shǒu cuō",meaning:"직접 손으로 만들다 / 맨땅에서 직접 구현하다",category:"신조어",note:"AI나 자동화 도구에 맡기지 않고 직접 제작·구현했다는 맥락에서 자주 보여요."},
{term:"从夯到拉",pinyin:"cóng hāng dào lā",meaning:"최상급부터 최악까지 등급을 매기다",category:"신조어",note:"夯(최고)부터 拉(별로)까지 평가하는 밈 형식이에요."},
{term:"夯",pinyin:"hāng",meaning:"최고다, 아주 좋다",category:"신조어",note:"2026년 온라인 평가 밈에서 최상급 의미로 쓰이는 표현이에요. 일반 문장에서는 원래 뜻이 달라요."},
{term:"拉完了",pinyin:"lā wán le",meaning:"완전히 별로다 / 망했다",category:"신조어",note:"평가 밈에서 매우 낮은 수준을 말하는 표현이에요."},
{term:"邪修",pinyin:"xié xiū",meaning:"정석이 아닌 기상천외한 방법으로 해결하기",category:"신조어",note:"요리·생활·작업을 엉뚱한 방식으로 하지만 의외로 성공할 때 써요."},
{term:"已读乱回",pinyin:"yǐ dú luàn huí",meaning:"읽고도 엉뚱한 답장을 하다",category:"신조어",note:"已读不回(읽씹)를 비튼 표현으로, 메시지를 읽고도 맥락과 안 맞게 답하는 상황이에요."},
{term:"活人微死",pinyin:"huó rén wēi sǐ",meaning:"살아는 있지만 영혼은 거의 방전된 상태",category:"신조어",note:"일상은 수행하지만 피곤하고 무기력한 상태를 자조적으로 표현해요."},
{term:"淡人",pinyin:"dàn rén",meaning:"감정 기복이 적고 담담한 사람",category:"신조어",note:"과하게 흥분하거나 화내지 않는 차분한 성향을 말해요."},
{term:"浓人",pinyin:"nóng rén",meaning:"감정 표현이 풍부하고 에너지가 강한 사람",category:"신조어",note:"淡人과 대비되는 표현으로 감정·반응이 큰 성향을 말해요."},
{term:"外耗",pinyin:"wài hào",meaning:"스트레스를 혼자 삭이지 않고 밖으로 돌려보내다",category:"신조어",note:"内耗를 비튼 표현으로, 남의 무리한 요구나 행동에 선을 긋는 맥락에서 써요."},
{term:"红温",pinyin:"hóng wēn",meaning:"열받다, 얼굴이 달아오를 만큼 화나다",category:"신조어",note:"게임·인터넷에서 시작해 화나거나 당황해 흥분한 상태를 표현해요."},
{term:"搞抽象",pinyin:"gǎo chōu xiàng",meaning:"일부러 황당하고 엉뚱한 짓을 하다",category:"신조어",note:"정상적인 논리보다 기괴하고 뜬금없는 웃음을 노리는 행동·콘텐츠를 말해요."},
{term:"抽象",pinyin:"chōu xiàng",meaning:"황당하고 기묘해서 웃긴",category:"신조어",note:"온라인에서는 일부러 맥락을 비틀거나 기상천외한 유머를 뜻해요."},
{term:"听劝",pinyin:"tīng quàn",meaning:"남의 조언을 받아들이다",category:"신조어",note:"댓글이나 친구의 조언을 실제로 따라 해 보겠다는 뜻으로 써요."},
{term:"包的",pinyin:"bāo de",meaning:"당연하지 / 확실하지 / 맡겨 둬",category:"신조어",note:"친구 사이에서 자신 있게 약속하거나 확답할 때 쓰는 구어 표현이에요."},
{term:"误闯天家",pinyin:"wù chuǎng tiān jiā",meaning:"내가 있을 곳이 아닌 엄청난 곳에 잘못 들어온 느낌",category:"신조어",note:"과하게 고급스럽거나 압도적인 공간·상황에 들어갔을 때 쓰는 과장 밈이에요."},
{term:"悬着的心终于死了",pinyin:"xuán zhe de xīn zhōng yú sǐ le",meaning:"조마조마하던 마음이 결국 체념했다",category:"신조어",note:"걱정하던 일이 최악으로 끝났거나 긴장 끝에 체념했을 때 쓰는 과장 문구예요."},
{term:"不语，只是一味地",pinyin:"bù yǔ, zhǐ shì yí wèi de",meaning:"말은 안 하고 그저 계속 ~만 한다",category:"신조어",note:"뒤에 행동을 붙여 특정 행동을 과장하거나 우스꽝스럽게 묘사해요."},
{term:"这河里吗",pinyin:"zhè hé lǐ ma",meaning:"이게 말이 돼? / 이게 합리적이야?",category:"신조어",note:"这合理吗를 비튼 말장난 표현이에요."},
{term:"高雅人士",pinyin:"gāo yǎ rén shì",meaning:"고상한 취향을 가진 사람(대개 농담·반어)",category:"신조어",note:"자신의 취향이나 행동을 과장해 점잖게 포장하는 농담에 쓰여요."},
{term:"牛来",pinyin:"niú lái",meaning:"牛市要来(상승장이 온다)를 연상시키는 밈",category:"신조어",note:"2026년 특정 영상·주식 관련 온라인 밈으로 소개된 표현이에요. 일반 위챗 회화의 보편 표현으로 단정하지 않아요."},
{term:"梁圣",pinyin:"liáng shèng",meaning:"특정 인물·사건에서 파생된 별칭 밈",category:"신조어",note:"특정 온라인 사건에 의존하는 밈이므로 이름·문맥 확인이 필요해요."},
{term:"牢梁",pinyin:"láo liáng",meaning:"梁圣에서 파생된 말장난 별칭",category:"신조어",note:"牢와 老의 발음 유사성을 이용한 특정 인물 밈이에요."},
{term:"痛文化",pinyin:"tòng wén huà",meaning:"아픔·고통을 드러내고 공유하는 문화",category:"신조어",note:"샤오홍슈 트렌드 분석에서 소개된 문화 키워드로, 일상 채팅 은어와는 구분해야 해요."},
{term:"主体性",pinyin:"zhǔ tǐ xìng",meaning:"주체성, 자기 삶의 결정권",category:"신조어",note:"자기 선택과 기준을 중시하는 태도를 설명할 때 쓰는 말이에요."},
{term:"边界感",pinyin:"biān jiè gǎn",meaning:"관계에서 지켜야 할 선과 거리감",category:"신조어",note:"사생활·감정·시간의 경계를 존중하는 태도를 말해요."},
{term:"反精致",pinyin:"fǎn jīng zhì",meaning:"지나치게 꾸미고 완벽하게 보이려는 태도에 반대함",category:"신조어",note:"꾸밈과 연출보다 자연스러움·실용성을 중시하는 흐름을 말해요."},
{term:"AI人格",pinyin:"AI rén gé",meaning:"AI와 관련해 만들어진 캐릭터·성격 설정",category:"신조어",note:"AI 대화·콘텐츠 맥락에서 쓰이는 표현으로 일반적인 성격 진단 용어는 아니에요."},
{term:"柔软力",pinyin:"róu ruǎn lì",meaning:"유연하고 부드럽게 대처하는 힘",category:"신조어",note:"강함보다 유연함·공감·회복력을 강조하는 맥락에서 쓰여요."},
{term:"代入感",pinyin:"dài rù gǎn",meaning:"몰입감, 감정이입",category:"신조어",note:"콘텐츠나 상황에 자신을 대입해 느끼는 감정을 말해요."},
{term:"文化力",pinyin:"wén huà lì",meaning:"문화적 영향력·문화 역량",category:"신조어",note:"브랜드·지역·콘텐츠의 문화적 매력을 설명하는 말이에요."}
];
samples.push(...EXTRA_SAMPLES);

let category = "전체";
let saved = [];
let userWords = [];
try { saved = JSON.parse(localStorage.getItem("talkchina-saved") || "[]"); } catch {}
try { userWords = JSON.parse(localStorage.getItem("talkchina-user-words") || "[]"); } catch {}
// 이전 버전의 분류명과 호환되도록 공백이 포함된 값을 새 분류명으로 정리합니다.
const normalizeCategory = item => ({
  ...item,
  category: ["일상 용어", "일상 회화", "감정·반응"].includes(item.category)
    ? "일상용어"
    : (item.category || "신조어")
});
saved = saved.map(normalizeCategory);
userWords = userWords.map(normalizeCategory);
const allWords = () => [...userWords, ...samples];
// 정리된 분류명을 브라우저 저장소에도 반영합니다.
localStorage.setItem("talkchina-saved", JSON.stringify(saved));
localStorage.setItem("talkchina-user-words", JSON.stringify(userWords));
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
    switchTab("saved");
    $("#new-term").focus();
    toast("표현을 수정한 뒤 저장 버튼을 눌러 주세요.");
    $("#add-word-form").dataset.editing = item.term;
    $(".add-word-button").textContent = "수정 내용 저장";
  });
}
function renderDictionary(query = "") {
  const q = query.trim().toLowerCase();
  const list = allWords().filter(item =>
    (category === "전체" || item.category === category) &&
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
    category: "일상용어"
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
