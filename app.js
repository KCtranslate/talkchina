import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const samples = [
  {term:"yyds",pinyin:"yǒng yuǎn de shén",meaning:"영원한 신, 최고",category:"줄임말",note:"永远的神의 병음 첫 글자를 딴 표현. 사람이나 작품을 극찬할 때 써요."},
  {term:"xswl",pinyin:"xiào sǐ wǒ le",meaning:"웃겨 죽겠어 ㅋㅋㅋ",category:"줄임말",note:"笑死我了의 초성 줄임말. 재미있는 상황이나 농담에 반응할 때 사용해요."},
  {term:"绝绝子",pinyin:"jué jué zǐ",meaning:"완전 대박, 진짜 최고",category:"신조어",note:"아주 좋거나 인상적일 때 쓰는 유행 표현이에요. 문맥에 따라 반어적으로도 쓰여요."},
  {term:"无语",pinyin:"wú yǔ",meaning:"어이없네, 할 말이 없네",category:"감정·반응",note:"황당하거나 답답해서 말문이 막힐 때 써요."},
  {term:"破防了",pinyin:"pò fáng le",meaning:"마음이 무너졌어, 감정이 흔들렸어",category:"신조어",note:"감동이나 상처를 받아 마음이 크게 움직였을 때 사용해요."},
  {term:"emo",pinyin:"ēi mō",meaning:"우울해, 감성에 잠겼어",category:"신조어",note:"기분이 가라앉거나 센치해진 상태를 가볍게 표현해요."},
  {term:"哈哈哈",pinyin:"hā hā hā",meaning:"ㅋㅋㅋㅋ, 하하하",category:"일상 회화",note:"웃음을 표현해요."},
  {term:"笑死我了",pinyin:"xiào sǐ wǒ le",meaning:"아 진짜 웃겨 죽겠네",category:"일상 회화",note:"친구 사이에서 매우 웃긴 상황에 쓰는 과장된 표현이에요."},
  {term:"牛",pinyin:"niú",meaning:"대단하다, 쩐다",category:"일상 회화",note:"원뜻은 소지만 채팅에서는 능력이나 결과가 훌륭하다는 칭찬이에요."},
  {term:"绝了",pinyin:"jué le",meaning:"끝내준다, 대박이다",category:"감정·반응",note:"감탄이나 어이없음을 나타낼 수 있어요."},
  {term:"666",pinyin:"liù liù liù",meaning:"잘한다, 멋지다, 대단해",category:"줄임말",note:"六의 발음이 溜(능숙하다)와 비슷해 생긴 인터넷 표현이에요."},
  {term:"安排",pinyin:"ān pái",meaning:"오케이, 그렇게 하자",category:"일상 회화",note:"원래는 안배·安排하다라는 뜻. 채팅에서는 '콜', '접수'처럼 쓰이기도 해요."},
  {term:"躺平",pinyin:"tǎng píng",meaning:"아무것도 안 하고 쉬기, 현상 유지",category:"신조어",note:"과도한 경쟁과 노력에서 벗어나 최소한만 하겠다는 태도예요."},
  {term:"内卷",pinyin:"nèi juǎn",meaning:"과도한 경쟁, 소모적인 경쟁",category:"신조어",note:"다 같이 지나치게 경쟁하지만 실질적인 이득은 크지 않은 상황을 말해요."},
  {term:"有一说一",pinyin:"yǒu yī shuō yī",meaning:"솔직히 말해서",category:"일상 회화",note:"자기 의견을 솔직하게 말하겠다는 뜻으로 문장 앞에 자주 붙여요."},
  {term:"懂的都懂",pinyin:"dǒng de dōu dǒng",meaning:"아는 사람은 다 알지",category:"줄임말",note:"굳이 자세히 설명하지 않아도 아는 사람은 안다는 의미예요."},
  {term:"dbq",pinyin:"duì bu qǐ",meaning:"미안해",category:"줄임말",note:"对不起의 병음 첫 글자를 딴 줄임말이에요."},
  {term:"awsl",pinyin:"ā wǒ sǐ le",meaning:"귀여워서 죽겠다, 너무 좋아",category:"줄임말",note:"啊我死了의 초성. 귀엽거나 설레는 것을 봤을 때 과장해서 표현해요."},
  {term:"汉堡包",pinyin:"hàn bǎo bāo",meaning:"햄버거",category:"일상 회화",note:"일반적인 음식 이름이에요. 신조어가 아니라 기본 중국어 어휘예요."},
    // 위챗 일상 회화 36개
  {term:"在吗",pinyin:"zài ma",meaning:"있어?",category:"위챗 일상",note:"친구에게 말을 걸기 전에 자주 보내는 표현이에요."},
  {term:"干嘛呢",pinyin:"gàn ma ne",meaning:"뭐 해?",category:"위챗 일상",note:"친구 사이에서 편하게 안부를 물을 때 사용해요."},
  {term:"吃了吗",pinyin:"chī le ma",meaning:"밥 먹었어?",category:"위챗 일상",note:"식사 여부를 묻는 친근한 인사예요."},
  {term:"到家了吗",pinyin:"dào jiā le ma",meaning:"집에 도착했어?",category:"위챗 일상",note:"상대방이 무사히 귀가했는지 물을 때 사용해요."},
  {term:"我到了",pinyin:"wǒ dào le",meaning:"나 도착했어",category:"위챗 일상",note:"약속 장소에 도착했을 때 보내는 메시지예요."},
  {term:"马上到",pinyin:"mǎ shàng dào",meaning:"곧 도착해",category:"위챗 일상",note:"이동 중이며 곧 도착한다는 뜻이에요."},
  {term:"等我一下",pinyin:"děng wǒ yí xià",meaning:"나 잠깐만 기다려",category:"위챗 일상",note:"잠시 기다려 달라고 부탁할 때 사용해요."},
  {term:"稍等",pinyin:"shāo děng",meaning:"잠시만 기다려",category:"위챗 일상",note:"조금만 기다려 달라는 간단한 표현이에요."},
  {term:"改天约",pinyin:"gǎi tiān yuē",meaning:"다음에 약속 잡자",category:"위챗 일상",note:"다른 날 만나자는 의미로 사용해요."},
  {term:"有空吗",pinyin:"yǒu kòng ma",meaning:"시간 있어?",category:"위챗 일상",note:"상대방의 일정이나 여유 시간을 물을 때 사용해요."},
  {term:"回头聊",pinyin:"huí tóu liáo",meaning:"나중에 이야기하자",category:"위챗 일상",note:"대화를 잠시 마무리할 때 사용해요."},
  {term:"先这样",pinyin:"xiān zhè yàng",meaning:"일단 이쯤 하자",category:"위챗 일상",note:"대화를 마무리하거나 상황을 정리할 때 사용해요."},
  {term:"我先撤了",pinyin:"wǒ xiān chè le",meaning:"나 먼저 갈게",category:"위챗 일상",note:"친구와의 대화나 모임에서 먼저 떠날 때 사용해요."},
  {term:"你忙你的",pinyin:"nǐ máng nǐ de",meaning:"너 하던 일 해",category:"위챗 일상",note:"상대방에게 신경 쓰지 말고 하던 일을 하라는 뜻이에요."},
  {term:"没事",pinyin:"méi shì",meaning:"괜찮아, 별일 아니야",category:"위챗 일상",note:"상대방을 안심시키거나 괜찮다고 답할 때 사용해요."},
  {term:"没关系",pinyin:"méi guān xi",meaning:"괜찮아, 신경 쓰지 마",category:"위챗 일상",note:"사과를 받았을 때 괜찮다고 답하는 표현이에요."},
  {term:"辛苦了",pinyin:"xīn kǔ le",meaning:"수고했어",category:"위챗 일상",note:"상대방의 노력이나 고생을 인정할 때 사용해요."},
  {term:"麻烦你了",pinyin:"má fan nǐ le",meaning:"번거롭게 해서 미안해",category:"위챗 일상",note:"부탁을 하거나 도움을 받았을 때 사용해요."},
  {term:"收到",pinyin:"shōu dào",meaning:"확인했어, 받았어",category:"위챗 일상",note:"메시지나 전달 사항을 확인했다는 뜻이에요."},
  {term:"知道了",pinyin:"zhī dào le",meaning:"알겠어",category:"위챗 일상",note:"상대방의 말을 이해했다는 뜻이에요."},
  {term:"好呀",pinyin:"hǎo ya",meaning:"좋아!",category:"위챗 일상",note:"친근하고 긍정적으로 동의할 때 사용해요."},
  {term:"可以啊",pinyin:"kě yǐ a",meaning:"좋지, 괜찮아",category:"위챗 일상",note:"제안이나 부탁에 긍정적으로 답할 때 사용해요."},
  {term:"行吧",pinyin:"xíng ba",meaning:"그래, 알겠어",category:"위챗 일상",note:"상황에 따라 마지못해 동의하는 뉘앙스도 있어요."},
  {term:"随便",pinyin:"suí biàn",meaning:"아무거나, 마음대로",category:"위챗 일상",note:"선택을 상대방에게 맡길 때 사용하지만 말투에 따라 무심하게 들릴 수 있어요."},
  {term:"真的假的",pinyin:"zhēn de jiǎ de",meaning:"진짜야? 정말?",category:"위챗 일상",note:"상대방의 말에 놀라거나 믿기 어려울 때 사용해요."},
  {term:"不会吧",pinyin:"bú huì ba",meaning:"설마, 말도 안 돼",category:"위챗 일상",note:"놀라거나 믿기 어려운 상황에서 사용해요."},
  {term:"怎么啦",pinyin:"zěn me la",meaning:"왜 그래?",category:"위챗 일상",note:"상대방에게 무슨 일이 있는지 물을 때 사용해요."},
  {term:"没事吧",pinyin:"méi shì ba",meaning:"괜찮아?",category:"위챗 일상",note:"상대방의 상태를 걱정하며 물어보는 표현이에요."},
  {term:"别急",pinyin:"bié jí",meaning:"서두르지 마, 진정해",category:"위챗 일상",note:"상대방을 안심시키거나 재촉하지 않을 때 사용해요."},
  {term:"我懂你",pinyin:"wǒ dǒng nǐ",meaning:"네 마음 이해해",category:"위챗 일상",note:"상대방의 감정이나 입장에 공감할 때 사용해요."},
  {term:"我也是",pinyin:"wǒ yě shì",meaning:"나도 그래",category:"위챗 일상",note:"상대방의 말에 공감하거나 동의할 때 사용해요."},
  {term:"看情况",pinyin:"kàn qíng kuàng",meaning:"상황 봐서",category:"위챗 일상",note:"아직 결정하지 않았을 때 사용하는 표현이에요."},
  {term:"再说吧",pinyin:"zài shuō ba",meaning:"나중에 다시 이야기하자",category:"위챗 일상",note:"결정을 미루거나 대화를 마무리할 때 사용해요."},
  {term:"我请你",pinyin:"wǒ qǐng nǐ",meaning:"내가 살게",category:"위챗 일상",note:"식사나 음료 등을 사주겠다는 뜻이에요."},
  {term:"下次见",pinyin:"xià cì jiàn",meaning:"다음에 보자",category:"위챗 일상",note:"헤어질 때 사용하는 친근한 인사예요."},
  {term:"晚安啦",pinyin:"wǎn ān la",meaning:"잘 자~",category:"위챗 일상",note:"친근하고 부드럽게 밤 인사를 할 때 사용해요."},

  // 채팅 반응·감정 표현 18개
  {term:"笑不活了",pinyin:"xiào bù huó le",meaning:"너무 웃겨서 못 살겠어",category:"채팅 반응",note:"정말 웃긴 상황에서 사용하는 과장된 반응이에요."},
  {term:"我真的会谢",pinyin:"wǒ zhēn de huì xiè",meaning:"진짜 어이없네",category:"채팅 반응",note:"황당하거나 짜증 나는 상황에서 반어적으로 사용해요."},
  {term:"救命",pinyin:"jiù mìng",meaning:"살려줘, 세상에",category:"채팅 반응",note:"놀람, 당황, 귀여움 등 강한 감정을 표현해요."},
  {term:"我哭死",pinyin:"wǒ kū sǐ",meaning:"나 진짜 울겠어",category:"채팅 반응",note:"슬프거나 감동적인 상황에서 과장해 표현해요."},
  {term:"好家伙",pinyin:"hǎo jiā huo",meaning:"와, 대박",category:"채팅 반응",note:"놀랍거나 예상 밖인 상황에 반응할 때 사용해요."},
  {term:"离谱",pinyin:"lí pǔ",meaning:"말도 안 돼, 어이없어",category:"채팅 반응",note:"황당하거나 상식에서 벗어난 상황을 표현해요."},
  {term:"服了",pinyin:"fú le",meaning:"어휴, 인정한다",category:"채팅 반응",note:"상황에 따라 감탄이나 짜증을 나타낼 수 있어요."},
  {term:"牛逼",pinyin:"niú bī",meaning:"쩐다, 개쩐다, 대단하다",category:"채팅 반응",note:"상대방이나 상황을 강하게 칭찬할 때 쓰는 비격식 표현이에요."},
  {term:"还得是你",pinyin:"hái děi shì nǐ",meaning:"역시 너밖에 없어",category:"채팅 반응",note:"상대방의 능력이나 행동을 인정할 때 사용해요."},
  {term:"安排上了",pinyin:"ān pái shàng le",meaning:"바로 진행했어, 일정 잡았어",category:"채팅 반응",note:"무언가를 실제로 실행하거나 준비했다는 뜻이에요."},
  {term:"懂了懂了",pinyin:"dǒng le dǒng le",meaning:"알았어 알았어",category:"채팅 반응",note:"상대방의 설명을 이해했다는 뜻이에요."},
  {term:"无所谓",pinyin:"wú suǒ wèi",meaning:"상관없어, 아무래도 좋아",category:"채팅 반응",note:"어떤 선택이나 상황에 크게 신경 쓰지 않는다는 뜻이에요."},
  {term:"真的假的啊",pinyin:"zhēn de jiǎ de a",meaning:"진짜라고? 정말?",category:"채팅 반응",note:"놀람이나 의심을 더 강하게 표현해요."},
  {term:"太离谱了",pinyin:"tài lí pǔ le",meaning:"너무 말도 안 돼",category:"채팅 반응",note:"상황이 황당하거나 지나치다고 느낄 때 사용해요."},
  {term:"笑死",pinyin:"xiào sǐ",meaning:"웃겨 죽겠네",category:"채팅 반응",note:"웃긴 상황에 짧게 반응하는 표현이에요."},
  {term:"哈哈哈哈",pinyin:"hā hā hā hā",meaning:"ㅋㅋㅋㅋ",category:"채팅 반응",note:"메시지에서 웃음을 표현하는 기본적인 방식이에요."},
  {term:"啊这",pinyin:"ā zhè",meaning:"어... 이건 좀",category:"채팅 반응",note:"당황하거나 할 말을 잃었을 때 사용해요."},
  {term:"绷不住了",pinyin:"bēng bú zhù le",meaning:"더는 못 참겠어, 웃음이 터졌어",category:"채팅 반응",note:"웃음이나 감정을 더 이상 참기 어려울 때 사용해요."},

  // 2025년 유행어 11개
  {term:"敬自己一杯",pinyin:"jìng zì jǐ yì bēi",meaning:"나 자신에게 한 잔",category:"2025 유행어",note:"자신의 노력이나经历를 돌아보며 스스로를 격려하는 표현이에요."},
  {term:"助我破鼎",pinyin:"zhù wǒ pò dǐng",meaning:"내가 한계를 깨도록 도와줘",category:"2025 유행어",note:"온라인 유행 표현으로 사용 맥락에 따라 의미가 달라질 수 있어요."},
  {term:"如何呢又能怎",pinyin:"rú hé ne yòu néng zěn",meaning:"그래서 어쩔 건데?",category:"2025 유행어",note:"상대의 평가나 비판에 개의치 않는 태도를 표현해요."},
  {term:"基础不基础",pinyin:"jī chǔ bù jī chǔ",meaning:"기본적인 게 기본적이지 않네",category:"2025 유행어",note:"기대와 다른 결과나 상황을 장난스럽게 표현하는 말놀이예요."},
  {term:"千百次练习只为这一刻",pinyin:"qiān bǎi cì liàn xí zhǐ wèi zhè yí kè",meaning:"수백 번 연습한 건 바로 이 순간을 위해서",category:"2025 유행어",note:"결정적인 순간이나 성과를 과장해 표현할 때 사용해요."},
  {term:"村咖",pinyin:"cūn kā",meaning:"시골 카페",category:"2025 유행어",note:"도시 외곽이나 시골에 자리한 감성 카페를 가리켜요."},
  {term:"来财",pinyin:"lái cái",meaning:"돈 들어와라, 재물운 와라",category:"2025 유행어",note:"돈이나 행운을 바라는 의미로 장난스럽게 사용해요."},
  {term:"浪浪山小妖怪",pinyin:"làng làng shān xiǎo yāo guài",meaning:"낭낭산의 작은 요괴들",category:"2025 유행어",note:"중국 애니메이션 작품과 관련된 표현이에요."},
  {term:"赛博对账",pinyin:"sài bó duì zhàng",meaning:"온라인으로 내역 맞춰보기",category:"2025 유행어",note:"온라인에서 서로의 소비나 기록을 비교하는 상황에 사용해요."},
  {term:"预制朋友圈",pinyin:"yù zhì péng yǒu quān",meaning:"미리 준비해 둔 SNS 게시물",category:"2025 유행어",note:"SNS에 올릴 사진이나 문구를 미리 준비해 두는 것을 말해요."},
  {term:"谷子",pinyin:"gǔ zi",meaning:"캐릭터 굿즈",category:"2025 유행어",note:"굿즈를 뜻하는 굿즈(グッズ)에서 유래한 중국어 인터넷 표현이에요."},

  // 2026년 유행어·인터넷 표현 31개
  {term:"爱你老己",pinyin:"ài nǐ lǎo jǐ",meaning:"사랑해, 나 자신아",category:"2026 유행어",note:"자기 자신을 다정하게 대하고 챙기자는 의미예요."},
  {term:"手搓",pinyin:"shǒu cuō",meaning:"직접 손으로 만들다",category:"2026 유행어",note:"기계나 전문 도구 대신 직접 제작했다는 의미로 온라인에서 사용해요."},
  {term:"从夯到拉",pinyin:"cóng hāng dào lā",meaning:"최고부터 최악까지",category:"2026 유행어",note:"대상이나 수준을 등급별로 평가하는 인터넷 표현이에요."},
  {term:"夯",pinyin:"hāng",meaning:"최고, 매우 좋음",category:"2026 유행어",note:"온라인 등급 표현에서 긍정적인 평가를 뜻해요."},
  {term:"拉完了",pinyin:"lā wán le",meaning:"완전히 별로야, 망했어",category:"2026 유행어",note:"대상이나 결과가 기대에 못 미친다는 뜻으로 사용해요."},
  {term:"邪修",pinyin:"xié xiū",meaning:"정석이 아닌 독특한 방법",category:"2026 유행어",note:"일반적인 방법 대신 기발하거나 엉뚱한 방식으로 문제를 해결하는 것을 말해요."},
  {term:"已读乱回",pinyin:"yǐ dú luàn huí",meaning:"읽고 엉뚱하게 답장하기",category:"2026 유행어",note:"메시지를 읽고 문맥과 맞지 않는 답을 보내는 상황을 표현해요."},
  {term:"活人微死",pinyin:"huó rén wēi sǐ",meaning:"살아 있지만 거의 죽은 듯한 상태",category:"2026 유행어",note:"피곤하거나 무기력해서 아무것도 하기 싫은 상태를 과장해 표현해요."},
  {term:"淡人",pinyin:"dàn rén",meaning:"덤덤한 사람",category:"2026 유행어",note:"감정 표현이나 반응이 크지 않고 차분한 사람을 뜻해요."},
  {term:"浓人",pinyin:"nóng rén",meaning:"감정 표현이 풍부한 사람",category:"2026 유행어",note:"감정이나 취향을 강하게 드러내는 사람을 뜻해요."},
  {term:"外耗",pinyin:"wài hào",meaning:"외부 관계로 인한 에너지 소모",category:"2026 유행어",note:"타인의 말이나 관계 때문에 정신적으로 지치는 상황을 표현해요."},
  {term:"红温",pinyin:"hóng wēn",meaning:"열받다, 화가 나다",category:"2026 유행어",note:"게임이나 인터넷에서 화가 나 얼굴이 달아오르는 상황을 표현해요."},
  {term:"搞抽象",pinyin:"gǎo chōu xiàng",meaning:"황당하고 엉뚱한 짓을 하다",category:"2026 유행어",note:"일부러 비현실적이거나 이해하기 어려운 행동을 하는 것을 말해요."},
  {term:"抽象",pinyin:"chōu xiàng",meaning:"기괴하다, 황당하다",category:"2026 유행어",note:"온라인에서는 일반적인 의미와 달리 엉뚱하고 어이없는 상황을 표현해요."},
  {term:"听劝",pinyin:"tīng quàn",meaning:"조언을 받아들이다",category:"2026 유행어",note:"다른 사람의 의견이나 추천을 받아들이겠다는 뜻이에요."},
  {term:"包的",pinyin:"bāo de",meaning:"당연하지, 맡겨 둬",category:"2026 유행어",note:"상대방의 부탁이나 제안에 자신 있게 긍정할 때 사용해요."},
  {term:"误闯天家",pinyin:"wù chuǎng tiān jiā",meaning:"우연히 엄청난 곳에 들어가다",category:"2026 유행어",note:"자신이 있을 만한 곳이 아닌 특별한 환경에 우연히 들어간 상황을 표현해요."},
  {term:"悬着的心终于死了",pinyin:"xuán zhe de xīn zhōng yú sǐ le",meaning:"불안했던 마음이 결국 체념했어",category:"2026 유행어",note:"기대나 걱정이 끝내 좋지 않은 결과로 이어졌을 때 쓰는 과장된 표현이에요."},
  {term:"不语，只是一味地",pinyin:"bù yǔ, zhǐ shì yí wèi de",meaning:"말없이 그저 계속 ~할 뿐",category:"2026 유행어",note:"뒤에 행동을 붙여 상황을 과장하거나 밈처럼 표현해요."},
  {term:"这河里吗",pinyin:"zhè hé lǐ ma",meaning:"이게 말이 돼?",category:"2026 유행어",note:"这合理吗(이게 합리적이야?)를 장난스럽게 바꾼 인터넷 표현이에요."},
  {term:"高雅人士",pinyin:"gāo yǎ rén shì",meaning:"고상한 사람",category:"2026 유행어",note:"실제로 고상한 사람을 뜻하기도 하지만 온라인에서는 반어적으로 사용되기도 해요."},
  {term:"牛来",pinyin:"niú lái",meaning:"대단한 일이 온다",category:"2026 유행어",note:"인터넷 밈이나 특정 문맥에서 쓰이는 표현으로 의미가 고정적이지 않아요."},
  {term:"梁圣",pinyin:"liáng shèng",meaning:"량성",category:"2026 유행어",note:"특정 인물이나 온라인 밈을 가리키는 맥락 의존 표현이에요."},
  {term:"牢梁",pinyin:"láo liáng",meaning:"량 씨를 놀리거나 부르는 별칭",category:"2026 유행어",note:"특정 온라인 밈에서 쓰이는 표현으로 일반적인 일상어는 아니에요."},
  {term:"痛文化",pinyin:"tòng wén huà",meaning:"아픔과 슬픔을 소비하는 문화",category:"2026 유행어",note:"슬픔이나 고통을 감성적인 콘텐츠로 표현하고 공유하는 문화를 말해요."},
  {term:"主体性",pinyin:"zhǔ tǐ xìng",meaning:"주체성",category:"2026 유행어",note:"타인의 시선보다 자신의 생각과 선택을 중심에 두는 태도를 말해요."},
  {term:"边界感",pinyin:"biān jiè gǎn",meaning:"관계의 경계와 선을 지키는 감각",category:"2026 유행어",note:"타인과의 관계에서 서로의 사생활과 영역을 존중하는 태도예요."},
  {term:"反精致",pinyin:"fǎn jīng zhì",meaning:"지나친 꾸밈과 완벽함을 거부하기",category:"2026 유행어",note:"완벽하게 꾸미고 연출하는 문화에서 벗어나려는 태도를 말해요."},
  {term:"AI人格",pinyin:"AI rén gé",meaning:"AI 같은 성격",category:"2026 유행어",note:"AI처럼 말하거나 행동하는 모습을 묘사할 때 쓰는 표현이에요."},
  {term:"柔软力",pinyin:"róu ruǎn lì",meaning:"유연하고 부드럽게 대처하는 힘",category:"2026 유행어",note:"상황에 맞춰 부드럽고 유연하게 대응하는 능력을 뜻해요."},
  {term:"已读不回",pinyin:"yǐ dú bù huí",meaning:"읽씹",category:"2026 유행어",note:"메시지를 읽고도 답장하지 않는 상황을 뜻하는 채팅 표현이에요."},

  // 팬덤 용어 2개
  {term:"出坑",pinyin:"chū kēng",meaning:"탈덕하다, 덕질을 그만두다",category:"팬덤 용어",note:"팬덤에서 특정 작품이나 아이돌을 더 이상 좋아하지 않게 됐다는 뜻이에요."},
  {term:"入坑",pinyin:"rù kēng",meaning:"입덕하다",category:"팬덤 용어",note:"새로운 아이돌이나 작품을 좋아하기 시작했다는 뜻이에요."}
];

