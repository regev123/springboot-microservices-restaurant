import React from 'react';
import Input from '../../../../components/common/Input/Input';
import Button from '../../../../components/common/Button/Button';
import NavigateLink from '../../../../components/common/NavigateLink/NavigateLink';
import useLoginUserForm from '../../hooks/useLoginUserForm';
import FormSpinner from '../../../../components/common/Spinner/Spinner';

const LoginForm = () => {
  const { formData, errors, isSubmitting, handleInputChange, handleLogin } = useLoginUserForm();

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
        error={errors.email}
        required={true}
      />
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        error={errors.password}
        required={true}
      />
      <Button
        text="Sign In"
        type="button"
        onClick={handleLogin}
        fullWidth={true}
        size="xlarge"
        disabled={isSubmitting}
      />

      <FormSpinner show={isSubmitting} text="Logging in..." />

      <NavigateLink links={[{ to: '/change-password', text: 'Change Password' }]} />
    </div>
  );
};

export default LoginForm;
