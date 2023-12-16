interface Achievement {
  id: number;
  name: string;
  description: string;
}

export enum Achievements {
  WELCOME,
  FIRSTGAME,
  FIRSTWIN,
  WIN10,
  WIN42,
  FIRSTLOSE,
  FIRSTLADDER,
  POINT1200,
  POINT1400,
  POINT1600,
}

export const achievements: Achievement[] = [
  {
    id: Achievements.WELCOME,
    name: '🌍',
    description: 'Pong의 세계에 온걸 환영합니다!',
  },
  {
    id: Achievements.FIRSTGAME,
    name: '🤺',
    description: '첫 경기!',
  },
  {
    id: Achievements.FIRSTWIN,
    name: '🎉',
    description: '첫 승리를 따내셨군요!',
  },
  {
    id: Achievements.WIN10,
    name: '😏',
    description: '10승 달성!',
  },
  {
    id: Achievements.WIN42,
    name: '😎',
    description: '42승 달성!',
  },
  {
    id: Achievements.FIRSTLOSE,
    name: '🤕',
    description: '첫 패배...',
  },
  {
    id: Achievements.FIRSTLADDER,
    name: '🎖',
    description: '첫 랭크 게임 완료!',
  },
  {
    id: Achievements.POINT1200,
    name: '🥉',
    description: 'Bronze 등급 달성! (Rating 1200 ↑)',
  },
  {
    id: Achievements.POINT1400,
    name: '🥈',
    description: 'Silver 등급 달성! (Rating 1400 ↑)',
  },
  {
    id: Achievements.POINT1600,
    name: '🥇',
    description: 'Gold 등급 달성! (Rating 1600 ↑)',
  },
];
