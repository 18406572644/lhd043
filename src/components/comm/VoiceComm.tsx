import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, X, Radio, Waves } from 'lucide-react';
import { useCommStore } from '../../store/useCommStore';

interface VoiceCommProps {
  onClose: () => void;
}

export const VoiceComm = ({ onClose }: VoiceCommProps) => {
  const { sendMessage, selectedContact, signalStatus, activeInterference } = useCommStore();
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioLevels, setAudioLevels] = useState<number[]>([]);
  const [voiceText, setVoiceText] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      
      setIsRecording(true);
      setRecordDuration(0);
      setAudioLevels([]);
      
      timerRef.current = setInterval(() => {
        setRecordDuration(prev => prev + 1);
      }, 1000);
      
      const updateLevels = () => {
        if (analyserRef.current && isRecording) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevels(prev => [...prev.slice(-30), average / 255]);
          animationRef.current = requestAnimationFrame(updateLevels);
        }
      };
      updateLevels();
      
    } catch (err) {
      console.error('无法访问麦克风:', err);
      simulateVoiceRecording();
    }
  };

  const simulateVoiceRecording = () => {
    setIsRecording(true);
    setRecordDuration(0);
    
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
    
    timerRef.current = setInterval(() => {
      setRecordDuration(prev => prev + 1);
      setAudioLevels(prev => [...prev.slice(-30), Math.random() * 0.8 + 0.2]);
    }, 100);
  };

  const stopRecording = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsRecording(false);
    
    if (recordDuration > 0 && selectedContact) {
      const finalVoiceText = voiceText || `[语音消息] 时长 ${recordDuration} 秒`;
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
      }, 500);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 border border-cyan-500/50 rounded-2xl p-6 max-w-md w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Radio className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold text-cyan-300 font-mono">语音通讯</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6 text-center">
            <motion.div
              animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
              className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
                isRecording 
                  ? 'bg-red-500/20 border-4 border-red-500' 
                  : 'bg-gray-800 border-4 border-gray-600'
              }`}
            >
              {isRecording ? (
                <Mic className="w-16 h-16 text-red-500" />
              ) : (
                <MicOff className="w-16 h-16 text-gray-500" />
              )}
            </motion.div>

            <motion.div
              animate={isRecording ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.5 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-4 text-3xl font-mono font-bold text-white"
            >
              {formatDuration(recordDuration)}
            </motion.div>

            <div className="mt-2 text-sm text-gray-400">
              {isRecording ? '正在录音...' : '点击按钮开始录音'}
            </div>
          </div>

          <div className="h-20 bg-gray-800/50 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
            {isRecording && audioLevels.length > 0 ? (
              <div className="flex items-center gap-0.5 h-full px-2">
                {audioLevels.map((level, i) => (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{ height: `${Math.max(10, level * 100)}%` }}
                    transition={{ duration: 0.05 }}
                    className={`w-1 rounded-full ${
                      activeInterference 
                        ? 'bg-gradient-to-t from-yellow-500 to-red-500' 
                        : 'bg-gradient-to-t from-cyan-500 to-blue-500'
                    }`}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500">
                <Waves className="w-5 h-5" />
                <span className="text-sm">等待语音输入...</span>
              </div>
            )}
          </div>

          {activeInterference && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500/50 rounded-lg text-sm text-yellow-300"
            >
              ⚠️ 检测到{activeInterference.type === 'solar_storm' ? '太阳风暴' : '信号干扰'}，
              语音质量可能受到影响
              <div className="mt-1 text-xs text-yellow-400/70">
                建议调整频率以获得更好的音质
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>信号质量:</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div
                    key={bar}
                    className={`w-2 h-4 rounded-sm ${
                      bar <= Math.ceil(signalStatus.strength / 20)
                        ? 'bg-green-500'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono">{signalStatus.strength.toFixed(0)}%</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-mono text-lg transition-all ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-500 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <Send className="w-5 h-5" />
                  <span>停止并发送</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  <span>开始录音</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            语音消息将模拟宇宙背景噪音和传输延迟
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
