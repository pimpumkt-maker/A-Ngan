
import React, { useState, useCallback, useEffect, useRef } from 'react';
import SpinnerWheel from './components/SpinnerWheel';
import WinnerModal from './components/WinnerModal';
import { PARTICIPANTS } from './constants';
import type { Participant } from './types';
import BibleVerse from './components/BibleVerse';
import { VERSES } from './verses';

// --- Sound Feature ---
const SPIN_SOUND_URL = 'https://cdn.pixabay.com/audio/2022/03/15/audio_2b31b679a7.mp3';
const WINNER_SOUND_URL = 'https://cdn.pixabay.com/audio/2022/11/17/audio_88c0135b23.mp3';

const MutedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6.375a9 9 0 0 1 12.728 0M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
);

const UnmutedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
);
// --- End Sound Feature ---

const App: React.FC = () => {
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [verseLeft, setVerseLeft] = useState<{ text: string; reference: string } | null>(null);
  const [verseRight, setVerseRight] = useState<{ text: string; reference: string } | null>(null);

  // --- Sound Feature State & Logic ---
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winnerSoundRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const savedMuteState = localStorage.getItem('isMuted');
    if (savedMuteState !== null) {
      setIsMuted(savedMuteState === 'true');
    }
    
    spinSoundRef.current = new Audio(SPIN_SOUND_URL);
    winnerSoundRef.current = new Audio(WINNER_SOUND_URL);
  }, []);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    localStorage.setItem('isMuted', String(newMutedState));
  };
  // --- End Sound Feature State & Logic ---

  const updateVerses = useCallback(() => {
    if (VERSES.length < 2) {
      const verse = VERSES.length > 0 ? VERSES[0] : null;
      setVerseLeft(verse);
      setVerseRight(verse);
      return;
    }

    let index1 = Math.floor(Math.random() * VERSES.length);
    let index2;
    do {
      index2 = Math.floor(Math.random() * VERSES.length);
    } while (index1 === index2);

    setVerseLeft(VERSES[index1]);
    setVerseRight(VERSES[index2]);
  }, []);

  useEffect(() => {
    // Initial update on load
    updateVerses();

    // Fix: Use `ReturnType<typeof setTimeout>` for timeout and interval IDs, which is environment-agnostic.
    // In the browser, this resolves to `number`, which is the correct type for `setTimeout` and `setInterval`.
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    const scheduleNextUpdate = () => {
      const now = new Date();
      const next7AM = new Date(now);
      next7AM.setHours(7, 0, 0, 0);

      if (now.getTime() > next7AM.getTime()) {
        // If it's past 7 AM today, schedule for 7 AM tomorrow
        next7AM.setDate(next7AM.getDate() + 1);
      }

      const delay = next7AM.getTime() - now.getTime();

      timeoutId = setTimeout(() => {
        updateVerses();
        // After the first scheduled update, update every 24 hours
        intervalId = setInterval(updateVerses, 24 * 60 * 60 * 1000);
      }, delay);
    };
    
    scheduleNextUpdate();

    // Cleanup function to clear timers when component unmounts
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [updateVerses]);

  const handleSpinClick = useCallback(() => {
    if (isSpinning) return;

    if (!isMuted && spinSoundRef.current) {
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play().catch(e => console.error("Error playing spin sound:", e));
    }

    setIsSpinning(true);
    setWinner(null);

    // 1. Select a winner with equal probability
    const winnerIndex = Math.floor(Math.random() * PARTICIPANTS.length);
    const selectedWinner = PARTICIPANTS[winnerIndex];
    
    // 2. Calculate the position of the winner's slice
    const sliceAngle = 360 / PARTICIPANTS.length;
    const winnerSliceStart = winnerIndex * sliceAngle;
    
    // 3. Determine a random stopping point within the winner's slice
    const randomOffset = Math.random() * sliceAngle;
    const stopAngle = winnerSliceStart + randomOffset;
    
    // 4. Calculate final rotation
    const fullSpins = 5;
    const currentRotationOffset = rotation % 360;
    const newRotation = (fullSpins * 360) + 360 - stopAngle - currentRotationOffset;
    
    setRotation(rotation + newRotation);

    // 5. Set winner after animation
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(selectedWinner);
      if (!isMuted && winnerSoundRef.current) {
        winnerSoundRef.current.currentTime = 0;
        winnerSoundRef.current.play().catch(e => console.error("Error playing winner sound:", e));
      }
    }, 5000); // Must match CSS transition duration

  }, [isSpinning, rotation, isMuted]);
  
  const handleCloseModal = () => {
    setWinner(null);
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4 text-white font-sans overflow-hidden">
        <button 
          onClick={toggleMute}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white z-30"
          aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
        >
          {isMuted ? <MutedIcon /> : <UnmutedIcon />}
        </button>

        <div className="text-center mb-8">
            <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-700">
                Vòng Quay Cầu Nguyện
            </h1>
            <p className="mt-2 text-lg text-gray-400">
                Ai sẽ là người may mắn được chọn cầu nguyện hôm nay?
            </p>
        </div>
        <div className="flex-grow flex items-center justify-center w-full">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full px-4 md:px-8 lg:px-16">
                <BibleVerse verse={verseLeft} />
                <SpinnerWheel
                    rotation={rotation}
                    isSpinning={isSpinning}
                    onSpinClick={handleSpinClick}
                />
                <BibleVerse verse={verseRight} />
            </div>
        </div>
        <WinnerModal winner={winner} onClose={handleCloseModal} />
        <footer className="absolute bottom-4 text-gray-500 text-sm">
            Tạo bởi Ngan Rng trên ứng dung Gemini.
        </footer>
    </main>
  );
};

export default App;
