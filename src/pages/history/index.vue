<template>
  <Motion :initial="pageVariants.initial" :animate="pageVariants.animate" :transition="pageVariants.transition as any"
    class="min-h-screen bg-gray-50 p-6">
    <!-- 页面头部 -->
    <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5, delay: 0.1 }">
      <div class="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6 rounded-lg mb-6">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-3xl font-bold mb-2">历史记录</h1>
          <p class="text-slate-200">查看和管理工地安全帽检测系统的历史记录信息</p>
        </div>
      </div>
    </Motion>

    <!-- 筛选区域 -->
    <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.2 } as any">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <!-- 开始日期 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium text-gray-700">开始日期</span>
            </label>
            <input type="date" v-model="filters.startDate"
              class="input input-bordered bg-white border-gray-300 focus:border-slate-500" />
          </div>

          <!-- 结束日期 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium text-gray-700">结束日期</span>
            </label>
            <input type="date" v-model="filters.endDate"
              class="input input-bordered bg-white border-gray-300 focus:border-slate-500" />
          </div>

          <!-- 检测类型 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium text-gray-700">检测类型</span>
            </label>
            <select v-model="filters.level"
              class="select select-bordered bg-white border-gray-300 focus:border-slate-500">
              <option value="">全部类型</option>
              <option value="helmet">安全帽检测</option>
              <option value="person">人员检测</option>
            </select>
          </div>

          <!-- 摄像头 -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium text-gray-700">摄像头</span>
            </label>
            <select v-model="filters.camera"
              class="select select-bordered bg-white border-gray-300 focus:border-slate-500">
              <option value="">全部摄像头</option>
              <option v-for="camera in cameraOptions" :key="camera" :value="camera">
                {{ camera }}
              </option>
            </select>
          </div>

          <!-- 筛选按钮 -->
          <div class="form-control">
            <button @click="applyFilters" class="btn bg-slate-700 hover:bg-slate-800 text-white border-0">
              筛选
            </button>
          </div>
        </div>
      </div>
    </Motion>

    <!-- 统计模块 -->
    <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6, delay: 0.3 }">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">低置信度</p>
              <p class="text-3xl font-bold text-red-600">{{ stats.severe }}</p>
            </div>
            <div class="p-3 bg-red-100 rounded-full">
              <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">中等置信度</p>
              <p class="text-3xl font-bold text-yellow-600">{{ stats.warning }}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">高置信度</p>
              <p class="text-3xl font-bold text-blue-600">{{ stats.info }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">检测准确率</p>
              <p class="text-3xl font-bold text-green-600">{{ stats.completionRate }}%</p>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Motion>

    <!-- 操作区 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex flex-wrap gap-3">
        <button class="btn btn-sm bg-slate-700 hover:bg-slate-800 text-white border-0">
          📋 批量操作
        </button>
        <button @click="exportRecords" class="btn btn-sm bg-orange-600 hover:bg-orange-700 text-white border-0">
          📥 导出记录CSV
        </button>
        <button @click="exportWarnings" class="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0">
          📤 导出警告CSV
        </button>
        <button @click="markAsRead" class="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-0">
          ✅ 标记已读
        </button>
        <button @click="deleteSelected" class="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-0">
          🗑️ 删除选中
        </button>
        <button @click="generateReport" class="btn btn-sm bg-purple-600 hover:bg-purple-700 text-white border-0">
          📊 生成PDF报告
        </button>
      </div>
    </div>

    <!-- 警告记录列表 -->
    <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6, delay: 0.4 }">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800">检测记录</h2>
        </div>

        <div class="grid gap-4 p-6">
          <div v-for="record in paginatedRecords" :key="record.id"
            class="bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-sm">
            <div class="p-5">
              <div class="flex items-start space-x-4">
                <!-- 选择框 -->
                <input type="checkbox" v-model="selectedRecords" :value="record.id" @click.stop
                  class="checkbox mt-1.5 flex-shrink-0" style="--chkbg: rgb(51 65 85); --chkfg: white;" />

                <!-- 状态指示器和图标 -->
                <div class="flex-shrink-0">
                  <div class="flex flex-col items-center space-y-2">
                    <!-- 检测类型图标 -->
                    <div class="w-12 h-12 rounded-full flex items-center justify-center" :class="{
                      'bg-green-100 text-green-600': record.detection_type === 'wearing_hat',
                      'bg-red-100 text-red-600': record.detection_type === 'no_hat',
                      'bg-blue-100 text-blue-600': record.detection_type === 'person_detected'
                    }">
                      <span class="text-xl">
                        {{ record.detection_type === 'wearing_hat' ? '✅' : record.detection_type === 'no_hat' ? '⚠️' :
                          '👤' }}
                      </span>
                    </div>
                    <!-- 置信度指示器 -->
                    <div class="w-2 h-2 rounded-full" :class="{
                      'bg-red-400': record.confidence < 0.7,
                      'bg-yellow-400': record.confidence >= 0.7 && record.confidence < 0.9,
                      'bg-green-400': record.confidence >= 0.9
                    }"></div>
                  </div>
                </div>

                <!-- 主要内容区域 -->
                <div class="flex-1 min-w-0">
                  <!-- 头部信息 -->
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <h3 class="text-lg font-semibold mb-1" :class="{
                        'text-green-700': record.detection_type === 'wearing_hat',
                        'text-red-700': record.detection_type === 'no_hat',
                        'text-blue-700': record.detection_type === 'person_detected'
                      }">
                        {{ record.detection_type === 'wearing_hat' ? '佩戴安全帽' : record.detection_type === 'no_hat' ?
                          '未佩戴安全帽' : '人员检测' }}
                      </h3>
                      <div class="flex items-center space-x-2 text-sm text-gray-600">
                        <span class="inline-flex items-center px-2 py-1 bg-gray-200 rounded-md">
                          📹 {{ record.camera_name }}
                        </span>
                        <span class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                          ID: {{ record.id }}
                        </span>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-medium text-gray-900">
                        {{ formatDateTime(record.detected_at).split(' ')[1] }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ formatDateTime(record.detected_at).split(' ')[0] }}
                      </div>
                    </div>
                  </div>

                  <!-- 详细信息 -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <!-- 置信度 -->
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-600">置信度:</span>
                        <div class="flex items-center space-x-1">
                          <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all duration-300" :class="{
                              'bg-red-400': record.confidence < 0.7,
                              'bg-yellow-400': record.confidence >= 0.7 && record.confidence < 0.9,
                              'bg-green-400': record.confidence >= 0.9
                            }" :style="{ width: (record.confidence * 100) + '%' }"></div>
                          </div>
                          <span class="text-sm font-medium" :class="{
                            'text-red-600': record.confidence < 0.7,
                            'text-yellow-600': record.confidence >= 0.7 && record.confidence < 0.9,
                            'text-green-600': record.confidence >= 0.9
                          }">
                            {{ (record.confidence * 100).toFixed(1) }}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- 状态标签 -->
                    <div class="flex items-center space-x-2">
                      <span class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full" :class="{
                        'bg-green-100 text-green-800': record.detection_type === 'wearing_hat',
                        'bg-red-100 text-red-800': record.detection_type === 'no_hat',
                        'bg-blue-100 text-blue-800': record.detection_type === 'person_detected'
                      }">
                        {{ record.detection_type === 'wearing_hat' ? '合规' : record.detection_type === 'no_hat' ? '违规' :
                          '监测' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="p-6 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              显示第 {{ startIndex }} - {{ endIndex }} 条，共 {{ totalRecords }} 条记录
            </div>
            <div class="flex space-x-2">
              <button @click="previousPage" :disabled="currentPage === 1" class="btn btn-sm btn-outline">
                上一页
              </button>
              <span class="flex items-center px-3 text-sm text-gray-700">
                第 {{ currentPage }} / {{ totalPages }} 页
              </span>
              <button @click="nextPage" :disabled="currentPage === totalPages" class="btn btn-sm btn-outline">
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>

    </Motion>
  </Motion>


</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Motion } from 'motion-v'
import { getDetectionRecords, getWarnings } from '@/api/inspection/API'
import type { DetectionRecord } from '@/types/apis/inspection_T'

// 接口定义
interface Filters {
  startDate: string
  endDate: string
  level: string
  camera: string
}

interface Stats {
  severe: number
  warning: number
  info: number
  completionRate: number // This might be deprecated or calculated differently
}

// 动画配置
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

const cardVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: 'easeOut' }
}

