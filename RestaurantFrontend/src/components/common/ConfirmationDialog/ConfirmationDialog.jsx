import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Trash2 } from 'lucide-react';
import DialogContent from './DialogContent';
import DialogContainer from './DialogContainer';
import DialogActions from './DialogActions';

// ==================== CONSTANTS ====================
const DIALOG_CONTAINER_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9999,
};

const DIALOG_CONTAINER_CLASSES = 'fixed inset-0 z-[9999] flex items-center justify-center p-4';

const DIALOG_TYPES = {
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
};

const KEYBOARD_KEYS = {
  ESCAPE: 'Escape',
  ENTER: 'Enter',
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Gets dialog configuration based on type
 * @param {string} type - Dialog type
 * @returns {Object} Dialog configuration object
 */
const getDialogConfiguration = (type) => {
  const configurations = {
    [DIALOG_TYPES.DANGER]: {
      icon: <Trash2 size={24} />,
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
    },
    [DIALOG_TYPES.INFO]: {
      icon: <AlertTriangle size={24} />,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    [DIALOG_TYPES.WARNING]: {
      icon: <AlertTriangle size={24} />,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
    },
  };

  return configurations[type] || configurations[DIALOG_TYPES.WARNING];
};

/**
 * Handles keyboard events for dialog
 * @param {KeyboardEvent} event - Keyboard event
 * @param {Function} onClose - Close handler
 * @param {Function} onConfirm - Confirm handler
 * @param {boolean} isLoading - Loading state
 */
const handleKeyboardEvent = (event, onClose, onConfirm, isLoading) => {
  if (event.key === KEYBOARD_KEYS.ESCAPE) {
    onClose();
  } else if (event.key === KEYBOARD_KEYS.ENTER && !isLoading) {
    onConfirm();
  }
};

/**
 * Manages body scroll when dialog is open/closed
 * @param {boolean} isOpen - Whether dialog is open
 */
const manageBodyScroll = (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : 'unset';
};

// ==================== PROP TYPES ====================
/**
 * @typedef {Object} ConfirmationDialogProps
 * @property {boolean} [isOpen=false] - Whether the dialog is visible
 * @property {Function} onClose - Function to call when dialog should close
 * @property {Function} onConfirm - Function to call when user confirms action
 * @property {string} [title='Confirm Action'] - Dialog title
 * @property {string} [message='Are you sure you want to proceed?'] - Dialog message/description
 * @property {string} [confirmText='Confirm'] - Text for confirm button
 * @property {string} [cancelText='Cancel'] - Text for cancel button
 * @property {string} [type='warning'] - Dialog type: 'warning', 'danger', 'info'
 * @property {boolean} [isLoading=false] - Whether the confirm action is in progress
 * @property {string} [className=''] - Additional CSS classes
 */

/**
 * ConfirmationDialog Component
 *
 * A modern, professional confirmation dialog following SOLID principles:
 * - Single Responsibility: Handles only dialog logic and rendering
 * - Open/Closed: Extensible through props and type system
 * - Dependency Inversion: Depends on abstractions (props) not concretions
 * - Interface Segregation: Clean, focused prop interface
 *
 * Features:
 * - Glass morphism design matching the app's aesthetic
 * - Animated backdrop and dialog entrance
 * - Customizable title, message, and button text
 * - Support for different dialog types (warning, danger, etc.)
 * - Keyboard navigation (ESC to close, Enter to confirm)
 * - Click outside to close functionality
 */
const ConfirmationDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = DIALOG_TYPES.WARNING,
  isLoading = false,
  className = '',
}) => {
  // ==================== CUSTOM HOOKS ====================

  /**
   * Handles keyboard events with proper cleanup
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      handleKeyboardEvent(event, onClose, onConfirm, isLoading);
    };

    document.addEventListener('keydown', handleKeyDown);
    manageBodyScroll(true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      manageBodyScroll(false);
    };
  }, [isOpen, onClose, onConfirm, isLoading]);

  // ==================== EVENT HANDLERS ====================

  /**
   * Handles backdrop click with proper validation
   */
  const handleBackdropClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget && !isLoading) {
        onClose();
      }
    },
    [onClose, isLoading]
  );

  // ==================== COMPUTED VALUES ====================

  const dialogConfig = getDialogConfiguration(type);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={DIALOG_CONTAINER_CLASSES}
      onClick={handleBackdropClick}
      style={DIALOG_CONTAINER_STYLES}
    >
      <DialogContainer
        onBackdropClick={handleBackdropClick}
        borderColor={dialogConfig.borderColor}
        className={className}
      >
        {/* Content */}
        <div className="p-6">
          <DialogContent
            icon={dialogConfig.icon}
            iconColor={dialogConfig.iconColor}
            iconBg={dialogConfig.iconBg}
            title={title}
            message={message}
          />

          <DialogActions
            type={type}
            confirmText={confirmText}
            cancelText={cancelText}
            onConfirm={onConfirm}
            onClose={onClose}
            isLoading={isLoading}
          />
        </div>
      </DialogContainer>
    </div>,
    document.body
  );
};

export default ConfirmationDialog;
