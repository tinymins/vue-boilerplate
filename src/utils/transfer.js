/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */
/* eslint no-param-reassign: "off" */

import { clone } from './util';

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
        if (newK !== k) {
          obj[newK] = obj[k];
          delete obj[k];
        }
      }
    });
    return obj;
  }
  if (typeof obj === 'string' && options.value) {
    const res = options.value(obj);
    cache.set(obj, res);
    return res;
  }
  cache.set(obj, obj);
  return obj;
};

export const camelizeString = str => str.split('_').map((s, i) => (
  (i === 0
    ? s.substring(0, 1).toLowerCase()
    : s.substring(0, 1).toUpperCase())
  + (s.toUpperCase() === s
    ? s.substring(1).toLowerCase()
    : s.substring(1))
)).join('');

export const camelize = (obj, { modify = false, key = true, value = false } = {}) => {
  const res = modify ? obj : clone(obj);
  const options = {
    key: key ? camelizeString : null,
    value: value ? camelizeString : null,
  };
  return recursiveAssignObject(res, options);
};

export const snakelizeString = str => str.split(/(?=[A-Z])/).map(p => p.toLowerCase()).join('_');

export const snakelize = (obj, { modify = false, key = true, value = false } = {}) => {
  const res = modify ? obj : clone(obj);
  const options = {
    key: key ? snakelizeString : null,
    value: value ? snakelizeString : null,
  };
  return recursiveAssignObject(res, options);
};

export const pascalizeString = str => str.split('_').map(s => s.substring(0, 1).toUpperCase() + s.substring(1)).join('');

export const pascalize = (obj, { modify = false, key = true, value = false } = {}) => {
  const res = modify ? obj : clone(obj);
  const options = {
    key: key ? pascalizeString : null,
    value: value ? pascalizeString : null,
  };
  return recursiveAssignObject(res, options);
};

