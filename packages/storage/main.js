/**
 * storage 通用存储技术Promise封装
 * 重新命名接口，并附加一定功能
 * prefix，自动序列化，过期时间检测
 *
 * wx, localStorage, sessionStorage, localforge
 *
 * export { ...func }
 * */
const main = {
  _VERSION: '0.1.0',
  _NAME: '@voo/storage'
}

const support = ['local', 'session', 'weapp']

function getStorageApi(type) {
  if (!support[type]) {
    return noopStorage
  }
  return {}
}

function noop() {}

let noopStorage = {
  getItem: noop,
  setItem: noop,
  removeItem: noop,
  clear: noop
}

// 序列化
const serialize = val => {
  return JSON.stringify(val)
}

const deserialize = val => {
  if (typeof val !== 'string') {
    return undefined
  }
  try {
    return JSON.parse(val)
  } catch (e) {
    return val || undefined
  }
}

const isExp = (date, exptime = '') => {}

const final = storage => {
  return {
    set: () => {},
    get: noop,
    del: noop,
    clear: noop,
    has: noop,
    all: noop
  }
}

export default {}
