# 仪表盘

<http://localhost:5175/api/safehat/api/system-overview/>

```json
{
    "code": 200,
    "msg": null,
    "data": {
        "cameras": {
            "total": 10,
            "online": 10,
            "offline": 0
        },
        "users": {
            "total": 12
        },
        "warnings": {
            "total": 19,
            "pending": 5,
            "today": 19
        },
        "detections": {
            "today": 50,
            "accuracy": 95.8
        },
        "system": {
            "availability": 100.0
        }
    }
}
```

<http://localhost:5175/api/safehat/api/statistics/?start_date=2025-08-15&end_date=2025-08-22>

```json
{
    "code": 200,
    "msg": null,
    "data": {
        "detection_trend": [
            {
                "date": "2025-08-15",
                "count": 0
            },
            {
                "date": "2025-08-16",
                "count": 0
            },
            {
                "date": "2025-08-17",
                "count": 0
            },
            {
                "date": "2025-08-18",
                "count": 0
            },
            {
                "date": "2025-08-19",
                "count": 0
            },
            {
                "date": "2025-08-20",
                "count": 0
            },
            {
                "date": "2025-08-21",
                "count": 0
            }
        ],
        "warning_trend": [
            {
                "date": "2025-08-15",
                "count": 0
            },
            {
                "date": "2025-08-16",
                "count": 0
            },
            {
                "date": "2025-08-17",
                "count": 0
            },
            {
                "date": "2025-08-18",
                "count": 0
            },
            {
                "date": "2025-08-19",
                "count": 0
            },
            {
                "date": "2025-08-20",
                "count": 0
            },
            {
                "date": "2025-08-21",
                "count": 0
            }
        ],
        "warning_by_level": [
            {
                "warning_level": "medium",
                "count": 8
            },
            {
                "warning_level": "high",
                "count": 6
            },
            {
                "warning_level": "critical",
                "count": 4
            },
            {
                "warning_level": "low",
                "count": 1
            }
        ],
        "camera_activity": [
            {
                "camera__name": "安全帽检测摄像头9号",
                "count": 8
            },
            {
                "camera__name": "安全帽检测摄像头5号",
                "count": 7
            },
            {
                "camera__name": "安全帽检测摄像头3号",
                "count": 7
            },
            {
                "camera__name": "安全帽检测摄像头4号",
                "count": 5
            },
            {
                "camera__name": "安全帽检测摄像头10号",
                "count": 5
            },
            {
                "camera__name": "安全帽检测摄像头8号",
                "count": 4
            },
            {
                "camera__name": "安全帽检测摄像头6号",
                "count": 4
            },
            {
                "camera__name": "安全帽检测摄像头1号",
                "count": 4
            },
            {
                "camera__name": "安全帽检测摄像头7号",
                "count": 3
            },
            {
                "camera__name": "安全帽检测摄像头2号",
                "count": 3
            }
        ],
        "date_range": {
            "start": "2025-08-15",
            "end": "2025-08-22"
        }
    }
}
```

<http://localhost:5175/api/safehat/api/detection-stats/?start_date=2025-08-15&end_date=2025-08-22>

```json
{
    "code": 200,
    "msg": null,
    "data": {
        "stats": {
            "total_detections": 50,
            "person_count": 0,
            "wearing_hat_count": 0,
            "no_hat_count": 0,
            "avg_confidence": 0.746,
            "compliance_rate": 0
        }
    }
}
```

<http://localhost:5175/api/safehat/api/cameras/?page=1&page_size=100>

