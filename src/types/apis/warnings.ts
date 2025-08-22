// 警告管理相关API接口类型定义

// 警告记录数据结构
export interface WarningRecord {
  id: string
  title: string
  description: string
  warning_level: 'info' | 'warning' | 'high' | 'critical'
  status: 'pending' | 'processing' | 'resolved' | 'ignored'
  camera_id: string
  camera_name: string
  location: string
  created_at: string
  resolved_by?: string | null
  resolved_at?: string | null
  severity?: 'info' | 'warning' | 'high' | 'critical'
  // 检测相关字段
  confidence?: number
  person_count?: number
  violation_count?: number
  detection_time?: string
  image_url?: string
}

// 获取警告列表请求参数
export interface WarningListRequest {
  page?: number
  page_size?: number
  status?: 'pending' | 'processing' | 'resolved' | 'ignored'
  camera_id?: string
  severity?: 'info' | 'warning' | 'high' | 'critical'
  date_from?: string
  date_to?: string
}

// 获取警告列表响应数据
export interface WarningListResponse {
  code: number
  msg: string | null
  data: {
    total: number
    page: number
    page_size: number
    warnings: WarningRecord[]
  }
}

// 更新警告状态请求参数
export interface UpdateWarningStatusRequest {
  warning_id: string
  status: 'pending' | 'processing' | 'resolved' | 'ignored'
  notes?: string
}

// 更新警告状态响应数据
export interface UpdateWarningStatusResponse {
  code: number
  msg: string
}

// 删除警告响应数据
export interface DeleteWarningResponse {
  code: number
  msg: string
}

// 创建警告请求参数
export interface CreateWarningRequest {
  camera_id: string
  warning_level: 'info' | 'warning' | 'high' | 'critical'
  title: string
  description: string
  assigned_to?: string
}

// 创建警告响应数据
export interface CreateWarningResponse {
  code: number
  msg: string
  data?: {
    warning_id: string
    created_at: string
  }
}