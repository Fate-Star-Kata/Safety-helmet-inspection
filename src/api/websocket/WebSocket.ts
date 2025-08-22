import serverConfig from "@/configs"
import { ElMessage } from "element-plus"

// WebSocketClient.ts
type WebSocketCallbacks = {
  onOpen?: () => void // 连接成功回调
  onMessage?: (data: string | ArrayBuffer | Blob) => void // 收到消息回调
  onClose?: (event: CloseEvent) => void // 连接关闭回调
  onError?: (event: Event) => void // 连接错误回调
}

interface WebSocketOptions {
  reconnectInterval?: number // 重连间隔 ms
  maxReconnectAttempts?: number // 最大重连次数
  heartbeatInterval?: number // 心跳间隔 ms
  heartbeatMsg?: string // 心跳消息
}

export default class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string
  private callbacks: WebSocketCallbacks
  private options: Required<WebSocketOptions>
  private reconnectAttempts = 0
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private manualClose = false // 是否手动关闭

  constructor(url: string, callbacks: WebSocketCallbacks = {}, options: WebSocketOptions = {}) {
    this.url = serverConfig.WEBSOCKET_PATH + url
    this.callbacks = callbacks

    // 默认配置
    this.options = {
      reconnectInterval: options.reconnectInterval ?? 3000,
      maxReconnectAttempts: options.maxReconnectAttempts ?? 5,
      heartbeatInterval: options.heartbeatInterval ?? 20000,
      heartbeatMsg: options.heartbeatMsg ?? 'ping',
    }
  }

  // 建立连接
  connect() {
    if (this.ws) {
      console.warn('WebSocket 已连接，无法重复连接')
      return
    }

    this.manualClose = false
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      // 连接成功日志
      console.log('[WS] open:', this.url)
      this.callbacks.onOpen?.()
      this.reconnectAttempts = 0 // 重连计数清零
      this.startHeartbeat()
      ElMessage.success('WebSocket 连接成功')
    }

    this.ws.onmessage = (event: MessageEvent) => {
      // 接收消息日志（做长度截断，避免刷屏）
      const data = event.data
      if (typeof data === 'string') {
        const show = data.length > 200 ? data.slice(0, 200) + ` ...(${data.length})` : data
        console.log('[WS] recv(string):', show)
      } else if (data instanceof Blob) {
        console.log('[WS] recv(blob):', data.size, 'bytes')
      } else {
        try {
          // 某些环境下为 ArrayBuffer
          const size = (data as ArrayBuffer).byteLength
          console.log('[WS] recv(buffer):', size, 'bytes')
        } catch {
          console.log('[WS] recv:', data)
        }
      }
      this.callbacks.onMessage?.(event.data)
    }

    this.ws.onclose = (event: CloseEvent) => {
      console.log('[WS] close:', { code: event.code, reason: event.reason, wasClean: event.wasClean })
      this.callbacks.onClose?.(event)
      this.ws = null
      this.stopHeartbeat()
      ElMessage.info('WebSocket 已断开')

      if (!this.manualClose) {
        this.tryReconnect()
      }
    }

    this.ws.onerror = (event: Event) => {
      console.error('[WS] error:', event)
      this.callbacks.onError?.(event)
      ElMessage.error('WebSocket 连接出错')
    }
  }

  // 尝试重连
  private tryReconnect() {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      console.warn('已达到最大重连次数，停止重连')
      return
    }

    this.reconnectAttempts++
    setTimeout(() => {
      console.log(`🔄 正在重连... (第 ${this.reconnectAttempts} 次)`) 
      this.connect()
    }, this.options.reconnectInterval)
  }

  // 启动心跳
  private startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send(this.options.heartbeatMsg)
      }
    }, this.options.heartbeatInterval)
  }

  // 停止心跳
  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  // 发送消息
  send(data: string | object | ArrayBuffer | Blob) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket 未连接，无法发送消息')
      return
    }

    // 发送前打印（过滤心跳，避免刷屏）
    const isHeartbeat = typeof data === 'string' && data === this.options.heartbeatMsg
    if (!isHeartbeat) {
      if (typeof data === 'string') {
        const show = data.length > 200 ? data.slice(0, 200) + ` ...(${data.length})` : data
        console.log('[WS] send(string):', show)
      } else if (data instanceof Blob) {
        console.log('[WS] send(blob):', data.size, 'bytes')
      } else if (data instanceof ArrayBuffer) {
        console.log('[WS] send(buffer):', data.byteLength, 'bytes')
      } else {
        // 对象：优先打印 type 字段与简要信息
        const summary: Record<string, unknown> = {}
        if ((data as any).type) summary.type = (data as any).type
        if ((data as any).camera_id) summary.camera_id = (data as any).camera_id
        if ((data as any).timestamp) summary.timestamp = (data as any).timestamp
        // 如果包含图像数据，打印其长度（不打印内容，避免刷屏）
        if ((data as any).image_data && typeof (data as any).image_data === 'string') {
          summary.image_data_len = (data as any).image_data.length
        }
        try {
          const json = JSON.stringify(data)
          console.log('[WS] send(object):', Object.keys(summary).length ? summary : json.length > 200 ? json.slice(0, 200) + ` ...(${json.length})` : json)
        } catch {
          console.log('[WS] send(object):', data)
        }
      }
    }

    if (typeof data === 'object' && !(data instanceof ArrayBuffer) && !(data instanceof Blob)) {
      this.ws.send(JSON.stringify(data)) // 对象自动转 JSON
    } else {
      this.ws.send(data)
    }
  }

  // 手动关闭
  close(code?: number, reason?: string) {
    this.manualClose = true
    this.stopHeartbeat()
    if (this.ws) {
      this.ws.close(code, reason)
      this.ws = null
    }
  }

  // 是否连接中
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN
  }
}
