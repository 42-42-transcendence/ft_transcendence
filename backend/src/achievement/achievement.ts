interface Achievement {
  id: number;
  name: string;
  icon: string;
  description: string;
}

export enum Achievements {
  FIRSTWIN,
  WELCOME,
}

export const achievements: Achievement[] = [
  {
    id: Achievements.WELCOME,
    icon: 'welcome',
    name: ' Hello World ',
    description: 'Pong의 세계에 온걸 환영합니다!',
  },
  {
    id: Achievements.FIRSTWIN,
    icon: 'firstwin',
    name: '첫 승리!',
    description: '첫 승리를 따내셨군요!',
  },
];
