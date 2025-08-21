<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Download,
  Document,
  Calendar,
  Filter,
  Refresh,
  DocumentCopy,
  Files,
  Histogram,
  PieChart,
  TrendCharts,
  DataAnalysis,
  Clock,
  User,
  Camera,
  Warning
} from '@element-plus/icons-vue'

// 数据接口定义
interface ExportTask {
  id: string
  name: string
  type: 'detection_records' | 'warning_logs' | 'system_reports' | 'user_activity'
  format: 'excel' | 'pdf' | 'csv' | 'json'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  created_at: string
  completed_at?: string
  file_size?: string
  download_url?: string
  parameters: {
    date_range: [string, string]
    filters?: Record<string, any>
  }
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  format: 'pdf' | 'excel'
  sections: string[]
  enabled: boolean
  schedule?: string
}

interface ExportFilter {
  date_range: [string, string]
  camera_ids: string[]
  warning_types: string[]
  severity_levels: string[]
  user_ids: string[]
  confidence_min: number
  confidence_max: number
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
const activeTab = ref('export')
const exportTasks = ref<ExportTask[]>([
  {
    id: 'task_001',
    name: '2024年1月检测记录',
    type: 'detection_records',
    format: 'excel',
    status: 'completed',
    progress: 100,
    created_at: '2024-01-15 10:30:00',
    completed_at: '2024-01-15 10:32:15',
    file_size: '2.5MB',
    download_url: '/downloads/detection_records_202401.xlsx',
    parameters: {
      date_range: ['2024-01-01', '2024-01-31']
    }
  },
  {
    id: 'task_002',
    name: '警告日志导出',
    type: 'warning_logs',
    format: 'pdf',
    status: 'processing',
    progress: 65,
    created_at: '2024-01-16 14:20:00',
    parameters: {
      date_range: ['2024-01-10', '2024-01-16']
    }
  }
])

// 报告模板
const reportTemplates = ref<ReportTemplate[]>([
  {
    id: 'template_001',
    name: '日报模板',
    description: '每日安全检测汇总报告',
    type: 'daily',
    format: 'pdf',
    sections: ['检测统计', '警告汇总', '设备状态', '趋势分析'],
    enabled: true,
    schedule: '0 18 * * *'
  },
  {
    id: 'template_002',
    name: '周报模板',
    description: '每周安全检测详细报告',
    type: 'weekly',
    format: 'excel',
    sections: ['周度统计', '违规分析', '改进建议', '对比分析'],
    enabled: true,
    schedule: '0 9 * * 1'
  },
  {
    id: 'template_003',
    name: '月报模板',
    description: '月度安全管理综合报告',
    type: 'monthly',
    format: 'pdf',
    sections: ['月度概览', '详细分析', '趋势预测', '管理建议'],
    enabled: false
  }
])

// 导出筛选条件
const exportFilter = reactive<ExportFilter>({
  date_range: ['', ''],
  camera_ids: [],
  warning_types: [],
  severity_levels: [],
  user_ids: [],
  confidence_min: 0,
  confidence_max: 100
})

// 快速导出表单
const quickExportForm = reactive({
  type: 'detection_records',
  format: 'excel',
  date_range: ['', ''],
  name: ''
})

// 选项数据
const exportTypeOptions = [
  { label: '检测记录', value: 'detection_records', icon: Camera },
  { label: '警告日志', value: 'warning_logs', icon: Warning },
  { label: '系统报告', value: 'system_reports', icon: Document },
  { label: '用户活动', value: 'user_activity', icon: User }
]

const formatOptions = [
  { label: 'Excel表格', value: 'excel', icon: 'excel' },
  { label: 'PDF文档', value: 'pdf', icon: 'pdf' },
  { label: 'CSV文件', value: 'csv', icon: 'csv' },
  { label: 'JSON数据', value: 'json', icon: 'json' }
]

const warningTypeOptions = [
  { label: '未佩戴安全帽', value: 'no_helmet' },
  { label: '佩戴不规范', value: 'improper_helmet' },
  { label: '多项违规', value: 'multiple_violations' }
]

const severityOptions = [
  { label: '低', value: 'low' },
  { label: '中', value: 'medium' },
  { label: '高', value: 'high' },
  { label: '严重', value: 'critical' }
]

const cameraOptions = [
  { label: '摄像头-001', value: 'cam_001' },
  { label: '摄像头-002', value: 'cam_002' },
  { label: '摄像头-003', value: 'cam_003' },
  { label: '摄像头-004', value: 'cam_004' }
]

const userOptions = [
  { label: '张三', value: 'user_001' },
  { label: '李四', value: 'user_002' },
  { label: '王五', value: 'user_003' }
]

const showQuickExportDialog = ref(false)
const showTemplateDialog = ref(false)
const editingTemplate = ref<ReportTemplate | null>(null)

// 计算属性
const completedTasks = computed(() =>
  exportTasks.value.filter(task => task.status === 'completed')
)

const processingTasks = computed(() =>
  exportTasks.value.filter(task => task.status === 'processing')
)

// 方法
const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: 'info',
    processing: 'warning',
    completed: 'success',
    failed: 'danger'
  }
  return colorMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    pending: '等待中',
    processing: '处理中',
    completed: '已完成',
    failed: '失败'
  }
  return textMap[status] || status
}

const getTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    detection_records: '检测记录',
    warning_logs: '警告日志',
    system_reports: '系统报告',
    user_activity: '用户活动'
  }
  return textMap[type] || type
}

const getFormatIcon = (format: string) => {
  const iconMap: Record<string, string> = {
    excel: '📊',
    pdf: '📄',
    csv: '📋',
    json: '🔧'
  }
  return iconMap[format] || '📄'
}

const handleQuickExport = () => {
  showQuickExportDialog.value = true
  // 设置默认日期范围为最近7天
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - 7)

  quickExportForm.date_range = [
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  ]
}

const handleStartExport = async () => {
  if (!quickExportForm.name) {
    ElMessage.warning('请输入导出任务名称')
    return
  }

  if (!quickExportForm.date_range[0] || !quickExportForm.date_range[1]) {
    ElMessage.warning('请选择日期范围')
    return
  }

  loading.value = true
  try {
    // 模拟创建导出任务
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newTask: ExportTask = {
      id: `task_${Date.now()}`,
      name: quickExportForm.name,
      type: quickExportForm.type as any,
      format: quickExportForm.format as any,
      status: 'processing',
      progress: 0,
      created_at: new Date().toLocaleString(),
      parameters: {
        date_range: [...quickExportForm.date_range] as [string, string]
      }
    }

    exportTasks.value.unshift(newTask)
    showQuickExportDialog.value = false

    // 模拟处理进度
    simulateProgress(newTask)

    ElMessage.success('导出任务已创建')
  } catch (error) {
    ElMessage.error('创建导出任务失败')
  } finally {
    loading.value = false
  }
}

const simulateProgress = (task: ExportTask) => {
  const interval = setInterval(() => {
    task.progress += Math.random() * 20

    if (task.progress >= 100) {
      task.progress = 100
      task.status = 'completed'
      task.completed_at = new Date().toLocaleString()
      task.file_size = `${(Math.random() * 5 + 1).toFixed(1)}MB`
      task.download_url = `/downloads/${task.name.replace(/\s+/g, '_')}.${task.format}`
      clearInterval(interval)
      ElMessage.success(`导出任务"${task.name}"已完成`)
    }
  }, 1000)
}

const handleDownload = (task: ExportTask) => {
  if (task.status === 'completed' && task.download_url) {
    // 模拟下载
    ElMessage.success(`开始下载: ${task.name}`)
    // 实际项目中这里应该触发文件下载
    // window.open(task.download_url, '_blank')
  }
}

