import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  createKitchenStation,
  updateKitchenStation,
  deleteKitchenStation,
} from '../../../store/thunks/menuThunks';
import { scrollToTop } from '../../../utils/scrollUtils';

// Constants for Kitchen Station Manager Form
const INITIAL_FORM_DATA = {
  name: '',
  isActive: true,
};

const INITIAL_FORM_ERRORS = {
  name: '',
  isActive: '',
};

const VALIDATION_RULES = {
  name: {
    required: true,
    maxLength: 100,
    pattern: /^[A-Za-z0-9\s\-'&.,]{1,100}$/,
    message:
      'Station name is required and must be 1-100 characters containing only letters, numbers, spaces, hyphens, apostrophes, ampersands, periods, and commas',
  },
  isActive: {
    required: true,
    message: 'IsActive flag is required',
  },
};

const useKitchenStationManagerForm = () => {
  const { kitchenStations } = useSelector((state) => state.menu);
  const dispatch = useDispatch();

  const [addMode, setAddMode] = useState(true);
  const [editingKitchenStation, setEditingKitchenStation] = useState(null);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState(INITIAL_FORM_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log(formErrors);
  }, [formErrors]);

  // Validation functions
  const validateField = (name, value) => {
    const rule = VALIDATION_RULES[name];
    if (!rule) return '';

    // Required validation
    if (rule.required) {
      if (typeof value === 'boolean') {
        // For boolean fields like isActive - only null/undefined are invalid
        if (value === null || value === undefined) {
          return rule.message;
        }
        // Boolean false is valid, so return empty string
        return '';
      } else {
        // For string fields like name
        if (!value || !value.toString().trim()) {
          return rule.message;
        }
      }
    }

    // Pattern validation (only for string fields)
    if (rule.pattern && value && typeof value === 'string' && !rule.pattern.test(value)) {
      return rule.message;
    }

    // MaxLength validation (only for string fields)
    if (rule.maxLength && value && typeof value === 'string' && value.length > rule.maxLength) {
      return rule.message;
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(VALIDATION_RULES).forEach((field) => {
      const value = formData[field] ?? '';
      const error = validateField(field, value);
      newErrors[field] = error;
      if (error) isValid = false;
    });

    setFormErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleAddOrEditKitchenStation = async () => {
    setIsSubmitting(true);
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await dispatch(
        addMode
          ? createKitchenStation(formData)
          : updateKitchenStation({ ...formData, id: editingKitchenStation.id })
      ).unwrap();
      resetForm();
      addMode ? resetForm() : handleSwitchToAddMode();
    } catch (error) {
      return;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setFormErrors(INITIAL_FORM_ERRORS);
  };

  // Mode switching functions (now using internal state)
  const handleSwitchToAddMode = () => {
    resetForm();
    setAddMode(true);
    setEditingKitchenStation(null);
  };

  const handleSwitchToEditMode = (kitchenStation) => {
    resetForm();
    setEditingKitchenStation(kitchenStation);
    setAddMode(false);
    setFormData((prev) => ({
      ...prev,
      name: kitchenStation.name,
      isActive: kitchenStation.isActive,
    }));

    scrollToTop();
  };

  const handleDeleteKitchenStation = (kitchenStationId) => {
    dispatch(deleteKitchenStation(kitchenStationId));
  };

  return {
    formData,
    formErrors,
    isSubmitting,
    addMode,
    kitchenStations,
    handleSwitchToAddMode,
    handleSwitchToEditMode,
    handleInputChange,
    handleAddOrEditKitchenStation,
    handleDeleteKitchenStation,
  };
};

export default useKitchenStationManagerForm;
