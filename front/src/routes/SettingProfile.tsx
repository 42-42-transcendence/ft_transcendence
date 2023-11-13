import { ActionFunctionArgs, json, redirect } from 'react-router-dom';
import SettingProfileForm from '../components/SettingProfile/SettingProfileForm';
import store from '../store';
import { actions as authActions } from '../store/auth';

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
      return json({ errorMessage: '이미지 파일은 3MB가 최대입니다.' });
    }
  }
  if (name.length < 4 || name.length > 8) {
    return json({ errorMessage: '닉네임 길이는 4~8자 입니다.' });
  }

  store.dispatch(authActions.setUserID(name));
  return redirect('/');
};

export { action };
export default SettingProfilePage;
