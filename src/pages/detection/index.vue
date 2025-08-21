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
          <!-- 监控控制区域 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">监控控制</h2>
            <div class="flex flex-wrap gap-3">
              <button @click="requestCameraPermission"
                class="btn btn-sm bg-slate-700 hover:bg-slate-800 text-white border-0"
                :disabled="permissionRequested">
                {{ permissionRequested ? '权限已获取' : '获取摄像头权限' }}
              </button>
              <button @click="toggleAllCameras" class="btn btn-sm bg-gray-600 hover:bg-gray-700 text-white border-0"
                :disabled="!permissionRequested">
                {{ allCamerasActive ? '关闭全部摄像头' : '开启全部摄像头' }}
              </button>
              <button @click="exportWarnings" 
                class="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white border-0">
                导出警告记录
              </button>
              <button @click="resetWarnings" 
                class="btn btn-sm bg-orange-600 hover:bg-orange-700 text-white border-0">
                重置警告
              </button>
            </div>
          </div>

          <!-- 摄像头模块区域 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold text-gray-800">摄像头监控</h2>
              <div class="flex gap-3">
                <button @click="requestCameraPermission"
                  class="btn btn-sm bg-slate-700 hover:bg-slate-800 text-white border-0"
                  :disabled="permissionRequested">
                  {{ permissionRequested ? '权限已获取' : '获取摄像头权限' }}
                </button>
                <button @click="toggleAllCameras" class="btn btn-sm bg-gray-600 hover:bg-gray-700 text-white border-0"
                  :disabled="!permissionRequested">
                  {{ allCamerasActive ? '关闭全部摄像头' : '开启全部摄像头' }}
                </button>
              </div>
            </div>

            <!-- 摄像头网格 -->
            <div v-if="cameras.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="camera in cameras" :key="camera.id"
                class="relative bg-gray-100 rounded-lg overflow-hidden aspect-video border border-gray-300 cursor-pointer hover:border-slate-400 transition-colors"
                @click="openPreview(camera)">
                <div class="absolute top-2 left-2 z-10">
                  <span class="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {{ camera.label || `摄像头 #${camera.id}` }}
                  </span>
                </div>

                <video v-if="camera.active" :ref="(el) => setVideoRef(camera.id, el as HTMLVideoElement)"
                  class="w-full h-full object-cover" autoplay muted playsinline></video>

                <div v-else class="flex items-center justify-center h-full text-gray-500">
                  <div class="text-center">
                    <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clip-rule="evenodd" />
                    </svg>
                    <p class="text-sm">摄像头未启动</p>
                  </div>
                </div>

                <div class="absolute bottom-2 right-2">
                  <button @click.stop="toggleCamera(camera.id)" class="btn btn-xs"
                    :class="camera.active ? 'btn-error' : 'btn-success'" :disabled="!permissionRequested">
                    {{ camera.active ? '关闭' : '开启' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 实时统计区域 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">实时统计</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-blue-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-blue-600">{{ stats.onlinePeople }}</div>
                <div class="text-sm text-gray-600">在线人员</div>
              </div>
              <div class="bg-green-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-green-600">{{ stats.withHelmet }}</div>
                <div class="text-sm text-gray-600">佩戴安全帽</div>
              </div>
              <div class="bg-red-50 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold text-red-600">{{ stats.withoutHelmet }}</div>
                <div class="text-sm text-gray-600">未佩戴安全帽</div>
              </div>
              <div class="bg-yellow-50 rounded-lg p-4 text-center">
                <div 
                  class="text-2xl font-bold"
                  :class="{
                    'text-green-600': stats.complianceRate >= 90,
                    'text-yellow-600': stats.complianceRate >= 70,
                    'text-red-600': stats.complianceRate < 70
                  }"
                >
                  {{ stats.complianceRate }}%
                </div>
                <div class="text-sm text-gray-600">合规率</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧消息区域 -->
        <div class="xl:col-span-1 space-y-6">
          <!-- 实时警告消息 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">实时警告</h3>
            <div class="space-y-3 max-h-80 overflow-y-auto">
              <div v-for="warning in warnings" :key="warning.datetime" 
                class="p-3 rounded-lg border-l-4" 
                :class="warning.type === '严重警告' ? 'bg-red-50 border-red-400' : 'bg-yellow-50 border-yellow-400'">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs px-2 py-1 rounded" 
                        :class="warning.type === '严重警告' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'">
                        {{ warning.type }}
                      </span>
                      <span class="text-xs text-gray-500">{{ warning.camera }}</span>
                    </div>
                    <p class="text-sm text-gray-700">{{ warning.event }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ formatDateTime(warning.datetime) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 操作区 -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">快捷操作</h3>
            <div class="space-y-3">
              <button @click="toggleAllCameras" 
                class="w-full btn btn-sm bg-slate-700 hover:bg-slate-800 text-white border-0"
                :disabled="!permissionRequested">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/>
                </svg>
                {{ allCamerasActive ? '关闭全部摄像头' : '开启全部摄像头' }}
              </button>
              
              <button @click="exportWarnings" 
                class="w-full btn btn-sm bg-gray-600 hover:bg-gray-700 text-white border-0">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
                导出警告记录
              </button>
              
              <button @click="resetWarnings" 
                class="w-full btn btn-sm bg-orange-600 hover:bg-orange-700 text-white border-0">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
                </svg>
                重置警告
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全屏摄像头预览遮罩 -->
    <div 
      v-if="selectedCamera" 
      class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      @click="closePreview"
    >
      <div class="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
        <!-- 关闭按钮 -->
        <button 
          @click="closePreview"
          class="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        
        <!-- 摄像头标签 -->
        <div class="absolute top-4 left-4 z-10">
          <span class="bg-black bg-opacity-70 text-white px-3 py-2 rounded text-lg font-medium">
            {{ selectedCamera.label || `摄像头 #${selectedCamera.id}` }}
          </span>
        </div>
        
        <!-- 放大的视频 -->
        <video 
          v-if="selectedCamera.active && selectedCamera.stream"
          :ref="(el) => previewVideoEl = el as HTMLVideoElement"
          class="max-w-full max-h-full object-contain rounded-lg"
          autoplay
          muted
          playsinline
          @click.stop
        ></video>
        
        <!-- 无视频流提示 -->
        <div v-else class="text-white text-center">
          <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
          </svg>
          <p class="text-lg opacity-70">摄像头未启动或无视频流</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted, nextTick } from 'vue'

interface Camera {
  id: number
  active: boolean
  stream: MediaStream | null
  deviceId?: string
  label?: string
}

interface Warning {
  type: string
  camera: string
  event: string
  datetime: string
}

interface Stats {
  onlinePeople: number
  withHelmet: number
  withoutHelmet: number
  complianceRate: number
}

const permissionRequested = ref(false)
const allCamerasActive = ref(false)
const availableDevices = ref<MediaDeviceInfo[]>([])
const cameras = ref<Camera[]>([])
const selectedCamera = ref<Camera | null>(null)
const videoRefs = ref<Map<number, HTMLVideoElement>>(new Map())

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

// 实时统计数据
const stats = ref<Stats>({
  onlinePeople: 8,
  withHelmet: 6,
  withoutHelmet: 2,
  complianceRate: 75
})

// 放大预览
const previewVideoEl = ref<HTMLVideoElement | null>(null)

// 设置视频元素引用
const setVideoRef = async (cameraId: number, el: HTMLVideoElement | null) => {
  if (!el) return
  videoRefs.value.set(cameraId, el)
  const camera = cameras.value.find(c => c.id === cameraId)
  if (camera?.stream) {
    el.srcObject = camera.stream
    el.muted = true
    try {
      await el.play()
    } catch (error) {
      console.warn(`视频播放失败 (摄像头 ${cameraId}):`, error)
    }
  }
}

// 放大窗口视频绑定
const setPreviewRef = (el: HTMLVideoElement | null) => {
  previewVideoEl.value = el
  if (el && selectedCamera.value?.stream) {
    el.srcObject = selectedCamera.value.stream
    el.play().catch(() => { })
  }
}

const openPreview = async (camera: Camera) => {
  if (camera.active && camera.stream) {
    selectedCamera.value = camera
    // 等待DOM更新后设置预览视频流
    await nextTick()
    if (previewVideoEl.value && camera.stream) {
      previewVideoEl.value.srcObject = camera.stream
      previewVideoEl.value.muted = true
      try {
        await previewVideoEl.value.play()
      } catch (error) {
        console.warn('预览视频播放失败:', error)
      }
    }
  }
}

const closePreview = () => {
  if (previewVideoEl.value) {
    previewVideoEl.value.srcObject = null
  }
  selectedCamera.value = null
}

// 获取摄像头
const getAvailableCameras = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices()
  availableDevices.value = devices.filter(d => d.kind === 'videoinput')
  cameras.value = availableDevices.value.map((d, i) => ({
    id: i + 1,
    active: false,
    stream: null,
    deviceId: d.deviceId,
    label: d.label || `摄像头 ${i + 1}`
  }))
}

