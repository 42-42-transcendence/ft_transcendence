import { useParams } from 'react-router-dom';
import Chatting from '../components/Chatting';

const ChattingPage = () => {
  const params = useParams();
  console.log(params.chatID);
  console.log(params.mode);

  return (
    <>
      <h1>Chatting Room Page</h1>
      <Chatting />
    </>
  );
};
export default ChattingPage;
