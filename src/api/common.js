import request from '@/utils/request'

export default {
  //上传图片
  uploadImg(data) {
    return request({
      url: '/file/upload/image',
      method: 'post',
      data
    })
  },
  //删除图片
  deleteImg(fileUrl) {
    return request({
      url: '/file/delete',
      method: 'delete',
      params: {
        fileUrl
      }
    })
  },
  //获取音乐
  getMusicList() {
    return request({
      url: '/music',
      method: 'get',
    })
  },
  //添加音乐记录
  addMusic(data) {
    return request({
      url: '/music',
      method: 'post',
      data
    })
  },
  //修改音乐记录
  updateMusic(data) {
    return request({
      url: '/music',
      method: 'put',
      data
    })
  },
  //删除音乐记录
  deleteMusic(id) {
    return request({
      url: '/music',
      method: 'delete',
      params: {
        id
      }
    })
  },
  // 添加音乐文件
  addMusicFile(data) {
    return request({
      url: '/music/add/file',
      method: 'post',
      data
    })
  },
  // 删除音乐文件
  deleteMusicFile(fileUrl) {
    return request({
      url: '/music/delete/file',
      method: 'delete',
      params: {
        fileUrl
      }
    })
  },
  //查询音乐
  queryMusic(id) {
    return request({
      url: '/music/query',
      method: 'post',
      params: {
        id
      }
    })
  }


}