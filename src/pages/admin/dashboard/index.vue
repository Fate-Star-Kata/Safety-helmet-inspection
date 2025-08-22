<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage } from 'element-plus'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import {
  VideoCamera,
  User,
  Warning,
  Monitor,
  ArrowUp,
  ArrowDown,
  Refresh,
  Setting,
  Connection,
  Bell
} from '@element-plus/icons-vue'
import { getSystemOverview, getStatistics, getDetectionStats, getActivityLogs, getCameras } from '@/api/admin/dashboard'
import type {
  SystemOverviewResponse,
  StatisticsResponse,
  DetectionStatsResponse,
  ActivityLogsResponse,
  CamerasResponse,
  DashboardSummaryData
} from '@/types/factory'

// 注册 ECharts 组件
use([CanvasRenderer, LineChart, PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

// 使用API类型定义，无需重复定义接口

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
const loading = ref(false)

// API响应数据
const systemOverview = ref<SystemOverviewResponse['data'] | null>(null)
const statisticsData = ref<StatisticsResponse['data'] | null>(null)
const detectionStats = ref<DetectionStatsResponse['data'] | null>(null)
const activityLogs = ref<ActivityLogsResponse['data'] | null>(null)
const camerasData = ref<CamerasResponse['data'] | null>(null)

// 计算系统统计数据
const systemStats = computed(() => {
  if (!systemOverview.value || !detectionStats.value) {
    return {
      totalCameras: 0,
      onlineCameras: 0,
      totalUsers: 0,
      activeUsers: 0,
      totalWarnings: 0,
      todayWarnings: 0,
      systemUptime: '0天 0小时 0分钟',
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      systemAvailability: 0,
      detectionAccuracy: 0,
      todayDetections: 0,
      totalDetections: 0,
      personCount: 0,
      wearingHatCount: 0,
      noHatCount: 0,
      avgConfidence: 0,
      complianceRate: 0
    }
  }

  const ds = detectionStats.value.stats

  return {
    totalCameras: systemOverview.value.cameras.total,
    onlineCameras: systemOverview.value.cameras.online,
    totalUsers: systemOverview.value.users.total,
    activeUsers: 0,
    totalWarnings: systemOverview.value.warnings.total,
    todayWarnings: systemOverview.value.warnings.today,
    systemUptime: '0天 0小时 0分钟',
    cpuUsage: 45, // 模拟CPU使用率
    memoryUsage: 68, // 模拟内存使用率
    diskUsage: 32, // 模拟磁盘使用率
    systemAvailability: systemOverview.value.system.availability,
    detectionAccuracy: systemOverview.value.detections.accuracy,
    todayDetections: systemOverview.value.detections.today,

    totalDetections: ds.total_detections,
    personCount: ds.person_count,
    wearingHatCount: ds.wearing_hat_count,
    noHatCount: ds.no_hat_count,
    avgConfidence: ds.avg_confidence,
    complianceRate: ds.compliance_rate
  }
})

// 摄像头状态数据（使用摄像头管理接口数据）
const cameraStatus = computed(() => {
  if (!camerasData.value) return []

  return camerasData.value.cameras.map(camera => ({
    id: camera.camera_id,
    name: camera.name,
    location: camera.location,
    status: camera.is_online ? 'online' : 'offline' as 'online' | 'offline' | 'error',
    lastUpdate: new Date(camera.last_heartbeat).toLocaleString('zh-CN')
  }))
})

// 最新活动记录
const recentActivities = computed(() => {
  if (!activityLogs.value) return []

  return activityLogs.value.logs.map(log => ({
    id: log.id.toString(),
    type: log.type as 'warning' | 'user' | 'system',
    message: log.description,
    timestamp: log.timestamp,
    level: log.severity as 'info' | 'warning' | 'error'
  }))
})

// 警告趋势数据 - 从活动日志中统计警告数据
const warningTrend = computed(() => {
  if (!activityLogs.value) return []

  // 从活动日志中筛选出警告类型的日志
  const warningLogs = activityLogs.value.logs.filter(log =>
    log.type === 'warning' || log.severity === 'warning' || log.severity === 'error'
  )

  // 按日期分组统计警告数量
  const dateCountMap = new Map<string, number>()

  warningLogs.forEach(log => {
    const date = log.timestamp.split(' ')[0] // 提取日期部分 "2025-08-22"
    const shortDate = date.substring(5) // 只显示月-日 "08-22"
    dateCountMap.set(shortDate, (dateCountMap.get(shortDate) || 0) + 1)
  })

  // 生成近7天的数据，确保有完整的时间序列
  const result = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const shortDate = date.toISOString().substring(5, 10) // 格式化为 "MM-DD"

    result.push({
      date: shortDate,
      count: dateCountMap.get(shortDate) || 0
    })
  }

  return result
})

// 检测趋势数据 - 使用固定的数据格式
const detectionTrend = computed(() => {
  // 使用固定的检测趋势数据
  const fixedData = [
    { "date": "2025-08-15", "count": 0 },
    { "date": "2025-08-16", "count": 0 },
    { "date": "2025-08-17", "count": 0 },
    { "date": "2025-08-18", "count": 0 },
    { "date": "2025-08-19", "count": 0 },
    { "date": "2025-08-20", "count": 0 },
    { "date": "2025-08-21", "count": 0 }
  ]

  return fixedData.map(item => ({
    date: item.date.substring(5), // 只显示月-日
    count: item.count
  }))
})

// 告警级别分布数据
const warningByLevel = computed(() => {
  if (!statisticsData.value) return []

  const levelNames: Record<string, string> = {
    'low': '低级警告',
    'medium': '中级警告',
    'high': '高级警告',
    'critical': '严重警告'
  }

  return statisticsData.value.warning_by_level.map(item => ({
    name: levelNames[item.warning_level] || item.warning_level,
    value: item.count,
    level: item.warning_level
  }))
})

// 摄像头活动数据
const cameraActivity = computed(() => {
  if (!statisticsData.value) return []

  return statisticsData.value.camera_activity.map(item => ({
    name: item.camera__name,
    value: item.count
  }))
})

// 数据时间范围
const dateRange = computed(() => {
  if (!statisticsData.value) return { start: '', end: '' }
  return statisticsData.value.date_range
})

// 计算属性
const cameraOnlineRate = computed(() => {
  const rate = (systemStats.value.onlineCameras / systemStats.value.totalCameras) * 100
  return rate.toFixed(1)
})

const userActiveRate = computed(() => {
  const rate = (systemStats.value.activeUsers / systemStats.value.totalUsers) * 100
  return rate.toFixed(1)
})

const todayWarningChange = computed(() => {
  // 模拟昨日对比数据
  const yesterdayWarnings = 18
  const change = ((systemStats.value.todayWarnings - yesterdayWarnings) / yesterdayWarnings) * 100
  return change.toFixed(1)
})

// 警告趋势图表配置
const warningTrendOption = computed(() => {
  return {
    title: { text: '近7天警告趋势', textStyle: { fontSize: 14, fontWeight: 'normal' } },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => `${params[0].axisValue}<br/>警告数量: ${params[0].value}次`
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: warningTrend.value.map(item => item.date) },
    yAxis: { type: 'value' },
    series: [{
      name: '警告数量',
      type: 'line',
      data: warningTrend.value.map(item => item.count),
      smooth: true,
      lineStyle: { color: '#F56C6C' },
      itemStyle: { color: '#F56C6C' },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(245, 108, 108, 0.3)' },
            { offset: 1, color: 'rgba(245, 108, 108, 0.1)' }
          ]
        }
      }
    }]
  }
})

