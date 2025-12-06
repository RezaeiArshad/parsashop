import { useContext } from 'react';
import { ConfirmBoxContext } from '../contexts/confirmBoxContext';

export default function ConfirmBox() {
    const { confirmBox, setConfirmBox } = useContext(ConfirmBoxContext);

    if (!confirmBox.isOpen) return null;

    const handleConfirm = () => {
        confirmBox.onConfirm?.();
        setConfirmBox({ ...confirmBox, isOpen: false });
    };

    const handleCancel = () => {
        confirmBox.onCancel?.();
        setConfirmBox({ ...confirmBox, isOpen: false });
    };

    return (
        <div className="confirm-box-overlay">
            <div className="confirm-box">
                <h2>{confirmBox.title}</h2>
                <p>{confirmBox.message}</p>
                <div className="confirm-box-buttons">
                    <button onClick={handleConfirm} className="btn-confirm">
                        {confirmBox.confirmText || 'Confirm'}
                    </button>
                    <button onClick={handleCancel} className="btn-cancel">
                        {confirmBox.cancelText || 'Cancel'}
                    </button>
                </div>
            </div>
        </div>
    );
}