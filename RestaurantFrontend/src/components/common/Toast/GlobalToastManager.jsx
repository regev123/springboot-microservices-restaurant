import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ToastContainer from './ToastContainer';
import { removeToast } from '../../../store/slices/uiSlice';

const GlobalToastManager = () => {
  const dispatch = useDispatch();
  const { toasts } = useSelector((state) => state.ui);

  const handleRemoveToast = (toastId) => {
    dispatch(removeToast(toastId));
  };

  return (
    <>
      {/* Toast System */}
      {toasts.length > 0 && <ToastContainer toasts={toasts} onRemove={handleRemoveToast} />}
    </>
  );
};

export default GlobalToastManager;
