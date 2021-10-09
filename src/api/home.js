import request from '@/utils/request'

export default {

    // 查询各状态文章总数
    getAticleTotal() {
        return request({
            url: `/article/total/all`,
            method: 'get'
        })
    },

    // 查询各分类下的文章数
    getCategoryTotal() {
        return request({
            url: `/article/category/total`,
            method: 'get'
        })
    },

    // 查询近6个月发布的文章数
    getMonthArticleTotal() {
        return request({
            url: `/article/month/total`,
            method: 'get'
        })
    }
    
}