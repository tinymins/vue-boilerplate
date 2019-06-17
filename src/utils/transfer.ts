/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint max-depth: "off" */
/* eslint no-param-reassign: "off" */

import { clone } from './util';

const arrayToObject = (a: any[]): any => {
  const o = {};
  a.forEach((k) => {
    o[k] = true;
  });
  return o;
};

/**
 * 递归处理对象配置项
 */
export interface RecursiveAssignObjectOptions {
  /**
   * 是否修改原对象
   */
  modify?: boolean;
  /**
   * 是否转化键
   */
  key?: boolean | null;
  /**
   * 想要转化的键留空表示所有
   */
  keys?: string[];
  /**
   * 是否转化值
   */
  value?: boolean | null;
  /**
   * 想要转化的值留空表示所有
   */
  values?: string[];
}

const recursiveAssignObject = (obj: Iterable<any>, options, cache = new Map()): Iterable<any> => {
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  if (typeof obj === 'object' && obj !== null) {
    cache.set(obj, obj); // forbid circular object
    Object.keys(obj).forEach((k) => {
      // must process children first, cause key may get changed later
      obj[k] = recursiveAssignObject(obj[k], options, cache);
      // process key
      if (options.key) {
        const newK = options.key(k);
        if (newK !== k && (!options.keys || options.keys[k] || options.keys[newK])) {
          obj[newK] = obj[k];
          delete obj[k];
        }
      }
    });
    return obj;
  }
  if (typeof obj === 'string' && options.value) {
    const res = options.value(obj);
    if (!options.values || options.values[obj] || options.values[res]) {
      cache.set(obj, res);
      return res;
    }
  }
  cache.set(obj, obj);
  return obj;
};

/**
 * 将一个字符串转化为小驼峰形式
 * @param {string} str 源字符串
 * @returns {string} 结果字符串
 */
export const camelizeString = (str: string): string => str.split('_').map((s, i) => (
  i === 0
    ? s.substring(0, 1).toLowerCase()
    : s.substring(0, 1).toUpperCase())
  + (s.toUpperCase() === s
    ? s.substring(1).toLowerCase()
    : s.substring(1))).join('');

/**
 * 将一个对象转化为小驼峰形式
 * @param {string} obj 源对象
 * @param {object} options 配置项
 * @returns {string} 结果字符串
 */
export const camelize = (obj, {
  modify = false,
  key = true,
  keys = void 0,
  value = false,
  values = void 0,
}: RecursiveAssignObjectOptions = {}): any => {
  const res = modify ? obj : clone(obj);
  const options = {
    key: key || keys ? camelizeString : null,
    keys: keys ? arrayToObject(keys) : null,
    value: value || values ? camelizeString : null,
    values: values ? arrayToObject(values) : null,
  };
  return recursiveAssignObject(res, options);
};

export const snakelizeString = (str: string): string => str.split(/(?=[A-Z])/u).map(p => p.toLowerCase()).join('_');

export const snakelize = (obj, {
  modify = false,
  key = true,
  keys = void 0,
  value = false,
  values = void 0,
}: RecursiveAssignObjectOptions = {}): any => {
  const res = modify ? obj : clone(obj);
  const options = {
    key: key ? snakelizeString : null,
    keys: keys ? arrayToObject(keys) : null,
    value: value ? snakelizeString : null,
    values: values ? arrayToObject(values) : null,
  };
  return recursiveAssignObject(res, options);
};

export const pascalizeString = (str: string): string => str.split('_').map(s => s.substring(0, 1).toUpperCase() + s.substring(1)).join('');

export const pascalize = (obj, {
  modify = false,
  key = true,
  keys = void 0,
  value = false,
  values = void 0,
}: RecursiveAssignObjectOptions = {}): any => {
  const res = modify ? obj : clone(obj);
  const options = {
    key: key ? pascalizeString : null,
    keys: keys ? arrayToObject(keys) : null,
    value: value ? pascalizeString : null,
    values: values ? arrayToObject(values) : null,
  };
  return recursiveAssignObject(res, options);
};

export const replaceObjectKey = (oriObj, keymaps: Iterable<any>): Iterable<any> => {
  const obj: Iterable<any> = clone(oriObj);
  Object.entries(keymaps).forEach(([k, v]) => {
    obj[v] = obj[k];
    delete obj[k];
  });
  return obj;
};

