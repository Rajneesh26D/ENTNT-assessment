import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { worker } from './services/api';
import { seedDatabase } from './services/seed';

async function enableMocking() {
  if (import.meta.env.MODE !== 'development') {
    console.log('🌱 Production: Seeding database...');
    await seedDatabase();
    console.log('✅ Database seeded successfully!');
    return;
  }

  await worker.start({
    onUnhandledRequest: 'bypass',
  });
  console.log('🚀 MSW Started (Development)');
  
  await seedDatabase();
  console.log('🌱 Database seeded (Development)');
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
