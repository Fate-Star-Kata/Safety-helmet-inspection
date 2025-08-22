import serviceAxios from '@/http'
import type {
  WarningListRequest,
  WarningListResponse,
  UpdateWarningStatusRequest,
  UpdateWarningStatusResponse,
  DeleteWarningResponse,
  CreateWarningRequest,
  CreateWarningResponse
} from '@/types/apis/warnings'

/**
 * 获取警告列表
 */
export const getWarnings = (params: WarningListRequest = {}): Promise<WarningListResponse> => {
  return serviceAxios({
    url: '/safehat/api/warnings/',
    method: 'GET',
    params
  })
}

/**
 * 更新警告状态
 */
export const updateWarningStatus = (data: UpdateWarningStatusRequest): Promise<UpdateWarningStatusResponse> => {
  return serviceAxios({
    url: '/safehat/api/warnings/update-status/',
    method: 'POST',
    data: {
      warning_id: data.warning_id,
      status: data.status,
      notes: data.notes
    }
  })
}

/**
 * 删除警告
 */
export const deleteWarning = (warningId: string): Promise<DeleteWarningResponse> => {
  return serviceAxios({
    url: `/safehat/api/warnings/${warningId}/`,
    method: 'DELETE'
  })
}

/**
 * 创建警告
 */
export const createWarning = (data: CreateWarningRequest): Promise<CreateWarningResponse> => {
  return serviceAxios({
    url: '/safehat/api/warnings/',
    method: 'POST',
    data
  })
}