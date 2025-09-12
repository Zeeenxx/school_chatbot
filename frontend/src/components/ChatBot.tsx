import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import io, { Socket } from 'socket.io-client';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import FileUpload from './FileUpload';
import TextToSpeech from './TextToSpeech';
import { useTheme, themes } from '../context/ThemeContext';

// Loading animation for image placeholders
const loadingAnimation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// School logo as a React component for better reliability
const LogoSVG: React.FC = () => (
  <svg width="60" height="60" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#722f37", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#8b3a42", stopOpacity:1}} />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="90" fill="url(#grad1)" stroke="#ffffff" strokeWidth="8"/>
    <text x="100" y="85" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold">OC</text>
    <text x="100" y="125" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="normal">COLLEGES</text>
  </svg>
);

const SchoolLogoImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  object-fit: cover;
  background: #722f37;
  
  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
`;

// User Icon Component
const UserIcon: React.FC<{ isUserMessage?: boolean }> = ({ isUserMessage = false }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" fill={isUserMessage ? "white" : "#722f37"}/>
    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" 
          stroke={isUserMessage ? "white" : "#722f37"} 
          strokeWidth="2" 
          fill="none"/>
  </svg>
);

// AI Robot Icon Component
const RobotIcon: React.FC<{ isUserMessage?: boolean }> = ({ isUserMessage = false }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="12" height="10" rx="2" fill={isUserMessage ? "white" : "#722f37"}/>
    <circle cx="9" cy="12" r="1" fill={isUserMessage ? "#722f37" : "white"}/>
    <circle cx="15" cy="12" r="1" fill={isUserMessage ? "#722f37" : "white"}/>
    <rect x="8" y="14" width="8" height="1" rx="0.5" fill={isUserMessage ? "#722f37" : "white"}/>
    <rect x="11" y="5" width="2" height="3" rx="1" fill={isUserMessage ? "white" : "#722f37"}/>
    <circle cx="12" cy="4" r="1" fill={isUserMessage ? "white" : "#722f37"}/>
    <rect x="4" y="10" width="2" height="4" rx="1" fill={isUserMessage ? "white" : "#722f37"}/>
    <rect x="18" y="10" width="2" height="4" rx="1" fill={isUserMessage ? "white" : "#722f37"}/>
    <rect x="9" y="18" width="2" height="3" rx="1" fill={isUserMessage ? "white" : "#722f37"}/>
    <rect x="13" y="18" width="2" height="3" rx="1" fill={isUserMessage ? "white" : "#722f37"}/>
  </svg>
);

const LogoContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 0.75rem;
  border: 3px solid white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
`;

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  suggestions?: string[];
  data?: any;
  type?: string;
  file?: {
    originalName: string;
    filename: string;
    url: string;
    mimetype: string;
    size: number;
  };
  images?: {
    id: number;
    originalName: string;
    filename: string;
    url?: string;
    previewUrl: string;
    mimetype?: string;
    mimeType?: string;
    size: number;
  }[];
  files?: {
    id: number;
    originalName: string;
    filename: string;
    url?: string;
    mimetype?: string;
    mimeType?: string;
    size: number;
  }[];
}

const ChatContainer = styled.div<{ theme: any }>`
  width: 100%;
  max-width: 800px;
  height: 600px;
  background: ${props => props.theme.cardBackground};
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0 auto;
  border: 1px solid ${props => props.theme.border};
  transition: all 0.3s ease;
  
  @media (max-width: 1024px) {
    max-width: 700px;
    height: 550px;
    border-radius: 16px;
  }
  
  @media (max-width: 768px) {
    max-width: 95%;
    height: 500px;
    border-radius: 12px;
    margin: 0 auto;
  }
  
  @media (max-width: 480px) {
    max-width: 100%;
    height: 450px;
    border-radius: 8px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 320px) {
    height: 400px;
    border-radius: 6px;
  }
`;

const ChatHeader = styled.div<{ theme?: any }>`
  background: ${props => props.theme?.headerBackground || 'linear-gradient(45deg, #722f37, #8b3a42)'};
  color: ${props => props.theme?.headerText || 'white'};
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 1.2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
  
  @media (max-width: 320px) {
    padding: 0.8rem;
  }
`;

const ChatTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
  
  @media (max-width: 320px) {
    font-size: 0.9rem;
  }
`;

const ChatSubtitle = styled.p`
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin: 0.4rem 0 0 0;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    margin: 0.3rem 0 0 0;
  }
  
  @media (max-width: 320px) {
    font-size: 0.7rem;
  }
`;

const MessagesContainer = styled.div<{ theme?: any }>`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: ${props => props.theme?.messagesBackground || '#f8f9fa'};
  transition: background 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
  }
  
  @media (max-width: 320px) {
    padding: 0.5rem;
  }
`;

const MessageBubble = styled.div<{ sender: 'user' | 'bot' }>`
  margin: 0.5rem 0;
  display: flex;
  justify-content: ${props => props.sender === 'user' ? 'flex-end' : 'flex-start'};
  align-items: flex-start;
  gap: 0.5rem;
`;

const MessageWrapper = styled.div<{ sender: 'user' | 'bot' }>`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  flex-direction: ${props => props.sender === 'user' ? 'row-reverse' : 'row'};
  max-width: 80%;
  
  @media (max-width: 768px) {
    max-width: 85%;
    gap: 0.4rem;
  }
  
  @media (max-width: 480px) {
    max-width: 90%;
    gap: 0.3rem;
  }
