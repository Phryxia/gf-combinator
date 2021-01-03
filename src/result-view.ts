import { DollInfo } from './doll_info'

export class ResultView {
  private tableDOM: HTMLTableElement;
  private header: string[][] = [
    ['번호', 'id'], ['총기명', 'name'], 
    ['병종', 'type'], ['레어도', 'grade'], 
    ['제조시간', 'time'], ['중형\n한정', 'heavy_only'],
    ['체력', 'char_health'], ['화력', 'char_damage'], 
    ['회피', 'char_evasion'], ['명중', 'char_accuracy'],
    ['사속', 'char_rof'], ['기동력', 'char_move_speed'], 
    ['치명타율', 'char_critical'], ['장탄', 'char_clip_size'], 
    ['장갑', 'char_armor'], ['진형', 'tile'], 
    ['버프대상', 'buff_targets'], ['화력\n버프', 'buff_damage'],
    ['회피\n버프', 'buff_evasion'], ['명중\n버프', 'buff_accuracy'],
    ['사속\n버프', 'buff_rof'], ['치명\n버프', 'buff_critical'], 
    ['스킬\n쿨감', 'buff_ctime'], ['장갑\n버프', 'buff_armor'],
    ['스킬명', 'skill_name'], ['스킬분류', 'skill_type'],
    ['초기쿨', 'skill_ctime_init'], ['쿨타임', 'skill_ctime'],
    ['지속\n시간', 'skill_duration'], ['조준\n시간', 'skill_aimtime'],
    ['범위', 'skill_range'], ['배율', 'skill_ratio'],
    ['스킬대상', 'skill_target'], ['화력\n버프', 'skill_damage'], 
    ['회피\n버프', 'skill_evasion'], ['명중\n버프', 'skill_accuracy'], 
    ['사속\n버프', 'skill_rof'], ['치명\n버프', 'skill_critical'], 
    ['이속\n버프', 'skill_move_speed'], ['장탄\n버프', 'skill_clip_size'],
    ['장전\n단축', 'skill_reload'], ['장갑\n버프', 'skill_armor'], 
    ['스킬설명', 'skill_description']
  ];

  // 정렬 관련 상태
  private ascending: boolean = true;
  private lastAttr: string = null;
  
  public constructor() {
    this.tableDOM = document.getElementById('result') as HTMLTableElement;
  }

  public render(rc: ResultController): void {
    // 테이블을 다 지우고 다시 그린다.
    while (this.tableDOM.firstChild)
      this.tableDOM.removeChild(this.tableDOM.lastChild);

    // 헤더
    let tr = document.createElement('tr');
    tr.className = 'tr-header';
    this.tableDOM.appendChild(tr);

    
    for (const head of this.header) {
      let th = document.createElement('th');
      th.innerText = head[0];

      // 정렬 이벤트 핸들러 등록
      th.onclick = () => {
        rc.sort(head[1], this.ascending);
        this.render(rc);

        if (this.lastAttr === head[1]) {
          this.ascending = !this.ascending;
        }
        this.lastAttr = head[1];
      };
      tr.appendChild(th);
    }

    // 엔트리
    let isEven = true;
    for (const dollinfo of rc.result) {
      let tr = this.renderRow(dollinfo);
      this.tableDOM.appendChild(tr);

      // 색깔 (css 참조)
      tr.className = isEven ? 'tr-even' : 'tr-odd';      
      isEven = !isEven;
    }
  }