// 检测趋势图表配置
const detectionTrendOption = computed(() => {
  return {
    title: { text: '检测趋势分析', textStyle: { fontSize: 14, fontWeight: 'normal' } },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => `${params[0].axisValue}<br/>检测数量: ${params[0].value}次`
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: detectionTrend.value.map(item => item.date) },
    yAxis: { type: 'value' },
    series: [{
      name: '检测数量',
      type: 'line',
      data: detectionTrend.value.map(item => item.count),
      smooth: true,
      lineStyle: { color: '#409EFF' },
      itemStyle: { color: '#409EFF' },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.1)' }
          ]
        }
      }
    }]
  }
})

// 告警级别分布图表配置
const warningLevelOption = computed(() => {
  const colors = {
    'low': '#67C23A',
    'medium': '#E6A23C',
    'high': '#F56C6C',
    'critical': '#F56C6C'
  }

  return {
    title: { text: '告警级别分布', textStyle: { fontSize: 14, fontWeight: 'normal' } },
    tooltip: { formatter: '{b}: {c}次 ({d}%)' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '60%'],
      data: warningByLevel.value.map(item => ({
        ...item,
        itemStyle: { color: colors[item.level as keyof typeof colors] || '#909399' }
      })),
      label: { formatter: '{b}\n{c}次' }
    }]
  }
})

