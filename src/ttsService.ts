/**
 * Browser-side TTS Service
 * Calls Volcengine (ByteDance) TTS API via a Vite dev proxy / Express production proxy
 * to avoid CORS issues.
 *
 * API Docs: https://www.volcengine.com/docs/6561/1598757
 */

const TTS_PROXY_URL = '/api/tts';

export interface TtsResult {
  audioUrl: string;   // Object URL for the blob
  revoke: () => void; // Call this to free memory when done
}

let currentAudio: HTMLAudioElement | null = null;
let currentRevoke: (() => void) | null = null;

export function stopCurrentTts() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (currentRevoke) {
    currentRevoke();
    currentRevoke = null;
  }
}

/**
 * Generate TTS audio for the given text and return an HTMLAudioElement.
 * Automatically stops any previously playing TTS.
 */
export async function generateAndPlayTts(
  text: string,
  onTimeUpdate?: (currentTime: number, duration: number) => void,
  onEnded?: () => void
): Promise<HTMLAudioElement> {
  // Stop any existing TTS
  stopCurrentTts();

  const response = await fetch(TTS_PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`TTS API error ${response.status}: ${errText}`);
  }

  // The proxy returns the raw MP3 bytes
  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
  const audioUrl = URL.createObjectURL(blob);

  const revoke = () => URL.revokeObjectURL(audioUrl);
  currentRevoke = revoke;

  const audio = new Audio(audioUrl);
  currentAudio = audio;

  if (onTimeUpdate) {
    audio.addEventListener('timeupdate', () => {
      onTimeUpdate(audio.currentTime, audio.duration || 0);
    });
  }

  if (onEnded) {
    audio.addEventListener('ended', () => {
      onEnded();
      revoke();
      currentRevoke = null;
    });
  }

  await audio.play();
  return audio;
}
