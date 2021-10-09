import request from '@/utils/request'

export default {
  // 分页条件查询文章列表
  getAbout(id) {
    return request({
      url: `/about/${id}`,
      method: 'get'
    })
  },
  saveAbout(data) {
    return request({
      url: `/about`,
      method: 'put',
      data
    })
  }
}
