import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, AlertCircle, Clock, Mic, Users } from 'lucide-react';
import { useCommStore } from '../../store/useCommStore';
import { useTravelStore } from '../../store/useTravelStore';
import { formatDelayTime, calculateDelayFromDistance, formatDistance } from '../../data/communications';
import type { MessagePriority, MessageType } from '../../types';

interface MessageComposerProps {
  onVoiceMode: () => void;
}

export const MessageComposer = ({ onVoiceMode }: MessageComposerProps) => {
  const { selectedContact, sendMessage, isTransmitting, contacts, setSelectedContact } = useCommStore();
  const { destination } = useTravelStore();
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<MessagePriority>('normal');
  const [messageType, setMessageType] = useState<MessageType>('text');

  const distance = destination?.distance || 0.000024;
  const estimatedDelay = calculateDelayFromDistance(distance);

  const handleSend = () => {
    if (!message.trim() || isTransmitting || !selectedContact) return;
    sendMessage(message.trim(), messageType, priority);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-green-400" />
          <span className="text-green-300 font-mono text-sm">通讯对象</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span>预计延迟: {formatDelayTime(estimatedDelay)}</span>
        </div>
      </div>

      <div className="mb-3">
        <select
          value={selectedContact?.id || ''}
          onChange={(e) => {
            const contact = contacts.find(c => c.id === e.target.value);
            setSelectedContact(contact || null);
          }}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-green-500 focus:outline-none"
        >
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.avatar} {contact.name} ({contact.relationship})
              {contact.status === 'online' ? ' - 在线' : contact.status === 'busy' ? ' - 忙碌' : ' - 离线'}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setMessageType('text')}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-mono transition-all ${
              messageType === 'text'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            <span>📝</span>
            <span>文字消息</span>
          </button>
          <button
            onClick={onVoiceMode}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-mono transition-all ${
              messageType === 'voice'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>语音消息</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPriority('normal')}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-mono transition-all ${
              priority === 'normal'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            <span>📡</span>
            <span>普通频道</span>
          </button>
          <button
            onClick={() => setPriority('urgent')}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded text-xs font-mono transition-all ${
              priority === 'urgent'
                ? 'bg-red-600 text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            <span>紧急频道</span>
          </button>
        </div>
      </div>

      <div className="mb-2 text-xs text-gray-400 flex items-center gap-2">
        <span>📍 当前位置:</span>
        <span className="text-cyan-400">
          {destination ? `${destination.name} (${formatDistance(distance)})` : '近地轨道'}
        </span>
      </div>

      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入要发送的消息..."
          disabled={isTransmitting}
          rows={3}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:border-green-500 focus:outline-none resize-none disabled:opacity-50"
        />
        
        {isTransmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gray-900/80 rounded-lg flex flex-col items-center justify-center"
          >
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Send className="w-5 h-5" />
              </motion.div>
              <span className="font-mono">信号传输中...</span>
            </div>
            <div className="w-3/4 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
              />
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-gray-400">
          {message.length}/500 字符
        </div>
        <button
          onClick={handleSend}
          disabled={!message.trim() || isTransmitting || !selectedContact}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-mono transition-colors"
        >
          <Send className="w-4 h-4" />
          <span>发送信号</span>
        </button>
      </div>

      {priority === 'urgent' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-red-900/30 border border-red-500/50 rounded text-xs text-red-300"
        >
          ⚡ 紧急频道已启用：带宽占用 x3，优先级最高，延迟降低 30%
        </motion.div>
      )}
    </div>
  );
};
