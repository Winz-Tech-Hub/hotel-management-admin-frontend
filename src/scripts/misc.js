/* eslint-disable no-undef */
/* eslint-disable require-jsdoc */
import fetcher from './SharedFetcher'
import { toast } from 'react-toastify'
import SharedConfig from './SharedConfig'
import Fetcher from './Fetcher'

export const isActivePath = (location, routeName) => {
  const path = location.pathname
  const splitted = path.split('/')
  for (let i = 0; i < splitted.length; i++) {
    const segment = splitted[i]
    const routing = routeName.split('/')[1]
    if (segment === routing) {
      return 'active'
    }
  }
  return null
}

export async function getSupportedToken(type) {
  const data = await fetcher.fetch(`/${type}/supported-tokens`)
  if (data) {
    if (data.connection.statusCode !== 200) {
      toast.error(data.data.message)
      return []
    }
    return data.data.tokens
  } else {
    toast.error('Error fectching token. ')
  }
  return {}
}

export function redirect(url) {
  if (url instanceof Function) {
    SharedConfig.addTo('redirectListeners', url)
  } else {
    const redirectListeners = SharedConfig.get('redirectListeners')
    if (redirectListeners instanceof Array) {
      redirectListeners.forEach((fn) => fn(url))
    } else {
      redirectListeners(url)
    }
  }
}

export function objectEquals(obj1, obj2) {
  // Check if both object are strictly equal
  if (obj1 === obj2) {
    return true
  }

  // Check if either object is null or not
  if (typeof obj1 !== 'object' || obj1 == null || typeof obj2 !== 'object' || obj2 == null) {
    return false
  }

  // Get the keys of both objects
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  // Check if the number of keys is the same
  if (keys1.length !== keys2.length) {
    return false
  }

  // Iterate through the keys and recursively check for equality
  for (const key of keys1) {
    if (!keys2.includes(key) || !objectEquals(obj1[key], obj2[key])) {
      return false
    }
  }
  return true
}

export function encodeQuery(object = {}) {
  return btoa(JSON.stringify(object))
}

export async function getDataUrl(data) {
  return await new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()
      reader.readAsDataURL(data)
      reader.onloadend = () => {
        const uri = reader.result
        resolve(uri)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export async function getDataUrlFromUrl(url) {
  return await new Promise((resolve, reject) => {
    async function runner() {
      try {
        const imo = {
          url,
          method: 'GET',
        }
        const idata = await fetcher.fetch(imo, Fetcher.RETURN_BLOB)
        const uri = await getDataUrl(idata)
        resolve(uri)
      } catch (error) {
        reject(error)
      }
    }
    runner()
  })
}

export const paginatingUrl = (url, data, size = 10) => {
  const dataString = encodeQuery(data)
  return `${url}?q=${dataString}&size=${size}`
}
