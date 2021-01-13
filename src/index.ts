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

const SEARCH_DOM: HTMLInputElement = document.getElementById('search-keyword') as HTMLInputElement;
const OPTION_DOM: HTMLSelectElement = document.getElementById('search-mode') as HTMLSelectElement;

const buffSE = new BuffSearchEngine();
const skillSE = new SkillSearchEngine();

function search() {
  // 키워드 분해
  let keywords_text = SEARCH_DOM.value;
  keywords_text = keywords_text ? keywords_text : '';

  let keywords = keywords_text.split(' ');
  keywords = keywords.filter(keyword => keyword);

  if (OPTION_DOM.value === '0')
    RESULT_CONTROLLER.setResult(buffSE.search(keywords, DOLL_INFOS));
  else
    RESULT_CONTROLLER.setResult(skillSE.search(keywords, DOLL_INFOS));

  RESULT_VIEW.render(RESULT_CONTROLLER);
}

// 검색창 반응
let timer = setTimeout(search, 500);
SEARCH_DOM.onkeydown = (evt: KeyboardEvent) => {
  clearTimeout(timer);
  timer = setTimeout(search, 500);
};

// 모드 선택 시 반응
OPTION_DOM.onchange = search;