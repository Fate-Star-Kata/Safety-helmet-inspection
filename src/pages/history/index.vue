<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- 页面头部 -->
    <div class="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6 rounded-lg mb-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold mb-2">警告历史记录</h1>
        <p class="text-slate-200">查看和管理工地安全帽检测系统的历史警告信息</p>
      </div>
    </div>

    <!-- 筛选区域 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <!-- 开始日期 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium text-gray-700">开始日期</span>
          </label>
          <input 
            type="date" 
            v-model="filters.startDate"
            class="input input-bordered bg-white border-gray-300 focus:border-slate-500"
          />
        </div>

        <!-- 结束日期 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium text-gray-700">结束日期</span>
          </label>
          <input 
            type="date" 
            v-model="filters.endDate"
            class="input input-bordered bg-white border-gray-300 focus:border-slate-500"
          />
        </div>

        <!-- 警告级别 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium text-gray-700">警告级别</span>
          </label>
          <select 
            v-model="filters.level"
            class="select select-bordered bg-white border-gray-300 focus:border-slate-500"
          >
            <option value="">全部级别</option>
            <option value="严重警告">严重警告</option>
            <option value="一般警告">一般警告</option>
            <option value="提示信息">提示信息</option>
          </select>
        </div>

        <!-- 摄像头 -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium text-gray-700">摄像头</span>
          </label>
          <select 
            v-model="filters.camera"
            class="select select-bordered bg-white border-gray-300 focus:border-slate-500"
          >
            <option value="">全部摄像头</option>
            <option v-for="camera in cameraOptions" :key="camera" :value="camera">
              {{ camera }}
            </option>
          </select>
        </div>

        <!-- 筛选按钮 -->
        <div class="form-control">
          <button 
            @click="applyFilters"
            class="btn bg-slate-700 hover:bg-slate-800 text-white border-0"
          >
            筛选
          </button>
        </div>
      </div>
    </div>

    <!-- 统计模块 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">严重警告</p>
            <p class="text-3xl font-bold text-red-600">{{ stats.severe }}</p>
          </div>
          <div class="p-3 bg-red-100 rounded-full">
            <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">一般警告</p>
            <p class="text-3xl font-bold text-yellow-600">{{ stats.warning }}</p>
          </div>
          <div class="p-3 bg-yellow-100 rounded-full">
            <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">提示信息</p>
            <p class="text-3xl font-bold text-blue-600">{{ stats.info }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">处理完成率</p>
            <p class="text-3xl font-bold text-green-600">{{ stats.completionRate }}%</p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作区 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex flex-wrap gap-3">
        <button class="btn btn-sm bg-slate-700 hover:bg-slate-800 text-white border-0">
          📋 批量操作
        </button>
        <button 
          @click="exportRecords"
          class="btn btn-sm bg-orange-600 hover:bg-orange-700 text-white border-0"
        >
          📥 导出记录
        </button>
        <button 
          @click="markAsRead"
          class="btn btn-sm bg-green-600 hover:bg-green-700 text-white border-0"
        >
          ✅ 标记已读
        </button>
        <button 
          @click="deleteSelected"
          class="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-0"
        >
          🗑️ 删除选中
        </button>
        <button 
          @click="generateReport"
          class="btn btn-sm bg-gray-600 hover:bg-gray-700 text-white border-0"
        >
          📊 生成报告
        </button>
      </div>
    </div>

    <!-- 警告记录列表 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">警告记录</h2>
      </div>
      
      <div class="divide-y divide-gray-200">
        <div 
          v-for="record in paginatedRecords" 
          :key="record.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start space-x-4">
            <!-- 选择框 -->
            <input 
              type="checkbox" 
              v-model="selectedRecords"
              :value="record.id"
              class="checkbox mt-1"
              style="--chkbg: rgb(51 65 85); --chkfg: white;"
            />
            
            <!-- 警告图标 -->
            <div class="flex-shrink-0 mt-1">
              <span class="text-2xl" :class="getLevelColorClass(record.level)">
                {{ getWarningIcon(record.level) }}
              </span>
            </div>
            
            <!-- 警告内容 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-2">
                <h3 
                  class="text-lg font-semibold"
                  :class="{
                    'text-red-600': record.level === '严重警告',
                    'text-yellow-600': record.level === '一般警告',
                    'text-blue-600': record.level === '提示信息'
                  }"
                >
                  {{ record.level }}
                </h3>
                <span class="text-sm text-gray-500">{{ formatDateTime(record.datetime) }}</span>
              </div>
              
              <p class="text-gray-800 font-medium mb-2">{{ record.title }}</p>
              
              <div class="text-sm text-gray-600 mb-3">
                <span class="inline-flex items-center mr-4">
                  📍 位置：{{ record.location }}
                </span>
                <span class="inline-flex items-center mr-4">
                  👤 检测人数：{{ record.personCount }}人
                </span>
                <span class="inline-flex items-center">
                  🎯 置信度：{{ record.confidence }}%
                </span>
              </div>
              
              <p class="text-gray-700 mb-3">{{ record.description }}</p>
              
              <div class="flex items-center justify-between">
                <button class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  {{ record.screenshotText }}
                </button>
                <div class="flex space-x-2">
                  <button class="btn btn-xs btn-outline">
                    查看详情
                  </button>
                  <button class="btn btn-xs btn-primary">
                    处理
                  </button>
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
            <button 
              @click="previousPage"
              :disabled="currentPage === 1"
              class="btn btn-sm btn-outline"
            >
              上一页
            </button>
            <span class="flex items-center px-3 text-sm text-gray-700">
              第 {{ currentPage }} / {{ totalPages }} 页
            </span>
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="btn btn-sm btn-outline"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 接口定义
interface WarningRecord {
  id: number
  level: '严重警告' | '一般警告' | '提示信息'
  datetime: string
  camera: string
  location: string
  title: string
  description: string
  personCount: number
  confidence: number
  screenshotText: string
  processed: boolean
}

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
  completionRate: number
}

