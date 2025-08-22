// Base Response
export interface BaseResponse<T> {
  code: number;
  msg: string | null;
  data: T;
}

// API for: /yolo/api/warnings/
export interface Warning {
  id: string;
  title: string;
  description: string;
  warning_level: 'info' | 'warning' | 'critical';
  status: 'pending' | 'processing' | 'resolved' | 'ignored';
  camera_id: string;
  camera_name: string;
  assigned_to: string;
  handled_by: string | null;
  response_time: number | null;
  created_at: string;
  handled_at: string | null;
}

export interface WarningsData {
  total: number;
  page: number;
  page_size: number;
  warnings: Warning[];
}

export type WarningsResponse = BaseResponse<WarningsData>;

// API for: /yolo/api/detection-records/
export interface DetectionRecord {
  id: string;
  camera_id: string;
  camera_name: string;
  detection_type: 'wearing_hat' | 'no_hat' | 'person_detected';
  confidence: number;
  bbox_x: number;
  bbox_y: number;
  bbox_width: number;
  bbox_height: number;
  detected_at: string;
}

export interface DetectionRecordsData {
  total: number;
  page: number;
  page_size: number;
  records: DetectionRecord[];
}

export type DetectionRecordsResponse = BaseResponse<DetectionRecordsData>;

// API for: /yolo/api/models/
export interface ModelInfo {
  id: number;
  name: string;
  model_path: string;
  confidence_threshold: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModelsData {
  total: number;
  page: number;
  page_size: number;
  models: ModelInfo[];
}

// 保留CameraModel用于其他地方的兼容性
export interface CameraModel {
  id: number;
  camera_id: string;
  name: string;
  location: string;
  ip_address: string;
  port: number;
  rtsp_url: string;
  is_active: boolean;
  is_online: boolean;
  created_at: string;
  last_heartbeat: string;
}

export type ModelsResponse = BaseResponse<ModelsData>;

// API for: /yolo/api/detection-stats/
export interface DailyStats {
  date: string;
  total: number;
  wearing_hat: number;
  no_hat: number;
}

export interface DetectionStats {
  total_detections: number;
  person_count: number;
  wearing_hat_count: number;
  no_hat_count: number;
  avg_confidence: number;
  compliance_rate: number;
}

export interface DetectionStatsData {
  stats: DetectionStats;
  daily_stats: DailyStats[];
}

export type DetectionStatsResponse = BaseResponse<DetectionStatsData>;

// API for: /yolo/api/cameras/detection-stats/
export interface CameraStats {
  camera_id: string;
  camera_name: string;
  location: string;
  is_online: boolean;
  total_detections: number;
  violation_count: number;
  wearing_hat_count: number;
  violation_rate: number;
  latest_detection_time: string;
  today_detections: number;
  today_violations: number;
  today_violation_rate: number;
}

export interface CameraStatsSummary {
  total_cameras: number;
  online_cameras: number;
  total_detections: number;
  total_violations: number;
  overall_violation_rate: number;
  query_period: {
    start_date: string | null;
    end_date: string | null;
  };
}

export interface CameraStatsData {
  camera_stats: CameraStats[];
  summary: CameraStatsSummary;
  timestamp: string;
}

export type CameraStatsResponse = BaseResponse<CameraStatsData>;