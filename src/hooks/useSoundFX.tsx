
import { useState, useEffect } from 'react';
import useSound from 'use-sound';

export function useSoundFX() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  
  // Load sounds
  const [playHover] = useSound('/sounds/hover.mp3', { volume: 0.2 });
  const [playClick] = useSound('/sounds/click.mp3', { volume: 0.3 });
  const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.4 });
  const [playError] = useSound('/sounds/error.mp3', { volume: 0.4 });
  const [playNotification] = useSound('/sounds/notification.mp3', { volume: 0.4 });
  
  // Load user preference from localStorage
  useEffect(() => {
    const storedPreference = localStorage.getItem('axium-sound-enabled');
    if (storedPreference !== null) {
      setSoundEnabled(storedPreference === 'true');
    }
  }, []);
  
  // Save preference to localStorage
  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('axium-sound-enabled', String(newState));
  };
  
  // Safe sound playing functions that check if sound is enabled
  const safePlay = (playFunction: () => void) => {
    if (soundEnabled) {
      playFunction();
    }
  };
  
  return {
    soundEnabled,
    toggleSound,
    playHover: () => safePlay(playHover),
    playClick: () => safePlay(playClick),
    playSuccess: () => safePlay(playSuccess),
    playError: () => safePlay(playError),
    playNotification: () => safePlay(playNotification),
  };
}
