<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  Filter,
  Download,
  View,
  Edit,
  Delete,
  Warning,
  Check,
  Close,
  VideoCamera,
  Location,
  Clock,
  User
} from '@element-plus/icons-vue'

// 数据接口定义
interface WarningRecord {
  id: string
  cameraId: string
  cameraName: string
  location: string
  type: 'no_helmet' | 'improper_helmet' | 'multiple_violations'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'processing' | 'resolved' | 'ignored'
  detectedAt: string
  processedAt?: string
  processedBy?: string
  description: string
  imageUrl: string
  confidence: number
  personCount: number
  violationCount: number
  notes?: string
}

interface FilterOptions {
  dateRange: [string, string] | null
  cameraId: string
  type: string
  severity: string
  status: string
  keyword: string
}

// 动画配置
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: 'easeOut' }
}

// 响应式数据
const loading = ref(false)
const tableLoading = ref(false)
const selectedRows = ref<WarningRecord[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 筛选条件
const filters = ref<FilterOptions>({
  dateRange: null,
  cameraId: '',
  type: '',
  severity: '',
  status: '',
  keyword: ''
})

// 警告记录数据
const warningRecords = ref<WarningRecord[]>([
  {
    id: 'W001',
    cameraId: 'CAM001',
    cameraName: '主入口摄像头',
    location: '工地大门',
    type: 'no_helmet',
    severity: 'high',
    status: 'pending',
    detectedAt: '2024-01-15 14:28:30',
    description: '检测到1名工人未佩戴安全帽',
    imageUrl: '/images/warnings/w001.jpg',
    confidence: 95.6,
    personCount: 1,
    violationCount: 1
  },
  {
    id: 'W002',
    cameraId: 'CAM002',
    cameraName: '施工区域A',
    location: '1号楼施工区',
    type: 'improper_helmet',
    severity: 'medium',
    status: 'processing',
    detectedAt: '2024-01-15 13:42:20',
    processedAt: '2024-01-15 14:10:15',
    processedBy: '张三',
    description: '检测到安全帽佩戴不规范',
    imageUrl: '/images/warnings/w002.jpg',
    confidence: 87.3,
    personCount: 1,
    violationCount: 1,
    notes: '已通知现场安全员处理'
  },
  {
    id: 'W003',
    cameraId: 'CAM003',
    cameraName: '施工区域B',
    location: '2号楼施工区',
    type: 'multiple_violations',
    severity: 'critical',
    status: 'resolved',
    detectedAt: '2024-01-15 12:15:45',
    processedAt: '2024-01-15 12:45:30',
    processedBy: '李四',
    description: '检测到多名工人违规操作',
    imageUrl: '/images/warnings/w003.jpg',
    confidence: 92.1,
    personCount: 3,
    violationCount: 3,
    notes: '已现场整改完成，加强安全培训'
  }
])

// 摄像头选项
const cameraOptions = ref([
  { value: 'CAM001', label: '主入口摄像头' },
  { value: 'CAM002', label: '施工区域A' },
  { value: 'CAM003', label: '施工区域B' },
  { value: 'CAM004', label: '材料堆放区' },
  { value: 'CAM005', label: '办公区域' }
])

// 警告类型选项
const typeOptions = [
  { value: 'no_helmet', label: '未佩戴安全帽' },
  { value: 'improper_helmet', label: '安全帽佩戴不规范' },
  { value: 'multiple_violations', label: '多项违规' }
]

// 严重程度选项
const severityOptions = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
  { value: 'critical', label: '严重' }
]

// 状态选项
const statusOptions = [
  { value: 'pending', label: '待处理' },
  { value: 'processing', label: '处理中' },
  { value: 'resolved', label: '已解决' },
  { value: 'ignored', label: '已忽略' }
]

