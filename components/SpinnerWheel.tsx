import React, { useMemo } from 'react';
import { PARTICIPANTS } from '../constants';
import type { Participant } from '../types';

interface SpinnerWheelProps {
  rotation: number;
  isSpinning: boolean;
  onSpinClick: () => void;
}

const SpinnerWheel: React.FC<SpinnerWheelProps> = ({ rotation, isSpinning, onSpinClick }) => {
  const wheelSize = 691; // 576 * 1.2
  const textRadius = wheelSize * 0.35;
  const sliceAngle = 360 / PARTICIPANTS.length;

  const conicGradient = useMemo(() => {
    let gradient = 'conic-gradient(';
    let currentAngle = 0;
    PARTICIPANTS.forEach(p => {
      gradient += `${p.color} ${currentAngle}deg ${currentAngle + sliceAngle}deg, `;
      currentAngle += sliceAngle;
    });
    return gradient.slice(0, -2) + ')';
  }, [sliceAngle]);

  const labels = useMemo(() => {
    return PARTICIPANTS.map((p, index) => {
      const middleAngle = index * sliceAngle + sliceAngle / 2;

      const x = Math.sin((middleAngle * Math.PI) / 180) * textRadius;
      const y = -Math.cos((middleAngle * Math.PI) / 180) * textRadius;

      return (
        <div
          key={index}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-base select-none"
          style={{
            transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${middleAngle}deg)`,
          }}
        >
          {p.name}
        </div>
      );
    });
  }, [textRadius, sliceAngle]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Pointer */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20" style={{ filter: 'drop-shadow(0 4px 3px rgba(0,0,0,0.3))' }}>
        <div className="w-0 h-0 border-l-[22px] border-l-transparent border-r-[22px] border-r-transparent border-t-[43px] border-t-red-600"></div>
      </div>

      {/* Wheel Container */}
      <div
        className="relative rounded-full shadow-2xl"
        style={{
          width: `${wheelSize}px`,
          height: `${wheelSize}px`,
        }}
      >
        <div
          className="w-full h-full rounded-full border-8 border-yellow-300"
          style={{
            background: conicGradient,
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
          }}
        >
          {labels}
        </div>
      </div>

      {/* Center Button */}
      <div className="absolute w-56 h-56 rounded-full bg-white shadow-inner flex items-center justify-center z-10">
        <button
          onClick={onSpinClick}
          disabled={isSpinning}
          className="w-48 h-48 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-5xl font-bold shadow-lg transition-transform duration-200 ease-in-out enabled:hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Xin Mời
        </button>
      </div>
    </div>
  );
};

export default SpinnerWheel;