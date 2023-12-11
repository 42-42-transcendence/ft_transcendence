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
    name: '🎉',
    description: '첫 승리를 따내셨군요!',
  },
  {
    id: Achievements.FIRSTWIN,
    name: '🧑‍🤝‍🧑',
    description: '새 친구를 만들자',
  },
  {
    id: Achievements.FOUR,
    name: '🥊',
    description: '첫 랭크 게임 도전',
  },
  {
    id: Achievements.FIVE,
    name: '🧹',
    description: '퍼펙트 게임 성공!',
  },
  {
    id: Achievements.SIX,
    name: '🔟',
    description: '10승 달성!',
  },
  {
    id: Achievements.SEVEN,
    name: '4️⃣2️⃣',
    description: '42승 달성!',
  },
  {
    id: Achievements.EIGHT,
    name: '💯',
    description: '100승 달성!',
  },
  {
    id: Achievements.NINE,
    name: '🚫',
    description: '첫 차단',
  },
  {
    id: Achievements.TEN,
    name: '🕶️',
    description: '랭킹 1등',
  },
];