`;

const MessageIcon = styled.div<{ sender: 'user' | 'bot'; theme?: any }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.sender === 'user' 
    ? (props.theme?.userMessageBackground || '#722f37') 
    : (props.theme?.botMessageIcon || '#e6d2d5')};
  flex-shrink: 0;
  margin-top: 0.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease;
  
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
  
  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const MessageContent = styled.div<{ sender: 'user' | 'bot'; theme?: any }>`
  padding: 0.75rem 1rem;
  border-radius: 18px;
  background: ${props => props.sender === 'user' 
    ? (props.theme?.userMessageBackground || '#722f37') 
    : (props.theme?.botMessageBackground || '#f4e6e7')};
  color: ${props => props.sender === 'user' 
    ? (props.theme?.userMessageText || 'white') 
    : (props.theme?.botMessageText || '#333')};
  font-size: 0.9rem;
  line-height: 1.4;
  flex: 1;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
    border-radius: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.7rem;
    font-size: 0.8rem;
    border-radius: 12px;
    line-height: 1.3;
  }
  
  @media (max-width: 320px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    border-radius: 10px;
  }
`;

const SuggestionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
  justify-content: flex-start;
`;

const SuggestionButton = styled.button<{ theme?: any }>`
  background: ${props => props.theme?.suggestionBackground || 'rgba(114, 47, 55, 0.1)'};
  color: ${props => props.theme?.suggestionText || '#722f37'};
  border: 1px solid ${props => props.theme?.suggestionBorder || 'rgba(114, 47, 55, 0.2)'};
  border-radius: 15px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme?.suggestionHover || 'rgba(114, 47, 55, 0.2)'};
    transform: translateY(-1px);
  }
`;

const DataDisplay = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 0.8rem;
`;

const DataItem = styled.div`
  margin: 0.25rem 0;
  padding: 0.25rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
`;

const InputContainer = styled.div<{ theme?: any }>`
  padding: 1rem;
  background: ${props => props.theme?.inputBackground || 'white'};
  border-top: 1px solid ${props => props.theme?.border || '#eee'};
  display: flex;
  gap: 0.5rem;
  transition: all 0.3s ease;
  align-items: center;
  min-height: 60px;
  
  @media (max-width: 768px) {
    padding: 0.6rem;
    gap: 0.3rem;
    min-height: 50px;
    flex-wrap: nowrap;
  }
  
  @media (max-width: 480px) {
    padding: 0.4rem;
    gap: 0.2rem;
    min-height: 45px;
  }
  
  @media (max-width: 320px) {
    padding: 0.3rem;
    gap: 0.1rem;
    min-height: 40px;
  }
`;

const MessageInput = styled.input<{ theme?: any }>`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme?.border || '#ddd'};
  border-radius: 25px;
  outline: none;
  font-size: 0.9rem;
  background: ${props => props.theme?.inputFieldBackground || 'white'};
  color: ${props => props.theme?.text || 'black'};
  transition: all 0.3s ease;
  
  &:focus {
    border-color: ${props => props.theme?.primary || '#722f37'};
    box-shadow: 0 0 0 2px ${props => props.theme?.primaryTransparent || 'rgba(114, 47, 55, 0.25)'};
  }
  
  &::placeholder {
    color: ${props => props.theme?.placeholderText || '#999'};
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem;
    font-size: 0.85rem;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.8rem;
    border-radius: 15px;
  }
  
  @media (max-width: 320px) {
    padding: 0.4rem;
    font-size: 0.75rem;
    border-radius: 12px;
  }
`;

const SendButton = styled.button<{ theme?: any }>`
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme?.buttonBackground || '#722f37'};
  color: ${props => props.theme?.buttonText || 'white'};
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.theme?.buttonHover || '#5d1a1d'};
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: ${props => props.theme?.buttonDisabled || '#ccc'};
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    border-radius: 15px;
  }
  
  @media (max-width: 320px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    border-radius: 12px;
  }
`;

const VoiceButton = styled.button<{ theme?: any; isListening?: boolean }>`
  padding: 0.75rem;
  background: ${props => props.isListening ? '#dc3545' : (props.theme?.buttonBackground || '#722f37')};
  color: ${props => props.theme?.buttonText || 'white'};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  width: 45px;
  height: 45px;

  &:hover {
    background: ${props => props.isListening ? '#c82333' : (props.theme?.buttonHover || '#5d1a1d')};
  }
`;

const TypingIndicator = styled.div<{ theme?: any }>`
  padding: 0.75rem 1rem;
  background: ${props => props.theme?.botMessageBackground || '#f4e6e7'};
  color: ${props => props.theme?.botMessageText || '#666'};
  border-radius: 18px;
  font-size: 0.9rem;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.85rem;
    border-radius: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.7rem;
    font-size: 0.8rem;
    border-radius: 12px;
  }
  
  @media (max-width: 320px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    border-radius: 10px;
  }
`;

const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const TypingDot = styled.div<{ delay: number; theme?: any }>`
  width: 8px;
  height: 8px;
  background: ${props => props.theme?.botMessageText || '#666'};
  border-radius: 50%;
  animation: pulse 1.4s infinite both;
  animation-delay: ${props => props.delay}s;
  
  @keyframes pulse {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    width: 6px;
    height: 6px;
  }
  
  @media (max-width: 480px) {
    width: 5px;
    height: 5px;
  }
`;

const FileMessage = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background: rgba(114, 47, 55, 0.1);
  border-radius: 8px;
  margin-top: 0.5rem;
  border: 1px solid #722f37;
`;

const FileIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 0.5rem;
`;

const FileInfo = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-weight: bold;
  color: #722f37;
`;

const FileSize = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const FileDownload = styled.a`
  color: #722f37;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border: 1px solid #722f37;
  border-radius: 4px;
  font-size: 0.8rem;
  
  &:hover {
    background: #722f37;
    color: white;
  }
`;

// Image preview components
const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  border-top: 1px solid #e0e0e0;
  background: #f9f9f9;
  max-height: 120px;
  overflow-y: auto;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    max-height: 100px;
    padding: 6px;
    gap: 6px;
    flex-wrap: nowrap;
    overflow-x: auto;
  }
  
  @media (max-width: 480px) {
    max-height: 80px;
    padding: 4px;
    gap: 4px;
  }
`;

const ImagePreviewItem = styled.div<{ selected?: boolean }>`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.selected ? '#722f37' : 'transparent'};
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    border-color: #722f37;
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
  }
  
  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #f0f0f0;
  
  /* Ensure images load properly on mobile */
  @media (max-width: 768px) {
    object-fit: cover;
    object-position: center;
  }
  
  /* Add loading state */
  &[src=""], &:not([src]) {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: ${loadingAnimation} 1.5s infinite;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: rgba(114, 47, 55, 0.8);
  color: white;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(114, 47, 55, 1);
  }
`;

const SelectedImageBadge = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #722f37;
  color: white;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MessageImage = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  margin: 8px 0;
  cursor: pointer;
  transition: transform 0.2s ease;
  object-fit: cover;
  display: block;
  background: #f0f0f0;
  
  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    max-width: 120px;
    max-height: 120px;
    margin: 4px 0;
  }
  
  @media (max-width: 480px) {
    max-width: 100px;
    max-height: 100px;
    margin: 3px 0;
  }
  
  @media (max-width: 320px) {
    max-width: 80px;
    max-height: 80px;
    margin: 2px 0;
  }
  
  /* Add loading state */
  &[src=""], &:not([src]) {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: ${loadingAnimation} 1.5s infinite;
  }
`;

const ImageGallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0;
`;

// File preview components (for non-image files)
const FilePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  border-top: 1px solid #e0e0e0;
  background: #f5f5f5;
  max-height: 120px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    max-height: 80px;
    padding: 6px;
    gap: 4px;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    display: block;
  }
  
  @media (max-width: 480px) {
    max-height: 60px;
    padding: 4px;
    gap: 3px;
  }
`;

const FilePreviewItem = styled.div<{ selected?: boolean }>`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.selected ? '#722f37' : '#ddd'};
  transition: all 0.2s ease;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px;
  flex-shrink: 0;
  
  &:hover {
    border-color: #722f37;
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    display: inline-flex;
    margin-right: 4px;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    padding: 2px;
  }
`;

const DocumentIcon = styled.div`
  font-size: 24px;
  margin-bottom: 4px;
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 2px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    margin-bottom: 1px;
  }
`;

