import http from '@/http'
import type {
  SystemOverviewResponse,
  StatisticsRequest,
  StatisticsResponse,
  DetectionStatsRequest,
  DetectionStatsResponse,
  ActivityLogsRequest,
  ActivityLogsResponse,
  CamerasRequest,
  CamerasResponse
} from '@/types/factory'

/**
 * 获取系统状态概览
 */
export const getSystemOverview = (): Promise<SystemOverviewResponse> => {
  return http.get('/safehat/api/system-overview/')
}

/**
 * 获取统计分析数据
 */
export const getStatistics = (params?: StatisticsRequest): Promise<StatisticsResponse> => {
  return http.get('/safehat/api/statistics/', { params })
}

/**
 * 获取检测统计数据
 */
export const getDetectionStats = (params?: DetectionStatsRequest): Promise<DetectionStatsResponse> => {
  return http.get('/safehat/api/detection-stats/', { params })
}

/**
 * 获取活动日志
 */
export const getActivityLogs = (params?: ActivityLogsRequest): Promise<ActivityLogsResponse> => {
  return http.get('/safehat/api/activity-logs/', { params })
}

/**
 * 获取摄像头列表
 */
export const getCameras = (params?: CamerasRequest): Promise<CamerasResponse> => {
  return http.get('/safehat/api/cameras/', { params })
}