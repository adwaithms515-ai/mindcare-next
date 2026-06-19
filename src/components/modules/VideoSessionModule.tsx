"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Maximize, Minimize, Settings, MessageSquare, AlertCircle } from "lucide-react";

interface VideoSessionModuleProps {
  onEndCall: () => void;
  remoteName: string;
}

export default function VideoSessionModule({ onEndCall, remoteName }: VideoSessionModuleProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionState, setConnectionState] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [timeElapsed, setTimeElapsed] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate connection delay
    const timer = setTimeout(() => {
      setConnectionState("connected");
    }, 2500);

    // Request local media
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.warn("Could not get media stream", err);
      });

    return () => {
      clearTimeout(timer);
      if (localVideoRef.current?.srcObject) {
        const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connectionState === "connected") {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [connectionState]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => console.warn(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setConnectionState("disconnected");
    setTimeout(onEndCall, 1500);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-black flex flex-col font-sans">
      
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
             {remoteName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">{remoteName}</h2>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${connectionState === 'connected' ? 'bg-emerald-500 animate-pulse' : connectionState === 'connecting' ? 'bg-amber-500 animate-bounce' : 'bg-red-500'}`} />
              <span className="text-white/70 text-sm font-medium capitalize">
                {connectionState === 'connected' ? formatTime(timeElapsed) : connectionState}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button onClick={toggleFullscreen} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-colors">
             {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
           </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        
        {/* Remote Video Placeholder */}
        {connectionState === "connected" ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900">
             <div className="w-48 h-48 rounded-full bg-indigo-500/20 border-4 border-indigo-500 flex items-center justify-center animate-pulse mb-6">
               <span className="text-7xl text-indigo-300">{remoteName.charAt(0).toUpperCase()}</span>
             </div>
             <p className="text-white/50 text-sm">Simulated Remote Video Stream</p>
           </div>
        ) : connectionState === "connecting" ? (
           <div className="text-center text-white">
             <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
             <p className="text-lg font-medium text-white/80">Connecting to secure room...</p>
           </div>
        ) : (
           <div className="text-center text-white">
             <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
               <PhoneOff className="w-10 h-10" />
             </div>
             <p className="text-xl font-bold text-white">Call Ended</p>
           </div>
        )}

        {/* Local Video Picture-in-Picture */}
        <div className={`absolute bottom-24 right-6 w-48 h-72 bg-zinc-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 transition-all ${isVideoOff ? 'flex items-center justify-center' : ''}`}>
          {isVideoOff ? (
             <div className="w-16 h-16 rounded-full bg-zinc-700 flex items-center justify-center text-white/50">
               <VideoOff className="w-8 h-8" />
             </div>
          ) : (
             <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
          )}
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white font-medium flex items-center gap-1 backdrop-blur-md">
             {isMuted && <MicOff className="w-3 h-3 text-red-400" />} You
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="h-24 bg-gradient-to-t from-black to-transparent w-full absolute bottom-0 left-0 flex items-center justify-center gap-4 pb-4">
        <button onClick={() => setIsMuted(!isMuted)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'}`}>
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        
        <button onClick={() => setIsVideoOff(!isVideoOff)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md'}`}>
          {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </button>

        <button onClick={handleEndCall} className="w-16 h-16 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white transition-all shadow-red-500/50 shadow-lg ml-4">
          <PhoneOff className="w-7 h-7" />
        </button>

        <button className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white backdrop-blur-md ml-4 transition-colors">
          <MessageSquare className="w-6 h-6" />
        </button>

        <button className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors">
          <Settings className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
}