const DocumentName = styled.div`
  font-size: 8px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  color: #333;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 6px;
    display: none; /* Hide on mobile to save space */
  }
  
  @media (max-width: 480px) {
    display: none;
  }
  
  @media (max-width: 768px) {
    font-size: 7px;
  }
`;

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [clearFileUpload, setClearFileUpload] = useState(0);
  const [removedFilename, setRemovedFilename] = useState<string>('');

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  // Reset removedFilename after a short delay to allow FileUpload to process it
  useEffect(() => {
    if (removedFilename) {
      const timer = setTimeout(() => {
        setRemovedFilename('');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [removedFilename]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Theme context
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? themes.dark : themes.light;

  // List of possible logo file names to try
  const logoFiles = [
    '/assets/osmena-colleges-logo.png',
    '/assets/school-logo.png', 
    '/assets/logo.png'
  ];

  // Logo component that tries PNG files first, falls back to SVG
  const LogoComponent: React.FC = () => {
    const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
    const [showFallback, setShowFallback] = useState(false);

    const handleImageError = () => {
      if (currentLogoIndex < logoFiles.length - 1) {
        setCurrentLogoIndex(currentLogoIndex + 1);
      } else {
        setShowFallback(true);
      }
    };

    if (showFallback) {
      return (
        <LogoContainer>
          <LogoSVG />
        </LogoContainer>
      );
    }

    return (
      <SchoolLogoImg
        src={logoFiles[currentLogoIndex]}
        alt="Osmeña Colleges Logo"
        onError={handleImageError}
      />
    );
  };

  useEffect(() => {
    // Use environment variable for backend URL in production, or localhost in development
    const serverUrl = process.env.REACT_APP_API_URL || 
                     `http://${window.location.hostname}:5000`;
    
    // Enhanced socket configuration for mobile devices
    const newSocket = io(serverUrl, {
      timeout: 60000, // 60 seconds timeout
      transports: ['websocket', 'polling'], // Allow fallback to polling
      upgrade: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });
    
    setSocket(newSocket);

    newSocket.on('message', (data) => {
      setMessages(prev => [...prev, {
        ...data,
        timestamp: new Date().toISOString()
      }]);
    });

    newSocket.on('bot_message', (data) => {
      setIsTyping(false);
      setMessages(prev => [...prev, data]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sendMessage = (messageText = inputValue) => {
    if (!messageText.trim() || !socket) return;

    const userMessage: Message = {
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
      images: selectedImages.length > 0 ? selectedImages : undefined,
      files: selectedFiles.length > 0 ? selectedFiles : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Send message with selected images and files
    socket.emit('user_message', { 
      message: messageText,
      images: selectedImages.length > 0 ? selectedImages : undefined,
      files: selectedFiles.length > 0 ? selectedFiles : undefined
    });
    
    setInputValue('');
    
    // Store the IDs of files being sent before clearing the arrays
    const sentImageIds = selectedImages.map(img => img.id);
    const sentFileIds = selectedFiles.map(file => file.id);
    
    // Clear selected images and files after sending
    setSelectedImages([]);
    setSelectedFiles([]);
    
    // Remove the sent files from uploaded lists to keep interface clean
    if (sentImageIds.length > 0) {
      console.log('Removing sent images:', sentImageIds);
      setUploadedImages(prev => prev.filter(img => !sentImageIds.includes(img.id)));
    }
    if (sentFileIds.length > 0) {
      console.log('Removing sent files:', sentFileIds);
      setUploadedFiles(prev => prev.filter(file => !sentFileIds.includes(file.id)));
    }
    
    // Clear the FileUpload component's displayed file
    setClearFileUpload(prev => prev + 1);
    
    // Reset transcript after sending message
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.abortListening();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleFileUploaded = (fileInfo: any) => {
    if (!socket) return;

    console.log('File uploaded:', fileInfo.file); // Debug log

    // Check if the file is an image
    const isImage = fileInfo.file.mimetype?.startsWith('image/') || 
                   fileInfo.file.mimeType?.startsWith('image/');

    console.log('Is image:', isImage, 'MIME type:', fileInfo.file.mimetype || fileInfo.file.mimeType); // Debug log

    if (isImage) {
      // Add to uploaded images for preview with mobile-compatible URL
      const serverUrl = process.env.REACT_APP_API_URL || 
                       `http://${window.location.hostname}:5000`;
      const imageWithPreview = {
        ...fileInfo.file,
        previewUrl: fileInfo.file.url ? `${serverUrl}${fileInfo.file.url}` : `${serverUrl}/uploads/${fileInfo.file.filename}`,
        id: Date.now() + Math.random(), // Unique ID for selection
      };
      
      console.log('Image preview URL:', imageWithPreview.previewUrl); // Debug log
      
      setUploadedImages(prev => [...prev, imageWithPreview]);
    } else {
      // Handle all other file types (documents)
      const documentFile = {
        ...fileInfo.file,
        id: Date.now() + Math.random(), // Unique ID for selection
      };
      
      setUploadedFiles(prev => [...prev, documentFile]);
    }
  };

  const toggleImageSelection = (imageId: number) => {
    setSelectedImages(prev => {
      const isSelected = prev.find(img => img.id === imageId);
      if (isSelected) {
        return prev.filter(img => img.id !== imageId);
      } else {
        const imageToAdd = uploadedImages.find(img => img.id === imageId);
        return imageToAdd ? [...prev, imageToAdd] : prev;
      }
    });
  };

  const removeUploadedImage = (imageId: number) => {
    // Find the image to get filename for server deletion
    const imageToRemove = uploadedImages.find(img => img.id === imageId);
    if (imageToRemove) {
      // Delete file from server
      deleteFileFromServer(imageToRemove.filename);
      // Set removed filename to clear FileUpload component
      setRemovedFilename(imageToRemove.filename);
    }
    
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    setSelectedImages(prev => prev.filter(img => img.id !== imageId));
    
    // Trigger clearFiles to clear the FileUpload component state
    setClearFileUpload(prev => prev + 1);
  };

  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles(prev => {
      const isSelected = prev.find(file => file.id === fileId);
      if (isSelected) {
        return prev.filter(file => file.id !== fileId);
      } else {
        const fileToAdd = uploadedFiles.find(file => file.id === fileId);
        return fileToAdd ? [...prev, fileToAdd] : prev;
      }
    });
  };

  const removeUploadedFile = (fileId: number) => {
    // Find the file to get filename for server deletion
    const fileToRemove = uploadedFiles.find(file => file.id === fileId);
    if (fileToRemove) {
      // Delete file from server
      deleteFileFromServer(fileToRemove.filename);
      // Set removed filename to clear FileUpload component
      setRemovedFilename(fileToRemove.filename);
    }
    
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
    
    // Trigger clearFiles to clear the FileUpload component state
    setClearFileUpload(prev => prev + 1);
  };

  const deleteFileFromServer = async (filename: string) => {
    try {
      const serverUrl = process.env.REACT_APP_SERVER_URL || 
                       `http://${window.location.hostname}:5000`;
      const deleteUrl = `${serverUrl}/api/upload/${filename}`;
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('File deleted from server:', filename);
      } else {
        console.error('Failed to delete file from server:', result.message);
      }
    } catch (error) {
      console.error('Error deleting file from server:', error);
    }
  };

  // Function to clean markdown formatting from text for display
  const cleanDisplayText = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown **text**
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown *text*
      .replace(/__(.*?)__/g, '$1') // Remove bold markdown __text__
      .replace(/_(.*?)_/g, '$1') // Remove italic markdown _text_
      .replace(/`(.*?)`/g, '$1') // Remove inline code markdown `text`
      .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough markdown ~~text~~
      .replace(/#{1,6}\s/g, '') // Remove heading markers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to just text
      .trim();
  };

  const getFileIcon = (mimeType: string | undefined) => {
    if (!mimeType) return '📎';
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📺';
    if (mimeType.includes('csv')) return '📊';
    return '📎';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFileMessage = (file: any) => {
    return (
      <FileMessage>
        <FileIcon>{getFileIcon(file.mimetype || file.mimeType)}</FileIcon>
        <FileInfo>
          <FileName>{file.originalName || file.filename}</FileName>
          <FileSize>{formatFileSize(file.size)}</FileSize>
        </FileInfo>
        {file.url && (
          <FileDownload href={file.url} target="_blank" rel="noopener noreferrer">
            Download
          </FileDownload>
        )}
      </FileMessage>
    );
  };

  const renderMessageFiles = (files: any[]) => {
    if (!files || files.length === 0) return null;
    
    console.log('Rendering message files:', files); // Debug log
    
    return (
      <div style={{ marginTop: '8px' }}>
        {files.map((file, index) => (
          <div key={index} style={{ marginBottom: '4px' }}>
            {renderFileMessage(file)}
          </div>
        ))}
      </div>
    );
  };

  const renderMessageImages = (images: any[]) => {
    if (!images || images.length === 0) return null;
    
    console.log('Rendering message images:', images); // Debug log
    
    return (
      <ImageGallery>
        {images.map((image, index) => (
          <MessageImage 
            key={index}
            src={image.previewUrl}
            alt={image.originalName}
            title={image.originalName}
            onClick={() => window.open(image.previewUrl, '_blank')}
            onError={(e) => {
              console.log('Image failed to load:', image.previewUrl);
              console.log('Image object:', image);
              // Try alternative approach for mobile
              const img = e.target as HTMLImageElement;
              const serverUrl = process.env.REACT_APP_SERVER_URL || 
                               `http://${window.location.hostname}:5000`;
              if (!img.src.includes(serverUrl)) {
                img.src = `${serverUrl}${image.url || image.previewUrl}`;
              }
            }}
            onLoad={() => console.log('Image loaded successfully:', image.previewUrl)}
          />
        ))}
      </ImageGallery>
    );
  };

  const renderMessageData = (data: any, type: string, additionalInfo?: any) => {
    if (!data) return null;

    switch (type) {
      case 'courses':
        return (
          <DataDisplay>
            <div style={{marginBottom: '10px', padding: '8px', background: 'rgba(114,47,55,0.1)', borderRadius: '5px'}}>
              <strong>🎓 Available Courses & Programs:</strong>
            </div>
            {data.map((course: any, index: number) => (
              <DataItem key={index} style={{
                border: '1px solid rgba(114,47,55,0.2)', 
                borderRadius: '8px', 
                padding: '12px', 
                margin: '8px 0',
                background: 'rgba(114,47,55,0.05)'
              }}>
                <div style={{marginBottom: '8px', padding: '6px', background: 'rgba(114,47,55,0.1)', borderRadius: '4px'}}>
                  <strong style={{fontSize: '1.1em', color: '#722f37'}}>📚 {course.name}</strong>
                </div>
                
                <div style={{marginBottom: '5px', padding: '4px', background: 'rgba(33,150,243,0.1)', borderRadius: '3px'}}>
                  <strong>👨‍🏫 Dean:</strong> <span style={{color: '#1976d2', fontWeight: 'bold'}}>{course.Dean}</span>
                </div>
                
                <div style={{marginBottom: '5px'}}>
                  <strong>🕒 Schedule:</strong> <span style={{color: '#722f37', fontWeight: 'bold'}}>{course.time}</span>
                </div>
                
                {course.tuition && (
                  <div style={{marginBottom: '8px', padding: '6px', background: 'rgba(255,193,7,0.1)', borderRadius: '4px'}}>
                    <strong>💰 Tuition:</strong> <span style={{color: '#f57c00', fontWeight: 'bold'}}>{course.tuition}</span>
                  </div>
                )}
                
                {course.credits && (
                  <div style={{marginBottom: '5px'}}>
                    <strong>📊 Credits:</strong> <span style={{color: '#388e3c', fontWeight: 'bold'}}>{course.credits}</span>
                  </div>
                )}
                
                {course.description && (
                  <div style={{marginTop: '8px', marginBottom: '8px', padding: '6px', background: 'rgba(114,47,55,0.1)', borderRadius: '4px', fontSize: '0.9em', fontStyle: 'italic', color: '#722f37'}}>
                    📋 {course.description}
                  </div>
                )}
                
                {course.prerequisites && (
                  <div style={{marginTop: '8px', padding: '6px', background: 'rgba(156,39,176,0.1)', borderRadius: '4px'}}>
                    <strong>📋 Prerequisites:</strong> <span style={{fontSize: '0.9em', color: '#7b1fa2'}}>{course.prerequisites}</span>
                  </div>
                )}
              </DataItem>
            ))}
          </DataDisplay>
        );
      case 'tuition':
        return (
          <DataDisplay>
            <div style={{marginBottom: '10px', padding: '8px', background: 'rgba(114,47,55,0.1)', borderRadius: '5px'}}>
              <strong>💰 General Tuition Information:</strong><br />
              Per Credit Hour: <strong>{additionalInfo?.perCreditHour}</strong><br />
              Full-time Discount: {additionalInfo?.fullTimeDiscount}
            </div>
            <strong>Course Tuition Breakdown:</strong>
            {data.map((course: any, index: number) => (
              <DataItem key={index}>
                <strong>{course.name}</strong><br />
                <span style={{color: '#722f37', fontWeight: 'bold'}}>Tuition: {course.tuition}</span><br />
                Credits: {course.credits}<br />
                Per Credit: {additionalInfo?.perCreditHour}
              </DataItem>
            ))}
            {additionalInfo?.paymentPlans && (
              <div style={{marginTop: '10px', padding: '8px', background: 'rgba(114,47,55,0.1)', borderRadius: '5px'}}>
                <strong>💳 Payment Plans:</strong><br />
                {additionalInfo.paymentPlans.map((plan: string, idx: number) => (
                  <div key={idx}>• {plan}</div>
                ))}
              </div>
            )}
          </DataDisplay>
        );
      case 'scholarships':
        return (
          <DataDisplay>
            <div style={{marginBottom: '10px', padding: '8px', background: 'rgba(40,167,69,0.1)', borderRadius: '5px'}}>
              <strong>🎓 Available Scholarships:</strong>
            </div>
            {data.map((scholarship: any, index: number) => (
              <DataItem key={index}>
                <strong>{scholarship.name}</strong><br />
                Amount: <span style={{color: '#28a745', fontWeight: 'bold'}}>{scholarship.amount}</span><br />
                Criteria: {scholarship.criteria}
              </DataItem>
            ))}
            {additionalInfo?.contact && (
              <div style={{marginTop: '10px', padding: '8px', background: 'rgba(114,47,55,0.1)', borderRadius: '5px'}}>
                <strong>📞 Contact:</strong><br />
                Financial Aid Office: (032) 123-4570<br />
                financialaid@osmena.edu.ph
              </div>
            )}
          </DataDisplay>
        );
      case 'payment_plans':
        return (
          <DataDisplay>
            <div style={{marginBottom: '10px', padding: '8px', background: 'rgba(255,193,7,0.1)', borderRadius: '5px'}}>
              <strong>💳 Payment Plan Options:</strong>
            </div>
            {data.map((plan: string, index: number) => (
              <DataItem key={index}>
                • {plan}
              </DataItem>
            ))}
            {additionalInfo?.contact && (
              <div style={{marginTop: '10px', padding: '8px', background: 'rgba(114,47,55,0.1)', borderRadius: '5px'}}>
                <strong>📞 Contact:</strong><br />
                {additionalInfo.contact}<br />
                {additionalInfo.email}
              </div>
            )}
          </DataDisplay>
        );
      case 'facilities':
        return (
          <DataDisplay>
            <div style={{marginBottom: '10px', padding: '8px', background: 'rgba(33,150,243,0.1)', borderRadius: '5px'}}>
              <strong>🏢 Campus Facilities & Services:</strong>
            </div>
            {data.map((facility: any, index: number) => (
              <DataItem key={index} style={{
                border: '1px solid rgba(33,150,243,0.2)', 
                borderRadius: '8px', 
                padding: '12px', 
                margin: '8px 0',
                background: 'rgba(33,150,243,0.05)'
              }}>
                <div style={{marginBottom: '8px', padding: '6px', background: 'rgba(33,150,243,0.1)', borderRadius: '4px'}}>
                  <strong style={{fontSize: '1.1em', color: '#1976d2'}}>🏛️ {facility.name}</strong>
                </div>
                
                {facility.manager && (
                  <div style={{marginBottom: '5px', padding: '4px', background: 'rgba(114,47,55,0.1)', borderRadius: '3px'}}>
                    <strong>👨‍💼 Manager:</strong> <span style={{color: '#722f37', fontWeight: 'bold'}}>{facility.manager}</span>
                  </div>
                )}
                
                <div style={{marginBottom: '5px'}}>
                  <strong>📍 Location:</strong> {facility.location}
                </div>
                
                <div style={{marginBottom: '5px'}}>
                  <strong>🕒 Hours:</strong> <span style={{color: '#1976d2', fontWeight: 'bold'}}>{facility.hours}</span>
                </div>
                
                {facility.capacity && (
                  <div style={{marginBottom: '5px'}}>
                    <strong>👥 Capacity:</strong> {facility.capacity}
                  </div>
                )}
                
                {facility.bookingFee && (
                  <div style={{marginBottom: '8px', padding: '6px', background: 'rgba(255,193,7,0.1)', borderRadius: '4px'}}>
                    <strong>💰 Booking Fee:</strong> <span style={{color: '#f57c00', fontWeight: 'bold'}}>{facility.bookingFee}</span>
                  </div>
                )}
                
                {facility.amenities && (
                  <div style={{marginBottom: '5px'}}>
                    <strong>✨ Amenities:</strong> <span style={{color: '#388e3c'}}>{facility.amenities}</span>
                  </div>
                )}
                
                <div style={{marginBottom: '5px'}}>
                  <strong>📞 Contact:</strong> {facility.contact}
                  {facility.phone && <span style={{color: '#1976d2'}}> | 📱 {facility.phone}</span>}
                </div>
                
                {facility.description && (
                  <div style={{marginTop: '8px', marginBottom: '8px', padding: '6px', background: 'rgba(33,150,243,0.1)', borderRadius: '4px', fontSize: '0.9em', fontStyle: 'italic', color: '#1565c0'}}>
                    📋 {facility.description}
                  </div>
                )}
                
                {facility.services && (
                  <div style={{marginTop: '8px', padding: '6px', background: 'rgba(76,175,80,0.1)', borderRadius: '4px'}}>
                    <strong>🛠️ Services:</strong>
                    <div style={{marginTop: '3px', fontSize: '0.9em', color: '#388e3c'}}>
                      {(typeof facility.services === 'string' ? JSON.parse(facility.services) : facility.services).map((service: string, idx: number) => (
                        <div key={idx}>• {service}</div>
                      ))}
                    </div>
                  </div>
                )}
                
                {facility.rules && (
                  <div style={{marginTop: '8px', padding: '6px', background: 'rgba(255,152,0,0.1)', borderRadius: '4px'}}>
                    <strong>⚠️ Rules:</strong>
                    <div style={{marginTop: '3px', fontSize: '0.85em', color: '#f57c00'}}>
                      {(typeof facility.rules === 'string' ? JSON.parse(facility.rules) : facility.rules).map((rule: string, idx: number) => (
                        <div key={idx}>• {rule}</div>
                      ))}
                    </div>
                  </div>
                )}
                
                {facility.requirements && (
                  <div style={{marginTop: '8px', padding: '6px', background: 'rgba(156,39,176,0.1)', borderRadius: '4px'}}>
                    <strong>📋 Requirements:</strong> <span style={{fontSize: '0.9em', color: '#7b1fa2'}}>{facility.requirements}</span>
                  </div>
                )}
              </DataItem>
            ))}
          </DataDisplay>
        );
      case 'staff':
        return (
          <DataDisplay>
            <div style={{marginBottom: '10px', padding: '8px', background: 'rgba(76,175,80,0.1)', borderRadius: '5px'}}>
              <strong>👥 School Staff & Faculty:</strong>
            </div>
            {data.map((staff: any, index: number) => (
              <DataItem key={index} style={{
                border: '1px solid rgba(76,175,80,0.2)', 
                borderRadius: '8px', 
                padding: '12px', 
                margin: '8px 0',
                background: 'rgba(76,175,80,0.05)'
              }}>
                <div style={{marginBottom: '8px', padding: '6px', background: 'rgba(76,175,80,0.1)', borderRadius: '4px'}}>
                  <strong style={{fontSize: '1.1em', color: '#388e3c'}}>👨‍🏫 {staff.name}</strong>
                </div>
                
                <div style={{marginBottom: '5px', padding: '4px', background: 'rgba(114,47,55,0.1)', borderRadius: '3px'}}>
                  <strong>💼 Position:</strong> <span style={{color: '#722f37', fontWeight: 'bold'}}>{staff.position}</span>
                </div>
                
                <div style={{marginBottom: '5px'}}>
                  <strong>🏢 Department:</strong> {staff.department}
                </div>
                
                {staff.officeHours && (
                  <div style={{marginBottom: '5px'}}>
                    <strong>🕒 Office Hours:</strong> <span style={{color: '#1976d2', fontWeight: 'bold'}}>{staff.officeHours}</span>
                  </div>
                )}
                
                {staff.officeLocation && (
                  <div style={{marginBottom: '5px'}}>
                    <strong>📍 Office:</strong> <span style={{color: '#722f37', fontWeight: 'bold'}}>{staff.officeLocation}</span>
                  </div>
                )}
                
                <div style={{marginBottom: '5px'}}>
                  <strong>📧 Contact:</strong> {staff.email}
                  {staff.phone && <span style={{color: '#1976d2'}}> | 📱 {staff.phone}</span>}
                </div>
                
                {staff.education && (
                  <div style={{marginTop: '8px', marginBottom: '5px', padding: '6px', background: 'rgba(33,150,243,0.1)', borderRadius: '4px'}}>
                    <strong>🎓 Education:</strong> <span style={{fontSize: '0.9em', color: '#1565c0'}}>{staff.education}</span>
                  </div>
                )}
                
                {staff.specialization && (
                  <div style={{marginBottom: '5px', padding: '4px', background: 'rgba(156,39,176,0.1)', borderRadius: '3px'}}>
                    <strong>🔬 Specialization:</strong> <span style={{fontSize: '0.9em', color: '#7b1fa2'}}>{staff.specialization}</span>
                  </div>
                )}
                
                {staff.experience && (
                  <div style={{marginBottom: '5px'}}>
                    <strong>💼 Experience:</strong> <span style={{color: '#388e3c', fontWeight: 'bold'}}>{staff.experience}</span>
                  </div>
                )}
                
                {staff.bio && (
                  <div style={{marginTop: '8px', marginBottom: '8px', padding: '6px', background: 'rgba(76,175,80,0.1)', borderRadius: '4px', fontSize: '0.9em', fontStyle: 'italic', color: '#2e7d32'}}>
                    📋 {staff.bio}
                  </div>
                )}
                
                {staff.achievements && (
                  <div style={{marginTop: '8px', padding: '6px', background: 'rgba(255,193,7,0.1)', borderRadius: '4px'}}>
                    <strong>🏆 Achievements:</strong>
                    <div style={{marginTop: '3px', fontSize: '0.9em', color: '#f57c00'}}>
                      {(typeof staff.achievements === 'string' ? JSON.parse(staff.achievements) : staff.achievements).map((achievement: string, idx: number) => (
                        <div key={idx}>• {achievement}</div>
                      ))}
                    </div>
                  </div>
                )}
              </DataItem>
            ))}
          </DataDisplay>
        );
      case 'contacts':
        return (
          <DataDisplay>
            {data.map((contact: any, index: number) => (
              <DataItem key={index}>
                <strong>{contact.name}</strong><br />
                Phone: {contact.phone}<br />
                Email: {contact.email}
              </DataItem>
            ))}
          </DataDisplay>
        );
      default:
        return null;
    }
  };

  return (
    <ChatContainer theme={currentTheme}>
      <ChatHeader theme={currentTheme}>
        {/* School logo - will try PNG files first, fallback to SVG */}
        <LogoComponent />
        <ChatTitle>💬 Osmeña Colleges Assistant</ChatTitle>
        <ChatSubtitle>Ask me about courses, facilities, contacts, and more!</ChatSubtitle>
      </ChatHeader>
      
      <MessagesContainer theme={currentTheme}>
        {messages.map((message, index) => (
          <MessageBubble key={index} sender={message.sender}>
            <MessageWrapper sender={message.sender}>
              <MessageIcon sender={message.sender} theme={currentTheme}>
                {message.sender === 'bot' ? 
                  <RobotIcon isUserMessage={false} /> : 
                  <UserIcon isUserMessage={true} />
                }
              </MessageIcon>
              <MessageContent sender={message.sender} theme={currentTheme}>
                {cleanDisplayText(message.text)}
                {message.images && renderMessageImages(message.images)}
                {message.file && renderFileMessage(message.file)}
                {message.files && renderMessageFiles(message.files)}
                {renderMessageData(message.data, message.type || '', (message as any).additionalInfo)}
                {message.sender === 'bot' && message.text && (
                  <TextToSpeech text={message.text} />
                )}
                {message.sender === 'bot' && message.suggestions && (
                  <SuggestionsContainer>
                    {message.suggestions.map((suggestion, i) => (
                      <SuggestionButton key={i} onClick={() => handleSuggestionClick(suggestion)} theme={currentTheme}>
                        {suggestion}
                      </SuggestionButton>
                    ))}
                  </SuggestionsContainer>
                )}
              </MessageContent>
            </MessageWrapper>
          </MessageBubble>
        ))}
        
        {isTyping && (
          <MessageBubble sender="bot">
            <MessageWrapper sender="bot">
              <MessageIcon sender="bot" theme={currentTheme}>
                <RobotIcon isUserMessage={false} />
              </MessageIcon>
              <TypingIndicator theme={currentTheme}>
                <TypingDots>
                  <TypingDot delay={0} theme={currentTheme} />
                  <TypingDot delay={0.2} theme={currentTheme} />
                  <TypingDot delay={0.4} theme={currentTheme} />
                </TypingDots>
              </TypingIndicator>
            </MessageWrapper>
          </MessageBubble>
        )}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      {/* Image Preview Area */}
      {uploadedImages.length > 0 && (
        <ImagePreviewContainer>
          {uploadedImages.map((image) => (
            <ImagePreviewItem 
              key={image.id}
              selected={selectedImages.some(img => img.id === image.id)}
              onClick={() => toggleImageSelection(image.id)}
            >
              <PreviewImage 
                src={image.previewUrl} 
                alt={image.originalName}
                onError={(e) => {
                  console.log('Preview image failed to load:', image.previewUrl);
                  console.log('Image object:', image);
                  // Try alternative approach for mobile
                  const img = e.target as HTMLImageElement;
                  const serverUrl = process.env.REACT_APP_SERVER_URL || 
                                   `http://${window.location.hostname}:5000`;
                  if (!img.src.includes(serverUrl)) {
                    img.src = `${serverUrl}${image.url || image.previewUrl}`;
                  }
                }}
                onLoad={() => console.log('Preview image loaded successfully:', image.previewUrl)}
              />
              <RemoveImageButton 
                onClick={(e) => {
                  e.stopPropagation();
                  removeUploadedImage(image.id);
                }}
                title="Remove image"
              >
                ×
              </RemoveImageButton>
              {selectedImages.some(img => img.id === image.id) && (
                <SelectedImageBadge>✓</SelectedImageBadge>
              )}
            </ImagePreviewItem>
          ))}
        </ImagePreviewContainer>
      )}
      
      {/* File Preview Area */}
      {uploadedFiles.length > 0 && (
        <FilePreviewContainer>
          {uploadedFiles.map((file) => (
            <FilePreviewItem 
              key={file.id}
              selected={selectedFiles.some(f => f.id === file.id)}
              onClick={() => toggleFileSelection(file.id)}
              title={`${file.name} (${file.size ? Math.round(file.size / 1024) + ' KB' : 'Unknown size'})`}
            >
              <DocumentIcon>{getFileIcon(file.mimetype || file.mimeType || file.type)}</DocumentIcon>
              <DocumentName>{file.name}</DocumentName>
              <RemoveImageButton 
                onClick={(e) => {
                  e.stopPropagation();
                  removeUploadedFile(file.id);
                }}
                title="Remove file"
              >
                ×
              </RemoveImageButton>
              {selectedFiles.some(f => f.id === file.id) && (
                <SelectedImageBadge>✓</SelectedImageBadge>
              )}
            </FilePreviewItem>
          ))}
        </FilePreviewContainer>
      )}
      
      <InputContainer theme={currentTheme}>
        <FileUpload 
          onFileUploaded={handleFileUploaded} 
          clearFiles={clearFileUpload}
          removedFilename={removedFilename}
        />
        <MessageInput
          type="text"
          placeholder={
            selectedImages.length > 0 
              ? `Type your message (${selectedImages.length} image${selectedImages.length !== 1 ? 's' : ''} selected)...`
              : "Type your message here..."
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          theme={currentTheme}
        />
        {browserSupportsSpeechRecognition && (
          <VoiceButton
            theme={currentTheme}
            isListening={listening}
            onClick={() => listening ? SpeechRecognition.stopListening() : SpeechRecognition.startListening({ language: 'fil-PH' })}
            title={listening ? "Stop listening" : "Start listening"}
          >
            🎤
          </VoiceButton>
        )}
        <SendButton 
          onClick={() => sendMessage()}
          disabled={!inputValue.trim()}
          theme={currentTheme}
        >
          Send
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatBot;
