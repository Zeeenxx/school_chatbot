import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface TextToSpeechProps {
  text: string;
  autoPlay?: boolean;
}

const TTSContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const TTSButton = styled.button<{ isPlaying: boolean }>`
  background: ${props => props.isPlaying ? '#e74c3c' : '#722f37'};
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.isPlaying ? '#c0392b' : '#8b3a42'};
    transform: scale(1.05);
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
  }
`;

const TTSStatus = styled.span`
  font-size: 0.8rem;
  color: #666;
`;

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if Speech Synthesis is supported
    if ('speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  useEffect(() => {
    if (text && isSupported) {
      // Clean up previous utterance
      speechSynthesis.cancel();

      // Create new utterance
      const newUtterance = new SpeechSynthesisUtterance(cleanTextForSpeech(text));
      
      // Configure voice settings
      newUtterance.rate = 0.9;
      newUtterance.pitch = 1.0;
      newUtterance.volume = 1.0;

      // Event handlers
      newUtterance.onstart = () => {
        setIsPlaying(true);
      };

      newUtterance.onend = () => {
        setIsPlaying(false);
      };

      newUtterance.onerror = () => {
        setIsPlaying(false);
      };

      setUtterance(newUtterance);

      // Auto-play if requested
      if (autoPlay) {
        setTimeout(() => {
          speechSynthesis.speak(newUtterance);
        }, 500); // Small delay to ensure UI is ready
      }
    }

    // Cleanup on unmount
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, [text, isSupported, autoPlay]); // Removed utterance from dependency to avoid infinite loop

  const cleanTextForSpeech = (text: string): string => {
    // Remove markdown formatting and clean up text for speech
    return text
      .replace(/[*_`~]/g, '') // Remove markdown formatting
      .replace(/#{1,6}\s/g, '') // Remove heading markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to just text
      .replace(/\n+/g, '. ') // Convert line breaks to pauses
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  const handleSpeak = () => {
    if (!isSupported || !utterance) return;

    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <TTSContainer>
      <TTSButton
        onClick={handleSpeak}
        isPlaying={isPlaying}
        disabled={!text}
        title={isPlaying ? 'Stop speaking' : 'Read aloud'}
      >
        {isPlaying ? '⏹️' : '🔊'}
      </TTSButton>
      {isPlaying && <TTSStatus>Speaking...</TTSStatus>}
    </TTSContainer>
  );
};

export default TextToSpeech;