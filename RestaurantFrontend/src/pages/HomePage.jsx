import React from 'react';
import PageLayout from '../components/layout/PageLayout/PageLayout';
import Card from '../components/layout/Card/Card';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { firstName, lastName } = useSelector((state) => state.auth.user) || {};
  return (
    <PageLayout title={`Welcome, ${firstName} ${lastName} 👋`}>
      <section className="home-grid">
        <Card title="Profile">
          <p>Manage your account settings and personal information.</p>
        </Card>

        <Card title="Tasks">
          <p>Track your daily activities and progress efficiently.</p>
        </Card>

        <Card title="Messages">
          <p>Stay connected with notifications and updates.</p>
        </Card>

        <Card title="Settings">
          <p>Customize your preferences and application behavior.</p>
        </Card>
      </section>
    </PageLayout>
  );
};

export default HomePage;
