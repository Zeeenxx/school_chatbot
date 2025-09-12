import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

interface VideoBackgroundProps {
  videoSrc: string;
  fallbackImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

const VideoContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const FallbackImage = styled.div<{ imageSrc: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.imageSrc});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const VideoOverlay = styled.div<{ opacity: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, ${props => props.opacity}) 0%,
    rgba(0, 0, 0, ${props => props.opacity * 0.7}) 50%,
    rgba(0, 0, 0, ${props => props.opacity * 1.2}) 100%
  );
  z-index: 1;
`;

const LoadingIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.2rem;
  z-index: 2;
  opacity: 0.8;
`;

const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSrc,
  fallbackImage = '/assets/default-bg.jpg',
  overlay = true,
  overlayOpacity = 0.4
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVideoSupported, setIsVideoSupported] = useState(true);

  useEffect(() => {
    // Check if video is supported
    const video = document.createElement('video');
    if (!video.canPlayType) {
      setIsVideoSupported(false);
      setIsLoading(false);
      return;
    }

    // Check if the video format is supported
    const canPlayWebM = video.canPlayType('video/webm; codecs="vp8, vp9"');
    const canPlayMP4 = video.canPlayType('video/mp4; codecs="avc1.42E01E"');
    
    if (!canPlayWebM && !canPlayMP4) {
      setIsVideoSupported(false);
      setIsLoading(false);
      return;
    }

    if (videoRef.current) {
      const handleCanPlay = () => {
        setIsLoading(false);
        setHasError(false);
      };

      const handleError = () => {
        setHasError(true);
        setIsLoading(false);
      };

      const handleLoadStart = () => {
        setIsLoading(true);
      };

      videoRef.current.addEventListener('canplay', handleCanPlay);
      videoRef.current.addEventListener('error', handleError);
      videoRef.current.addEventListener('loadstart', handleLoadStart);

      // Try to load the video
      videoRef.current.load();

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('canplay', handleCanPlay);
          videoRef.current.removeEventListener('error', handleError);
          videoRef.current.removeEventListener('loadstart', handleLoadStart);
        }
      };
    }
  }, [videoSrc]);

  // If video is not supported or there's an error, show fallback
  if (!isVideoSupported || hasError) {
    return (
      <VideoContainer>
        <FallbackImage imageSrc={fallbackImage} />
        {overlay && <VideoOverlay opacity={overlayOpacity} />}
      </VideoContainer>
    );
  }

  return (
    <VideoContainer>
      {isLoading && <LoadingIndicator>Loading background...</LoadingIndicator>}
      <Video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={fallbackImage}
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
        Your browser does not support the video tag.
      </Video>
      {overlay && <VideoOverlay opacity={overlayOpacity} />}
    </VideoContainer>
  );
};

export default VideoBackground;
