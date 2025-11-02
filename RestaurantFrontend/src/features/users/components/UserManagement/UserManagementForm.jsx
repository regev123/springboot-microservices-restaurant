import React from 'react';
import Input from '../../../../components/common/Input/Input';
import Select from '../../../../components/common/Select/Select';
import FormButton from '../../../../components/common/Button2/FormButton';
import SectionHeader from '../../../../components/common/SectionHeader/SectionHeader';
import GlassCard from '../../../../components/common/GlassCard/GlassCard';
import EditableEntityView from '../../../../components/common/EditableEntityView/EditableEntityView';
import FormSpinner from '../../../../components/common/Spinner/Spinner';

const UserManagementForm = ({
  formData,
  addMode,
  editingUser,
  handleInputChange,
  handleAddOrEditUser,
  handleSwitchToAddMode,
  addFormErrors,
  updateFormErrors,
  isSubmitting,
  roles,
}) => {
  return (
    <GlassCard className="mb-8">
      <div className="space-y-6">
        {/* Show which user is being edited */}
        {!addMode && editingUser && (
          <EditableEntityView
            title="Editing User"
            text={`Employee #${editingUser.id} - ${editingUser.firstName} ${editingUser.lastName} (${editingUser.email})`}
          />
        )}

        {/* Form Title */}
        <SectionHeader
          title="Register New User"
          description="Fill in the details to create a new user account"
        />

        {/* Form Grid */}
        <div
          className={`grid gap-6 grid-cols-1 ${addMode ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'}`}
        >
          {addMode && (
            <>
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required={true}
                error={addFormErrors.email}
              />
              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required={true}
                error={addFormErrors.password}
              />
            </>
          )}
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required={true}
            error={addMode ? addFormErrors.firstName : updateFormErrors.firstName}
          />
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required={true}
            error={addMode ? addFormErrors.lastName : updateFormErrors.lastName}
          />
          <Input
            label="Phone Number"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            required={true}
            error={addMode ? addFormErrors.phoneNumber : updateFormErrors.phoneNumber}
          />
          <Select
            label="Role"
            value={formData.role}
            options={roles}
            onChange={(val) => handleInputChange('role', val)}
            required={true}
            error={addMode ? addFormErrors.role : updateFormErrors.role}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-700">
          <div className="flex-1 flex justify-center">
            <FormSpinner
              show={isSubmitting}
              text={addMode ? 'Registering User...' : 'Updating User...'}
            />
          </div>
          <div className="flex justify-end gap-4">
            {!addMode && (
              <FormButton type="red" icon="cancel" text="Cancel" onClick={handleSwitchToAddMode} />
            )}
            <FormButton
              type="green"
              icon="save"
              text={addMode ? 'Register User' : 'Update User'}
              onClick={handleAddOrEditUser}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default UserManagementForm;
