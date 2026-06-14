import { create } from 'zustand';
import type {
  CommState,
  CommMessage,
  Contact,
  MessagePriority,
  MessageType,
  InterferenceEvent
} from '../types';
import {
  contactsData,
  autoReplyTemplates,
  getRandomAutoReply,
  getRandomInterference,
  calculateDelayFromDistance
} from '../data/communications';
import { useTravelStore } from './useTravelStore';

const loadMessages = (): CommMessage[] => {
  try {
    const stored = localStorage.getItem('commMessages');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load messages:', e);
  }
  return [];
};

const saveMessages = (messages: CommMessage[]) => {
  try {
    localStorage.setItem('commMessages', JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save messages:', e);
  }
};

export const useCommStore = create<CommState>((set, get) => ({
  messages: loadMessages(),
  contacts: contactsData,
  selectedContact: contactsData[0],
  signalStatus: {
    strength: 85,
    frequency: 2110.5,
    bandwidth: 100,
    interferenceLevel: 5,
    solarStormActive: false
  },
  activeInterference: null,
  isTransmitting: false,
  currentTransmission: null,
  autoReplyTemplates,

  setSelectedContact: (contact: Contact | null) => {
    set({ selectedContact: contact });
  },

  sendMessage: (content: string, type: MessageType, priority: MessagePriority) => {
    const { selectedContact, signalStatus, activeInterference } = get();
    if (!selectedContact) return;

    const destination = useTravelStore.getState().destination;
    const distance = destination?.distance || 0.000024;
    
    let baseDelay = calculateDelayFromDistance(distance);
    
    const interferenceMultiplier = activeInterference 
      ? (activeInterference.severity === 'severe' ? 2.5 : activeInterference.severity === 'moderate' ? 1.5 : 1.2)
      : 1;
    
    const priorityMultiplier = priority === 'urgent' ? 0.7 : 1;
    const finalDelay = baseDelay * interferenceMultiplier * priorityMultiplier;
    
    const actualDelayForSimulation = Math.min(finalDelay, 30);

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newMessage: CommMessage = {
      id: messageId,
      type,
      direction: 'sent',
      contactId: selectedContact.id,
      content,
      priority,
      status: 'sending',
      timestamp: new Date().toISOString(),
      delaySeconds: finalDelay,
      signalStrength: signalStatus.strength,
      hasInterference: !!activeInterference,
      voiceData: type === 'voice' ? {
        duration: Math.random() * 30 + 5,
        noiseLevel: signalStatus.interferenceLevel / 100
      } : undefined
    };

    const updatedMessages = [newMessage, ...get().messages];
    set({ 
      messages: updatedMessages,
      isTransmitting: true,
      currentTransmission: {
        messageId,
        progress: 0,
        startTime: Date.now()
      }
    });
    saveMessages(updatedMessages);

    const updateProgress = () => {
      const transmission = get().currentTransmission;
      if (!transmission || transmission.messageId !== messageId) return;

      const elapsed = (Date.now() - transmission.startTime) / 1000;
      const progress = Math.min((elapsed / actualDelayForSimulation) * 100, 100);

      set({
        currentTransmission: {
          ...transmission,
          progress
        }
      });

      const currentMessages = get().messages;
      const msgIndex = currentMessages.findIndex(m => m.id === messageId);
      
      if (msgIndex >= 0) {
        const updated = [...currentMessages];
        if (progress >= 100) {
          updated[msgIndex] = { ...updated[msgIndex], status: 'delivered' };
          set({
            messages: updated,
            isTransmitting: false,
            currentTransmission: null
          });
          saveMessages(updated);

          if (signalStatus.strength > 10 || priority === 'urgent') {
            setTimeout(() => {
              const replyId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
              let replyContent = getRandomAutoReply();
              
              if (activeInterference && activeInterference.severity !== 'mild') {
                const chars = replyContent.split('');
                for (let i = 0; i < chars.length; i += 4) {
                  if (Math.random() < 0.3) {
                    chars[i] = '█';
                  }
                }
                replyContent = chars.join('');
              }

              const reply: CommMessage = {
                id: replyId,
                type: 'text',
                direction: 'received',
                contactId: selectedContact.id,
                content: replyContent,
                priority: 'normal',
                status: 'received',
                timestamp: new Date().toISOString(),
                delaySeconds: finalDelay,
                signalStrength: Math.max(0, signalStatus.strength - Math.random() * 20),
                hasInterference: !!activeInterference,
              };

              const withReply = [reply, ...get().messages];
              set({ messages: withReply });
              saveMessages(withReply);
            }, actualDelayForSimulation * 1000);
          }
        } else if (progress >= 30 && updated[msgIndex].status !== 'transmitting') {
          updated[msgIndex] = { ...updated[msgIndex], status: 'transmitting' };
          set({ messages: updated });
          saveMessages(updated);
        }
      }

      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  },

  adjustFrequency: (frequency: number) => {
    const { signalStatus, activeInterference } = get();
    let strength = signalStatus.strength;
    let interferenceLevel = signalStatus.interferenceLevel;

    if (activeInterference) {
      const [minFreq, maxFreq] = activeInterference.affectedFrequencies;
      if (frequency >= minFreq && frequency <= maxFreq) {
        strength = Math.max(10, strength - 30);
        interferenceLevel = Math.min(90, interferenceLevel + 30);
      } else {
        strength = Math.min(95, strength + 15);
        interferenceLevel = Math.max(5, interferenceLevel - 20);
      }
    } else {
      strength = 75 + Math.random() * 20;
      interferenceLevel = 5 + Math.random() * 15;
    }

    set({
      signalStatus: {
        ...signalStatus,
        frequency,
        strength,
        interferenceLevel
      }
    });
  },

  acknowledgeInterference: () => {
    set({ activeInterference: null });
  },

  clearMessages: () => {
    set({ messages: [] });
    localStorage.removeItem('commMessages');
  },

  simulateInterference: () => {
    const { activeInterference } = get();
    if (activeInterference) return;

    const interference = getRandomInterference();
    const event: InterferenceEvent = {
      id: `interference-${Date.now()}`,
      type: interference.type,
      severity: interference.severity,
      startTime: new Date().toISOString(),
      duration: interference.duration,
      affectedFrequencies: interference.affectedFrequencies,
      description: interference.description
    };

    set({
      activeInterference: event,
      signalStatus: {
        ...get().signalStatus,
        interferenceLevel: event.severity === 'severe' ? 80 : event.severity === 'moderate' ? 50 : 25,
        strength: Math.max(20, get().signalStatus.strength - (event.severity === 'severe' ? 40 : 20)),
        solarStormActive: event.type === 'solar_storm'
      }
    });

    setTimeout(() => {
      if (get().activeInterference?.id === event.id) {
        set({
          activeInterference: null,
          signalStatus: {
            ...get().signalStatus,
            interferenceLevel: 5 + Math.random() * 15,
            strength: 75 + Math.random() * 20,
            solarStormActive: false
          }
        });
      }
    }, event.duration);
  }
}));

setInterval(() => {
  if (Math.random() < 0.05 && !useCommStore.getState().activeInterference) {
    useCommStore.getState().simulateInterference();
  }
}, 60000);
