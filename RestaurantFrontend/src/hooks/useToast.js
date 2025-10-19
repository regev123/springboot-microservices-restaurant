import { useDispatch } from 'react-redux';
import { addToast } from '../store/slices/uiSlice';

export const useToast = () => {
  const dispatch = useDispatch();

  const showToast = ({ type = 'info', message, duration = 5000 }) => {
    dispatch(addToast({ type, message, duration }));
  };

  const success = (message, duration) => {
    showToast({ type: 'success', message, duration });
  };

  const error = (message, duration) => {
    showToast({ type: 'error', message, duration });
  };

  const warning = (message, duration) => {
    showToast({ type: 'warning', message, duration });
  };

  const info = (message, duration) => {
    showToast({ type: 'info', message, duration });
  };

  return {
    showToast,
    success,
    error,
    warning,
    info,
  };
};

export default useToast;
