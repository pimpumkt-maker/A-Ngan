
import type { Participant } from './types';

const PARTICIPANTS_DATA: { name: string }[] = [
  { name: 'Miên' },
  { name: 'Bác Hyuih' },
  { name: 'Ngan' },
  { name: 'Pâu' },
  { name: 'Bé' },
  { name: 'Oanh' },
  { name: 'Bác Un' },
  { name: 'Thắng' },
  { name: 'Xuân' },
  { name: 'Ms Chương' },
  { name: 'Chung' },
  { name: 'Phai' },
  { name: 'K Tôp' },
  { name: 'Beo' },
  { name: 'Ms Dè' },
  { name: 'Thầy N.H.Mi' },
];

const COLORS = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
  '#10b981', // emerald-500
  '#14b8a6', // teal-500
  '#06b6d4', // cyan-500
  '#0ea5e9', // sky-500
  '#3b82f6', // blue-500
  '#6366f1', // indigo-500
  '#8b5cf6', // violet-500
  '#a855f7', // purple-500
  '#d946ef', // fuchsia-500
  '#ec4899', // pink-500
  '#f59e0b', // amber-500
];

export const PARTICIPANTS: Participant[] = PARTICIPANTS_DATA.map((p, i) => ({
  ...p,
  color: COLORS[i % COLORS.length],
}));
