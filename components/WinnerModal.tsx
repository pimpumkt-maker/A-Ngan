
import React from 'react';
import type { Participant } from '../types';

interface WinnerModalProps {
  winner: Participant | null;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onClose }) => {
  if (!winner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 max-w-sm w-full text-center transform transition-all duration-300 scale-95 animate-modal-pop-in">
        <h2 className="text-2xl font-bold text-gray-500 mb-2">Chúc Mừng!</h2>
        <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse mb-6">
          {winner.name}
        </p>
        <p className="text-lg text-gray-700 mb-6">Đã được chọn để đại diện cầu nguyện.</p>
        <button
          onClick={onClose}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-transform transform hover:scale-105"
        >
          Tuyệt vời!
        </button>
      </div>
      <style>{`
        @keyframes modal-pop-in {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modal-pop-in {
          animation: modal-pop-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WinnerModal;
