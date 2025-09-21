import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import FormWrapper from '../components/common/FormWrapper';
import Message from '../components/common/Message';
import { changePassword } from '../store/thunks/authThunks';

const ChangePasswordPage = () => {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const dispatch = useDispatch();
  //const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.auth);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    dispatch(changePassword({ email, oldPassword, newPassword }));
  };

  return (
    <FormWrapper title="Change Password">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <Input
        label="Old Password"
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        placeholder="Enter your old password"
      />
      <Input
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter your new password"
      />
      <Button text="Change Password" type="submit" onClick={handlePasswordChange} />

      {error && <Message type="error">{error}</Message>}
      {message && <Message type="success">{message}</Message>}

      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <Link to="/">Back to Login</Link>
      </div>
    </FormWrapper>
  );
};

export default ChangePasswordPage;
