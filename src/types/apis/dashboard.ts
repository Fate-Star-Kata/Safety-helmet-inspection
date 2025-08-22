// 仪表盘相关API接口类型定义

// 系统概览响应数据
export interface SystemOverviewResponse {
  code: number
  msg: string | null
  data: {
    cameras: {
      total: number
      online: number
      offline: number
    }
    users: {
      total: number
    }
    warnings: {
      total: number
      pending: number
      today: number
    }
    detections: {
      today: number
      accuracy: number
    }
    system: {
      availability: number
    }
  }
}

// 统计分析请求参数
export interface StatisticsRequest {
  type?: 'daily' | 'weekly' | 'monthly'
  days?: number
  start_date?: string
  end_date?: string
}

// 统计分析响应数据
export interface StatisticsResponse {
  code: number
  msg: string | null
  data: {
    detection_trend: Array<{
      date: string
      count: number
    }>
    warning_trend: Array<{
      date: string
      count: number
    }>
    warning_by_level: Array<{
      warning_level: string
      count: number
    }>
    camera_activity: Array<{
      camera__name: string
      count: number
    }>
    date_range: {
      start: string
      end: string
    }
  }
}

// 检测统计请求参数
export interface DetectionStatsRequest {
  camera_id?: string
  date_range?: number
  start_date?: string
  end_date?: string
}

// 检测统计响应数据
export interface DetectionStatsResponse {
  code: number
  msg: string | null
  data: {
    stats: {
      total_detections: number
      person_count: number
      wearing_hat_count: number
      no_hat_count: number
      avg_confidence: number
      compliance_rate: number
    }
  }
}

// 活动日志请求参数
export interface ActivityLogsRequest {
  page?: number
  page_size?: number
  type?: 'user' | 'warning' | 'system'
}

// 活动日志响应数据
export interface ActivityLogsResponse {
  code: number
  msg: string | null
  data: {
    logs: Array<{
      id: number
      type: string
      action: string
      description: string
      user: string
      timestamp: string
      severity: string
    }>
    total: number
    page: number
    page_size: number
  }
}

// 摄像头列表请求参数
export interface CamerasRequest {
  query?: string
  page?: number
  page_size?: number
  status?: 'online' | 'offline'
}

// 摄像头数据
export interface Camera {
  camera_id: string
  name: string
  location: string
  is_online: boolean
  ip_address: string
  port: number
  rtsp_url: string
  is_active: boolean
  last_heartbeat: string
  created_at: string
}

// 摄像头列表响应数据
export interface CamerasResponse {
  code: number
  msg: string | null
  data: {
    total: number
    page: number
    page_size: number
    cameras: Camera[]
  }
}

// 摄像头状态数据
export interface CameraStatusData {
  id: string
  name: string
  location: string
  status: 'online' | 'offline' | 'error'
  lastUpdate: string
}

// 系统资源使用数据
export interface SystemResourceData {
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  systemUptime: string
}

// 仪表盘汇总数据
export interface DashboardSummaryData {
  systemStats: {
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
    systemAvailability: number
    detectionAccuracy: number
    todayDetections: number
  }
  cameraStatus: CameraStatusData[]
  recentActivities: Array<{
    id: string
    type: 'warning' | 'user' | 'system'
    message: string
    timestamp: string
    level: 'info' | 'warning' | 'error'
  }>
  warningTrend: Array<{
    date: string
    count: number
  }>
}