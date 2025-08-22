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
  Delete,
  Warning,
  Check,
  Close,
  VideoCamera,
  Clock,
  User,
  Tools,
  RefreshRight,
  List,
  Location
} from '@element-plus/icons-vue'
import { getWarnings, updateWarningStatus, deleteWarning } from '@/api/admin/warnings'
import { getCameras } from '@/api/admin/dashboard'
import type { WarningRecord, WarningListRequest } from '@/types/apis/warnings'

// 扩展 window 对象类型
declare global {
  interface Window {
    selectedAction?: string
    selectedActionConfig?: any
  }
}

// 筛选条件接口
interface FilterOptions {
  dateRange: [string, string] | null
  camera_id: string
  severity: 'info' | 'warning' | 'high' | 'critical' | ''
  status: 'pending' | 'processing' | 'resolved' | 'ignored' | ''
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
  camera_id: '',
  severity: '',
  status: '',
})

// 警告记录数据
const warningRecords = ref<WarningRecord[]>([])

// 摄像头选项
const cameraOptions = ref<Array<{ value: string; label: string }>>([])

// 严重程度选项（根据后端API调整）
const severityOptions = [
  { value: 'info', label: '信息' },
  { value: 'warning', label: '警告' },
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

// 计算属性 - 直接使用API返回的数据
const filteredRecords = computed(() => {
  return warningRecords.value
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
const getSeverityText = (severity: string) => {
  const severityMap: Record<string, string> = {
    info: '信息',
    warning: '警告',
    high: '高',
    critical: '严重'
  }
  return severityMap[severity] || severity
}

const getSeverityColor = (severity: string) => {
  const colorMap: Record<string, string> = {
    info: 'info',
    warning: 'warning',
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

// API调用方法
const loadWarnings = async () => {
  tableLoading.value = true
  try {
    const params: WarningListRequest = {
      page: currentPage.value,
      page_size: pageSize.value
    }

    // 添加筛选条件
    if (filters.value.status) {
      params.status = filters.value.status
    }
    if (filters.value.camera_id) {
      params.camera_id = filters.value.camera_id
    }
    if (filters.value.severity) {
      params.severity = filters.value.severity
    }
    if (filters.value.dateRange && filters.value.dateRange.length === 2) {
      params.date_from = filters.value.dateRange[0]
      params.date_to = filters.value.dateRange[1]
    }

    const response = await getWarnings(params)
    if (response.code === 200) {
      warningRecords.value = response.data.warnings
      total.value = response.data.total
    } else {
      ElMessage.error(response.msg || '获取警告数据失败')
    }
  } catch (error) {
    console.error('获取警告数据失败:', error)
    ElMessage.error('获取警告数据失败')
  } finally {
    tableLoading.value = false
  }
}

const loadCameras = async () => {
  try {
    const response = await getCameras()
    if (response.code === 200) {
      cameraOptions.value = response.data.cameras.map(camera => ({
        value: camera.camera_id,
        label: camera.name
      }))
    }
  } catch (error) {
    console.error('获取摄像头数据失败:', error)
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadWarnings()
}

const handleReset = () => {
  filters.value = {
    dateRange: null,
    camera_id: '',
    severity: '',
    status: '',
  }
  currentPage.value = 1
  loadWarnings()
}

const handleRefresh = async () => {
  await loadWarnings()
  ElMessage.success('数据刷新成功')
}

const handleSelectionChange = (selection: WarningRecord[]) => {
  selectedRows.value = selection
}

// 删除警告
const handleDelete = async (record: WarningRecord) => {
  try {
    await ElMessageBox.confirm(`确定要删除警告记录"${record.title}"吗？删除后无法恢复。`, '删除警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const response = await deleteWarning(record.id)

    if (response.code === 200) {
      ElMessage.success('警告删除成功')
      await loadWarnings() // 重新加载数据
    } else {
      ElMessage.error(response.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除警告失败:', error)
      ElMessage.error('删除警告失败')
    }
  }
}

// 修改警告
// 通用解决方案弹窗
const handleSolution = async (record: WarningRecord) => {
  try {
    // 定义所有可用的状态选项
    const getAllStatusActions = () => {
      return [
        { label: '待处理', value: 'pending', type: 'info', needsInput: false, description: '标记为待处理状态，需要进一步关注' },
        { label: '处理中', value: 'processing', type: 'warning', needsInput: true, placeholder: '请输入处理备注', description: '标记为处理中状态，正在解决问题' },
        { label: '已解决', value: 'resolved', type: 'success', needsInput: true, placeholder: '请输入解决方案', description: '标记为已解决状态，问题已处理完成' },
        { label: '忽略', value: 'ignored', type: 'info', needsInput: false, description: '忽略此警告，不进行进一步处理' }
      ]
    }

    const availableActions = getAllStatusActions().filter(action => action.value !== record.status)

    // 创建操作选项的HTML
    const actionsHtml = availableActions.map((action, index) =>
      `<div style="margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; transition: all 0.3s;"
           onmouseover="this.style.backgroundColor='#f5f5f5'"
           onmouseout="this.style.backgroundColor='white'"
           onclick="window.selectedAction='${action.value}'; window.selectedActionConfig=${JSON.stringify(action).replace(/"/g, '&quot;')}; document.querySelectorAll('.action-item').forEach(el => el.style.borderColor='#ddd'); this.style.borderColor='#409eff'; this.style.backgroundColor='#ecf5ff';"
           class="action-item">
        <div style="font-weight: bold; color: ${action.type === 'warning' ? '#e6a23c' : action.type === 'success' ? '#67c23a' : '#909399'}">${action.label}</div>
        <div style="font-size: 12px; color: #666; margin-top: 4px;">${action.description}</div>
      </div>`
    ).join('')

    // 显示操作选择弹窗
    await ElMessageBox({
      title: '修改警告状态',
      message: `
        <div style="margin-bottom: 15px;">请选择警告 #${record.id} 的新状态（当前状态：<strong>${getStatusLabel(record.status)}</strong>）：</div>
        <div style="max-height: 300px; overflow-y: auto;">${actionsHtml}</div>
        <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 4px; font-size: 12px; color: #666;">
          <strong>警告信息：</strong>${record.description}
        </div>
      `,
      dangerouslyUseHTMLString: true,
      confirmButtonText: '下一步',
      cancelButtonText: '取消',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          if (!window.selectedAction) {
            ElMessage.warning('请先选择一个处理方式')
            return false
          }
        }
        done()
      }
    })

    const selectedActionConfig = window.selectedActionConfig
    if (!selectedActionConfig) return

    // 如果需要输入备注，显示输入弹窗
    let notes = ''
    if (selectedActionConfig.needsInput) {
      const { value } = await ElMessageBox.prompt(
        selectedActionConfig.placeholder,
        `${selectedActionConfig.label} - 请输入备注`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: selectedActionConfig.placeholder
        }
      )
      notes = value as string
    } else {
      // 对于不需要输入的操作，显示确认弹窗
      await ElMessageBox.confirm(
        `确定要将警告状态修改为"${selectedActionConfig.label}"吗？`,
        '确认修改状态',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
    }

    // 执行状态更新
    const response = await updateWarningStatus({
      warning_id: record.id,
      status: window.selectedAction as 'pending' | 'processing' | 'resolved' | 'ignored',
      notes: notes
    })

    if (response.code === 200) {
      ElMessage.success(`状态修改为"${selectedActionConfig.label}"成功`)
      await loadWarnings() // 重新加载数据
    } else {
      ElMessage.error(response.msg || `状态修改失败`)
    }

    // 清理全局变量
    delete window.selectedAction
    delete window.selectedActionConfig

  } catch (error) {
    if (error !== 'cancel') {
      console.error('处理警告失败:', error)
      ElMessage.error('操作失败')
    }
    // 清理全局变量
    delete window.selectedAction
    delete window.selectedActionConfig
  }
}

// 获取状态标签
const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return '待处理'
    case 'processing':
      return '处理中'
    case 'resolved':
      return '已解决'
    case 'ignored':
      return '忽略'
    default:
      return status
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
    const promises = selectedRows.value.map(record =>
      updateWarningStatus({
        warning_id: record.id,
        status: 'processing'
      })
    )

    const results = await Promise.allSettled(promises)
    const successCount = results.filter(result =>
      result.status === 'fulfilled' && result.value.code === 200
    ).length

    if (successCount === selectedRows.value.length) {
      ElMessage.success(`成功处理 ${successCount} 条记录`)
    } else {
      ElMessage.warning(`成功处理 ${successCount} 条记录，${selectedRows.value.length - successCount} 条记录处理失败`)
    }

    selectedRows.value = []
    await loadWarnings() // 重新加载数据
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量处理失败:', error)
      ElMessage.error('批量处理失败')
    }
  }
}

const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

// 导出数据
const exportData = () => {
  ElMessage.info('导出功能开发中...')
}

// 刷新数据
const refreshData = async () => {
  await loadWarnings()
  ElMessage.success('数据刷新成功')
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadWarnings()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadWarnings()
}

// 生命周期
onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      loadWarnings(),
      loadCameras()
    ])
  } catch (error) {
    console.error('初始化数据失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="warnings-page">
    <div class="warnings-container">

      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <Motion :initial="{ opacity: 0, y: 40, scale: 0.9 }" :animate="{ opacity: 1, y: 0, scale: 1 }"
          :whileHover="{ scale: 1.05, y: -8 }" :transition="{ duration: 0.5, delay: 0.1 }"
          class="bg-blue-50 p-4 rounded-lg cursor-pointer shadow-sm hover:shadow-lg transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-600 text-sm font-medium">总警告数</p>
              <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.4, delay: 0.3 }">
                <p class="text-2xl font-bold text-blue-900">{{ statistics.total }}</p>
              </Motion>
            </div>
            <Motion :initial="{ scale: 0, rotate: -180 }" :animate="{ scale: 1, rotate: 0 }"
              :whileHover="{ scale: 1.2, rotate: 10 }" :transition="{ duration: 0.6, delay: 0.4 }"
              class="text-blue-500">
              <el-icon size="28">
                <Warning />
              </el-icon>
            </Motion>
          </div>
        </Motion>

        <Motion :initial="{ opacity: 0, y: 40, scale: 0.9 }" :animate="{ opacity: 1, y: 0, scale: 1 }"
          :whileHover="{ scale: 1.05, y: -8 }" :transition="{ duration: 0.5, delay: 0.2 }"
          class="bg-yellow-50 p-4 rounded-lg cursor-pointer shadow-sm hover:shadow-lg transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-yellow-600 text-sm font-medium">待处理</p>
              <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.4, delay: 0.4 }">
                <p class="text-2xl font-bold text-yellow-900">{{ statistics.pending }}</p>
              </Motion>
            </div>
            <Motion :initial="{ scale: 0, rotate: -180 }" :animate="{ scale: 1, rotate: 0 }"
              :whileHover="{ scale: 1.2, rotate: 10 }" :transition="{ duration: 0.6, delay: 0.5 }"
              class="text-yellow-500">
              <el-icon size="28">
                <Clock />
              </el-icon>
            </Motion>
          </div>
        </Motion>

        <Motion :initial="{ opacity: 0, y: 40, scale: 0.9 }" :animate="{ opacity: 1, y: 0, scale: 1 }"
          :whileHover="{ scale: 1.05, y: -8 }" :transition="{ duration: 0.5, delay: 0.3 }"
          class="bg-purple-50 p-4 rounded-lg cursor-pointer shadow-sm hover:shadow-lg transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-600 text-sm font-medium">处理中</p>
              <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.4, delay: 0.5 }">
                <p class="text-2xl font-bold text-purple-900">{{ statistics.processing }}</p>
              </Motion>
            </div>
            <Motion :initial="{ scale: 0, rotate: -180 }" :animate="{ scale: 1, rotate: 0 }"
              :whileHover="{ scale: 1.2, rotate: 10 }" :transition="{ duration: 0.6, delay: 0.6 }"
              class="text-purple-500">
              <el-icon size="28">
                <Tools />
              </el-icon>
            </Motion>
          </div>
        </Motion>

        <Motion :initial="{ opacity: 0, y: 40, scale: 0.9 }" :animate="{ opacity: 1, y: 0, scale: 1 }"
          :whileHover="{ scale: 1.05, y: -8 }" :transition="{ duration: 0.5, delay: 0.4 }"
          class="bg-green-50 p-4 rounded-lg cursor-pointer shadow-sm hover:shadow-lg transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-600 text-sm font-medium">已解决</p>
              <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.4, delay: 0.6 }">
                <p class="text-2xl font-bold text-green-900">{{ statistics.resolved }}</p>
              </Motion>
            </div>
            <Motion :initial="{ scale: 0, rotate: -180 }" :animate="{ scale: 1, rotate: 0 }"
              :whileHover="{ scale: 1.2, rotate: 10 }" :transition="{ duration: 0.6, delay: 0.7 }"
              class="text-green-500">
              <el-icon size="28">
                <Check />
              </el-icon>
            </Motion>
          </div>
        </Motion>

        <Motion :initial="{ opacity: 0, y: 40, scale: 0.9 }" :animate="{ opacity: 1, y: 0, scale: 1 }"
          :whileHover="{ scale: 1.05, y: -8 }" :transition="{ duration: 0.5, delay: 0.5 }"
          class="bg-red-50 p-4 rounded-lg cursor-pointer shadow-sm hover:shadow-lg transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-600 text-sm font-medium">严重警告</p>
              <Motion :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }"
                :transition="{ duration: 0.4, delay: 0.7 }">
                <p class="text-2xl font-bold text-red-900">{{ statistics.critical }}</p>
              </Motion>
            </div>
            <Motion :initial="{ scale: 0, rotate: -180 }" :animate="{ scale: 1, rotate: 0 }"
              :whileHover="{ scale: 1.2, rotate: 10 }" :transition="{ duration: 0.6, delay: 0.8 }" class="text-red-500">
              <el-icon size="28">
                <Warning />
              </el-icon>
            </Motion>
          </div>
        </Motion>
      </div>

      <!-- 筛选区域 -->
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.4 }">
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <el-icon class="text-blue-600">
                  <Filter />
                </el-icon>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">筛选条件</h3>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <el-icon class="text-gray-500">
                  <VideoCamera />
                </el-icon>
                <span>摄像头</span>
              </label>
              <el-select v-model="filters.camera_id" placeholder="选择摄像头" clearable class="w-full">
                <el-option v-for="camera in cameraOptions" :key="camera.value" :label="camera.label"
                  :value="camera.value" />
              </el-select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <el-icon class="text-gray-500">
                  <Warning />
                </el-icon>
                <span>严重程度</span>
              </label>
              <el-select v-model="filters.severity" placeholder="选择严重程度" clearable class="w-full">
                <el-option v-for="severity in severityOptions" :key="severity.value" :label="severity.label"
                  :value="severity.value" />
              </el-select>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700 flex items-center space-x-1">
                <el-icon class="text-gray-500">
                  <Tools />
                </el-icon>
                <span>状态</span>
              </label>
              <el-select v-model="filters.status" placeholder="选择状态" clearable class="w-full">
                <el-option v-for="status in statusOptions" :key="status.value" :label="status.label"
                  :value="status.value" />
              </el-select>
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
            <Motion :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }">
              <el-button @click="handleReset" class="!rounded-lg">
                <el-icon>
                  <RefreshRight />
                </el-icon>
                重置
              </el-button>
            </Motion>
            <Motion :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }">
              <el-button type="primary" @click="handleSearch"
                class="!rounded-lg !bg-gradient-to-r !from-blue-500 !to-blue-600 !border-0">
                <el-icon>
                  <Search />
                </el-icon>
                搜索
              </el-button>
            </Motion>
          </div>
        </div>
      </Motion>

      <!-- 数据表格 -->
      <Motion :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.6 }" class="flex-1 flex flex-col">
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between p-6 border-b border-gray-100">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <el-icon class="text-green-600">
                  <Warning />
                </el-icon>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">警告记录列表</h3>
            </div>
            <div class="flex space-x-3">
              <Motion :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }">
                <el-button type="primary" @click="handleBatchProcess" :disabled="selectedRows.length === 0"
                  class="!rounded-lg !bg-gradient-to-r !from-blue-500 !to-blue-600 !border-0">
                  批量处理 ({{ selectedRows.length }})
                </el-button>
              </Motion>
              <Motion :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }">
                <el-button @click="refreshData" class="!rounded-lg">
                  <el-icon>
                    <Refresh />
                  </el-icon>
                  刷新
                </el-button>
              </Motion>
              <Motion :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }">
                <el-button @click="exportData" class="!rounded-lg">
                  <el-icon>
                    <Download />
                  </el-icon>
                  导出
                </el-button>
              </Motion>
            </div>
          </div>

          <div class="flex-1 overflow-hidden">
            <el-table :data="filteredRecords" v-loading="tableLoading" @selection-change="handleSelectionChange" stripe
              class="h-full" :height="500">
              <el-table-column type="selection" width="55" align="center" />

              <el-table-column prop="id" label="警告ID" width="100" align="center">
                <template #default="{ row }">
                  <span class="font-mono text-sm text-gray-600">#{{ row.id }}</span>
                </template>
              </el-table-column>

              <el-table-column label="摄像头信息" width="150">
                <template #default="{ row }">
                  <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <el-icon class="text-blue-600 text-xs">
                        <VideoCamera />
                      </el-icon>
                    </div>
                    <span class="text-sm text-gray-700 truncate">{{ row.camera_name }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="严重程度" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getSeverityColor(row.warning_level)" size="small" class="!rounded-full">
                    {{ getSeverityText(row.warning_level) }}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column label="状态" width="100" align="center">
                <template #default="{ row }">
                  <el-tag :type="getStatusColor(row.status)" size="small" class="!rounded-full">
                    {{ getStatusText(row.status) }}
                  </el-tag>
                </template>
              </el-table-column>

              <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip>
                <template #default="{ row }">
                  <div class="text-sm text-gray-700">{{ row.description }}</div>
                </template>
              </el-table-column>

              <el-table-column label="检测信息" width="120">
                <template #default="{ row }">
                  <div class="space-y-1 text-xs">
                    <div class="text-gray-600">置信度: {{ row.confidence || 0 }}%</div>
                    <div class="text-gray-600">人数: {{ row.person_count || 0 }}</div>
                    <div class="text-gray-600">违规: {{ row.violation_count || 0 }}</div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="检测时间" width="160" align="center">
                <template #default="{ row }">
                  <div class="text-sm text-gray-600">{{ formatDateTime(row.detection_time || row.created_at) }}</div>
                </template>
              </el-table-column>

              <el-table-column label="处理信息" width="160">
                <template #default="{ row }">
                  <div v-if="row.resolved_at" class="space-y-1">
                    <div class="text-xs text-gray-600">{{ formatDateTime(row.resolved_at) }}</div>
                    <div v-if="row.resolved_by" class="flex items-center text-xs text-gray-500">
                      <el-icon class="mr-1">
                        <User />
                      </el-icon>
                      {{ row.resolved_by }}
                    </div>
                  </div>
                  <span v-else class="text-xs text-gray-400">未处理</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="200" fixed="right" align="center">
                <template #default="{ row }">
                  <div class="flex space-x-2 justify-center">
                    <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                      <el-button type="danger" size="small" @click="handleDelete(row)" class="!rounded-lg">
                        <el-icon>
                          <Delete />
                        </el-icon>
                      </el-button>
                    </Motion>

                    <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                      <el-button v-if="row.status !== 'resolved' && row.status !== 'ignored'" type="primary"
                        size="small" @click="handleSolution(row)" class="!rounded-lg">
                        <el-icon>
                          <Tools />
                        </el-icon>
                        解决
                      </el-button>
                    </Motion>

                    <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                      <el-button v-if="row.status === 'resolved' || row.status === 'ignored'" type="warning"
                        size="small" @click="handleSolution(row)" class="!rounded-lg">
                        <el-icon>
                          <RefreshRight />
                        </el-icon>
                        重新处理
                      </el-button>
                    </Motion>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 分页 -->
          <div class="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
              :page-sizes="[10, 20, 50, 100]" :total="total" layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange" @current-change="handlePageChange" class="justify-center" />
          </div>
        </div>
      </Motion>
    </div>
  </div>
</template>

<style scoped>
.warnings-page {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.warnings-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Tailwind CSS classes are used for most styling */
/* Additional custom styles for specific components */

.el-table {
  border-radius: 0.5rem;
}

.el-table th {
  background-color: #f8fafc;
  color: #374151;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}

.el-table td {
  border-bottom: 1px solid #f3f4f6;
}

.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #f9fafb;
}

.el-pagination {
  --el-pagination-bg-color: transparent;
  --el-pagination-text-color: #6b7280;
  --el-pagination-border-radius: 0.5rem;
}

.el-pagination .btn-next,
.el-pagination .btn-prev {
  border-radius: 0.5rem;
}

.el-pagination .el-pager li {
  border-radius: 0.5rem;
  margin: 0 2px;
}

.el-button {
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
}

.el-select {
  width: 100%;
}

.el-date-editor {
  width: 100%;
}

.el-input {
  border-radius: 0.5rem;
}

.el-tag {
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .warnings-page {
    padding: 0.5rem;
  }

  .warnings-container {
    padding: 0.5rem;
  }

  .grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .lg\:grid-cols-5 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lg\:grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lg\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .warnings-page {
    padding: 0.25rem;
  }

  .warnings-container {
    padding: 0.25rem;
  }

  .flex {
    flex-direction: column;
  }

  .space-x-2>*+* {
    margin-left: 0;
    margin-top: 0.5rem;
  }

  .space-x-3>*+* {
    margin-left: 0;
    margin-top: 0.75rem;
  }
}
</style>