import React from 'react';
import Input from '../../../../components/common/Input/Input';
import Button from '../../../../components/common/Button/Button';
import NavigateLink from '../../../../components/common/NavigateLink/NavigateLink';
import FormSpinner from '../../../../components/common/Spinner/Spinner';
import useChangePasswordForm from '../../hooks/useChangePasswordForm';

const ChangePasswordForm = () => {
  const {
    formData,
    handleInputChange,
    onSubmit,
    isSubmitting,
    navigationLinks,
    hasError,
    getError,
  } = useChangePasswordForm();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">Change Password</h2>
      </div>

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        required={true}
        error={hasError('email') ? getError('email') : ''}
      />

      <Input
        label="Old Password"
        type="password"
        value={formData.oldPassword}
        onChange={(e) => handleInputChange('oldPassword', e.target.value)}
        required={true}
        error={hasError('oldPassword') ? getError('oldPassword') : ''}
      />

      <Input
        label="New Password"
        type="password"
        value={formData.newPassword}
        onChange={(e) => handleInputChange('newPassword', e.target.value)}
        required={true}
        error={hasError('newPassword') ? getError('newPassword') : ''}
      />

      <Button
        text="Change Password"
        type="submit"
        onClick={onSubmit}
        fullWidth={true}
        size="xlarge"
        disabled={isSubmitting}
      />

      <FormSpinner show={isSubmitting} text="Changing Password..." />

      <NavigateLink links={navigationLinks} />
    </div>
  );
};

export default ChangePasswordForm;
