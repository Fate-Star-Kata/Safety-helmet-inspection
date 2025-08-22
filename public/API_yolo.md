# HzSystem YOLO API 文档

## 概述

hzsystem_yolo 模块提供YOLO模型管理和摄像头实时监控API，包括模型管理、摄像头状态监控、检测记录查询和检测统计等功能。

## 基础信息

- **基础URL**: `/yolo/api/`
- **认证方式**: Token认证
- **数据格式**: JSON
- **字符编码**: UTF-8

## API接口列表

### 1. YOLO模型管理

#### 1.1 获取模型列表

**接口地址**: `GET /yolo/api/models/`
**中文说明**: 获取系统中所有YOLO检测模型的列表信息，支持分页查询

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认1 |
| page_size | int | 否 | 每页数量，默认10 |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 5,
    "page": 1,
    "page_size": 10,
    "models": [
      {
        "id": 1,
        "name": "YOLOv8-SafetyHat",
        "version": "v1.2.0",
        "model_path": "/models/yolov8_safety_hat.pt",
        "confidence_threshold": 0.5,
        "is_active": true,
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### 1.2 获取模型详情

**接口地址**: `GET /yolo/api/models/{model_id}/`
**中文说明**: 获取指定YOLO模型的详细信息，包括模型参数、性能指标等

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| model_id | int | 是 | 模型ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "model": {
      "id": 1,
      "name": "YOLOv8-SafetyHat",
      "version": "v1.2.0",
      "model_path": "/models/yolov8_safety_hat.pt",
      "confidence_threshold": 0.5,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 2. 摄像头管理

#### 2.1 获取摄像头列表

**接口地址**: `GET /yolo/api/cameras/`
**中文说明**: 获取系统中所有摄像头的列表信息，支持分页查询和状态过滤

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认1 |
| page_size | int | 否 | 每页数量，默认10 |
| status | string | 否 | 状态过滤（online/offline） |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 20,
    "page": 1,
    "page_size": 10,
    "cameras": [
      {
        "camera_id": "CAM001",
        "name": "入口摄像头",
        "location": "主入口",
        "ip_address": "192.168.1.100",
        "rtsp_url": "rtsp://192.168.1.100:554/stream",
        "is_active": true,
        "is_online": true,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

#### 2.2 获取摄像头详情

**接口地址**: `GET /yolo/api/cameras/{camera_id}/`
**中文说明**: 获取指定摄像头的详细信息，包括配置参数、运行状态等

**路径参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| camera_id | string | 是 | 摄像头ID |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "camera": {
      "camera_id": "CAM001",
      "name": "入口摄像头",
      "location": "主入口",
      "ip_address": "192.168.1.100",
      "rtsp_url": "rtsp://192.168.1.100:554/stream",
      "is_active": true,
      "is_online": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### 2.3 获取摄像头状态

**接口地址**: `GET /yolo/api/cameras/status/`
**中文说明**: 获取摄像头的在线状态信息

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| camera_id | string | 否 | 摄像头ID，可选 |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "cameras": [
      {
        "camera_id": "CAM001",
        "name": "入口摄像头",
        "is_online": true,
        "last_heartbeat": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### 3. 检测记录管理

#### 3.1 获取检测记录列表

**接口地址**: `GET /yolo/api/detection-records/`
**中文说明**: 获取系统中的检测记录列表，支持按摄像头、时间范围等条件过滤

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认1 |
| page_size | int | 否 | 每页数量，默认10 |
| camera_id | string | 否 | 摄像头ID过滤 |
| detection_type | string | 否 | 检测类型过滤 |
| start_date | string | 否 | 开始日期（YYYY-MM-DD） |
| end_date | string | 否 | 结束日期（YYYY-MM-DD） |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 1500,
    "page": 1,
    "page_size": 10,
    "records": [
      {
        "id": 12345,
        "camera_id": "CAM001",
        "camera_name": "入口摄像头",
        "detection_type": "no_hat",
        "confidence": 0.85,
        "bbox_x": 100,
        "bbox_y": 150,
        "bbox_width": 80,
        "bbox_height": 120,
        "image_path": "/detections/2024/01/15/12345.jpg",
        "detected_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### 4. 检测统计

#### 4.1 获取检测统计数据

**接口地址**: `GET /yolo/api/detection-stats/`
**中文说明**: 获取检测统计分析数据，包括检测趋势、准确率、摄像头活动等统计信息

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| camera_id | string | 否 | 摄像头ID |
| start_date | string | 否 | 开始日期（YYYY-MM-DD） |
| end_date | string | 否 | 结束日期（YYYY-MM-DD） |
| group_by | string | 否 | 分组方式（hour/day/week），默认day |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "stats": {
      "total_detections": 1500,
      "detection_by_type": {
        "no_hat": 150,
        "wearing_hat": 1200,
        "person_detected": 150
      },
      "detection_by_camera": [
        {
          "camera_id": "CAM001",
          "camera_name": "入口摄像头",
          "count": 300
        }
      ],
      "detection_trend": [
        {
          "date": "2024-01-15",
          "count": 150
        }
      ],
      "avg_confidence": 0.856,
      "compliance_rate": 91.67
    },
    "date_range": {
      "start": "2024-01-09",
      "end": "2024-01-15"
    }
  }
}
```

### 5. 安全警告管理

#### 5.1 获取安全警告列表

**接口地址**: `GET /yolo/api/warnings/`
**中文说明**: 获取系统中的安全警告列表，支持按状态、优先级等条件过滤

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | int | 否 | 页码，默认1 |
| page_size | int | 否 | 每页数量，默认10 |
| status | string | 否 | 状态过滤（pending/processing/resolved/ignored） |
| priority | string | 否 | 优先级过滤（low/medium/high/critical） |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 25,
    "page": 1,
    "page_size": 10,
    "warnings": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "未佩戴安全帽警告",
        "description": "检测到人员未佩戴安全帽",
        "warning_level": "high",
        "status": "pending",
        "camera_id": "CAM001",
        "detection_record_id": 12345,
        "assigned_to": null,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### 5.2 获取安全警告详情

**接口地址**: `GET /yolo/api/warnings/{warning_id}/`##例如1
**中文说明**: 获取指定警告的详细信息，包括处理历史、相关检测记录等

**路径参数**:

| 参数名 |  必填 | 说明 |
|--------|------|------|
| warning_id |  是 | 警告ID |##例如1

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "warning": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "未佩戴安全帽警告",
      "description": "检测到人员未佩戴安全帽",
      "warning_level": "high",
      "status": "pending",
      "camera_id": "CAM001",
      "detection_record": {
        "id": 12345,
        "detection_type": "no_hat",
        "confidence": 0.85,
        "image_path": "/detections/2024/01/15/12345.jpg"
      },
      "assigned_to": null,
      "resolved_by": null,
      "resolved_at": null,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### 5.3 更新警告状态

**接口地址**: `POST /yolo/api/warnings/update-status/`
**中文说明**: 更新指定警告的处理状态

**请求参数**:
```json
{
  "warning_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "resolved",
  "notes": "已现场确认并处理"
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "警告状态更新成功",
  "data": {
    "warning_id": "550e8400-e29b-41d4-a716-446655440000",
    "old_status": "pending",
    "new_status": "resolved"
  }
}
```

#### 5.4 分配警告处理人员

**接口地址**: `POST /yolo/api/warnings/assign/`
**中文说明**: 将警告分配给指定的处理人员

**请求参数**:
```json
{
  "warning_id": "550e8400-e29b-41d4-a716-446655440000",
  "assigned_to": "user123"
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "警告分配成功",
  "data": {
    "warning_id": "550e8400-e29b-41d4-a716-446655440000",
    "assigned_to": "user123",
    "assigned_at": "2024-01-15T11:00:00Z"
  }
}
```

### 6. 实时监控

#### 6.1 获取摄像头实时状态

**接口地址**: `GET /yolo/api/cameras/realtime-status/`
**中文说明**: 获取摄像头的实时运行状态，包括在线状态、检测活动、性能指标等

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "cameras": [
      {
        "camera_id": "CAM001",
        "name": "入口摄像头",
        "is_online": true,
        "is_active": true,
        "last_detection": "2024-01-15T10:30:00Z",
        "detection_count_today": 150,
        "stream_status": "active",
        "cpu_usage": 45.2,
        "memory_usage": 68.5,
        "fps": 25
      }
    ],
    "summary": {
      "total_cameras": 20,
      "online_cameras": 18,
      "active_streams": 15,
      "total_detections_today": 1200
    }
  }
}
```

#### 6.2 获取摄像头视频流

**接口地址**: `GET /yolo/api/cameras/stream/`
**中文说明**: 获取摄像头的视频流数据或流媒体URL

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| camera_id | string | 是 | 摄像头ID |
| quality | string | 否 | 视频质量（low/medium/high），默认medium |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "camera_id": "CAM001",
    "stream_url": "rtsp://192.168.1.100:554/stream",
    "stream_status": "active",
    "quality": "medium",
    "resolution": "1920x1080",
    "fps": 25
  }
}
```

#### 6.3 获取摄像头性能数据

**接口地址**: `GET /yolo/api/cameras/performance/`
**中文说明**: 获取摄像头性能统计数据，包括帧率、延迟、检测精度等指标

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| camera_id | string | 否 | 摄像头ID |
| time_range | string | 否 | 时间范围（1h/6h/24h/7d），默认24h |

**响应示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "camera_id": "CAM001",
    "performance_metrics": {
      "avg_fps": 25.5,
      "avg_latency": 120.5,
      "detection_accuracy": 95.8,
      "uptime_percentage": 98.5
    },
    "time_range": "24h"
  }
}
```



## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 503 | 服务不可用（模型加载失败等） |

## 数据模型

### SafetyHatDetectionModel（YOLO模型）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | int | 模型ID |
| name | string | 模型名称 |
| version | string | 模型版本 |
| model_path | string | 模型文件路径 |
| confidence_threshold | float | 置信度阈值 |
| is_active | boolean | 是否启用 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### Camera（摄像头）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| camera_id | string | 摄像头唯一标识 |
| name | string | 摄像头名称 |
| location | string | 安装位置 |
| ip_address | string | IP地址 |
| rtsp_url | string | RTSP流地址 |
| is_active | boolean | 是否启用 |
| is_online | boolean | 是否在线 |
| created_at | datetime | 创建时间 |

### DetectionRecord（检测记录）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | int | 记录ID |
| camera | Camera | 关联摄像头 |
| model | SafetyHatDetectionModel | 使用的模型 |
| detection_type | string | 检测类型（no_hat/wearing_hat/person_detected） |
| confidence | float | 置信度 |
| bbox_x | int | 边界框X坐标 |
| bbox_y | int | 边界框Y坐标 |
| bbox_width | int | 边界框宽度 |
| bbox_height | int | 边界框高度 |
| image_path | string | 检测图片路径 |
| detected_at | datetime | 检测时间 |

### SafetyWarning（安全警告）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | int | 警告ID |
| detection_record | DetectionRecord | 关联检测记录 |
| warning_level | string | 警告级别（info/warning/critical） |
| status | string | 处理状态（pending/processing/resolved/ignored） |
| title | string | 警告标题 |
| description | text | 警告描述 |
| assigned_to | string | 分配给 |
| resolved_by | string | 处理人员 |
| resolved_at | datetime | 处理时间 |
| response_time | int | 响应时间（秒） |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

## 注意事项

1. 所有API都需要进行身份认证
2. 时间格式统一使用ISO 8601格式
3. 分页查询默认每页10条记录，最大不超过100条
4. 实时检测数据通过WebSocket推送，建议客户端做好重连机制
5. 模型推理有性能限制，建议合理控制并发请求数量
6. 检测图片存储有大小限制，定期清理历史数据
7. 系统性能监控数据每30秒更新一次