import { useParams } from 'react-router-dom';

const ChattingPage = () => {
  const params = useParams();
  return <h1>Chatting Room {params.chatID} Page</h1>;
};
export default ChattingPage;
