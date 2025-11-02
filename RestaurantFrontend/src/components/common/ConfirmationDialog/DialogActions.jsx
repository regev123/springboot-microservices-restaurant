import React from 'react';
import FormButton from '../Button2/FormButton';

// ==================== CONSTANTS ====================
const DIALOG_TYPES = {
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
};

// ==================== PROP TYPES ====================
/**
 * @typedef {Object} DialogActionsProps
 * @property {string} type - Dialog type
 * @property {string} confirmText - Text for confirm button
 * @property {string} cancelText - Text for cancel button
 * @property {Function} onConfirm - Confirm action handler
 * @property {Function} onClose - Close action handler
 * @property {boolean} isLoading - Loading state
 */

/**
 * DialogActions Component
 *
 * Handles the action buttons for confirmation dialogs.
 * Follows Single Responsibility Principle - only manages button actions.
 *
 * @param {DialogActionsProps} props - Component props
 * @returns {JSX.Element} Dialog actions component
 */
const DialogActions = ({ type, confirmText, cancelText, onConfirm, onClose, isLoading }) => {
  // ==================== COMPUTED VALUES ====================

  const getConfirmButtonType = () => {
    return type === DIALOG_TYPES.DANGER ? 'red' : 'green';
  };

  const getConfirmButtonIcon = () => {
    return type === DIALOG_TYPES.DANGER ? 'delete' : 'save';
  };

  // ==================== RENDER ====================

  return (
    <div className="flex items-center justify-end gap-3 mt-6">
      <FormButton
        type="default"
        text={cancelText}
        icon="cancel"
        onClick={onClose}
        disabled={isLoading}
        className="w-auto"
      />
      <FormButton
        type={getConfirmButtonType()}
        text={confirmText}
        icon={getConfirmButtonIcon()}
        onClick={onConfirm}
        disabled={isLoading}
        className="w-auto"
      />
    </div>
  );
};

export default DialogActions;
