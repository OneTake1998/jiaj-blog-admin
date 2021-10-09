<template>
  <!-- 具备一个宽高的dom容器 -->
  <div ref="main" :class="className" :style="{height: height, width: width}" />
</template>

<script>
// 引入
const echarts = require('echarts')
// 引入主题
require('echarts/theme/macarons')

// 自适应窗口大小改变图表的大小
import resize from './mixins/resize'

export default {
  mixins: [resize],

  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    legendData: { // 左侧组件接收的数据
      type: Array,
      default: () => ['前端', 'Java', '移动端', '大数据']
    },
    seriesData: { // 饼状图中接收的数据
      type: Array,
      default: () => [
        { value: 100, name: '前端' },
        { value: 200, name: 'Java' },
        { value: 500, name: '移动端' },
        { value: 300, name: '大数据' }
      ]
    }
  },

  data() {
    return {
      chart: null // 接收echarts实例的属性
    }
  },

  mounted() {
    // 当加载dom后，会调用 this.initChart() 来进行初始化echarts实例
    this.$nextTick(() => {
      this.initChart()
    })
  },

  // 当组件销毁之前会调用此钩子，
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    // 注销实例
    this.chart.dispose()
    this.chart = null
  },

  methods: {
    // 关于图标的初始化配置
    initChart() {
      // 初始化实例, 第2个参数可以指定引用的主题
      this.chart = echarts.init(this.$refs.main, 'macarons')

      // 图标配置项
      this.chart.setOption({
        title: { // 标题
          text: '各技术频道文章统计',
          left: 'center' // 居中
        },
        tooltip: { // 鼠标放上去的提示框格式
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: { // 左上角
          orient: 'vertical',
          left: 'left',
          data: this.legendData
        },
        series: [ // 序列，展示的具体数据
          {
            name: '统计内容',
            type: 'pie', // 饼状图
            radius: '55%', // 圆大小
            center: ['50%', '50%'], // 饼图位置【左，上】
            data: this.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10, // 图形阴影的模糊大小
                shadowOffsetX: 0, // 阴影水平方向偏移距离
                shadowColor: 'rgba(0, 0, 0, 0.5)' // 阴影颜色
              }
            }
          }
        ]
      })
    }
  }
}
</script>
