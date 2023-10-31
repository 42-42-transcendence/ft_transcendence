import { createPortal } from 'react-dom';

import styles from '../styles/Modal.module.css';

type Props = {
  children: React.ReactNode;
};
const overlayRootElement = document.getElementById(
  'overlay-root'
) as HTMLElement;

const BackdropOverlay = () => {
  return <div className={styles.backdrop}></div>;
};

const ModalOverlay = ({ children }: Props) => {
  return <div className={styles.modal}>{children}</div>;
};

const Modal = ({ children }: Props) => {
  return (
    <>
      {createPortal(<BackdropOverlay />, overlayRootElement)}
      {createPortal(
        <ModalOverlay>{children}</ModalOverlay>,
        overlayRootElement
      )}
    </>
  );
};
export default Modal;
