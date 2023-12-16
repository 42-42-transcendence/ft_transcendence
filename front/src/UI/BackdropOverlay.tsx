import { createPortal } from 'react-dom';
import styles from '../styles/Backdrop.module.css';

const overlayElement = document.getElementById('overlay') as HTMLElement;

type Props = {
  onClose?: () => void;
};

const BackdropOverlay = ({ onClose }: Props) => {
  return createPortal(
    <div className={styles.backdrop} onClick={onClose}></div>,
    overlayElement
  );
};
export default BackdropOverlay;
