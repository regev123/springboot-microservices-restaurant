import React from 'react';
import AuthLayout from '../../components/layout/AuthLayout/AuthLayout';
import GlassCard from '../../components/common/GlassCard/GlassCard';
import BrandSection from '../../components/layout/BrandSection/BrandSection';
import ChangePasswordForm from '../../features/users/components/ChangePassword/ChangePasswordForm';
import Footer from '../../components/layout/Footer/Footer';

const ChangePasswordPage = () => {
  return (
    <AuthLayout>
      <GlassCard>
        <BrandSection />
        <ChangePasswordForm />
      </GlassCard>
      <Footer />
    </AuthLayout>
  );
};

export default ChangePasswordPage;
