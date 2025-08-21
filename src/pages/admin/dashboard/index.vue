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

// 注册 ECharts 组件
use([CanvasRenderer, LineChart, PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

// 数据接口定义
interface SystemStats {
  totalCameras: number
  onlineCameras: number
  totalUsers: number
  activeUsers: number
  totalWarnings: number
  todayWarnings: number
  systemUptime: string
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
}

interface CameraStatus {
  id: string
  name: string
  location: string
  status: 'online' | 'offline' | 'error'
  lastUpdate: string
}

interface RecentActivity {
  id: string
  type: 'warning' | 'user' | 'system'
  message: string
  timestamp: string
  level: 'info' | 'warning' | 'error'
}

interface WarningTrend {
  date: string
  count: number
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
const loading = ref(false)
const autoRefresh = ref(true)
const refreshInterval = ref<number | null>(null)

// 系统统计数据
const systemStats = ref<SystemStats>({
  totalCameras: 24,
  onlineCameras: 22,
  totalUsers: 156,
  activeUsers: 89,
  totalWarnings: 1247,
  todayWarnings: 23,
  systemUptime: '15天 8小时 32分钟',
  cpuUsage: 45,
  memoryUsage: 68,
  diskUsage: 32
})

// 摄像头状态数据
const cameraStatus = ref<CameraStatus[]>([
  { id: '001', name: '主入口摄像头', location: '工地大门', status: 'online', lastUpdate: '2024-01-15 14:30:25' },
  { id: '002', name: '施工区域A', location: '1号楼施工区', status: 'online', lastUpdate: '2024-01-15 14:30:20' },
  { id: '003', name: '施工区域B', location: '2号楼施工区', status: 'offline', lastUpdate: '2024-01-15 13:45:10' },
  { id: '004', name: '材料堆放区', location: '仓库区域', status: 'online', lastUpdate: '2024-01-15 14:30:15' },
  { id: '005', name: '办公区域', location: '临时办公室', status: 'error', lastUpdate: '2024-01-15 12:20:30' }
])

// 最新活动记录
const recentActivities = ref<RecentActivity[]>([
  { id: '1', type: 'warning', message: '检测到未佩戴安全帽 - 施工区域A', timestamp: '2024-01-15 14:28:30', level: 'warning' },
  { id: '2', type: 'user', message: '用户张三登录系统', timestamp: '2024-01-15 14:25:15', level: 'info' },
  { id: '3', type: 'system', message: '摄像头003离线', timestamp: '2024-01-15 13:45:10', level: 'error' },
  { id: '4', type: 'warning', message: '检测到安全帽佩戴不规范 - 施工区域B', timestamp: '2024-01-15 13:42:20', level: 'warning' },
  { id: '5', type: 'system', message: '系统自动备份完成', timestamp: '2024-01-15 13:00:00', level: 'info' }
])

// 警告趋势数据
const warningTrend = ref<WarningTrend[]>([
  { date: '01-09', count: 15 },
  { date: '01-10', count: 23 },
  { date: '01-11', count: 18 },
  { date: '01-12', count: 31 },
  { date: '01-13', count: 27 },
  { date: '01-14', count: 19 },
  { date: '01-15', count: 23 }
])

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

// 系统资源使用图表配置
const systemResourceOption = computed(() => {
  return {
    title: { text: '系统资源使用率', textStyle: { fontSize: 14, fontWeight: 'normal' } },
    tooltip: { formatter: '{b}: {c}%' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '60%'],
      data: [
        { value: systemStats.value.cpuUsage, name: 'CPU使用率', itemStyle: { color: '#409EFF' } },
        { value: systemStats.value.memoryUsage, name: '内存使用率', itemStyle: { color: '#67C23A' } },
        { value: systemStats.value.diskUsage, name: '磁盘使用率', itemStyle: { color: '#E6A23C' } }
      ],
      label: { formatter: '{b}\n{c}%' }
    }]
  }
})

// 方法
const formatNumber = (num: number) => {
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
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('数据刷新成功')
  } catch (error) {
    ElMessage.error('数据刷新失败')
  } finally {
    loading.value = false
  }
}

const toggleAutoRefresh = () => {
  if (autoRefresh.value) {
    refreshInterval.value = setInterval(() => {
      refreshData()
    }, 30000) // 30秒自动刷新
  } else {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value)
      refreshInterval.value = null
    }
  }
}

// 生命周期
onMounted(() => {
  if (autoRefresh.value) {
    toggleAutoRefresh()
  }
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
              <el-switch v-model="autoRefresh" @change="toggleAutoRefresh" active-text="自动刷新" />
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
          <!-- 摄像头统计 -->
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
                    <h3 class="metric-title">摄像头总数</h3>
                    <p class="metric-value">{{ formatNumber(systemStats.totalCameras) }}</p>
                    <p class="metric-change positive">
                      <el-icon>
                        <ArrowUp />
                      </el-icon>
                      在线率 {{ cameraOnlineRate }}%
                    </p>
                  </div>
                </div>
                <div class="metric-detail">
                  <span>在线: {{ systemStats.onlineCameras }}</span>
                  <span>离线: {{ systemStats.totalCameras - systemStats.onlineCameras }}</span>
                </div>
              </el-card>
            </Motion>
          </el-col>

          <!-- 用户统计 -->
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
                    <h3 class="metric-title">注册用户</h3>
                    <p class="metric-value">{{ formatNumber(systemStats.totalUsers) }}</p>
                    <p class="metric-change positive">
                      <el-icon>
                        <ArrowUp />
                      </el-icon>
                      活跃率 {{ userActiveRate }}%
                    </p>
                  </div>
                </div>
                <div class="metric-detail">
                  <span>活跃: {{ systemStats.activeUsers }}</span>
                  <span>非活跃: {{ systemStats.totalUsers - systemStats.activeUsers }}</span>
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

          <!-- 系统状态 -->
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
                    <h3 class="metric-title">系统运行时间</h3>
                    <p class="metric-value system-uptime">{{ systemStats.systemUptime }}</p>
                    <p class="metric-change positive">
                      <el-icon>
                        <Connection />
                      </el-icon>
                      系统正常
                    </p>
                  </div>
                </div>
                <div class="metric-detail">
                  <span>CPU: {{ systemStats.cpuUsage }}%</span>
                  <span>内存: {{ systemStats.memoryUsage }}%</span>
                </div>
              </el-card>
            </Motion>
          </el-col>
        </el-row>
      </Motion>

      <!-- 图表和监控区域 -->
      <Motion :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.4 }">
        <el-row :gutter="24" class="charts-row">
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

          <!-- 系统资源监控 -->
          <el-col :xs="24" :lg="12">
            <el-card class="chart-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <h3>系统资源监控</h3>
                  <el-tag type="success" size="small">实时</el-tag>
                </div>
              </template>
              <div class="chart-container" v-loading="loading">
                <VChart :option="systemResourceOption" style="height: 300px; width: 100%;" autoresize />
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
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.camera-status-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
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
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.activity-list::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
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