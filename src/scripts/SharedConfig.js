/* eslint-disable no-undef */
/* eslint-disable no-empty */
/* eslint-disable require-jsdoc */

class GlobalConfig {
  MEMORY_STORAGE = 0
  LOCAL_STORAGE = 1
  SESSION_STORAGE = 2
  DESTROY_ALL = 0xa2
  constructor() {
    if (!GlobalConfig._instance) {
      GlobalConfig._instance = this
      this.dynamicConfig = {}
      Object.freeze(GlobalConfig)
      Object.seal(GlobalConfig)

      this.__get = (key, where) => {
        try {
          key = btoa(key)
        } catch (_err) {}

        let value

        switch (where) {
          case this.LOCAL_STORAGE:
            value = localStorage.getItem(key)
            break

          case this.SESSION_STORAGE:
            value = sessionStorage.getItem(key)
            break

          default:
            value = this.dynamicConfig[key]
            break
        }

        if (value) {
          try {
            value = atob(value)
          } catch (_err) {}
          try {
            value = JSON.parse(value)
          } catch (error) {}
        }

        return value
      }

      const switchSet = (key, value, where) => {
        try {
          key = btoa(key)
        } catch (_err) {}

        try {
          if (value instanceof Object) {
            value = JSON.stringify(value)
          }
        } catch (_err) {}

        try {
          value = btoa(value)
        } catch (_err) {}

        switch (where) {
          case this.LOCAL_STORAGE:
            localStorage.setItem(key, value)
            break

          case this.SESSION_STORAGE:
            sessionStorage.setItem(key, value)
            break

          default:
            this.dynamicConfig[key] = value
            break
        }
      }

      this.__set = (key, value, where) => {
        if (key instanceof Object) {
          let configKey
          let configObj
          if (key instanceof Array && value instanceof Array) {
            configKey = key
            configObj = value
          } else {
            configKey = Object.keys(key)
            configObj = Object.values(key)
          }
          for (let i = 0; i < configKey.length; i++) {
            const k = configKey[i]
            const v = configObj[i]
            if (k) {
              switchSet(k, v, where)
            }
          }
        } else {
          if (key) {
            switchSet(key, value, where)
          }
        }
      }

      this.__remove = (key, where) => {
        let { key: copiedKey } = { key }

        try {
          copiedKey = btoa(copiedKey)
        } catch (_err) {}

        let v

        switch (where) {
          case this.LOCAL_STORAGE:
            v = this.__get(key, this.LOCAL_STORAGE)
            if (v) localStorage.removeItem(copiedKey)
            break

          case this.SESSION_STORAGE:
            v = this.__get(key, this.SESSION_STORAGE)
            if (v) sessionStorage.removeItem(copiedKey)
            break

          default:
            v = this.__get(key, this.MEMORY_STORAGE)
            if (v) delete this.dynamicConfig[copiedKey]
            break
        }

        return v
      }

      this.__destroy = (where) => {
        switch (where) {
          case this.LOCAL_STORAGE:
            localStorage.clear()
            break

          case this.SESSION_STORAGE:
            sessionStorage.clear()
            break

          case this.DESTROY_ALL:
            this.dynamicConfig = {}
            localStorage.clear()
            sessionStorage.clear()
            break

          default:
            this.dynamicConfig = {}
            break
        }
      }

      this.__removeFrom = (fromKey, valueToRemove = null, where) => {
        const exist = this.__get(fromKey, where)
        if (!exist) return false
        if (exist instanceof Array) {
          let deleted
          if (!valueToRemove) {
            deleted = exist.pop()
          } else {
            deleted = exist[exist.indexOf(valueToRemove)]
            delete exist[exist.indexOf(valueToRemove)]
          }
          this.__set(fromKey, exist, where)
          return deleted
        }
        return false
      }

      this.__has = (key, where) => {
        const exist = this.__get(key, where)
        return !!exist
      }
    }
    return GlobalConfig._instance
  }

  get(key) {
    return this.__get(key, this.MEMORY_STORAGE)
  }

  set(key, value) {
    this.__set(key, value, this.MEMORY_STORAGE)
  }

  addTo(parentKey, valueToAdd) {
    if (!Object.hasOwnProperty.call(this.dynamicConfig, parentKey)) {
      this.dynamicConfig[parentKey] = []
    }
    if (this.dynamicConfig[parentKey] instanceof Array) {
      this.dynamicConfig[parentKey] = [this.dynamicConfig[parentKey]]
    }
    this.dynamicConfig[parentKey].push(valueToAdd)
    return true
  }

