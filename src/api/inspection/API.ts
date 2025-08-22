import type { WarningsResponse, DetectionRecordsResponse, ModelsResponse, DetectionStatsResponse, CameraStatsResponse } from '@/types/apis/inspection_T'
import serviceAxios from '@/http'

export function getWarnings(params?: { page?: number; page_size?: number }): Promise<WarningsResponse> {
  return serviceAxios({
    url: '/yolo/api/warnings/',
    method: 'get',
    params,
  })
}

export function getDetectionRecords(params?: { page?: number; page_size?: number }): Promise<DetectionRecordsResponse> {
  return serviceAxios({
    url: '/yolo/api/detection-records/',
    method: 'get',
    params,
  })
}

export function getModels(params?: { page?: number; page_size?: number }): Promise<ModelsResponse> {
  return serviceAxios({
    url: '/yolo/api/models/',
    method: 'get',
    params,
  })
}

export function getDetectionStats(): Promise<DetectionStatsResponse> {
  return serviceAxios({
    url: '/yolo/api/detection-stats/',
    method: 'get',
  })
}

export function getCameraStats(): Promise<CameraStatsResponse> {
  return serviceAxios({
    url: '/yolo/api/cameras/detection-stats/',
    method: 'get',
  })
}