export interface GalleryItemData {
  thumbnail: string;
  original: string;
}

export const imagesToGallery = (images: string[]): GalleryItemData[] => images.map(image => ({
  thumbnail: image,
  original: image.replace(/\/small(?=\.jpg$|$)/gu, ''),
}));

export const splitL = (s: string, n = 2, sp = '_'): string[] => {
  const a = s.split(sp);
  if (a.length <= n) {
    return a;
  }
  const r: string[] = [];
  for (let i = 0; i < n; i += 1) {
    const part = a.shift();
    if (part) {
      r.push(part);
    }
  }
  r.push(a.join('_'));
  return r;
};

const CODE_H = 'h'.charCodeAt(0);
const CODE_AT = '@'.charCodeAt(0);
const CODE_LF = '\n'.charCodeAt(0);
const CODE_AND = '&'.charCodeAt(0);
const CODE_SHARP = '#'.charCodeAt(0);
const CODE_LBRACE = '{'.charCodeAt(0);
const CODE_LBRACKET = '['.charCodeAt(0);

const getLongestPrefixMatch = (haystack, pos, needles): string => needles
  .filter(needle => haystack.indexOf(needle, pos) === pos)
  .sort(needle => needle.length)[0];

export const htmlEscape = (s): string => {
  const $div = document.createElement('div');
  $div.innerText = s;
  return $div.innerHTML.replace(/\s/igu, '&nbsp;');
};

const pushText = (text, start, end, result): void => {
  if (start > end) {
    return;
  }
  const last = result[result.length - 1];
  const count = (end - start) + 1;
  const textAddition = text.substr(start, count);
  const htmlAddition = htmlEscape(textAddition);
  if (last && last.type === 'text') {
    last.text += textAddition;
    last.html += htmlAddition;
  } else {
    result.push({
      type: 'text',
      text: textAddition,
      html: htmlAddition,
    });
  }
};