export const imagesToGallery = images => images.map(image => ({
  thumbnail: image,
  original: image.replace(/\/small(?=\.jpg$|$)/g, ''),
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

export const dataToRoute = (data) => {
  if (data instanceof Array) {
    return data.map(item => dataToRoute(item));
  }
  const p = Object.assign({}, data);
  const type = p.type;
  const subType = p.subType;
  if (type === 'web' || type === 'open') {
    p.to = {
      mode: 'go',
      url: p.subType,
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
          if (id.match(/^\d+$/)) {
            r.name = 'secret_room';
            r.params.id = id;
            r.params.subid = 'topics';
          } else {
            r.name = 'secret_list';
            r.params.type = 'topic';
            r.params.subType = id;
          }
        } else if (subType.substr(0, 7) === 'topic_') {
          const [s, roomid, topic] = subType.substr(7).match(/(\d+)_(.+)/) || [];
          if (s) {
            r.name = 'secret_room';
            r.params.id = roomid;
            r.params.subid = `topic_${topic}`;
          }
        }
        break;
    }
    if (r.name) p.to = { mode: 'push', route: r };
  } else if (type === 'filters') {
    p.to = {
      mode: 'push',
      route: {
        name: 'secret_group_filters',
        params: { group: subType },
      },
    };
  } else if (type === 'room') {
    p.to = {
      mode: 'push',
      route: {
        name: 'secret_room',
        params: { id: subType },
      },
    };
  } else if (type === 'posts') {
    const args = subType.split('?');
    const types = splitL(args[0]);
    const queries = {};
    if (args[1]) {
      args[1].split('&').forEach((query) => {
        const kv = query.split('=');
        queries[kv[0]] = kv[1];
      });
    }
    const route = { query: queries };
    if (types[0] === 'room') {
      const id = types.length === 2 ? types[1] : types[2];
      const subid = types.length === 2
        ? undefined
        : types.filter((_, i) => i !== 0 && i !== 2).join('_');
      route.name = 'secret_room';
      route.params = { id, subid };
    } else {
      route.name = 'secret_list';
      route.params = {
        type: types[0],
        subType: types.filter((_, i) => i !== 0).join('_') || undefined, // Can not be empty string or router will report error.
      };
    }
    p.to = { mode: 'push', route };
  } else if (type === 'post') {
    p.to = {
      mode: 'push',
      route: {
        name: 'secret_detail',
        params: { id: subType },
      },
    };
  } else if (type === 'user') {
    p.to = {
      mode: 'push',
      route: {
        name: 'user_other',
        params: { id: subType },
      },
    };
  } else if (type === 'nav') {
    p.to = {
      mode: 'replace',
      route: p.subType,
    };
  } else if (type === 'order') {
    p.to = {
      mode: 'push',
      route: {
        name: 'play_order_detail',
        params: { id: subType },
      },
    };
  } else if (type === 'service') {
    p.to = {
      mode: 'push',
      route: {
        name: 'play_service_detail',
        params: { id: subType },
      },
    };
  }
  // 保证该函数如果返回的路由对象`to.route` 则必定包含完整的`params`和`query`对象 防止外部判断出错
  if (p.to && p.to.route) {
    if (!p.to.route.params) {
      p.to.route.params = {};
    }
    if (!p.to.route.query) {
      p.to.route.query = {};
    }
  }
  return p;
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
  return $div.innerHTML.replace(/\s/ig, '&nbsp;');
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
    topic: parseTopic = true,
    emotion: parseEmotion = true,
    serial: parseSerial = true,
    posts: parsePosts = true,
    name: parseName = true,
    newline: parseNewline = true,
    url: parseUrl = true,
    music: parseMusic = true,
    markdownLink: parseMarkdownLink = false,
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
      if (state !== 'text') { // 解码失败 没有匹配到末尾 回退到匹配起始点
        pushText(text, start, start, contents);
        pushed = true;
        step = start - pos + 1;
        state = 'text';
      } else {
        pushText(text, start, pos, contents);
        pushed = true;
      }
    } else if (state === 'text') {
      let content;
      if (code === CODE_SHARP && prevCode !== CODE_AND) {
        if (!content && parseTopic !== false) {
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
        if (!content && parseEmotion !== false) {
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
        if (!content && parseSerial !== false) {
          const [serialIdText] = text.substr(pos).match(/^#[0-9]+/) || [];
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
        if (!content && parsePosts !== false) {
          const [postIdText] = text.substr(pos).match(/^@[0-9]+/) || [];
          if (postIdText) {
            content = {
              type: 'posts',
              text: postIdText,
              id: parseInt(postIdText.substr(1), 10),
            };
            step = postIdText.length;
          }
        }
        if (!content && parseName !== false) {
          const atText = (text.substr(pos).match(/^(@[_\w\u3400-\ua4ff\uf900-\ufaff]{1,8})/) || [])[1];
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
        if (!content && parseNewline !== false) {
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
        if (!content && parseUrl !== false) {
          const [urlText] = text.substr(pos)
            .match(/^https?:\/\/(?:tieba\.baidu|www\.bilibili|weibo)\.com\/[0-9a-zA-Z\\?\\#\\.&;,%/-_]*/) || [];
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
        if (!content && parseMusic !== false) {
          const [musicText, musicName, musicSrc] = text.substr(pos)
            .match(/^\{~(.+?)\|(http.+?)~\}/) || [];
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
        if (!content && parseMarkdownLink !== false) {
          const [linkText, linkTitle, linkUrl] = text.substr(pos).match(/^\[([^\]]+)\]\(([-a-zA-Z0-9@:%_+.~#?&//=]+)\)/) || [];
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
        if (content.html === undefined) {
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

export const cleanObject = (obj, ks = [undefined, null]) => {
  const ret = {};
  Object.keys(obj).forEach((k) => {
    if (!ks.includes(obj[k])) {
      ret[k] = obj[k];
    }
  });
  return ret;
};

export const parseMessage = (item) => {
  if (item instanceof Array) {
    return item.map(p => parseMessage(p));
  }
  if (item.type === 'TIMCustomElem') {
    let type = item.type;
    let data = item.content.data;
    try {
      data = JSON.parse(item.content.data);
      if (data.type === 'template' && data.data.go) {
        data.data.route = dataToRoute(data.data.go);
      }
      type = `HM${pascalizeString(data.type)}Elem`;
    } catch (err) {}
    return {
      type,
      content: {
        data,
        desc: item.content.desc,
        ext: item.content.ext,
      },
    };
  }
  return camelize(item);
};
