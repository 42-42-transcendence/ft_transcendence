import { ActionFunctionArgs, json, redirect } from 'react-router-dom';
import SettingProfileForm from '../components/SettingProfile/SettingProfileForm';
import { SERVER_URL } from '../App';

const SettingProfilePage = () => {
  return (
    <main>
      <h1>초기 설정</h1>
      <SettingProfileForm />
    </main>
  );
};

const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();

  const avatarFile = data.get('avatar') as File;
  const name = data.get('name') as string;

  const isDefaultAvatar = avatarFile.name === '' && avatarFile.size === 0;

  if (!isDefaultAvatar) {
    if (!avatarFile.type.startsWith('image'))
      return json({ errorMessage: '올바른 이미지 파일 형식이 아닙니다.' });
    if (avatarFile.size > 3 * 1024 * 1024) {
      return json({ errorMessage: '이미지 파일은 최대 3MB입니다.' });
    }
  }
  if (name.trim().length < 4 || name.trim().length > 8) {
    return json({ errorMessage: '닉네임 길이는 4~8자 입니다.' });
  }

  return redirect('/');
};

export default SettingProfilePage;