// 计算属性
const filteredRecords = computed(() => {
  let result = [...warningRecords.value]
  
  // 关键词搜索
  if (filters.value.keyword) {
    const keyword = filters.value.keyword.toLowerCase()
    result = result.filter(record => 
      record.cameraName.toLowerCase().includes(keyword) ||
      record.location.toLowerCase().includes(keyword) ||
      record.description.toLowerCase().includes(keyword)
    )
  }
  
  // 摄像头筛选
  if (filters.value.cameraId) {
    result = result.filter(record => record.cameraId === filters.value.cameraId)
  }
  
  // 类型筛选
  if (filters.value.type) {
    result = result.filter(record => record.type === filters.value.type)
  }
  
  // 严重程度筛选
  if (filters.value.severity) {
    result = result.filter(record => record.severity === filters.value.severity)
  }
  
  // 状态筛选
  if (filters.value.status) {
    result = result.filter(record => record.status === filters.value.status)
  }
  
  // 日期范围筛选
  if (filters.value.dateRange && filters.value.dateRange.length === 2) {
    const [startDate, endDate] = filters.value.dateRange
    result = result.filter(record => {
      const recordDate = new Date(record.detectedAt)
      return recordDate >= new Date(startDate) && recordDate <= new Date(endDate)
    })
  }
  
  total.value = result.length
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

// 统计数据
const statistics = computed(() => {
  const records = warningRecords.value
  return {
    total: records.length,
    pending: records.filter(r => r.status === 'pending').length,
    processing: records.filter(r => r.status === 'processing').length,
    resolved: records.filter(r => r.status === 'resolved').length,
    critical: records.filter(r => r.severity === 'critical').length
  }
})

// 方法
const getTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    no_helmet: '未佩戴安全帽',
    improper_helmet: '佩戴不规范',
    multiple_violations: '多项违规'
  }
  return typeMap[type] || type
}

const getTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    no_helmet: 'danger',
    improper_helmet: 'warning',
    multiple_violations: 'danger'
  }
  return colorMap[type] || 'info'
}

const getSeverityText = (severity: string) => {
  const severityMap: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    critical: '严重'
  }
  return severityMap[severity] || severity
}

const getSeverityColor = (severity: string) => {
  const colorMap: Record<string, string> = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
    critical: 'danger'
  }
  return colorMap[severity] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    ignored: '已忽略'
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'warning',
    processing: 'primary',
    resolved: 'success',
    ignored: 'info'
  }
  return colorMap[status] || 'info'
}

const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString('zh-CN')
}

const handleSearch = () => {
  currentPage.value = 1
  // 这里可以调用API进行搜索
}

const handleReset = () => {
  filters.value = {
    dateRange: null,
    cameraId: '',
    type: '',
    severity: '',
    status: '',
    keyword: ''
  }
  currentPage.value = 1
}

const handleRefresh = async () => {
  tableLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('数据刷新成功')
  } catch (error) {
    ElMessage.error('数据刷新失败')
  } finally {
    tableLoading.value = false
  }
}

const handleSelectionChange = (selection: WarningRecord[]) => {
  selectedRows.value = selection
}

const handleView = (record: WarningRecord) => {
  // 查看详情逻辑
  ElMessage.info(`查看警告记录: ${record.id}`)
}

const handleProcess = async (record: WarningRecord) => {
  try {
    await ElMessageBox.prompt('请输入处理备注', '处理警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入处理备注'
    })
    
    // 更新状态
    record.status = 'processing'
    record.processedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
    record.processedBy = '当前用户' // 实际应该从用户信息获取
    
    ElMessage.success('警告处理成功')
  } catch (error) {
    // 用户取消
  }
}

const handleResolve = async (record: WarningRecord) => {
  try {
    await ElMessageBox.prompt('请输入解决方案', '解决警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPlaceholder: '请输入解决方案'
    })
    
    // 更新状态
    record.status = 'resolved'
    record.processedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
    record.processedBy = '当前用户'
    
    ElMessage.success('警告已解决')
  } catch (error) {
    // 用户取消
  }
}