let category = "전체";
let saved = [];
try { saved = JSON.parse(localStorage.getItem("talkchina-saved") || "[]"); } catch {}
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
    box.innerHTML = '<div class="saved-empty">♡<br><strong>아직 저장한 표현이 없어요.</strong><br>번역 결과나 신조어 사전에서 마음에 드는 표현을 저장해 보세요.</div>';
    return;
  }
  box.innerHTML = saved.map((item, i) => `
    <div class="saved-item">
      <div><strong>${esc(item.term)}</strong><p>${esc(item.meaning)}${item.pinyin ? " · " + esc(item.pinyin) : ""}</p></div>
      <button class="small-action" data-remove="${i}">삭제</button>
    </div>`).join("");
  $$("[data-remove]").forEach(button => button.onclick = () => {
    saved.splice(Number(button.dataset.remove), 1);
    persist();
    renderSaved();
    toast("단어장에서 삭제했어요.");
  });
}
function renderDictionary(query = "") {
  const q = query.trim().toLowerCase();
  const list = samples.filter(item =>
    (category === "전체" || item.category === category) &&
    (!q || [item.term, item.pinyin, item.meaning, item.note].join(" ").toLowerCase().includes(q))
  );
  $("#dictionary-grid").innerHTML = list.length ? list.map(item => `
    <article class="word-card">
      <div class="word-top"><strong>${esc(item.term)}</strong><span class="word-tag">${esc(item.category)}</span></div>
      <div class="pinyin">${esc(item.pinyin)}</div>
      <div class="meaning">${esc(item.meaning)}</div>
      <div class="word-note">${esc(item.note)}</div>
      <div class="word-card-foot"><button class="small-action" data-save="${esc(item.term)}">♡ 저장</button></div>
    </article>`).join("") :
    '<div class="saved-empty" style="grid-column:1/-1">검색 결과가 없어요. 다른 단어로 검색해 보세요.</div>';
  $$("[data-save]").forEach(button => button.onclick = () => {
    const item = samples.find(x => x.term === button.dataset.save);
    if (item) saveWord(item);
  });
}
function switchTab(name) {
  $$(".tab").forEach(button => button.classList.toggle("active", button.dataset.tab === name));
  $$(".panel").forEach(panel => panel.classList.toggle("active", panel.id === `${name}-panel`));
  if (name === "saved") renderSaved();
  if (name === "dictionary") renderDictionary($("#dictionary-search").value);
}

function findExpressions(text) {
  const lower = text.toLowerCase();
  return samples.filter(item => lower.includes(item.term.toLowerCase()));
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
    category: "번역 저장"
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
$$(".category").forEach(button => button.onclick = () => {
  category = button.dataset.category;
  $$(".category").forEach(item => item.classList.toggle("active", item === button));
  renderDictionary($("#dictionary-search").value);
});

renderDictionary();
renderSaved();
setStatus("무료 기본 번역 모델 대기 중", false);
