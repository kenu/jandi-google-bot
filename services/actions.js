const sheetdb = require('../lib/sheetdb');
const axios = require('axios');
const NumberUtils = require('../common/NumberUtils');
const ArrayUtils = require('../common/ArrayUtils');

const actions = {
  'translate': function (key) {
    const map = {
      '클러스터': 'cluster',
      '로또': 'lotto',
      '시크릿': 'secret',
      '메뉴': 'menu',
    };
    return (map[key]) ? map[key] : key;
  },
  'cluster': async () => {
    const info = { sheetId: process.env.SHEET_ID, id: process.env.SHEET_GID };
    const sheet = await sheetdb.getSheet(info);
    await sheet.loadCells('B2:D4');
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${process.env.SHEET_ID}/edit#gid=${process.env.SHEET_GID}`
    const stats =
      '[[현황 link]](' + sheetUrl + ')'
      + '\n' + sheet.getCell(2, 1).value + ': ' + sheet.getCell(2, 2).value + '/' + sheet.getCell(2, 3).value
      + '\n' + sheet.getCell(3, 1).value + ': ' + sheet.getCell(3, 2).value + '/' + sheet.getCell(3, 3).value;
    return stats;
  },
  'lotto': () => {
    if (Math.random() > .2) {
      const list = NumberUtils.getRandomList(45, 6);
      return list.join(', ');
    } else {
      const shuffled = ArrayUtils.shuffle(words);
      return shuffled.pop();
    }
  },
  'secret': () => {
    const shuffled = ArrayUtils.shuffle(words);
    return shuffled.pop();
  },
  'menu': () => {
    const menuList = ['특식', '찌개', '덥밥/볶음밥', '해장', '일식', '중국식', '분식', '국/탕'];
    const menu = ArrayUtils.shuffle(menuList);
    return menu.pop();
  },
  sendToJandi: async function (data) {
    const config = {
      headers: {
        'Accept': 'application/vnd.tosslab.jandi-v2+json',
        'Content-Type': 'application/json'
      }
    }
    return await axios.post(process.env.JANDI_INCOMING_WEBHOOK, data, config);
  }
};

