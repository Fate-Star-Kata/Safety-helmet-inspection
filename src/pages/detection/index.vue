<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold mb-2">实时监控</h1>
        <p class="text-slate-200">实时监控工地安全帽佩戴情况，基于YOLOv11算法进行智能检测</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto p-6">
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <!-- 左侧主要内容区域 -->
        <div class="xl:col-span-3 space-y-6">
          <!-- 摄像头模块区域 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-800">摄像头监控</h2>
              <div class="flex gap-3">
                <button 
                  @click="requestCameraPermission" 
                  class="btn btn-sm bg-slate-700 hover:bg-slate-800 text-white border-0"
                  :disabled="permissionRequested"
                >
                  {{ permissionRequested ? '权限已获取' : '获取摄像头权限' }}
                </button>
                <button 
                  @click="toggleAllCameras" 
                  class="btn btn-sm bg-gray-600 hover:bg-gray-700 text-white border-0"
                  :disabled="!permissionRequested"
                >
                  {{ allCamerasActive ? '关闭全部摄像头' : '开启全部摄像头' }}
                </button>
              </div>
            </div>
            
            <!-- 摄像头网格 -->
            <div v-if="cameras.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="camera in cameras" 
                :key="camera.id"
                class="relative bg-gray-100 rounded-lg overflow-hidden aspect-video border border-gray-300"
              >
                <div class="absolute top-2 left-2 z-10">
                  <span class="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {{ camera.label || `摄像头 #${camera.id}` }}
                  </span>
                </div>
                
                <video 
                  v-if="camera.active" 
                  :ref="(el) => setVideoRef(camera.id, el as HTMLVideoElement)"
                  class="w-full h-full object-cover"
                  autoplay
                  muted
                  playsinline
                ></video>
                
                <div v-else class="flex items-center justify-center h-full text-gray-500">
                  <div class="text-center">
                    <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                    </svg>
                    <p class="text-sm">摄像头未启动</p>
                  </div>
                </div>
                
                <div class="absolute bottom-2 right-2">
                  <button 
                    @click="toggleCamera(camera.id)"
                    class="btn btn-xs"
                    :class="camera.active ? 'btn-error' : 'btn-success'"
                    :disabled="!permissionRequested"
                  >
                    {{ camera.active ? '关闭' : '开启' }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 无摄像头提示 -->
            <div v-else-if="permissionRequested" class="text-center py-12">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
              </svg>
              <p class="text-gray-500">未检测到可用的摄像头设备</p>
            </div>
            
            <!-- 权限未获取提示 -->
            <div v-else class="text-center py-12">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <p class="text-gray-500 mb-2">请先获取摄像头权限</p>
              <p class="text-sm text-gray-400">点击上方"获取摄像头权限"按钮开始</p>
            </div>
          </div>

          <!-- 实时统计 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">实时统计</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-slate-700">{{ stats.onlinePersonnel }}</div>
                <div class="text-sm text-gray-600">当前在线人员</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ stats.withHelmet }}</div>
                <div class="text-sm text-gray-600">佩戴安全帽</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-red-600">{{ stats.withoutHelmet }}</div>
                <div class="text-sm text-gray-600">未佩戴安全帽</div>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <div class="text-2xl font-bold text-orange-600">{{ stats.complianceRate }}%</div>
                <div class="text-sm text-gray-600">合规率</div>
              </div>
            </div>
          </div>

          <!-- 操作区 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">操作控制</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button class="btn bg-slate-700 hover:bg-slate-800 text-white border-0">
                <span class="mr-2">⚙️</span>
                监控控制
              </button>
              <button class="btn bg-gray-600 hover:bg-gray-700 text-white border-0">
                <span class="mr-2">📹</span>
                全部摄像头开/关
              </button>
              <button class="btn bg-orange-600 hover:bg-orange-700 text-white border-0">
                <span class="mr-2">📥</span>
                导出警告记录
              </button>
              <button class="btn bg-red-600 hover:bg-red-700 text-white border-0">
                <span class="mr-2">🔄</span>
                重置警告
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧消息区域 -->
        <div class="xl:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">实时警告</h3>
            <div class="space-y-3 max-h-96 overflow-y-auto">
              <div 
                v-for="warning in warnings" 
                :key="warning.datetime"
                class="p-3 rounded-lg border-l-4"
                :class="{
                  'bg-orange-50 border-orange-400': warning.type === '一般警告',
                  'bg-red-50 border-red-400': warning.type === '严重警告'
                }"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span 
                        class="px-2 py-1 rounded text-xs font-medium"
                        :class="{
                          'bg-orange-100 text-orange-800': warning.type === '一般警告',
                          'bg-red-100 text-red-800': warning.type === '严重警告'
                        }"
                      >
                        {{ warning.type }}
                      </span>
                      <span class="text-xs text-gray-500">{{ warning.camera }}</span>
                    </div>
                    <p class="text-sm text-gray-700 mb-1">{{ warning.event }}</p>
                    <p class="text-xs text-gray-500">{{ formatDateTime(warning.datetime) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'

// 类型定义
interface Camera {
  id: number
  active: boolean
  stream: MediaStream | null
  deviceId?: string
  label?: string
}

interface Warning {
  type: '一般警告' | '严重警告'
  camera: string
  event: string
  datetime: string
}

interface Stats {
  onlinePersonnel: number
  withHelmet: number
  withoutHelmet: number
  complianceRate: number
}

// 摄像头相关状态
const permissionRequested = ref<boolean>(false)
const allCamerasActive = ref<boolean>(false)
const availableDevices = ref<MediaDeviceInfo[]>([])
const cameras = ref<Camera[]>([])

// 视频元素引用
const videoRefs = ref<Map<number, HTMLVideoElement>>(new Map())

// 统计数据
const stats = reactive<Stats>({
  onlinePersonnel: 8,
  withHelmet: 6,
  withoutHelmet: 2,
  complianceRate: 84
})

// 警告数据
const warnings = ref<Warning[]>([
  {
    type: "一般警告",
    camera: "#4",
    event: "检测到人员聚集",
    datetime: "2025-08-21T17:05:44"
  },
  {
    type: "一般警告",
    camera: "#4",
    event: "检测到人员聚集",
    datetime: "2025-08-21T17:05:34"
  },
  {
    type: "一般警告",
    camera: "#2",
    event: "检测到可疑行为",
    datetime: "2025-08-21T17:05:24"
  },
  {
    type: "一般警告",
    camera: "#4",
    event: "检测到人员聚集",
    datetime: "2025-08-21T17:05:14"
  },
  {
    type: "一般警告",
    camera: "#2",
    event: "检测到可疑行为",
    datetime: "2025-08-21T17:05:04"
  },
  {
    type: "一般警告",
    camera: "#4",
    event: "检测到人员聚集",
    datetime: "2025-08-21T17:04:54"
  },
  {
    type: "严重警告",
    camera: "#3",
    event: "危险区域有人员未佩戴安全帽",
    datetime: "2025-08-21T17:04:44"
  },
  {
    type: "严重警告",
    camera: "#3",
    event: "危险区域有人员未佩戴安全帽",
    datetime: "2025-08-21T17:04:34"
  }
])

// 设置视频元素引用
const setVideoRef = (cameraId: number, el: HTMLVideoElement | null) => {
  if (el) {
    videoRefs.value.set(cameraId, el)
  }
}

// 获取可用摄像头设备
const getAvailableCameras = async (): Promise<void> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    availableDevices.value = devices.filter(device => device.kind === 'videoinput')
    
    // 根据实际摄像头数量创建摄像头对象
    cameras.value = availableDevices.value.map((device, index) => ({
      id: index + 1,
      active: false,
      stream: null,
      deviceId: device.deviceId,
      label: device.label || `摄像头 ${index + 1}`
    }))
    
    console.log(`发现 ${availableDevices.value.length} 个摄像头设备`)
  } catch (error) {
    console.error('获取摄像头设备失败:', error)
  }
}

