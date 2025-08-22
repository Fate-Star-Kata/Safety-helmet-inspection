<template>
  <Motion v-bind="pageVariants">
    <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.1 }">
      <div class="hero bg-gradient-to-r from-slate-700 to-slate-800 text-white py-16">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold">欢迎使用工地安全帽检测系统</h1>
          <p class="mb-5 text-lg opacity-90">
            基于YOLOv11深度学习算法的智能安全帽检测系统，实时保障工地安全。
          </p>
        </div>
      </div>
    </div>
    </Motion>

    <div class="container mx-auto px-4 py-8">
      <!-- 统计模块 -->
      <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.2 } as any">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">总检测数</p>
                <p class="text-3xl font-bold text-blue-600">{{ stats.totalDetections }}</p>
              </div>
              <div class="p-3 bg-blue-100 rounded-full">
                <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                    clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">合规率</p>
                <p class="text-3xl font-bold text-green-600">{{ stats.complianceRate }}%</p>
              </div>
              <div class="p-3 bg-green-100 rounded-full">
                <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">总警告数</p>
                <p class="text-3xl font-bold text-orange-600">{{ stats.totalWarnings }}</p>
              </div>
              <div class="p-3 bg-orange-100 rounded-full">
                <svg class="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">活跃摄像头</p>
                <p class="text-3xl font-bold text-purple-600">{{ stats.activeCameras }}</p>
              </div>
              <div class="p-3 bg-purple-100 rounded-full">
                <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Motion>

      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, delay: 0.3 }">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 操作区 -->
        <div class="lg:col-span-1">
          <div class="card bg-white shadow-xl border border-gray-200">
            <div class="card-body">
              <h2 class="card-title text-2xl mb-4 text-gray-800">快速操作</h2>
              <div class="space-y-3">
                <button 
                  @click="$router.push('/detection')"
                  class="btn bg-slate-700 hover:bg-slate-800 text-white btn-block justify-start border-0"
                >
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  进入实时监控
                </button>
                <button 
                  @click="$router.push('/history')"
                  class="btn bg-orange-600 hover:bg-orange-700 text-white btn-block justify-start border-0"
                >
                  <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.178 2.625-1.516 2.625H3.72c-1.337 0-2.189-1.458-1.515-2.625L8.485 2.495z" />
                    <path d="M11 8h2v6h-2z" />
                    <path d="M12 17.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z" />
                  </svg>
                  查看警告记录
                </button>
                <button 
                  @click="$router.push('/statistics')"
                  class="btn bg-gray-600 hover:bg-gray-700 text-white btn-block justify-start border-0"
                >
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                  </svg>
                  统计分析
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 警告信息区 -->
        <div class="lg:col-span-2">
          <div class="card bg-white shadow-xl border border-gray-200">
            <div class="card-body">
              <h2 class="card-title text-2xl mb-4 text-gray-800">最新警告信息</h2>
              <div class="space-y-4">
                <div v-for="warning in warnings" :key="warning.id" :class="getWarningLevelInfo(warning.warning_level).alertClass">
                  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" :class="getWarningLevelInfo(warning.warning_level).iconClass" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h3 class="font-bold" :class="getWarningLevelInfo(warning.warning_level).titleClass">{{ getWarningLevelInfo(warning.warning_level).label }}</h3>
                    <div class="text-xs" :class="getWarningLevelInfo(warning.warning_level).textClass">
                      {{ warning.camera_name }}检测到{{ warning.title }} - {{ formatDateTime(warning.created_at) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-actions justify-end mt-4">
                <button 
                  @click="$router.push('/history')"
                  class="btn bg-gray-600 hover:bg-gray-700 text-white btn-sm border-0"
                >
                  查看全部警告
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 系统信息 -->
      <div class="mt-8">
        <div class="card bg-white shadow-xl border border-gray-200">
          <div class="card-body">
            <h2 class="card-title text-2xl mb-4 text-gray-800">系统信息</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">模型名称</span>
                <span class="font-semibold text-gray-800">{{ systemInfo?.name || '加载中...' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">模型路径</span>
                <span class="font-semibold text-gray-800">{{ systemInfo?.model_path || '加载中...' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">置信度阈值</span>
                <span class="font-semibold text-gray-800">{{ systemInfo?.confidence_threshold || '加载中...' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">运行状态</span>
                <span class="font-semibold flex items-center" :class="systemInfo?.is_active ? 'text-green-600' : 'text-red-600'">
                  <span class="w-2 h-2 rounded-full mr-2" :class="systemInfo?.is_active ? 'bg-green-600' : 'bg-red-600'"></span>
                  {{ systemInfo?.is_active ? '正常运行' : '已停用' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Motion>
    </div>
  </div>
  </Motion>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Motion } from 'motion-v'
import { getWarnings, getModels } from '@/api/inspection/API'
import type { Warning, ModelInfo } from '@/types/apis/inspection_T'

// 动画配置
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

// 统计数据 - 与statistics/index.vue保持一致
const stats = computed(() => {
  const totalWarnings = warnings.value.length
  const criticalWarnings = warnings.value.filter(w => w.warning_level === 'critical').length
  const warningLevel = warnings.value.filter(w => w.warning_level === 'warning').length
  const infoLevel = warnings.value.filter(w => w.warning_level === 'info').length
  
  // 模拟总检测数和合规率数据
  const totalDetections = 1250
  const complianceRate = 96.8
  const activeCameras = 8
  
  return {
    totalDetections,
    complianceRate,
    totalWarnings,
    activeCameras
  }
})

const warnings = ref<Warning[]>([])
const systemInfo = ref<ModelInfo | null>(null)
let warningInterval: any = null

const getWarningLevelInfo = (level: 'info' | 'warning' | 'critical') => {
  switch (level) {
    case 'warning':
      return {
        label: '一般警告',
        alertClass: 'alert bg-orange-50 border border-orange-200 text-orange-800',
        iconClass: 'text-orange-600',
        titleClass: 'text-orange-800',
        textClass: 'text-orange-700'
      }
    case 'critical':
      return {
        label: '严重警告',
        alertClass: 'alert bg-red-50 border border-red-200 text-red-800',
        iconClass: 'text-red-600',
        titleClass: 'text-red-800',
        textClass: 'text-red-700'
      }
    default:
      return {
        label: '通知',
        alertClass: 'alert bg-blue-50 border border-blue-200 text-blue-800',
        iconClass: 'text-blue-600',
        titleClass: 'text-blue-800',
        textClass: 'text-blue-700'
      }
  }
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const fetchWarnings = async () => {
  try {
    const res = await getWarnings({ page: 1, page_size: 5 })
    console.log('获取警告数据:', res)
    warnings.value = res.data.warnings
  } catch (error) {
    console.error('获取警告信息失败:', error)
  }
}

const fetchSystemInfo = async () => {
  try {
    const res = await getModels({ page: 1, page_size: 10 })
    console.log('获取模型数据:', res)
    if (res.data.models.length > 0) {
      // 使用最后一项模型数据
      systemInfo.value = res.data.models[res.data.models.length - 1]
    }
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
}

onMounted(() => {
  fetchWarnings()
  fetchSystemInfo()
  // 每分钟刷新警告和系统信息
  warningInterval = setInterval(() => {
    fetchWarnings()
    fetchSystemInfo()
  }, 60000)
})

onUnmounted(() => {
  if (warningInterval) {
    clearInterval(warningInterval)
  }
})
</script>

<style scoped lang="scss">
// 自定义样式可以在这里添加
</style>
