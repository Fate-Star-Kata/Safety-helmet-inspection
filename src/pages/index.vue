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
        <div class="stat bg-white rounded-lg shadow-lg border border-gray-200">
          <div class="stat-figure text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="inline-block w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z">
              </path>
            </svg>
          </div>
          <div class="stat-title text-gray-600">在线摄像头</div>
          <div class="stat-value text-slate-700">{{ stats.cameras }}</div>
        </div>

        <div class="stat bg-white rounded-lg shadow-lg border border-gray-200">
          <div class="stat-figure text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="inline-block w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
              </path>
            </svg>
          </div>
          <div class="stat-title text-gray-600">今日检测人次</div>
          <div class="stat-value text-slate-700">{{ stats.detections }}</div>
        </div>

        <div class="stat bg-white rounded-lg shadow-lg border border-gray-200">
          <div class="stat-figure text-orange-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="inline-block w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z">
              </path>
            </svg>
          </div>
          <div class="stat-title text-gray-600">今日警告次数</div>
          <div class="stat-value text-orange-600">{{ stats.warnings }}</div>
        </div>

        <div class="stat bg-white rounded-lg shadow-lg border border-gray-200">
          <div class="stat-figure text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              class="inline-block w-8 h-8 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="stat-title text-gray-600">检测准确率</div>
          <div class="stat-value text-green-600">{{ stats.accuracy }}</div>
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
                <div class="alert bg-orange-50 border border-orange-200 text-orange-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6 text-orange-600"
                    fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h3 class="font-bold text-orange-800">警告</h3>
                    <div class="text-xs text-orange-700">摄像头#3检测到未佩戴安全帽人员 - 2024年1月15日 14:30</div>
                  </div>
                </div>

                <div class="alert bg-red-50 border border-red-200 text-red-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6 text-red-600"
                    fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 class="font-bold text-red-800">严重警告</h3>
                    <div class="text-xs text-red-700">摄像头#1检测到危险区域有人员未佩戴安全帽 - 2024年1月15日 13:45</div>
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
                <span class="text-sm text-gray-500">检测算法</span>
                <span class="font-semibold text-gray-800">YOLOv11</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">系统版本</span>
                <span class="font-semibold text-gray-800">v2.1.0</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">最后更新</span>
                <span class="font-semibold text-gray-800">2024年1月10日</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">运行状态</span>
                <span class="font-semibold text-green-600 flex items-center">
                  <span class="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                  正常运行
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
import { ref } from 'vue'
import { Motion } from 'motion-v'

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

// 统计数据
const stats = ref({
  cameras: 20,
  detections: 127,
  warnings: 3,
  accuracy: '98.5%'
})
</script>

<style scoped lang="scss">
// 自定义样式可以在这里添加
</style>
