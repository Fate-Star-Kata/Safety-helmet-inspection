<template>
  <Motion v-bind="pageVariants">
    <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.1 }">
      <div class="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold mb-2">📊 统计信息</h1>
        <p class="text-slate-200">工地安全帽检测系统的详细数据分析和统计报告</p>
      </div>
    </div>
    </Motion>

    <div class="max-w-7xl mx-auto p-6">


      <!-- 统计概览 -->
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.2 }">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-gradient-to-br from-slate-700 to-slate-800 text-white p-6 rounded-lg shadow-sm">
          <div class="text-3xl font-bold mb-2">{{ computedStats.totalDetections.toLocaleString() }}</div>
          <div class="text-slate-200 text-sm">总检测次数</div>
        </div>
        <div class="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-lg shadow-sm">
          <div class="text-3xl font-bold mb-2">{{ computedStats.complianceRate }}%</div>
          <div class="text-green-100 text-sm">安全帽佩戴率</div>
        </div>
        <div class="bg-gradient-to-br from-orange-600 to-orange-700 text-white p-6 rounded-lg shadow-sm">
          <div class="text-3xl font-bold mb-2">{{ computedStats.totalWarnings.toLocaleString() }}</div>
          <div class="text-orange-100 text-sm">警告总数</div>
        </div>
        <div class="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-sm">
          <div class="text-3xl font-bold mb-2">{{ computedStats.activeCameras }}</div>
          <div class="text-blue-100 text-sm">活跃摄像头</div>
        </div>
      </div>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.4 }">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <!-- 检测趋势图 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">📈 检测趋势分析</h3>
          <div class="h-80">
            <v-chart class="chart" :option="trendChartOption" autoresize />
          </div>
        </div>

        <!-- 警告分布图 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">⚠️ 警告级别分布</h3>
          <div class="h-80">
            <v-chart class="chart" :option="warningChartOption" autoresize />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <!-- 摄像头性能统计 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">📹 摄像头检测统计</h3>
          <div class="h-80">
            <v-chart class="chart" :option="cameraChartOption" autoresize />
          </div>
        </div>

        <!-- 时段分析 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">🕐 时段违规分析</h3>
          <div class="h-80">
            <v-chart class="chart" :option="hourlyChartOption" autoresize />
          </div>
        </div>
      </div>
      </Motion>

      <!-- 详细数据表 -->
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.5 }">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">📋 详细统计数据</h3>
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr class="bg-slate-700 text-white">
                <th class="text-white">摄像头</th>
                <th class="text-white">检测次数</th>
                <th class="text-white">佩戴安全帽</th>
                <th class="text-white">未佩戴安全帽</th>
                <th class="text-white">合规率</th>
                <th class="text-white">警告次数</th>
                <th class="text-white">最后检测时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="camera in cameraStats" :key="camera.id">
                <td class="font-medium">{{ camera.name }}</td>
                <td>{{ camera.detections.toLocaleString() }}</td>
                <td class="text-green-600 font-semibold">{{ camera.withHelmet.toLocaleString() }}</td>
                <td class="text-red-600 font-semibold">{{ camera.withoutHelmet.toLocaleString() }}</td>
                <td>
                  <span 
                    class="badge font-semibold"
                    :class="camera.complianceRate >= 95 ? 'badge-success' : camera.complianceRate >= 90 ? 'badge-warning' : 'badge-error'"
                  >
                    {{ camera.complianceRate }}%
                  </span>
                </td>
                <td class="text-orange-600 font-semibold">{{ camera.warnings }}</td>
                <td class="text-gray-600">{{ camera.lastDetection }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </Motion>

      <!-- 导出功能 -->
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.6 }">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">📥 数据导出</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            @click="exportExcel" 
            class="btn bg-slate-700 hover:bg-slate-800 text-white border-0"
          >
            <span class="mr-2">📊</span>
            导出Excel报表
          </button>
          <button 
            @click="exportPDF" 
            class="btn bg-green-600 hover:bg-green-700 text-white border-0"
          >
            <span class="mr-2">📄</span>
            导出PDF报告
          </button>
          <button 
            @click="exportCSV" 
            class="btn bg-orange-600 hover:bg-orange-700 text-white border-0"
          >
            <span class="mr-2">📋</span>
            导出CSV数据
          </button>
          <button 
            @click="generateWeeklyReport" 
            class="btn bg-red-600 hover:bg-red-700 text-white border-0"
          >
            <span class="mr-2">📈</span>
            生成周报
          </button>
        </div>
      </div>
      </Motion>
    </div>
  </div>
  </Motion>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { Motion } from 'motion-v'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'