// 摄像头活动统计图表配置
const cameraActivityOption = computed(() => {
  return {
    title: { text: '摄像头活动统计', textStyle: { fontSize: 14, fontWeight: 'normal' } },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => `${params[0].axisValue}<br/>检测数量: ${params[0].value}次`
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: cameraActivity.value.map(item => item.name),
      axisLabel: {
        rotate: 45,
        interval: 0
      }
    },
    yAxis: { type: 'value' },
    series: [{
      name: '检测数量',
      type: 'bar',
      data: cameraActivity.value.map(item => item.value),
      itemStyle: { color: '#67C23A' }
    }]
  }
})

// 方法
const formatNumber = (num: number | undefined) => {
  if (num === undefined || num === null) return '0'
  return num.toLocaleString()
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    online: '#67C23A',
    offline: '#909399',
    error: '#F56C6C'
  }
  return colors[status] || '#909399'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    online: '在线',
    offline: '离线',
    error: '故障'
  }
  return texts[status] || '未知'
}

const getActivityIcon = (type: string) => {
  const icons: Record<string, any> = {
    warning: Warning,
    user: User,
    system: Setting
  }
  return icons[type] || Bell
}

const getActivityColor = (level: string) => {
  const colors: Record<string, string> = {
    info: '#409EFF',
    warning: '#E6A23C',
    error: '#F56C6C'
  }
  return colors[level] || '#909399'
}

