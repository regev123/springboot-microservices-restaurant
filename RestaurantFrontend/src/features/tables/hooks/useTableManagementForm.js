import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTables, createTable, updateTable, deleteTable } from '../../../store/thunks/tableThunks';
import { scrollToTop } from '../../../utils/scrollUtils';
import { addToast } from '../../../store/slices/uiSlice';

const INITIAL_FORM_DATA = {
  capacity: '',
  location: '',
  isActive: true,
};

const INITIAL_FORM_ERRORS = {
  capacity: '',
  location: '',
};

const VALIDATION_RULES = {
  capacity: {
    required: true,
    pattern: /^[1-9]\d*$/,
    message: 'Capacity must be at least 1',
  },
  location: {
    required: false,
    pattern: /^.{0,100}$/,
    message: 'Location cannot exceed 100 characters',
  },
};

const useTableManagementForm = () => {
  const { tables, loading } = useSelector((state) => state.tables);
  const dispatch = useDispatch();

  const [addMode, setAddMode] = useState(true);
  const [editingTable, setEditingTable] = useState(null);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation dialog state for reserved tables
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    tableId: null,
    tableNumber: null,
  });

  // Load tables on mount
  useEffect(() => {
    dispatch(fetchTables());
  }, [dispatch]);

  // Validation function
  const validateField = (name, value) => {
    const rule = VALIDATION_RULES[name];
    if (!rule) return '';

    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (rule.pattern && value && !rule.pattern.test(value.toString())) {
      return rule.message;
    }

    return '';
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    setFormErrors((prev) => ({ ...prev, [field]: '' }));

    // Validate field
    const error = validateField(field, value);
    setFormErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Validate entire form
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    Object.keys(VALIDATION_RULES).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  // Handle add or edit
  const handleAddOrEditTable = async () => {
    if (!validateForm()) {
      scrollToTop();
      return;
    }

    setIsSubmitting(true);

    try {
      const tableData = {
        capacity: parseInt(formData.capacity),
        location: formData.location || null,
        isActive: formData.isActive,
        ...(addMode ? {} : { id: editingTable.id }),
      };

      if (addMode) {
        await dispatch(createTable(tableData)).unwrap();
      } else {
        await dispatch(updateTable(tableData)).unwrap();
      }

      // Reset form
      setFormData(INITIAL_FORM_DATA);
      setFormErrors(INITIAL_FORM_ERRORS);
      setAddMode(true);
      setEditingTable(null);
      scrollToTop();
    } catch (error) {
      console.error('Error saving table:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Switch to edit mode
  const handleSwitchToEditMode = (table) => {
    setEditingTable(table);
    setAddMode(false);
    setFormData({
      // tableNumber is not editable, it's shown in EditableEntityView
      capacity: table.capacity.toString(),
      location: table.location || '',
      isActive: table.isActive,
    });
    setFormErrors(INITIAL_FORM_ERRORS);
    scrollToTop();
  };

  // Switch to add mode
  const handleSwitchToAddMode = () => {
    setAddMode(true);
    setEditingTable(null);
    setFormData(INITIAL_FORM_DATA);
    setFormErrors(INITIAL_FORM_ERRORS);
    scrollToTop();
  };

  // Handle delete with status validation
  const handleDeleteTable = (tableId) => {
    // Find the table to check its status
    const table = tables.find((t) => t.id === tableId);
    
    if (!table) {
      dispatch(addToast({ type: 'error', message: 'Table not found' }));
      return;
    }

    // Check if table is OCCUPIED - prevent deletion
    if (table.status === 'OCCUPIED') {
      dispatch(addToast({ 
        type: 'error', 
        message: `Cannot delete table #${table.tableNumber}. The table is currently occupied. Please clear the table first.` 
      }));
      return;
    }

    // Check if table is RESERVED - show confirmation dialog
    if (table.status === 'RESERVED') {
      setConfirmationDialog({
        isOpen: true,
        tableId: tableId,
        tableNumber: table.tableNumber,
      });
      return;
    }

    // For other statuses (AVAILABLE, CLEANING), proceed with deletion
    dispatch(deleteTable(tableId));
  };

  // Handle confirmation dialog confirm
  const handleConfirmDelete = () => {
    if (confirmationDialog.tableId) {
      dispatch(deleteTable(confirmationDialog.tableId));
      setConfirmationDialog({
        isOpen: false,
        tableId: null,
        tableNumber: null,
      });
    }
  };

  // Handle confirmation dialog cancel
  const handleCancelDelete = () => {
    setConfirmationDialog({
      isOpen: false,
      tableId: null,
      tableNumber: null,
    });
  };

  return {
    formData,
    addMode,
    editingTable,
    handleInputChange,
    handleAddOrEditTable,
    handleSwitchToEditMode,
    handleDeleteTable,
    handleSwitchToAddMode,
    handleConfirmDelete,
    handleCancelDelete,
    formErrors,
    isSubmitting,
    loading,
    confirmationDialog,
  };
};

export default useTableManagementForm;