```json
{
    "code": 200,
    "msg": null,
    "data": {
        "total": 10,
        "page": 1,
        "page_size": 100,
        "cameras": [
            {
                "camera_id": "SH010",
                "name": "安全帽检测摄像头10号",
                "location": "临时建筑区",
                "is_online": true,
                "ip_address": "192.168.2.109",
                "port": 1935,
                "rtsp_url": "rtsp://192.168.2.109:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:34:14.828316",
                "created_at": "2025-08-22T10:57:05.964020"
            },
            {
                "camera_id": "SH009",
                "name": "安全帽检测摄像头9号",
                "location": "危险品存放区",
                "is_online": true,
                "ip_address": "192.168.2.108",
                "port": 1935,
                "rtsp_url": "rtsp://192.168.2.108:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:34:14.828316",
                "created_at": "2025-08-22T10:57:05.960019"
            },
            {
                "camera_id": "SH008",
                "name": "安全帽检测摄像头8号",
                "location": "机械停放区",
                "is_online": true,
                "ip_address": "192.168.2.107",
                "port": 1935,
                "rtsp_url": "rtsp://192.168.2.107:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:34:14.828316",
                "created_at": "2025-08-22T10:57:05.958020"
            },
            {
                "camera_id": "SH007",
                "name": "安全帽检测摄像头7号",
                "location": "宿舍区",
                "is_online": true,
                "ip_address": "192.168.2.106",
                "port": 554,
                "rtsp_url": "rtsp://192.168.2.106:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:34:14.828316",
                "created_at": "2025-08-22T10:57:05.955020"
            },
            {
                "camera_id": "SH006",
                "name": "安全帽检测摄像头6号",
                "location": "食堂",
                "is_online": true,
                "ip_address": "192.168.2.105",
                "port": 554,
                "rtsp_url": "rtsp://192.168.2.105:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:34:14.828316",
                "created_at": "2025-08-22T10:57:05.952020"
            },
            {
                "camera_id": "SH005",
                "name": "安全帽检测摄像头5号",
                "location": "办公区",
                "is_online": true,
                "ip_address": "192.168.2.104",
                "port": 554,
                "rtsp_url": "rtsp://192.168.2.104:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:34:14.828316",
                "created_at": "2025-08-22T10:57:05.949020"
            },
            {
                "camera_id": "SH004",
                "name": "安全帽检测摄像头4号",
                "location": "材料堆放区",
                "is_online": true,
                "ip_address": "192.168.2.103",
                "port": 1935,
                "rtsp_url": "rtsp://192.168.2.103:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:34:14.828316",
                "created_at": "2025-08-22T10:57:05.947024"
            },
            {
                "camera_id": "SH003",
                "name": "安全帽检测摄像头3号",
                "location": "施工区域B",
                "is_online": true,
                "ip_address": "192.168.2.102",
                "port": 1935,
                "rtsp_url": "rtsp://192.168.2.102:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:34:14.828316",
                "created_at": "2025-08-22T10:57:05.944022"
            },
            {
                "camera_id": "SH002",
                "name": "安全帽检测摄像头2号",
                "location": "施工区域A",
                "is_online": true,
                "ip_address": "192.168.2.101",
                "port": 8080,
                "rtsp_url": "rtsp://192.168.2.101:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:34:14.828316",
                "created_at": "2025-08-22T10:57:05.941020"
            },
            {
                "camera_id": "SH001",
                "name": "安全帽检测摄像头1号",
                "location": "工地入口",
                "is_online": true,
                "ip_address": "192.168.2.100",
                "port": 8080,
                "rtsp_url": "rtsp://192.168.2.100:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:34:14.828316",
                "created_at": "2025-08-22T10:57:05.938021"
            }
        ]
    }
}
```

<http://localhost:5175/api/safehat/api/activity-logs/?page=1&page_size=10>

