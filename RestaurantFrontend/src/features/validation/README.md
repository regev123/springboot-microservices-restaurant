# Universal Validation System

A comprehensive, reusable validation system built with the Strategy Pattern for React forms. This system provides consistent validation across all forms in the application with maximum flexibility and reusability.

## 🚀 Quick Start

### Basic Usage

```javascript
import useFormValidation from '../validation/hooks/useFormValidation';
import {
  LOGIN_VALIDATION_RULES,
  LOGIN_INITIAL_DATA,
} from '../validation/configs/user/loginValidationConfig';

const MyForm = () => {
  const {
    formData,
    handleInputChange,
    validationErrors,
    isSubmitting,
    setIsSubmitting,
    validateForm,
    hasError,
    getError,
  } = useFormValidation(LOGIN_VALIDATION_RULES, LOGIN_INITIAL_DATA);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationResult = validateForm();
    if (!validationResult.isValid) {
      return; // Validation errors are automatically displayed
    }

    setIsSubmitting(true);
    try {
      // Your submission logic here
      await submitForm(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        value={formData.email}
        onChange={handleInputChange('email')}
        error={hasError('email') ? getError('email') : ''}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        text={isSubmitting ? 'Submitting...' : 'Submit'}
      />
    </form>
  );
};
```

## 📁 Architecture Overview

```
validation/
├── hooks/
│   └── useFormValidation.js          # Main validation hook
├── strategies/
│   ├── common/                       # Universal validation strategies
│   │   ├── ValidationStrategy.js     # Base strategy interface
│   │   ├── NameValidationStrategy.js # Universal name validation
│   │   └── RequiredValidationStrategy.js # Required field validation
│   └── user/                         # User-specific strategies
│       ├── EmailValidationStrategy.js
│       ├── PasswordValidationStrategy.js
│       └── PhoneValidationStrategy.js
├── configs/
│   └── user/                         # Form validation configurations
│       ├── loginValidationConfig.js
│       ├── registerValidationConfig.js
│       ├── changePasswordValidationConfig.js
│       └── userManagementValidationConfig.js
├── constants/
│   ├── user.js                       # User validation constants
│   └── names.js                      # Name validation constants
└── ValidationManager.js              # Strategy manager
```

## 🎉 Benefits

- ✅ **Universal Reusability** - One validation system for all forms
- ✅ **Consistent Behavior** - Same validation logic everywhere
- ✅ **Easy Maintenance** - Change validation rules in one place
- ✅ **Type Safety** - Structured validation rules and options
- ✅ **Automatic Error Handling** - Smart error clearing and display
- ✅ **Strategy Pattern** - Easy to extend with new validation types
- ✅ **Clean Architecture** - Separation of concerns and single responsibility

This validation system provides a robust, scalable foundation for all form validation needs in your React application! 🚀
