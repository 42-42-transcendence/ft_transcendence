import styles from '../styles/SettingProfileForm.module.css';

type Props = {
  imageURI: string;
  radius: string;
};

const AvatarImage = ({ imageURI, radius }: Props) => {
  return (
    <div className={styles.outer} style={{ width: radius, paddingTop: radius }}>
      <img className={styles.inner} src={imageURI} alt="avatar" />
    </div>
  );
};

export default AvatarImage;