// 请求摄像头权限
const requestCameraPermission = async (): Promise<void> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    // 立即停止流，只是为了获取权限
    stream.getTracks().forEach(track => track.stop())
    permissionRequested.value = true
    
    // 获取权限后枚举摄像头设备
    await getAvailableCameras()
  } catch (error) {
    console.error('获取摄像头权限失败:', error)
    alert('无法获取摄像头权限，请检查浏览器设置')
  }
}

// 切换单个摄像头
const toggleCamera = async (cameraId: number): Promise<void> => {
  const camera = cameras.value.find(c => c.id === cameraId)
  if (!camera) return

  if (camera.active) {
    // 关闭摄像头
    if (camera.stream) {
      camera.stream.getTracks().forEach(track => track.stop())
      camera.stream = null
    }
    camera.active = false
    
    // 清除video元素的srcObject
    const videoEl = videoRefs.value.get(cameraId)
    if (videoEl) {
      videoEl.srcObject = null
    }
  } else {
    // 开启摄像头
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: (camera as any).deviceId ? { exact: (camera as any).deviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      camera.stream = stream
      camera.active = true
      
      // 将流分配给对应的video元素
      const videoEl = videoRefs.value.get(cameraId)
      if (videoEl) {
        videoEl.srcObject = stream
        // 确保视频开始播放
        try {
          await videoEl.play()
        } catch (playError) {
          console.warn('视频自动播放失败，用户可能需要手动播放:', playError)
        }
      }
    } catch (error) {
      console.error(`摄像头 ${cameraId} 启动失败:`, error)
      alert(`摄像头 ${cameraId} 启动失败: ${error}`)
    }
  }
  
  // 更新全部摄像头状态
  allCamerasActive.value = cameras.value.length > 0 && cameras.value.every(c => c.active)
}

// 切换全部摄像头
const toggleAllCameras = (): void => {
  const shouldActivate = !allCamerasActive.value
  
  cameras.value.forEach(camera => {
    if (camera.active !== shouldActivate) {
      toggleCamera(camera.id)
    }
  })
}

// 格式化日期时间
const formatDateTime = (datetime: string): string => {
  const date = new Date(datetime)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 组件卸载时清理资源
onUnmounted(() => {
  cameras.value.forEach(camera => {
    if (camera.stream) {
      camera.stream.getTracks().forEach(track => track.stop())
    }
  })
})
</script>

<style scoped>
/* 自定义滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>