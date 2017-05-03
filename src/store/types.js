/*
* @Author: William Chan
* @Date:   2017-05-03 15:31:00
* @Last Modified by:   William Chan
* @Last Modified time: 2017-05-03 19:32:03
*/

const exportVar = (enumerate, ...args) => {
  const data = {};
  const type = [].concat(...args);
  type.forEach((action) => {
    data[action] = `${enumerate}_${action}`;
  });
  return data;
};

export const USER = exportVar('USER',
  'GET', 'DEBUG', 'LOGOUT',
);
export const SECRET = exportVar('SECRET',
  'AAA', 'BBB',
);
