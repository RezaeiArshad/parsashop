import { useContext } from 'react';
import { ConfirmBoxContext } from '../contexts/confirmBoxContext';

export default function useConfirm() {
  const { setConfirmBox } = useContext(ConfirmBoxContext);

  return function showConfirm(message) {
    return new Promise((resolve) => {
      setConfirmBox({ isOpen: true, message, resolve });
    });
  };
}