const refreshData = async () => {
  loading.value = true
  try {
    // 并行调用所有API
    const [overviewRes, statsRes, detectionRes, activityRes, camerasRes] = await Promise.all([
      getSystemOverview(),
      getStatistics({
        start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0]
      }),
      getDetectionStats({
        start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0]
      }),
      getActivityLogs({
        page: 1,
        page_size: 10
      }),
      getCameras({
        page: 1,
        page_size: 100
      })
    ])

    // 更新数据
    systemOverview.value = overviewRes.data
    statisticsData.value = statsRes.data
    detectionStats.value = detectionRes.data
    activityLogs.value = activityRes.data
    camerasData.value = camerasRes.data

    ElMessage.success('数据刷新成功')
  } catch (error: any) {
    console.error('数据刷新失败:', error)

    // 检查是否为认证错误
    if (error?.response?.status === 401 || error?.response?.data?.code === 401) {
      ElMessage.error('身份认证失败，请先登录')
      // 这里可以跳转到登录页面或显示登录弹窗
      return
    }

    ElMessage.error('数据刷新失败')
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(async () => {
  // 初始化加载数据
  await refreshData()
})
</script>

<template>
  <Motion :initial="pageVariants.initial" :animate="pageVariants.animate" :transition="pageVariants.transition as any"
    class="dashboard-page">
    <div class="dashboard-container">
      <!-- 页面头部 -->
      <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.1 }">
        <div class="page-header">
          <div class="header-left">
            <h2 class="page-title">管理员控制台</h2>
            <p class="page-subtitle">工地安全帽检测系统运营概览</p>
          </div>
          <div class="header-right">
            <el-space>
              <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                <el-button @click="refreshData" :loading="loading">
                  <el-icon>
                    <Refresh />
                  </el-icon>
                  刷新数据
                </el-button>
              </Motion>
            </el-space>
          </div>
        </div>
      </Motion>

      <!-- 核心指标卡片 -->
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.2 }">
        <el-row :gutter="24" class="metrics-row">
          <!-- 总检测数 -->
          <el-col :xs="24" :sm="12" :md="6">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.1 } as any">
              <el-card class="metric-card camera-card" shadow="hover">
                <div class="metric-content">
                  <div class="metric-icon">
                    <el-icon size="32" color="#409EFF">
                      <VideoCamera />
                    </el-icon>
                  </div>
                  <div class="metric-info">
                    <h3 class="metric-title">总检测数</h3>
                    <p class="metric-value">{{ formatNumber(systemStats.totalDetections) }}</p>
                    <p class="metric-change positive">
                      <el-icon>
                        <ArrowUp />
                      </el-icon>
                      平均置信度 {{ (systemStats.avgConfidence * 100).toFixed(1) }}%
                    </p>
                  </div>
                </div>
                <div class="metric-detail">
                  <span>今日检测数: {{ systemStats.todayDetections }}</span>
                  <span>检测准确率: {{ (systemStats.detectionAccuracy).toFixed(1) }}%</span>
                </div>
              </el-card>
            </Motion>
          </el-col>

          <!-- 人员检测 -->
          <el-col :xs="24" :sm="12" :md="6">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.2 } as any">
              <el-card class="metric-card user-card" shadow="hover">
                <div class="metric-content">
                  <div class="metric-icon">
                    <el-icon size="32" color="#67C23A">
                      <User />
                    </el-icon>
                  </div>
                  <div class="metric-info">
                    <h3 class="metric-title">人员检测</h3>
                    <p class="metric-value">{{ formatNumber(systemStats.personCount) }}</p>
                    <p class="metric-change positive">
                      <el-icon>
                        <ArrowUp />
                      </el-icon>
                      合规率 {{ (systemStats.complianceRate * 100).toFixed(1) }}%
                    </p>
                  </div>
                </div>
                <div class="metric-detail">
                  <span>总数: {{ systemOverview?.users.total || 0 }}</span>
                  <span>待处理: {{ systemOverview?.warnings.pending || 0 }} / 今日: {{ systemOverview?.warnings.today || 0 }}</span>
                </div>
              </el-card>
            </Motion>
          </el-col>

          <!-- 警告统计 -->
          <el-col :xs="24" :sm="12" :md="6">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.3 } as any">
              <el-card class="metric-card warning-card" shadow="hover">
                <div class="metric-content">
                  <div class="metric-icon">
                    <el-icon size="32" color="#F56C6C">
                      <Warning />
                    </el-icon>
                  </div>
                  <div class="metric-info">
                    <h3 class="metric-title">总警告数</h3>
                    <p class="metric-value">{{ formatNumber(systemStats.totalWarnings) }}</p>
                    <p class="metric-change" :class="parseFloat(todayWarningChange) >= 0 ? 'negative' : 'positive'">
                      <el-icon>
                        <ArrowUp v-if="parseFloat(todayWarningChange) >= 0" />
                        <ArrowDown v-else />
                      </el-icon>
                      {{ todayWarningChange }}%
                    </p>
                  </div>
                </div>
                <div class="metric-detail">
                  <span>今日: {{ systemStats.todayWarnings }}</span>
                  <span>昨日: 18</span>
                </div>
              </el-card>
            </Motion>
          </el-col>

          <!-- 检测精度 -->
          <el-col :xs="24" :sm="12" :md="6">
            <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.4 } as any">
              <el-card class="metric-card system-card" shadow="hover">
                <div class="metric-content">
                  <div class="metric-icon">
                    <el-icon size="32" color="#E6A23C">
                      <Monitor />
                    </el-icon>
                  </div>
                  <div class="metric-info">
                    <h3 class="metric-title">检测精度</h3>
                    <p class="metric-value">{{ (systemStats.systemAvailability).toFixed(1) }}%</p>
                    <p class="metric-change positive">
                      <el-icon>
                        <Connection />
                      </el-icon>
                      系统正常
                    </p>
                  </div>
                </div>
                <div class="metric-detail">
                  <span>总数: {{ systemOverview?.cameras.total || 0 }}</span>
                  <span>在线: {{ systemOverview?.cameras.online || 0 }} / 离线: {{ systemOverview?.cameras.offline || 0
                    }}</span>
                </div>
              </el-card>
            </Motion>
          </el-col>
        </el-row>
      </Motion>

      <!-- 图表和监控区域 -->
      <Motion :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.4 }">
        <!-- 数据时间范围显示 -->
        <div class="mb-4" v-if="dateRange.start && dateRange.end">
          <el-tag type="info" size="large">
            数据时间范围: {{ dateRange.start }} 至 {{ dateRange.end }}
          </el-tag>
        </div>

        <el-row :gutter="24" class="charts-row mb-6">
          <!-- 检测趋势图 -->
          <el-col :xs="24" :lg="12">
            <el-card class="chart-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <h3>检测趋势分析</h3>
                  <el-tag type="primary" size="small">近7天</el-tag>
                </div>
              </template>
              <div class="chart-container" v-loading="loading">
                <VChart :option="detectionTrendOption" style="height: 300px; width: 100%;" autoresize />
              </div>
            </el-card>
          </el-col>

          <!-- 警告趋势图 -->
          <el-col :xs="24" :lg="12">
            <el-card class="chart-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <h3>警告趋势分析</h3>
                  <el-tag type="danger" size="small">近7天</el-tag>
                </div>
              </template>
              <div class="chart-container" v-loading="loading">
                <VChart :option="warningTrendOption" style="height: 300px; width: 100%;" autoresize />
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="24" class="charts-row">
          <!-- 告警级别分布图 -->
          <el-col :xs="24" :lg="12">
            <el-card class="chart-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <h3>告警级别分布</h3>
                  <el-tag type="warning" size="small">统计分析</el-tag>
                </div>
              </template>
              <div class="chart-container" v-loading="loading">
                <VChart :option="warningLevelOption" style="height: 300px; width: 100%;" autoresize />
              </div>
            </el-card>
          </el-col>

          <!-- 摄像头活动统计图 -->
          <el-col :xs="24" :lg="12">
            <el-card class="chart-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <h3>摄像头活动统计</h3>
                  <el-tag type="success" size="small">检测活跃度</el-tag>
                </div>
              </template>
              <div class="chart-container" v-loading="loading">
                <VChart :option="cameraActivityOption" style="height: 300px; width: 100%;" autoresize />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </Motion>

      <!-- 摄像头状态和活动日志 -->
      <Motion :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.6 }">
        <el-row :gutter="24" class="info-row">
          <!-- 摄像头状态 -->
          <el-col :xs="24" :lg="12">
            <el-card class="info-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <h3>摄像头状态监控</h3>
                  <el-tag type="info" size="small">{{ systemStats.onlineCameras }}/{{ systemStats.totalCameras }}
                    在线</el-tag>
                </div>
              </template>
              <div class="camera-status-list" v-loading="loading">
                <div v-for="camera in cameraStatus" :key="camera.id" class="camera-item">
                  <div class="camera-info">
                    <div class="camera-name">{{ camera.name }}</div>
                    <div class="camera-location">{{ camera.location }}</div>
                  </div>
                  <div class="camera-status">
                    <el-tag :color="getStatusColor(camera.status)" size="small">
                      {{ getStatusText(camera.status) }}
                    </el-tag>
                    <div class="camera-time">{{ camera.lastUpdate }}</div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>

          <!-- 最新活动 -->
          <el-col :xs="24" :lg="12">
            <el-card class="info-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <h3>最新活动日志</h3>
                  <el-tag type="warning" size="small">实时更新</el-tag>
                </div>
              </template>
              <div class="activity-list" v-loading="loading">
                <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                  <div class="activity-icon">
                    <el-icon :color="getActivityColor(activity.level)">
                      <component :is="getActivityIcon(activity.type)" />
                    </el-icon>
                  </div>
                  <div class="activity-content">
                    <div class="activity-message">{{ activity.message }}</div>
                    <div class="activity-time">{{ activity.timestamp }}</div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </Motion>
    </div>
  </Motion>
