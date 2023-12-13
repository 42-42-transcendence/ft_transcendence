interface Achievement {
  id: number;
  name: string;
  description: string;
}

export enum Achievements {
  WELCOME,
  FIRSTGAME,
  FIRSTWIN,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
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
    id: Achievements.FIRSTGAME,
    name: '🎉',
    description: '첫 승리를 따내셨군요!',
  },
  {
    id: Achievements.FOUR,
    name: '😏',
    description: '10승 달성!',
  },
  {
    id: Achievements.FIVE,
    name: '😎',
    description: '42승 달성!',
  },
  {
    id: Achievements.SIX,
    name: '🤕',
    description: '첫 패배...',
  },
  {
    id: Achievements.SEVEN,
    name: '🎖',
    description: '첫 랭크 게임 완료!',
  },
  {
    id: Achievements.EIGHT,
    name: '🥉',
    description: 'Bronze 등급 달성! (Rating 1200 ↑)',
  },
  {
    id: Achievements.NINE,
    name: '🥈',
    description: 'Silver 등급 달성! (Rating 1400 ↑)',
  },
  {
    id: Achievements.TEN,
    name: '🥇',
    description: 'Gold 등급 달성! (Rating 1600 ↑)',
  },
];
