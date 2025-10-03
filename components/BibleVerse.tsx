import React from 'react';

interface BibleVerseProps {
  verse: {
    text: string;
    reference: string;
  } | null;
}

const BibleVerse: React.FC<BibleVerseProps> = ({ verse }) => {
  if (!verse) {
    return null;
  }

  return (
    <div className="w-96 p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-center">
      <blockquote className="text-2xl italic text-gray-300">
        “{verse.text}”
      </blockquote>
      <cite className="block mt-4 text-right text-lg text-gray-500 not-italic">
        - {verse.reference}
      </cite>
    </div>
  );
};

export default BibleVerse;