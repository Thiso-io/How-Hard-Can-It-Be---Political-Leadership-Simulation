import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AudioSettings, TypingSoundMode } from '../types';

interface AudioContextType {
  settings: AudioSettings;
  updateSettings: (newSettings: Partial<AudioSettings>) => void;
  playUiSound: (type: 'click' | 'hover' | 'select' | 'open' | 'success' | 'error') => void;
  playTypingSound: () => void;
  initializeAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const DEFAULT_SETTINGS: AudioSettings = {
  masterVolume: 0.5,
  uiVolume: 0.6,
  ambienceVolume: 0.3,
  typingMode: TypingSoundMode.CLICK,
  isMuted: false,
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AudioSettings>(DEFAULT_SETTINGS);
  const audioCtx = useRef<AudioContext | null>(null);
  const ambienceNode = useRef<OscillatorNode | null>(null);
  const ambienceGain = useRef<GainNode | null>(null);

  // Initialize Audio Context (must be triggered by user interaction)
  const initializeAudio = () => {
    if (!audioCtx.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx.current = new AudioContextClass();
      startAmbience();
    } else if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }
  };

  // --- Sound Synthesis Engines ---

  const startAmbience = () => {
    if (!audioCtx.current) return;
    const ctx = audioCtx.current;

    // Create a low-frequency drone (Brown noise simulation via filtered saw)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.value = 50; // Low drone
    
    filter.type = 'lowpass';
    filter.frequency.value = 120;
    
    gain.gain.value = settings.isMuted ? 0 : (settings.masterVolume * settings.ambienceVolume * 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();

    ambienceNode.current = osc;
    ambienceGain.current = gain;
  };

  const updateAmbienceVolume = () => {
    if (ambienceGain.current && audioCtx.current) {
      const target = settings.isMuted ? 0 : (settings.masterVolume * settings.ambienceVolume * 0.05);
      ambienceGain.current.gain.setTargetAtTime(target, audioCtx.current.currentTime, 0.5);
    }
  };

  useEffect(() => {
    updateAmbienceVolume();
  }, [settings.masterVolume, settings.ambienceVolume, settings.isMuted]);

  const playUiSound = (type: 'click' | 'hover' | 'select' | 'open' | 'success' | 'error') => {
    if (!audioCtx.current || settings.isMuted || settings.uiVolume === 0) return;
    const ctx = audioCtx.current;
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const masterGain = settings.masterVolume * settings.uiVolume;

    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
      case 'click':
        // Sharp high-tech click
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);
        gain.gain.setValueAtTime(0.05 * masterGain, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;

      case 'hover':
        // Very subtle high tick
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        gain.gain.setValueAtTime(0.02 * masterGain, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.03);
        osc.start(t);
        osc.stop(t + 0.03);
        break;

      case 'select':
        // Thud/Confirmation
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.2);
        gain.gain.setValueAtTime(0.1 * masterGain, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
        break;

      case 'open':
        // Swoosh
        const noise = ctx.createBufferSource();
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < buffer.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        noise.buffer = buffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(200, t);
        noiseFilter.frequency.linearRampToValueAtTime(1000, t + 0.3);
        
        noise.connect(noiseFilter);
        noiseFilter.connect(gain);
        
        gain.gain.setValueAtTime(0.05 * masterGain, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.3);
        
        noise.start(t);
        noise.stop(t + 0.3);
        break;
        
      case 'error':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.linearRampToValueAtTime(100, t + 0.2);
        gain.gain.setValueAtTime(0.1 * masterGain, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
        break;
    }
  };

  const playTypingSound = () => {
    if (!audioCtx.current || settings.isMuted || settings.typingMode === TypingSoundMode.NONE) return;
    const ctx = audioCtx.current;
    const t = ctx.currentTime;
    const masterGain = settings.masterVolume * settings.uiVolume;

    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    if (settings.typingMode === TypingSoundMode.CLICK) {
      // Mechanical Click (Noise burst)
      const bufferSize = ctx.sampleRate * 0.03; // 30ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 1000;
      
      noise.connect(filter);
      filter.connect(gain);
      
      gain.gain.setValueAtTime(0.05 * masterGain, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      
      noise.start(t);
    } else {
      // Murmur (Filtered Saw)
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      // Randomize pitch slightly for speech-like effect
      osc.frequency.setValueAtTime(200 + Math.random() * 100, t);
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, t);

      osc.connect(filter);
      filter.connect(gain);

      gain.gain.setValueAtTime(0.02 * masterGain, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.05);

      osc.start(t);
      osc.stop(t + 0.05);
    }
  };

  const updateSettings = (newSettings: Partial<AudioSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AudioContext.Provider value={{
      settings,
      updateSettings,
      playUiSound,
      playTypingSound,
      initializeAudio
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
