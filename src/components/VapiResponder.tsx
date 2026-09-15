'use client';

import React, { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { MessageSquare, X, Send, Loader2, Mic, Volume2 } from 'lucide-react';

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '';
const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '';

let vapiInstance: Vapi | null = null;
const getVapiInstance = () => {
  if (!vapiInstance && typeof window !== 'undefined' && VAPI_PUBLIC_KEY) {
    vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
  }
  return vapiInstance;
};

export default function VapiResponder() {
  const [activeMode, setActiveMode] = useState<'idle' | 'call' | 'chat'>('idle');
  const [connecting, setConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // SEPARATE STATES FOR CHAT AND CALL
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [callTranscripts, setCallTranscripts] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');

  const lastCallMsgRef = useRef<string>('');

  useEffect(() => {
    const vapi = getVapiInstance();
    if (!vapi) return;

    const handleCallStart = () => {
      setConnecting(false);
    };

    const handleCallEnd = () => {
      setConnecting(false);
      setActiveMode((prev) => (prev === 'call' ? 'idle' : prev));
    };

    const handleMessage = (message: any) => {
      // ONLY append to voice transcripts IF in call mode
      if (activeMode === 'call' && message.type === 'transcript' && message.transcriptType === 'final') {
        const text = message.transcript?.trim();
        if (text && text !== lastCallMsgRef.current) {
          lastCallMsgRef.current = text;
          setCallTranscripts((prev) => [...prev, { role: message.role, content: text }]);
        }
      }
    };

    const handleError = (err: any) => {
      const errString = JSON.stringify(err || {});
      if (errString.includes('ejected') || errString.includes('Meeting has ended')) {
        setConnecting(false);
        return;
      }
      console.warn('Vapi Voice Warning:', err);
      setConnecting(false);
    };

    vapi.on('call-start', handleCallStart);
    vapi.on('call-end', handleCallEnd);
    vapi.on('message', handleMessage);
    vapi.on('error', handleError);

    return () => {
      vapi.off('call-start', handleCallStart);
      vapi.off('call-end', handleCallEnd);
      vapi.off('message', handleMessage);
      vapi.off('error', handleError);
    };
  }, [activeMode]);

  // VOICE CALL HANDLERS
  const handleStartCall = async () => {
    const vapi = getVapiInstance();
    if (!vapi) return;

    setConnecting(true);
    setActiveMode('call');
    try {
      await vapi.start(VAPI_ASSISTANT_ID);
    } catch (err) {
      console.error('Call initialization failed:', err);
      setConnecting(false);
      setActiveMode('idle');
    }
  };

  const handleEndCall = () => {
    const vapi = getVapiInstance();
    if (vapi) {
      vapi.stop();
    }
    setActiveMode('idle');
  };

  // SILENT TEXT CHAT HANDLER
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage = input.trim();

    // Optimistically add user message to chatMessages
    setChatMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      const botReply = data.reply || 'No response received.';

      // Append assistant reply ONLY to chatMessages
      setChatMessages((prev) => [...prev, { role: 'assistant', content: botReply }]);
    } catch (err) {
      console.error('API Chat Error:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I am having trouble connecting right now. Please try again.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Buttons */}
      {activeMode === 'idle' && (
        <div className="flex items-center gap-4">
          {/* VOICE CALL BUTTON */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-white/20 blur-md pointer-events-none group-hover:bg-white/30 transition-all" />
            <button
              onClick={handleStartCall}
              disabled={connecting}
              aria-label="Start Voice Call"
              className="relative w-14 h-14 bg-[#121212] border-2 border-[#FAFAFA] rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-xl"
            >
              {connecting ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#FAFAFA]" />
              ) : (
                <div className="relative w-9 h-9 flex items-center justify-center">
                  <div className="absolute -top-1 w-8 h-5 border-t-2 border-l-2 border-r-2 border-[#FAFAFA] rounded-t-full" />
                  <div className="w-7 h-6 bg-[#FAFAFA] rounded-lg p-0.5 flex flex-col justify-between shadow-inner relative z-10">
                    <div className="w-full h-full bg-[#121212] rounded-[4px] flex items-center justify-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-[#FAFAFA] rounded-full animate-pulse" />
                      <span className="w-1.5 h-1.5 bg-[#FAFAFA] rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="absolute left-0.5 top-2.5 w-1.5 h-3 bg-[#FAFAFA] rounded-sm z-20" />
                  <div className="absolute right-0.5 top-2.5 w-1.5 h-3 bg-[#FAFAFA] rounded-sm z-20" />
                  <div className="absolute left-1 bottom-1 w-4 h-2 border-b-2 border-l-2 border-[#FAFAFA] rounded-bl-md z-20" />
                </div>
              )}
            </button>
          </div>

          {/* CHAT BOT BUTTON */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-white/20 blur-md pointer-events-none group-hover:bg-white/30 transition-all" />
            <button
              onClick={() => setActiveMode('chat')}
              aria-label="Open Silent Chat"
              className="relative w-14 h-14 bg-[#121212] border-2 border-[#FAFAFA] rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 shadow-xl"
            >
              <div className="relative w-9 h-9 flex items-center justify-center">
                <div className="absolute -bottom-1 -right-0.5 w-3 h-3 bg-[#FAFAFA] rotate-45 rounded-xs" />
                <div className="w-7 h-6 bg-[#FAFAFA] rounded-lg p-0.5 flex flex-col justify-between shadow-inner relative z-10">
                  <div className="w-full bg-[#121212] rounded-[4px] h-full flex flex-col items-center justify-center gap-0.5">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#FAFAFA] rounded-full" />
                      <span className="w-1.5 h-1.5 bg-[#FAFAFA] rounded-full" />
                    </div>
                    <div className="w-2.5 h-0.5 bg-[#FAFAFA] rounded-full" />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 bg-[#121212] border border-[#FAFAFA] p-0.5 rounded-full z-20">
                  <MessageSquare className="w-2.5 h-2.5 text-[#FAFAFA] fill-current" />
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* VOICE CALL HUD */}
      {activeMode === 'call' && (
        <div className="w-80 bg-[#121212]/95 border border-[#2A2A2A] rounded-3xl p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] tracking-widest text-[#FAFAFA] uppercase font-semibold">
              KULT VOICE RESPONDER
            </span>
            <button
              onClick={handleEndCall}
              className="text-[#FAFAFA]/40 hover:text-[#FAFAFA] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div className="absolute w-24 h-24 rounded-full bg-white/10 animate-ping" />
            <div className="absolute w-20 h-20 rounded-full bg-white/15 blur-sm" />
            <div className="relative w-16 h-16 rounded-full bg-[#FAFAFA] text-[#121212] flex items-center justify-center shadow-[0_0_25px_rgba(250,250,250,0.3)]">
              <Mic className="w-7 h-7 text-[#121212] animate-bounce" />
            </div>
          </div>

          <div className="text-center space-y-1">
            <p className="text-xs font-medium text-[#FAFAFA] tracking-wide">
              {connecting ? 'Connecting AI...' : 'Voice Connected'}
            </p>
            <p className="text-[10px] text-[#FAFAFA]/50">Speak naturally with Kult Agent</p>
          </div>

          <button
            onClick={handleEndCall}
            className="w-full py-3 bg-[#FAFAFA] text-[#121212] font-semibold text-xs tracking-wider rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 active:scale-95 transition-all shadow-lg"
          >
            <span>END CALL</span>
          </button>
        </div>
      )}

      {/* SILENT TEXT CHAT DRAWER */}
      {activeMode === 'chat' && (
        <div className="w-80 sm:w-96 h-[480px] bg-[#121212]/95 border border-[#2A2A2A] rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl transition-all duration-300">
          <div className="p-4 bg-[#1A1A1A]/80 border-b border-[#2A2A2A] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FAFAFA] shadow-[0_0_8px_#FAFAFA]" />
              <div>
                <h3 className="text-xs font-semibold text-[#FAFAFA] tracking-wider uppercase">
                  KULT AI ASSISTANT
                </h3>
                <span className="text-[9px] text-[#FAFAFA]/60 tracking-wide uppercase block font-medium">
                  SILENT CHAT MODE
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveMode('idle')}
              className="p-1.5 rounded-full text-[#FAFAFA]/60 hover:text-[#FAFAFA] hover:bg-[#2A2A2A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* CHAT MESSAGES DISPLAY */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs scrollbar-thin scrollbar-thumb-[#2A2A2A]">
            {chatMessages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-60">
                <Volume2 className="w-8 h-8 text-[#FAFAFA] stroke-[1.5]" />
                <p className="text-[11px] text-[#FAFAFA]/70 tracking-wide">
                  Type your query below to start chatting...
                </p>
              </div>
            )}

            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed text-xs ${
                  msg.role === 'user'
                    ? 'ml-auto bg-[#FAFAFA] text-[#121212] font-semibold rounded-br-xs shadow-md'
                    : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#FAFAFA] rounded-bl-xs'
                }`}
              >
                {msg.content}
              </div>
            ))}

            {isSending && (
              <div className="flex items-center gap-2.5 text-[10px] text-[#FAFAFA] bg-[#1A1A1A] border border-[#2A2A2A] w-fit px-3 py-2 rounded-xl">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="tracking-wide">...</span>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSendChatMessage}
            className="p-3 border-t border-[#2A2A2A] bg-[#1A1A1A]/80 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
              className="flex-1 bg-[#121212] border border-[#2A2A2A] rounded-xl px-3.5 py-2.5 text-xs text-[#FAFAFA] placeholder-[#666666] focus:outline-none focus:border-[#FAFAFA]/70 transition-all"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="bg-[#FAFAFA] text-[#121212] p-2.5 rounded-xl hover:bg-white active:scale-95 disabled:opacity-40 transition-all"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}