  private renderRow(dollinfo: DollInfo): HTMLTableRowElement {
    let tr = document.createElement('tr');

    tr.appendChild(this.createTD('' + dollinfo.id));

    // 이름을 누르면 소전DB로 이동한다.
    let td = this.createTD(dollinfo.name);
    td.onclick = () => {
      window.open(`https://gfl.zzzzz.kr/doll.php?id=${dollinfo.id}&lang=ko`);
    };
    tr.appendChild(td);
    
    tr.appendChild(this.createTD(dollinfo.type));
    tr.appendChild(this.createTD(this.createStars(dollinfo.grade)));
    tr.appendChild(this.createTD(this.createTime(dollinfo)));
    tr.appendChild(this.createTD(dollinfo.heavy_only ? 'O' : ''));
    
    tr.appendChild(this.createTD('' + dollinfo.char_health));
    tr.appendChild(this.createTD('' + dollinfo.char_damage));
    tr.appendChild(this.createTD('' + dollinfo.char_evasion));
    tr.appendChild(this.createTD('' + dollinfo.char_accuracy));
    tr.appendChild(this.createTD('' + dollinfo.char_rof));
    tr.appendChild(this.createTD('' + dollinfo.char_move_speed));
    tr.appendChild(this.createTD(this.percent(dollinfo.char_critical)));
    tr.appendChild(this.createTD(this.skipZero(dollinfo.char_clip_size)));
    tr.appendChild(this.createTD(this.skipZero(dollinfo.char_armor)));

    tr.appendChild(this.createTD(this.createTile(dollinfo.tile)));
    tr.appendChild(this.createTD(dollinfo.buff_targets.join(', ')));
    tr.appendChild(this.createTD(this.percent(dollinfo.buff_damage)));
    tr.appendChild(this.createTD(this.percent(dollinfo.buff_evasion)));
    tr.appendChild(this.createTD(this.percent(dollinfo.buff_accuracy)));
    tr.appendChild(this.createTD(this.percent(dollinfo.buff_rof)));
    tr.appendChild(this.createTD(this.percent(dollinfo.buff_critical)));
    tr.appendChild(this.createTD(this.percent(dollinfo.buff_ctime)));
    tr.appendChild(this.createTD(this.percent(dollinfo.buff_armor)));

    tr.appendChild(this.createTD(dollinfo.skill_name));
    tr.appendChild(this.createTD(dollinfo.skill_type));
    tr.appendChild(this.createTD('' + dollinfo.skill_ctime_init));
    tr.appendChild(this.createTD('' + dollinfo.skill_ctime));
    tr.appendChild(this.createTD(this.skipZero(dollinfo.skill_duration)));
    tr.appendChild(this.createTD(this.skipZero(dollinfo.skill_aimtime)));
    tr.appendChild(this.createTD(this.skipZero(dollinfo.skill_range)));
    tr.appendChild(this.createTD(this.skipZero(dollinfo.skill_ratio)));
    tr.appendChild(this.createTD(dollinfo.skill_target));
    tr.appendChild(this.createTD(this.percent(dollinfo.skill_damage)));
    tr.appendChild(this.createTD(this.percent(dollinfo.skill_evasion)));
    tr.appendChild(this.createTD(this.percent(dollinfo.skill_accuracy)));
    tr.appendChild(this.createTD(this.percent(dollinfo.skill_rof)));
    tr.appendChild(this.createTD(this.percent(dollinfo.skill_critical)));
    tr.appendChild(this.createTD(this.percent(dollinfo.skill_move_speed)));
    tr.appendChild(this.createTD(this.skipZero(dollinfo.skill_clip_size)));
    tr.appendChild(this.createTD(this.percent(dollinfo.skill_reload)));
    tr.appendChild(this.createTD(this.percent(dollinfo.skill_armor)));
    tr.appendChild(this.createTD(dollinfo.skill_description, {'width': '300px', 'textAlign': 'left'}));
 
    return tr;
  }

  private createTD(innerText: string, style: any = {}): HTMLTableDataCellElement {
    let td = document.createElement('td');
    td.innerText = innerText;
    for (const attr in style) {
      (td as any).style[attr] = style[attr];
    }
    return td;
  }

  private createStars(num: number): string {
    let out = '';
    for (let i = 0; i < num; ++i)
      out += '★';
    return out;
  }

  private createTime(dollinfo: DollInfo): string {
    if (dollinfo.time_h == null)
      return '제조불가';
    else
      return `${dollinfo.time_h}:${dollinfo.time_m < 10 ? '0' : ''}${dollinfo.time_m}`;
  }

  private percent(num: number): string {
    return num !== 0 ? Math.floor(num * 100) + '%' : '-';
  }

  private skipZero(num: number): string {
    return num !== 0 ? '' + num : '-';
  }

  private createTile(serialTile: string): string {
    let out = '';
    for (let i = 0; i < 9; ++i) {
      let c = serialTile.charAt(i);
      if (i > 0 && i % 3 === 0)
        out += '\n';
      if (c === '0')
        out += '▒';
      else if (c === '1')
        out += '■';
      else if (c === '2')
        out += '□';
    }
    return out;
  }
};

export class ResultController {
  result: DollInfo[];

  public setResult(dollinfos: DollInfo[]) {
    this.result = dollinfos;
  }

  public sort(attrName: string, ascending: boolean): void {
    if (!this.result)
      return;
    
    this.result = this.result.sort((infoA: any, infoB: any) => {
      let cmp = 0;

      // 시간의 경우만 시-분이 나눠져있어서 따로 계산해야 함
      if (attrName === 'time')
        cmp = infoA.time_h * 60 + infoA.time_m - (infoB.time_h * 60 + infoB.time_m);
      else
        cmp = this.compare(infoA[attrName], infoB[attrName]);
      return cmp * (ascending ? 1 : -1);
    });
  }

  private compare(a: any, b: any): number {
    if (typeof(a) === 'number') {
      // 숫자인 경우
      return a - b;
    }
    else {
      // 산술 불가능한 경우
      if (a > b)
        return 1;
      else if (a === b)
        return 0;
      else
        return -1;
    }
  }
};