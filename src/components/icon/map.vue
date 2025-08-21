<template>
    <svg :width="size" :height="size" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-labelledby="title desc" role="img">
        <title id="title">安全帽智能检测 · Logo</title>
        <desc id="desc">正方形版，仅保留安全帽与检测框图形</desc>
        <g stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
            <!-- 左括号 -->
            <path d="M10 50 v-20 a10 10 0 0 1 10-10 h20" :color="color" />
            <path d="M40 100 h-20 a10 10 0 0 1-10-10 v-20" :color="color" />
            <!-- 右括号 -->
            <path d="M118 50 v-20 a10 10 0 0 0-10-10 h-20" :color="color" />
            <path d="M88 100 h20 a10 10 0 0 0 10-10 v-20" :color="color" />

            <!-- 帽顶 -->
            <path d="M44 64 a20 20 0 0 1 40 0" :color="color" />
            <!-- 帽檐 -->
            <path d="M34 70 h60 c3 0 5 2 5 4 s-2 4-5 4 h-60 c-3 0-5-2-5-4 s2-4 5-4z" :color="color" />
            <!-- 内衬线 -->
            <path d="M54 70 v-6 M74 70 v-6" :color="color" />

            <!-- 镜头 -->
            <circle cx="64" cy="56" r="6" fill="currentColor" :color="color" />

            <circle cx="64" cy="56" r="2.5" fill="none" :color="color" />

            <!-- 投影 -->
            <path d="M48 86 q16 6 32 0" opacity="0.6" :color="color" />

        </g>
    </svg>
</template>

<script setup lang="ts">
// 定义组件属性
interface Props {
    size?: string | number
    color?: string
}

// 设置默认值
const props = withDefaults(defineProps<Props>(), {
    size: 24,
    color: '#2c2c2c'
})
</script>

<style scoped lang="scss"></style>
