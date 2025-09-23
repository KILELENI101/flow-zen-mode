import { useCallback, useRef } from 'react';

// Sound categories and files
export const SOUND_CATEGORIES = {
  TIMER: {
    name: 'Timer Sounds',
    sounds: {
      START: { name: 'Session Start', file: '/sounds/timer/start.mp3' },
      END: { name: 'Session End', file: '/sounds/timer/end.mp3' },
      BREAK_START: { name: 'Break Start', file: '/sounds/timer/break-start.mp3' },
      BREAK_END: { name: 'Break End', file: '/sounds/timer/break-end.mp3' },
    }
  },
  FOCUS: {
    name: 'Focus Sounds',
    sounds: {
      RAIN: { name: 'Gentle Rain', file: '/sounds/focus/rain.mp3' },
      FOREST: { name: 'Forest Ambience', file: '/sounds/focus/forest.mp3' },
      WAVES: { name: 'Ocean Waves', file: '/sounds/focus/ocean.mp3' },
      WHITE_NOISE: { name: 'White Noise', file: '/sounds/focus/white-noise.mp3' },
      BROWN_NOISE: { name: 'Brown Noise', file: '/sounds/focus/brown-noise.mp3' },
      CAFE: { name: 'Coffee Shop', file: '/sounds/focus/cafe.mp3' },
      BIRDS: { name: 'Bird Songs', file: '/sounds/focus/birds.mp3' },
      FIRE: { name: 'Crackling Fire', file: '/sounds/focus/fire.mp3' },
    }
  },
  BREAK: {
    name: 'Break Sounds',
    sounds: {
      CHIMES: { name: 'Meditation Chimes', file: '/sounds/break/chimes.mp3' },
      BELLS: { name: 'Tibetan Bells', file: '/sounds/break/bells.mp3' },
      NATURE: { name: 'Nature Sounds', file: '/sounds/break/nature.mp3' },
      PIANO: { name: 'Soft Piano', file: '/sounds/break/piano.mp3' },
    }
  }
};

export interface SoundSettings {
  masterVolume: number;
  timerSoundsEnabled: boolean;
  focusSoundEnabled: boolean;
  breakSoundEnabled: boolean;
  currentFocusSound?: string;
  currentBreakSound?: string;
}

const DEFAULT_SETTINGS: SoundSettings = {
  masterVolume: 0.7,
  timerSoundsEnabled: true,
  focusSoundEnabled: false,
  breakSoundEnabled: false,
};

export function useSound() {
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const focusAudioRef = useRef<HTMLAudioElement | null>(null);
  const breakAudioRef = useRef<HTMLAudioElement | null>(null);

  // Get sound settings from localStorage
  const getSettings = useCallback((): SoundSettings => {
    try {
      const stored = localStorage.getItem('focusflow-sound-settings');
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }, []);

  // Save sound settings to localStorage
  const saveSettings = useCallback((settings: Partial<SoundSettings>) => {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem('focusflow-sound-settings', JSON.stringify(updated));
  }, [getSettings]);

  // Create or get audio element
  const getAudio = useCallback((soundPath: string): HTMLAudioElement => {
    if (!audioRefs.current.has(soundPath)) {
      const audio = new Audio();
      audio.preload = 'auto';
      
      // Handle loading errors gracefully
      audio.addEventListener('error', () => {
        console.warn('Failed to load audio file:', soundPath);
      });
      
      // Set source after event listeners
      audio.src = soundPath;
      audioRefs.current.set(soundPath, audio);
    }
    return audioRefs.current.get(soundPath)!;
  }, []);

  // Play timer sound (start, end, break start, break end)
  const playTimerSound = useCallback((soundType: keyof typeof SOUND_CATEGORIES.TIMER.sounds) => {
    const settings = getSettings();
    if (!settings.timerSoundsEnabled) return;

    try {
      // Use Web Audio API to generate simple beep sounds as fallback
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different sound types
      const frequencies = {
        START: 800,
        END: 600,
        BREAK_START: 400,
        BREAK_END: 500,
      };
      
      oscillator.frequency.setValueAtTime(frequencies[soundType], audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(settings.masterVolume * 0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Failed to play timer sound:', error);
    }
  }, [getSettings]);

  // Start focus sound (looping ambient sound)
  const startFocusSound = useCallback((soundKey?: string) => {
    const settings = getSettings();
    if (!settings.focusSoundEnabled) return;

    try {
      // Stop current focus sound
      if (focusAudioRef.current) {
        focusAudioRef.current.pause();
        focusAudioRef.current = null;
      }

      const soundToPlay = soundKey || settings.currentFocusSound;
      if (!soundToPlay) return;

      const soundPath = (SOUND_CATEGORIES.FOCUS.sounds as any)[soundToPlay]?.file;
      if (!soundPath) return;

      const audio = getAudio(soundPath);
      audio.volume = settings.masterVolume * 0.6; // Focus sounds quieter
      audio.loop = true;
      audio.currentTime = 0;
      audio.play().catch(console.warn);
      focusAudioRef.current = audio;
    } catch (error) {
      console.warn('Failed to start focus sound:', error);
    }
  }, [getAudio, getSettings]);

  // Stop focus sound
  const stopFocusSound = useCallback(() => {
    if (focusAudioRef.current) {
      focusAudioRef.current.pause();
      focusAudioRef.current = null;
    }
  }, []);

  // Start break sound (looping calm sound)
  const startBreakSound = useCallback((soundKey?: string) => {
    const settings = getSettings();
    if (!settings.breakSoundEnabled) return;

    try {
      // Stop current break sound
      if (breakAudioRef.current) {
        breakAudioRef.current.pause();
        breakAudioRef.current = null;
      }

      const soundToPlay = soundKey || settings.currentBreakSound;
      if (!soundToPlay) return;

      const soundPath = (SOUND_CATEGORIES.BREAK.sounds as any)[soundToPlay]?.file;
      if (!soundPath) return;

      const audio = getAudio(soundPath);
      audio.volume = settings.masterVolume * 0.5; // Break sounds even quieter
      audio.loop = true;
      audio.currentTime = 0;
      audio.play().catch(console.warn);
      breakAudioRef.current = audio;
    } catch (error) {
      console.warn('Failed to start break sound:', error);
    }
  }, [getAudio, getSettings]);

  // Stop break sound
  const stopBreakSound = useCallback(() => {
    if (breakAudioRef.current) {
      breakAudioRef.current.pause();
      breakAudioRef.current = null;
    }
  }, []);

  // Test play a sound
  const testSound = useCallback((category: keyof typeof SOUND_CATEGORIES, soundKey: string) => {
    const settings = getSettings();
    try {
      const categoryData = SOUND_CATEGORIES[category];
      const soundData = (categoryData.sounds as any)[soundKey];
      const soundPath = soundData?.file;
      if (!soundPath) return;

      const audio = getAudio(soundPath);
      audio.volume = settings.masterVolume;
      audio.currentTime = 0;
      audio.play().catch(console.warn);

      // Stop after 3 seconds for testing
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 3000);
    } catch (error) {
      console.warn('Failed to test sound:', error);
    }
  }, [getAudio, getSettings]);

  return {
    // Settings
    getSettings,
    saveSettings,
    
    // Timer sounds
    playTimerSound,
    
    // Focus sounds
    startFocusSound,
    stopFocusSound,
    
    // Break sounds
    startBreakSound,
    stopBreakSound,
    
    // Testing
    testSound,
    
    // Categories
    SOUND_CATEGORIES,
  };
}