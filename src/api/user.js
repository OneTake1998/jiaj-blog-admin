import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'get'
  })
}
//更新用户信息
export function updateUserInfo(data){
  return request({
    url: '/user',
    method: 'put',
    data
  })
}
//修改密码
export function updatePassword(data){
  return request({
    url: '/user/password',
    method: 'put',
    data
  })
}
export function checkOldPassword(data){
  return request({
    url: '/user/check/password',
    method: 'post',
    data
  })
}