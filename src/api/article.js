import request from '@/utils/request'

export default {

    // 分页条件查询文章列表
    getList(query, current = 1, size = 20) {
        return request({
            url: `/article/search`,
            method: 'post',
            data: { ...query, current, size }
        })
    },

    // 查询文章详情
    getById(id) {
        return request({
            url: `/article/${id}`,
            method: 'get'
        })
    },

    // 文章发布
    releaseById(id) {
        return request({
            url: `/article/audit/success/${id}`,
            method: 'get'
        })
    },

    // 文章保存草稿
    draftById(id) {
        return request({
            url: `/article/audit/draft/${id}`,
            method: 'get'
        })
    },

    // 删除
    deleteById(id) {
        return request({
            url: `/article/${id}`,
            method: 'delete'
        })
    },

    // 修改
    editArticle(data) {
        return request({
            url: `/article`,
            method: 'put',
            data
        })
    },
    // 修改
    addArticle(data) {
        return request({
            url: `/article`,
            method: 'post',
            data
        })
    },
}