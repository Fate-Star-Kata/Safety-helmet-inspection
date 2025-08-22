# HzSystem SafeHat API 文档

## 概述

hzsystem_safehat 模块提供安全帽检测系统的管理API，包括摄像头管理、检测统计、警告处理、系统概览、数据导出、活动日志和统计分析等功能。

## 基础信息

- **基础URL**: `/safehat/api/`
- **认证方式**: Token认证
- **数据格式**: JSON
- **字符编码**: UTF-8

## API接口列表

### 2. 检测统计

#### 2.1 获取检测统计数据

**接口地址**: `GET /safehat/api/detection-stats/`
**中文说明**: 获取指定摄像头或全部摄像头的检测统计数据，包括检测总数、合规率等

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| camera_id | string | 否 | 摄像头ID |
| date_range | int | 否 | 统计天数，默认7天 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "stats": {
      "total_detections": 1500,
      "person_count": 1200,
      "wearing_hat_count": 1100,
      "no_hat_count": 100,
      "compliance_rate": 91.67,
      "avg_confidence": 0.856
    }
  }
}
```

### 7. 统计分析

#### 7.1 获取统计分析数据

**接口地址**: `GET /safehat/api/statistics/`
**中文说明**: 获取系统统计分析数据，包括检测趋势、警告趋势、摄像头活动等图表数据

**请求参数**:

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| type | string | 否 | 图表类型（daily/weekly/monthly），默认daily |
| days | int | 否 | 统计天数，默认7天 |

**响应示例**:

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "detection_trend": [
      {
        "date": "2024-01-15",
        "count": 150
      }
    ],
    "warning_trend": [
      {
        "date": "2024-01-15",
        "count": 8
      }
    ],
    "warning_by_level": [
      {
        "warning_level": "warning",
        "count": 20
      }
    ],
    "camera_activity": [
      {
        "camera__name": "入口摄像头",
        "count": 300
      }
    ],
    "date_range": {
      "start": "2024-01-09",
      "end": "2024-01-15"
    }
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

## 数据模型

### Camera（摄像头）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| camera_id | string | 摄像头唯一标识 |
| name | string | 摄像头名称 |
| location | string | 安装位置 |
| ip_address | string | IP地址 |
| port | int | 端口号 |
| rtsp_url | string | RTSP流地址 |
| is_active | boolean | 是否启用 |
| is_online | boolean | 是否在线 |
| last_heartbeat | datetime | 最后心跳时间 |
| created_at | datetime | 创建时间 |

### DetectionRecord（检测记录）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | int | 记录ID |
| camera | Camera | 关联摄像头 |
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
4. 数据导出功能有大小限制，建议分批导出大量数据
5. 统计分析数据会有缓存，更新频率为5分钟