// 响应式数据
const filters = ref<Filters>({
  startDate: '',
  endDate: '',
  level: '',
  camera: ''
})

const stats = computed<Stats>(() => {
  const result = {
    severe: 0,
    warning: 0,
    info: 0,
    completionRate: 0
  }
  filteredRecords.value.forEach(record => {
    // 根据置信度来分类统计
    if (record.confidence < 0.7) result.severe++ // 低置信度
    else if (record.confidence < 0.9) result.warning++ // 中等置信度
    else result.info++ // 高置信度
  })
  // 计算完成率（这里简单设为100%，实际可根据业务需求调整）
  result.completionRate = 100
  return result
})

const selectedRecords = ref<number[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const allRecords = ref<DetectionRecord[]>([])
const filteredRecords = ref<DetectionRecord[]>([])

// 摄像头选项
const cameraOptions = ref<string[]>([])

// 计算属性
const totalRecords = computed(() => filteredRecords.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalRecords.value / pageSize.value) || 1))

// 新增：用于展示的起止序号（0 条时显示 0-0）
const startIndex = computed(() => totalRecords.value === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, totalRecords.value))

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRecords.value.slice(start, end)
})

// 获取检测记录
const fetchDetectionRecords = async () => {
  try {
    const res = await getDetectionRecords({ page: 1, page_size: 100 })
    console.log('API Response:', res);
    allRecords.value = res.data.records
    filteredRecords.value = allRecords.value
    console.log('All Records:', allRecords.value);
    console.log('Filtered Records:', filteredRecords.value);

    // 从数据中提取摄像头选项
    const cameras = new Set(allRecords.value.map(record => record.camera_name))
    cameraOptions.value = Array.from(cameras)
  } catch (error) {
    console.error('获取检测记录失败:', error)
  }
}

