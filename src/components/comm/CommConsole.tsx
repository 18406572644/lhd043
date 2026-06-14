import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, AlertTriangle, X, Zap, Satellite } from 'lucide-react';
import { SignalMeter } from './SignalMeter';
import { FrequencyTuner } from './FrequencyTuner';
import { MessageComposer } from './MessageComposer';
import { MessageLog } from './MessageLog';
import { VoiceComm } from './VoiceComm';
import { useCommStore } from '../../store/useCommStore';
import { NeonText } from '../effects/NeonText';

export const CommConsole = () => {
  const { activeInterference, acknowledgeInterference, simulateInterference, signalStatus } = useCommStore();
  const [showVoiceComm, setShowVoiceComm] = useState(false);
  const [showStatic, setShowStatic] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (activeInterference && activeInterference.severity !== 'mild') {
      setShowStatic(true);
    } else {
      setShowStatic(false);
    }
  }, [activeInterference]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !showStatic || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let animationId: number;
    const drawStatic = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        const intensity = signalStatus.interferenceLevel / 100;
        data[i] = value * intensity;
        data[i + 1] = value * intensity;
        data[i + 2] = value * intensity;
        data[i + 3] = 15 * intensity;
      }
      
      ctx.putImageData(imageData, 0, 0);
      animationId = requestAnimationFrame(drawStatic);
    };
    drawStatic();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [showStatic, signalStatus.interferenceLevel]);

  const getInterferenceIcon = (type: string) => {
    switch (type) {
      case 'solar_storm': return '🌞';
      case 'cosmic_rays': return '☄️';
      case 'atmospheric': return '🌫️';
      case 'equipment': return '⚙️';
      default: return '⚠️';
    }
  };

  const getInterferenceColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'border-red-500 bg-red-900/50';
      case 'moderate': return 'border-yellow-500 bg-yellow-900/50';
      case 'mild': return 'border-blue-500 bg-blue-900/50';
      default: return 'border-gray-500 bg-gray-900/50';
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-0 flex flex-col bg-gradient-to-b from-gray-950/50 via-gray-900/50 to-black/50 overflow-hidden">
      {showStatic && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-10 opacity-30"
        />
      )}

      <AnimatePresence>
        {activeInterference && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`sticky top-0 z-40 p-3 border-b-2 ${getInterferenceColor(activeInterference.severity)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-xl"
                >
                  {getInterferenceIcon(activeInterference.type)}
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="font-bold text-white text-sm">
                      {activeInterference.severity === 'severe' ? '严重' : activeInterference.severity === 'moderate' ? '中等' : '轻微'}
                      干扰警报
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-0.5">
                    {activeInterference.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-xs text-gray-400 hidden sm:block">
                  <div>受影响频率</div>
                  <div className="font-mono text-gray-300">
                    {activeInterference.affectedFrequencies[0].toFixed(0)} - {activeInterference.affectedFrequencies[1].toFixed(0)} MHz
                  </div>
                </div>
                <button
                  onClick={acknowledgeInterference}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title="确认"
                >
                  <X className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Satellite className="w-10 h-10 text-cyan-400" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border-2 border-cyan-400/30 rounded-full"
              />
            </div>
            <div>
              <NeonText color="#00d4ff" size="28px">
                星际通讯控制台
              </NeonText>
              <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                <Radio className="w-4 h-4" />
                <span>STELLARCOMM v2.4.1</span>
                <span className="text-gray-600">|</span>
                <span>深空网络</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => simulateInterference()}
              className="flex items-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-xs text-gray-300 transition-colors"
            >
              <Zap className="w-3 h-3" />
              <span>模拟干扰</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <SignalMeter />
            <FrequencyTuner />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <MessageLog />
            <MessageComposer onVoiceMode={() => setShowVoiceComm(true)} />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-900/50 border border-gray-700/50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-gray-500">当前频率</div>
              <div className="text-cyan-400 font-mono text-lg">
                {signalStatus.frequency.toFixed(1)} <span className="text-gray-400 text-sm">MHz</span>
              </div>
            </div>
            <div>
              <div className="text-gray-500">信号强度</div>
              <div className={`font-mono text-lg ${
                signalStatus.strength > 70 ? 'text-green-400' : signalStatus.strength > 40 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {signalStatus.strength.toFixed(0)} <span className="text-gray-400 text-sm">%</span>
              </div>
            </div>
            <div>
              <div className="text-gray-500">带宽</div>
              <div className="text-purple-400 font-mono text-lg">
                {signalStatus.bandwidth} <span className="text-gray-400 text-sm">kHz</span>
              </div>
            </div>
            <div>
              <div className="text-gray-500">干扰水平</div>
              <div className={`font-mono text-lg ${
                signalStatus.interferenceLevel > 60 ? 'text-red-400' : signalStatus.interferenceLevel > 30 ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {signalStatus.interferenceLevel.toFixed(0)} <span className="text-gray-400 text-sm">%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-600">
          <p>🛰️ 信号通过深空网络中继传输 | 数据加密: AES-256 | 纠错编码: LDPC</p>
        </div>
      </div>

      <AnimatePresence>
        {showVoiceComm && (
          <VoiceComm onClose={() => setShowVoiceComm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};
