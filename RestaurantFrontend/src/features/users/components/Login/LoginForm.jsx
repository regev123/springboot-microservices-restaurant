import React from 'react';
import Input from '../../../../components/common/Input/Input';
import Button from '../../../../components/common/Button/Button';
import NavigateLink from '../../../../components/common/NavigateLink/NavigateLink';
import FormSpinner from '../../../../components/common/Spinner/Spinner';
import useLoginUserForm from '../../hooks/useLoginUserForm';

const LoginForm = () => {
  const {
    formData,
    handleInputChange,
    isSubmitting,
    onSubmit,
    navigationLinks,
    hasError,
    getError,
  } = useLoginUserForm();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Sign In</h2>
      </div>
      <Input
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        required={true}
        error={hasError('email') ? getError('email') : ''}
      />
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        required={true}
        error={hasError('password') ? getError('password') : ''}
      />
      <Button
        text="Sign In"
        type="button"
        onClick={onSubmit}
        fullWidth={true}
        size="xlarge"
        disabled={isSubmitting}
      />
      <FormSpinner show={isSubmitting} text="Signing in..." />
      <NavigateLink links={navigationLinks} />
    </div>
  );
};

export default LoginForm;
