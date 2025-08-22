import WSDetection from "./ws_detection";
import type { DetectionResult } from "./ws_detection";

export class CameraController {
  private ws: WSDetection;
  private cameraId: string;
  private videoEl: HTMLVideoElement | null = null;
  private sendTimer: number | null = null;
  private offscreen: HTMLCanvasElement;
  private intervalMs = 500; // 默认 2 FPS
  private onDetections?: (result: DetectionResult) => void;

  constructor(
    cameraId: string,
    onDetections?: (result: DetectionResult) => void
  ) {
    this.cameraId = cameraId;
    this.onDetections = onDetections;
    const wsPath = `/ws/safety-hat-detection/${cameraId}/`;
    this.ws = new WSDetection(wsPath, (result) => {
      // 只处理匹配当前摄像头ID的检测结果
      if (result.camera_id === this.cameraId) {
        this.onDetections?.(result);
      }
    });
    this.offscreen = document.createElement("canvas");
  }

  connect() {
    this.ws.connect();
  }

  disconnect() {
    this.stopDetection();
    this.ws.close();
  }

  setSource(video: HTMLVideoElement) {
    this.videoEl = video;
  }

  setFrequency(fps: number) {
    const ms = Math.max(50, Math.floor(1000 / Math.max(0.1, fps)));
    this.intervalMs = ms;
    if (this.sendTimer) {
      this.startDetection(); // 重启以应用新频率
    }
  }

  startDetection() {
    if (!this.videoEl) return;
    if (!this.ws.isConnected()) this.ws.connect();
    if (this.sendTimer) window.clearInterval(this.sendTimer);

    this.sendTimer = window.setInterval(() => {
      this.captureAndSend();
    }, this.intervalMs);
  }

  stopDetection() {
    if (this.sendTimer) {
      window.clearInterval(this.sendTimer);
      this.sendTimer = null;
    }
  }

  private captureAndSend() {
    const video = this.videoEl;
    if (!video) return;
    if (video.readyState < 2) return; // metadata 尚未就绪

    // 确保 WS 已连接，若未连接则尝试连接并跳过本次发送
    if (!this.ws.isConnected()) {
      console.warn(
        "[CameraController] WS 未连接，本次跳过并尝试连接",
        this.cameraId
      );
      this.ws.connect();
      return;
    }

    const w = video.videoWidth;
    const h = video.videoHeight;
    if (w === 0 || h === 0) return;

    this.offscreen.width = w;
    this.offscreen.height = h;
    const ctx = this.offscreen.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);

    // 导出为 jpeg base64（去掉 dataURL 前缀）
    const quality = 0.7;
    const dataUrl = this.offscreen.toDataURL("image/jpeg", quality);
    const base64 = dataUrl.split(",")[1] || "";
    console.log("[CameraController] captured frame", {
      camera_id: this.cameraId,
      w,
      h,
      quality,
      base64_len: base64.length,
    });
    this.ws.sendFrame(base64, this.cameraId);
  }
}

export const formatCameraId = (index: number) =>
  `CAM${String(index).padStart(3, "0")}`;