const handleIgnore = async (record: WarningRecord) => {
  try {
    await ElMessageBox.confirm('确定要忽略此警告吗？', '忽略警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    record.status = 'ignored'
    record.processedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
    record.processedBy = '当前用户'
    
    ElMessage.success('警告已忽略')
  } catch (error) {
    // 用户取消
  }
}

const handleBatchProcess = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要处理的记录')
    return
  }
  
  try {
    await ElMessageBox.confirm(`确定要批量处理选中的 ${selectedRows.value.length} 条记录吗？`, '批量处理', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 批量更新状态
    selectedRows.value.forEach(record => {
      record.status = 'processing'
      record.processedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
      record.processedBy = '当前用户'
    })
    
    ElMessage.success(`成功处理 ${selectedRows.value.length} 条记录`)
    selectedRows.value = []
  } catch (error) {
    // 用户取消
  }
}

const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

// 生命周期
onMounted(() => {
  // 初始化数据
})
</script>

<template>
  <Motion :initial="pageVariants.initial" :animate="pageVariants.animate" :transition="pageVariants.transition as any"
    class="warnings-page">
    <div class="warnings-container">
      <!-- 页面头部 -->
      <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.1 }">
        <div class="page-header">
          <div class="header-left">
            <h2 class="page-title">警告管理</h2>
            <p class="page-subtitle">安全帽检测警告记录管理与处理</p>
          </div>
          <div class="header-right">
            <el-space>
              <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                <el-button @click="handleRefresh" :loading="tableLoading">
                  <el-icon>
                    <Refresh />
                  </el-icon>
                  刷新
                </el-button>
              </Motion>
              <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                <el-button type="primary" @click="handleExport">
                  <el-icon>
                    <Download />
                  </el-icon>
                  导出数据
                </el-button>
              </Motion>
            </el-space>
          </div>
        </div>
      </Motion>

      <!-- 统计卡片 -->
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.2 }">
        <el-row :gutter="24" class="stats-row">
          <el-col :xs="24" :sm="12" :md="6" :lg="4">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.1 } as any">
              <el-card class="stat-card total-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon">
                    <el-icon size="24" color="#409EFF">
                      <Warning />
                    </el-icon>
                  </div>
                  <div class="stat-info">
                    <h3 class="stat-title">总警告数</h3>
                    <p class="stat-value">{{ statistics.total }}</p>
                  </div>
                </div>
              </el-card>
            </Motion>
          </el-col>
          
          <el-col :xs="24" :sm="12" :md="6" :lg="4">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.2 } as any">
              <el-card class="stat-card pending-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon">
                    <el-icon size="24" color="#E6A23C">
                      <Clock />
                    </el-icon>
                  </div>
                  <div class="stat-info">
                    <h3 class="stat-title">待处理</h3>
                    <p class="stat-value">{{ statistics.pending }}</p>
                  </div>
                </div>
              </el-card>
            </Motion>
          </el-col>
          
          <el-col :xs="24" :sm="12" :md="6" :lg="4">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.3 } as any">
              <el-card class="stat-card processing-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon">
                    <el-icon size="24" color="#409EFF">
                      <Edit />
                    </el-icon>
                  </div>
                  <div class="stat-info">
                    <h3 class="stat-title">处理中</h3>
                    <p class="stat-value">{{ statistics.processing }}</p>
                  </div>
                </div>
              </el-card>
            </Motion>
          </el-col>
          
          <el-col :xs="24" :sm="12" :md="6" :lg="4">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.4 } as any">
              <el-card class="stat-card resolved-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon">
                    <el-icon size="24" color="#67C23A">
                      <Check />
                    </el-icon>
                  </div>
                  <div class="stat-info">
                    <h3 class="stat-title">已解决</h3>
                    <p class="stat-value">{{ statistics.resolved }}</p>
                  </div>
                </div>
              </el-card>
            </Motion>
          </el-col>
          
          <el-col :xs="24" :sm="12" :md="6" :lg="4">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.5 } as any">
              <el-card class="stat-card critical-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon">
                    <el-icon size="24" color="#F56C6C">
                      <Warning />
                    </el-icon>
                  </div>
                  <div class="stat-info">
                    <h3 class="stat-title">严重警告</h3>
                    <p class="stat-value">{{ statistics.critical }}</p>
                  </div>
                </div>
              </el-card>
            </Motion>
          </el-col>
        </el-row>
      </Motion>

      <!-- 筛选区域 -->
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.4 }">
        <el-card class="filter-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3>筛选条件</h3>
              <el-icon><Filter /></el-icon>
            </div>
          </template>
          
          <el-form :model="filters" label-width="80px" class="filter-form">
            <el-row :gutter="24">
              <el-col :xs="24" :sm="12" :md="8" :lg="6">
                <el-form-item label="关键词">
                  <el-input
                    v-model="filters.keyword"
                    placeholder="搜索摄像头、位置或描述"
                    clearable
                    @keyup.enter="handleSearch"
                  >
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
              
              <el-col :xs="24" :sm="12" :md="8" :lg="6">
                <el-form-item label="摄像头">
                  <el-select v-model="filters.cameraId" placeholder="选择摄像头" clearable>
                    <el-option
                      v-for="camera in cameraOptions"
                      :key="camera.value"
                      :label="camera.label"
                      :value="camera.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              
              <el-col :xs="24" :sm="12" :md="8" :lg="6">
                <el-form-item label="警告类型">
                  <el-select v-model="filters.type" placeholder="选择类型" clearable>
                    <el-option
                      v-for="type in typeOptions"
                      :key="type.value"
                      :label="type.label"
                      :value="type.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              
              <el-col :xs="24" :sm="12" :md="8" :lg="6">
                <el-form-item label="严重程度">
                  <el-select v-model="filters.severity" placeholder="选择严重程度" clearable>
                    <el-option
                      v-for="severity in severityOptions"
                      :key="severity.value"
                      :label="severity.label"
                      :value="severity.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              
              <el-col :xs="24" :sm="12" :md="8" :lg="6">
                <el-form-item label="状态">
                  <el-select v-model="filters.status" placeholder="选择状态" clearable>
                    <el-option
                      v-for="status in statusOptions"
                      :key="status.value"
                      :label="status.label"
                      :value="status.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              
              <el-col :xs="24" :sm="12" :md="8" :lg="6">
                <el-form-item label="日期范围">
                  <el-date-picker
                    v-model="filters.dateRange"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="YYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            
            <el-row>
              <el-col :span="24">
                <div class="filter-actions">
                  <el-space>
                    <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                      <el-button type="primary" @click="handleSearch">
                        <el-icon><Search /></el-icon>
                        搜索
                      </el-button>
                    </Motion>
                    <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                      <el-button @click="handleReset">
                        重置
                      </el-button>
                    </Motion>
                  </el-space>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </Motion>

      <!-- 数据表格 -->
      <Motion :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.6 }">
        <el-card class="table-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <h3>警告记录列表</h3>
              <div class="table-actions">
                <el-space>
                  <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                    <el-button 
                      type="primary" 
                      @click="handleBatchProcess" 
                      :disabled="selectedRows.length === 0"
                    >
                      批量处理 ({{ selectedRows.length }})
                    </el-button>
                  </Motion>
                </el-space>
              </div>
            </div>
          </template>
          
          <el-table
            :data="filteredRecords"
            v-loading="tableLoading"
            @selection-change="handleSelectionChange"
            stripe
            border
            style="width: 100%"
          >
            <el-table-column type="selection" width="55" />
            
            <el-table-column prop="id" label="警告ID" width="100" />
            
            <el-table-column label="摄像头信息" width="200">
              <template #default="{ row }">
                <div class="camera-info">
                  <div class="camera-name">
                    <el-icon><VideoCamera /></el-icon>
                    {{ row.cameraName }}
                  </div>
                  <div class="camera-location">
                    <el-icon><Location /></el-icon>
                    {{ row.location }}
                  </div>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="警告类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getTypeColor(row.type)" size="small">
                  {{ getTypeText(row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            
            <el-table-column label="严重程度" width="100">
              <template #default="{ row }">
                <el-tag :type="getSeverityColor(row.severity)" size="small">
                  {{ getSeverityText(row.severity) }}
                </el-tag>
              </template>
            </el-table-column>
            
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusColor(row.status)" size="small">
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            
            <el-table-column prop="description" label="描述" min-width="200" />
            
            <el-table-column label="检测信息" width="120">
              <template #default="{ row }">
                <div class="detection-info">
                  <div>置信度: {{ row.confidence }}%</div>
                  <div>人数: {{ row.personCount }}</div>
                  <div>违规: {{ row.violationCount }}</div>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column label="检测时间" width="160">
              <template #default="{ row }">
                {{ formatDateTime(row.detectedAt) }}
              </template>
            </el-table-column>
            
            <el-table-column label="处理信息" width="160">
              <template #default="{ row }">
                <div v-if="row.processedAt" class="process-info">
                  <div class="process-time">{{ formatDateTime(row.processedAt) }}</div>
                  <div class="process-user">
                    <el-icon><User /></el-icon>
                    {{ row.processedBy }}
                  </div>
                </div>
                <span v-else class="text-gray-400">未处理</span>
              </template>
            </el-table-column>
            
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-space>
                  <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                    <el-button type="primary" size="small" @click="handleView(row)">
                      <el-icon><View /></el-icon>
                    </el-button>
                  </Motion>
                  
                  <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                    <el-button 
                      v-if="row.status === 'pending'"
                      type="warning" 
                      size="small" 
                      @click="handleProcess(row)"
                    >
                      处理
                    </el-button>
                  </Motion>
                  
                  <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                    <el-button 
                      v-if="row.status === 'processing'"
                      type="success" 
                      size="small" 
                      @click="handleResolve(row)"
                    >
                      解决
                    </el-button>
                  </Motion>
                  
                  <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                    <el-button 
                      v-if="row.status === 'pending'"
                      type="info" 
                      size="small" 
                      @click="handleIgnore(row)"
                    >
                      忽略
                    </el-button>
                  </Motion>
                </el-space>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </el-card>
      </Motion>
    </div>
  </Motion>
</template>

<style scoped>
.warnings-page {
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
}

.warnings-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 0;
}

.header-left .page-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.header-left .page-subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 统计卡片 */
.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 12px;
  border: none;
  transition: all 0.3s ease;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  margin-right: 12px;
  padding: 8px;
  border-radius: 8px;
}

.total-card .stat-icon {
  background: rgba(64, 158, 255, 0.1);
}

.pending-card .stat-icon {
  background: rgba(230, 162, 60, 0.1);
}

.processing-card .stat-icon {
  background: rgba(64, 158, 255, 0.1);
}

.resolved-card .stat-icon {
  background: rgba(103, 194, 58, 0.1);
}

.critical-card .stat-icon {
  background: rgba(245, 108, 108, 0.1);
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 12px;
  color: #909399;
  margin: 0 0 4px 0;
  font-weight: 500;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

/* 筛选区域 */
.filter-card {
  border-radius: 12px;
  border: none;
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.filter-form {
  margin-top: 16px;
}

.filter-actions {
  text-align: right;
  margin-top: 16px;
}

/* 表格区域 */
.table-card {
  border-radius: 12px;
  border: none;
}

.table-actions {
  display: flex;
  align-items: center;
}

.camera-info {
  line-height: 1.4;
}

.camera-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.camera-location {
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

.detection-info {
  font-size: 12px;
  line-height: 1.4;
}

.process-info {
  font-size: 12px;
  line-height: 1.4;
}

.process-time {
  color: #303133;
  margin-bottom: 2px;
}

.process-user {
  color: #909399;
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-container {
  margin-top: 24px;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .warnings-container {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .stats-row {
    margin-bottom: 16px;
  }
  
  .filter-actions {
    text-align: left;
  }
  
  .table-actions {
    margin-top: 8px;
  }
  
  .pagination-container {
    text-align: center;
  }
}
</style>