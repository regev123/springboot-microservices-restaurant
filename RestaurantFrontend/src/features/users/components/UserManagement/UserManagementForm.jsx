import React from 'react';
import Input from '../../../../components/common/Input/Input';
import Select from '../../../../components/common/Select/Select';
import FormButton from '../../../../components/common/Button2/FormButton';
import SectionHeader from '../../../../components/common/SectionHeader/SectionHeader';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import EditableEntityView from '../../../../components/common/EditableEntityView/EditableEntityView';

const UserManagementForm = ({
  formData,
  roles,
  handleInputChange,
  onSubmit,
  hasError,
  getError,
  isSubmitting,
  addMode,
  editingUser,
  editFormRef,
  handleBackToAddMode,
  hasChanges,
}) => {
  // If editing, show the editing header
  if (!addMode && editingUser) {
    return (
      <div ref={editFormRef}>
        <GlassCard className="mb-8">
          {/* Show which user is being edited */}
          <EditableEntityView
            title="Editing User"
            text={`Employee #${editingUser.id} - ${editingUser.firstName} ${editingUser.lastName} (${editingUser.email})`}
          />

          <div className="space-y-6">
            {/* Form Title */}
            <SectionHeader title="Edit User" description="Update the user's information below" />

            {/* Form Grid */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required={true}
                error={hasError('firstName') ? getError('firstName') : ''}
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required={true}
                error={hasError('lastName') ? getError('lastName') : ''}
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                required={true}
                error={hasError('phoneNumber') ? getError('phoneNumber') : ''}
              />
              <Select
                label="Role"
                value={formData.role}
                options={roles}
                onChange={(val) => handleInputChange('role', val)}
                required={true}
                error={hasError('role') ? getError('role') : ''}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-slate-700">
              <FormButton type="red" icon="cancel" text="Cancel" onClick={handleBackToAddMode} />
              <FormButton
                type="green"
                icon="save"
                text="Update User"
                onClick={onSubmit}
                disabled={isSubmitting || !hasChanges}
              />
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  // Default form (for add mode)
  return (
    <GlassCard className="mb-8">
      <div className="space-y-6">
        {/* Form Title */}
        <SectionHeader
          title="Register New User"
          description="Fill in the details to create a new user account"
        />

        {/* Form Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Email"
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
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required={true}
            error={hasError('firstName') ? getError('firstName') : ''}
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required={true}
            error={hasError('lastName') ? getError('lastName') : ''}
          />
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            required={true}
            error={hasError('phoneNumber') ? getError('phoneNumber') : ''}
          />
          <Select
            label="Role"
            value={formData.role}
            options={roles}
            onChange={(val) => handleInputChange('role', val)}
            required={true}
            error={hasError('role') ? getError('role') : ''}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-slate-700">
          <FormButton
            type="green"
            icon="save"
            text="Save User"
            onClick={onSubmit}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </GlassCard>
  );
};

export default UserManagementForm;
