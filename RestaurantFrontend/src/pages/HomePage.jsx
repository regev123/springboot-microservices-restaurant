import React from 'react';
import PageLayout from '../components/layout/PageLayout/PageLayout';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { firstName, lastName } = useSelector((state) => state.auth.user) || {};
  return (
    <PageLayout title={`Welcome, ${firstName} ${lastName} 👋`}>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Welcome to the Restaurant Management System</h1>
        <p className="text-gray-500">This is the home page of the Restaurant Management System.</p>
      </div>
    </PageLayout>
  );
};

export default HomePage;
