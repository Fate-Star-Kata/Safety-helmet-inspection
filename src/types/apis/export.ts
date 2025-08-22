// 数据导出相关类型定义

// 导出统计数据类型
export interface ExportStats {
  total_exports: number
  pending_exports: number
  completed_exports: number
  failed_exports: number
}

// 单个统计项类型（根据接口文档）
export interface StatItem {
  type: string
  name: string
  total_count: number
  today_count: number
  color: string
}

// 导出统计响应类型（根据接口文档）
export interface ExportStatsResponse {
  code: number
  msg: string | null
  data: {
    stats: StatItem[]
  }
}

// 导出任务类型
export interface ExportTask {
  id: number
  task_name: string
  export_type: string
  export_format?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  file_path?: string
  file_size?: string | number
  created_at: string
  completed_at?: string
  error_message?: string
  progress?: number
  name?: string
  type?: string
  filters?: {
    start_date?: string
    end_date?: string
    status?: string
    camera_id?: string
    [key: string]: any
  }
  parameters?: {
    start_date?: string
    end_date?: string
    status?: string
    camera_id?: string
    [key: string]: any
  }
}

// 导出记录类型（根据接口文档）
export interface ExportRecord {
  id: number
  name: string
  type: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  file_size: string
  created_at: string
  completed_at: string
}

// 导出记录列表请求参数
export interface ExportListRequest {
  page?: number
  page_size?: number
  export_type?: string
  status?: string
  start_date?: string
  end_date?: string
}

// 导出记录列表响应（根据接口文档）
export interface ExportListResponse {
  code: number
  msg: string | null
  data: {
    records: ExportRecord[]
    total_count: number
  }
}

// 创建导出任务请求参数
export interface CreateExportRequest {
  export_type: string
  task_name: string
  filters?: {
    start_date?: string
    end_date?: string
    status?: string
    camera_id?: string
    [key: string]: any
  }
}

// 创建导出任务响应
export interface CreateExportResponse {
  code: number
  msg: string
  data: {
    task_id: number
    task_name: string
    status: string
  }
}

// 导出数据请求参数
export interface ExportDataRequest {
  export_type: string
  format: 'excel' | 'csv' | 'pdf'
  filters?: {
    start_date?: string
    end_date?: string
    status?: string
    camera_id?: string
    [key: string]: any
  }
}

// 导出数据响应
export interface ExportDataResponse {
  code: number
  msg: string
  data: {
    download_url: string
    file_name: string
    file_size: number
  }
}

// @ts-ignore 导出类型枚举
export enum ExportType {
  WARNINGS = 'warnings',
  DETECTIONS = 'detections',
  STATISTICS = 'statistics',
  USERS = 'users'
}

// @ts-ignore 导出状态枚举
export enum ExportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// @ts-ignore 导出格式枚举
export enum ExportFormat {
  EXCEL = 'excel',
  CSV = 'csv',
  PDF = 'pdf'
}

// 活动日志相关类型
export interface ActivityLog {
  id: number
  type: string
  action: string
  description: string
  user: string
  timestamp: string
  severity: string
}

export interface ActivityLogsRequest {
  page?: number
  page_size?: number
  type?: string
}

export interface ActivityLogsResponse {
  code: number
  msg: string | null
  data: {
    logs: ActivityLog[]
    total: number
    page: number
    page_size: number
  }
}