const handleDeleteTask = async (task: ExportTask) => {
  try {
    await ElMessageBox.confirm(`确定要删除导出任务"${task.name}"吗？`, '删除任务', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const index = exportTasks.value.findIndex(t => t.id === task.id)
    if (index > -1) {
      exportTasks.value.splice(index, 1)
      ElMessage.success('任务删除成功')
    }
  } catch (error) {
    // 用户取消
  }
}

const handleRetryTask = async (task: ExportTask) => {
  task.status = 'processing'
  task.progress = 0
  task.completed_at = undefined
  task.file_size = undefined
  task.download_url = undefined

  simulateProgress(task)
  ElMessage.success('任务已重新开始')
}

const handleGenerateReport = async (template: ReportTemplate) => {
  loading.value = true
  try {
    // 模拟生成报告
    await new Promise(resolve => setTimeout(resolve, 2000))

    const reportTask: ExportTask = {
      id: `report_${Date.now()}`,
      name: `${template.name}_${new Date().toLocaleDateString()}`,
      type: 'system_reports',
      format: template.format as any,
      status: 'processing',
      progress: 0,
      created_at: new Date().toLocaleString(),
      parameters: {
        date_range: ['', ''] // 根据模板类型设置
      }
    }

    exportTasks.value.unshift(reportTask)
    simulateProgress(reportTask)

    ElMessage.success(`报告"${template.name}"生成中`)
  } catch (error) {
    ElMessage.error('报告生成失败')
  } finally {
    loading.value = false
  }
}

const handleToggleTemplate = (template: ReportTemplate) => {
  template.enabled = !template.enabled
  ElMessage.success(`模板"${template.name}"已${template.enabled ? '启用' : '禁用'}`)
}

const handleEditTemplate = (template: ReportTemplate) => {
  editingTemplate.value = { ...template }
  showTemplateDialog.value = true
}

const handleSaveTemplate = () => {
  if (!editingTemplate.value) return

  const index = reportTemplates.value.findIndex(t => t.id === editingTemplate.value!.id)
  if (index > -1) {
    reportTemplates.value[index] = { ...editingTemplate.value }
    ElMessage.success('模板保存成功')
  }

  showTemplateDialog.value = false
  editingTemplate.value = null
}

const handleRefreshTasks = async () => {
  loading.value = true
  try {
    // 模拟刷新任务列表
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('任务列表已刷新')
  } catch (error) {
    ElMessage.error('刷新失败')
  } finally {
    loading.value = false
  }
}

const resetQuickExportForm = () => {
  Object.assign(quickExportForm, {
    type: 'detection_records',
    format: 'excel',
    date_range: ['', ''],
    name: ''
  })
}

// 生命周期
onMounted(() => {
  // 初始化数据
})
</script>

<template>
  <Motion :initial="pageVariants.initial" :animate="pageVariants.animate" :transition="pageVariants.transition as any"
    class="export-page">
    <div class="export-container">
      <!-- 页面头部 -->
      <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.1 }">
        <div class="page-header">
          <div class="header-left">
            <h2 class="page-title">数据导出</h2>
            <p class="page-subtitle">导出检测数据、生成分析报告</p>
          </div>
          <div class="header-right">
            <el-space>
              <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                <el-button @click="handleRefreshTasks" :loading="loading">
                  <el-icon>
                    <Refresh />
                  </el-icon>
                  刷新
                </el-button>
              </Motion>
              <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                <el-button type="primary" @click="handleQuickExport">
                  <el-icon>
                    <Download />
                  </el-icon>
                  快速导出
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
          <el-col :xs="24" :sm="12" :md="6">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.1 } as any">
              <el-card class="stat-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon total">
                    <el-icon><Files /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ exportTasks.length }}</div>
                    <div class="stat-label">总任务数</div>
                  </div>
                </div>
              </el-card>
            </Motion>
          </el-col>

          <el-col :xs="24" :sm="12" :md="6">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.2 } as any">
              <el-card class="stat-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon processing">
                    <el-icon><Clock /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ processingTasks.length }}</div>
                    <div class="stat-label">处理中</div>
                  </div>
                </div>
              </el-card>
            </Motion>
          </el-col>

          <el-col :xs="24" :sm="12" :md="6">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.3 } as any">
              <el-card class="stat-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon completed">
                    <el-icon><DocumentCopy /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ completedTasks.length }}</div>
                    <div class="stat-label">已完成</div>
                  </div>
                </div>
              </el-card>
            </Motion>
          </el-col>

          <el-col :xs="24" :sm="12" :md="6">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.4 } as any">
              <el-card class="stat-card" shadow="hover">
                <div class="stat-content">
                  <div class="stat-icon templates">
                    <el-icon><Document /></el-icon>
                  </div>
                  <div class="stat-info">
                    <div class="stat-value">{{ reportTemplates.filter(t => t.enabled).length }}</div>
                    <div class="stat-label">活跃模板</div>
                  </div>
                </div>
              </el-card>
            </Motion>
          </el-col>
        </el-row>
      </Motion>

      <!-- 主要内容 -->
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.3 }">
        <el-card class="main-card" shadow="hover">
          <el-tabs v-model="activeTab" class="export-tabs">
            <!-- 导出任务 -->
            <el-tab-pane label="导出任务" name="export">
              <template #label>
                <span class="tab-label">
                  <el-icon><Download /></el-icon>
                  导出任务
                </span>
              </template>

              <div class="tasks-section">
                <div class="tasks-list">
                  <Motion
                    v-for="(task, index) in exportTasks"
                    :key="task.id"
                    :initial="{ opacity: 0, x: -20 }"
                    :animate="{ opacity: 1, x: 0 }"
                    :transition="{ duration: 0.3, delay: index * 0.1 } as any"
                  >
                    <el-card class="task-card" shadow="hover">
                      <div class="task-header">
                        <div class="task-info">
                          <div class="task-name">{{ task.name }}</div>
                          <div class="task-meta">
                            <el-tag :type="getStatusColor(task.status)" size="small">
                              {{ getStatusText(task.status) }}
                            </el-tag>
                            <el-tag type="info" size="small">{{ getTypeText(task.type) }}</el-tag>
                            <span class="task-format">{{ getFormatIcon(task.format) }} {{ task.format.toUpperCase() }}</span>
                          </div>
                        </div>
                        <div class="task-actions">
                          <el-space>
                            <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }" v-if="task.status === 'completed'">
                              <el-button type="primary" size="small" @click="handleDownload(task)">
                                <el-icon><Download /></el-icon>
                                下载
                              </el-button>
                            </Motion>
                            <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }" v-if="task.status === 'failed'">
                              <el-button type="warning" size="small" @click="handleRetryTask(task)">
                                <el-icon><Refresh /></el-icon>
                                重试
                              </el-button>
                            </Motion>
                            <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                              <el-button type="danger" size="small" @click="handleDeleteTask(task)">
                                删除
                              </el-button>
                            </Motion>
                          </el-space>
                        </div>
                      </div>

                      <div class="task-details">
                        <div class="task-progress" v-if="task.status === 'processing'">
                          <el-progress :percentage="Math.round(task.progress)" :stroke-width="6" />
                        </div>

                        <div class="task-info-grid">
                          <div class="info-item">
                            <span class="info-label">创建时间:</span>
                            <span class="info-value">{{ task.created_at }}</span>
                          </div>
                          <div class="info-item" v-if="task.completed_at">
                            <span class="info-label">完成时间:</span>
                            <span class="info-value">{{ task.completed_at }}</span>
                          </div>
                          <div class="info-item" v-if="task.file_size">
                            <span class="info-label">文件大小:</span>
                            <span class="info-value">{{ task.file_size }}</span>
                          </div>
                          <div class="info-item">
                            <span class="info-label">日期范围:</span>
                            <span class="info-value">{{ task.parameters.date_range.join(' ~ ') }}</span>
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </Motion>
                </div>

                <div v-if="exportTasks.length === 0" class="empty-state">
                  <el-empty description="暂无导出任务">
                    <el-button type="primary" @click="handleQuickExport">
                      创建导出任务
                    </el-button>
                  </el-empty>
                </div>
              </div>
            </el-tab-pane>

            <!-- 报告模板 -->
            <el-tab-pane label="报告模板" name="templates">
              <template #label>
                <span class="tab-label">
                  <el-icon><Document /></el-icon>
                  报告模板
                </span>
              </template>

              <div class="templates-section">
                <div class="templates-grid">
                  <Motion
                    v-for="(template, index) in reportTemplates"
                    :key="template.id"
                    :initial="{ opacity: 0, scale: 0.9 }"
                    :animate="{ opacity: 1, scale: 1 }"
                    :transition="{ duration: 0.3, delay: index * 0.1 } as any"
                  >
                    <el-card class="template-card" shadow="hover" :class="{ disabled: !template.enabled }">
                      <div class="template-header">
                        <div class="template-info">
                          <h4 class="template-name">{{ template.name }}</h4>
                          <p class="template-description">{{ template.description }}</p>
                        </div>
                        <div class="template-actions">
                          <el-switch
                            v-model="template.enabled"
                            @change="handleToggleTemplate(template)"
                            size="small"
                          />
                        </div>
                      </div>

                      <div class="template-details">
                        <div class="template-meta">
                          <el-tag :type="template.type === 'daily' ? 'success' : template.type === 'weekly' ? 'warning' : 'info'" size="small">
                            {{ template.type === 'daily' ? '日报' : template.type === 'weekly' ? '周报' : '月报' }}
                          </el-tag>
                          <el-tag type="info" size="small">{{ template.format.toUpperCase() }}</el-tag>
                        </div>

                        <div class="template-sections">
                          <div class="sections-label">报告内容:</div>
                          <div class="sections-list">
                            <el-tag
                              v-for="section in template.sections"
                              :key="section"
                              size="small"
                              class="section-tag"
                            >
                              {{ section }}
                            </el-tag>
                          </div>
                        </div>

                        <div class="template-schedule" v-if="template.schedule">
                          <span class="schedule-label">定时:</span>
                          <span class="schedule-value">{{ template.schedule }}</span>
                        </div>
                      </div>

                      <div class="template-footer">
                        <el-space>
                          <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                            <el-button size="small" @click="handleEditTemplate(template)">
                              编辑
                            </el-button>
                          </Motion>
                          <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                            <el-button type="primary" size="small" @click="handleGenerateReport(template)" :disabled="!template.enabled">
                              生成报告
                            </el-button>
                          </Motion>
                        </el-space>
                      </div>
                    </el-card>
                  </Motion>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </Motion>
    </div>

    <!-- 快速导出对话框 -->
    <el-dialog v-model="showQuickExportDialog" title="快速导出" width="600px" @close="resetQuickExportForm">
      <el-form :model="quickExportForm" label-width="100px">
        <el-form-item label="任务名称" required>
          <el-input v-model="quickExportForm.name" placeholder="请输入导出任务名称" />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="数据类型">
              <el-select v-model="quickExportForm.type" placeholder="选择数据类型">
                <el-option
                  v-for="type in exportTypeOptions"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                >
                  <div class="option-item">
                    <el-icon><component :is="type.icon" /></el-icon>
                    <span>{{ type.label }}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件格式">
              <el-select v-model="quickExportForm.format" placeholder="选择文件格式">
                <el-option
                  v-for="format in formatOptions"
                  :key="format.value"
                  :label="format.label"
                  :value="format.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="日期范围" required>
          <el-date-picker
            v-model="quickExportForm.date_range"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-space>
          <el-button @click="showQuickExportDialog = false">取消</el-button>
          <el-button type="primary" @click="handleStartExport" :loading="loading">
            开始导出
          </el-button>
        </el-space>
      </template>
    </el-dialog>

    <!-- 模板编辑对话框 -->
    <el-dialog v-model="showTemplateDialog" title="编辑报告模板" width="600px">
      <el-form :model="editingTemplate" label-width="100px" v-if="editingTemplate">
        <el-form-item label="模板名称">
          <el-input v-model="editingTemplate.name" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="editingTemplate.description" type="textarea" :rows="2" />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select v-model="editingTemplate.type">
                <el-option label="日报" value="daily" />
                <el-option label="周报" value="weekly" />
                <el-option label="月报" value="monthly" />
                <el-option label="自定义" value="custom" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="格式">
              <el-select v-model="editingTemplate.format">
                <el-option label="PDF" value="pdf" />
                <el-option label="Excel" value="excel" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="定时计划">
          <el-input v-model="editingTemplate.schedule" placeholder="Cron表达式 (可选)" />
        </el-form-item>

        <el-form-item label="启用">
          <el-switch v-model="editingTemplate.enabled" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-space>
          <el-button @click="showTemplateDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSaveTemplate">
            保存
          </el-button>
        </el-space>
      </template>
    </el-dialog>
  </Motion>
