import React, { useState, useEffect, useRef } from 'react';
import { useAudio } from '../contexts/AudioContext';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 15, onComplete, className }) => {
  const [displayedText, setDisplayedText] = useState('');
  const { playTypingSound } = useAudio();
  const index = useRef(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    // Reset if text changes completely (new message)
    if (text !== displayedText && index.current >= text.length) {
         // This is a new distinct message, reset
         index.current = 0;
         setDisplayedText('');
    }
  }, [text]);

  useEffect(() => {
    if (index.current < text.length) {
      timer.current = window.setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        playTypingSound();
        index.current++;
      }, speed);
    } else if (onComplete) {
      onComplete();
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [displayedText, text, speed, playTypingSound, onComplete]);

  return <span className={className}>{displayedText}</span>;
};