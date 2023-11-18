import { createPortal } from 'react-dom';

import styles from '../styles/Modal.module.css';

type BackdropOverlayProps = {
  onClose?: () => void;
};

type ModalOverlayProps = {
  children: React.ReactNode;
};

type Props = {
  children: React.ReactNode;
  onClose?: () => void;
};

const overlayModalElement = document.getElementById(
  'overlay-modal'
) as HTMLElement;

const BackdropOverlay = ({ onClose }: BackdropOverlayProps) => {
  return <div className={styles.backdrop} onClick={onClose}></div>;
};

const ModalOverlay = ({ children }: ModalOverlayProps) => {
  return <div className={styles.modal}>{children}</div>;
};

const Modal = ({ children, onClose }: Props) => {
  return (
    <>
      {createPortal(<BackdropOverlay onClose={onClose} />, overlayModalElement)}
      {createPortal(
        <ModalOverlay>{children}</ModalOverlay>,
        overlayModalElement
      )}
    </>
  );
};
export default Modal;