import { getDetectionStats, getCameraStats } from '@/api/inspection/API'
import type { DetectionStats, DailyStats, CameraStats as APICameraStats } from '@/types/apis/inspection_T'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// 类型定义
interface Stats {
  totalDetections: number
  complianceRate: number
  totalWarnings: number
  avgResponseTime: string
}

interface CameraStats {
  id: string
  name: string
  detections: number
  withHelmet: number
  withoutHelmet: number
  complianceRate: number
  warnings: number
  lastDetection: string
}



// 动画配置
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

// 响应式数据
const stats = reactive<Stats>({
  totalDetections: 0,
  complianceRate: 0,
  totalWarnings: 0,
  avgResponseTime: '0分钟'
})

const cameraStats = ref<CameraStats[]>([])
const dailyStats = ref<DailyStats[]>([])
const loading = ref(false)

// 计算属性 - 基于现有数据计算统计概览
const computedStats = computed(() => {
  // 基于摄像头统计数据计算总体数据
  const totalDetections = cameraStats.value.reduce((sum, camera) => sum + camera.detections, 0)
  const totalWithHelmet = cameraStats.value.reduce((sum, camera) => sum + camera.withHelmet, 0)
  const totalWarnings = cameraStats.value.reduce((sum, camera) => sum + camera.warnings, 0)
  const activeCameras = cameraStats.value.length
  
  // 计算合规率
  const complianceRate = totalDetections > 0 ? Number(((totalWithHelmet / totalDetections) * 100).toFixed(1)) : 0
  
  return {
    totalDetections,
    complianceRate,
    totalWarnings,
    activeCameras
  }
})

