
const WrapPromise = (func) => {
  return new Promise(resolve => resolve(func))
}

const newSetLocal = (k, v) => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(k, serialize(v))
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

const Engines = {
  localStorage: {
    drive: 'window.localStorage',
    setItem: (k, v) => localStorage.setItem(k, serialize(v)),
    getItem: (k) => deserialize(localStorage.getItem(k)),
    removeItem: (k) => localStorage.removeItem(k),
    clear: () => localStorage.clear(),
  },
  sessionStorage: {
    drive: 'window.sessionStorage',
    setItem: (k, v) => sessionStorage.setItem(k, serialize(v)),
    getItem: (k) => deserialize(sessionStorage.getItem(k)),
    removeItem: (k) => sessionStorage.removeItem(k),
    clear: () => sessionStorage.clear(),
  },
  wxSyncStorage: {
    drive: 'wxStorageSync',
    setItem: (k, v) => wx.setStorageSync(k, v),
    getItem: (k) => wx.getStorageSync(k),
    removeItem: (k) => wx.removeStorageSync(k),
    clear: () => wx.clearStorageSync()
  },
  wxStorage: {
    drive: 'wxStorageSync',
    setItem: (k, v) => wx.setStorage(k, v),
    getItem: (k) => wx.getStorage(k),
    removeItem: (k) => wx.removeStorage(k),
    clear: () => wx.clearStorage()
  }
  // forageStorage: {
  //   drive: 'localforage',
  //   setItem: (k, v) => localForage.setItem(k, v),
  //   getItem: (k) => localForage.getItem(k),
  //   removeItem: (k) => localForage.removeItem(k),
  //   clear: () => localForage.clear(),
  // },
}

function setStorage (type = 'local', promise = true) {
  const stor = Engines[`${type}Storage`]
  
  if (!promise) return stor
  // Wrap Promise
  return {
    setItem: (key, val) => {
      return new Promise((resolve, reject) => {
        resolve(stor.setItem(key, val))
      })
    },
    getItem: (key) => {
      return new Promise((resolve, reject) => {
        resolve(stor.getItem(key))
      })
    },
    removeItem: (key) => {
      return new Promise((resolve, reject) => {
        resolve(stor.removeItem(key))
      })
    },
    clear: () => {
      return new Promise((resolve, reject) => {
        resolve(stor.clear())
      })
    }
  }
}

const storage = {
  _name: 'vd general storage drive',
  _version: '0.2.0',
  type: 'local',
  namespace: '',
  prefix: '',
  expTime: '',
  f: null,
  config({ namespace = '', prefix = '', expTime = '', type = 'local' }) {
    this.namespace = namespace
    this.prefix = prefix
    this.expTime = expTime
    this.type = type
    this.f = setStorage(type)
    return this
  },
}

storage.f = setStorage(storage.type)
// storage.f = Engines[`${storage.type}Storage`]

const api = {
  set(key, value, overwrite) {
    if (this.namespace !== '') {
      const origin = this.f.getItem(this.namespace) || {}
      // console.log(origin)
      origin[key] = value
      this.f.setItem(this.namespace, origin)
      return
    }
    this.f.setItem(key, value)
  },
  get(key) {
    if (this.namespace !== '') {
      const origin = this.f.getItem(this.namespace) || {}
      return origin[key]
    }

    const value = this.f.getItem(key)
    return value
  },
  del(key) {
    if (this.namespace !== '') {
      const origin = this.f.getItem(this.namespace) || {}
      delete origin[key]
      this.f.setItem(this.namespace, origin)
    }
    this.f.removeItem(key)
  },
  clear() {
    this.f.clear()
  },
  has(key) {
    return this.get(key) !== undefined
  },
}

Object.assign(storage, api)

export default storage