  addToFlashData(parentKey, valueToAdd) {
    return this.addToLocalData(parentKey, valueToAdd)
  }

  addToLocalData(parentKey, valueToAdd) {
    let exist = this.__get(parentKey, this.LOCAL_STORAGE)
    if (!exist) exist = []
    if (!(exist instanceof Array)) {
      exist = [exist]
    }
    exist.push(valueToAdd)
    this.__set(parentKey, exist, this.LOCAL_STORAGE)
    return true
  }

  addToSessionData(parentKey, valueToAdd) {
    let exist = this.__get(parentKey, this.SESSION_STORAGE)
    if (!exist) exist = []
    if (!(exist instanceof Array)) {
      exist = [exist]
    }
    exist.push(valueToAdd)
    this.__set(parentKey, exist, this.SESSION_STORAGE)
    return true
  }

  removeFrom(parentKey, valueToRemove = null) {
    return this.__removeFrom(parentKey, valueToRemove, this.MEMORY_STORAGE)
  }

  removeFromFlashData(parentKey, valueToRemove = null) {
    return this.removeFromLocalData(parentKey, valueToRemove)
  }

  removeFromLocalData(parentKey, valueToRemove = null) {
    return this.__removeFrom(parentKey, valueToRemove, this.LOCAL_STORAGE)
  }

  removeFromSessionData(parentKey, valueToRemove = null) {
    return this.__removeFrom(parentKey, valueToRemove, this.SESSION_STORAGE)
  }

  getFlashData(key) {
    return this.__remove(key, this.LOCAL_STORAGE)
  }

  setFlashData(key, value) {
    this.setLocalData(key, value)
  }

  getLocalData(key) {
    return this.__get(key, this.LOCAL_STORAGE)
  }

  setLocalData(key, value) {
    this.__set(key, value, this.LOCAL_STORAGE)
  }

  getSessionData(key) {
    return this.__get(key, this.SESSION_STORAGE)
  }

  setSessionData(key, value) {
    this.__set(key, value, this.SESSION_STORAGE)
  }

  has(key) {
    return this.__has(key, this.MEMORY_STORAGE)
  }

  isFlashData(key) {
    return this.isLocalData(key)
  }

  isLocalData(key) {
    return this.__has(key, this.LOCAL_STORAGE)
  }

  isSessionData(key) {
    return this.__has(key, this.SESSION_STORAGE)
  }

  remove(key) {
    return this.__remove(key, this.MEMORY_STORAGE)
  }

  removeSessionData(key) {
    return this.__remove(key, this.SESSION_STORAGE)
  }

  removeLocalData(key) {
    return this.__remove(key, this.LOCAL_STORAGE)
  }

  removeFlashData(key) {
    return this.removeLocalData(key)
  }

  destroy() {
    this.__destroy(this.MEMORY_STORAGE)
  }

  destroyLocalData() {
    this.__destroy(this.LOCAL_STORAGE)
  }

  destroySessionData() {
    this.__destroy(this.SESSION_STORAGE)
  }

  destroyAll() {
    this.__destroy(this.DESTROY_ALL)
  }

  increment(key, returnValue = true, throwIfNotfound = false) {
    if (Object.hasOwnProperty.call(this.dynamicConfig, key)) {
      if (typeof this.dynamicConfig[key] === 'number') {
        ++this.dynamicConfig[key]
        if (returnValue) {
          return this.dynamicConfig[key]
        }
      } else {
        throw new Error("Specified key is not a number can't increment")
      }
    } else {
      if (throwIfNotfound) throw new Error('Key not found')
      if (returnValue) return (this.dynamicConfig[key] = 1)
    }
  }

  decrement(key, returnValue = true, throwIfNotfound = false) {
    if (Object.hasOwnProperty.call(this.dynamicConfig, key)) {
      if (typeof this.dynamicConfig[key] === 'number') {
        --this.dynamicConfig[key]
        if (returnValue) {
          return this.dynamicConfig[key]
        }
      } else {
        throw new Error("Specified key is not a number can't decrement")
      }
    } else {
      if (throwIfNotfound) throw new Error('Key not found')
      // if (returnValue) return (this.dynamicConfig[key] = 0);
    }
  }
}

const SharedConfig = new GlobalConfig()

export default SharedConfig
