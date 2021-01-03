import { parse } from 'papaparse'
import { DollInfo } from './doll_info'
import { ResultController, ResultView } from './result-view';
import { BuffSearchEngine, SkillSearchEngine } from './search-engine'

// CSV를 불러온다
const DOLL_INFOS: DollInfo[] = [];
let isFirst = true;
parse('/data.csv', {
  download: true,
  step: (row: any) => {
    // 첫 행은 헤더이며 마지막에 쓰레기 개행문자 하나만 들어온다
    if (!isFirst && row.data.length > 1)
      DOLL_INFOS.push(new DollInfo(row.data));

    if (isFirst)
      isFirst = false;
  },
  complete: () => {
  }
});

const RESULT_CONTROLLER = new ResultController();
const RESULT_VIEW = new ResultView();

// 검색창 반응
document.getElementById('search-keyword').onkeyup = (evt: KeyboardEvent) => {
  // 키워드 분해
  let keywords_text = (evt.target as HTMLInputElement).value;
  keywords_text = keywords_text ? keywords_text : '';

  let keywords = keywords_text.split(' ');
  keywords = keywords.filter(keyword => keyword);

  // 진형버프 검색모드
  if ((document.getElementById('search-mode') as HTMLSelectElement).value === '0') { 
    const buffSE = new BuffSearchEngine();
    RESULT_CONTROLLER.setResult(buffSE.search(keywords, DOLL_INFOS));
  }
  // 스킬 검색모드
  else {
    const skillSE = new SkillSearchEngine();
    RESULT_CONTROLLER.setResult(skillSE.search(keywords, DOLL_INFOS));
  }
  RESULT_VIEW.render(RESULT_CONTROLLER);
};