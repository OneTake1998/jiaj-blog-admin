import axios from 'axios'
import { Message } from 'element-ui'
import { getToken, removeToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

service.interceptors.request.use(
  config => {
    // 获取cookie中的Token
    const accessToken = getToken()
    if (accessToken) {
      // 设置Token到header
      config.headers.Authorization = accessToken
    }
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(

  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code === 401 && res.message!="用户名或密码错误") {
        removeToken()
        window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}/login?redirectURL=${window.location.href}`
        return Promise.reject('令牌过期，重新认证')
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // console.log(error)
    // 非401状态码，则直接提示信息
    if (error.response && error.response.status !== 401) {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    } else if (error.response.status === 401) {
      window.location.href = `${process.env.VUE_APP_AUTH_CENTER_URL}?redirectURL=${window.location.href}`
    }
    return Promise.reject('令牌过期，重新认证')
  }
)

export default service