// 响应式数据
const filters = ref<Filters>({
  startDate: '',
  endDate: '',
  level: '',
  camera: ''
})

const stats = ref<Stats>({
  severe: 23,
  warning: 45,
  info: 12,
  completionRate: 85
})

const selectedRecords = ref<number[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const allRecords = ref<WarningRecord[]>([])
const filteredRecords = ref<WarningRecord[]>([])

// 摄像头选项
const cameraOptions = ref(['摄像头#1', '摄像头#2', '摄像头#3', '摄像头#4'])

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

// 生成模拟数据
const generateMockData = (): WarningRecord[] => {
  const levels: ('严重警告' | '一般警告' | '提示信息')[] = ['严重警告', '一般警告', '提示信息']
  const cameras = ['摄像头#1', '摄像头#2', '摄像头#3', '摄像头#4']
  const locations = ['施工区A', '施工区B', '主入口', '材料区', '办公区']
  const events = {
    '严重警告': ['检测到未佩戴安全帽人员', '检测到多人未佩戴安全帽', '危险区域有人员未佩戴安全帽'],
    '一般警告': ['检测到可疑行为', '检测到人员聚集', '安全帽佩戴不规范'],
    '提示信息': ['检测正常', '系统运行正常', '安全状况良好']
  }
  
  const records: WarningRecord[] = []
  
  for (let i = 1; i <= 50; i++) {
    const level = levels[Math.floor(Math.random() * levels.length)]
    const camera = cameras[Math.floor(Math.random() * cameras.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    const eventList = events[level]
    const event = eventList[Math.floor(Math.random() * eventList.length)]
    
    const date = new Date(2024, 0, 15, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60))
    
    records.push({
      id: i,
      level,
      datetime: date.toISOString(),
      camera,
      location: `${location}${Math.random() > 0.5 ? '东侧' : '中央'}`,
      title: `${camera} - ${location} ${event}`,
      description: level === '严重警告' 
        ? `系统检测到${Math.floor(Math.random() * 3) + 1}名工人在危险施工区域未佩戴安全帽，存在严重安全隐患。建议立即处理并加强安全教育。`
        : level === '一般警告'
        ? `检测到人员在${location}停留时间过长，可能存在安全帽佩戴不规范的情况，建议关注。`
        : `所有人员均正确佩戴安全帽，安全状况良好。系统运行正常。`,
      personCount: Math.floor(Math.random() * 5) + 1,
      confidence: Math.floor(Math.random() * 10) + 90,
      screenshotText: level === '严重警告' ? '严重警告截图' : level === '一般警告' ? '警告截图' : '正常截图',
      processed: Math.random() > 0.3
    })
  }
  
  return records.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
}

// 方法
const getWarningIcon = (level: string): string => {
  switch (level) {
    case '严重警告': return '🚨'
    case '一般警告': return '⚠️'
    case '提示信息': return 'ℹ️'
    default: return 'ℹ️'
  }
}

// 新增：根据等级返回颜色类
const getLevelColorClass = (level: string): string => {
  if (level === '严重警告') return 'text-red-600'
  if (level === '一般警告') return 'text-yellow-600'
  return 'text-blue-600'
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
    const t = new Date(record.datetime).getTime()
    const matchLevel = !filters.value.level || record.level === filters.value.level
    const matchCamera = !filters.value.camera || record.camera === filters.value.camera
    const matchDate = t >= startTime && t <= endTime
    return matchLevel && matchCamera && matchDate
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

const exportRecords = (): void => {
  alert('导出记录功能')
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

const generateReport = (): void => {
  alert('生成报告功能')
}

// 生命周期
onMounted(() => {
  allRecords.value = generateMockData()
  applyFilters()
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