export const parseContents = (text, {
  // topics = [] as { text: string }[],
  emotions = [] as { text: string }[],
  parsers: {
    topic: isParseTopic = true,
    emotion: isParseEmotion = true,
    serial: isParseSerial = true,
    posts: isParsePosts = true,
    name: isParseName = true,
    newline: isParseNewline = true,
    url: isParseURL = true,
    music: isParseMusic = true,
    markdownLink: isParseMarkdownLink = false,
  } = {},
} = {}): string[] => {
  let pos = 0;
  let code = 0;
  let prevCode = 0;
  let step = 1;
  let pushed = false;
  let start = 0;
  let state = 'text';
  let paragraphLen = 0;
  const len = text.length;
  const contents: string[] = [];
  // const topicsText = topics.map(topic => `#${topic.text}#`);
  const emotionsText = emotions.map(emotion => `#${emotion.text}`);
  while (pos <= len) {
    prevCode = code;
    code = text.charCodeAt(pos);
    step = 1;
    pushed = false;
    if (pos === len) {
      if (state === 'text') {
        pushText(text, start, pos, contents);
        pushed = true;
      } else { // 解码失败 没有匹配到末尾 回退到匹配起始点
        pushText(text, start, start, contents);
        pushed = true;
        step = start - pos + 1;
        state = 'text';
      }
    } else if (state === 'text') {
      let content;
      if (code === CODE_SHARP && prevCode !== CODE_AND) {
        if (!content && isParseTopic !== false && pos === 0) {
          const stop = text.indexOf('#', pos + 1);
          if (stop > pos) {
            const topicText = text.substring(pos, stop + 1);
            content = {
              type: 'topic',
              text: topicText,
              topic: topicText.substring(1, topicText.length - 1),
            };
            step = topicText.length;
          }
          // const topicText = getLongestPrefixMatch(text, pos, topicsText);
          // if (topicText) {
          //   content = {
          //     type: 'topic',
          //     text: topicText,
          //     topic: topics[topicsText.indexOf(topicText)],
          //   };
          //   step = topicText.length;
          // }
        }
        if (!content && isParseEmotion !== false) {
          const emotionText = getLongestPrefixMatch(text, pos, emotionsText);
          if (emotionText) {
            content = {
              type: 'emotion',
              text: emotionText,
              emotion: emotions[emotionsText.indexOf(emotionText)],
            };
            step = emotionText.length;
          }
        }
        if (!content && isParseSerial !== false) {
          const [serialIdText = null] = text.substr(pos).match(/^#[0-9]+/u) || [];
          if (serialIdText) {
            content = {
              type: 'serial',
              text: serialIdText,
              serial: parseInt(serialIdText.substr(1), 10),
            };
            step = serialIdText.length;
          }
        }
      } else if (code === CODE_AT) {
        if (!content && isParsePosts !== false) {
          const [postIdText = null] = text.substr(pos).match(/^@[0-9]+/u) || [];
          if (postIdText) {
            content = {
              type: 'posts',
              text: postIdText,
              id: parseInt(postIdText.substr(1), 10),
            };
            step = postIdText.length;
          }
        }
        if (!content && isParseName !== false) {
          const atText = (text.substr(pos).match(/^(@[_\w\u3400-\ua4ff\uf900-\ufaff]{1,8})/u) || [])[1];
          if (atText) {
            content = {
              type: 'name',
              text: atText,
              name: atText.substr(1),
            };
            step = atText.length;
          }
        }
      } else if (code === CODE_LF) {
        if (!content && isParseNewline !== false) {
          content = {
            type: 'newline',
            text: '\n',
            html: '<br>',
            paragraphLen,
          };
          step = 1;
          paragraphLen = -1;
        }
      } else if (code === CODE_H) {
        if (!content && isParseURL !== false) {
          const [urlText = null] = text.substr(pos)
            .match(/^https?:\/\/(?:tieba\.baidu|www\.bilibili|weibo)\.com\/[0-9a-zA-Z\\?\\#\\.&;,%/-_]*/u) || [];
          if (urlText) {
            content = {
              type: 'url',
              text: urlText,
              url: urlText,
            };
            step = urlText.length;
          }
        }
      } else if (code === CODE_LBRACE) {
        if (!content && isParseMusic !== false) {
          const [musicText = null, musicName = null, musicSrc = null] = text.substr(pos)
            .match(/^\{~(.+?)\|(http.+?)~\}/u) || [];
          if (musicText) {
            content = {
              type: 'music',
              text: `{~${musicName}~}`,
              src: musicSrc,
            };
            step = musicText.length;
          }
        }
      } else if (code === CODE_LBRACKET) {
        if (!content && isParseMarkdownLink !== false) {
          const [linkText = null, linkTitle = null, linkUrl = null] = text.substr(pos)
            .match(/^\[([^\]]+)\]\(([-a-zA-Z0-9@:%_+.~#?&//=]+)\)/u) || [];
          if (linkText) {
            content = {
              type: 'url',
              text: linkTitle,
              url: linkUrl,
            };
            step = linkText.length;
          }
        }
      }
      if (content) {
        pushText(text, start, pos - 1, contents);
        if (content.html === void 0) {
          content.html = htmlEscape(content.text);
        }
        contents.push(content);
        pushed = true;
      }
    }
    pos += step;
    paragraphLen += step;
    if (pushed) start = pos;
  }
  return contents;
};

export const toChinese = (value): string => {
  const list = [
    { en: 'solo', cn: '单排' },
    { en: 'duo', cn: '双排' },
    { en: 'squad', cn: '组排' },
    { en: 'solo-fpp', cn: '第一人称单排' },
    { en: 'duo-fpp', cn: '第一人称双排' },
    { en: 'Wins', cn: '吃鸡' },
    { en: 'Top 10s', cn: '前十场次' },
    { en: 'Rounds Played', cn: '场次' },
    { en: 'Kills', cn: '击败' },
    { en: 'K/D Ratio', cn: 'K/D值' },
    { en: 'Best Rank', cn: '最高RANK' },
    { en: 'Headshot Kills', cn: '爆头击杀' },
    { en: 'Round Most Kills', cn: '最多击杀' },
    { en: 'Max Kill Streaks', cn: '最多连杀' },
    { en: 'Longest Kill', cn: '最远击杀' },
    { en: 'Longest Time Survived', cn: '最长存活' },
    { en: 'Rating', cn: '积分' },
    { en: 'Kills Pg', cn: '场均击杀' },
    { en: 'Avg Dmg per Match', cn: '场均伤害' },
    { en: 'Vehicle Destroys', cn: '摧毁载具' },
    { en: 'Road Kills', cn: '载具击杀' },
    { en: 'Time Survived Pg', cn: '场均存活' },
    { en: 'Heals', cn: '治疗次数' },
    { en: 'Boosts', cn: '药剂次数' },
    { en: 'Move Distance', cn: '移动总距离' },
    { en: 'Walk Distance', cn: '行走总距离' },
    { en: 'Ride Distance', cn: '骑行总距离' },
    { en: 'Move Distance Pg', cn: '场均移动' },
    { en: 'Avg Walk Distance', cn: '场均行走' },
    { en: 'Avg Ride Distance', cn: '场均骑行' },
    { en: '2017-pre4', cn: '2017第四赛季' },
    { en: '2017-pre5', cn: '2017第五赛季' },
    { en: '2017-pre6', cn: '2017第六赛季' },
    { en: '2018-01', cn: '2018第一赛季' },
    { en: 'as', cn: '亚洲' },
    { en: 'sea', cn: '东南亚' },
    { en: 'krjp', cn: '日韩' },
    { en: 'oc', cn: '大洋洲' },
    { en: 'na', cn: '北美' },
    { en: 'sa', cn: '南美' },
    { en: 'eu', cn: '欧洲' },
  ];
  const item = list.find(p => p.en === value);
  if (item) {
    return item.cn;
  }
  return value;
};

// TODO: 实现自定义渐变色角度
// TODO: 实现检测gradient长度自动分配颜色点百分比
export const getIconGradientCSS = (gradient): Record<string, string> => ({
  'background-image': `-webkit-linear-gradient(right, ${gradient[0]} 3%, ${gradient[1]} 90%)`,
  '-webkit-background-clip': 'text',
});

export const formatCounter = (num, zero = num): string | number => {
  if (num >= 100000) {
    return `${Math.floor(num / 10000)}w`;
  }
  if (num >= 10000) {
    return `${Math.floor(num / 1000) / 10}w`;
  }
  if (num >= 1000) {
    return `${Math.floor(num / 100) / 10}k`;
  }
  if (num > 0) {
    return num;
  }
  return zero;
};

export const cleanObject = (obj, ks = [void 0, null]): Record<any, any> => {
  const ret = {};
  Object.keys(obj).forEach((k) => {
    if (!ks.includes(obj[k])) {
      ret[k] = obj[k];
    }
  });
  return ret;
};

const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const chnUnitSection = ['', '万', '亿', '万亿', '亿亿'];
const chnUnitChar = ['', '十', '百', '千'];
const SectionToChinese = (section): string => {
  let strIns = '';
  let chnStr = '';
  let unitPos = 0;
  let zero = true;
  while (section > 0) {
    const v = section % 10;
    if (v === 0) {
      if (!zero) {
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    } else {
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos += 1;
    section = Math.floor(section / 10);
  }
  return chnStr;
};
export const numberToChinese = (num): string => {
  let unitPos = 0;
  let strIns = '';
  let chnStr = '';
  let needZero = false;

  if (num === 0) {
    return chnNumChar[0];
  }

  while (num > 0) {
    const section = num % 10000;
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr;
    }
    strIns = SectionToChinese(section);
    strIns += section === 0 ? chnUnitSection[0] : chnUnitSection[unitPos];
    chnStr = strIns + chnStr;
    needZero = (section < 1000) && (section > 0);
    num = Math.floor(num / 10000);
    unitPos += 1;
  }

  return chnStr.replace(/^一十/igu, '十'); // 避免出现“一十一”
};

export const mosaicString = (str: string, prefixLen: number, suffixLen: number): string => {
  const len = str.length;
  const plainLen = len - prefixLen - suffixLen;
  if (plainLen <= 0) {
    return '*'.repeat(prefixLen + suffixLen);
  }
  return `${str.substr(0, prefixLen)}${'*'.repeat(plainLen)}${str.substr(str.length - suffixLen)}`;
};