</template>

<style scoped>
.export-page {
  width: 100%;
  min-height: 100vh;
}

.export-container {
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
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.processing {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-icon.completed {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-icon.templates {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* 主卡片 */
.main-card {
  border-radius: 12px;
  border: none;
}

.export-tabs {
  --el-tabs-header-height: 60px;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

/* 任务列表 */
.tasks-section {
  padding: 24px 0;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-card {
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.task-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.task-info {
  flex: 1;
}

.task-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.task-format {
  font-size: 12px;
  color: #909399;
}

.task-details {
  padding-top: 16px;
  border-top: 1px solid #f0f2f5;
}

.task-progress {
  margin-bottom: 16px;
}

.task-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 12px;
  color: #909399;
}

.info-value {
  font-size: 12px;
  font-weight: 500;
  color: #303133;
}

/* 模板网格 */
.templates-section {
  padding: 24px 0;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.template-card {
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.template-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.template-card.disabled {
  opacity: 0.6;
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.template-info {
  flex: 1;
}

.template-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.template-description {
  font-size: 12px;
  color: #909399;
  margin: 0;
  line-height: 1.4;
}

.template-details {
  margin-bottom: 16px;
}

.template-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.template-sections {
  margin-bottom: 12px;
}

.sections-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.sections-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.section-tag {
  font-size: 11px;
}

.template-schedule {
  display: flex;
  align-items: center;
  gap: 8px;
}

.schedule-label {
  font-size: 12px;
  color: #909399;
}

.schedule-value {
  font-size: 12px;
  font-weight: 500;
  color: #303133;
  font-family: monospace;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
}

.template-footer {
  padding-top: 16px;
  border-top: 1px solid #f0f2f5;
  display: flex;
  justify-content: flex-end;
}

/* 对话框选项 */
.option-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 空状态 */
.empty-state {
  padding: 60px 0;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .export-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .task-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .task-actions {
    width: 100%;
  }

  .template-header {
    flex-direction: column;
    gap: 12px;
  }

  .templates-grid {
    grid-template-columns: 1fr;
  }

  .task-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>