```json
{
    "code": 200,
    "msg": null,
    "data": {
        "logs": [
            {
                "id": 12,
                "type": "user",
                "action": "用户注册",
                "description": "新用户 user1 注册",
                "user": "user1",
                "timestamp": "2025-08-22 11:01:35",
                "severity": "info"
            },
            {
                "id": "20",
                "type": "warning",
                "action": "检测到high级别警告",
                "description": "在机械停放区检测到安全违规行为，需要立即处理。",
                "user": "System",
                "timestamp": "2025-08-22 11:01:09",
                "severity": "high"
            },
            {
                "id": "19",
                "type": "warning",
                "action": "检测到high级别警告",
                "description": "在工地入口检测到安全违规行为，需要立即处理。",
                "user": "System",
                "timestamp": "2025-08-22 11:01:09",
                "severity": "high"
            },
            {
                "id": "18",
                "type": "warning",
                "action": "检测到medium级别警告",
                "description": "在机械停放区检测到安全违规行为，需要立即处理。",
                "user": "System",
                "timestamp": "2025-08-22 11:01:09",
                "severity": "medium"
            },
            {
                "id": "17",
                "type": "warning",
                "action": "检测到high级别警告",
                "description": "在临时建筑区检测到安全违规行为，需要立即处理。",
                "user": "System",
                "timestamp": "2025-08-22 11:01:09",
                "severity": "high"
            },
            {
                "id": "16",
                "type": "warning",
                "action": "检测到medium级别警告",
                "description": "在机械停放区检测到安全违规行为，需要立即处理。",
                "user": "System",
                "timestamp": "2025-08-22 11:01:09",
                "severity": "medium"
            },
            {
                "id": "15",
                "type": "warning",
                "action": "检测到medium级别警告",
                "description": "在施工区域A检测到安全违规行为，需要立即处理。",
                "user": "System",
                "timestamp": "2025-08-22 11:01:09",
                "severity": "medium"
            },
            {
                "id": "14",
                "type": "warning",
                "action": "检测到medium级别警告",
                "description": "在施工区域A检测到安全违规行为，需要立即处理。",
                "user": "System",
                "timestamp": "2025-08-22 11:01:09",
                "severity": "medium"
            },
            {
                "id": "13",
                "type": "warning",
                "action": "检测到medium级别警告",
                "description": "在办公区检测到安全违规行为，需要立即处理。",
                "user": "System",
                "timestamp": "2025-08-22 11:01:09",
                "severity": "medium"
            },
            {
                "id": "12",
                "type": "warning",
                "action": "检测到critical级别警告",
                "description": "在临时建筑区检测到安全违规行为，需要立即处理。",
                "user": "System",
                "timestamp": "2025-08-22 11:01:09",
                "severity": "critical"
            }
        ],
        "total": 15,
        "page": 1,
        "page_size": 10
    }
}
```

## 警告管理

<http://localhost:5174/api/safehat/api/warnings/?page=1&page_size=20>

