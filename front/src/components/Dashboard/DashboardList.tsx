import DashboardItem from './DashboardItem';

import styles from '../../styles/Dashboard.module.css';

type DUMMY_TYPE = {
  id: string;
  image: string;
  mode: 'normal' | 'fast' | 'object';
  isWin: boolean;
  type: 'ladder' | 'friendly';
  score: string;
};
const DUMMY_ITEMS: DUMMY_TYPE[] = [
  {
    id: '이지수',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    mode: 'object',
    isWin: true,
    type: 'ladder',
    score: '7:3',
  },
  {
    id: '김말봉',
    image:
      'https://images.unsplash.com/photo-1698444214003-dfdea976064a?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8',
    mode: 'normal',
    isWin: false,
    type: 'friendly',
    score: '4:6',
  },
  {
    id: 'abcdef',
    image:
      'https://images.unsplash.com/photo-1698508679270-f7d22cc08f86?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHx8',
    mode: 'fast',
    isWin: false,
    type: 'friendly',
    score: '4:6',
  },
  {
    id: 'bbbbasd',
    image:
      'https://images.unsplash.com/photo-1682685797365-41f45b562c0a?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8',
    mode: 'normal',
    isWin: true,
    type: 'ladder',
    score: '7:3',
  },
  {
    id: 'cccccc',
    image:
      'https://images.unsplash.com/photo-1682687221248-3116ba6ab483?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D',
    mode: 'object',
    isWin: false,
    type: 'friendly',
    score: '4:6',
  },
  {
    id: 'ddddadd',
    image:
      'https://images.unsplash.com/photo-1682685797365-41f45b562c0a?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8',
    mode: 'object',
    isWin: false,
    type: 'ladder',
    score: '4:6',
  },
  {
    id: 'e',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    mode: 'normal',
    isWin: false,
    type: 'friendly',
    score: '4:6',
  },
  {
    id: 'f',
    image:
      'https://images.unsplash.com/photo-1682685797365-41f45b562c0a?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8',
    mode: 'normal',
    isWin: false,
    type: 'ladder',
    score: '4:6',
  },
  {
    id: 'g',
    image:
      'https://images.unsplash.com/photo-1682687221248-3116ba6ab483?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D',
    mode: 'normal',
    isWin: true,
    type: 'friendly',
    score: '7:3',
  },
  {
    id: 'h',
    image:
      'https://plus.unsplash.com/premium_photo-1664868839960-bb0ca1944bef?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMnx8fGVufDB8fHx8fA%3D%3D',
    mode: 'normal',
    isWin: true,
    type: 'ladder',
    score: '7:3',
  },
  {
    id: 'i',
    image:
      'https://images.unsplash.com/photo-1682685797365-41f45b562c0a?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8',
    mode: 'object',
    isWin: false,
    type: 'ladder',
    score: '4:6',
  },
  {
    id: 'j',
    image:
      'https://images.unsplash.com/photo-1682685797365-41f45b562c0a?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8',
    mode: 'normal',
    isWin: false,
    type: 'friendly',
    score: '4:6',
  },
  {
    id: 'k',
    image:
      'https://images.unsplash.com/photo-1698444214003-dfdea976064a?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHx8',
    mode: 'normal',
    isWin: true,
    type: 'ladder',
    score: '7:3',
  },
  {
    id: 'l',
    image:
      'https://images.unsplash.com/photo-1682685797365-41f45b562c0a?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8',
    mode: 'object',
    isWin: false,
    type: 'ladder',
    score: '4:6',
  },
  {
    id: 'm',
    image:
      'https://images.unsplash.com/photo-1682685797365-41f45b562c0a?auto=format&fit=crop&q=60&w=800&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8',
    mode: 'normal',
    isWin: true,
    type: 'friendly',
    score: '7:3',
  },
];

type Props = {
  selectedOption: string;
};

const DashboardList = ({ selectedOption }: Props) => {
  const dashboardItemList = DUMMY_ITEMS.filter(
    (item) => selectedOption === item.type || selectedOption === 'all'
  ).map((item) => (
    <DashboardItem
      key={item.id}
      id={item.id}
      image={item.image}
      mode={item.mode}
      isWin={item.isWin}
      type={item.type}
      score={item.score}
    />
  ));

  if (dashboardItemList.length === 0) return <h1>No history available.</h1>;
  else return <ul className={styles.items}>{dashboardItemList}</ul>;
};
export default DashboardList;
