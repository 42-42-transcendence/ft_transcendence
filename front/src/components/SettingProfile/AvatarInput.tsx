import { useState } from 'react';

import styles from '../../styles/SettingProfileForm.module.css';
import defaultThumNailURI from '../../assets/42logo.svg';
import AvatarImage from '../../UI/AvatarImage';

const AvatarInput = () => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const avatarFileURI =
    avatarFile === null ? defaultThumNailURI : URL.createObjectURL(avatarFile);

  const avatarChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || e.target.files.length !== 1) return;

    const fileList = e.target.files as FileList;
    const inputFile = fileList[0];

    setAvatarFile(inputFile);
  };

  return (
    <div className={styles.avatar} style={{ cursor: 'pointer' }}>
      <label htmlFor="avatar">
        <div>프로필 이미지</div>
        <div>
          <AvatarImage imageURI={avatarFileURI} radius="200px" />
        </div>
      </label>
      <input
        type="file"
        id="avatar"
        name="avatar"
        onChange={avatarChangeHandler}
      />
    </div>
  );
};
export default AvatarInput;