// 方法
const getWarningLevelInfo = (level: number) => {
  switch (level) {
    case 3:
      return { text: '严重警告', icon: '🚨', color: 'text-red-600' }
    case 2:
      return { text: '一般警告', icon: '⚠️', color: 'text-yellow-600' }
    case 1:
      return { text: '提示信息', icon: 'ℹ️', color: 'text-blue-600' }
    default:
      return { text: '未知', icon: '❓', color: 'text-gray-600' }
  }
}

const formatDateTime = (datetime: string): string => {
  const date = new Date(datetime)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const applyFilters = (): void => {
  const startTime = filters.value.startDate
    ? new Date(`${filters.value.startDate}T00:00:00`).getTime()
    : -Infinity
  const endTime = filters.value.endDate
    ? new Date(`${filters.value.endDate}T23:59:59`).getTime()
    : Infinity

  filteredRecords.value = allRecords.value.filter(record => {
    const t = new Date(record.detected_at).getTime()
    const matchCamera = !filters.value.camera || record.camera_name === filters.value.camera
    const matchType = !filters.value.level || record.detection_type === filters.value.level
    const matchDate = t >= startTime && t <= endTime
    return matchCamera && matchType && matchDate
  })

  currentPage.value = 1
  selectedRecords.value = [] // 重置勾选，防止页变了勾选还在
}

const previousPage = (): void => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = (): void => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// 导出CSV文件（UTF-8格式）
const exportToCSV = (data: any[], filename: string, headers: string[]): void => {
  try {
    // 创建CSV内容
    const csvContent = [
      headers.join(','), // 表头
      ...data.map(row => headers.map(header => {
        const value = getNestedValue(row, header)
        // 处理包含逗号、换行符或引号的值
        if (typeof value === 'string' && (value.includes(',') || value.includes('\n') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value || ''
      }).join(','))
    ].join('\n')

    // 添加UTF-8 BOM以确保中文正确显示
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出CSV失败:', error)
    alert('导出失败，请重试')
  }
}

// 获取嵌套对象的值
const getNestedValue = (obj: any, path: string): any => {
  if (path === 'detection_type_text') {
    return obj.detection_type === 'wearing_hat' ? '佩戴安全帽' :
      obj.detection_type === 'no_hat' ? '未佩戴安全帽' : '人员检测'
  }
  if (path === 'confidence_percent') {
    return `${(obj.confidence * 100).toFixed(1)}%`
  }
  if (path === 'detected_at_formatted') {
    return formatDateTime(obj.detected_at)
  }
  return obj[path]
}

// 导出检测记录为CSV
const exportRecords = (): void => {
  if (filteredRecords.value.length === 0) {
    alert('没有可导出的记录')
    return
  }

  const headers = [
    'id', 'detection_type_text', 'camera_name', 'confidence_percent', 'detected_at_formatted'
  ]
  const headerLabels = [
    'ID', '检测类型', '摄像头名称', '置信度', '检测时间'
  ]

  exportToCSV(filteredRecords.value, '检测记录', headerLabels)
}

// 导出警告记录为CSV
const exportWarnings = async (): Promise<void> => {
  try {
    // 获取所有警告数据用于导出
    const res = await getWarnings({ page: 1, page_size: 1000 })
    if (res.data && res.data.warnings && res.data.warnings.length > 0) {
      const headers = [
        'id', 'title', 'warning_level', 'camera_name', 'created_at_formatted'
      ]
      const headerLabels = [
        'ID', '警告标题', '警告级别', '摄像头名称', '创建时间'
      ]

      const warningsData = res.data.warnings.map(warning => ({
        ...warning,
        warning_level: warning.warning_level === 'critical' ? '严重警告' :
          warning.warning_level === 'warning' ? '一般警告' : '信息',
        created_at_formatted: formatDateTime(warning.created_at)
      }))

      exportToCSV(warningsData, '警告记录', headerLabels)
    } else {
      alert('没有可导出的警告记录')
    }
  } catch (error) {
    console.error('导出警告记录失败:', error)
    alert('导出失败，请重试')
  }
}

// 生成PDF报告
const generateReport = async (): Promise<void> => {
  try {
    // 动态导入jsPDF
    const { jsPDF } = await import('jspdf')

    const doc = new jsPDF()

    // 设置中文字体（使用系统默认字体）
    doc.setFont('helvetica')

    // 添加标题
    doc.setFontSize(20)
    doc.text('Safety Helmet Detection Report', 20, 30)

    // 添加生成时间
    doc.setFontSize(12)
    const now = new Date()
    doc.text(`Generated: ${now.toLocaleString('zh-CN')}`, 20, 50)

    // 添加统计信息
    doc.setFontSize(16)
    doc.text('Statistics Summary', 20, 80)

    doc.setFontSize(12)
    let yPos = 100
    doc.text(`Low Confidence: ${stats.value.severe}`, 20, yPos)
    yPos += 20
    doc.text(`Medium Confidence: ${stats.value.warning}`, 20, yPos)
    yPos += 20
    doc.text(`High Confidence: ${stats.value.info}`, 20, yPos)
    yPos += 20
    doc.text(`Completion Rate: ${stats.value.completionRate}%`, 20, yPos)

    // 添加记录摘要
    yPos += 40
    doc.setFontSize(16)
    doc.text('Records Summary', 20, yPos)

    yPos += 20
    doc.setFontSize(12)
    doc.text(`Total Records: ${totalRecords.value}`, 20, yPos)
    yPos += 15
    doc.text(`Filtered Records: ${filteredRecords.value.length}`, 20, yPos)

    // 添加最近的记录（最多10条）
    if (filteredRecords.value.length > 0) {
      yPos += 30
      doc.setFontSize(16)
      doc.text('Recent Records', 20, yPos)

      yPos += 20
      doc.setFontSize(10)

      const recentRecords = filteredRecords.value.slice(0, 10)
      recentRecords.forEach((record, index) => {
        if (yPos > 250) {
          doc.addPage()
          yPos = 30
        }

        const detectionType = record.detection_type === 'wearing_hat' ? 'Wearing Hat' :
          record.detection_type === 'no_hat' ? 'No Hat' : 'Person Detected'
        const confidence = `${(record.confidence * 100).toFixed(1)}%`
        const time = formatDateTime(record.detected_at)

        doc.text(`${index + 1}. ${detectionType} - ${record.camera_name} - ${confidence} - ${time}`, 20, yPos)
        yPos += 15
      })
    }

    // 保存PDF
    const filename = `safety_helmet_report_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(filename)

  } catch (error) {
    console.error('生成PDF报告失败:', error)
    alert('生成报告失败，请确保已安装相关依赖')
  }
}

const markAsRead = (): void => {
  alert('标记已读功能')
}

const deleteSelected = (): void => {
  if (selectedRecords.value.length === 0) {
    alert('请先选择要删除的记录')
    return
  }
  alert(`删除选中的 ${selectedRecords.value.length} 条记录`)
}

// 打开图片
const openImage = (imagePath: string): void => {
  window.open(imagePath, '_blank')
}

// 生命周期
onMounted(() => {
  fetchDetectionRecords()
})

// 组件卸载时恢复滚动
onUnmounted(() => {
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
/* 自定义样式 */
.checkbox:checked {
  background-color: rgb(51 65 85);
  border-color: rgb(51 65 85);
}

/* 自定义滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
