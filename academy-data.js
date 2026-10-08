'use strict';
const SUBJECTS={english:['EN','英語'],flags:['⚑','国旗'],history:['⌛','歴史'],geography:['◎','地理'],math:['＋','算数'],japanese:['あ','国語'],kanji:['字','漢字'],science:['⚗','理科']};
const SOURCES={history:['国立国会図書館：史料にみる日本の近代','https://www.ndl.go.jp/modern/cha1/index.html'],constitution:['国立国会図書館：日本国憲法の誕生・年表','https://www.ndl.go.jp/constitution/etc/history.html'],geography:['J-LIS：都道府県庁','https://www.j-lis.go.jp/spd/code-address/todouhuken/cms_16914188.html'],flags:['flag-icons / MIT','https://flagicons.lipis.dev/'],science:['NASA：太陽系の惑星','https://science.nasa.gov/solar-system/planets/']};
const EXTRA_NAMES={line:['↔','NUMBER LINE','数直線を動かす'],keypad:['123','NUMBER CODE','数字で答える'],balance:['⚖','BALANCE LAB','分銅を組み合わせる'],paint:['▦','FRACTION ART','分数をぬる'],timing:['◴','STOP & THINK','動く数字を止める'],sort:['⇄','SORT EXPRESS','カードを仕分ける'],match:['⇔','PAIR LINK','ペアを結ぶ'],search:['⌕','GLYPH HUNT','文字を探す'],memory:['▧','MEMORY LAB','神経衰弱'],echo:['♪','ECHO STEPS','順番を記憶する'],trace:['⌁','PATH MAKER','条件で道をつなぐ'],rotate:['↻','TURN AROUND','図形を回す'],swap:['▤','TILE REPAIR','文字を交換する'],erase:['⌫','WORD CLEANER','余分な語を消す'],type:['⌨','READ & TYPE','読みを入力する']};
Object.assign(names,EXTRA_NAMES);
DB.forEach((q,i)=>{q.subject='english';q.level=(i%8<4?1:2);q.audio=q.audio||false;});
function question(subject,kind,id,level,values){DB.push({subject,kind,id:subject+'-'+kind+'-'+id,level,hint:INSTRUCTIONS[kind]||'答えを選ぼう',...values});}
const INSTRUCTIONS={line:'つまみを動かすか、左右キーで数を合わせて決定。',keypad:'数字ボタンで入力。⌫ で1文字もどす。',balance:'分銅をタップして足す。置いた分銅を押すと戻せる。',paint:'同じ大きさのマスを、指定の割合だけぬって決定。',timing:'答えの数字でストップ。動きを減らす設定では手動で送れる。',sort:'カードを1枚ずつ、正しい箱へ。',match:'左を選んでから、対応する右を選ぶ。全部つなごう。',search:'似た文字の中から指定の文字を全部探して決定。',memory:'2枚ずつめくり、同じ組を全部そろえる。',echo:'見本を覚えたら「覚えた」。同じ順に押そう。',trace:'左上の START から右下へ。上下左右の隣のマスを順につなぐ。',rotate:'90度ずつ回して、目標の向きに合わせる。',swap:'2つの位置を押すと文字が交換される。正しい語に直そう。',erase:'余分な語を消して、自然な文に直す。もう一度押すと戻る。',type:'ひらがなで入力して決定。'};
const flagRows=[['jp','日本'],['fr','フランス'],['de','ドイツ'],['it','イタリア'],['gb','イギリス'],['us','アメリカ合衆国'],['ca','カナダ'],['br','ブラジル'],['au','オーストラリア'],['in','インド'],['kr','韓国'],['za','南アフリカ共和国']];
const flagHTML=(code,alt='国旗')=>`<img class="flag" src="assets/flags/${code}.svg" alt="${alt}">`;
flagRows.forEach(([code,country],j)=>{
 const group=Array.from({length:3},(_,k)=>flagRows[(j+k)%flagRows.length]);
 question('flags','reply',j,1,{prompt:'この国旗の国は？',visual:flagHTML(code),options:group.map(x=>x[1]),correct:0,answer:country,why:`${country}の国旗です。旗の図柄と国名を結びつけよう。`,source:'flags'});
 question('flags','match',j,2,{prompt:'国旗と国名を結ぼう',pairs:group.map(([c,n])=>[flagHTML(c),n]),answer:group.map(x=>x[1]).join('・'),why:'旗は色だけでなく、模様や配置も見分ける手がかり。',source:'flags'});
 question('flags','memory',j,1,{prompt:'同じ国旗のペアをそろえよう',pairs:group.map(([c,n])=>[flagHTML(c,n),flagHTML(c,n)]),answer:group.map(x=>x[1]).join('・'),why:'3か国の旗を見分けて、位置を覚えました。',source:'flags'});
});
const prefectures=[['北海道','札幌市'],['岩手県','盛岡市'],['宮城県','仙台市'],['茨城県','水戸市'],['栃木県','宇都宮市'],['群馬県','前橋市'],['埼玉県','さいたま市'],['神奈川県','横浜市'],['石川県','金沢市'],['山梨県','甲府市'],['愛知県','名古屋市'],['三重県','津市'],['滋賀県','大津市'],['兵庫県','神戸市'],['島根県','松江市'],['香川県','高松市'],['愛媛県','松山市'],['沖縄県','那覇市']];
prefectures.forEach(([p,c],j)=>{
 const group=Array.from({length:3},(_,k)=>prefectures[(j+k)%prefectures.length]);
 question('geography','reply',j,1,{prompt:`${p}の県庁（道庁）所在地は？`,options:group.map(x=>x[1]),correct:0,answer:c,why:`${p}の庁舎は${c}にあります。`,source:'geography'});
 question('geography','match',j,2,{prompt:'都道府県と庁舎のある市を結ぼう',pairs:group,answer:group.map(x=>x.join(' → ')).join(' / '),why:'県名と市名が異なる組を覚えよう。',source:'geography'});
});
const events=[['大政奉還',1867,'江戸時代','history'],['五箇条の誓文',1868,'明治時代','history'],['太政官制の形が整う',1871,'明治時代','history'],['明治六年の政変',1873,'明治時代','history'],['大阪会議',1875,'明治時代','history'],['西南戦争の終結',1877,'明治時代','history'],['内閣制度の創設',1885,'明治時代','history'],['ポツダム宣言の発表',1945,'昭和時代','constitution'],['憲法問題調査委員会の設置',1945,'昭和時代','constitution'],['日本国憲法の公布',1946,'昭和時代','constitution'],['第1次吉田茂内閣の成立',1946,'昭和時代','constitution'],['日本国憲法の施行',1947,'昭和時代','constitution']];
events.forEach(([event,year,era,source],j)=>{
 question('history','reply',j,1,{prompt:`日本史：${event}は何時代？`,options:['江戸時代','明治時代','昭和時代'],correct:['江戸時代','明治時代','昭和時代'].indexOf(era),answer:`${year}年・${era}`,why:`${event}は${year}年（${era}）。${event.includes('憲法の')?'公布は発表、施行は効力が生じることです。':'出来事と時代を結びつけて覚えよう。'}`,source});
 question('history','keypad',j,2,{prompt:`日本史：${event}（${era}）は西暦何年？`,target:year,answer:`${year}年`,why:`${event}：${year}年（${era}）。`,source});
});
const kana=[['山','やま'],['川','かわ'],['空','そら'],['雨','あめ'],['花','はな'],['草','くさ'],['犬','いぬ'],['猫','ねこ'],['鳥','とり'],['魚','さかな'],['森','もり'],['林','はやし'],['海','うみ'],['春','はる'],['夏','なつ'],['秋','あき'],['冬','ふゆ'],['風','かぜ']];
kana.forEach(([glyph,reading],j)=>{
 question('kanji','type',j,1,{prompt:`「${glyph}」の読みは？（ひらがな）`,target:reading,answer:reading,why:`${glyph}（${reading}）。この問題では単独の名詞として読みます。`});
 const distract=['出','州','穴','両','化','早','太','描','烏','角','林','森','毎','青','復','和','条','鳳'][j];
 question('kanji','search',j,1,{prompt:`「${glyph}」を全部見つけよう`,target:glyph,tiles:Array.from({length:12},(_,k)=>k===j%12||k===(j+5)%12?glyph:distract),answer:`${glyph} を2か所`,why:`${glyph}（${reading}）と${distract}の形の違いを見よう。`});
});
[['学校','がっこう'],['先生','せんせい'],['電車','でんしゃ'],['新聞','しんぶん'],['天気','てんき'],['図書館','としょかん'],['公園','こうえん'],['動物','どうぶつ'],['植物','しょくぶつ'],['料理','りょうり'],['時計','とけい'],['季節','きせつ']].forEach(([glyph,reading],j)=>question('kanji','type','compound'+j,2,{prompt:`「${glyph}」の読みは？（ひらがな）`,target:reading,answer:reading,why:`${glyph}は「${reading}」と読みます。小さい「っ」「ょ」にも注意。`}));
const words=['さくら','ひまわり','あさがお','たんぽぽ','つくえ','えんぴつ','とけい','くつした','にんじん','だいこん','たまねぎ','じゃがいも'];
const wordClues=['春に咲く、花見でおなじみの木','夏に咲く、大きな黄色い花','夏の朝に咲く、つるのある花','綿毛で種を飛ばす黄色い花','勉強するとき本を置く家具','黒鉛のしんで書く筆記具','時刻を知らせる道具','靴の中で足にはくもの','オレンジ色の根を食べる野菜','長くて白い根を食べる野菜','皮をむくと層に分かれる丸い野菜','カレーによく入る、芽を取り除くいも'];
words.forEach((word,j)=>question('japanese','swap',j,j<6?1:2,{prompt:wordClues[j],target:[...word],answer:word,why:`文字の並びを直すと「${word}」になります。`}));
const sentences=[['わたし','は','は','走る。'],['ねこ','が','が','ねむる。'],['本','を','を','読む。'],['学校','へ','へ','行く。'],['友だち','と','と','遊ぶ。'],['家','で','で','学ぶ。'],['花','が','が','咲く。'],['水','を','を','飲む。'],['空','は','は','青い。'],['駅','に','に','着く。'],['鳥','が','が','飛ぶ。'],['手','を','を','洗う。']];
sentences.forEach((tokens,j)=>question('japanese','erase',j,1,{prompt:'重なった助詞を1つ消そう',tokens,target:[tokens[0],tokens[1],tokens[3]].join(''),answer:[tokens[0],tokens[1],tokens[3]].join(''),why:`助詞「${tokens[1]}」は1つにします。`}));
for(let j=0;j<12;j++){
 const a=j+2,b=j%4+2,target=a+b;
 question('math','keypad',j,1,{prompt:`${a} ＋ ${b} ＝ ？`,target,answer:String(target),why:`${a}から${b}つ増えると${target}。`});
 question('math','line',j,1,{prompt:`数直線で ${a} ＋ ${b} を表そう`,min:0,max:25,target,answer:String(target),why:`0から右に${target}の位置です。`});
 question('math','balance',j,j<6?1:2,{prompt:`${target} g とつり合わせよう`,weights:[1,2,5],target,answer:`合計 ${target} g`,why:'分銅の重さを足し合わせ、左右の重さを同じにします。'});
 const den=j%3+4,num=j%(den-1)+1;
 question('math','paint',j,1,{prompt:`全体の ${num}/${den} をぬろう`,den,num,answer:`${den}マス中${num}マス`,why:`分母${den}は等分した数、分子${num}はぬる数。`});
 question('math','timing',j,2,{prompt:`${b} × ${j%3+2} の答えで止めよう`,values:shuffle(Array.from({length:6},(_,k)=>b*(j%3+2)-2+k)),target:b*(j%3+2),answer:String(b*(j%3+2)),why:'かけ算の答えの数字が中央に来たらストップ。'});
 question('math','trace',j,2,{prompt:'偶数だけを通って GOAL へ',tiles:[2,4,7,9,6,8,1,3,10].map(n=>n+j*2),path:[0,1,4,5,8],answer:'左上 → 上中央 → 中央 → 右中央 → 右下',why:'2で割り切れる数が偶数。奇数のマスには進めません。'});
 question('math','rotate',j,1,{prompt:`上向き矢印を時計回りに ${(j%3+1)*90}度 回そう`,target:j%3+1,answer:`時計回り ${(j%3+1)*90}度`,why:'90度は直角1つ分。360度で元の向きに戻ります。'});
 question('math','sort',j,1,{prompt:'偶数・奇数に仕分けよう',bins:['偶数','奇数'],cards:[j+2,j+3,j+4].map(n=>({label:String(n),bin:n%2})),answer:`${j+2}・${j+4}は${j%2?'奇数':'偶数'}`,why:'2で割り切れる整数が偶数、余り1が奇数です。'});
}
const planets=['水星','金星','地球','火星','木星','土星','天王星','海王星'];
planets.forEach((p,j)=>{
 question('science','reply',j,1,{prompt:`太陽から${j+1}番目の惑星は？`,options:[p,planets[(j+1)%8],planets[(j+2)%8]],correct:0,answer:p,why:`太陽に近い順：${planets.join(' → ')}。`,source:'science'});
 const seq=planets.slice(j%5,j%5+(j<5?3:4));
 question('science','echo',j,2,{prompt:'太陽に近い順を覚えて再現しよう',sequence:seq,answer:seq.join(' → '),why:'惑星は太陽からの順で並んでいます。',source:'science'});
 question('science','match',j,1,{prompt:'惑星と太陽からの順番を結ぼう',pairs:seq.map(v=>[v,`${planets.indexOf(v)+1}番目`]),answer:seq.map(v=>`${v}＝${planets.indexOf(v)+1}番目`).join(' / '),why:'地球は太陽から3番目の惑星です。',source:'science'});
});
// Choice order is shuffled once at data-load, keeping the correct answer attached.
DB.filter(q=>q.options).forEach(q=>{const correct=q.options[q.correct];q.options=shuffle(q.options);q.correct=q.options.indexOf(correct);});
