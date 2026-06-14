import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, X, Radio, Waves, AlertCircle } from 'lucide-react';
import { useCommStore } from '../../store/useCommStore';

interface VoiceCommProps {
  onClose: () => void;
}

type RecordingState = 'idle' | 'requesting' | 'recording' | 'stopped' | 'error';

export const VoiceComm = ({ onClose }: VoiceCommProps) => {
  const { sendMessage, selectedContact, signalStatus, activeInterference } = useCommStore();
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioLevels, setAudioLevels] = useState<number[]>([]);
  const [voiceText, setVoiceText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [permissionState, setPermissionState] = useState<PermissionState | 'unknown'>('unknown');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const isRecordingRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const checkSupport = () => {
      const hasMediaDevices = typeof navigator !== 'undefined' && navigator.mediaDevices;
      const hasGetUserMedia = hasMediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function';
      const hasMediaRecorder = typeof MediaRecorder !== 'undefined';
      const hasAudioContext = typeof AudioContext !== 'undefined' || 
        typeof (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext !== 'undefined';
      
      if (!hasGetUserMedia || !hasMediaRecorder || !hasAudioContext) {
        setIsSupported(false);
        setErrorMessage('您的浏览器不支持语音录制功能');
      }
    };

    const checkPermission = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setPermissionState(result.state);
          result.addEventListener('change', () => {
            setPermissionState(result.state);
          });
        }
      } catch (e) {
        setPermissionState('unknown');
      }
    };

    checkSupport();
    checkPermission();
  }, []);

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('Failed to stop MediaRecorder:', e);
      }
      mediaRecorderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try { track.stop(); } catch (e) { console.warn('Failed to stop track:', e); }
      });
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.warn('Failed to close AudioContext:', e);
      }
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    isRecordingRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const updateAudioLevels = useCallback(() => {
    if (!isRecordingRef.current || !analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    
    setAudioLevels(prev => {
      const next = [...prev, average / 255];
      return next.slice(-40);
    });

    animationRef.current = requestAnimationFrame(updateAudioLevels);
  }, []);

  const startRecording = async () => {
    if (!isSupported) {
      simulateVoiceRecording();
      return;
    }

    setRecordingState('requesting');
    setErrorMessage('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;

      const AudioContextClass = AudioContext || 
        (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 128;
      analyserRef.current.smoothingTimeConstant = 0.8;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      try {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();
      } catch (e) {
        console.warn('MediaRecorder init failed, using simulation:', e);
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        simulateVoiceRecording();
        return;
      }

      isRecordingRef.current = true;
      startTimeRef.current = Date.now();
      setRecordingState('recording');
      setRecordDuration(0);
      setAudioLevels([]);
      setVoiceText('');

      timerRef.current = setInterval(() => {
        if (isRecordingRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setRecordDuration(elapsed);
        }
      }, 1000);

      updateAudioLevels();
      setPermissionState('granted');

    } catch (err) {
      console.error('无法访问麦克风:', err);
      setRecordingState('error');
      
      let errorMsg = '无法访问麦克风';
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMsg = '麦克风权限被拒绝，请在浏览器设置中允许访问麦克风';
          setPermissionState('denied');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMsg = '未找到麦克风设备';
        } else if (err.name === 'NotReadableError') {
          errorMsg = '麦克风被其他应用占用';
        } else {
          errorMsg = err.message;
        }
      }
      setErrorMessage(errorMsg);
      
      setTimeout(() => {
        if (isRecordingRef.current === false) {
          simulateVoiceRecording();
        }
      }, 1500);
    }
  };

  const simulateVoiceRecording = () => {
    isRecordingRef.current = true;
    startTimeRef.current = Date.now();
    setRecordingState('recording');
    setRecordDuration(0);
    setAudioLevels([]);
    setErrorMessage('');
    
    const phrases = [
      '这里是星际探险号，呼叫地球，收到请回答。',
      '爸爸妈妈，我看到了火星的奥林匹斯山，太壮观了！',
      '地面控制中心，任务进展顺利，一切正常。',
      '嘿，朋友，等我回去给你带一块火星陨石！',
      '这里的星空和地球上的完全不一样，太美了。',
      '紧急呼叫！我们遇到了太阳风暴，信号不稳定。',
      '我在木卫二的冰面上，脚下可能就是外星海洋！'
    ];
    setVoiceText(phrases[Math.floor(Math.random() * phrases.length)]);
    
    let level = 0.5;
    timerRef.current = setInterval(() => {
      if (isRecordingRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRecordDuration(elapsed);
        
        level = Math.max(0.1, Math.min(0.9, level + (Math.random() - 0.5) * 0.3));
        setAudioLevels(prev => {
          const next = [...prev, level];
          return next.slice(-40);
        });
      }
    }, 100);
  };

  const stopRecording = useCallback(() => {
    if (!isRecordingRef.current) return;
    
    isRecordingRef.current = false;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('Failed to stop MediaRecorder:', e);
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try { track.stop(); } catch (e) { console.warn('Failed to stop track:', e); }
      });
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.warn('Failed to close AudioContext:', e);
      }
    }

    setRecordingState('stopped');
    
    const finalDuration = recordDuration || Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    if (finalDuration > 0 && selectedContact) {
      const finalVoiceText = voiceText || `[语音消息] 时长 ${finalDuration} 秒`;
      let processedText = finalVoiceText;
      
      if (activeInterference && activeInterference.severity !== 'mild') {
        const chars = processedText.split('');
        for (let i = 0; i < chars.length; i += 3) {
          if (Math.random() < 0.4) {
            chars[i] = '█';
          }
        }
        processedText = chars.join('');
      }
      
      setTimeout(() => {
        sendMessage(processedText, 'voice', 'normal');
        onClose();
      }, 800);
    }
  }, [recordDuration, voiceText, selectedContact, activeInterference, sendMessage, onClose]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isRecording = recordingState === 'recording';
  const isRequesting = recordingState === 'requesting';
  const hasError = recordingState === 'error';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 border-2 border-cyan-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-cyan-500/20"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Radio className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold text-cyan-300 font-mono">语音通讯</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {permissionState === 'denied' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-amber-900/30 border border-amber-500/50 rounded-lg"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-300 font-medium">麦克风权限被拒绝</p>
                  <p className="text-xs text-amber-200/70 mt-1">
                    请在浏览器地址栏的权限设置中允许访问麦克风，或使用模拟模式
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {hasError && errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{errorMessage}</p>
              </div>
            </motion.div>
          )}

          <div className="mb-6 text-center">
            <motion.div
              animate={isRecording ? { 
                scale: [1, 1.05, 1],
                boxShadow: [
                  '0 0 20px rgba(239, 68, 68, 0.3)',
                  '0 0 40px rgba(239, 68, 68, 0.6)',
                  '0 0 20px rgba(239, 68, 68, 0.3)'
                ]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center relative ${
                isRecording 
                  ? 'bg-red-500/20 border-4 border-red-500' 
                  : isRequesting
                    ? 'bg-yellow-500/20 border-4 border-yellow-500'
                    : 'bg-gray-800 border-4 border-gray-600'
              }`}
            >
              {isRecording ? (
                <Mic className="w-16 h-16 text-red-500" />
              ) : isRequesting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Radio className="w-16 h-16 text-yellow-500" />
                </motion.div>
              ) : (
                <MicOff className="w-16 h-16 text-gray-500" />
              )}
              
              {isRecording && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full"
                />
              )}
            </motion.div>

            <motion.div
              animate={isRecording ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.6 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-4 text-4xl font-mono font-bold text-white tracking-wider"
            >
              {formatDuration(recordDuration)}
            </motion.div>

            <div className="mt-2 text-sm text-gray-400">
              {isRequesting ? '正在请求麦克风权限...' :
               isRecording ? '正在录音，点击按钮结束' :
               hasError ? '点击重试或使用模拟模式' :
               '点击按钮开始录音'}
            </div>
          </div>

          <div className="h-20 bg-gray-800/70 rounded-xl mb-6 flex items-center justify-center overflow-hidden border border-gray-700/50">
            {isRecording && audioLevels.length > 0 ? (
              <div className="flex items-center gap-0.5 h-full px-3">
                {audioLevels.map((level, i) => (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{ 
                      height: `${Math.max(8, level * 100)}%`,
                      opacity: 0.8 + level * 0.2
                    }}
                    transition={{ duration: 0.05 }}
                    className={`w-1 rounded-full ${
                      activeInterference 
                        ? 'bg-gradient-to-t from-yellow-500 to-red-500' 
                        : 'bg-gradient-to-t from-cyan-500 to-blue-400'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <Waves className="w-5 h-5" />
                <span className="text-sm">
                  {isRequesting ? '等待权限授权...' : '等待语音输入...'}
                </span>
              </div>
            )}
          </div>

          {activeInterference && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500/50 rounded-lg"
            >
              <div className="flex items-center gap-2 text-yellow-300 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>
                  检测到{activeInterference.type === 'solar_storm' ? '太阳风暴' : '信号干扰'}
                </span>
              </div>
              <p className="text-xs text-yellow-400/70 mt-1">
                语音质量可能受影响，建议调整频率以获得更好音质
              </p>
            </motion.div>
          )}

          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>信号质量:</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div
                    key={bar}
                    className={`w-2 h-4 rounded-sm transition-all duration-300 ${
                      bar <= Math.ceil(signalStatus.strength / 20)
                        ? signalStatus.strength > 60 
                          ? 'bg-green-500' 
                          : signalStatus.strength > 30 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                        : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono">{signalStatus.strength.toFixed(0)}%</span>
            </div>
            <div className="text-xs text-gray-500">
              模式: {isSupported ? '真实录音' : '模拟'}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isRequesting}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-mono text-lg transition-all ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : isRequesting
                    ? 'bg-yellow-600 text-white cursor-wait'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50'
              } disabled:opacity-70`}
            >
              {isRecording ? (
                <>
                  <Send className="w-5 h-5" />
                  <span>停止并发送</span>
                </>
              ) : isRequesting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Radio className="w-5 h-5" />
                  </motion.div>
                  <span>请求中...</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>开始录音</span>
                </>
              )}
            </button>
          </div>

          {!isSupported && (
            <button
              onClick={simulateVoiceRecording}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
            >
              <Waves className="w-4 h-4" />
              <span>使用模拟录音模式</span>
            </button>
          )}

          <div className="mt-4 text-center text-xs text-gray-500">
            语音消息将模拟宇宙背景噪音和传输延迟效果
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
