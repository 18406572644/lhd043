import { motion } from 'framer-motion';
import { Radio, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { useCommStore } from '../../store/useCommStore';

export const SignalMeter = () => {
  const { signalStatus, activeInterference } = useCommStore();
  const { strength, interferenceLevel, solarStormActive } = signalStatus;

  const bars = Array.from({ length: 10 }, (_, i) => i * 10);
  const getBarColor = (value: number) => {
    if (value > strength) return 'bg-gray-700';
    if (strength > 70) return 'bg-green-500';
    if (strength > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (solarStormActive) return '太阳风暴中';
    if (strength > 80) return '信号极佳';
    if (strength > 60) return '信号良好';
    if (strength > 40) return '信号一般';
    if (strength > 20) return '信号较弱';
    return '信号极差';
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-cyan-400" />
          <span className="text-cyan-300 font-mono text-sm">信号状态</span>
        </div>
        {activeInterference && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center gap-1 text-yellow-400 text-xs"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>干扰中</span>
          </motion.div>
        )}
      </div>

      <div className="flex items-end gap-1 h-16 mb-3">
        {bars.map((bar, index) => (
          <motion.div
            key={index}
            className={`flex-1 rounded-t ${getBarColor(bar + 5)}`}
            initial={false}
            animate={{
              height: `${bar + 5}%`,
              opacity: bar < strength ? 1 : 0.3
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {strength > 50 ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span className={`font-mono text-sm ${
            strength > 70 ? 'text-green-400' : strength > 40 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {strength.toFixed(0)}%
          </span>
        </div>
        <span className="text-gray-400 text-xs">{getStatusText()}</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">干扰水平</span>
          <span className={`font-mono ${
            interferenceLevel > 60 ? 'text-red-400' : interferenceLevel > 30 ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {interferenceLevel.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${
              interferenceLevel > 60 ? 'bg-red-500' : interferenceLevel > 30 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            initial={false}
            animate={{ width: `${interferenceLevel}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {solarStormActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-red-900/30 border border-red-500/50 rounded text-xs text-red-300"
        >
          ⚠️ 太阳风暴警告：通讯可能受到严重影响
        </motion.div>
      )}
    </div>
  );
};
