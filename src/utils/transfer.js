/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint max-depth: "off" */
/* eslint no-param-reassign: "off" */

import qs from 'querystringify';
import Url from 'url-parse';
import { clone } from './util';

const arrayToObject = (a) => {
  const o = {};
  a.forEach((k) => {
    o[k] = true;
  });
  return o;
};

const recursiveAssignObject = (obj, options, cache = new Map()) => {
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

export const camelizeString = str => str.split('_').map((s, i) => (
  i === 0
    ? s.substring(0, 1).toLowerCase()
    : s.substring(0, 1).toUpperCase())
  + (s.toUpperCase() === s
    ? s.substring(1).toLowerCase()
    : s.substring(1))).join('');

export const camelize = (obj, { modify = false, key = true, keys, value = false, values } = {}) => {
  const res = modify ? obj : clone(obj);
  const options = {
    key: key || keys ? camelizeString : null,
    keys: keys ? arrayToObject(keys) : null,
    value: value || values ? camelizeString : null,
    values: values ? arrayToObject(values) : null,
  };
  return recursiveAssignObject(res, options);
};

export const snakelizeString = str => str.split(/(?=[A-Z])/u).map(p => p.toLowerCase()).join('_');

export const snakelize = (obj, { modify = false, key = true, keys, value = false, values } = {}) => {
  const res = modify ? obj : clone(obj);
  const options = {
    key: key ? snakelizeString : null,
    keys: keys ? arrayToObject(keys) : null,
    value: value ? snakelizeString : null,
    values: values ? arrayToObject(values) : null,
  };
  return recursiveAssignObject(res, options);
};

export const pascalizeString = str => str.split('_').map(s => s.substring(0, 1).toUpperCase() + s.substring(1)).join('');

export const pascalize = (obj, { modify = false, key = true, keys, value = false, values } = {}) => {
  const res = modify ? obj : clone(obj);
  const options = {
    key: key ? pascalizeString : null,
    keys: keys ? arrayToObject(keys) : null,
    value: value ? pascalizeString : null,
    values: values ? arrayToObject(values) : null,
  };
  return recursiveAssignObject(res, options);
};

export const replaceObjectKey = (oriObj, keymaps) => {
  const obj = clone(oriObj);
  Object.entries(keymaps).forEach(([k, v]) => {
    obj[v] = obj[k];
    delete obj[k];
  });
  return obj;
};

export const imagesToGallery = images => images.map(image => ({
  thumbnail: image,
  original: image.replace(/\/small(?=\.jpg$|$)/gu, ''),
}));

export const splitL = (s, n = 2, sp = '_') => {
  const a = s.split(sp);
  if (a.length <= n) {
    return a;
  }
  const r = [];
  for (let i = 0; i < n; i += 1) {
    r.push(a.shift());
  }
  r.push(a.join('_'));
  return r;
};

export const parseUrl = (url) => {
  if (typeof url === 'number') {
    url = url.toString(10);
  } else if (typeof url !== 'string') {
    return null;
  }
  return Url(url, true);
};

export const parseNavLocation = ({ type, subType }) => {
  let location;
  if (type === 'web' || type === 'open') {
    location = {
      mode: 'go',
      url: subType,
    };
  } else if (type === 'page') {
    const r = { params: {}, query: {} };
    switch (subType) {
      case 'tops':
        r.name = 'secret_rank';
        r.params.type = 'active';
        break;
      case 'sign':
      case 'signed':
        r.name = 'user_sign';
        break;
      case 'codes':
        r.name = 'point';
        break;
      case 'topics':
        r.name = 'discover_topics';
        break;
      case 'addon':
        r.name = 'jx3_assists';
        break;
      case 'lucky':
        r.name = 'secret_lucky';
        break;
      case 'pubg_chicken':
        r.name = 'pubg_chicken';
        break;
      case 'pubg_stats':
        r.name = 'pubg_stats';
        break;
      case 'pubg_cms':
        r.name = 'cms';
        r.params.game = 'pubg';
        break;
      case 'cities':
        r.name = 'secret_group_filters';
        r.params.group = 'cities';
        r.query.to = '/secret/posts/{{type}}/{{subType}}';
        break;
      case 'rooms':
        r.name = 'secret_group_filters';
        r.params.group = 'rooms';
        r.query.to = '/secret/{{type}}/{{subType}}';
        break;
      case 'vip':
        r.name = 'user_vip';
        break;
      case 'sysmsg':
        r.name = 'msg_sysmsg';
        break;
      case 'stuff':
        r.name = 'user_stuff';
        break;
      case 'share':
        r.name = 'user_share';
        break;
      default:
        if (subType.substr(0, 7) === 'topics_') {
          const id = subType.substr(7);
          if (id.match(/^\d+$/u)) {
            r.name = 'secret_room';
            r.params.id = id;
            r.params.subid = 'topics';
          } else {
            r.name = 'secret_list';
            r.params.type = 'topic';
            r.params.subType = id;
          }
        } else if (subType.substr(0, 7) === 'topic_') {
          const [s, roomid, topic] = subType.substr(7).match(/(\d+)_(.+)/u) || [];
          if (s) {
            r.name = 'secret_room';
            r.params.id = roomid;
            r.params.subid = `topic_${topic}`;
          }
        }
        break;
    }
    if (r.name) {
      location = { mode: 'push', route: r };
    }
  } else if (type === 'filters') {
    location = {
      mode: 'push',
      route: {
        name: 'secret_group_filters',
        params: { group: subType },
      },
    };
  } else if (type === 'room') {
    location = {
      mode: 'push',
      route: {
        name: 'secret_room',
        params: { id: subType },
      },
    };
  } else if (type === 'posts') {
    const [url, query = ''] = subType.split('?');
    const types = splitL(url);
    const route = { query: qs.parse(query) };
    if (types[0] === 'room') {
      const id = types.length === 2 ? types[1] : types[2];
      const subid = types.length === 2
        ? void 0
        : types.filter((_, i) => i !== 0 && i !== 2).join('_');
      route.name = 'secret_room';
      route.params = { id, subid };
    } else {
      route.name = 'secret_list';
      route.params = {
        type: types[0],
        subType: types.filter((_, i) => i !== 0).join('_') || void 0, // Can not be empty string or router will report error.
      };
    }
    location = { mode: 'push', route };
  } else if (type === 'post') {
    const [id, query = ''] = subType.split('?');
    location = {
      mode: 'push',
      route: {
        name: 'secret_detail',
        params: { id },
        query: qs.parse(query),
      },
    };
  } else if (type === 'user') {
    location = {
      mode: 'push',
      route: {
        name: 'user_other',
        params: { id: subType },
      },
    };
  } else if (type === 'nav') {
    location = {
      mode: 'replace',
      route: subType,
    };
  } else if (type === 'order') {
    location = {
      mode: 'push',
      route: {
        name: 'play_order_detail',
        params: { id: subType },
      },
    };
  } else if (type === 'service') {
    location = {
      mode: 'push',
      route: {
        name: 'play_service_detail',
        params: { id: subType },
      },
    };
  }
  // 保证该函数如果返回的路由对象`to.route` 则必定包含完整的`params`和`query`对象 防止外部判断出错
  if (location && location.route) {
    if (!location.route.params) {
      location.route.params = {};
    }
    if (!location.route.query) {
      location.route.query = {};
    }
  }
  return location;
};

export const fillNavLocation = (data) => {
  if (data instanceof Array) {
    return data.map(item => fillNavLocation(item));
  }
  return Object.assign({}, data, { location: parseNavLocation(data) });
};

const CODE_H = 'h'.charCodeAt(0);
const CODE_AT = '@'.charCodeAt(0);
const CODE_LF = '\n'.charCodeAt(0);
const CODE_AND = '&'.charCodeAt(0);
const CODE_SHARP = '#'.charCodeAt(0);
const CODE_LBRACE = '{'.charCodeAt(0);
const CODE_LBRACKET = '['.charCodeAt(0);

const getLongestPrefixMatch = (haystack, pos, needles) => needles
  .filter(needle => haystack.indexOf(needle, pos) === pos)
  .sort(needle => needle.length)[0];

export const htmlEscape = (s) => {
  const $div = document.createElement('div');
  $div.innerText = s;
  return $div.innerHTML.replace(/\s/igu, '&nbsp;');
};

const pushText = (text, start, end, result) => {
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
  topics = [],
  emotions = [],
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
} = {}) => {
  let pos = 0;
  let code = 0;
  let prevCode = 0;
  let step = 1;
  let pushed = false;
  let start = 0;
  let state = 'text';
  let paragraphLen = 0;
  const len = text.length;
  const contents = [];
  const topicsText = topics.map(topic => `#${topic.text}#`);
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
        if (!content && isParseTopic !== false) {
          const topicText = getLongestPrefixMatch(text, pos, topicsText);
          if (topicText) {
            content = {
              type: 'topic',
              text: topicText,
              topic: topics[topicsText.indexOf(topicText)],
            };
            step = topicText.length;
          }
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
          const [serialIdText] = text.substr(pos).match(/^#[0-9]+/u) || [];
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
          const [postIdText] = text.substr(pos).match(/^@[0-9]+/u) || [];
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
          const [urlText] = text.substr(pos)
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
          const [musicText, musicName, musicSrc] = text.substr(pos)
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
          const [linkText, linkTitle, linkUrl] = text.substr(pos).match(/^\[([^\]]+)\]\(([-a-zA-Z0-9@:%_+.~#?&//=]+)\)/u) || [];
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

export const toChinese = (value) => {
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
export const getIconGradientCSS = gradient => ({
  'background-image': `-webkit-linear-gradient(right, ${gradient[0]} 3%, ${gradient[1]} 90%)`,
  '-webkit-background-clip': 'text',
});

export const formatCounter = (num, zero = num) => {
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

export const cleanObject = (obj, ks = [void 0, null]) => {
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
const SectionToChinese = (section) => {
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
export const numberToChinese = (num) => {
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

export const mosaicString = (str, prefixLen, suffixLen) => {
  const len = str.length;
  const plainLen = len - prefixLen - suffixLen;
  if (plainLen <= 0) {
    return '*'.repeat(prefixLen + suffixLen);
  }
  return `${str.substr(0, prefixLen)}${'*'.repeat(plainLen)}${str.substr(str.length - suffixLen)}`;
};
