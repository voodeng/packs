const store = localStorage

return {
  setItem: (key, val) => {
    return new Promise((resolve, reject) => {
      try {
        store.setItem(key, val)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
  getItem: (key) => {
    return new Promise((resolve, reject) => {
      try {
        store.getItem(key)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
  removeItem: (key) => {
    return new Promise((resolve, reject) => {
      try {
        store.removeItem(key)
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
  clear: () => {
    return new Promise((resolve, reject) => {
      try {
        store.clear()
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  }
}