</template>

<style scoped>
.dashboard-page {
  width: 100%;
  min-height: 100vh;
}

.dashboard-container {
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

/* 指标卡片 */
.metrics-row {
  margin-bottom: 24px;
}

.metric-card {
  border-radius: 12px;
  border: none;
  transition: all 0.3s ease;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.metric-content {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.metric-icon {
  margin-right: 16px;
  padding: 12px;
  border-radius: 8px;
}

.camera-card .metric-icon {
  background: rgba(64, 158, 255, 0.1);
}

.user-card .metric-icon {
  background: rgba(103, 194, 58, 0.1);
}

.warning-card .metric-icon {
  background: rgba(245, 108, 108, 0.1);
}

.system-card .metric-icon {
  background: rgba(230, 162, 60, 0.1);
}

.metric-info {
  flex: 1;
}

.metric-title {
  font-size: 14px;
  color: #909399;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 4px 0;
}

.metric-value.system-uptime {
  font-size: 16px;
}

.metric-change {
  font-size: 12px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.metric-change.positive {
  color: #67C23A;
}

.metric-change.negative {
  color: #F56C6C;
}

.metric-detail {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

/* 图表区域 */
.charts-row {
  margin-bottom: 24px;
}

.chart-card {
  border-radius: 12px;
  border: none;
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

.chart-container {
  height: 300px;
  width: 100%;
}

/* 信息区域 */
.info-row {
  margin-bottom: 24px;
}

.info-card {
  border-radius: 12px;
  border: none;
  height: 400px;
}

/* 摄像头状态 */
.camera-status-list {
  max-height: 320px;
  overflow-y: auto;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE and Edge */
}

.camera-status-list::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari and Opera */
}

.camera-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.camera-item:last-child {
  border-bottom: none;
}

.camera-info {
  flex: 1;
}

.camera-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
}

.camera-location {
  font-size: 12px;
  color: #909399;
}

.camera-status {
  text-align: right;
}

.camera-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* 活动日志 */
.activity-list {
  max-height: 320px;
  overflow-y: auto;
  /* 隐藏滚动条 */
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE and Edge */
}

.activity-list::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari and Opera */
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  margin-right: 12px;
  margin-top: 2px;
}

.activity-content {
  flex: 1;
}

.activity-message {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
  line-height: 1.4;
}

.activity-time {
  font-size: 12px;
  color: #909399;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .metric-value.system-uptime {
    font-size: 14px;
  }

  .info-card {
    height: auto;
  }

  .camera-status-list,
  .activity-list {
    max-height: 250px;
  }
}
</style>