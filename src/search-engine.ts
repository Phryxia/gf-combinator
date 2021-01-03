import { DollInfo } from './doll_info';
import { Util } from './util';

abstract class SearchEngine {
  public abstract search(keywords: string[], dollinfos: DollInfo[]): DollInfo[];
};

export class BuffSearchEngine extends SearchEngine {
  /*
    진형버프를 대상으로 검색을 실시한다.
    병종 키워드의 경우, 인형이 해당 병종에게 버프를 줄 수 있으면 검색된다.
    스탯 키워드의 경우, 모든 해당 스탯 버프를 줄 수 있을 때 검색된다.
  */
  public search(keywords: string[], dollinfos: DollInfo[]): DollInfo[] {
    // keyword 분석
    const type_words = ['AR', 'SMG', 'RF', 'HG', 'MG', 'SG', 'ALL']; // 대상 병종에 대한 키워드
    const stat_words = ['화력', '회피', '명중', '사속', '치명', '스킬쿨감', '장갑'];
    const type_keys = keywords.filter(keyword => Util.isIn(keyword, type_words));
    const stat_keys = keywords.filter(keyword => Util.isIn(keyword, stat_words));

    const result = dollinfos.filter((dollinfo: DollInfo) => {
      // 대상 병종은 OR로 처리한다.
      let criteria = false;
      for (const type_key of type_keys)
        if (Util.isIn(type_key, dollinfo.buff_targets))
          criteria ||= true;
      
      // 병종에 대한 언급이 있으면서 버프대상이 ALL인 경우 true
      criteria ||= type_keys.length > 0 && Util.isIn('ALL', dollinfo.buff_targets);

      // 병종에 대해 딱히 언급이 없으면 true로 놓는다.
      criteria ||= type_keys.length === 0;

      // 스탯에 대한 언급이 있으면 스탯 분석을 한다.
      if (stat_keys.length > 0) {
        for (const stat_key of stat_keys) {
          criteria &&= !(stat_key === '화력' && dollinfo.buff_damage === 0)
            && !(stat_key === '회피' && dollinfo.buff_evasion === 0)
            && !(stat_key === '명중' && dollinfo.buff_accuracy === 0)
            && !(stat_key === '사속' && dollinfo.buff_rof === 0)
            && !(stat_key === '치명' && dollinfo.buff_critical === 0)
            && !(stat_key === '스킬쿨감' && dollinfo.buff_ctime === 0)
            && !(stat_key === '장갑' && dollinfo.buff_armor === 0);
        }
      }

      return criteria;
    });
    return result;
  }
};

export class SkillSearchEngine extends SearchEngine {
  /*
    스킬을 대상으로 검색한다.
    병종 키워드의 경우 해당 병종과 관계있어야 검색된다.
    스탯 키워드의 경우 메타데이터의 증감률이 0이 아니면 검색된다.
    또한 모든 키워드에 대하여 스트링 검색을 하여 매치되면 검색된다.
  */
  public search(keywords: string[], dollinfos: DollInfo[]): DollInfo[] {
    // 키워드 분석
    const type_words = ['AR', 'SMG', 'RF', 'HG', 'MG', 'SG', 'ALL'];
    const type_keys = keywords.filter(keyword => Util.isIn(keyword, type_words));
    const stat_words = ['화력', '회피', '명중', '사속', '치명', '이동속도', '장탄', '장전단축', '장갑'];
    const stat_keys = keywords.filter(keyword => Util.isIn(keyword, stat_words));

    let result = dollinfos.map(dollinfo => {
      // DollInfo별로 Rank를 구한다.
      let rank = 0;

      // 스탯 키워드 매칭
      for (const stat_key of stat_keys) {
        if ((stat_key === '화력' && dollinfo.skill_damage !== 0)
          || (stat_key === '회피' && dollinfo.skill_evasion !== 0)
          || (stat_key === '명중' && dollinfo.skill_accuracy !== 0)
          || (stat_key === '사속' && dollinfo.skill_rof !== 0)
          || (stat_key === '치명' && dollinfo.skill_critical !== 0)
          || (stat_key === '이동속도' && dollinfo.skill_move_speed !== 0)
          || (stat_key === '장탄' && dollinfo.skill_clip_size !== 0)
          || (stat_key === '장전단축' && dollinfo.skill_reload !== 0)
          || (stat_key === '장갑' && dollinfo.skill_armor !== 0)) {
          rank += 5;
        }
      }
      
      for (const keyword of keywords) {
        // 일반적인 텍스트 매칭 for skill name
        if (dollinfo.skill_name === keyword)
          rank += 100;
        
        // 스킬종류
        if (dollinfo.skill_type.search(keyword) !== -1)
          rank += 10;

        // 스킬대상
        if (dollinfo.skill_target.search(keyword) !== -1)
          rank += 10;

        // 스킬설명
        if (dollinfo.skill_description.search(keyword) !== -1)
          rank += 1;
      }

      // 병종 필터
      if (type_keys.length > 0) {
        let criteria = false;

        // 입력한 병종 중 하나라도 맞으면 OK
        for (const type_key of type_keys)
          if (type_key === dollinfo.type)
            criteria = true;

        if (!criteria)
          rank = 0;
        else
          rank += 10;
      }

      return [dollinfo, rank];
    });
    result = result.filter((pair: any) => pair[1] > 0);
    result = result.sort((a: any, b: any) => {
      return - a[1] + b[1];
    });
    return result.map((pair: any) => pair[0]);
  }
};