// 请求权限
const requestCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    stream.getTracks().forEach(t => t.stop())
    permissionRequested.value = true
    await getAvailableCameras()
  } catch (e) {
    alert('无法获取摄像头权限')
  }
}

// 开关单个摄像头
const toggleCamera = async (id: number) => {
  const camera = cameras.value.find(c => c.id === id)
  if (!camera) return
  if (camera.active) {
    camera.stream?.getTracks().forEach(t => t.stop())
    camera.stream = null
    camera.active = false
    videoRefs.value.get(id)!.srcObject = null
  } else {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: camera.deviceId ? { exact: camera.deviceId } : undefined }
      })
      camera.stream = stream
      camera.active = true
      await nextTick() // 确保DOM更新完成
      const el = videoRefs.value.get(id)
      if (el) {
        el.srcObject = stream
        el.muted = true // 确保静音避免浏览器拦截
        try {
          await el.play()
        } catch (playError) {
          console.warn('视频自动播放失败，用户可能需要手动播放:', playError)
        }
      }
    } catch (e) {
      alert(`摄像头 ${id} 启动失败`)
    }
  }
  allCamerasActive.value = cameras.value.every(c => c.active)
}

// 全部开关
const toggleAllCameras = () => {
  const should = !allCamerasActive.value
  cameras.value.forEach(c => {
    if (c.active !== should) toggleCamera(c.id)
  })
}

// 格式化时间
const formatDateTime = (datetime: string) => {
  const date = new Date(datetime)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 导出警告记录
const exportWarnings = () => {
  const csvContent = "data:text/csv;charset=utf-8," + 
    "警告类型,摄像头,事件,时间\n" +
    warnings.value.map(w => `${w.type},${w.camera},${w.event},${w.datetime}`).join("\n")
  
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `警告记录_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 重置警告
const resetWarnings = () => {
  if (confirm('确定要清空所有警告记录吗？')) {
    warnings.value = []
  }
}

// 清理
onUnmounted(() => {
  cameras.value.forEach(c => c.stream?.getTracks().forEach(t => t.stop()))
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
