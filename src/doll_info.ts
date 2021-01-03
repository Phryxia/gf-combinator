import { Util } from './util';

/*
  전술인형의 정보를 저장하는 클래스
  가급적이면 글로벌 GF 위키에서 쓰는 표현으로 변수명을 명명하였음.
*/
export class DollInfo {
  public id: number;              // 번호
  public name: string;            // 총기명
  public type: string;            // 병종
  public grade: number;           // 등급
  public time_h: number | null;   // 제작시간(시) null이면 제조불가
  public time_m: number | null;   // 제작시간(분) null이면 제조불가
  public heavy_only: boolean;     // 중형한정

  /*
    기본 스탯
  */
  public char_health: number;     // 체력
  public char_damage: number;     // 화력
  public char_evasion: number;    // 회피
  public char_accuracy: number;   // 명중
  public char_rof: number;        // 사속
  public char_move_speed: number; // 기동력
  public char_critical: number;   // 치명타율, 0 ~ 1
  public char_clip_size: number;  // 장탄수
  public char_armor: number;      // 장갑

  /*
    진형버프 스탯
  */
  public tile: string;            // 진형버프, 9자리 숫자 나열
  public buff_targets: string[];  // 대상
  public buff_damage: number;     // 화력버프, 실수
  public buff_evasion: number;    // 회피버프
  public buff_accuracy: number;   // 명중버프
  public buff_rof: number;        // 사속버프
  public buff_critical: number;   // 치명버프
  public buff_ctime: number;      // 스킬쿨감
  public buff_armor: number;      // 장갑버프

  /*
    스킬
  */
  public skill_name: string;      // 스킬명
  public skill_type: string;      // 스킬분류
  public skill_ctime_init: number;// 초기쿨타임, 실수
  public skill_ctime: number;     // 쿨타임, 실수
  public skill_duration: number;  // 지속시간, 실수
  public skill_aimtime: number;   // 조준시간, 스킬분류가 저격인 경우에 유효
  public skill_range: number;     // 범위, 스킬분류가 광역피해인 경우에 유효
  public skill_ratio: number;     // 배율
  public skill_target: string;    // 스킬대상
  public skill_damage: number;    // 스킬 화력버프, 실수
  public skill_evasion: number;   // 스킬 회피버프
  public skill_accuracy: number;  // 스킬 명중버프
  public skill_rof: number;       // 스킬 사속버프
  public skill_critical: number;  // 스킬 치명버프
  public skill_move_speed: number;// 스킬 이속버프
  public skill_clip_size: number; // 스킬 장탄버프
  public skill_reload: number;    // 스킬 장전단축
  public skill_armor: number;     // 스킬 장갑버프
  public skill_description: string;// 스킬 설명

  constructor(data: string[]) {
    let cnt = 0;
    this.id = Number.parseInt(data[cnt++]);
    this.name = data[cnt++];
    this.type = data[cnt++];
    this.grade = Number.parseInt(data[cnt++]);

    // 시간 처리
    let time_str = data[cnt++];
    if (time_str) {
      const hhmmss = time_str.split(':');
      this.time_h = Number.parseInt(hhmmss[0]);
      this.time_m = Number.parseInt(hhmmss[1]);
    }
    else {
      this.time_h = null;
      this.time_m = null;
    }

    this.heavy_only = data[cnt++] === 'O';

    this.char_health = Number.parseInt(data[cnt++]);
    this.char_damage = Number.parseInt(data[cnt++]);
    this.char_evasion = Number.parseInt(data[cnt++]);
    this.char_accuracy = Number.parseInt(data[cnt++]);
    this.char_rof = Number.parseInt(data[cnt++]);
    this.char_move_speed = Number.parseInt(data[cnt++]);
    this.char_critical = Number.parseFloat(data[cnt++]);
    this.char_clip_size = Number.parseInt(Util.defaultValue(data[cnt++], '0'));
    this.char_armor = Number.parseInt(Util.defaultValue(data[cnt++], '0'));

    this.tile = Util.defaultValue(data[cnt++], '000020000');
    this.buff_targets = this.extract_targets(data[cnt++]);
    this.buff_damage = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.buff_evasion = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.buff_accuracy = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.buff_rof = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.buff_critical = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.buff_ctime = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.buff_armor = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));

    this.skill_name = data[cnt++];
    this.skill_type = data[cnt++];
    this.skill_ctime_init = Number.parseFloat(data[cnt++]);
    this.skill_ctime = Number.parseFloat(data[cnt++]);
    this.skill_duration = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.skill_aimtime = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.skill_range = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.skill_ratio = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.skill_target = data[cnt++];
    this.skill_damage = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.skill_evasion = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.skill_accuracy = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.skill_rof = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.skill_critical = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.skill_move_speed = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.skill_clip_size = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.skill_reload = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.skill_armor = Number.parseFloat(Util.defaultValue(data[cnt++], '0.0'));
    this.skill_description = data[cnt++];
  }

  // AR, SMG => ['AR', 'SMG']
  private extract_targets(targets: string): string[] {
    let out: string[] = targets.split(',');
    out = out.map((target) => target.trim());
    out = out.sort();
    return out;
  }
};