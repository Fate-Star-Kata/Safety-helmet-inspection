import serviceAxios from '@/http'
import type {
  ExportStatsResponse,
  ExportListRequest,
  ExportListResponse,
  CreateExportRequest,
  CreateExportResponse,
  ExportDataRequest,
  ExportDataResponse,
  ActivityLogsRequest,
  ActivityLogsResponse
} from '@/types/apis/export'

// 获取导出统计数据
export const getExportStats = (): Promise<ExportStatsResponse> => {
  return serviceAxios({
    url: '/safehat/api/data-export/stats/',
    method: 'get'
  })
}

// 获取导出记录列表
export const getExportList = (params: ExportListRequest): Promise<ExportListResponse> => {
  return serviceAxios({
    url: '/safehat/api/export-records/',
    method: 'get',
    params
  })
}

// 创建导出任务
export const createExportTask = (data: CreateExportRequest): Promise<CreateExportResponse> => {
  return serviceAxios({
    url: '/safehat/api/export-tasks/',
    method: 'post',
    data
  })
}

// 导出数据
export const exportData = (data: ExportDataRequest): Promise<ExportDataResponse> => {
  return serviceAxios({
    url: '/safehat/api/data-export/',
    method: 'post',
    data
  })
}

// 获取活动日志
export const getActivityLogs = (params: ActivityLogsRequest): Promise<ActivityLogsResponse> => {
  return serviceAxios({
    url: '/safehat/api/activity-logs/',
    method: 'get',
    params
  })
}