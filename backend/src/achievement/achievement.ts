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
    name: ' Hello World ',
    description: 'Pong의 세계에 온걸 환영합니다!',
  },
  {
    id: Achievements.FIRSTGAME,
    name: '첫 승리!',
    description: '첫 승리를 따내셨군요!',
  },
  {
    id: Achievements.FIRSTWIN,
    name: ' 3 ',
    description: '3번 도전과제',
  },
  {
    id: Achievements.FOUR,
    name: ' 4 ',
    description: '4번 도전과제',
  },
  {
    id: Achievements.FIVE,
    name: ' 5 ',
    description: '5번 도전과제',
  },
  {
    id: Achievements.SIX,
    name: ' 6 ',
    description: '6번 도전과제',
  },
  {
    id: Achievements.SEVEN,
    name: ' 7 ',
    description: '7번 도전과제',
  },
  {
    id: Achievements.EIGHT,
    name: ' 8 ',
    description: '8번 도전과제',
  },
  {
    id: Achievements.NINE,
    name: ' 9 ',
    description: '9번 도전과제',
  },
  {
    id: Achievements.TEN,
    name: ' 10 ',
    description: '10번 도전과제',
  },
];
