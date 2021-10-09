import request from '@/utils/request'

export default {
    // 分页条件查询标签列表
    getList(query, current = 1, size = 20) {
        return request({
            url: `/label/search`,
            method: 'post',
            data: {...query, current, size} // 合并为一个新对象提交给后台数据接口
        })
    },

    // 新增标签
    add(data) {
        return request({
            url: `/label`,
            method: 'post',
            data
        })
    },

    // 查询标签详情
    getById(id) {
        return request({
            url: `/label/${id}`,
            method: 'get'
        })
    },

    // 更新标签
    update(data) {
        return request({
            url: `/label`,
            method: 'put',
            data
        })
    },

    // 通过标签id删除标签信息
    deleteById(id) {
        return request({
            url: `/label/${id}`,
            method: 'delete'
        })
    }


}