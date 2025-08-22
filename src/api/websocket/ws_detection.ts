import WebSocketClient from "./WebSocket";

export type DetectionItem = {
  class_id: number;
  detection_type: "wearing_hat" | "no_hat" | string;
  confidence: number;
  // bbox with x, y, width, height format
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export interface DetectionResult {
  type: "detection_result";
  detections: DetectionItem[];
  frame_count: number;
  session_id: string;
  camera_id: string;
  camera_name: string;
}

export type VideoFrameMessage = {
  type: "video_frame";
  frame: string; // base64 (jpeg) without data URL prefix
  //   timestamp: string;
  camera_id: string;
};

export default class WSDetection {
  private client: WebSocketClient;
  private onResult?: (result: DetectionResult) => void;

  constructor(wsPath: string, onResult?: (result: DetectionResult) => void) {
    this.onResult = onResult;
    this.client = new WebSocketClient(wsPath, {
      onMessage: (data) => this.handleMessage(data),
    });
  }

  connect() {
    this.client.connect();
  }

  isConnected() {
    return this.client.isConnected();
  }

  close() {
    this.client.close();
  }

  sendFrame(
    imageBase64Truncated: string,
    cameraId: string
    // timestamp?: string
  ) {
    const payload: VideoFrameMessage = {
      type: "video_frame",
      frame: imageBase64Truncated,
      //   timestamp: timestamp || new Date().toISOString(),
      camera_id: cameraId,
    };
    // 发送前打印摘要（仅长度，不打印具体 base64 内容）
    console.log("[WSDetection] sendFrame", {
      type: payload.type,

      id: payload.camera_id,
      //   timestamp: payload.timestamp,
      frame: payload.frame,
    });
    this.client.send(payload);
  }

  private handleMessage(data: string | ArrayBuffer | Blob) {
    if (typeof data === "string") {
      try {
        const obj = JSON.parse(data);
        if (obj && obj.type === "detection_result") {
          console.log("[WSDetection] recv:", obj);

          this.onResult?.(obj as DetectionResult);
        }
      } catch (e) {
        // not JSON or unexpected format, ignore
      }
    }
    // Binary/Blob messages are not used for now
  }
}
