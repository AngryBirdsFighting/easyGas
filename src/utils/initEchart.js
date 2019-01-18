/**
 * @Author:      qinbb
 * @DateTime:    2018-08-30 11:13:56
 * @Description: 异步按需加载 echart
 */
 const initEcharts = equireAsync([
  'line',
  'bar',
  'tooltip'
])

export default initEcharts