// 图表配置选项
const trendChartOption = ref<EChartsOption>({
  title: {
    text: '检测趋势',
    left: 'center',
    textStyle: {
      color: '#374151',
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    data: ['总检测数', '违规数', '合规率'],
    top: 30
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: [
    {
      type: 'value',
      name: '检测数',
      position: 'left'
    },
    {
      type: 'value',
      name: '合规率(%)',
      position: 'right',
      max: 100
    }
  ],
  series: [
    {
      name: '总检测数',
      type: 'line',
      data: [],
      smooth: true,
      itemStyle: { color: '#3B82F6' }
    },
    {
      name: '违规数',
      type: 'line',
      data: [],
      smooth: true,
      itemStyle: { color: '#EF4444' }
    },
    {
      name: '合规率',
      type: 'line',
      yAxisIndex: 1,
      data: [],
      smooth: true,
      itemStyle: { color: '#10B981' }
    }
  ]
})

const warningChartOption = ref<EChartsOption>({
  title: {
    text: '警告级别分布',
    left: 'center',
    textStyle: {
      color: '#374151',
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle'
  },
  series: [
    {
      name: '警告级别',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      data: [
        { value: 35, name: '严重警告', itemStyle: { color: '#DC2626' } },
        { value: 25, name: '一般警告', itemStyle: { color: '#F59E0B' } },
        { value: 15, name: '提示信息', itemStyle: { color: '#3B82F6' } },
        { value: 25, name: '正常检测', itemStyle: { color: '#10B981' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

const cameraChartOption = ref<EChartsOption>({
  title: {
    text: '摄像头检测统计',
    left: 'center',
    textStyle: {
      color: '#374151',
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['检测总数', '违规数'],
    top: 30
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '检测总数',
      type: 'bar',
      data: [],
      itemStyle: { color: '#3B82F6' }
    },
    {
      name: '违规数',
      type: 'bar',
      data: [],
      itemStyle: { color: '#EF4444' }
    }
  ]
})

const hourlyChartOption = ref<EChartsOption>({
  title: {
    text: '时段违规分析',
    left: 'center',
    textStyle: {
      color: '#374151',
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'axis',
    formatter: function(params: any) {
      return `${params[0].name}<br/>违规率: ${params[0].value}%`
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
  },
  yAxis: {
    type: 'value',
    name: '违规率(%)',
    max: 30
  },
  series: [
    {
      name: '违规率',
      type: 'bar',
      data: [8, 15, 12, 20, 18, 25, 22, 10],
      itemStyle: {
        color: function(params: any) {
          const colors = ['#10B981', '#F59E0B', '#EF4444']
          if (params.value < 10) return colors[0]
          if (params.value < 20) return colors[1]
          return colors[2]
        }
      }
    }
  ]
})

// 方法
const loadStatsData = async (): Promise<void> => {
  try {
    loading.value = true
    const [detectionStatsRes, cameraStatsRes] = await Promise.all([
      getDetectionStats(),
      getCameraStats()
    ])

    if (detectionStatsRes.code === 200) {
      const detectionData = detectionStatsRes.data
      stats.totalDetections = detectionData.stats.total_detections
      stats.complianceRate = Number(detectionData.stats.compliance_rate.toFixed(1))
      stats.totalWarnings = detectionData.stats.no_hat_count
      stats.avgResponseTime = '2.5分钟' // API暂无此字段，使用默认值
      
      dailyStats.value = detectionData.daily_stats
      updateTrendChart()
    }

    if (cameraStatsRes.code === 200) {
      const cameraData = cameraStatsRes.data
      cameraStats.value = cameraData.camera_stats.map((camera: APICameraStats) => ({
        id: camera.camera_id,
        name: `📹 ${camera.camera_name} - ${camera.location}`,
        detections: camera.total_detections,
        withHelmet: camera.wearing_hat_count,
        withoutHelmet: camera.violation_count,
        complianceRate: Number((100 - camera.violation_rate).toFixed(1)),
        warnings: camera.today_violations,
        lastDetection: new Date(camera.latest_detection_time).toLocaleString('zh-CN')
      }))
      updateCameraChart()
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

const updateTrendChart = (): void => {
  const dates = dailyStats.value.map(item => item.date.slice(5)) // 只显示月-日
  const totalData = dailyStats.value.map(item => item.total)
  const violationData = dailyStats.value.map(item => item.no_hat)
  const complianceData = dailyStats.value.map(item => 
    item.total > 0 ? Number(((item.wearing_hat / item.total) * 100).toFixed(1)) : 0
  )

  if (trendChartOption.value.xAxis && !Array.isArray(trendChartOption.value.xAxis)) {
    (trendChartOption.value.xAxis as any).data = dates
  }
  if (trendChartOption.value.series && Array.isArray(trendChartOption.value.series)) {
    const series = trendChartOption.value.series as any[]
    if (series[0]) series[0].data = totalData
    if (series[1]) series[1].data = violationData
    if (series[2]) series[2].data = complianceData
  }
  
  // 更新时段违规分析 - 使用同一个数据源计算违规率
  updateHourlyChart()
}

const updateHourlyChart = (): void => {
  // 基于dailyStats计算违规率数据
  const violationRates = dailyStats.value.map(item => {
    // 当检测数和违规数都为0时，违规率为0
    if (item.total === 0 && item.no_hat === 0) {
      return 0
    }
    // 正常情况下计算违规率
    return item.total > 0 ? Number(((item.no_hat / item.total) * 100).toFixed(1)) : 0
  })
  
  // 如果有数据，使用实际数据；否则使用默认的时段数据
  if (violationRates.length > 0) {
    // 将日期数据转换为时段显示（简化处理，实际可根据需求调整）
    const timeLabels = dailyStats.value.map(item => item.date.slice(5))
    if (hourlyChartOption.value.xAxis && !Array.isArray(hourlyChartOption.value.xAxis)) {
      (hourlyChartOption.value.xAxis as any).data = timeLabels
    }
    if (hourlyChartOption.value.series && Array.isArray(hourlyChartOption.value.series)) {
      const series = hourlyChartOption.value.series as any[]
      if (series[0]) series[0].data = violationRates
    }
  } else {
    // 保持默认的时段数据
    if (hourlyChartOption.value.xAxis && !Array.isArray(hourlyChartOption.value.xAxis)) {
      (hourlyChartOption.value.xAxis as any).data = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
    }
    if (hourlyChartOption.value.series && Array.isArray(hourlyChartOption.value.series)) {
      const series = hourlyChartOption.value.series as any[]
      if (series[0]) series[0].data = [0, 0, 0, 0, 0, 0, 0, 0]
    }
  }
}

const updateCameraChart = (): void => {
  const cameraNames = cameraStats.value.map(camera => camera.name.replace('📹 ', '').split(' - ')[0])
  const detectionData = cameraStats.value.map(camera => camera.detections)
  const violationData = cameraStats.value.map(camera => camera.withoutHelmet)

  if (cameraChartOption.value.xAxis && !Array.isArray(cameraChartOption.value.xAxis)) {
    (cameraChartOption.value.xAxis as any).data = cameraNames
  }
  if (cameraChartOption.value.series && Array.isArray(cameraChartOption.value.series)) {
    const series = cameraChartOption.value.series as any[]
    if (series[0]) series[0].data = detectionData
    if (series[1]) series[1].data = violationData
  }
}

const exportExcel = (): void => {
  try {
    // 检查是否有数据
    if (cameraStats.value.length === 0) {
      alert('暂无统计数据可导出')
      return
    }

    // 准备Excel数据
    const headers = ['摄像头名称', '位置', '检测次数', '佩戴安全帽', '未佩戴安全帽', '合规率(%)', '警告次数', '最后检测时间']
    const data = cameraStats.value.map(camera => [
      camera.name.replace('📹 ', '').split(' - ')[0],
      camera.name.split(' - ')[1] || '',
      camera.detections,
      camera.withHelmet,
      camera.withoutHelmet,
      camera.complianceRate,
      camera.warnings,
      camera.lastDetection
    ])

    // 创建CSV内容（Excel兼容格式）
    const csvContent = [headers, ...data]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    // 添加BOM以支持UTF-8编码
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
    
    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `统计报表_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    console.log('Excel报表导出成功')
  } catch (error) {
    console.error('导出Excel报表失败:', error)
    alert('导出失败，请重试')
  }
}

const exportPDF = async (): Promise<void> => {
  try {
    // 检查是否有数据
    if (cameraStats.value.length === 0) {
      alert('暂无统计数据可生成PDF报告')
      return
    }

    // 动态导入jsPDF
    const { jsPDF } = await import('jspdf')
    
    const doc = new jsPDF()
    const currentDate = new Date().toLocaleDateString('zh-CN')
    const totalStats = computedStats.value
    
    // 设置字体（支持中文）
    doc.setFont('helvetica')
    
    // 标题
    doc.setFontSize(20)
    doc.text('Safety Helmet Detection Report', 105, 20, { align: 'center' })
    doc.setFontSize(16)
    doc.text('Gong Di An Quan Mao Jian Ce Tong Ji Bao Gao', 105, 30, { align: 'center' })
    
    // 报告生成时间
    doc.setFontSize(12)
    doc.text(`Report Date: ${currentDate}`, 105, 40, { align: 'center' })
    
    // 统计概览
    doc.setFontSize(14)
    doc.text('Statistics Overview', 20, 60)
    
    doc.setFontSize(10)
    let yPos = 75
    doc.text(`Total Detections: ${totalStats.totalDetections.toLocaleString()}`, 20, yPos)
    yPos += 10
    doc.text(`Compliance Rate: ${totalStats.complianceRate}%`, 20, yPos)
    yPos += 10
    doc.text(`Total Warnings: ${totalStats.totalWarnings.toLocaleString()}`, 20, yPos)
    yPos += 10
    doc.text(`Active Cameras: ${totalStats.activeCameras}`, 20, yPos)
    yPos += 20
    
    // 摄像头详细统计表格
    doc.setFontSize(14)
    doc.text('Camera Statistics Details', 20, yPos)
    yPos += 15
    
    // 表格标题
    doc.setFontSize(9)
    const headers = ['Camera', 'Detections', 'With Helmet', 'Without Helmet', 'Compliance%', 'Warnings', 'Last Detection']
    const colWidths = [30, 20, 20, 25, 20, 20, 35]
    let xPos = 20
    
    // 绘制表格标题
    doc.setFillColor(240, 240, 240)
    doc.rect(20, yPos - 5, 170, 10, 'F')
    
    headers.forEach((header, index) => {
      doc.text(header, xPos + 2, yPos)
      xPos += colWidths[index]
    })
    yPos += 10
    
    // 绘制表格数据
    cameraStats.value.forEach((camera, index) => {
      if (yPos > 270) { // 如果接近页面底部，添加新页面
        doc.addPage()
        yPos = 20
      }
      
      xPos = 20
      const rowData = [
        camera.name.length > 12 ? camera.name.substring(0, 12) + '...' : camera.name,
        camera.detections.toString(),
        camera.withHelmet.toString(),
        camera.withoutHelmet.toString(),
        camera.complianceRate + '%',
        camera.warnings.toString(),
        camera.lastDetection.length > 15 ? camera.lastDetection.substring(0, 15) + '...' : camera.lastDetection
      ]
      
      // 绘制行背景（交替颜色）
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250)
        doc.rect(20, yPos - 5, 170, 10, 'F')
      }
      
      rowData.forEach((data, colIndex) => {
        doc.text(data, xPos + 2, yPos)
        xPos += colWidths[colIndex]
      })
      yPos += 10
    })
    
    // 页脚
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(`Generated by Safety Helmet Detection System - Page ${i}/${pageCount}`, 105, 290, { align: 'center' })
    }
    
    // 保存PDF
    const fileName = `Safety_Helmet_Report_${new Date().toISOString().slice(0, 10)}.pdf`
    doc.save(fileName)
    
    console.log('PDF报告生成成功')
    alert('PDF报告生成成功！')
  } catch (error) {
    console.error('生成PDF报告失败:', error)
    alert('生成PDF报告失败，请重试')
  }
}

const exportCSV = (): void => {
  try {
    // 检查是否有数据
    if (cameraStats.value.length === 0) {
      alert('暂无统计数据可导出')
      return
    }

    // 准备CSV数据
    const headers = ['摄像头名称', '位置', '检测次数', '佩戴安全帽', '未佩戴安全帽', '合规率(%)', '警告次数', '最后检测时间']
    const data = cameraStats.value.map(camera => [
      camera.name.replace('📹 ', '').split(' - ')[0],
      camera.name.split(' - ')[1] || '',
      camera.detections,
      camera.withHelmet,
      camera.withoutHelmet,
      camera.complianceRate,
      camera.warnings,
      camera.lastDetection
    ])

    // 创建CSV内容
    const csvContent = [headers, ...data]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    // 添加BOM以支持UTF-8编码
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
    
    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `统计数据_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    console.log('CSV数据导出成功')
  } catch (error) {
    console.error('导出CSV数据失败:', error)
    alert('导出失败，请重试')
  }
}

const generateWeeklyReport = (): void => {
  try {
    // 检查是否有数据
    if (cameraStats.value.length === 0 && dailyStats.value.length === 0) {
      alert('暂无数据可生成周报')
      return
    }

    // 计算周报数据
    const currentDate = new Date()
    const weekStart = new Date(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000)
    const totalStats = computedStats.value
    
    // 计算周平均数据
    const weeklyAvgDetections = Math.round(totalStats.totalDetections / 7)
    const weeklyAvgWarnings = Math.round(totalStats.totalWarnings / 7)
    
    // 创建周报HTML内容
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>安全帽检测周报</title>
        <style>
          body { font-family: 'Microsoft YaHei', Arial, sans-serif; margin: 20px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .section { margin-bottom: 30px; }
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
          .stat-card { border: 1px solid #ddd; padding: 15px; text-align: center; border-radius: 8px; background: #f9f9f9; }
          .stat-value { font-size: 24px; font-weight: bold; color: #333; }
          .stat-label { color: #666; margin-top: 5px; }
          .summary { background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .recommendations { background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .footer { margin-top: 40px; text-align: center; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
          .highlight { color: #d63384; font-weight: bold; }
          .good { color: #198754; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏗️ 工地安全帽检测系统周报</h1>
          <p>报告周期: ${weekStart.toLocaleDateString('zh-CN')} - ${currentDate.toLocaleDateString('zh-CN')}</p>
          <p>报告生成时间: ${new Date().toLocaleString('zh-CN')}</p>
        </div>
        
        <div class="section">
          <h2>📊 本周统计概览</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${totalStats.totalDetections.toLocaleString()}</div>
              <div class="stat-label">总检测次数</div>
            </div>
            <div class="stat-card">
              <div class="stat-value ${totalStats.complianceRate >= 95 ? 'good' : totalStats.complianceRate >= 90 ? '' : 'highlight'}">${totalStats.complianceRate}%</div>
              <div class="stat-label">安全帽佩戴率</div>
            </div>
            <div class="stat-card">
              <div class="stat-value ${totalStats.totalWarnings > 50 ? 'highlight' : ''}">${totalStats.totalWarnings.toLocaleString()}</div>
              <div class="stat-label">警告总数</div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h2>📈 趋势分析</h2>
          <div class="summary">
            <h3>本周关键指标</h3>
            <ul>
              <li>日均检测次数: <strong>${weeklyAvgDetections.toLocaleString()}</strong> 次</li>
              <li>日均警告次数: <strong>${weeklyAvgWarnings.toLocaleString()}</strong> 次</li>
              <li>活跃摄像头数量: <strong>${totalStats.activeCameras}</strong> 个</li>
              <li>整体合规率: <strong class="${totalStats.complianceRate >= 95 ? 'good' : totalStats.complianceRate >= 90 ? '' : 'highlight'}">${totalStats.complianceRate}%</strong></li>
            </ul>
          </div>
        </div>
        
        <div class="section">
          <h2>📹 摄像头性能分析</h2>
          <table>
            <thead>
              <tr>
                <th>摄像头</th>
                <th>检测次数</th>
                <th>合规率</th>
                <th>警告次数</th>
                <th>状态评估</th>
              </tr>
            </thead>
            <tbody>
    `
    
    cameraStats.value.forEach(camera => {
      let status = '正常'
      let statusClass = 'good'
      
      if (camera.complianceRate < 90) {
        status = '需关注'
        statusClass = 'highlight'
      } else if (camera.complianceRate < 95) {
        status = '一般'
        statusClass = ''
      }
      
      htmlContent += `
              <tr>
                <td>${camera.name}</td>
                <td>${camera.detections.toLocaleString()}</td>
                <td class="${camera.complianceRate >= 95 ? 'good' : camera.complianceRate >= 90 ? '' : 'highlight'}">${camera.complianceRate}%</td>
                <td>${camera.warnings}</td>
                <td class="${statusClass}">${status}</td>
              </tr>
      `
    })
    
    // 生成建议
    const lowComplianceCameras = cameraStats.value.filter(camera => camera.complianceRate < 90)
    const highWarningCameras = cameraStats.value.filter(camera => camera.warnings > 10)
    
    htmlContent += `
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>💡 安全建议与改进措施</h2>
          <div class="recommendations">
            <h3>本周发现的问题:</h3>
            <ul>
    `
    
    if (totalStats.complianceRate < 90) {
      htmlContent += `<li class="highlight">整体合规率偏低(${totalStats.complianceRate}%)，需要加强安全教育</li>`
    }
    
    if (lowComplianceCameras.length > 0) {
      htmlContent += `<li class="highlight">以下区域合规率较低，需重点关注: ${lowComplianceCameras.map(c => c.name.split(' - ')[0]).join(', ')}</li>`
    }
    
    if (highWarningCameras.length > 0) {
      htmlContent += `<li class="highlight">以下摄像头警告频繁: ${highWarningCameras.map(c => c.name.split(' - ')[0]).join(', ')}</li>`
    }
    
    if (totalStats.complianceRate >= 95) {
      htmlContent += `<li class="good">整体安全状况良好，继续保持</li>`
    }
    
    htmlContent += `
            </ul>
            
            <h3>改进建议:</h3>
            <ul>
              <li>定期组织安全帽佩戴规范培训</li>
              <li>在违规高发区域增设安全提醒标识</li>
              <li>建立安全检查奖惩机制</li>
              <li>优化摄像头覆盖范围，消除监控盲区</li>
            </ul>
          </div>
        </div>
        
        <div class="footer">
          <p>本周报由工地安全帽检测系统自动生成</p>
          <p>如有疑问，请联系安全管理部门</p>
        </div>
      </body>
      </html>
    `

    // 创建并下载HTML文件
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `安全帽检测周报_${currentDate.toISOString().slice(0, 10)}.html`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    alert('周报已生成，请在浏览器中查看详细内容')
    console.log('周报生成成功')
  } catch (error) {
    console.error('生成周报失败:', error)
    alert('生成周报失败，请重试')
  }
}

// 生命周期
onMounted(() => {
  loadStatsData()
})
</script>

<style scoped>
/* 图表样式 */
.chart {
  height: 100%;
  width: 100%;
}

/* 自定义滚动条样式 */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgb(51 65 85);
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgb(30 41 59);
}

/* 表格样式优化 */
.table th {
  background-color: rgb(51 65 85) !important;
  color: white !important;
  font-weight: 600;
}

.table-zebra tbody tr:nth-child(even) {
  background-color: #f8fafc;
}
</style>