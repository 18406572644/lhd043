import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio, Waves, Zap } from 'lucide-react';
import { useCommStore } from '../../store/useCommStore';

export const FrequencyTuner = () => {
  const { signalStatus, adjustFrequency, activeInterference } = useCommStore();
  const [frequency, setFrequency] = useState(signalStatus.frequency);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setFrequency(signalStatus.frequency);
    }
  }, [signalStatus.frequency, isDragging]);

  const handleFrequencyChange = (value: number) => {
    setFrequency(value);
    adjustFrequency(value);
  };

  const presetFrequencies = [
    { label: 'UHF', value: 850, icon: '📡' },
    { label: 'S-Band', value: 2110, icon: '🛰️' },
    { label: 'X-Band', value: 8400, icon: '🚀' },
    { label: 'Ka-Band', value: 26500, icon: '⭐' }
  ];

  const getFrequencyColor = () => {
    if (!activeInterference) return 'text-cyan-400';
    const [minFreq, maxFreq] = activeInterference.affectedFrequencies;
    if (frequency >= minFreq && frequency <= maxFreq) return 'text-red-400';
    return 'text-green-400';
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Waves className="w-5 h-5 text-purple-400" />
          <span className="text-purple-300 font-mono text-sm">频率调节器</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Radio className="w-3 h-3" />
          <span>带宽: {signalStatus.bandwidth} kHz</span>
        </div>
      </div>

      <div className="relative mb-4">
        <div className="flex justify-center items-center mb-2">
          <motion.span
            key={frequency}
            initial={{ scale: 0.95, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-3xl font-mono font-bold ${getFrequencyColor()}`}
          >
            {frequency.toFixed(1)}
          </motion.span>
          <span className="text-gray-400 ml-2">MHz</span>
        </div>

        <div className="relative h-12 bg-gray-800 rounded-lg overflow-hidden">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `repeating-linear-gradient(90deg, transparent, transparent 9px, rgba(139, 92, 246, 0.5) 9px, rgba(139, 92, 246, 0.5) 10px)`
            }}
          />
          
          {activeInterference && (
            <div
              className="absolute top-0 bottom-0 bg-red-500/30 border-x border-red-500/50"
              style={{
                left: `${((activeInterference.affectedFrequencies[0] - 500) / 30000) * 100}%`,
                width: `${((activeInterference.affectedFrequencies[1] - activeInterference.affectedFrequencies[0]) / 30000) * 100}%`
              }}
            />
          )}

          <motion.div
            className="absolute top-0 bottom-0 w-1 bg-purple-400 shadow-lg shadow-purple-500/50"
            style={{
              left: `${((frequency - 500) / 30000) * 100}%`
            }}
          >
            <div className="absolute -top-1 -left-2 w-5 h-5 bg-purple-500 rounded-full border-2 border-white" />
          </motion.div>
        </div>

        <input
          type="range"
          min="500"
          max="30000"
          step="0.1"
          value={frequency}
          onChange={(e) => handleFrequencyChange(parseFloat(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {presetFrequencies.map((preset) => {
          const isInInterferenceZone = activeInterference && 
            preset.value >= activeInterference.affectedFrequencies[0] && 
            preset.value <= activeInterference.affectedFrequencies[1];
          
          return (
            <button
              key={preset.value}
              onClick={() => handleFrequencyChange(preset.value)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono transition-all ${
                Math.abs(frequency - preset.value) < 1
                  ? 'bg-purple-600 text-white'
                  : isInInterferenceZone
                    ? 'bg-red-900/50 text-red-300 hover:bg-red-800/50'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
              }`}
            >
              <span>{preset.icon}</span>
              <span>{preset.label}</span>
              <span className="text-gray-400">{preset.value}</span>
            </button>
          );
        })}
      </div>

      {activeInterference && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 p-2 bg-yellow-900/30 border border-yellow-500/50 rounded text-xs"
        >
          <div className="flex items-center gap-1 text-yellow-400 mb-1">
            <Zap className="w-3 h-3" />
            <span>受干扰频率范围</span>
          </div>
          <div className="text-gray-300 font-mono">
            {activeInterference.affectedFrequencies[0].toFixed(0)} - {activeInterference.affectedFrequencies[1].toFixed(0)} MHz
          </div>
        </motion.div>
      )}
    </div>
  );
};
