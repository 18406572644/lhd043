import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Clock, Check, CheckCheck, Radio, 
  AlertTriangle, Trash2, Volume2, VolumeX 
} from 'lucide-react';
import { useCommStore } from '../../store/useCommStore';
import { formatDelayTime } from '../../data/communications';
import dayjs from 'dayjs';
import { useState, useEffect, useRef } from 'react';

export const MessageLog = () => {
  const { messages, contacts, clearMessages, selectedContact, currentTransmission, signalStatus } = useCommStore();
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredMessages = selectedContact
    ? messages.filter(m => m.contactId === selectedContact.id)
    : messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getContact = (contactId: string) => {
    return contacts.find(c => c.id === contactId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return <Radio className="w-3 h-3 text-yellow-400 animate-pulse" />;
      case 'transmitting':
        return <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-green-400" />;
      case 'received':
        return <Check className="w-3 h-3 text-blue-400" />;
      case 'failed':
        return <AlertTriangle className="w-3 h-3 text-red-400" />;
      default:
        return <Clock className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sending': return '发送中';
      case 'transmitting': return '传输中';
      case 'delivered': return '已送达';
      case 'received': return '已接收';
      case 'failed': return '发送失败';
      default: return '未知';
    }
  };

  const playVoiceSimulation = (messageId: string, noiseLevel: number, duration: number) => {
    if (playingVoiceId === messageId) {
      setPlayingVoiceId(null);
      return;
    }
    setPlayingVoiceId(messageId);
    
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const noiseNode = audioContext.createBufferSource();
    
    const bufferSize = audioContext.sampleRate * duration;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * noiseLevel * 0.5;
    }
    noiseNode.buffer = noiseBuffer;
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800 + Math.random() * 400, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(400 + Math.random() * 200, audioContext.currentTime + duration / 2);
    oscillator.frequency.linearRampToValueAtTime(600 + Math.random() * 300, audioContext.currentTime + duration);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration - 0.1);
    
    const noiseGain = audioContext.createGain();
    noiseGain.gain.value = noiseLevel * 0.3;
    
    oscillator.connect(gainNode);
    noiseNode.connect(noiseGain);
    gainNode.connect(audioContext.destination);
    noiseGain.connect(audioContext.destination);
    
    oscillator.start();
    noiseNode.start();
    
    setTimeout(() => {
      oscillator.stop();
      noiseNode.stop();
      audioContext.close();
      if (playingVoiceId === messageId) {
        setPlayingVoiceId(null);
      }
    }, duration * 1000);
  };

  const sortedMessages = [...filteredMessages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-blue-500/30 rounded-lg flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-blue-500/20">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <span className="text-blue-300 font-mono text-sm">通讯日志</span>
          {selectedContact && (
            <span className="text-xs text-gray-400 ml-2">
              - {selectedContact.avatar} {selectedContact.name}
            </span>
          )}
        </div>
        <button
          onClick={clearMessages}
          className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
          title="清空消息"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {currentTransmission && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-4 py-2 bg-cyan-900/30 border-b border-cyan-500/20"
        >
          <div className="flex items-center justify-between text-xs">
            <span className="text-cyan-300">信号传输进度</span>
            <span className="text-cyan-400 font-mono">{currentTransmission.progress.toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-700 rounded-full mt-1 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={false}
              animate={{ width: `${currentTransmission.progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
        <AnimatePresence>
          {sortedMessages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-gray-500 py-8"
            >
              <Radio className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm">暂无通讯记录</p>
              <p className="text-xs mt-1">选择联系人并发送第一条消息</p>
            </motion.div>
          ) : (
            sortedMessages.map((message, index) => {
              const contact = getContact(message.contactId);
              const isSent = message.direction === 'sent';
              
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: isSent ? 20 : -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${isSent ? 'flex-row-reverse' : ''}`}>
                    <div className="text-2xl flex-shrink-0">
                      {isSent ? '👨‍🚀' : contact?.avatar || '👤'}
                    </div>
                    
                    <div>
                      <div className={`flex items-center gap-1 text-xs mb-1 ${isSent ? 'justify-end' : ''}`}>
                        <span className="text-gray-400">
                          {isSent ? '我' : contact?.name || '未知'}
                        </span>
                        {message.priority === 'urgent' && (
                          <span className="px-1 py-0.5 bg-red-600/50 rounded text-red-300">紧急</span>
                        )}
                        {message.hasInterference && (
                          <span className="px-1 py-0.5 bg-yellow-600/50 rounded text-yellow-300">干扰</span>
                        )}
                      </div>
                      
                      <div
                        className={`rounded-lg px-4 py-2 text-sm ${
                          isSent
                            ? 'bg-blue-600/80 text-white rounded-br-none'
                            : 'bg-gray-700/80 text-gray-100 rounded-bl-none'
                        }`}
                        style={{
                          filter: message.hasInterference ? `blur(${signalStatus.interferenceLevel / 50}px)` : 'none'
                        }}
                      >
                        {message.type === 'voice' && message.voiceData ? (
                          <button
                            onClick={() => playVoiceSimulation(
                              message.id, 
                              message.voiceData.noiseLevel, 
                              message.voiceData.duration
                            )}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                          >
                            {playingVoiceId === message.id ? (
                              <VolumeX className="w-4 h-4 text-red-400" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-green-400" />
                            )}
                            <span className="font-mono text-xs">
                              {playingVoiceId === message.id ? '播放中...' : '语音消息'}
                            </span>
                            <span className="text-xs text-gray-300">
                              {message.voiceData.duration.toFixed(0)}秒
                            </span>
                          </button>
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      
                      <div className={`flex items-center gap-2 text-xs mt-1 text-gray-500 ${isSent ? 'justify-end' : ''}`}>
                        <span>{dayjs(message.timestamp).format('HH:mm:ss')}</span>
                        <span>•</span>
                        <span>延迟 {formatDelayTime(message.delaySeconds)}</span>
                        <span>•</span>
                        <span>信号 {message.signalStrength.toFixed(0)}%</span>
                        <span>•</span>
                        {getStatusIcon(message.status)}
                        <span>{getStatusText(message.status)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
