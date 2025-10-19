import React from 'react';
import AuthLayout from '../../components/layout/AuthLayout/AuthLayout';
import GlassCard from '../../components/common/GlassCard/GlassCard';
import BrandSection from '../../components/layout/BrandSection/BrandSection';
import LoginForm from '../../features/users/components/Login/LoginForm';
import Footer from '../../components/layout/Footer/Footer';

const LoginPage = () => {
  return (
    <AuthLayout>
      <GlassCard>
        <BrandSection />
        <LoginForm />
      </GlassCard>
      <Footer />
    </AuthLayout>
  );
};

export default LoginPage;