```json
{
    "code": 200,
    "msg": null,
    "data": {
        "total": 18,
        "page": 1,
        "page_size": 20,
        "warnings": [
            {
                "id": "19",
                "title": "禁入区域人员闯入",
                "description": "在工地入口检测到安全违规行为，需要立即处理。",
                "warning_level": "high",
                "status": "pending",
                "camera_name": "摄像头1号",
                "created_at": "2025-08-22T11:01:09.746800",
                "resolved_by": "admin1",
                "resolved_at": "2025-08-20T13:01:09.746800"
            },
            {
                "id": "18",
                "title": "未佩戴安全帽违规",
                "description": "在机械停放区检测到安全违规行为，需要立即处理。",
                "warning_level": "medium",
                "status": "ignored",
                "camera_name": "摄像头8号",
                "created_at": "2025-08-22T11:01:09.743800",
                "resolved_by": null,
                "resolved_at": null
            },
            {
                "id": "17",
                "title": "安全帽佩戴不规范",
                "description": "在临时建筑区检测到安全违规行为，需要立即处理。",
                "warning_level": "high",
                "status": "ignored",
                "camera_name": "摄像头10号",
                "created_at": "2025-08-22T11:01:09.740802",
                "resolved_by": "viewer1",
                "resolved_at": "2025-08-21T12:01:09.740802"
            },
            {
                "id": "16",
                "title": "禁入区域人员闯入",
                "description": "在机械停放区检测到安全违规行为，需要立即处理。",
                "warning_level": "medium",
                "status": "resolved",
                "camera_name": "摄像头8号",
                "created_at": "2025-08-22T11:01:09.737800",
                "resolved_by": null,
                "resolved_at": null
            },
            {
                "id": "15",
                "title": "危险区域人员检测",
                "description": "在施工区域A检测到安全违规行为，需要立即处理。",
                "warning_level": "medium",
                "status": "resolved",
                "camera_name": "摄像头2号",
                "created_at": "2025-08-22T11:01:09.734801",
                "resolved_by": "user7",
                "resolved_at": "2025-08-21T22:01:09.734801"
            },
            {
                "id": "14",
                "title": "施工区域安全隐患",
                "description": "在施工区域A检测到安全违规行为，需要立即处理。",
                "warning_level": "medium",
                "status": "processing",
                "camera_name": "摄像头2号",
                "created_at": "2025-08-22T11:01:09.732803",
                "resolved_by": "admin1",
                "resolved_at": "2025-08-21T20:01:09.731800"
            },
            {
                "id": "13",
                "title": "安全帽佩戴不规范",
                "description": "在办公区检测到安全违规行为，需要立即处理。",
                "warning_level": "medium",
                "status": "pending",
                "camera_name": "摄像头5号",
                "created_at": "2025-08-22T11:01:09.729804",
                "resolved_by": null,
                "resolved_at": null
            },
            {
                "id": "12",
                "title": "施工区域安全隐患",
                "description": "在临时建筑区检测到安全违规行为，需要立即处理。",
                "warning_level": "critical",
                "status": "pending",
                "camera_name": "摄像头10号",
                "created_at": "2025-08-22T11:01:09.725800",
                "resolved_by": "user7",
                "resolved_at": "2025-08-21T22:01:09.725800"
            },
            {
                "id": "11",
                "title": "禁入区域人员闯入",
                "description": "在宿舍区检测到安全违规行为，需要立即处理。",
                "warning_level": "high",
                "status": "pending",
                "camera_name": "摄像头7号",
                "created_at": "2025-08-22T11:01:09.722800",
                "resolved_by": "user8",
                "resolved_at": "2025-08-21T16:01:09.722800"
            },
            {
                "id": "10",
                "title": "施工区域安全隐患",
                "description": "在食堂检测到安全违规行为，需要立即处理。",
                "warning_level": "medium",
                "status": "resolved",
                "camera_name": "摄像头6号",
                "created_at": "2025-08-22T11:01:09.719800",
                "resolved_by": "viewer1",
                "resolved_at": "2025-08-22T04:01:09.719800"
            },
            {
                "id": "9",
                "title": "未佩戴安全帽违规",
                "description": "在临时建筑区检测到安全违规行为，需要立即处理。",
                "warning_level": "medium",
                "status": "processing",
                "camera_name": "摄像头10号",
                "created_at": "2025-08-22T11:01:09.716800",
                "resolved_by": "admin",
                "resolved_at": "2025-08-22T09:01:09.716800"
            },
            {
                "id": "8",
                "title": "危险区域人员检测",
                "description": "在危险品存放区检测到安全违规行为，需要立即处理。",
                "warning_level": "high",
                "status": "pending",
                "camera_name": "摄像头9号",
                "created_at": "2025-08-22T11:01:09.712800",
                "resolved_by": "user10",
                "resolved_at": "2025-08-21T10:01:09.712800"
            },
            {
                "id": "7",
                "title": "禁入区域人员闯入",
                "description": "在食堂检测到安全违规行为，需要立即处理。",
                "warning_level": "medium",
                "status": "processing",
                "camera_name": "摄像头6号",
                "created_at": "2025-08-22T11:01:09.709800",
                "resolved_by": "admin1",
                "resolved_at": "2025-08-22T04:01:09.709800"
            },
            {
                "id": "6",
                "title": "未佩戴安全帽违规",
                "description": "在危险品存放区检测到安全违规行为，需要立即处理。",
                "warning_level": "high",
                "status": "resolved",
                "camera_name": "摄像头9号",
                "created_at": "2025-08-22T11:01:09.705801",
                "resolved_by": null,
                "resolved_at": null
            },
            {
                "id": "5",
                "title": "禁入区域人员闯入",
                "description": "在材料堆放区检测到安全违规行为，需要立即处理。",
                "warning_level": "critical",
                "status": "ignored",
                "camera_name": "摄像头4号",
                "created_at": "2025-08-22T11:01:09.702801",
                "resolved_by": "viewer1",
                "resolved_at": "2025-08-21T16:01:09.702801"
            },
            {
                "id": "4",
                "title": "危险区域人员检测",
                "description": "在机械停放区检测到安全违规行为，需要立即处理。",
                "warning_level": "critical",
                "status": "ignored",
                "camera_name": "摄像头8号",
                "created_at": "2025-08-22T11:01:09.699800",
                "resolved_by": "user10",
                "resolved_at": "2025-08-20T15:01:09.699800"
            },
            {
                "id": "3",
                "title": "禁入区域人员闯入",
                "description": "在办公区检测到安全违规行为，需要立即处理。",
                "warning_level": "critical",
                "status": "resolved",
                "camera_name": "摄像头5号",
                "created_at": "2025-08-22T11:01:09.697801",
                "resolved_by": "user7",
                "resolved_at": "2025-08-20T16:01:09.696801"
            },
            {
                "id": "2",
                "title": "危险区域人员检测",
                "description": "在工地入口检测到安全违规行为，需要立即处理。",
                "warning_level": "low",
                "status": "processing",
                "camera_name": "摄像头1号",
                "created_at": "2025-08-22T11:01:09.694801",
                "resolved_by": "admin1",
                "resolved_at": "2025-08-21T14:01:09.693801"
            }
        ]
    }
}
```
<http://localhost:5175/api/safehat/api/cameras/>

