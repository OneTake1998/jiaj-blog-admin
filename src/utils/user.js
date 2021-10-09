import Cookies from 'js-cookie'
import { Key } from './cookie'

export function getUserInfo() {
  return Cookies.get(Key.userInfoKey)
}

export function setUserInfo(token) {
  return Cookies.set(Key.userInfoKey, token)
}

export function removeUserInfo() {
  return Cookies.remove(Key.userInfoKey)
}
