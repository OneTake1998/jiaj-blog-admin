import Cookies from 'js-cookie'
import { Key } from './cookie'

export function getToken() {
  return Cookies.get(Key.accessTokenKey)
}

export function setToken(token) {
  return Cookies.set(Key.accessTokenKey, token)
}

export function removeToken() {
  return Cookies.remove(Key.accessTokenKey)
}
