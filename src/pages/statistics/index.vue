<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold mb-2">📊 统计信息</h1>
        <p class="text-slate-200">工地安全帽检测系统的详细数据分析和统计报告</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-6">
      <!-- 时间筛选 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">时间筛选</h2>
        <div class="flex flex-wrap gap-3">
          <button 
            v-for="period in timePeriods" 
            :key="period.value"
            @click="setTimeFilter(period.value)"
            class="btn btn-sm border-0"
            :class="currentTimeFilter === period.value ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-slate-600 hover:text-white'"
          >
            {{ period.label }}
          </button>
        </div>
      </div>

      <!-- 统计概览 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-gradient-to-br from-slate-700 to-slate-800 text-white p-6 rounded-lg shadow-sm">
          <div class="text-3xl font-bold mb-2">{{ stats.totalDetections.toLocaleString() }}</div>
          <div class="text-slate-200 text-sm">总检测次数</div>
        </div>
        <div class="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-lg shadow-sm">
          <div class="text-3xl font-bold mb-2">{{ stats.complianceRate }}%</div>
          <div class="text-green-100 text-sm">安全帽佩戴率</div>
        </div>
        <div class="bg-gradient-to-br from-orange-600 to-orange-700 text-white p-6 rounded-lg shadow-sm">
          <div class="text-3xl font-bold mb-2">{{ stats.totalWarnings.toLocaleString() }}</div>
          <div class="text-orange-100 text-sm">警告总数</div>
        </div>
        <div class="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-sm">
          <div class="text-3xl font-bold mb-2">{{ stats.avgResponseTime }}</div>
          <div class="text-blue-100 text-sm">平均响应时间</div>
        </div>
      </div>

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

      <!-- 详细数据表 -->
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

      <!-- 导出功能 -->
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
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
  id: number
  name: string
  detections: number
  withHelmet: number
  withoutHelmet: number
  complianceRate: number
  warnings: number
  lastDetection: string
}

interface TimePeriod {
  value: string
  label: string
}

// 响应式数据
const currentTimeFilter = ref<string>('today')

const timePeriods: TimePeriod[] = [
  { value: 'today', label: '今日' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'quarter', label: '本季度' },
  { value: 'year', label: '本年' }
]

const stats = reactive<Stats>({
  totalDetections: 1247,
  complianceRate: 92.3,
  totalWarnings: 96,
  avgResponseTime: '2.5分钟'
})

const cameraStats = ref<CameraStats[]>([
  {
    id: 1,
    name: '📹 摄像头#1 - 主入口',
    detections: 342,
    withHelmet: 318,
    withoutHelmet: 24,
    complianceRate: 93.0,
    warnings: 18,
    lastDetection: '2024-01-15 14:32'
  },
  {
    id: 2,
    name: '📹 摄像头#2 - 施工区A',
    detections: 298,
    withHelmet: 276,
    withoutHelmet: 22,
    complianceRate: 92.6,
    warnings: 15,
    lastDetection: '2024-01-15 14:30'
  },
  {
    id: 3,
    name: '📹 摄像头#3 - 施工区B',
    detections: 387,
    withHelmet: 345,
    withoutHelmet: 42,
    complianceRate: 89.1,
    warnings: 28,
    lastDetection: '2024-01-15 14:31'
  },
  {
    id: 4,
    name: '📹 摄像头#4 - 材料区',
    detections: 220,
    withHelmet: 208,
    withoutHelmet: 12,
    complianceRate: 94.5,
    warnings: 8,
    lastDetection: '2024-01-15 14:25'
  }
])

// 图表配置选项
const trendChartOption = ref({
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
    data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
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
      data: [120, 132, 101, 134, 90, 230],
      smooth: true,
      itemStyle: { color: '#3B82F6' }
    },
    {
      name: '违规数',
      type: 'line',
      data: [20, 25, 15, 28, 12, 35],
      smooth: true,
      itemStyle: { color: '#EF4444' }
    },
    {
      name: '合规率',
      type: 'line',
      yAxisIndex: 1,
      data: [83, 81, 85, 79, 87, 85],
      smooth: true,
      itemStyle: { color: '#10B981' }
    }
  ]
})

const warningChartOption = ref({
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

const cameraChartOption = ref({
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
    data: ['摄像头-01', '摄像头-02', '摄像头-03', '摄像头-04', '摄像头-05']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '检测总数',
      type: 'bar',
      data: [120, 200, 150, 80, 70],
      itemStyle: { color: '#3B82F6' }
    },
    {
      name: '违规数',
      type: 'bar',
      data: [20, 35, 25, 15, 12],
      itemStyle: { color: '#EF4444' }
    }
  ]
})

const hourlyChartOption = ref({
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
const setTimeFilter = (period: string): void => {
  currentTimeFilter.value = period
  updateStatsData()
}

const updateStatsData = (): void => {
  // 根据时间筛选更新统计数据
  const data = {
    today: { detections: 1247, compliance: 92.3, warnings: 96, response: '2.5分钟' },
    week: { detections: 8734, compliance: 91.8, warnings: 672, response: '3.1分钟' },
    month: { detections: 35420, compliance: 93.1, warnings: 2456, response: '2.8分钟' },
    quarter: { detections: 106260, compliance: 92.7, warnings: 7368, response: '2.9分钟' },
    year: { detections: 425040, compliance: 92.9, warnings: 29472, response: '2.7分钟' }
  }
  
  const current = data[currentTimeFilter.value as keyof typeof data]
  if (current) {
    stats.totalDetections = current.detections
    stats.complianceRate = current.compliance
    stats.totalWarnings = current.warnings
    stats.avgResponseTime = current.response
  }
}

const exportExcel = (): void => {
  alert('正在生成Excel报表...')
  // 实际项目中会生成并下载Excel文件
}

const exportPDF = (): void => {
  alert('正在生成PDF报告...')
  // 实际项目中会生成并下载PDF文件
}

const exportCSV = (): void => {
  alert('正在导出CSV数据...')
  // 实际项目中会生成并下载CSV文件
}

const generateWeeklyReport = (): void => {
  alert('正在生成本周安全报告...')
  // 实际项目中会生成详细的周报
}

// 生命周期
onMounted(() => {
  updateStatsData()
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