export type TTSState = 'idle' | 'loading' | 'playing' | 'paused';

type TTSCallback = (state: TTSState, subtitle: string) => void;

class TTSManager {
  private state: TTSState = 'idle';
  private currentSubtitle: string = '';
  private listeners: Set<TTSCallback> = new Set();
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.synth = window.speechSynthesis;
    }
  }

  subscribe(callback: TTSCallback) {
    this.listeners.add(callback);
    callback(this.state, this.currentSubtitle);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.state, this.currentSubtitle));
  }

  async play(text: string) {
    this.stop();
    this.state = 'loading';
    this.currentSubtitle = text;
    this.notify();

    // 预留的后端 TTS 接口调用逻辑 (Port 3001 代理)
    /*
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onplay = () => { this.state = 'playing'; this.notify(); };
      audio.onended = () => { this.state = 'idle'; this.notify(); };
      audio.play();
      return;
    } catch (e) {
      console.warn("Backend TTS failed, falling back to browser TTS", e);
    }
    */

    // 降级方案：使用浏览器原生 TTS 以保证预览效果
    if (this.synth) {
      this.currentUtterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance.lang = 'zh-CN';
      this.currentUtterance.rate = 0.95; // 稍微放慢语速，更像老师讲课
      
      this.currentUtterance.onstart = () => {
        this.state = 'playing';
        this.notify();
      };
      
      this.currentUtterance.onend = () => {
        this.state = 'idle';
        this.notify();
      };

      this.currentUtterance.onerror = () => {
        this.state = 'idle';
        this.notify();
      };

      // 模拟一点网络延迟，让 Loading 状态可见
      setTimeout(() => {
        this.synth?.speak(this.currentUtterance!);
      }, 300);
    } else {
      // 如果不支持 TTS，直接显示字幕
      this.state = 'playing';
      this.notify();
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.state = 'idle';
    this.notify();
  }
}

export const ttsService = new TTSManager();