```json
{
    "code": 200,
    "msg": null,
    "data": {
        "total": 10,
        "page": 1,
        "page_size": 10,
        "cameras": [
            {
                "camera_id": "CAM010",
                "name": "摄像头10号",
                "location": "临时建筑区",
                "is_online": true,
                "ip_address": "192.168.1.109",
                "port": 8080,
                "rtsp_url": "rtsp://192.168.1.109:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:35:41.677484",
                "created_at": "2025-08-22T10:57:05.935020"
            },
            {
                "camera_id": "CAM009",
                "name": "摄像头9号",
                "location": "危险品存放区",
                "is_online": true,
                "ip_address": "192.168.1.108",
                "port": 1935,
                "rtsp_url": "rtsp://192.168.1.108:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:35:41.677484",
                "created_at": "2025-08-22T10:57:05.932018"
            },
            {
                "camera_id": "CAM008",
                "name": "摄像头8号",
                "location": "机械停放区",
                "is_online": true,
                "ip_address": "192.168.1.107",
                "port": 8080,
                "rtsp_url": "rtsp://192.168.1.107:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:35:41.677484",
                "created_at": "2025-08-22T10:57:05.929674"
            },
            {
                "camera_id": "CAM007",
                "name": "摄像头7号",
                "location": "宿舍区",
                "is_online": true,
                "ip_address": "192.168.1.106",
                "port": 1935,
                "rtsp_url": "rtsp://192.168.1.106:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:35:41.677484",
                "created_at": "2025-08-22T10:57:05.926629"
            },
            {
                "camera_id": "CAM006",
                "name": "摄像头6号",
                "location": "食堂",
                "is_online": true,
                "ip_address": "192.168.1.105",
                "port": 554,
                "rtsp_url": "rtsp://192.168.1.105:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:35:41.677484",
                "created_at": "2025-08-22T10:57:05.923626"
            },
            {
                "camera_id": "CAM005",
                "name": "摄像头5号",
                "location": "办公区",
                "is_online": true,
                "ip_address": "192.168.1.104",
                "port": 1935,
                "rtsp_url": "rtsp://192.168.1.104:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:35:41.677484",
                "created_at": "2025-08-22T10:57:05.920626"
            },
            {
                "camera_id": "CAM004",
                "name": "摄像头4号",
                "location": "材料堆放区",
                "is_online": true,
                "ip_address": "192.168.1.103",
                "port": 1935,
                "rtsp_url": "rtsp://192.168.1.103:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:35:41.677484",
                "created_at": "2025-08-22T10:57:05.917626"
            },
            {
                "camera_id": "CAM003",
                "name": "摄像头3号",
                "location": "施工区域B",
                "is_online": true,
                "ip_address": "192.168.1.102",
                "port": 1935,
                "rtsp_url": "rtsp://192.168.1.102:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:35:41.677484",
                "created_at": "2025-08-22T10:57:05.914625"
            },
            {
                "camera_id": "CAM002",
                "name": "摄像头2号",
                "location": "施工区域A",
                "is_online": true,
                "ip_address": "192.168.1.101",
                "port": 1935,
                "rtsp_url": "rtsp://192.168.1.101:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:35:41.677484",
                "created_at": "2025-08-22T10:57:05.911625"
            },
            {
                "camera_id": "CAM001",
                "name": "摄像头1号",
                "location": "工地入口",
                "is_online": true,
                "ip_address": "192.168.1.100",
                "port": 8080,
                "rtsp_url": "rtsp://192.168.1.100:554/stream",
                "is_active": true,
                "last_heartbeat": "2025-08-22T14:35:41.677484",
                "created_at": "2025-08-22T10:57:05.908626"
            }
        ]
    }
}
```
