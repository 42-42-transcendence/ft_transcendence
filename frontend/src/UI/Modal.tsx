import { createPortal } from 'react-dom';

import styles from '../styles/Modal.module.css';
import BackdropOverlay from './BackdropOverlay';

type ModalOverlayProps = {
  children: React.ReactNode;
};

type Props = {
  children: React.ReactNode;
  onClose?: () => void;
};

const overlayModalElement = document.getElementById('overlay') as HTMLElement;

const ModalOverlay = ({ children }: ModalOverlayProps) => {
  return <div className={styles.modal}>{children}</div>;
};

const Modal = ({ children, onClose }: Props) => {
  return (
    <>
      <BackdropOverlay onClose={onClose} />
      {createPortal(
        <ModalOverlay>{children}</ModalOverlay>,
        overlayModalElement
      )}
    </>
  );
};
export default Modal;