var words = [
  '1. 초짜 프로그래머 팀장 무서운줄 모른다.\n-팀장의 개발짬을 무시하지마라. 너가 abcd배울때 c언어를 배운사람일지도 모른다.',
  '2. 발없는 오픈소스 천리간다.\n-오픈소스는 서로서로 공유합시다.',
  '3. 한줄 코드라도 서로 거들면 낫다.\n-공동작업(콜라보)의 이로움',
  '4. 가는 디자인 좋아야 오는 프로그램 좋다.\n-디자이너와의 조우',
  '5. 두개의 버그는 한번에 잡을 수 없다.\n-하나 잡으면 두개 두개잡으면 세개로 증가',
  '6. 슬슬하는 코딩으로 땀에 옷 젖는지 모른다.\n-코딩하느라 화장실도 참음',
  '7. 오류를 넘으면 또 오류가 있다.\n-무한 버그',
  '8. 배열도 꽤어야 보배\,-간단한 코딩에도 배열 추가',
  '9. 무오류는 금이다.\n-그럴수가',
  '10. 팀장 한마디에 천줄코드 안써도 된다.\n-이미 오백줄 쳤습니다 ㅠㅠ',
  '11. 코딩하다 곧 중지하면 아니한만 못하니라.\n-코딩도 많이 해본놈이 잘한다.',
  '12. 버그를 잡으려다 잡은버그 놓친다.\n-버그의 기본원칙 -1 = +2  , -2 = +4 , -3 = +9 ,.... 이상하다...',
  '13. 될성부른 초짜는 떡잎부터 알아본다.\n-첨부터 잘하는 놈이 잘한다.',
  '14. 서버가 다운되도 백업이 있다.\n-어제껄로 밀어주세요',
  '15. 아니쓴 코드에 오류날까?\n-오류가 난다는게 함정',
  '16. 가는 소스가 고와야 오는 파일에 바이러스 없다.\n-바이러스 안 심어도 옮아온다. 감기도 아니고....',
  '17. 잦은 Warning 에 Error 날줄 모른다.\n-워닝이 많은데 에러가 없다뉘',
  '18. 영업은 상사 편이다.\n-영업은 당신일이 아니야',
  '19. 디자이너는 프로그래머 편이다.\n-디자이너와의 조우 성공',
  '20. 프린터 밑에 누워 소스 떨어지기만을 기다린다.\n-프린터가 코딩해주냐?',
  '21. printf 도 디버깅에 쓸려면 에러난다.\n-어째서 이런데서 에러가 나는거냐?',
  '22. 에러 무서워서 코딩 못 할까?\n-에러나도 코딩한다',
  '23. 소스가 한 박스라도 코딩을 해야 프로그램이다.\n-소스는 이미 엄청나지 모아서 코딩해야 프로그램이 나오지',
  '24. 코더도 타이핑하는 재주는 있다!!\n-코더 보다 프로그래머',
  '25. 길고 짧은 것은 strlen을 써봐야 안다.\n-길이계산해주네 ㅋㅋㅋ',
  '26. 소스도 먼저 코딩하는 놈이 낫다.\n-사실임',
  '27. 믿는 팀장에 발등 찍힌다.\n-팀장도 모르는게 있다. 팀장이라고 모든걸 다알진 않아.',
  '28. 개발실 청소 아줌마 삼 년에 디버깅 한다.\n-빗자루로 코딩좀 해주세요.',
  '29. 보기 좋은 코드가 디버깅 하기 좋다.\n-빠른 코딩을 원한다면 보기나빠도 이해해라',
  '30. 소스 잃고 백업장치 구입한다.\n-공감하십니까?',
  '31. 아니 코딩한 소스에 버그 날까?\n-버그 난다고요. 빌드만 해도 버그남. 재수없는 경우 코딩툴 다시 설치해야됨',
  '32. 안 되는 코더는 엔터를 쳐도 PC가 다운된다.\n-아아.... 응답없음...... 멘붕',
  '33. 잘되면 프로그래머 탓, 못되면 시스템 탓.\n-시스템보다 당신의 코드한줄에 문제가 있을지도 몰라',
  '34. 야한 화일도 위아래가 있다.\n-우선순위란 어디에나 존재하지',
  '35. 하룻 프로그래머 정품단속반 무서울줄 모른다.\n-정품단속? 그게 머더라? 하다가 뒤통수 맞음',
  '36. 백업을 안하면 삼대가 내리 흉하다.\n-한달내내 작업하고 날라가봐야 정신차리지',
  '37. 잘 키운 개발자 한명 열 코더 안부럽다.\n-그냥 짜논대로 치느냐 그걸 짜느냐',
  '38. 멀쩡한 프로그램에 날 세그먼트폴트\n-왜 세그먼트폴트가 생겼을까 뭘 빼먹은거냐? 메모리가 거지인거냐?',
  '39. 안에서 새는 메모리 밖에서도 샌다…\n-테스트할때 다운 안되다가 앱스토어 올리면 댓글에 자꾸 죽어요 엄청 올라옴.',
  '40. 프로그램은 개발자가 짜고, 보너스는 영업이 받는다.\n-좋은데?',
  '41. 늦게 배운 코딩 날새는줄 모른다.\n-날새도록 코딩해보면 피곤하지만 재밋지.',
  '42. 디버깅한번 으로 천버그 잡는다.\n-디버깅에서 잡히면 다행',
  '43. 돌(완벽한) 코드도 생각해보고 컴파일하자!\n-컴파일시 오류는 팀장도 못잡아',
  '44. 경영다툼에 개발자등 터진다.\n-경영이 뭐에요?',
  '45. 제 코드가 석자\n-뭘 물어봐도 이미 머리속에서 내 코드 오류만 생각남',
  '46. 버그보고 놀란가슴 오타보고 놀란다.\n-오타쳐놓고 버그인줄 알고 깜짝놀람',
  '47. 코딩 전 마음 다르고, 코딩 후 마음 다르다.\n-대단한 것 같아도 막상 짜놓고 보면 맘에 안들어.',
  '48. 제 코드 구린줄 모른다.\n-대단한 것 같아도 남이보면 그냥 구려.',
  '49. 코드가 죽끓듯 하다.\n-생각나는데로 날코딩하지 마세요',
  '50. 환경이 좋아야 개발자가 모인다.\n-식사(고기 필수)와 맥주한잔 컴퓨터책상과 커피만 있다면 여기가 천국이로다.',
  '51. 소스 놓고 main도 모른다.\n-array만 알면 되는거 아녓어?',
  '52. 악습코드 구제는 팀장도 못한다.\n-팀장도 모르는건 모른다니까!',
  '53. 개 같이 코딩해서 정승처럼 사표쓴다.\n-ㅋㅋ 날코딩의 말로',
  '54. 숙제밭에 굴러도 학교가 좋다.\n-학교에선 내맘대로 코딩하잖아.',
  '55. 컴파일 하자 컴 다운된다.\n-백업이 없다면 눈물닦고 첨부터 다시짜라.',
  '56. 리펙토링도 단숨에 하랬다.\n-객체지향 VS 절차지향',
  '57. 아는 코드도 다시봐라.\n-가끔 생각 안날때도 있지.',
  '58. 개발자 망신은 Copy&Paste가 시킨다.\n-이건 그냥 생각이 없는건가?',
  '59. 짧은 코드가 더 아름답다.\n-하이레벨 한줄코딩 만세!',
  '60. 천줄코드도 #include부터\n-include 없으면 코드가 안쳐짐(불안해)',
  '61. 한 프로그램에 개발자 되랴\n-여기저기 조금조금씩 참여해서 곁다리 걸치기 보다 한가지를 스스로 만들어보삼',
  '62. 선옵티마이징이 개발자 잡는다.\n-최대한 좋게 좋게 도대체 어떻게 만들라는 거냐?',
  '63. 개발자 키워서 대기업 준다.\n-그러게 있을때 잘해주지...',
  '64. 버그잡자고 빌드다 뽀갠다.\n-스스로 짠게 아니면 건들지마. 꼬우면 새로 치던지',
  '65. 될성부른 코드는 들여쓰기부터 안다.\n-보기좋은 코딩',
  '66. 빌드 뽀갠 넘이 성낸다.\n-스스로 짜라니까!',
  '67. 다된 프로젝트에 코 빠트리기.\n-니부분 아니면 건들지마!',
  '68. 개발자살이는 코딩 3년, 프로그래밍 3년, 파워포인트 3년\n-10년차부턴 파워포인트는 손안되도 되지.',
  '69. 사표쓴다 사표쓴다 하면서 프로젝트 세개 한다.\n-사표쓸생각을 지워주네.',
  '70. 고와도 내 코드 미워도 내 코드\n-자기가 짠 코드는 한수레의 금을 줘도 바꾸지...',
  '71. 코드 주고 뺨 맞는다.\n-잘짜라고요.',
  '72. 코드 가는 데 버그 간다.\n-버그없는 코드가 있나요?',
  '73. 코드를 봐야 디버깅을 하지!\n-코드만 보면 디버깅됨?',
  '74. 빌드 뽀갠 날 데모 하랜다.\n-뽀개졌으면 GG ',
  '75. #if 0에 소스 걸레되는 줄 모른다.\n-괜찮아 오픈소스 수정했어(히힛!)',
  '76. hardcode로 눈가리고 출시한다.\n-좋은데!',
  '77. 먼저 커밋한 놈이 임자다.\n-선빵친 놈이 구속된다.',
  '78. 무능한 팀장 구제는 사장도 못한다…\n-팀장이 경력10년차인데 무능하다면 사장도 무능하겠지....',
  '78. 코딩할 사람은 생각도 않는데 컴파일부터 한다.\n-컴파일만하면 프로그램되나?',
  '79. 빌드 깨먹고 스크린샷 내민다.\n-괜춘한데~',
  '80. 키보드는 두드려야 맛이다.\n-버그는 잡아야 제 맛',
  '81. 누워서 코딩하기.\n-안해보신분 손?',
  '82. 잘 된 설계 무너지랴.\n-음.. 그런걸 본적이 없어서....',
  '83. 코딩도 식후경이다.\n-배고프면 코딩 못함',
  '84. 패드 위에 놓인 쥐\n-쥐를 왜 패드위에 놓나요 마우스패드위에 놔야죠.',
  '85. 바쁜 컴퓨터에 클릭질 한다.\n-응답없음 ㅡㅡ;',
  '86. 스테이블 버전에도 버그 있다.\n-설마 버그없는 버전도 있음?',
  '87. 원수는 메신저에서도 만난다.\n-메신저차단',
  '88. 모니터도 때리면 꿈틀거린다.\n-내 컴퓨터는 차마 못때림 (맥북이야)',
  '89. 비트 모아 테라.\n- 1테라 = 1024기가바이트 = 1024x1024메가바이트 = 1024x1024x1024킬로바이트 = 1024x1024x1024x1024바이트 = 1024x1024x1024x1024x8비트 1024테라 = 1페타바이트',
  '1. 내일 정전이 된다해도 나는 오늘 한 줄의 코드를 쓰겠다. – 스피노자',
  '2. 스스로 돌아봐서 에러가 없다면 천만인이 가로막아도 나는 컴파일하리라. – 맹자',
  '3. 나는 하루라도 코드를 쓰지 않으면 입안에 가시가 돋는다. – 안중근 의사',
  '4. 가장 커다란 에러는 컴파일의 순간에 도사린다. – 나폴레옹',
  '5. 나는 코딩한다, 고로 나는 존재한다. – 데카르트',
  '6. 대박 프로그램은 1%의 영감과 99%의 노가다로 이루어진다. – 에디슨',
  '프로그래머 여러분들 모두 수고가 많으십니다.',
  '오늘도 힘내서 야근!',
  '(1) 42 서울인은 개개인이 서로 다름을 인정하고 수용하는 자세를 가집니다.',
  '(2) 42 서울인은 세상의 문제와 변화에 공감하고 참여하여 대안을 찾아갑니다.',
  '(3) 42 서울인은 스스로 선택하고 기회를 만듭니다.',
  '(4) 42 서울인은 남들보다 뛰어남보다 같이 성장함을 중요하게 생각합니다.',
  '(5) 42 서울인은 최선을 다한 우리가 세계 최고임에 자부심을 가집니다.',
  '(6) 42 서울인은 실패를 두려워하지 않으며 실패를 통해 배웁니다.',
  '(7) 42 서울인은 다른 사람의 건전한 평가를 수용하고 개선합니다.',
  '(8) 42 서울인은 42 서울 내의 모든 일에 진실하며 책임 의식을 갖습니다.',
  '(9) 42 서울인은 42 서울과 42 서울인들의 재산을 소중하게 여깁니다.',
  '나까지 나설 필요는 없다',
  '헌신하면 헌신짝 된다',
  '참고 참고 또 참으면 참나무가 된다',
  '포기하면 편하다',
  '왕관을 쓰려는 자, 그 무게를 견뎌라',
  '아니면 말고',
  '나도 나지만 너도 너다',
  '목숨을 버리면 무기만은 살려 주겠다',
  '가는 말이 고우면 사람을 얕본다',
  '...',
  '잘생긴 놈은 얼굴값하고 못생긴 놈은 꼴값한다',
  '공부는 실수를 낳지만 찍기는 기적을 낳는다',
  '까도 내가 깐다',
  '난 오아시스를 원했고 넌 신기루만으로 좋았던 거지',
  '동정할 거면 돈으로 줘요',
  '“내 너 그럴줄 알았다”? 그럴 줄 알았으면 미리 말을 해주세요',
  '즐길 수 없으면 피하라',
  '이것 또한 지나가리라',
  '대문으로 가난이 찾아오면 사랑은 창문으로 도망간다',
  '일찍 일어나는 새가 더 피곤하다',
  '일찍 일어난 벌레는 잡아 먹힌다',
  '먼저 가는 건 순서가 없다',
  '똥차 가고 벤츠 온다',
  '효도는 셀프',
  '먹는 것이 공부라면 세상에서 공부가 가장 쉬웠어요',
  '어려운 길은 길이 아니다',
  '개천에서 용 난 놈 만나면, 개천으로 끌려 들어간다',
  '이런 인생으론 자서전도 쓸 수 없다',
  '새벽에 맥주와 먹는 치킨은 0칼로리다',
  '늦었다고 생각할 때가 가장 늦은 거다',
  '성형수술하고 나아진 게 아니라 하기 전이 최악이었다',
  '내일 할 수 있는 일을 굳이 오늘 할 필요는 없다',
  '되면 한다',
  '성공은 1%의 재능과 99%의 돈과 빽만 있음 된다',
  '지금 쟤 걱정할 때가 아니다 니가 더 걱정이다',
  '예술은 비싸고 인생은 더럽다',
  '고생 끝에 골병난다',
  '하나를 보고 열을 알면 무당 눈깔이다',
  '원수는 회사에서 만난다',
  '돌다리도 두들겨 보면 내 손만 아프다',
  '재주가 많으면 먹고 살만한 길이 많다',
  '티끌은 모아 봐야 티끌이다',
  '늦잠자는 놈들이 가는 지옥이 있는데 그곳은 바로 다음날 아침이다',
  '기억하자 노력은 종종 배신하지만 포기는 배신하지 않는다',
  '관심이 필요할 땐 좀비가 나오는 게임을 해보자 거기선 세상 모두가 당신을 원한다',
  '어차피 코딩할꺼 행복하게 코딩하자',
  '기분이 태도가 되지 말자',
  '진짜 비밀은 차라리 개에게 털어 놓아라',
  '지금 한다',
  '고통은 지나가지만 아름다움은 남는다',
  '자신감이 약해지면, 남의 충고가 더 크게 들린다',
  '몰래 도망쳐 나왔어. 만사가 싫어졌거든',
  '인생? 나에게 인생에 대해 말하지 마십시오.',
  '내가 매우 우울하다는 것을 알아야 한다고 생각한다.',
];

module.exports = actions;
