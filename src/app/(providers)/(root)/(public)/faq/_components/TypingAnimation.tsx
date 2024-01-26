'use client';
import React from 'react';
import {useEffect, useState} from 'react';

interface AnimationProps {
  text: string;
}

export default function TypingAnimation({text}: AnimationProps) {
  const [sequence, setSequence] = useState<string>('');
  const [textCount, setTextCount] = useState<number>(0);
  const [isTypingPaused, setIsTypingPaused] = useState<boolean>(false);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      if (isTypingPaused) {
        clearInterval(typingInterval);
        setTimeout(() => {
          setIsTypingPaused(false);
          setTextCount(0);
          setSequence('');
        }, 5000);
        return;
      }
      if (textCount >= text.length) {
        setIsTypingPaused(true);
        return;
      }

      const nextChar = text[textCount];
      setSequence(prev => prev + nextChar);

      if (nextChar === '\n') {
        setTextCount(prev => prev + 2);
      } else {
        setTextCount(prev => prev + 1);
      }
    }, 200);

    return () => clearInterval(typingInterval);
  }, [text, textCount, isTypingPaused]);
  return (
    <>
      <span className="text-3xl text-[#0051Ff]"> {sequence} </span>
    </>
  );
}
